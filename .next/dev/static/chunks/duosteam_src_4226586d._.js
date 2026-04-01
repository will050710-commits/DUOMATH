(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "avatar": "DuoMCBSidebar-module__DUCzaG__avatar",
  "backdrop": "DuoMCBSidebar-module__DUCzaG__backdrop",
  "botBubble": "DuoMCBSidebar-module__DUCzaG__botBubble",
  "botRow": "DuoMCBSidebar-module__DUCzaG__botRow",
  "bounce": "DuoMCBSidebar-module__DUCzaG__bounce",
  "bubble": "DuoMCBSidebar-module__DUCzaG__bubble",
  "emptyIcon": "DuoMCBSidebar-module__DUCzaG__emptyIcon",
  "emptyState": "DuoMCBSidebar-module__DUCzaG__emptyState",
  "fab": "DuoMCBSidebar-module__DUCzaG__fab",
  "fabHide": "DuoMCBSidebar-module__DUCzaG__fabHide",
  "fabIcon": "DuoMCBSidebar-module__DUCzaG__fabIcon",
  "fadeIn": "DuoMCBSidebar-module__DUCzaG__fadeIn",
  "fadeUp": "DuoMCBSidebar-module__DUCzaG__fadeUp",
  "headerActions": "DuoMCBSidebar-module__DUCzaG__headerActions",
  "iconBtn": "DuoMCBSidebar-module__DUCzaG__iconBtn",
  "input": "DuoMCBSidebar-module__DUCzaG__input",
  "inputArea": "DuoMCBSidebar-module__DUCzaG__inputArea",
  "messages": "DuoMCBSidebar-module__DUCzaG__messages",
  "msgRow": "DuoMCBSidebar-module__DUCzaG__msgRow",
  "panel": "DuoMCBSidebar-module__DUCzaG__panel",
  "panelHeader": "DuoMCBSidebar-module__DUCzaG__panelHeader",
  "panelName": "DuoMCBSidebar-module__DUCzaG__panelName",
  "panelOpen": "DuoMCBSidebar-module__DUCzaG__panelOpen",
  "panelSub": "DuoMCBSidebar-module__DUCzaG__panelSub",
  "panelTitle": "DuoMCBSidebar-module__DUCzaG__panelTitle",
  "sendActive": "DuoMCBSidebar-module__DUCzaG__sendActive",
  "sendBtn": "DuoMCBSidebar-module__DUCzaG__sendBtn",
  "typing": "DuoMCBSidebar-module__DUCzaG__typing",
  "userBubble": "DuoMCBSidebar-module__DUCzaG__userBubble",
  "userRow": "DuoMCBSidebar-module__DUCzaG__userRow",
});
}),
"[project]/duosteam/src/components/DuoMCB/duoServer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chat",
    ()=>chat,
    "createSession",
    ()=>createSession,
    "default",
    ()=>__TURBOPACK__default__export__,
    "translateText",
    ()=>translateText
]);
// Shared server helper for DuoMCB components
const DEFAULT_BASE = ("TURBOPACK compile-time value", "object") !== "undefined" && window.__DUO_API_BASE ? window.__DUO_API_BASE : "http://localhost:5000";
function baseUrl() {
    try {
        return DEFAULT_BASE;
    } catch  {
        return "http://localhost:5000";
    }
}
async function createSession() {
    try {
        const res = await fetch(`${baseUrl()}/api/session/new`, {
            method: "POST"
        });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        return data.session_id;
    } catch  {
        return null;
    }
}
async function chat(session_id, message) {
    try {
        const res = await fetch(`${baseUrl()}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id,
                message
            })
        });
        if (!res.ok) throw new Error("bad response");
        return await res.json();
    } catch  {
        return {
            error: true,
            message: "server-offline"
        };
    }
}
async function translateText(session_id, selectedText) {
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
        return {
            error: true,
            raw: "Connection failed. Make sure server.py is running."
        };
    }
    const raw = res.reply || res.message || res.text || "";
    if (!raw) {
        return {
            error: true,
            raw: "Server returned an empty reply. Check server.py logs."
        };
    }
    // Strip markdown code fences if the model wrapped the JSON anyway
    const stripped = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    // Extract the first {...} block
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return {
            error: true,
            raw: `Could not find JSON in server reply.\n\nRaw response was:\n${raw.slice(0, 400)}`
        };
    }
    try {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate required keys
        if (!parsed.translation) {
            return {
                error: true,
                raw: `JSON parsed but missing 'translation' key.\n\nGot keys: ${Object.keys(parsed).join(", ")}\n\nFull response:\n${JSON.stringify(parsed, null, 2).slice(0, 400)}`
            };
        }
        return parsed;
    } catch (e) {
        return {
            error: true,
            raw: `JSON parse failed: ${e.message}\n\nRaw content:\n${jsonMatch[0].slice(0, 400)}`
        };
    }
}
const __TURBOPACK__default__export__ = {
    createSession,
    chat,
    translateText
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DuoMCBSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/duoServer.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function DuoMCBSidebar() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DuoMCBSidebar.useEffect": ()=>{
            initSession();
        }
    }["DuoMCBSidebar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DuoMCBSidebar.useEffect": ()=>{
            bottomRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["DuoMCBSidebar.useEffect"], [
        messages,
        loading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DuoMCBSidebar.useEffect": ()=>{
            if (isOpen) setTimeout({
                "DuoMCBSidebar.useEffect": ()=>inputRef.current?.focus()
            }["DuoMCBSidebar.useEffect"], 350);
        }
    }["DuoMCBSidebar.useEffect"], [
        isOpen
    ]);
    async function initSession() {
        const sid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSession"])();
        if (sid) setSessionId(sid);
        else setSessionId("offline-" + Date.now());
    }
    async function sendMessage() {
        const msg = input.trim();
        if (!msg || loading) return;
        setInput("");
        setMessages((p)=>[
                ...p,
                {
                    role: "user",
                    content: msg,
                    id: Date.now()
                }
            ]);
        setLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chat"])(sessionId, msg);
            if (data.error) throw new Error("server-offline");
            setMessages((p_1)=>[
                    ...p_1,
                    {
                        role: "assistant",
                        content: data.reply,
                        id: Date.now() + 1
                    }
                ]);
        } catch  {
            setMessages((p_0)=>[
                    ...p_0,
                    {
                        role: "assistant",
                        content: "⚠️ Server offline. Run `python server.py`.",
                        id: Date.now() + 1
                    }
                ]);
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fab} ${isOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fabHide : ""}`,
                onClick: ()=>setIsOpen(true),
                title: "Open DuoMCB",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fabIcon,
                        children: "🎓"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fabLabel,
                        children: "DuoMCB"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backdrop,
                onClick: ()=>setIsOpen(false)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                lineNumber: 74,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panel} ${isOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panelOpen : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panelHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panelTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🎓"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panelName,
                                                children: "DuoMCB"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 83,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panelSub,
                                                children: "AI Tutor · EN & VI"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 84,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerActions,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].iconBtn,
                                        onClick: ()=>{
                                            setMessages([]);
                                            initSession();
                                        },
                                        title: "New chat",
                                        children: "✏️"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].iconBtn,
                                        onClick: ()=>setIsOpen(false),
                                        title: "Close",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].messages,
                        children: [
                            messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].emptyState,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].emptyIcon,
                                        children: "🎓"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "Ask me anything in",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 100,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "English"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 100,
                                                columnNumber: 42
                                            }, this),
                                            " or ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Tiếng Việt"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 100,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 98,
                                columnNumber: 37
                            }, this),
                            messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].msgRow} ${m.role === "user" ? __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].userRow : __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].botRow}`,
                                    children: [
                                        m.role === "assistant" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].avatar,
                                            children: "🎓"
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                            lineNumber: 103,
                                            columnNumber: 42
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bubble} ${m.role === "user" ? __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].userBubble : __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].botBubble}`,
                                            children: m.content
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, m.id, true, {
                                    fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                    lineNumber: 102,
                                    columnNumber: 30
                                }, this)),
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].msgRow} ${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].botRow}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].avatar,
                                        children: "🎓"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 109,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bubble} ${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].botBubble} ${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].typing}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 111,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 111,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                                lineNumber: 111,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 108,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: bottomRef
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inputArea,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: inputRef,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].input,
                                placeholder: "Type a question...",
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                onKeyDown: (e_0)=>e_0.key === "Enter" && sendMessage()
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sendBtn} ${input.trim() && !loading ? __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sendActive : ""}`,
                                onClick: sendMessage,
                                disabled: !input.trim() || loading,
                                children: "➤"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DuoMCBSidebar, "2Z8DHgIL6nohjQ06xsJ8uHJpOJ0=");
_c = DuoMCBSidebar;
var _c;
__turbopack_context__.k.register(_c, "DuoMCBSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/utils/testTimer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTestSession",
    ()=>clearTestSession,
    "formatTime",
    ()=>formatTime,
    "getRemainingTime",
    ()=>getRemainingTime,
    "getTimeSpent",
    ()=>getTimeSpent,
    "resetTimer",
    ()=>resetTimer,
    "startTimer",
    ()=>startTimer
]);
function startTimer(testKey, minutes = 60) {
    const startKey = `start-${testKey}`;
    const endKey = `end-${testKey}`;
    if (!localStorage.getItem(endKey)) {
        const start = Date.now();
        const end = start + minutes * 60 * 1000;
        localStorage.setItem(startKey, start);
        localStorage.setItem(endKey, end);
    }
}
function getRemainingTime(testKey) {
    const end = localStorage.getItem(`end-${testKey}`);
    if (!end) return 0;
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
}
function getTimeSpent(testKey) {
    const start = localStorage.getItem(`start-${testKey}`);
    if (!start) return 0;
    return Math.floor((Date.now() - start) / 1000);
}
function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}
function resetTimer(testKey) {
    localStorage.removeItem(`start-${testKey}`);
    localStorage.removeItem(`end-${testKey}`);
}
function clearTestSession(testKey) {
    localStorage.removeItem(`start-${testKey}`);
    localStorage.removeItem(`end-${testKey}`);
    localStorage.removeItem(`${testKey}_section1`);
    localStorage.removeItem(`${testKey}_section2`);
    localStorage.removeItem(`${testKey}_section3`);
    // backward compatibility keys used by older pages
    localStorage.removeItem("readingTest_section1");
    localStorage.removeItem("readingTest_section2");
    localStorage.removeItem("readingTest_section3");
    localStorage.removeItem("readingTest_result");
    localStorage.removeItem("timeSpent");
    localStorage.removeItem("lastTimeSpent");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/components/trangchu/TrangChuForm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TrangChuForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/styled-jsx@5.1.6_@babel+core@7.29.0_react@19.2.3/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$HeroProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/HeroProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$5TAKXEBY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_default__as__Accordion$3e$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/@heroui+accordion@2.2.29_@h_9795789ef015c964c3ae751d47eed52b/node_modules/@heroui/accordion/dist/chunk-5TAKXEBY.mjs [app-client] (ecmascript) <export accordion_default as Accordion>");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$HAJUSXOG$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_item_base_default__as__AccordionItem$3e$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/@heroui+accordion@2.2.29_@h_9795789ef015c964c3ae751d47eed52b/node_modules/@heroui/accordion/dist/chunk-HAJUSXOG.mjs [app-client] (ecmascript) <export accordion_item_base_default as AccordionItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$avatar$40$2$2e$2$2e$26_$40$hero_f79fd9008fbb09a5a58eab4522cc88a0$2f$node_modules$2f40$heroui$2f$avatar$2f$dist$2f$chunk$2d$CV4BWJDJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__avatar_default__as__Avatar$3e$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/@heroui+avatar@2.2.26_@hero_f79fd9008fbb09a5a58eab4522cc88a0/node_modules/@heroui/avatar/dist/chunk-CV4BWJDJ.mjs [app-client] (ecmascript) <export avatar_default as Avatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/DuoMCBSidebar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/testTimer.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable jsx-a11y/alt-text */ /* eslint-disable @next/next/no-img-element */ "use client";
;
;
;
;
;
;
;
;
;
function TrangChuForm() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(88);
    if ($[0] !== "16c2504d280a2b4fff129734f1bb42fe637dc3ece302bed1d42d88f4533389d6") {
        for(let $i = 0; $i < 88; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "16c2504d280a2b4fff129734f1bb42fe637dc3ece302bed1d42d88f4533389d6";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFlyer, setShowFlyer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [content] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("\uD83D\uDCE7Gmail: will050710gmail.com\n");
    const [content2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("\u260E\uFE0FPhone: +84 336 290 219");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("\uD83D\uDCCDAddress: Thpt Nguy\u1EC5n Ch\xED Thanh");
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [
            "\uD83D\uDCE7Gmail: will050710gmail.com",
            "\u260E\uFE0FPhone: +84 336 290 219",
            "\uD83D\uDCCDAddress: Thpt Nguy\u1EC5n Ch\xED Thanh"
        ];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const defaultContents = t0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultContents);
    const flyerSteps = [
        {
            icon: "\uD83D\uDCD6",
            title: "Bilingual Lessons",
            color: "#0B4F5C",
            bg: "#e8f4f6",
            steps: [
                "Go to \"H\u1ECDc to\xE1n\" \u2192 pick any chapter (Chapters I \u2013 X).",
                "Toggle \uD83C\uDDFB\uD83C\uDDF3 / \uD83C\uDDEC\uD83C\uDDE7 to switch the entire lesson between Vietnamese and English instantly \u2014 no page reload.",
                "Follow the 5-part structure: Warm-up \u2192 Theory cards \u2192 Practice (show/hide answers) \u2192 Mini-game."
            ]
        },
        {
            icon: "\uD83E\uDD16",
            title: "DuoMCB \u2014 AI Chatbot",
            color: "#1a5276",
            bg: "#eaf4fb",
            steps: [
                "Click the floating chat bubble (bottom-right corner of any page).",
                "Type your math question in Vietnamese or English \u2014 AI replies in both languages.",
                "Choose \"Hint\" for step-by-step guidance, or \"Answer\" for a full worked solution.",
                "Send a photo of a handwritten problem \u2014 Vision AI will read and solve it."
            ]
        },
        {
            icon: "\uD83D\uDD0D",
            title: "DuoTranslator",
            color: "#1e8449",
            bg: "#eafaf1",
            steps: [
                "Highlight any English word or phrase on a lesson page.",
                "A panel slides up automatically within 1\u20132 seconds.",
                "Read the Vietnamese translation, plain-language summary, and word-by-word breakdown with IPA pronunciation."
            ]
        },
        {
            icon: "\uD83C\uDFAE",
            title: "Mini-Games",
            color: "#7d3c98",
            bg: "#f5eef8",
            steps: [
                "Scroll to the bottom of any lesson to find the Mini-game section.",
                "Pick a mode: \uD83E\uDDE9 Multiple Choice (5 Q) \xB7 \uD83C\uDCCF True / False (5 cards) \xB7 \u270D\uFE0F Fill in Blank (3 Q).",
                "After finishing, check your ResultSummary \u2014 each question shows the correct answer and an explanation.",
                "Hit \uD83D\uDD04 Play Again to retry as many times as you like."
            ]
        },
        {
            icon: "\uD83D\uDCDD",
            title: "Bilingual Tests",
            color: "#922b21",
            bg: "#fdf2f2",
            steps: [
                "From the home page, click any Test card (Test 1 / Test 2).",
                "Section 1 \u2014 SAT Reading (Multiple Choice) \xB7 Section 2 \u2014 IELTS True/False/NG \xB7 Section 3 \u2014 Grade 10 Short-answer Math.",
                "All 3 sections share one 60-minute countdown; your answers auto-save when you switch sections.",
                "Click 'N\u1ED9p b\xE0i' on Section 3 to submit and see your score."
            ]
        }
    ];
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_TrangChuFormUseEffect, t1);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_TrangChuFormUseEffect2, t2);
    let t3;
    let t4;
    if ($[4] !== showFlyer) {
        t3 = ({
            "TrangChuForm[useEffect()]": ()=>{
                if (!showFlyer) {
                    return;
                }
                const handler_0 = {
                    "TrangChuForm[useEffect() > handler_0]": (e)=>{
                        if (!e.target.closest("[data-flyer-root]")) {
                            setShowFlyer(false);
                        }
                    }
                }["TrangChuForm[useEffect() > handler_0]"];
                document.addEventListener("mousedown", handler_0);
                return ()=>document.removeEventListener("mousedown", handler_0);
            }
        })["TrangChuForm[useEffect()]"];
        t4 = [
            showFlyer
        ];
        $[4] = showFlyer;
        $[5] = t3;
        $[6] = t4;
    } else {
        t3 = $[5];
        t4 = $[6];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    let t6;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            width: "100%",
            background: "#ffffff",
            display: "flex",
            justifyContent: "center"
        };
        t6 = {
            width: "1200px",
            maxWidth: "95%",
            color: "black"
        };
        $[7] = t5;
        $[8] = t6;
    } else {
        t5 = $[7];
        t6 = $[8];
    }
    const t7 = "reveal";
    const t8 = true;
    let t10;
    let t11;
    let t9;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 20px",
            position: "relative",
            zIndex: 300,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            background: "linear-gradient(135deg, #00d8fe, #13b0ff)",
            color: "white"
        };
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            },
            children: "DUOSTEAM"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        t11 = {
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 16,
            position: "relative",
            zIndex: 300
        };
        $[9] = t10;
        $[10] = t11;
        $[11] = t9;
    } else {
        t10 = $[9];
        t11 = $[10];
        t9 = $[11];
    }
    let t12;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/DuoMCB",
            style: {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 12px",
                borderRadius: 8,
                background: "white"
            },
            children: "Chatbot ›"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 171,
            columnNumber: 11
        }, this);
        $[12] = t12;
    } else {
        t12 = $[12];
    }
    const t13 = true;
    let t14;
    let t15;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = {
            position: "relative"
        };
        t15 = ({
            "TrangChuForm[<button>.onClick]": ()=>setShowFlyer(_TrangChuFormButtonOnClickSetShowFlyer)
        })["TrangChuForm[<button>.onClick]"];
        $[13] = t14;
        $[14] = t15;
    } else {
        t14 = $[13];
        t15 = $[14];
    }
    const t16 = showFlyer ? "white" : "black";
    const t17 = showFlyer ? "#0B4F5C" : "white";
    let t18;
    if ($[15] !== t16 || $[16] !== t17) {
        t18 = {
            color: t16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "12px 14px",
            borderRadius: 8,
            background: t17,
            border: "none",
            fontSize: 15,
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap"
        };
        $[15] = t16;
        $[16] = t17;
        $[17] = t18;
    } else {
        t18 = $[17];
    }
    const t19 = showFlyer ? "\u25B2" : "\u25BC";
    let t20;
    if ($[18] !== t18 || $[19] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t15,
            style: t18,
            children: [
                "📚 Hướng dẫn ",
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 228,
            columnNumber: 11
        }, this);
        $[18] = t18;
        $[19] = t19;
        $[20] = t20;
    } else {
        t20 = $[20];
    }
    const t21 = showFlyer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "absolute",
            top: "calc(100% + 14px)",
            right: 0,
            width: 520,
            maxHeight: "80vh",
            overflowY: "auto",
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            zIndex: 1000,
            padding: "22px 22px 18px",
            border: "1.5px solid #d5eef3"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "linear-gradient(135deg, #0B4F5C 0%, #1a9ab5 100%)",
                    borderRadius: 10,
                    padding: "16px 20px",
                    marginBottom: 16,
                    color: "white",
                    textAlign: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 20,
                            fontWeight: 800,
                            marginBottom: 3,
                            letterSpacing: 0.3
                        },
                        children: "🎓 DuoMath — Quick Start Guide"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 255,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            opacity: 0.82,
                            letterSpacing: 0.2
                        },
                        children: "Bilingual Math · AI Chatbot · Interactive Mini-Games · Bilingual Tests"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 260,
                        columnNumber: 46
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 248,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                },
                children: flyerSteps.map(_TrangChuFormFlyerStepsMap)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 264,
                columnNumber: 92
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 12,
                    padding: "11px 14px",
                    background: "#fffbea",
                    borderRadius: 8,
                    border: "1px solid #f3d23e",
                    fontSize: 12,
                    color: "#7a6200",
                    lineHeight: 1.65,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 15,
                            flexShrink: 0
                        },
                        children: "💡"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 280,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Pro tip:"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                lineNumber: 283,
                                columnNumber: 25
                            }, this),
                            " Open a lesson → read in Vietnamese first → flip to English → finish with the Mini-game. That 3-step loop is the fastest way to lock in bilingual math vocabulary."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 283,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 268,
                columnNumber: 58
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 10,
                    marginTop: 14
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/cacbailam",
                        style: {
                            flex: 1,
                            textDecoration: "none"
                        },
                        onClick: {
                            "TrangChuForm[<Link>.onClick]": ()=>setShowFlyer(false)
                        }["TrangChuForm[<Link>.onClick]"],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "#0B4F5C",
                                color: "white",
                                borderRadius: 8,
                                padding: "10px 0",
                                textAlign: "center",
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                                transition: "opacity 0.15s"
                            },
                            children: "📖 Bắt đầu học"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 292,
                            columnNumber: 42
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 287,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/DuoMCB",
                        style: {
                            flex: 1,
                            textDecoration: "none"
                        },
                        onClick: {
                            "TrangChuForm[<Link>.onClick]": ()=>setShowFlyer(false)
                        }["TrangChuForm[<Link>.onClick]"],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "#f9f9f9",
                                color: "#0B4F5C",
                                border: "1.5px solid #0B4F5C",
                                borderRadius: 8,
                                padding: "10px 0",
                                textAlign: "center",
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer"
                            },
                            children: "🤖 Hỏi DuoMCB"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 307,
                            columnNumber: 42
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 302,
                        columnNumber: 39
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 283,
                columnNumber: 225
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
        lineNumber: 235,
        columnNumber: 28
    }, this);
    let t22;
    if ($[21] !== t14 || $[22] !== t20 || $[23] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-flyer-root": t13,
            style: t14,
            children: [
                t20,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 320,
            columnNumber: 11
        }, this);
        $[21] = t14;
        $[22] = t20;
        $[23] = t21;
        $[24] = t22;
    } else {
        t22 = $[24];
    }
    let t23;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/Cacbailam",
            style: {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 12px",
                borderRadius: 8,
                background: "white"
            },
            children: "Học toán ›"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 330,
            columnNumber: 11
        }, this);
        $[25] = t23;
    } else {
        t23 = $[25];
    }
    let t24;
    let t25;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/signup",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                style: {
                    background: "black",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer"
                },
                children: "Đăng nhập"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 345,
                columnNumber: 32
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 345,
            columnNumber: 11
        }, this);
        t25 = {
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "white"
        };
        $[26] = t24;
        $[27] = t25;
    } else {
        t24 = $[26];
        t25 = $[27];
    }
    let t26;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = {
            width: "100%",
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            display: "flex",
            flexDirection: "column",
            minWidth: 45,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflowX: "unset",
            justifyContent: "space-around",
            color: "white"
        };
        $[28] = t26;
    } else {
        t26 = $[28];
    }
    let t27;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = [
            "1"
        ];
        $[29] = t27;
    } else {
        t27 = $[29];
    }
    let t28;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$avatar$40$2$2e$2$2e$26_$40$hero_f79fd9008fbb09a5a58eab4522cc88a0$2f$node_modules$2f40$heroui$2f$avatar$2f$dist$2f$chunk$2d$CV4BWJDJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__avatar_default__as__Avatar$3e$__["Avatar"], {
            isBordered: true,
            color: "primary",
            src: "/images/defaultuser.png",
            style: {
                width: 36,
                height: 36,
                borderRadius: "50%",
                flexShrink: 0
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 394,
            columnNumber: 11
        }, this);
        $[30] = t28;
    } else {
        t28 = $[30];
    }
    let t29;
    let t30;
    let t31;
    if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = {
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 500,
            minWidth: 260,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9"
        };
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 12,
                borderBottom: "1px solid #eee",
                color: "black"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: "Personal info"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 423,
                columnNumber: 8
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 419,
            columnNumber: 11
        }, this);
        t31 = {
            padding: 12,
            borderBottom: "1px solid #eee",
            color: "#555"
        };
        $[31] = t29;
        $[32] = t30;
        $[33] = t31;
    } else {
        t29 = $[31];
        t30 = $[32];
        t31 = $[33];
    }
    let t32;
    if ($[34] !== content) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t31,
            children: content
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 439,
            columnNumber: 11
        }, this);
        $[34] = content;
        $[35] = t32;
    } else {
        t32 = $[35];
    }
    let t33;
    let t34;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 12,
                borderBottom: "1px solid #eee",
                color: "black"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: "Recent activities"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 452,
                columnNumber: 8
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 448,
            columnNumber: 11
        }, this);
        t34 = {
            padding: 12,
            borderBottom: "1px solid #eee",
            color: "#555"
        };
        $[36] = t33;
        $[37] = t34;
    } else {
        t33 = $[36];
        t34 = $[37];
    }
    let t35;
    if ($[38] !== content2) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t34,
            children: content2
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 466,
            columnNumber: 11
        }, this);
        $[38] = content2;
        $[39] = t35;
    } else {
        t35 = $[39];
    }
    let t36;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 12,
                cursor: "pointer",
                color: "#c00"
            },
            onClick: _TrangChuFormDivOnClick,
            children: "Sign out"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 474,
            columnNumber: 11
        }, this);
        $[40] = t36;
    } else {
        t36 = $[40];
    }
    let t37;
    if ($[41] !== t32 || $[42] !== t35) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t25,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$5TAKXEBY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_default__as__Accordion$3e$__["Accordion"], {
                selectionMode: "multiple",
                style: t26,
                variant: "shadow",
                colorScheme: "primary",
                defaultValue: t27,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$HAJUSXOG$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_item_base_default__as__AccordionItem$3e$__["AccordionItem"], {
                    "aria-label": "User",
                    startContent: t28,
                    variant: "shadow",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: t29,
                        children: [
                            t30,
                            t32,
                            t33,
                            t35,
                            t36
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 485,
                        columnNumber: 211
                    }, this)
                }, "1", false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 485,
                    columnNumber: 134
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 485,
                columnNumber: 28
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 485,
            columnNumber: 11
        }, this);
        $[41] = t32;
        $[42] = t35;
        $[43] = t37;
    } else {
        t37 = $[43];
    }
    let t38;
    if ($[44] !== t11 || $[45] !== t12 || $[46] !== t22 || $[47] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            style: t11,
            children: [
                t12,
                t22,
                t23,
                t24,
                t37
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 494,
            columnNumber: 11
        }, this);
        $[44] = t11;
        $[45] = t12;
        $[46] = t22;
        $[47] = t37;
        $[48] = t38;
    } else {
        t38 = $[48];
    }
    let t39;
    if ($[49] !== t10 || $[50] !== t38 || $[51] !== t9) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: t7,
            "data-reveal": t8,
            style: t9,
            children: [
                t10,
                t38
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 505,
            columnNumber: 11
        }, this);
        $[49] = t10;
        $[50] = t38;
        $[51] = t9;
        $[52] = t39;
    } else {
        t39 = $[52];
    }
    let t40;
    if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            paddingTop: 20,
            flexWrap: "wrap"
        };
        $[53] = t40;
    } else {
        t40 = $[53];
    }
    let t41;
    if ($[54] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: "/images/duosteamicon.png",
            "data-avatar-trigger": true,
            style: {
                width: "520px",
                maxWidth: "100%",
                cursor: "pointer"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 529,
            columnNumber: 11
        }, this);
        $[54] = t41;
    } else {
        t41 = $[54];
    }
    let t42;
    let t43;
    let t44;
    if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
        t42 = {
            maxWidth: "520px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9"
        };
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            style: {
                fontSize: 40,
                marginBottom: 10,
                color: "black"
            },
            children: "Welcome to DUOMATH!"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 549,
            columnNumber: 11
        }, this);
        t44 = {
            color: "#777",
            fontSize: 22,
            marginBottom: 20
        };
        $[55] = t42;
        $[56] = t43;
        $[57] = t44;
    } else {
        t42 = $[55];
        t43 = $[56];
        t44 = $[57];
    }
    let t45;
    if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: "DUOMATH"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 569,
            columnNumber: 11
        }, this);
        $[58] = t45;
    } else {
        t45 = $[58];
    }
    let t46;
    let t47;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: t44,
            children: [
                "Broaden your mathematical horizons with ",
                t45,
                " - the ultimate ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: "bilingual math resource"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 577,
                    columnNumber: 87
                }, this),
                " for high school students!"
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 577,
            columnNumber: 11
        }, this);
        t47 = {
            color: "#777",
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 25
        };
        $[59] = t46;
        $[60] = t47;
    } else {
        t46 = $[59];
        t47 = $[60];
    }
    let t48;
    if ($[61] === Symbol.for("react.memo_cache_sentinel")) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: "DUOMATH"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 592,
            columnNumber: 11
        }, this);
        $[61] = t48;
    } else {
        t48 = $[61];
    }
    let t49;
    if ($[62] === Symbol.for("react.memo_cache_sentinel")) {
        t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: "STEM"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 599,
            columnNumber: 11
        }, this);
        $[62] = t49;
    } else {
        t49 = $[62];
    }
    let t50;
    if ($[63] === Symbol.for("react.memo_cache_sentinel")) {
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "120",
            style: t40,
            children: [
                t41,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "reveal",
                    "data-reveal": true,
                    "data-reveal-stagger": true,
                    "data-stagger": "60",
                    style: t42,
                    children: [
                        t43,
                        t46,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: t47,
                            children: [
                                "At ",
                                t48,
                                ", we believe the future of ",
                                t49,
                                " is ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "bilingual"
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                    lineNumber: 606,
                                    columnNumber: 286
                                }, this),
                                ". Dive into an immersive learning experience with high-school-aligned resources that help you solve complex problems in two languages. Your journey to academic excellence starts here."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 606,
                            columnNumber: 227
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            style: {
                                padding: "16px 28px",
                                background: "black",
                                color: "white",
                                borderRadius: 10,
                                border: "none",
                                fontSize: 18,
                                fontWeight: 600,
                                cursor: "pointer"
                            },
                            children: "Start"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 606,
                            columnNumber: 499
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 606,
                    columnNumber: 117
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 606,
            columnNumber: 11
        }, this);
        $[63] = t50;
    } else {
        t50 = $[63];
    }
    let t51;
    let t52;
    if ($[64] === Symbol.for("react.memo_cache_sentinel")) {
        t51 = {
            marginTop: 70,
            marginBottom: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        };
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            style: {
                fontSize: 28
            },
            children: "Latest tests"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 630,
            columnNumber: 11
        }, this);
        $[64] = t51;
        $[65] = t52;
    } else {
        t51 = $[64];
        t52 = $[65];
    }
    let t53;
    if ($[66] === Symbol.for("react.memo_cache_sentinel")) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "60",
            style: t51,
            children: [
                t52,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/cacbailam",
                    style: {
                        color: "#999"
                    },
                    children: "Xem tất cả"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 641,
                    columnNumber: 116
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 641,
            columnNumber: 11
        }, this);
        $[66] = t53;
    } else {
        t53 = $[66];
    }
    let t54;
    if ($[67] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40,
            marginBottom: 60,
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9"
        };
        $[67] = t54;
    } else {
        t54 = $[67];
    }
    let t55;
    if ($[68] === Symbol.for("react.memo_cache_sentinel")) {
        t55 = {
            textDecoration: "none",
            color: "inherit"
        };
        $[68] = t55;
    } else {
        t55 = $[68];
    }
    let t56;
    if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
        t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/section1-L10",
            style: t55,
            onClick: _TrangChuFormLinkOnClick,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/math10.png",
                        style: {
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                            borderRadius: 10,
                            marginBottom: 14
                        }
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 677,
                        columnNumber: 94
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 22,
                            fontWeight: 600
                        },
                        children: "Test 1"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 683,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "#777",
                            fontSize: 18
                        },
                        children: "Grade 10"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 686,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 16
                        },
                        children: "15 questions • Shorts answer + T/F/NG"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 689,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 677,
                columnNumber: 85
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 677,
            columnNumber: 11
        }, this);
        $[69] = t56;
    } else {
        t56 = $[69];
    }
    let t57;
    if ($[70] === Symbol.for("react.memo_cache_sentinel")) {
        t57 = {
            textDecoration: "none",
            color: "inherit"
        };
        $[70] = t57;
    } else {
        t57 = $[70];
    }
    let t58;
    if ($[71] === Symbol.for("react.memo_cache_sentinel")) {
        t58 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/section1-L10-2",
            style: t57,
            onClick: _TrangChuFormLinkOnClick2,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/math10.png",
                        style: {
                            width: "100%",
                            height: 220,
                            objectFit: "cover",
                            borderRadius: 10,
                            marginBottom: 14
                        }
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 708,
                        columnNumber: 97
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 22,
                            fontWeight: 600
                        },
                        children: "Test 2"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 714,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "#777",
                            fontSize: 18
                        },
                        children: "Grade 10"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 717,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 16
                        },
                        children: "15 questions • Shorts answer + T/F/NG"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 720,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 708,
                columnNumber: 88
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 708,
            columnNumber: 11
        }, this);
        $[71] = t58;
    } else {
        t58 = $[71];
    }
    let t59;
    if ($[72] === Symbol.for("react.memo_cache_sentinel")) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/images/math11.png",
                    style: {
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginBottom: 14
                    }
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 729,
                    columnNumber: 20
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 22,
                        fontWeight: 600
                    },
                    children: "Test 1"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 735,
                    columnNumber: 12
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        color: "#777",
                        fontSize: 18
                    },
                    children: "Grade 11 (coming soon)"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 738,
                    columnNumber: 22
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 16
                    },
                    children: "15 questions • Shorts answer + T/F/NG"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 741,
                    columnNumber: 38
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 729,
            columnNumber: 11
        }, this);
        $[72] = t59;
    } else {
        t59 = $[72];
    }
    let t60;
    let t61;
    if ($[73] === Symbol.for("react.memo_cache_sentinel")) {
        t60 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "100",
            style: t54,
            children: [
                t56,
                t58,
                t59,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/math12.png",
                            style: {
                                width: "100%",
                                height: 220,
                                objectFit: "cover",
                                borderRadius: 10,
                                marginBottom: 14
                            }
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 751,
                            columnNumber: 136
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 22,
                                fontWeight: 600
                            },
                            children: "Test 1"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 757,
                            columnNumber: 14
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                color: "#777",
                                fontSize: 18
                            },
                            children: "Grade 12 (coming soon)"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 760,
                            columnNumber: 24
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 16
                            },
                            children: "15 questions • Shorts answer + T/F/NG"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 763,
                            columnNumber: 40
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 751,
                    columnNumber: 127
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 751,
            columnNumber: 11
        }, this);
        t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 766,
            columnNumber: 11
        }, this);
        $[73] = t60;
        $[74] = t61;
    } else {
        t60 = $[73];
        t61 = $[74];
    }
    let t62;
    if ($[75] === Symbol.for("react.memo_cache_sentinel")) {
        t62 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "60",
            style: {
                fontSize: 28,
                marginBottom: 20
            },
            children: "Contact"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 777,
            columnNumber: 11
        }, this);
        $[75] = t62;
    } else {
        t62 = $[75];
    }
    let t63;
    if ($[76] === Symbol.for("react.memo_cache_sentinel")) {
        t63 = {
            marginBottom: 60
        };
        $[76] = t63;
    } else {
        t63 = $[76];
    }
    let t64;
    let t65;
    if ($[77] === Symbol.for("react.memo_cache_sentinel")) {
        t64 = [
            "1"
        ];
        t65 = {
            marginBottom: 20,
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9",
            width: "100%"
        };
        $[77] = t64;
        $[78] = t65;
    } else {
        t64 = $[77];
        t65 = $[78];
    }
    let t66;
    let t67;
    let t68;
    if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
        t66 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t63,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$5TAKXEBY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_default__as__Accordion$3e$__["Accordion"], {
                selectionMode: "multiple",
                variant: "shadow",
                colorScheme: "primary",
                defaultValue: t64,
                style: t65,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$HAJUSXOG$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_item_base_default__as__AccordionItem$3e$__["AccordionItem"], {
                    "aria-label": "Contact Us",
                    title: "Contact Us",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "reveal",
                        "data-reveal": true,
                        "data-reveal-stagger": true,
                        "data-stagger": "120",
                        children: defaultContents.map(_TrangChuFormDefaultContentsMap)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 815,
                        columnNumber: 238
                    }, this)
                }, "1", false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 815,
                    columnNumber: 172
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 815,
                columnNumber: 66
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 815,
            columnNumber: 11
        }, this);
        t67 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            id: "47fb951fba13f945",
            children: ".reveal.jsx-47fb951fba13f945{opacity:0;will-change:opacity,transform;transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .45s cubic-bezier(.2,.8,.2,1);transform:translateY(28px)scale(.97)}.reveal.visible.jsx-47fb951fba13f945{opacity:1;transform:translateY(0)scale(1)}.reveal[data-reveal-stagger].visible.jsx-47fb951fba13f945{opacity:1;transform:none}.reveal[data-reveal-stagger].jsx-47fb951fba13f945>.jsx-47fb951fba13f945{opacity:0;will-change:opacity,transform;transform:translateY(24px)scale(.97)}header.reveal.jsx-47fb951fba13f945{opacity:0;transform:translateY(-18px)}header.reveal.visible.jsx-47fb951fba13f945{opacity:1;transform:translateY(0)}.avatar-accordion.jsx-47fb951fba13f945{opacity:0;will-change:opacity,transform;transition:opacity .45s cubic-bezier(.2,.8,.2,1),transform .4s cubic-bezier(.2,.8,.2,1);transform:translateY(-16px)scale(.97)}.avatar-accordion.avatar-visible.jsx-47fb951fba13f945{opacity:1;transform:translateY(0)scale(1)}.avatar-dropdown.jsx-47fb951fba13f945{opacity:0;visibility:hidden;pointer-events:none;z-index:100;background:#fff;border-radius:10px;transition:all .25s cubic-bezier(.2,.8,.2,1);position:absolute;top:55px;left:50%;transform:translate(-50%)translateY(-10px)scale(.96);box-shadow:0 10px 30px #00000026}.avatar-dropdown.avatar-visible.jsx-47fb951fba13f945{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%)translateY(0)scale(1)}article.jsx-47fb951fba13f945{border-radius:10px;padding:8px;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}article.jsx-47fb951fba13f945:hover{transform:translateY(-6px)scale(1.01);box-shadow:0 12px 28px #0000001f}"
        }, void 0, false, void 0, this);
        t68 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 817,
            columnNumber: 11
        }, this);
        $[79] = t66;
        $[80] = t67;
        $[81] = t68;
    } else {
        t66 = $[79];
        t67 = $[80];
        t68 = $[81];
    }
    let t69;
    if ($[82] !== t39 || $[83] !== t6) {
        t69 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t6,
            children: [
                t39,
                t50,
                t53,
                t60,
                t61,
                t62,
                t66,
                t67,
                t68
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 828,
            columnNumber: 11
        }, this);
        $[82] = t39;
        $[83] = t6;
        $[84] = t69;
    } else {
        t69 = $[84];
    }
    let t70;
    if ($[85] !== t5 || $[86] !== t69) {
        t70 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t5,
            children: t69
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 837,
            columnNumber: 11
        }, this);
        $[85] = t5;
        $[86] = t69;
        $[87] = t70;
    } else {
        t70 = $[87];
    }
    return t70;
}
_s(TrangChuForm, "ArJGX2lb9IIzOnBjY/dHqfVBAyI=");
_c = TrangChuForm;
function _TrangChuFormDefaultContentsMap(line, idx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 4
        },
        children: line
    }, idx, false, {
        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
        lineNumber: 847,
        columnNumber: 10
    }, this);
}
function _TrangChuFormLinkOnClick2() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTestSession"])("reading-test-2");
}
function _TrangChuFormLinkOnClick() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTestSession"])("reading-test-1");
}
function _TrangChuFormDivOnClick() {}
function _TrangChuFormFlyerStepsMap(s, si) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            border: `1.5px solid ${s.color}28`,
            borderRadius: 10,
            overflow: "hidden"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: s.bg,
                    padding: "9px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    borderBottom: `1px solid ${s.color}20`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 17
                        },
                        children: s.icon
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 870,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 700,
                            fontSize: 13,
                            color: s.color
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    display: "inline-block",
                                    background: s.color,
                                    color: "white",
                                    borderRadius: 20,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    padding: "1px 7px",
                                    marginRight: 6
                                },
                                children: [
                                    "Step ",
                                    si + 1
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                lineNumber: 876,
                                columnNumber: 10
                            }, this),
                            s.title
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 872,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 863,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "10px 14px 12px",
                    background: "#fff"
                },
                children: s.steps.map({
                    "TrangChuForm[flyerSteps.map() > s.steps.map()]": (step, i_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 9,
                                marginBottom: i_1 < s.steps.length - 1 ? 7 : 0
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        minWidth: 19,
                                        height: 19,
                                        borderRadius: "50%",
                                        background: s.color,
                                        color: "white",
                                        fontSize: 10,
                                        fontWeight: 800,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        marginTop: 2
                                    },
                                    children: i_1 + 1
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                    lineNumber: 894,
                                    columnNumber: 12
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 12.5,
                                        color: "#3a3a3a",
                                        lineHeight: 1.6
                                    },
                                    children: step
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                    lineNumber: 907,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, i_1, true, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 889,
                            columnNumber: 74
                        }, this)
                }["TrangChuForm[flyerSteps.map() > s.steps.map()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 885,
                columnNumber: 53
            }, this)
        ]
    }, si, true, {
        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
        lineNumber: 859,
        columnNumber: 10
    }, this);
}
function _TrangChuFormButtonOnClickSetShowFlyer(v) {
    return !v;
}
function _TrangChuFormUseEffect2() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const handler = _TrangChuFormUseEffectHandler;
    document.addEventListener("click", handler);
    const closeHandler = _TrangChuFormUseEffectCloseHandler;
    document.addEventListener("click", closeHandler);
    return ()=>{
        document.removeEventListener("click", handler);
        document.removeEventListener("click", closeHandler);
    };
}
function _TrangChuFormUseEffectCloseHandler(ev_0) {
    if (!ev_0.target.closest("[data-avatar-trigger]") && !ev_0.target.closest("[data-avatar-accordion]")) {
        document.querySelectorAll("[data-avatar-accordion]").forEach(_TrangChuFormUseEffectCloseHandlerAnonymous);
    }
}
function _TrangChuFormUseEffectCloseHandlerAnonymous(g_0) {
    return g_0.classList.remove("avatar-visible");
}
function _TrangChuFormUseEffectHandler(ev) {
    const trigger = ev.target.closest("[data-avatar-trigger]");
    if (!trigger) {
        return;
    }
    const container = trigger.closest("div");
    if (!container) {
        return;
    }
    container.querySelectorAll("[data-avatar-accordion]").forEach(_TrangChuFormUseEffectHandlerAnonymous);
}
function _TrangChuFormUseEffectHandlerAnonymous(g) {
    return g.classList.toggle("avatar-visible");
}
function _TrangChuFormUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_TrangChuFormUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "TrangChuForm[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["TrangChuForm[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp(entries, observer) {
    entries.forEach({
        "TrangChuForm[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    Array.from(el_0.children).forEach({
                        "TrangChuForm[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "TrangChuForm[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["TrangChuForm[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["TrangChuForm[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["TrangChuForm[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _TrangChuFormUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "TrangChuForm[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["TrangChuForm[useEffect() > els.forEach() > (anonymous)()]"]);
    }
}
var _c;
__turbopack_context__.k.register(_c, "TrangChuForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_4226586d._.js.map