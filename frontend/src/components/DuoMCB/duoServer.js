// Shared server helper for DuoMCB components
const DEFAULT_BASE =
  typeof window !== "undefined" && window.__DUO_API_BASE
    ? window.__DUO_API_BASE
    : "http://localhost:5000";

function baseUrl() {
  try { return DEFAULT_BASE; } catch { return "http://localhost:5000"; }
}

export async function createSession() {
  try {
    const res = await fetch(`${baseUrl()}/api/session/new`, { method: "POST" });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    return data.session_id;
  } catch {
    return null;
  }
}

export async function chat(session_id, message, extra = {}) {
  try {
    const res = await fetch(`${baseUrl()}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, message, stream: false, ...extra }),
    });
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch {
    return { error: true, message: "server-offline" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// translateText
//
// Sends a strict prompt that forces the AI to return EXACTLY the JSON shape
// that DuoTranslate.js expects. Without this, the model returns free text or
// uses different key names (e.g. "text" instead of "translation").
// ─────────────────────────────────────────────────────────────────────────────
export async function translateText(session_id, selectedText) {
  const prompt = `You are a Vietnamese language assistant. Translate the following English text into Vietnamese and analyze it word by word.

TEXT TO TRANSLATE:
"${selectedText}"

YOU MUST respond with ONLY a valid JSON object — no markdown, no code fences, no explanation text before or after. The JSON must use EXACTLY these keys:

{
  "translation": "<full Vietnamese translation of the text>",
  "summary": "<one sentence explaining the meaning in Vietnamese context>",
  "words": [
    {
      "word": "<English word>",
      "type": "<one of: noun, verb, adj, adv, prep, conj>",
      "pronunciation": "<IPA or phonetic, e.g. /wɜːrd/>",
      "vietnamese": "<Vietnamese translation of just this word>",
      "example": "<short example sentence using this word in English>"
    }
  ]
}

Only include content words in the words array (skip articles like 'a', 'the', 'an' and short prepositions unless important). Respond with the raw JSON only.`;

  const res = await chat(session_id, prompt);

  if (res.error) {
    return { error: true, raw: "Connection failed. Make sure server.py is running." };
  }

  const raw = res.reply || res.message || res.text || "";

  if (!raw) {
    return { error: true, raw: "Server returned an empty reply. Check server.py logs." };
  }

  // Strip markdown code fences if the model wrapped the JSON anyway
  const stripped = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // Extract the first {...} block
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      error: true,
      raw: `Could not find JSON in server reply.\n\nRaw response was:\n${raw.slice(0, 400)}`,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required keys
    if (!parsed.translation) {
      return {
        error: true,
        raw: `JSON parsed but missing 'translation' key.\n\nGot keys: ${Object.keys(parsed).join(", ")}\n\nFull response:\n${JSON.stringify(parsed, null, 2).slice(0, 400)}`,
      };
    }

    return parsed;
  } catch (e) {
    return {
      error: true,
      raw: `JSON parse failed: ${e.message}\n\nRaw content:\n${jsonMatch[0].slice(0, 400)}`,
    };
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { createSession, chat, translateText };
