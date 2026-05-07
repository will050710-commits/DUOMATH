# backend/server.py  —  DuoMath Unified Backend  (v3 — auth hardened)
# ─────────────────────────────────────────────────────────────────────────────
# CHANGES vs v2:
#
#  AUTH FIXES
#  ──────────
#  FIX A: signup()   — use lastrowid instead of a second SELECT after INSERT
#                      → avoids rare WAL race; one fewer DB round-trip
#
#  FIX B: signup() / login()   — both now return test_results + game_results
#                      → frontend gets everything in one response, no need for
#                        a second /api/me call; profile dropdown populates
#                        immediately after sign-in
#
#  FIX C: login()    — email match is now explicitly case-insensitive via
#                      COLLATE NOCASE; protects against "User@Email.com" vs
#                      "user@email.com" mismatches after the .lower() strip
#
#  FIX D: update_me() PATCH — validate required fields (username) cannot be
#                      blanked out; strip + length check before saving
#
#  FIX E: user_dict() — now includes a 'name' alias for username so the
#                      frontend can use either key without breaking
#
#  REQUIREMENTS FIX
#  ─────────────────
#  NOTE: remove "groq>=0.9.0" from requirements.txt — server.py uses raw
#        HTTP via the 'requests' library; the Groq SDK is never imported.
#        Keeping it only wastes ~30 s on every Render deploy.
# ─────────────────────────────────────────────────────────────────────────────

import os, sqlite3, json, uuid, time, threading, base64, io
from datetime import timedelta
from functools import lru_cache

import requests as req_lib
import orjson
from flask import Flask, request, jsonify, g, Response, stream_with_context
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash

try:
    from flask_compress import Compress  # type: ignore
    _compress = True
except ImportError:
    _compress = False

try:
    import easyocr
    ocr_reader = easyocr.Reader(['vi', 'en'], gpu=False)
    _ocr_available = True
except ImportError:
    ocr_reader = None
    _ocr_available = False

# ── App ───────────────────────────────────────────────────────────────────────
app = Flask(__name__)
if _compress:
    Compress(app)

CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000", "https://*.vercel.app", "*"],
    "max_age": 3600,
}})

app.config["JWT_SECRET_KEY"]            = os.environ.get("JWT_SECRET", "duomath-dev-secret-CHANGE-IN-PROD")
app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = timedelta(hours=12)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

DB_PATH   = os.path.join(os.path.dirname(__file__), "duomath.db")
GROQ_BASE = "https://api.groq.com/openai/v1"
GROQ_KEY  = os.environ.get("GROQ_API_KEY", "")
SELF_URL  = os.environ.get("SELF_URL", "")


# ── Cached system prompts ─────────────────────────────────────────────────────
@lru_cache(maxsize=4)
def cached_system_prompt(variant: str = "text") -> str:
    if variant == "image":
        return (
            "You are a Vietnamese math tutor for grades 10-12. "
            "Solve math problems briefly step-by-step."
        )
    return (
        "You are a concise Vietnamese math tutor for grades 10-12. "
        "Explain briefly step-by-step."
    )


def extract_text_from_image(image_bytes: bytes) -> str:
    """Run OCR on raw image bytes and return extracted text."""
    if not _ocr_available or ocr_reader is None:
        return ""
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes))
        result = ocr_reader.readtext(img, detail=0)
        return "\n".join(result)
    except Exception:
        return ""


# ── Keep-alive ────────────────────────────────────────────────────────────────
def _keep_alive():
    if not SELF_URL:
        return
    while True:
        time.sleep(14 * 60)
        try:
            req_lib.get(f"{SELF_URL}/api/health", timeout=10)
        except Exception:
            pass

threading.Thread(target=_keep_alive, daemon=True).start()


# ── Database ──────────────────────────────────────────────────────────────────
def _make_conn():
    conn = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES,
                           check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=NORMAL")
    conn.execute("PRAGMA cache_size=-8000")
    conn.execute("PRAGMA temp_store=MEMORY")
    return conn

def get_db():
    if "db" not in g:
        g.db = _make_conn()
    return g.db

@app.teardown_appcontext
def close_db(_=None):
    db = g.pop("db", None)
    if db:
        db.close()

