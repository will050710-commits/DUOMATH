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
function TrangChuForm() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(62);
    if ($[0] !== "b921d57cccd265cd9423bf3fb890b850130189c87a18c3d6d5d32e62f06af9ae") {
        for(let $i = 0; $i < 62; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b921d57cccd265cd9423bf3fb890b850130189c87a18c3d6d5d32e62f06af9ae";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {
            width: "100%",
            background: "#ffffff",
            display: "flex",
            justifyContent: "center"
        };
        t4 = {
            width: "1200px",
            maxWidth: "95%",
            color: "black"
        };
        $[4] = t3;
        $[5] = t4;
    } else {
        t3 = $[4];
        t4 = $[5];
    }
    let t5;
    let t6;
    let t7;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 0",
            position: "relative",
            zIndex: 300
        };
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            },
            children: "DUOSTEAM"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 81,
            columnNumber: 10
        }, this);
        t7 = {
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 16,
            flexDirection: "row",
            position: "relative",
            zIndex: 300
        };
        $[6] = t5;
        $[7] = t6;
        $[8] = t7;
    } else {
        t5 = $[6];
        t6 = $[7];
        t7 = $[8];
    }
    let t8;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/DuoMCB",
            style: {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 12px",
                borderRadius: 8
            },
            children: "Chatbot ›"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 106,
            columnNumber: 10
        }, this);
        $[9] = t8;
    } else {
        t8 = $[9];
    }
    let t9;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/about",
            style: {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 12px",
                borderRadius: 8
            },
            children: "About ›"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[10] = t9;
    } else {
        t9 = $[10];
    }
    let t10;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/minigame",
            style: {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 12px",
                borderRadius: 8
            },
            children: "Minigame ›"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 132,
            columnNumber: 11
        }, this);
        $[11] = t10;
    } else {
        t10 = $[11];
    }
    let t11;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/Cacbaitoan",
            style: {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 12px",
                borderRadius: 8
            },
            children: "Học toán ›"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 145,
            columnNumber: 11
        }, this);
        $[12] = t11;
    } else {
        t11 = $[12];
    }
    let t12;
    let t13;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                lineNumber: 159,
                columnNumber: 32
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 159,
            columnNumber: 11
        }, this);
        t13 = {
            position: "relative",
            display: "flex",
            alignItems: "center"
        };
        $[13] = t12;
        $[14] = t13;
    } else {
        t12 = $[13];
        t13 = $[14];
    }
    let t14;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = {
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
        $[15] = t14;
    } else {
        t14 = $[15];
    }
    let t15;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = [
            "1"
        ];
        $[16] = t15;
    } else {
        t15 = $[16];
    }
    let t16;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$avatar$40$2$2e$2$2e$26_$40$hero_f79fd9008fbb09a5a58eab4522cc88a0$2f$node_modules$2f40$heroui$2f$avatar$2f$dist$2f$chunk$2d$CV4BWJDJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__avatar_default__as__Avatar$3e$__["Avatar"], {
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
            lineNumber: 207,
            columnNumber: 11
        }, this);
        $[17] = t16;
    } else {
        t16 = $[17];
    }
    let t17;
    let t18;
    let t19;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = {
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
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 12,
                borderBottom: "1px solid #eee",
                color: "black"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: "Personal info"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 236,
                columnNumber: 8
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 232,
            columnNumber: 11
        }, this);
        t19 = {
            padding: 12,
            borderBottom: "1px solid #eee",
            color: "#555"
        };
        $[18] = t17;
        $[19] = t18;
        $[20] = t19;
    } else {
        t17 = $[18];
        t18 = $[19];
        t19 = $[20];
    }
    let t20;
    if ($[21] !== content) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t19,
            children: content
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 252,
            columnNumber: 11
        }, this);
        $[21] = content;
        $[22] = t20;
    } else {
        t20 = $[22];
    }
    let t21;
    let t22;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 12,
                borderBottom: "1px solid #eee",
                color: "black"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: "Recent activities"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 265,
                columnNumber: 8
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 261,
            columnNumber: 11
        }, this);
        t22 = {
            padding: 12,
            borderBottom: "1px solid #eee",
            color: "#555"
        };
        $[23] = t21;
        $[24] = t22;
    } else {
        t21 = $[23];
        t22 = $[24];
    }
    let t23;
    if ($[25] !== content2) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t22,
            children: content2
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 279,
            columnNumber: 11
        }, this);
        $[25] = content2;
        $[26] = t23;
    } else {
        t23 = $[26];
    }
    let t24;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 12,
                cursor: "pointer",
                color: "#c00"
            },
            onClick: _TrangChuFormDivOnClick,
            children: "Sign out"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 287,
            columnNumber: 11
        }, this);
        $[27] = t24;
    } else {
        t24 = $[27];
    }
    let t25;
    if ($[28] !== t20 || $[29] !== t23) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "reveal",
            "data-reveal": true,
            style: t5,
            children: [
                t6,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    style: t7,
                    children: [
                        t8,
                        t9,
                        t10,
                        t11,
                        t12,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: t13,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$5TAKXEBY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_default__as__Accordion$3e$__["Accordion"], {
                                selectionMode: "multiple",
                                style: t14,
                                variant: "shadow",
                                colorScheme: "primary",
                                defaultValue: t15,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$HAJUSXOG$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_item_base_default__as__AccordionItem$3e$__["AccordionItem"], {
                                    "aria-label": "User",
                                    startContent: t16,
                                    variant: "shadow",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: t17,
                                        children: [
                                            t18,
                                            t20,
                                            t21,
                                            t23,
                                            t24
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                        lineNumber: 298,
                                        columnNumber: 311
                                    }, this)
                                }, "1", false, {
                                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                    lineNumber: 298,
                                    columnNumber: 234
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                lineNumber: 298,
                                columnNumber: 128
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 298,
                            columnNumber: 111
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 298,
                    columnNumber: 72
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 298,
            columnNumber: 11
        }, this);
        $[28] = t20;
        $[29] = t23;
        $[30] = t25;
    } else {
        t25 = $[30];
    }
    let t26;
    if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            paddingTop: 20,
            flexWrap: "wrap"
        };
        $[31] = t26;
    } else {
        t26 = $[31];
    }
    let t27;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: "/images/duosteamicon.png",
            "data-avatar-trigger": true,
            style: {
                width: "520px",
                maxWidth: "100%",
                cursor: "pointer"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 321,
            columnNumber: 11
        }, this);
        $[32] = t27;
    } else {
        t27 = $[32];
    }
    let t28;
    let t29;
    let t30;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = {
            maxWidth: "520px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9"
        };
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            style: {
                fontSize: 40,
                marginBottom: 10,
                color: "black"
            },
            children: "Welcome to DUOMATH!"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 341,
            columnNumber: 11
        }, this);
        t30 = {
            color: "#777",
            fontSize: 22,
            marginBottom: 20
        };
        $[33] = t28;
        $[34] = t29;
        $[35] = t30;
    } else {
        t28 = $[33];
        t29 = $[34];
        t30 = $[35];
    }
    let t31;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: "DUOMATH"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 361,
            columnNumber: 11
        }, this);
        $[36] = t31;
    } else {
        t31 = $[36];
    }
    let t32;
    let t33;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: t30,
            children: [
                "Broaden your mathematical horizons with ",
                t31,
                " - the ultimate ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    children: "bilingual math resource"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 369,
                    columnNumber: 87
                }, this),
                " for high school students!"
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 369,
            columnNumber: 11
        }, this);
        t33 = {
            color: "#777",
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 25
        };
        $[37] = t32;
        $[38] = t33;
    } else {
        t32 = $[37];
        t33 = $[38];
    }
    let t34;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: "DUOMATH"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 384,
            columnNumber: 11
        }, this);
        $[39] = t34;
    } else {
        t34 = $[39];
    }
    let t35;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
            children: "STEM"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 391,
            columnNumber: 11
        }, this);
        $[40] = t35;
    } else {
        t35 = $[40];
    }
    let t36;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "120",
            style: t26,
            children: [
                t27,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "reveal",
                    "data-reveal": true,
                    "data-reveal-stagger": true,
                    "data-stagger": "60",
                    style: t28,
                    children: [
                        t29,
                        t32,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: t33,
                            children: [
                                "At ",
                                t34,
                                ", we believe the future of ",
                                t35,
                                " is ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "bilingual"
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                                    lineNumber: 398,
                                    columnNumber: 286
                                }, this),
                                ". Dive into an immersive learning experience with high-school-aligned resources that help you solve complex problems in two languages. Your journey to academic excellence starts here."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 398,
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
                            lineNumber: 398,
                            columnNumber: 499
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 398,
                    columnNumber: 117
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 398,
            columnNumber: 11
        }, this);
        $[41] = t36;
    } else {
        t36 = $[41];
    }
    let t37;
    let t38;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t37 = {
            marginTop: 70,
            marginBottom: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        };
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            style: {
                fontSize: 28
            },
            children: "Latest tests"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 422,
            columnNumber: 11
        }, this);
        $[42] = t37;
        $[43] = t38;
    } else {
        t37 = $[42];
        t38 = $[43];
    }
    let t39;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "60",
            style: t37,
            children: [
                t38,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/cacbailam",
                    style: {
                        color: "#999"
                    },
                    children: "Xem tất cả"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 433,
                    columnNumber: 116
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 433,
            columnNumber: 11
        }, this);
        $[44] = t39;
    } else {
        t39 = $[44];
    }
    let t40;
    if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = {
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
        $[45] = t40;
    } else {
        t40 = $[45];
    }
    let t41;
    if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = {
            textDecoration: "none",
            color: "inherit"
        };
        $[46] = t41;
    } else {
        t41 = $[46];
    }
    let t42;
    if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/section1-L10",
            style: t41,
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
                        lineNumber: 469,
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
                        lineNumber: 475,
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
                        lineNumber: 478,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 16
                        },
                        children: "15 questions • Shorts answer + T/F/NG"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 481,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 469,
                columnNumber: 85
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 469,
            columnNumber: 11
        }, this);
        $[47] = t42;
    } else {
        t42 = $[47];
    }
    let t43;
    if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
        t43 = {
            textDecoration: "none",
            color: "inherit"
        };
        $[48] = t43;
    } else {
        t43 = $[48];
    }
    let t44;
    if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/section1-L10-2",
            style: t43,
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
                        lineNumber: 500,
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
                        lineNumber: 506,
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
                        lineNumber: 509,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 16
                        },
                        children: "15 questions • Shorts answer + T/F/NG"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                        lineNumber: 512,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 500,
                columnNumber: 88
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 500,
            columnNumber: 11
        }, this);
        $[49] = t44;
    } else {
        t44 = $[49];
    }
    let t45;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
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
                    lineNumber: 521,
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
                    lineNumber: 527,
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
                    lineNumber: 530,
                    columnNumber: 22
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 16
                    },
                    children: "15 questions • Shorts answer + T/F/NG"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 533,
                    columnNumber: 38
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 521,
            columnNumber: 11
        }, this);
        $[50] = t45;
    } else {
        t45 = $[50];
    }
    let t46;
    let t47;
    if ($[51] === Symbol.for("react.memo_cache_sentinel")) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            "data-reveal-stagger": true,
            "data-stagger": "100",
            style: t40,
            children: [
                t42,
                t44,
                t45,
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
                            lineNumber: 543,
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
                            lineNumber: 549,
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
                            lineNumber: 552,
                            columnNumber: 24
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 16
                            },
                            children: "15 questions • Shorts answer + T/F/NG"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                            lineNumber: 555,
                            columnNumber: 40
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 543,
                    columnNumber: 127
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 543,
            columnNumber: 11
        }, this);
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 558,
            columnNumber: 11
        }, this);
        $[51] = t46;
        $[52] = t47;
    } else {
        t46 = $[51];
        t47 = $[52];
    }
    let t48;
    if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
            lineNumber: 569,
            columnNumber: 11
        }, this);
        $[53] = t48;
    } else {
        t48 = $[53];
    }
    let t49;
    if ($[54] === Symbol.for("react.memo_cache_sentinel")) {
        t49 = {
            marginBottom: 60
        };
        $[54] = t49;
    } else {
        t49 = $[54];
    }
    let t50;
    let t51;
    if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
        t50 = [
            "1"
        ];
        t51 = {
            marginBottom: 20,
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9",
            width: "100%"
        };
        $[55] = t50;
        $[56] = t51;
    } else {
        t50 = $[55];
        t51 = $[56];
    }
    let t52;
    let t53;
    let t54;
    if ($[57] === Symbol.for("react.memo_cache_sentinel")) {
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t49,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f40$heroui$2b$accordion$40$2$2e$2$2e$29_$40$h_9795789ef015c964c3ae751d47eed52b$2f$node_modules$2f40$heroui$2f$accordion$2f$dist$2f$chunk$2d$5TAKXEBY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__accordion_default__as__Accordion$3e$__["Accordion"], {
                selectionMode: "multiple",
                variant: "shadow",
                colorScheme: "primary",
                defaultValue: t50,
                style: t51,
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
                        lineNumber: 607,
                        columnNumber: 238
                    }, this)
                }, "1", false, {
                    fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                    lineNumber: 607,
                    columnNumber: 172
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 607,
                columnNumber: 66
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 607,
            columnNumber: 11
        }, this);
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            id: "c5f5483e80d6ca47",
            children: ".reveal.jsx-c5f5483e80d6ca47{opacity:0;will-change:opacity,transform;transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .45s cubic-bezier(.2,.8,.2,1);transform:translateY(28px)scale(.97)}.reveal.visible.jsx-c5f5483e80d6ca47{opacity:1;transform:translateY(0)scale(1)}.reveal[data-reveal-stagger].visible.jsx-c5f5483e80d6ca47{opacity:1;transform:none}.reveal[data-reveal-stagger].jsx-c5f5483e80d6ca47>.jsx-c5f5483e80d6ca47{opacity:0;will-change:opacity,transform;transform:translateY(24px)scale(.97)}header.reveal.jsx-c5f5483e80d6ca47{opacity:0;transform:translateY(-18px)}header.reveal.visible.jsx-c5f5483e80d6ca47{opacity:1;transform:translateY(0)}.avatar-accordion.jsx-c5f5483e80d6ca47{opacity:0;will-change:opacity,transform;transition:opacity .45s cubic-bezier(.2,.8,.2,1),transform .4s cubic-bezier(.2,.8,.2,1);transform:translateY(-16px)scale(.97)}.avatar-accordion.avatar-visible.jsx-c5f5483e80d6ca47{opacity:1;transform:translateY(0)scale(1)}.avatar-dropdown.jsx-c5f5483e80d6ca47{opacity:0;visibility:hidden;pointer-events:none;z-index:100;background:#fff;border-radius:10px;transition:all .25s cubic-bezier(.2,.8,.2,1);position:absolute;top:55px;left:50%;transform:translate(-50%)translateY(-10px)scale(.96);box-shadow:0 10px 30px #00000026}.avatar-dropdown.avatar-visible.jsx-c5f5483e80d6ca47{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%)translateY(0)scale(1)}article.jsx-c5f5483e80d6ca47{border-radius:10px;padding:8px;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}article.jsx-c5f5483e80d6ca47:hover{transform:translateY(-6px)scale(1.01);box-shadow:0 12px 28px #0000001f}"
        }, void 0, false, void 0, this);
        t54 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoMCBSidebar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 609,
            columnNumber: 11
        }, this);
        $[57] = t52;
        $[58] = t53;
        $[59] = t54;
    } else {
        t52 = $[57];
        t53 = $[58];
        t54 = $[59];
    }
    let t55;
    if ($[60] !== t25) {
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t3,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t4,
                children: [
                    t25,
                    t36,
                    t39,
                    t46,
                    t47,
                    t48,
                    t52,
                    t53,
                    t54
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
                lineNumber: 620,
                columnNumber: 27
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
            lineNumber: 620,
            columnNumber: 11
        }, this);
        $[60] = t25;
        $[61] = t55;
    } else {
        t55 = $[61];
    }
    return t55;
}
_s(TrangChuForm, "MOR+R+UqoqLm5rpBQMNuKHeqy7w=");
_c = TrangChuForm;
function _TrangChuFormDefaultContentsMap(line, idx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 4
        },
        children: line
    }, idx, false, {
        fileName: "[project]/duosteam/src/components/trangchu/TrangChuForm.js",
        lineNumber: 629,
        columnNumber: 10
    }, this);
}
function _TrangChuFormLinkOnClick2() {
    localStorage.removeItem("endTime-L10");
    localStorage.removeItem("readingTest_section1");
    localStorage.removeItem("readingTest_section2");
    localStorage.removeItem("readingTest_section3");
    localStorage.removeItem("endTime_reading-test-1");
}
function _TrangChuFormLinkOnClick() {
    localStorage.removeItem("endTime-L10");
    localStorage.removeItem("endTime-reading-test-1");
}
function _TrangChuFormDivOnClick() {}
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
    const inTrigger = ev_0.target.closest("[data-avatar-trigger]");
    const inAccordion = ev_0.target.closest("[data-avatar-accordion]");
    if (!inTrigger && !inAccordion) {
        const all = document.querySelectorAll("[data-avatar-accordion]");
        all.forEach(_TrangChuFormUseEffectCloseHandlerAllForEach);
    }
}
function _TrangChuFormUseEffectCloseHandlerAllForEach(g_0) {
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
    const groups = container.querySelectorAll("[data-avatar-accordion]");
    groups.forEach(_TrangChuFormUseEffectHandlerGroupsForEach);
}
function _TrangChuFormUseEffectHandlerGroupsForEach(g) {
    g.classList.toggle("avatar-visible");
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
                const hasStagger = el_0.hasAttribute("data-reveal-stagger");
                const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                if (hasStagger) {
                    const children = Array.from(el_0.children);
                    if (children.length > 0) {
                        children.forEach({
                            "TrangChuForm[useEffect() > <anonymous> > entries.forEach() > children.forEach()]": (child_0, i_0)=>{
                                setTimeout({
                                    "TrangChuForm[useEffect() > <anonymous> > entries.forEach() > children.forEach() > setTimeout()]": ()=>{
                                        child_0.style.opacity = "1";
                                        child_0.style.transform = "translateY(0) scale(1)";
                                    }
                                }["TrangChuForm[useEffect() > <anonymous> > entries.forEach() > children.forEach() > setTimeout()]"], i_0 * stagger_0);
                            }
                        }["TrangChuForm[useEffect() > <anonymous> > entries.forEach() > children.forEach()]"]);
                    }
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

//# sourceMappingURL=duosteam_src_components_2160b397._.js.map