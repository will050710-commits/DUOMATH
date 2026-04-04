/* eslint-disable import/no-anonymous-default-export */
// frontend/src/components/DuoMCB/duoServer.js
//
// FIX: was hardcoded to "http://localhost:5000"
// NOW: reads NEXT_PUBLIC_BACKEND_URL from environment variable first,
//      falls back to localhost only for local development.
//
// ── Setup ────────────────────────────────────────────────────────────────────
// Vercel dashboard → Settings → Environment Variables → add:
//   NEXT_PUBLIC_BACKEND_URL = https://your-app.onrender.com
//
// Local .env.local → add:
//   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BACKEND_URL) ||
  (typeof window  !== "undefined" && window.__DUO_API_BASE) ||
  "http://localhost:5000";

// ── Session ───────────────────────────────────────────────────────────────────
export async function createSession() {
  try {
    const res = await fetch(`${BASE_URL}/api/session/new`, { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.session_id;
  } catch (e) {
    console.warn("[DuoMCB] createSession failed:", e.message);
    return null;
  }
}

// ── Chat (normal, non-streaming) ──────────────────────────────────────────────
export async function chat(session_id, message) {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, message, stream: false }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("[DuoMCB] chat failed:", e.message);
    return { error: true, message: "server-offline" };
  }
}

// ── Chat with image (Vision AI) ───────────────────────────────────────────────
export async function chatWithImage(session_id, message, imageBase64) {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, message, image: imageBase64, stream: false }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("[DuoMCB] chatWithImage failed:", e.message);
    return { error: true, message: "server-offline" };
  }
}

// ── Translate (DuoTranslator) ─────────────────────────────────────────────────
export async function translateText(session_id, text) {
  try {
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, text }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) return { error: true, raw: data.raw || "Translation failed" };
    return data;
  } catch (e) {
    console.warn("[DuoMCB] translateText failed:", e.message);
    return { error: true, raw: "Connection failed. Check NEXT_PUBLIC_BACKEND_URL." };
  }
}

// ── Health check ──────────────────────────────────────────────────────────────
export async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export default { createSession, chat, chatWithImage, translateText, checkHealth };