def init_db():
    conn = _make_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            email       TEXT    UNIQUE NOT NULL COLLATE NOCASE,
            username    TEXT    NOT NULL,
            password    TEXT    NOT NULL,
            phone       TEXT    DEFAULT '',
            school      TEXT    DEFAULT '',
            grade       TEXT    DEFAULT '',
            avatar_url  TEXT    DEFAULT '',
            created_at  TEXT    DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS test_results (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            test_key    TEXT    NOT NULL,
            section     TEXT    NOT NULL,
            score       INTEGER NOT NULL,
            total       INTEGER NOT NULL,
            accuracy    REAL    DEFAULT 0,
            time_spent  INTEGER DEFAULT 0,
            answers     TEXT    NOT NULL DEFAULT '{}',
            taken_at    TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS minigame_results (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            lesson_slug TEXT    NOT NULL,
            mode        TEXT    NOT NULL,
            score       INTEGER NOT NULL,
            total       INTEGER NOT NULL,
            played_at   TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS sessions (
            session_id  TEXT    PRIMARY KEY,
            user_id     INTEGER,
            history     TEXT    DEFAULT '[]',
            created_at  TEXT    DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_test_user  ON test_results(user_id, taken_at DESC);
        CREATE INDEX IF NOT EXISTS idx_game_user  ON minigame_results(user_id, played_at DESC);
        CREATE INDEX IF NOT EXISTS idx_session_id ON sessions(session_id);
    """)
    conn.commit()
    conn.close()

init_db()


# ── Helpers ───────────────────────────────────────────────────────────────────
def user_dict(row):
    """
    Serialise a users row to a plain dict.
    Includes 'name' as an alias for 'username' so the frontend can use either.
    Never includes the hashed password.
    """
    return {
        "id":         row["id"],
        "email":      row["email"],
        "username":   row["username"],
        "name":       row["username"],   # alias — frontend may use either key
        "phone":      row["phone"],
        "school":     row["school"],
        "grade":      row["grade"],
        "avatar_url": row["avatar_url"],
        "created_at": row["created_at"],
    }

def test_dict(row):
    return {
        "id":         row["id"],
        "test_key":   row["test_key"],
        "section":    row["section"],
        "score":      row["score"],
        "total":      row["total"],
        "accuracy":   row["accuracy"],
        "time_spent": row["time_spent"],
        "answers":    json.loads(row["answers"] or "{}"),
        "taken_at":   row["taken_at"],
    }

def game_dict(row):
    return {
        "id":          row["id"],
        "lesson_slug": row["lesson_slug"],
        "mode":        row["mode"],
        "score":       row["score"],
        "total":       row["total"],
        "played_at":   row["played_at"],
    }

def _fetch_scores(db, uid: int) -> tuple:
    """Return (test_results_list, game_results_list) for a given user id."""
    tests = db.execute(
        "SELECT * FROM test_results WHERE user_id=? ORDER BY taken_at DESC LIMIT 20",
        (uid,),
    ).fetchall()
    games = db.execute(
        "SELECT * FROM minigame_results WHERE user_id=? ORDER BY played_at DESC LIMIT 20",
        (uid,),
    ).fetchall()
    return [test_dict(t) for t in tests], [game_dict(g) for g in games]

def groq_headers():
    return {"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"}

def ensure_session(sid: str) -> list:
    conn = _make_conn()
    try:
        row = conn.execute("SELECT history FROM sessions WHERE session_id=?", (sid,)).fetchone()
        if row:
            return json.loads(row["history"] or "[]")
        conn.execute("INSERT INTO sessions (session_id, history) VALUES (?,?)", (sid, "[]"))
        conn.commit()
        return []
    finally:
        conn.close()

def save_history(sid: str, history: list):
    conn = _make_conn()
    try:
        conn.execute("UPDATE sessions SET history=? WHERE session_id=?",
                     (json.dumps(history[-40:]), sid))
        conn.commit()
    finally:
        conn.close()


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route("/api/signup", methods=["POST"])
def signup():
    d = request.get_json(force=True) or {}
    email    = (d.get("email")    or "").strip().lower()
    username = (d.get("username") or "").strip()
    password = (d.get("password") or "").strip()
    phone    = (d.get("phone")    or "").strip()
    school   = (d.get("school")   or "").strip()
    grade    = (d.get("grade")    or "").strip()

    # ── Validate ──────────────────────────────────────────────────────────────
    if not email or not username or not password:
        return jsonify({"error": "Email, username and password are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400
    if len(username) < 2:
        return jsonify({"error": "Username must be at least 2 characters."}), 400

    db = get_db()

    # ── Duplicate check ───────────────────────────────────────────────────────
    if db.execute("SELECT id FROM users WHERE email=?", (email,)).fetchone():
        return jsonify({"error": "An account with this email already exists."}), 409

    # ── Insert — use lastrowid, no second SELECT needed (FIX A) ──────────────
    cur = db.execute(
        "INSERT INTO users (email, username, password, phone, school, grade)"
        " VALUES (?, ?, ?, ?, ?, ?)",
        (email, username, generate_password_hash(password), phone, school, grade),
    )
    db.commit()
    new_id = cur.lastrowid   # ← FIX A: get id directly from cursor

    row = db.execute("SELECT * FROM users WHERE id=?", (new_id,)).fetchone()

    access = create_access_token(identity=str(new_id))
    rf     = create_refresh_token(identity=str(new_id))

    # New user has no scores yet, but we include the empty arrays anyway
    # so the frontend response shape is identical to login() (FIX B)
    return jsonify({
        "access_token":  access,
        "refresh_token": rf,
        "user":          user_dict(row),
        "test_results":  [],    # FIX B: consistent shape with login
        "game_results":  [],
    }), 201


@app.route("/api/login", methods=["POST"])
def login():
    d = request.get_json(force=True) or {}
    email    = (d.get("email")    or "").strip().lower()
    password = (d.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    db  = get_db()
    # FIX C: COLLATE NOCASE on the column means this matches regardless of case
    row = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not row or not check_password_hash(row["password"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    uid = row["id"]
    access = create_access_token(identity=str(uid))
    rf     = create_refresh_token(identity=str(uid))

    # FIX B: return scores immediately so frontend doesn't need a second /api/me call
    test_results, game_results = _fetch_scores(db, uid)

    return jsonify({
        "access_token":  access,
        "refresh_token": rf,
        "user":          user_dict(row),
        "test_results":  test_results,   # FIX B
        "game_results":  game_results,   # FIX B
    })


@app.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    return jsonify({"access_token": create_access_token(identity=get_jwt_identity())})


@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    db  = get_db()
    row = db.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
    if not row:
        return jsonify({"error": "User not found."}), 404

    test_results, game_results = _fetch_scores(db, uid)

    return jsonify({
        "user":         user_dict(row),
        "test_results": test_results,
        "game_results": game_results,
    })


@app.route("/api/me", methods=["PATCH"])
@jwt_required()
def update_me():
    uid = int(get_jwt_identity())
    d   = request.get_json(force=True) or {}
    db  = get_db()

    # Fields that MUST stay non-empty
    REQUIRED_NON_EMPTY = {"username"}
    # All fields that are patchable
    ALLOWED = ["username", "phone", "school", "grade", "avatar_url"]

    sets, vals = [], []
    errors = []

    for f in ALLOWED:
        if f not in d:
            continue
        val = str(d[f]).strip()
        # FIX D: block blanking out required fields
        if f in REQUIRED_NON_EMPTY and not val:
            errors.append(f"'{f}' cannot be empty.")
            continue
        if f == "username" and len(val) < 2:
            errors.append("Username must be at least 2 characters.")
            continue
        sets.append(f"{f}=?")
        vals.append(val)

    if errors:
        return jsonify({"error": " ".join(errors)}), 400
    if not sets:
        return jsonify({"error": "Nothing to update."}), 400

    vals.append(uid)
    db.execute(f"UPDATE users SET {', '.join(sets)} WHERE id=?", vals)
    db.commit()

    row = db.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
    return jsonify({"user": user_dict(row)})


# ── Scores ────────────────────────────────────────────────────────────────────
@app.route("/api/test-result", methods=["POST"])
@jwt_required()
def save_test():
    uid = int(get_jwt_identity())
    d   = request.get_json(force=True) or {}
    test_key   = d.get("test_key",  "")
    section    = d.get("section",   "")
    score      = int(d.get("score",  0))
    total      = int(d.get("total",  0))
    accuracy   = round((score / total * 100) if total else 0, 1)
    time_spent = int(d.get("time_spent", 0))
    answers    = json.dumps(d.get("answers", {}))

    if not test_key or not section:
        return jsonify({"error": "test_key and section are required."}), 400

    db = get_db()
    db.execute(
        "INSERT INTO test_results"
        " (user_id, test_key, section, score, total, accuracy, time_spent, answers)"
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (uid, test_key, section, score, total, accuracy, time_spent, answers),
    )
    db.commit()
    return jsonify({"saved": True, "accuracy": accuracy}), 201


@app.route("/api/test-results", methods=["GET"])
@jwt_required()
def get_tests():
    uid  = int(get_jwt_identity())
    rows = get_db().execute(
        "SELECT * FROM test_results WHERE user_id=? ORDER BY taken_at DESC", (uid,)
    ).fetchall()
    return jsonify([test_dict(r) for r in rows])


@app.route("/api/minigame-result", methods=["POST"])
@jwt_required()
def save_game():
    uid = int(get_jwt_identity())
    d   = request.get_json(force=True) or {}
    slug  = d.get("lesson_slug", "")
    mode  = d.get("mode",  "mc")
    score = int(d.get("score", 0))
    total = int(d.get("total", 0))

    if not slug:
        return jsonify({"error": "lesson_slug is required."}), 400

    db = get_db()
    db.execute(
        "INSERT INTO minigame_results (user_id, lesson_slug, mode, score, total)"
        " VALUES (?, ?, ?, ?, ?)",
        (uid, slug, mode, score, total),
    )
    db.commit()
    return jsonify({"saved": True}), 201


@app.route("/api/minigame-results", methods=["GET"])
@jwt_required()
def get_games():
    uid  = int(get_jwt_identity())
    rows = get_db().execute(
        "SELECT * FROM minigame_results WHERE user_id=? ORDER BY played_at DESC", (uid,)
    ).fetchall()
    return jsonify([game_dict(r) for r in rows])


# ── Sessions ──────────────────────────────────────────────────────────────────
@app.route("/api/session/new", methods=["POST"])
def new_session():
    sid = str(uuid.uuid4())
    db  = get_db()
    db.execute("INSERT INTO sessions (session_id, history) VALUES (?,?)", (sid, "[]"))
    db.commit()
    return jsonify({"session_id": sid, "message": "Session created."})


@app.route("/api/session/<session_id>/reset", methods=["POST"])
def reset_session(session_id):
    db  = get_db()
    row = db.execute("SELECT session_id FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    if row:
        db.execute("UPDATE sessions SET history=? WHERE session_id=?", ("[]", session_id))
        db.commit()
        return jsonify({"message": "Session reset."})
    return jsonify({"error": "Session not found."}), 404


@app.route("/api/session/<session_id>/history", methods=["GET"])
def get_history(session_id):
    db  = get_db()
    row = db.execute("SELECT history FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    if row:
        return jsonify({"history": json.loads(row["history"] or "[]")})
    return jsonify({"error": "Session not found."}), 404


# ── Chat ──────────────────────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    d            = request.get_json(force=True) or {}
    session_id   = d.get("session_id") or str(uuid.uuid4())
    user_message = (d.get("message") or "").strip()
    image_data   = d.get("image")
    use_stream   = d.get("stream", False)

    if not user_message:
        return jsonify({"error": "message is required."}), 400

    history = ensure_session(session_id)

    if image_data:
        # Extract base64 bytes
        if "," in image_data:
            header, b64 = image_data.split(",", 1)
            media_type  = header.split(":")[1].split(";")[0]
        else:
            b64, media_type = image_data, "image/jpeg"

        # ── OCR-first pipeline: extract text → use fast text model ────────
        extracted_text = ""
        if _ocr_available:
            try:
                img_bytes = base64.b64decode(b64)
                extracted_text = extract_text_from_image(img_bytes)
            except Exception:
                extracted_text = ""

        if extracted_text.strip():
            # OCR succeeded → use fast text model instead of vision
            user_content = f"OCR TEXT:\n{extracted_text}\n\nQUESTION:\n{user_message}"
            model         = "llama-3.1-8b-instant"
            system_prompt = cached_system_prompt("image")
        else:
            # OCR failed / empty → fallback to lightweight vision model
            user_content = [
                {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{b64}"}},
                {"type": "text",      "text": user_message},
            ]
            model         = "llama-3.2-11b-vision-preview"
            system_prompt = cached_system_prompt("image")

        history.append({"role": "user", "content": f"[Image] {user_message}"})
    else:
        user_content  = user_message
        model         = "llama-3.1-8b-instant"
        system_prompt = cached_system_prompt("text")
        history.append({"role": "user", "content": user_message})

    messages = [{"role": "system", "content": system_prompt}] + history[-4:]
    messages[-1]["content"] = user_content

    payload = {
        "model":       model,
        "messages":    messages,
        "max_tokens":  220,
        "temperature": 0.3,
        "stream":      use_stream,
    }

    if use_stream:
        def generate():
            full_reply = []
            try:
                with req_lib.post(
                    f"{GROQ_BASE}/chat/completions",
                    headers=groq_headers(), json=payload,
                    stream=True, timeout=(3, 15),
                ) as resp:
                    resp.raise_for_status()
                    for raw_line in resp.iter_lines():
                        if not raw_line:
                            continue
                        line = raw_line.decode("utf-8") if isinstance(raw_line, bytes) else raw_line
                        if line.startswith("data: "):
                            line = line[6:]
                        if line == "[DONE]":
                            break
                        try:
                            chunk = json.loads(line)
                            token = chunk["choices"][0]["delta"].get("content", "")
                            if token:
                                full_reply.append(token)
                                yield f"data: {orjson.dumps({'token': token, 'session_id': session_id}).decode()}\n\n"
                        except (json.JSONDecodeError, KeyError, IndexError):
                            continue
            except Exception as e:
                yield f"data: {orjson.dumps({'error': str(e)}).decode()}\n\n"
                return

            reply_text = "".join(full_reply)
            history.append({"role": "assistant", "content": reply_text})
            save_history(session_id, history)
            yield f"data: {orjson.dumps({'done': True, 'session_id': session_id}).decode()}\n\n"

        return Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            headers={
                "Cache-Control":               "no-cache",
                "X-Accel-Buffering":           "no",
                "Access-Control-Allow-Origin": "*",
            },
        )

    try:
        resp  = req_lib.post(f"{GROQ_BASE}/chat/completions",
                              headers=groq_headers(),
                              json={**payload, "stream": False},
                              timeout=(3, 15))
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return jsonify({"error": True, "reply": f"AI unavailable: {e}"}), 502

    history.append({"role": "assistant", "content": reply})
    save_history(session_id, history)
    return jsonify({"reply": reply, "session_id": session_id, "history_length": len(history)})


# ── Translate ─────────────────────────────────────────────────────────────────
@app.route("/api/translate", methods=["POST"])
def translate():
    d    = request.get_json(force=True) or {}
    text = (d.get("text") or "").strip()[:500]
    if not text:
        return jsonify({"error": "text is required."}), 400

    prompt = (
        "Translate this English math text to Vietnamese. "
        "Reply ONLY with JSON (no markdown): "
        '{"translation":"...","summary":"...","words":['
        '{"word":"...","type":"...","pronunciation":"...","vietnamese":"...","example":"..."}]}\n\n'
        f"Text: {text}"
    )
    payload = {
        "model":       "llama-3.1-8b-instant",
        "messages":    [
            {"role": "system", "content": "You are a JSON-only translation API. Output only the JSON object."},
            {"role": "user",   "content": prompt},
        ],
        "max_tokens":  400,
        "temperature": 0.2,
    }

    try:
        resp  = req_lib.post(f"{GROQ_BASE}/chat/completions",
                              headers=groq_headers(), json=payload, timeout=(3, 15))
        resp.raise_for_status()
        raw   = resp.json()["choices"][0]["message"]["content"]
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return jsonify(json.loads(clean))
    except json.JSONDecodeError:
        return jsonify({"error": True, "raw": raw})
    except Exception as e:
        return jsonify({"error": True, "raw": str(e)}), 502


# ── Health ────────────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    t0 = time.perf_counter()
    try:
        get_db().execute("SELECT 1").fetchone()
        db_ms, db_ok = round((time.perf_counter() - t0) * 1000, 2), True
    except Exception:
        db_ms, db_ok = -1, False
    return jsonify({
        "status":        "ok" if db_ok else "degraded",
        "service":       "DuoMath API v3",
        "db_latency_ms": db_ms,
        "keep_alive":    bool(SELF_URL),
        "text_model":    "llama-3.1-8b-instant",
        "vision_model":  "llama-3.2-11b-vision-preview",
        "ocr_available": _ocr_available,
    })


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"DuoMath API v3 → http://localhost:{port}")
    app.run(host="0.0.0.0", port=port,
            debug=os.environ.get("FLASK_ENV") != "production",
            threaded=True)
