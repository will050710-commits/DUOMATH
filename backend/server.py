# backend/server.py
# ─────────────────────────────────────────────────────────────────────────────
# DuoMath & DuoMCB  ·  Unified Backend
# Handles: Auth (JWT), test/game scores, unified AI chatbot & Vision logic
#
# Deploy to Render:
#   Build command : pip install -r requirements.txt
#   Start command : gunicorn server:app
#   Env vars to set in Render dashboard:
#     JWT_SECRET   → any long random string (e.g. openssl rand -hex 32)
#     GROQ_API_KEY → your Groq API key
# ─────────────────────────────────────────────────────────────────────────────

import os, sqlite3, json, requests, uuid # pyright: ignore[reportMissingModuleSource]
from datetime import timedelta
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_jwt_extended import ( # pyright: ignore[reportMissingImports]
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# ── CORS ─────────────────────────────────────────────────────────────────────
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://localhost:3000",
        "https://*.vercel.app",
        "*"
    ]
}})

# ── JWT Config ───────────────────────────────────────────────────────────────
app.config["JWT_SECRET_KEY"]            = os.environ.get("JWT_SECRET", "duomath-dev-secret-CHANGE-IN-PROD")
app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = timedelta(hours=12)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

# ── DB & API Config ──────────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "duomath.db")
GROQ_BASE = "https://api.groq.com/openai/v1"
GROQ_KEY  = os.environ.get("GROQ_API_KEY", "")

# ─────────────────────────────────────────────────────────────────────────────
#  DATABASE
# ─────────────────────────────────────────────────────────────────────────────

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(_=None):
    db = g.pop("db", None)
    if db: db.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            email       TEXT    UNIQUE NOT NULL,
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
    """)
    conn.commit()
    conn.close()

init_db()

# ─────────────────────────────────────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def user_dict(row):
    return {
        "id": row["id"], "email": row["email"], "username": row["username"],
        "phone": row["phone"], "school": row["school"], "grade": row["grade"],
        "avatar_url": row["avatar_url"], "created_at": row["created_at"],
    }

def test_dict(row):
    return {
        "id": row["id"], "test_key": row["test_key"], "section": row["section"],
        "score": row["score"], "total": row["total"],
        "accuracy": row["accuracy"], "time_spent": row["time_spent"],
        "answers": json.loads(row["answers"] or "{}"),
        "taken_at": row["taken_at"],
    }

def game_dict(row):
    return {
        "id": row["id"], "lesson_slug": row["lesson_slug"], "mode": row["mode"],
        "score": row["score"], "total": row["total"], "played_at": row["played_at"],
    }

# ─────────────────────────────────────────────────────────────────────────────
#  AUTH ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/api/signup", methods=["POST"])
def signup():
    d        = request.get_json(force=True) or {}
    email    = (d.get("email")    or "").strip().lower()
    username = (d.get("username") or "").strip()
    password = (d.get("password") or "").strip()
    phone    = (d.get("phone")    or "").strip()
    school   = (d.get("school")   or "").strip()
    grade    = (d.get("grade")    or "").strip()

    if not email or not username or not password:
        return jsonify({"error": "Email, username and password are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    db = get_db()
    if db.execute("SELECT id FROM users WHERE email=?", (email,)).fetchone():
        return jsonify({"error": "An account with this email already exists."}), 409

    db.execute(
        "INSERT INTO users (email,username,password,phone,school,grade) VALUES (?,?,?,?,?,?)",
        (email, username, generate_password_hash(password), phone, school, grade)
    )
    db.commit()
    row    = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    access = create_access_token(identity=str(row["id"]))
    rf     = create_refresh_token(identity=str(row["id"]))
    return jsonify({"access_token": access, "refresh_token": rf, "user": user_dict(row)}), 201

@app.route("/api/login", methods=["POST"])
def login():
    d        = request.get_json(force=True) or {}
    email    = (d.get("email")    or "").strip().lower()
    password = (d.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    db  = get_db()
    row = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not row or not check_password_hash(row["password"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    access = create_access_token(identity=str(row["id"]))
    rf     = create_refresh_token(identity=str(row["id"]))
    return jsonify({"access_token": access, "refresh_token": rf, "user": user_dict(row)})

@app.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    uid = get_jwt_identity()
    return jsonify({"access_token": create_access_token(identity=uid)})

@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    db  = get_db()
    row = db.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
    if not row:
        return jsonify({"error": "User not found."}), 404

    tests = db.execute("SELECT * FROM test_results WHERE user_id=? ORDER BY taken_at DESC LIMIT 20", (uid,)).fetchall()
    games = db.execute("SELECT * FROM minigame_results WHERE user_id=? ORDER BY played_at DESC LIMIT 20", (uid,)).fetchall()

    return jsonify({
        "user": user_dict(row),
        "test_results": [test_dict(t) for t in tests],
        "game_results": [game_dict(g) for g in games],
    })

@app.route("/api/me", methods=["PATCH"])
@jwt_required()
def update_me():
    uid = int(get_jwt_identity())
    d   = request.get_json(force=True) or {}
    db  = get_db()

    allowed = ["username", "phone", "school", "grade", "avatar_url"]
    sets, vals = [], []
    for f in allowed:
        if f in d:
            sets.append(f"{f}=?")
            vals.append(str(d[f]).strip())
    if not sets:
        return jsonify({"error": "Nothing to update."}), 400

    vals.append(uid)
    db.execute(f"UPDATE users SET {','.join(sets)} WHERE id=?", vals)
    db.commit()
    row = db.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
    return jsonify({"user": user_dict(row)})

# ─────────────────────────────────────────────────────────────────────────────
#  TEST-SCORE & MINI-GAME ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/api/test-result", methods=["POST"])
@jwt_required()
def save_test():
    uid = int(get_jwt_identity())
    d   = request.get_json(force=True) or {}
    test_key, section = d.get("test_key", ""), d.get("section", "")
    score, total = int(d.get("score", 0)), int(d.get("total", 0))
    accuracy = round((score / total * 100) if total else 0, 1)
    time_spent, answers = int(d.get("time_spent", 0)), json.dumps(d.get("answers", {}))

    if not test_key or not section: return jsonify({"error": "test_key and section are required."}), 400

    db = get_db()
    db.execute(
        "INSERT INTO test_results (user_id,test_key,section,score,total,accuracy,time_spent,answers) VALUES (?,?,?,?,?,?,?,?)",
        (uid, test_key, section, score, total, accuracy, time_spent, answers)
    )
    db.commit()
    return jsonify({"saved": True, "accuracy": accuracy}), 201

@app.route("/api/test-results", methods=["GET"])
@jwt_required()
def get_tests():
    uid = int(get_jwt_identity())
    rows = get_db().execute("SELECT * FROM test_results WHERE user_id=? ORDER BY taken_at DESC", (uid,)).fetchall()
    return jsonify([test_dict(r) for r in rows])

@app.route("/api/minigame-result", methods=["POST"])
@jwt_required()
def save_game():
    uid = int(get_jwt_identity())
    d   = request.get_json(force=True) or {}
    slug, mode = d.get("lesson_slug", ""), d.get("mode", "mc")
    score, total = int(d.get("score", 0)), int(d.get("total", 0))

    if not slug: return jsonify({"error": "lesson_slug is required."}), 400

    db = get_db()
    db.execute("INSERT INTO minigame_results (user_id,lesson_slug,mode,score,total) VALUES (?,?,?,?,?)", (uid, slug, mode, score, total))
    db.commit()
    return jsonify({"saved": True}), 201

@app.route("/api/minigame-results", methods=["GET"])
@jwt_required()
def get_games():
    uid = int(get_jwt_identity())
    rows = get_db().execute("SELECT * FROM minigame_results WHERE user_id=? ORDER BY played_at DESC", (uid,)).fetchall()
    return jsonify([game_dict(r) for r in rows])


# ─────────────────────────────────────────────────────────────────────────────
#  UNIFIED CHATBOT SESSION ROUTES 
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/api/session/new", methods=["POST"])
def new_session():
    sid = str(uuid.uuid4())
    db  = get_db()
    db.execute("INSERT INTO sessions (session_id, history) VALUES (?,?)", (sid, "[]"))
    db.commit()
    return jsonify({"session_id": sid, "message": "Session created."})

@app.route("/api/session/<session_id>/reset", methods=["POST"])
def reset_session(session_id):
    db = get_db()
    row = db.execute("SELECT * FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    if row:
        db.execute("UPDATE sessions SET history=? WHERE session_id=?", ("[]", session_id))
        db.commit()
        return jsonify({"message": "Session reset."})
    return jsonify({"error": "Session not found."}), 404

@app.route("/api/session/<session_id>/history", methods=["GET"])
def get_history(session_id):
    db = get_db()
    row = db.execute("SELECT * FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    if row:
        return jsonify({"history": json.loads(row["history"] or "[]")})
    return jsonify({"error": "Session not found."}), 404

@app.route("/api/chat", methods=["POST"])
def chat():
    """Text-only chat using the Socratic tutor system prompt."""
    d          = request.get_json(force=True) or {}
    session_id = d.get("session_id", "")
    message    = d.get("message", "").strip()

    if not session_id or not message:
        return jsonify({"error": "session_id and message are required."}), 400

    db  = get_db()
    row = db.execute("SELECT * FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    if not row:
        return jsonify({"error": "Invalid session."}), 404

    history = json.loads(row["history"] or "[]")
    history.append({"role": "user", "content": message})

    system = (
        "You are DuoMCB, a bilingual (Vietnamese-English) math tutor for Vietnamese Grade 10-12 students. "
        "Always reply in the same language the student used. "
        "Use the Socratic method: guide with questions rather than giving the full answer immediately. "
        "When showing formulas, use plain-text notation like x^2, sqrt(x), etc. "
        "Be encouraging and concise."
    )

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "system", "content": system}] + history[-20:],
        "max_tokens": 1024,
        "temperature": 0.7,
    }

    try:
        resp = requests.post(f"{GROQ_BASE}/chat/completions", headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"}, json=payload, timeout=30)
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return jsonify({"error": True, "reply": f"AI unavailable: {str(e)}"}), 502

    history.append({"role": "assistant", "content": reply})
    db.execute("UPDATE sessions SET history=? WHERE session_id=?", (json.dumps(history[-40:]), session_id))
    db.commit()

    return jsonify({"reply": reply, "session_id": session_id, "history_length": len(history)})

@app.route("/api/chat-image", methods=["POST"])
def chat_image():
    """Image + Text chat using Llama 4 Scout Vision prompt."""
    d = request.get_json(force=True) or {}
    session_id = d.get("session_id", "")
    user_message = d.get("message", "").strip()
    image_data = d.get("image", "") 

    if not session_id or not user_message or not image_data:
        return jsonify({"error": "session_id, message, and image are required."}), 400

    db  = get_db()
    row = db.execute("SELECT * FROM sessions WHERE session_id=?", (session_id,)).fetchone()
    if not row:
        return jsonify({"error": "Invalid session."}), 404
    history = json.loads(row["history"] or "[]")

    if "," in image_data:
        header, b64_content = image_data.split(",", 1)
        media_type = header.split(":")[1].split(";")[0]
    else:
        b64_content = image_data
        media_type = "image/jpeg"

    user_msg_content = [
        {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{b64_content}"}},
        {"type": "text", "text": user_message}
    ]
    
    # We save a text representation of the image upload to history to save DB space
    history.append({"role": "user", "content": f"[Image uploaded] {user_message}"})

    system = (
        "You are DuoMCB, a bilingual (English & Vietnamese) AI tutor for high school students. "
        "When given an image of a math or science problem, analyze it carefully and respond clearly. "
        "Use step-by-step explanations. Detect the language of the user's request and reply accordingly."
    )

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user_msg_content}],
        "max_tokens": 2048,
    }

    try:
        resp = requests.post(f"{GROQ_BASE}/chat/completions", headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"}, json=payload, timeout=30)
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return jsonify({"error": f"Image analysis failed: {str(e)}"}), 502

    history.append({"role": "assistant", "content": reply})
    db.execute("UPDATE sessions SET history=? WHERE session_id=?", (json.dumps(history[-40:]), session_id))
    db.commit()

    return jsonify({"session_id": session_id, "reply": reply})

@app.route("/api/translate", methods=["POST"])
def translate():
    """Lightweight translation endpoint used by DuoTranslator"""
    d          = request.get_json(force=True) or {}
    session_id = d.get("session_id", "")
    text       = d.get("text", "")

    if not text: return jsonify({"error": "text is required."}), 400

    prompt = (
        f'Translate the following English math text to Vietnamese and analyse it. '
        f'Reply ONLY with valid JSON (no markdown fences) in this exact format:\n'
        f'{{"translation":"...","summary":"...","words":[{{"word":"...","type":"...","pronunciation":"...","vietnamese":"...","example":"..."}}]}}\n\n'
        f'Text to translate: {text}'
    )

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a precise JSON-only translation API. Never output anything except the JSON object requested."},
            {"role": "user",   "content": prompt},
        ],
        "max_tokens": 800,
        "temperature": 0.3,
    }

    try:
        resp = requests.post(f"{GROQ_BASE}/chat/completions", headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"}, json=payload, timeout=20)
        resp.raise_for_status()
        raw = resp.json()["choices"][0]["message"]["content"]
        clean = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        return jsonify(json.loads(clean))
    except json.JSONDecodeError:
        return jsonify({"error": True, "raw": raw if "raw" in dir() else "parse error"})
    except Exception as e:
        return jsonify({"error": True, "raw": str(e)}), 502

# ─────────────────────────────────────────────────────────────────────────────
#  HEALTH
# ─────────────────────────────────────────────────────────────────────────────

@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok", 
        "service": "DuoMath Unified API", 
        "text_model": "llama-3.3-70b-versatile", 
        "vision_model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "provider": "Groq"
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"DuoMath Unified Server running at http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") != "production")