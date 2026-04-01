(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/duosteam/src/components/DuoMCB/DuoTranslate.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "backdrop": "DuoTranslate-module__fBJKeq__backdrop",
  "body": "DuoTranslate-module__fBJKeq__body",
  "cardLabel": "DuoTranslate-module__fBJKeq__cardLabel",
  "closeBtn": "DuoTranslate-module__fBJKeq__closeBtn",
  "errorState": "DuoTranslate-module__fBJKeq__errorState",
  "fadeIn": "DuoTranslate-module__fBJKeq__fadeIn",
  "fadeUp": "DuoTranslate-module__fBJKeq__fadeUp",
  "header": "DuoTranslate-module__fBJKeq__header",
  "headerIcon": "DuoTranslate-module__fBJKeq__headerIcon",
  "headerLeft": "DuoTranslate-module__fBJKeq__headerLeft",
  "headerSub": "DuoTranslate-module__fBJKeq__headerSub",
  "headerTitle": "DuoTranslate-module__fBJKeq__headerTitle",
  "hintState": "DuoTranslate-module__fBJKeq__hintState",
  "loadingState": "DuoTranslate-module__fBJKeq__loadingState",
  "panel": "DuoTranslate-module__fBJKeq__panel",
  "panelOpen": "DuoTranslate-module__fBJKeq__panelOpen",
  "results": "DuoTranslate-module__fBJKeq__results",
  "root": "DuoTranslate-module__fBJKeq__root",
  "selectedLabel": "DuoTranslate-module__fBJKeq__selectedLabel",
  "selectedPreview": "DuoTranslate-module__fBJKeq__selectedPreview",
  "selectedText": "DuoTranslate-module__fBJKeq__selectedText",
  "spin": "DuoTranslate-module__fBJKeq__spin",
  "spinner": "DuoTranslate-module__fBJKeq__spinner",
  "summaryCard": "DuoTranslate-module__fBJKeq__summaryCard",
  "summaryText": "DuoTranslate-module__fBJKeq__summaryText",
  "translationCard": "DuoTranslate-module__fBJKeq__translationCard",
  "translationText": "DuoTranslate-module__fBJKeq__translationText",
  "wordCard": "DuoTranslate-module__fBJKeq__wordCard",
  "wordEn": "DuoTranslate-module__fBJKeq__wordEn",
  "wordExample": "DuoTranslate-module__fBJKeq__wordExample",
  "wordList": "DuoTranslate-module__fBJKeq__wordList",
  "wordListLabel": "DuoTranslate-module__fBJKeq__wordListLabel",
  "wordPronun": "DuoTranslate-module__fBJKeq__wordPronun",
  "wordTop": "DuoTranslate-module__fBJKeq__wordTop",
  "wordType": "DuoTranslate-module__fBJKeq__wordType",
  "wordVi": "DuoTranslate-module__fBJKeq__wordVi",
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
"[project]/duosteam/src/components/DuoMCB/DuoTranslate.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DuoTranslate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/DuoTranslate.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/duoServer.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable react-hooks/exhaustive-deps */ "use client";
;
;
;
function DuoTranslate({ children }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedText, setSelectedText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastTranslatedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    const debounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mouseDownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        target: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DuoTranslate.useEffect": ()=>{
            initSession();
        }
    }["DuoTranslate.useEffect"], []);
    async function initSession() {
        const sid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSession"])();
        setSessionId(sid || "offline-" + Date.now());
    }
    // Tags that should never trigger translation when clicked
    const IGNORED_TAGS = new Set([
        "BUTTON",
        "INPUT",
        "TEXTAREA",
        "SELECT",
        "A",
        "LABEL"
    ]);
    const isInteractive = (el)=>{
        let node = el;
        for(let i = 0; i < 5; i++){
            if (!node || node === document.body) break;
            if (IGNORED_TAGS.has(node.tagName)) return true;
            node = node.parentElement;
        }
        return false;
    };
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DuoTranslate.useCallback[handleMouseDown]": (e)=>{
            mouseDownRef.current = {
                x: e.clientX,
                y: e.clientY,
                target: e.target
            };
        }
    }["DuoTranslate.useCallback[handleMouseDown]"], []);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DuoTranslate.useCallback[handleMouseUp]": (e)=>{
            if (panelRef.current?.contains(e.target)) return;
            if (isInteractive(mouseDownRef.current.target)) return;
            const dx = Math.abs(e.clientX - mouseDownRef.current.x);
            const dy = Math.abs(e.clientY - mouseDownRef.current.y);
            if (dx < 8 && dy < 8) return;
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout({
                "DuoTranslate.useCallback[handleMouseUp]": ()=>{
                    const selection = window.getSelection();
                    const text = selection?.toString().trim();
                    if (!text || text.length < 2) return;
                    if (text === lastTranslatedRef.current) return;
                    if (panelRef.current?.contains(selection.anchorNode)) return;
                    lastTranslatedRef.current = text;
                    doTranslate(text);
                }
            }["DuoTranslate.useCallback[handleMouseUp]"], 80);
        }
    }["DuoTranslate.useCallback[handleMouseUp]"], [
        doTranslate,
        isInteractive
    ]);
    async function doTranslate(text) {
        setSelectedText(text);
        setIsOpen(true);
        setLoading(true);
        setResults(null);
        try {
            const parsed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translateText"])(sessionId, text);
            setResults(parsed);
        } catch (e) {
            setResults({
                error: true,
                raw: `Unexpected error: ${e?.message || e}\n\nMake sure server.py is running.`
            });
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DuoTranslate.useEffect": ()=>{
            document.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mouseup", handleMouseUp);
            return ({
                "DuoTranslate.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleMouseDown);
                    document.removeEventListener("mouseup", handleMouseUp);
                    clearTimeout(debounceRef.current);
                }
            })["DuoTranslate.useEffect"];
        }
    }["DuoTranslate.useEffect"], [
        handleMouseDown,
        handleMouseUp
    ]);
    const handleClose = ()=>{
        setIsOpen(false);
        lastTranslatedRef.current = ""; // allow re-translating same text after closing
    };
    const typeColors = {
        noun: "#60a5fa",
        verb: "#34d399",
        adj: "#f472b6",
        adv: "#fbbf24",
        prep: "#a78bfa",
        conj: "#fb923c"
    };
    const typeColor = (t)=>typeColors[t?.toLowerCase()] || "#9ca3af";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].root,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: children
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backdrop,
                onClick: handleClose
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                lineNumber: 116,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: panelRef,
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panel} ${isOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panelOpen : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerLeft,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerIcon,
                                        children: "🔤"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerTitle,
                                                children: "DuoTranslate"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerSub,
                                                children: "EN → VI"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].closeBtn,
                                onClick: handleClose,
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    selectedText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectedPreview,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectedLabel,
                                children: "Selected"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectedText,
                                children: [
                                    '"',
                                    selectedText,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                        lineNumber: 133,
                        columnNumber: 26
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].body,
                        children: [
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingState,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Translating..."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 140,
                                columnNumber: 23
                            }, this),
                            !loading && results?.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorState,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 24
                                        },
                                        children: "⚠️"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 13,
                                            lineHeight: 1.7,
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            marginTop: 8
                                        },
                                        children: results.raw
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 146,
                                columnNumber: 42
                            }, this),
                            !loading && results && !results.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].results,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].translationCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardLabel,
                                                children: "🇻🇳 Bản dịch"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].translationText,
                                                children: results.translation
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, this),
                                    results.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summaryCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardLabel,
                                                children: "💡 Ghi chú"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summaryText,
                                                children: results.summary
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 171,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 169,
                                        columnNumber: 35
                                    }, this),
                                    results.words?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordList,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordListLabel,
                                                children: "📖 Từ vựng"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 175,
                                                columnNumber: 19
                                            }, this),
                                            results.words.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordCard,
                                                    style: {
                                                        animationDelay: `${i * 0.06}s`
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordTop,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordEn,
                                                                    children: w.word
                                                                }, void 0, false, {
                                                                    fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                                    lineNumber: 180,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordType,
                                                                    style: {
                                                                        color: typeColor(w.type),
                                                                        borderColor: typeColor(w.type)
                                                                    },
                                                                    children: w.type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                                    lineNumber: 181,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 179,
                                                            columnNumber: 23
                                                        }, this),
                                                        w.pronunciation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordPronun,
                                                            children: w.pronunciation
                                                        }, void 0, false, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 188,
                                                            columnNumber: 43
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordVi,
                                                            children: w.vietnamese
                                                        }, void 0, false, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 189,
                                                            columnNumber: 23
                                                        }, this),
                                                        w.example && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordExample,
                                                            children: [
                                                                'e.g. "',
                                                                w.example,
                                                                '"'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 190,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                    lineNumber: 176,
                                                    columnNumber: 48
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 174,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 162,
                                columnNumber: 53
                            }, this),
                            !loading && !results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hintState,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🖱️"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Bôi đen bất kỳ đoạn văn nào để dịch sang tiếng Việt"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 196,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
        lineNumber: 113,
        columnNumber: 10
    }, this);
}
_s(DuoTranslate, "1rc33TOYI3BXrWUOhR63NM0kx5g=");
_c = DuoTranslate;
var _c;
__turbopack_context__.k.register(_c, "DuoTranslate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson21_DauTamThucBacHai
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/DuoTranslate.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SH = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "0cb4e8ac0db73e7d7fb15bf735085f736c19a147020dcf277aa4f3f521bc928f") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0cb4e8ac0db73e7d7fb15bf735085f736c19a147020dcf277aa4f3f521bc928f";
    }
    const { icon, title } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            fontWeight: 700,
            color: "#0B4F5C",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "2px solid #f0f0f0"
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== icon) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: icon
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 38,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = icon;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== title) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: title
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 46,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[4] = title;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== t2 || $[7] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t1,
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 54,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t2;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    return t4;
};
_c = SH;
const RS = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(37);
    if ($[0] !== "0cb4e8ac0db73e7d7fb15bf735085f736c19a147020dcf277aa4f3f521bc928f") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0cb4e8ac0db73e7d7fb15bf735085f736c19a147020dcf277aa4f3f521bc928f";
    }
    const { items, onReset, scoreLabel, t } = t0;
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            textAlign: "center",
            marginBottom: 24
        };
        t2 = {
            fontSize: 48,
            marginBottom: 8
        };
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    const t3 = items.filter(_temp).length === items.length ? "\uD83C\uDFC6" : items.filter(_temp2).length >= items.length * 0.6 ? "\uD83D\uDC4D" : "\uD83D\uDCAA";
    let t4;
    if ($[3] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t2,
            children: t3
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 97,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = t3;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            fontSize: 26,
            fontWeight: 700,
            color: "#0B4F5C"
        };
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    let t6;
    if ($[6] !== items) {
        t6 = items.filter(_temp3);
        $[6] = items;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] !== items.length || $[9] !== t6.length) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t5,
            children: [
                t6.length,
                " / ",
                items.length
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 124,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[8] = items.length;
        $[9] = t6.length;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = {
            color: "#777",
            fontSize: 16,
            marginTop: 4
        };
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== scoreLabel) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t8,
            children: scoreLabel
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 144,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = scoreLabel;
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] !== t4 || $[15] !== t7 || $[16] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t1,
            children: [
                t4,
                t7,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 152,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[14] = t4;
        $[15] = t7;
        $[16] = t9;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    let t11;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = {
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24
        };
        $[18] = t11;
    } else {
        t11 = $[18];
    }
    let t12;
    if ($[19] !== items || $[20] !== t) {
        let t13;
        if ($[22] !== t) {
            t13 = (item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "14px 18px",
                        borderRadius: 10,
                        background: item.correct ? "#eafaf1" : "#fdf2f2",
                        border: `1px solid ${item.correct ? "#a9dfbf" : "#f1948a"}`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 18,
                                    flexShrink: 0
                                },
                                children: item.correct ? "\u2705" : "\u274C"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 185,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: "#333",
                                            marginBottom: 4
                                        },
                                        children: [
                                            t("C\xE2u", "Q"),
                                            " ",
                                            idx + 1,
                                            ": ",
                                            item.qText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 190,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !item.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            color: "#922b21"
                                        },
                                        children: [
                                            t("\u0110\xE1p \xE1n \u0111\xFAng:", "Correct:"),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: item.correctText
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                                lineNumber: 198,
                                                columnNumber: 67
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 195,
                                        columnNumber: 82
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.yourText && !item.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            color: "#777"
                                        },
                                        children: [
                                            t("B\u1EA1n ch\u1ECDn:", "You chose:"),
                                            " ",
                                            item.yourText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 198,
                                        columnNumber: 144
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 188,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 181,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, idx, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                    lineNumber: 176,
                    columnNumber: 28
                }, ("TURBOPACK compile-time value", void 0));
            $[22] = t;
            $[23] = t13;
        } else {
            t13 = $[23];
        }
        t12 = items.map(t13);
        $[19] = items;
        $[20] = t;
        $[21] = t12;
    } else {
        t12 = $[21];
    }
    let t13;
    if ($[24] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t11,
            children: t12
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 216,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[24] = t12;
        $[25] = t13;
    } else {
        t13 = $[25];
    }
    let t14;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = {
            textAlign: "center"
        };
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = {
            padding: "12px 32px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer"
        };
        $[27] = t15;
    } else {
        t15 = $[27];
    }
    let t16;
    if ($[28] !== t) {
        t16 = t("Ch\u01A1i l\u1EA1i", "Play Again");
        $[28] = t;
        $[29] = t16;
    } else {
        t16 = $[29];
    }
    let t17;
    if ($[30] !== onReset || $[31] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t14,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onReset,
                style: t15,
                children: [
                    "🔄 ",
                    t16
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 257,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 257,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[30] = onReset;
        $[31] = t16;
        $[32] = t17;
    } else {
        t17 = $[32];
    }
    let t18;
    if ($[33] !== t10 || $[34] !== t13 || $[35] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t10,
                t13,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 266,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[33] = t10;
        $[34] = t13;
        $[35] = t17;
        $[36] = t18;
    } else {
        t18 = $[36];
    }
    return t18;
};
_c1 = RS;
function Lesson21_DauTamThucBacHai() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(384);
    if ($[0] !== "0cb4e8ac0db73e7d7fb15bf735085f736c19a147020dcf277aa4f3f521bc928f") {
        for(let $i = 0; $i < 384; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0cb4e8ac0db73e7d7fb15bf735085f736c19a147020dcf277aa4f3f521bc928f";
    }
    const [lang, setLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("vi");
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {};
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [rev, setRev] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    const [gm, setGm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("mc");
    const [mi, setMi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [ms, setMs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [msc, setMsc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [md, setMd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [mh, setMh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [ti, setTi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tf, setTf] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ts, setTs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [td, setTd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const [th, setTh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t2);
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {};
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const [fa, setFa] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    const [fc, setFc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = [];
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson21_DauTamThucBacHaiUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson21_DauTamThucBacHai[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson21_DauTamThucBacHai[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    const sc = _Lesson21_DauTamThucBacHaiSc;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson21_DauTamThucBacHai[tr]": (id_0)=>setRev({
                    "Lesson21_DauTamThucBacHai[tr > setRev()]": (p)=>({
                            ...p,
                            [id_0]: !p[id_0]
                        })
                }["Lesson21_DauTamThucBacHai[tr > setRev()]"])
        })["Lesson21_DauTamThucBacHai[tr]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const tr = t6;
    let fQ;
    let fri;
    let fs;
    let rt;
    let t10;
    let t11;
    let t12;
    let t13;
    let t14;
    let t15;
    let t16;
    let t17;
    let t18;
    let t19;
    let t20;
    let t21;
    let t22;
    let t7;
    let t8;
    let t9;
    let ta;
    let tfC;
    let tn;
    let tri;
    if ($[9] !== fa || $[10] !== fc || $[11] !== gm || $[12] !== lang || $[13] !== md || $[14] !== mh || $[15] !== mi || $[16] !== ms || $[17] !== msc || $[18] !== rev || $[19] !== t || $[20] !== tf || $[21] !== th || $[22] !== ti) {
        const mcQ = [
            {
                q: t("Tam th\u1EE9c f(x)=ax\xB2+bx+c (a>0) c\xF3 \u0394>0. D\u1EA5u c\u1EE7a f(x) khi x\u2208(x\u2081,x\u2082)?", "f(x)=ax\xB2+bx+c (a>0), \u0394>0. Sign of f(x) for x\u2208(x\u2081,x\u2082)?"),
                o: [
                    t("D\u01B0\u01A1ng", "Positive"),
                    t("\xC2m", "Negative"),
                    t("B\u1EB1ng 0", "Zero"),
                    t("Kh\xF4ng x\xE1c \u0111\u1ECBnh", "Undefined")
                ],
                a: 1,
                ex: t("a>0, \u0394>0: f(x)<0 khi x\u2208(x\u2081,x\u2082), f(x)>0 khi x<x\u2081 ho\u1EB7c x>x\u2082.", "a>0, \u0394>0: f(x)<0 for x\u2208(x\u2081,x\u2082), f(x)>0 outside.")
            },
            {
                q: t("f(x)=x\xB2\u22125x+6. D\u1EA5u c\u1EE7a f(x) khi x\u2208(2,3)?", "f(x)=x\xB2\u22125x+6. Sign for x\u2208(2,3)?"),
                o: [
                    t("D\u01B0\u01A1ng", "Positive"),
                    t("\xC2m", "Negative"),
                    "=0",
                    t("Kh\xF4ng x\xE1c \u0111\u1ECBnh", "Undefined")
                ],
                a: 1,
                ex: t("\u0394=25\u221224=1>0; x\u2081=2, x\u2082=3. a=1>0 \u2192 f(x)<0 gi\u1EEFa 2 nghi\u1EC7m.", "Roots 2 and 3. a>0 \u2192 f<0 between roots.")
            },
            {
                q: t("f(x)=\u2212x\xB2+4x\u22125. \u0394=?", "f(x)=\u2212x\xB2+4x\u22125. \u0394=?"),
                o: [
                    "4",
                    "\u22124",
                    "36",
                    "\u221236"
                ],
                a: 1,
                ex: t("\u0394=b\xB2\u22124ac=16\u22124\xB7(\u22121)\xB7(\u22125)=16\u221220=\u22124<0.", "\u0394=16\u221220=\u22124<0.")
            },
            {
                q: t("f(x)=ax\xB2+bx+c (a>0), \u0394<0. D\u1EA5u c\u1EE7a f(x)?", "f(x)=ax\xB2+bx+c, a>0, \u0394<0. Sign?"),
                o: [
                    t("Lu\xF4n \xE2m", "Always negative"),
                    t("Lu\xF4n d\u01B0\u01A1ng", "Always positive"),
                    t("\u0110\u1ED5i d\u1EA5u", "Changes sign"),
                    t("B\u1EB1ng 0", "Always zero")
                ],
                a: 1,
                ex: t("a>0, \u0394<0: parabol kh\xF4ng c\u1EAFt Ox, lu\xF4n n\u1EB1m tr\xEAn Ox \u2192 f(x)>0 v\u1EDBi m\u1ECDi x.", "a>0, \u0394<0: parabola above Ox \u2192 f(x)>0 for all x.")
            },
            {
                q: t("f(x)=2x\xB2\u22128x+8. T\u1EADp nghi\u1EC7m f(x)\u22640 l\xE0?", "f(x)=2x\xB2\u22128x+8. Solution set of f(x)\u22640?"),
                o: [
                    "{2}",
                    "(\u2212\u221E,2]",
                    "[2,+\u221E)",
                    "\u2205"
                ],
                a: 0,
                ex: t("\u0394=64\u221264=0; x\u2080=2. a=2>0 \u2192 f(x)\u22650, f=0 ch\u1EC9 t\u1EA1i x=2. V\u1EADy f(x)\u22640 \u27FA x=2.", "\u0394=0, x\u2080=2. f(x)\u22650 with equality only at x=2.")
            }
        ];
        tfC = [
            {
                s: t("N\u1EBFu a>0 v\xE0 \u0394<0, th\xEC f(x)=ax\xB2+bx+c>0 v\u1EDBi m\u1ECDi x.", "If a>0 and \u0394<0, then f(x)>0 for all x."),
                a: true,
                ex: t("\u0110\xDANG \u2014 parabol m\u1EDF l\xEAn, kh\xF4ng c\u1EAFt Ox \u2192 lu\xF4n d\u01B0\u01A1ng.", "TRUE \u2014 opens up, no x-intercepts \u2192 always positive.")
            },
            {
                s: t("f(x)=x\xB2\u22124x+4=(x\u22122)\xB2 lu\xF4n kh\xF4ng \xE2m.", "f(x)=(x\u22122)\xB2 is always non-negative."),
                a: true,
                ex: t("\u0110\xDANG \u2014 b\xECnh ph\u01B0\u01A1ng \u22650, b\u1EB1ng 0 khi x=2.", "TRUE \u2014 square \u22650, equals 0 when x=2.")
            },
            {
                s: t("N\u1EBFu a<0 v\xE0 \u0394>0, f(x)>0 v\u1EDBi x ngo\xE0i kho\u1EA3ng (x\u2081,x\u2082).", "If a<0 and \u0394>0, f(x)>0 outside (x\u2081,x\u2082)."),
                a: false,
                ex: t("SAI \u2014 a<0: f(x)>0 trong kho\u1EA3ng (x\u2081,x\u2082), \xE2m ngo\xE0i kho\u1EA3ng.", "FALSE \u2014 a<0: f>0 INSIDE (x\u2081,x\u2082), negative outside.")
            },
            {
                s: t("Tam th\u1EE9c b\u1EADc hai c\xF3 th\u1EC3 c\xF3 0, 1 ho\u1EB7c 2 nghi\u1EC7m th\u1EF1c.", "A quadratic trinomial can have 0, 1, or 2 real roots."),
                a: true,
                ex: t("\u0110\xDANG \u2014 t\xF9y thu\u1ED9c \u0394<0 (v\xF4 nghi\u1EC7m), \u0394=0 (nghi\u1EC7m k\xE9p), \u0394>0 (2 nghi\u1EC7m).", "TRUE \u2014 depends on sign of \u0394.")
            },
            {
                s: t("N\u1EBFu \u0394=0, tam th\u1EE9c c\xF3 nghi\u1EC7m k\xE9p x\u2080=\u2212b/(2a) v\xE0 f(x)\u22650 khi a>0.", "If \u0394=0, f has double root x\u2080=\u2212b/2a and f(x)\u22650 for a>0."),
                a: true,
                ex: t("\u0110\xDANG \u2014 \u0394=0: f(x)=a(x\u2212x\u2080)\xB2\u22650 khi a>0.", "TRUE \u2014 \u0394=0: f=a(x\u2212x\u2080)\xB2\u22650 for a>0.")
            }
        ];
        fQ = [
            {
                id: "f1",
                tp: t("f(x)=ax\xB2+bx+c, a>0, \u0394>0. D\u1EA5u f(x)<0 khi x thu\u1ED9c ___.", "f(x)=ax\xB2+bx+c, a>0, \u0394>0. f(x)<0 when x \u2208 ___."),
                ans: "(x\u2081,x\u2082)",
                alt: [
                    "(x1,x2)",
                    "x1x2",
                    "gi\u1EEFa hai nghi\u1EC7m",
                    "between roots"
                ],
                h: t("Gi\u1EEFa hai nghi\u1EC7m", "Between the two roots")
            },
            {
                id: "f2",
                tp: t("\u0394 = b\xB2 \u2212 ___ \xB7 a \xB7 c", "\u0394 = b\xB2 \u2212 ___ \xB7 a \xB7 c"),
                ans: "4",
                alt: [
                    "4"
                ],
                h: ""
            },
            {
                id: "f3",
                tp: t("f(x)=x\xB2\u22126x+9=(x\u2212___)\xB2", "f(x)=x\xB2\u22126x+9=(x\u2212___)\xB2"),
                ans: "3",
                alt: [
                    "3"
                ],
                h: "\u221A9=3"
            }
        ];
        const cf = {
            "Lesson21_DauTamThucBacHai[cf]": (id_1)=>{
                const q_0 = fQ.find({
                    "Lesson21_DauTamThucBacHai[cf > fQ.find()]": (q)=>q.id === id_1
                }["Lesson21_DauTamThucBacHai[cf > fQ.find()]"]);
                const r = (fa[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                return [
                    q_0.ans,
                    ...q_0.alt || []
                ].map(_Lesson21_DauTamThucBacHaiCfAnonymous).includes(r);
            }
        }["Lesson21_DauTamThucBacHai[cf]"];
        fs = fc ? fQ.filter({
            "Lesson21_DauTamThucBacHai[fQ.filter()]": (q_1)=>cf(q_1.id)
        }["Lesson21_DauTamThucBacHai[fQ.filter()]"]).length : null;
        const sel = {
            "Lesson21_DauTamThucBacHai[sel]": (i_1)=>{
                if (ms !== null) {
                    return;
                }
                setMs(i_1);
                const c_1 = i_1 === mcQ[mi].a;
                if (c_1) {
                    setMsc(_Lesson21_DauTamThucBacHaiSelSetMsc);
                }
                setMh({
                    "Lesson21_DauTamThucBacHai[sel > setMh()]": (h)=>[
                            ...h,
                            {
                                q: mi,
                                s: i_1,
                                c: c_1
                            }
                        ]
                }["Lesson21_DauTamThucBacHai[sel > setMh()]"]);
            }
        }["Lesson21_DauTamThucBacHai[sel]"];
        const nx = {
            "Lesson21_DauTamThucBacHai[nx]": ()=>{
                if (mi + 1 >= mcQ.length) {
                    setMd(true);
                } else {
                    setMi(_Lesson21_DauTamThucBacHaiNxSetMi);
                    setMs(null);
                }
            }
        }["Lesson21_DauTamThucBacHai[nx]"];
        let t23;
        if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
            t23 = ({
                "Lesson21_DauTamThucBacHai[rm]": ()=>{
                    setMi(0);
                    setMs(null);
                    setMsc(0);
                    setMd(false);
                    setMh([]);
                }
            })["Lesson21_DauTamThucBacHai[rm]"];
            $[47] = t23;
        } else {
            t23 = $[47];
        }
        const rm = t23;
        ta = ({
            "Lesson21_DauTamThucBacHai[ta]": (a_0)=>{
                if (tf) {
                    return;
                }
                setTf(true);
                const c_2 = a_0 === tfC[ti].a;
                if (c_2) {
                    setTs(_Lesson21_DauTamThucBacHaiTaSetTs);
                }
                setTh({
                    "Lesson21_DauTamThucBacHai[ta > setTh()]": (h_0)=>[
                            ...h_0,
                            {
                                q: ti,
                                g: a_0,
                                c: c_2
                            }
                        ]
                }["Lesson21_DauTamThucBacHai[ta > setTh()]"]);
            }
        })["Lesson21_DauTamThucBacHai[ta]"];
        tn = ({
            "Lesson21_DauTamThucBacHai[tn]": ()=>{
                if (ti + 1 >= tfC.length) {
                    setTd(true);
                } else {
                    setTi(_Lesson21_DauTamThucBacHaiTnSetTi);
                    setTf(false);
                }
            }
        })["Lesson21_DauTamThucBacHai[tn]"];
        let t24;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = ({
                "Lesson21_DauTamThucBacHai[rt]": ()=>{
                    setTi(0);
                    setTf(false);
                    setTs(0);
                    setTd(false);
                    setTh([]);
                }
            })["Lesson21_DauTamThucBacHai[rt]"];
            $[48] = t24;
        } else {
            t24 = $[48];
        }
        rt = t24;
        const mri = mh.map({
            "Lesson21_DauTamThucBacHai[mh.map()]": (h_1)=>({
                    correct: h_1.c,
                    qText: mcQ[h_1.q].q,
                    correctText: mcQ[h_1.q].o[mcQ[h_1.q].a],
                    yourText: mcQ[h_1.q].o[h_1.s]
                })
        }["Lesson21_DauTamThucBacHai[mh.map()]"]);
        tri = th.map({
            "Lesson21_DauTamThucBacHai[th.map()]": (h_2)=>({
                    correct: h_2.c,
                    qText: tfC[h_2.q].s,
                    correctText: tfC[h_2.q].a ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.g ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson21_DauTamThucBacHai[th.map()]"]);
        fri = fc ? fQ.map({
            "Lesson21_DauTamThucBacHai[fQ.map()]": (q_2)=>({
                    correct: cf(q_2.id),
                    qText: q_2.tp,
                    correctText: q_2.ans,
                    yourText: fa[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson21_DauTamThucBacHai[fQ.map()]"]) : [];
        let t25;
        if ($[49] !== t) {
            t25 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[49] = t;
            $[50] = t25;
        } else {
            t25 = $[50];
        }
        let t26;
        if ($[51] !== t25) {
            t26 = [
                "w",
                "\uD83D\uDE80",
                t25
            ];
            $[51] = t25;
            $[52] = t26;
        } else {
            t26 = $[52];
        }
        let t27;
        if ($[53] !== t) {
            t27 = t("1. \u0110\u1ECBnh Ngh\u0129a", "1. Definition");
            $[53] = t;
            $[54] = t27;
        } else {
            t27 = $[54];
        }
        let t28;
        if ($[55] !== t27) {
            t28 = [
                "k1",
                "\uD83D\uDCD6",
                t27
            ];
            $[55] = t27;
            $[56] = t28;
        } else {
            t28 = $[56];
        }
        let t29;
        if ($[57] !== t) {
            t29 = t("2. B\u1EA3ng X\xE9t D\u1EA5u", "2. Sign Table");
            $[57] = t;
            $[58] = t29;
        } else {
            t29 = $[58];
        }
        let t30;
        if ($[59] !== t29) {
            t30 = [
                "k2",
                "\uD83D\uDCD6",
                t29
            ];
            $[59] = t29;
            $[60] = t30;
        } else {
            t30 = $[60];
        }
        let t31;
        if ($[61] !== t) {
            t31 = t("3. C\xE1c Tr\u01B0\u1EDDng H\u1EE3p", "3. All Cases");
            $[61] = t;
            $[62] = t31;
        } else {
            t31 = $[62];
        }
        let t32;
        if ($[63] !== t31) {
            t32 = [
                "k3",
                "\uD83D\uDCD6",
                t31
            ];
            $[63] = t31;
            $[64] = t32;
        } else {
            t32 = $[64];
        }
        let t33;
        if ($[65] !== t) {
            t33 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[65] = t;
            $[66] = t33;
        } else {
            t33 = $[66];
        }
        let t34;
        if ($[67] !== t33) {
            t34 = [
                "th",
                "\u270F\uFE0F",
                t33
            ];
            $[67] = t33;
            $[68] = t34;
        } else {
            t34 = $[68];
        }
        let t35;
        if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
            t35 = [
                "mg",
                "\uD83C\uDFAE",
                "Mini Game"
            ];
            $[69] = t35;
        } else {
            t35 = $[69];
        }
        let t36;
        if ($[70] !== t26 || $[71] !== t28 || $[72] !== t30 || $[73] !== t32 || $[74] !== t34) {
            t36 = [
                t26,
                t28,
                t30,
                t32,
                t34,
                t35
            ];
            $[70] = t26;
            $[71] = t28;
            $[72] = t30;
            $[73] = t32;
            $[74] = t34;
            $[75] = t36;
        } else {
            t36 = $[75];
        }
        const tabs = t36;
        if ($[76] === Symbol.for("react.memo_cache_sentinel")) {
            t22 = {
                width: "100%",
                background: "#fff",
                display: "flex",
                justifyContent: "center"
            };
            t12 = {
                width: "1200px",
                maxWidth: "95%",
                color: "black",
                paddingTop: 60,
                paddingBottom: 80
            };
            $[76] = t12;
            $[77] = t22;
        } else {
            t12 = $[76];
            t22 = $[77];
        }
        let t37;
        if ($[78] === Symbol.for("react.memo_cache_sentinel")) {
            t37 = {
                marginBottom: 24
            };
            $[78] = t37;
        } else {
            t37 = $[78];
        }
        let t38;
        if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
            t38 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[79] = t38;
        } else {
            t38 = $[79];
        }
        let t39;
        if ($[80] !== t) {
            t39 = t("Quay l\u1EA1i", "Back");
            $[80] = t;
            $[81] = t39;
        } else {
            t39 = $[81];
        }
        if ($[82] !== t39) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t37,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t38,
                    children: [
                        "← ",
                        t39
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                    lineNumber: 731,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 731,
                columnNumber: 13
            }, this);
            $[82] = t39;
            $[83] = t13;
        } else {
            t13 = $[83];
        }
        let t40;
        let t41;
        if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
            t40 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t41 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C"
            };
            $[84] = t40;
            $[85] = t41;
        } else {
            t40 = $[84];
            t41 = $[85];
        }
        let t42;
        if ($[86] !== t) {
            t42 = t("Ch\u01B0\u01A1ng VII \xB7 B\u1EA5t Ph\u01B0\u01A1ng Tr\xECnh B\u1EADc Hai M\u1ED9t \u1EA8n", "Chapter VII \xB7 Quadratic Inequalities in One Variable");
            $[86] = t;
            $[87] = t42;
        } else {
            t42 = $[87];
        }
        let t43;
        if ($[88] !== t42) {
            t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t41,
                children: t42
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 769,
                columnNumber: 13
            }, this);
            $[88] = t42;
            $[89] = t43;
        } else {
            t43 = $[89];
        }
        let t44;
        if ($[90] === Symbol.for("react.memo_cache_sentinel")) {
            t44 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[90] = t44;
        } else {
            t44 = $[90];
        }
        let t45;
        if ($[91] !== t) {
            t45 = t("B\xE0i 21: D\u1EA5u c\u1EE7a Tam Th\u1EE9c B\u1EADc Hai", "Lesson 21: Sign of a Quadratic Trinomial");
            $[91] = t;
            $[92] = t45;
        } else {
            t45 = $[92];
        }
        let t46;
        if ($[93] !== t45) {
            t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t44,
                children: t45
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 796,
                columnNumber: 13
            }, this);
            $[93] = t45;
            $[94] = t46;
        } else {
            t46 = $[94];
        }
        let t47;
        if ($[95] !== t43 || $[96] !== t46) {
            t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t43,
                    t46
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 804,
                columnNumber: 13
            }, this);
            $[95] = t43;
            $[96] = t46;
            $[97] = t47;
        } else {
            t47 = $[97];
        }
        let t48;
        let t49;
        if ($[98] === Symbol.for("react.memo_cache_sentinel")) {
            t48 = {
                display: "flex",
                gap: 10
            };
            t49 = ({
                "Lesson21_DauTamThucBacHai[<button>.onClick]": ()=>setLang("vi")
            })["Lesson21_DauTamThucBacHai[<button>.onClick]"];
            $[98] = t48;
            $[99] = t49;
        } else {
            t48 = $[98];
            t49 = $[99];
        }
        const t50 = lang === "vi" ? "black" : "#f9f9f9";
        const t51 = lang === "vi" ? "white" : "black";
        let t52;
        if ($[100] !== t50 || $[101] !== t51) {
            t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t49,
                style: {
                    background: t50,
                    color: t51,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 831,
                columnNumber: 13
            }, this);
            $[100] = t50;
            $[101] = t51;
            $[102] = t52;
        } else {
            t52 = $[102];
        }
        let t53;
        if ($[103] === Symbol.for("react.memo_cache_sentinel")) {
            t53 = ({
                "Lesson21_DauTamThucBacHai[<button>.onClick]": ()=>setLang("en")
            })["Lesson21_DauTamThucBacHai[<button>.onClick]"];
            $[103] = t53;
        } else {
            t53 = $[103];
        }
        const t54 = lang === "en" ? "black" : "#f9f9f9";
        const t55 = lang === "en" ? "white" : "black";
        let t56;
        if ($[104] !== t54 || $[105] !== t55) {
            t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t53,
                style: {
                    background: t54,
                    color: t55,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 860,
                columnNumber: 13
            }, this);
            $[104] = t54;
            $[105] = t55;
            $[106] = t56;
        } else {
            t56 = $[106];
        }
        let t57;
        if ($[107] !== t52 || $[108] !== t56) {
            t57 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t48,
                children: [
                    t52,
                    t56
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 878,
                columnNumber: 13
            }, this);
            $[107] = t52;
            $[108] = t56;
            $[109] = t57;
        } else {
            t57 = $[109];
        }
        if ($[110] !== t47 || $[111] !== t57) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t40,
                children: [
                    t47,
                    t57
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 886,
                columnNumber: 13
            }, this);
            $[110] = t47;
            $[111] = t57;
            $[112] = t14;
        } else {
            t14 = $[112];
        }
        let t58;
        let t59;
        if ($[113] === Symbol.for("react.memo_cache_sentinel")) {
            t58 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t59 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[113] = t58;
            $[114] = t59;
        } else {
            t58 = $[113];
            t59 = $[114];
        }
        let t60;
        if ($[115] !== t) {
            t60 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Objectives");
            $[115] = t;
            $[116] = t60;
        } else {
            t60 = $[116];
        }
        let t61;
        if ($[117] !== t60) {
            t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t59,
                children: [
                    "🎯 ",
                    t60
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 924,
                columnNumber: 13
            }, this);
            $[117] = t60;
            $[118] = t61;
        } else {
            t61 = $[118];
        }
        let t62;
        if ($[119] !== t) {
            t62 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m tam th\u1EE9c b\u1EADc hai f(x)=ax\xB2+bx+c.", "Understand quadratic trinomial f(x)=ax\xB2+bx+c.");
            $[119] = t;
            $[120] = t62;
        } else {
            t62 = $[120];
        }
        let t63;
        if ($[121] !== t) {
            t63 = t("X\xE1c \u0111\u1ECBnh d\u1EA5u c\u1EE7a tam th\u1EE9c d\u1EF1a v\xE0o a v\xE0 \u0394.", "Determine the sign based on a and \u0394.");
            $[121] = t;
            $[122] = t63;
        } else {
            t63 = $[122];
        }
        let t64;
        if ($[123] !== t) {
            t64 = t("L\u1EADp b\u1EA3ng x\xE9t d\u1EA5u tam th\u1EE9c b\u1EADc hai.", "Construct the sign table for a quadratic trinomial.");
            $[123] = t;
            $[124] = t64;
        } else {
            t64 = $[124];
        }
        let t65;
        if ($[125] !== t) {
            t65 = t("\xC1p d\u1EE5ng v\xE0o gi\u1EA3i b\u1EA5t ph\u01B0\u01A1ng tr\xECnh b\u1EADc hai.", "Apply to solve quadratic inequalities.");
            $[125] = t;
            $[126] = t65;
        } else {
            t65 = $[126];
        }
        let t66;
        if ($[127] !== t) {
            t66 = t("Nh\u1EADn bi\u1EBFt 6 tr\u01B0\u1EDDng h\u1EE3p d\u1EA5u \u0111\u1EA7y \u0111\u1EE7.", "Identify all 6 sign cases.");
            $[127] = t;
            $[128] = t66;
        } else {
            t66 = $[128];
        }
        let t67;
        if ($[129] !== t62 || $[130] !== t63 || $[131] !== t64 || $[132] !== t65 || $[133] !== t66) {
            t67 = [
                t62,
                t63,
                t64,
                t65,
                t66
            ].map(_Lesson21_DauTamThucBacHaiAnonymous);
            $[129] = t62;
            $[130] = t63;
            $[131] = t64;
            $[132] = t65;
            $[133] = t66;
            $[134] = t67;
        } else {
            t67 = $[134];
        }
        if ($[135] !== t61 || $[136] !== t67) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t58,
                children: [
                    t61,
                    t67
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 983,
                columnNumber: 13
            }, this);
            $[135] = t61;
            $[136] = t67;
            $[137] = t15;
        } else {
            t15 = $[137];
        }
        let t68;
        let t69;
        if ($[138] === Symbol.for("react.memo_cache_sentinel")) {
            t68 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t69 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[138] = t68;
            $[139] = t69;
        } else {
            t68 = $[138];
            t69 = $[139];
        }
        if ($[140] !== tabs) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t68,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t69,
                    children: tabs.map({
                        "Lesson21_DauTamThucBacHai[tabs.map()]": (t70)=>{
                            const [id_2, icon, label] = t70;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson21_DauTamThucBacHai[tabs.map() > <button>.onClick]": ()=>sc(id_2)
                                }["Lesson21_DauTamThucBacHai[tabs.map() > <button>.onClick]"],
                                style: {
                                    background: "#f9f9f9",
                                    color: "black",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    transition: "all 0.15s"
                                },
                                onMouseEnter: _Lesson21_DauTamThucBacHaiTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson21_DauTamThucBacHaiTabsMapButtonOnMouseLeave,
                                children: [
                                    icon,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 1018,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson21_DauTamThucBacHai[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                    lineNumber: 1015,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1015,
                columnNumber: 13
            }, this);
            $[140] = tabs;
            $[141] = t16;
        } else {
            t16 = $[141];
        }
        let t70;
        if ($[142] === Symbol.for("react.memo_cache_sentinel")) {
            t70 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[142] = t70;
        } else {
            t70 = $[142];
        }
        let t71;
        if ($[143] !== t) {
            t71 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[143] = t;
            $[144] = t71;
        } else {
            t71 = $[144];
        }
        let t72;
        if ($[145] !== t71) {
            t72 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDE80",
                title: t71
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1059,
                columnNumber: 13
            }, this);
            $[145] = t71;
            $[146] = t72;
        } else {
            t72 = $[146];
        }
        let t73;
        let t74;
        if ($[147] === Symbol.for("react.memo_cache_sentinel")) {
            t73 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t74 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[147] = t73;
            $[148] = t74;
        } else {
            t73 = $[147];
            t74 = $[148];
        }
        let t75;
        if ($[149] !== t) {
            t75 = t("Trong l\u1EE3i nhu\u1EADn kinh doanh, h\xE0m l\u1EE3i nhu\u1EADn c\xF3 d\u1EA1ng f(x) = \u2212x\xB2 + 10x \u2212 16 (ngh\xECn \u0111\u1ED3ng), v\u1EDBi x l\xE0 s\u1ED1 s\u1EA3n ph\u1EA9m. H\u1ECFi v\u1EDBi x n\xE0o th\xEC f(x) > 0 (c\xF3 l\xE3i)? \u0110\xE2y l\xE0 b\xE0i to\xE1n x\xE9t d\u1EA5u tam th\u1EE9c b\u1EADc hai.", "In a business profit model, profit is f(x) = \u2212x\xB2+10x\u221216 (thousands). For which x is f(x)>0 (profitable)? This is a sign-analysis problem for a quadratic trinomial.");
            $[149] = t;
            $[150] = t75;
        } else {
            t75 = $[150];
        }
        let t76;
        if ($[151] !== t75) {
            t76 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t74,
                children: t75
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1095,
                columnNumber: 13
            }, this);
            $[151] = t75;
            $[152] = t76;
        } else {
            t76 = $[152];
        }
        let t77;
        if ($[153] === Symbol.for("react.memo_cache_sentinel")) {
            t77 = {
                fontSize: 16
            };
            $[153] = t77;
        } else {
            t77 = $[153];
        }
        let t78;
        if ($[154] !== t) {
            t78 = t("H\xE3y t\xEDnh \u0394 v\xE0 t\xECm 2 nghi\u1EC7m c\u1EE7a f(x) tr\u01B0\u1EDBc khi h\u1ECDc l\xFD thuy\u1EBFt.", "Try computing \u0394 and the two roots of f(x) before studying the theory.");
            $[154] = t;
            $[155] = t78;
        } else {
            t78 = $[155];
        }
        let t79;
        if ($[156] !== t78) {
            t79 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t77,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t78
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 1120,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1120,
                columnNumber: 13
            }, this);
            $[156] = t78;
            $[157] = t79;
        } else {
            t79 = $[157];
        }
        let t80;
        if ($[158] !== t76 || $[159] !== t79) {
            t80 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t73,
                children: [
                    t76,
                    t79
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1128,
                columnNumber: 13
            }, this);
            $[158] = t76;
            $[159] = t79;
            $[160] = t80;
        } else {
            t80 = $[160];
        }
        if ($[161] !== t72 || $[162] !== t80) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "w",
                style: t70,
                children: [
                    t72,
                    t80
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1136,
                columnNumber: 13
            }, this);
            $[161] = t72;
            $[162] = t80;
            $[163] = t17;
        } else {
            t17 = $[163];
        }
        let t81;
        if ($[164] === Symbol.for("react.memo_cache_sentinel")) {
            t81 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[164] = t81;
        } else {
            t81 = $[164];
        }
        let t82;
        if ($[165] !== t) {
            t82 = t("1. Tam Th\u1EE9c B\u1EADc Hai", "1. Quadratic Trinomial");
            $[165] = t;
            $[166] = t82;
        } else {
            t82 = $[166];
        }
        let t83;
        if ($[167] !== t82) {
            t83 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t82
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1163,
                columnNumber: 13
            }, this);
            $[167] = t82;
            $[168] = t83;
        } else {
            t83 = $[168];
        }
        let t84;
        let t85;
        if ($[169] === Symbol.for("react.memo_cache_sentinel")) {
            t84 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t85 = {
                fontWeight: "bold",
                fontSize: 17,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[169] = t84;
            $[170] = t85;
        } else {
            t84 = $[169];
            t85 = $[170];
        }
        let t86;
        if ($[171] !== t) {
            t86 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[171] = t;
            $[172] = t86;
        } else {
            t86 = $[172];
        }
        let t87;
        if ($[173] !== t86) {
            t87 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t85,
                children: [
                    "📌 ",
                    t86
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1201,
                columnNumber: 13
            }, this);
            $[173] = t86;
            $[174] = t87;
        } else {
            t87 = $[174];
        }
        let t88;
        if ($[175] === Symbol.for("react.memo_cache_sentinel")) {
            t88 = {
                fontSize: 15,
                lineHeight: 1.8,
                marginBottom: 12
            };
            $[175] = t88;
        } else {
            t88 = $[175];
        }
        let t89;
        if ($[176] !== t) {
            t89 = t("Tam th\u1EE9c b\u1EADc hai (theo x) l\xE0 bi\u1EC3u th\u1EE9c d\u1EA1ng f(x) = ax\xB2 + bx + c, trong \u0111\xF3 a \u2260 0. Bi\u1EC7t th\u1EE9c \u0394 = b\xB2 \u2212 4ac quy\u1EBFt \u0111\u1ECBnh s\u1ED1 nghi\u1EC7m v\xE0 d\u1EA5u c\u1EE7a f(x).", "A quadratic trinomial in x has the form f(x)=ax\xB2+bx+c, a\u22600. The discriminant \u0394=b\xB2\u22124ac determines the number of roots and sign of f(x).");
            $[176] = t;
            $[177] = t89;
        } else {
            t89 = $[177];
        }
        let t90;
        if ($[178] !== t89) {
            t90 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t88,
                children: t89
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1228,
                columnNumber: 13
            }, this);
            $[178] = t89;
            $[179] = t90;
        } else {
            t90 = $[179];
        }
        let t91;
        if ($[180] === Symbol.for("react.memo_cache_sentinel")) {
            t91 = {
                background: "white",
                borderRadius: 8,
                padding: "12px 16px",
                fontFamily: "monospace",
                fontSize: 15,
                lineHeight: 2.2
            };
            $[180] = t91;
        } else {
            t91 = $[180];
        }
        let t92;
        if ($[181] === Symbol.for("react.memo_cache_sentinel")) {
            t92 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1250,
                columnNumber: 13
            }, this);
            $[181] = t92;
        } else {
            t92 = $[181];
        }
        let t93;
        if ($[182] === Symbol.for("react.memo_cache_sentinel")) {
            t93 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1257,
                columnNumber: 13
            }, this);
            $[182] = t93;
        } else {
            t93 = $[182];
        }
        let t94;
        if ($[183] === Symbol.for("react.memo_cache_sentinel")) {
            t94 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t91,
                children: [
                    "Δ = b² − 4ac",
                    t92,
                    "\u0394 > 0 \u2192 2 nghi\u1EC7m ph\xE2n bi\u1EC7t x\u2081,x\u2082 (x\u2081 < x\u2082)",
                    t93,
                    "Δ = 0 → nghiệm kép x₀ = −b/(2a)",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 1264,
                        columnNumber: 172
                    }, this),
                    "\u0394 < 0 \u2192 v\xF4 nghi\u1EC7m th\u1EF1c"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1264,
                columnNumber: 13
            }, this);
            $[183] = t94;
        } else {
            t94 = $[183];
        }
        let t95;
        if ($[184] !== t87 || $[185] !== t90) {
            t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t84,
                children: [
                    t87,
                    t90,
                    t94
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1271,
                columnNumber: 13
            }, this);
            $[184] = t87;
            $[185] = t90;
            $[186] = t95;
        } else {
            t95 = $[186];
        }
        if ($[187] !== t83 || $[188] !== t95) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k1",
                style: t81,
                children: [
                    t83,
                    t95
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1279,
                columnNumber: 13
            }, this);
            $[187] = t83;
            $[188] = t95;
            $[189] = t18;
        } else {
            t18 = $[189];
        }
        let t96;
        if ($[190] === Symbol.for("react.memo_cache_sentinel")) {
            t96 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[190] = t96;
        } else {
            t96 = $[190];
        }
        let t97;
        if ($[191] !== t) {
            t97 = t("2. B\u1EA3ng X\xE9t D\u1EA5u (\u0110\u1ECBnh L\xFD)", "2. Sign Table (Theorem)");
            $[191] = t;
            $[192] = t97;
        } else {
            t97 = $[192];
        }
        let t98;
        if ($[193] !== t97) {
            t98 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t97
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1306,
                columnNumber: 13
            }, this);
            $[193] = t97;
            $[194] = t98;
        } else {
            t98 = $[194];
        }
        let t100;
        let t99;
        if ($[195] === Symbol.for("react.memo_cache_sentinel")) {
            t99 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t100 = {
                fontWeight: "bold",
                fontSize: 16,
                color: "#0B4F5C",
                marginBottom: 12
            };
            $[195] = t100;
            $[196] = t99;
        } else {
            t100 = $[195];
            t99 = $[196];
        }
        let t101;
        if ($[197] !== t) {
            t101 = t("\u0110\u1ECBnh l\xFD v\u1EC1 d\u1EA5u tam th\u1EE9c b\u1EADc hai (a>0, \u0394>0, nghi\u1EC7m x\u2081<x\u2082):", "Sign theorem (a>0, \u0394>0, roots x\u2081<x\u2082):");
            $[197] = t;
            $[198] = t101;
        } else {
            t101 = $[198];
        }
        let t102;
        if ($[199] !== t101) {
            t102 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t100,
                children: [
                    "📌 ",
                    t101
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1344,
                columnNumber: 14
            }, this);
            $[199] = t101;
            $[200] = t102;
        } else {
            t102 = $[200];
        }
        let t103;
        let t104;
        if ($[201] === Symbol.for("react.memo_cache_sentinel")) {
            t103 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: "auto"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: 14,
                        minWidth: 500
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: [
                            [
                                "x",
                                "\u2212\u221E",
                                "",
                                "x\u2081",
                                "",
                                "x\u2082",
                                "",
                                "+\u221E"
                            ],
                            [
                                "f(x)",
                                "+",
                                "",
                                "0",
                                "\u2212",
                                "0",
                                "+",
                                ""
                            ]
                        ].map(_Lesson21_DauTamThucBacHaiAnonymous2)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 1360,
                        columnNumber: 12
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                    lineNumber: 1355,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1353,
                columnNumber: 14
            }, this);
            t104 = {
                marginTop: 12,
                padding: "10px 14px",
                background: "#fff3cd",
                borderRadius: 8,
                fontSize: 14
            };
            $[201] = t103;
            $[202] = t104;
        } else {
            t103 = $[201];
            t104 = $[202];
        }
        let t105;
        if ($[203] !== t) {
            t105 = t("Quy t\u1EAFc: f(x) c\xF9ng d\u1EA5u v\u1EDBi a \u1EDF ngo\xE0i kho\u1EA3ng (x\u2081,x\u2082), v\xE0 ng\u01B0\u1EE3c d\u1EA5u v\u1EDBi a \u1EDF trong kho\u1EA3ng (x\u2081,x\u2082).", "Rule: f(x) has the same sign as a outside (x\u2081,x\u2082), and opposite sign inside (x\u2081,x\u2082).");
            $[203] = t;
            $[204] = t105;
        } else {
            t105 = $[204];
        }
        let t106;
        if ($[205] !== t105) {
            t106 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t104,
                children: [
                    "💡 ",
                    t105
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1384,
                columnNumber: 14
            }, this);
            $[205] = t105;
            $[206] = t106;
        } else {
            t106 = $[206];
        }
        let t107;
        if ($[207] !== t102 || $[208] !== t106) {
            t107 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t99,
                children: [
                    t102,
                    t103,
                    t106
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1392,
                columnNumber: 14
            }, this);
            $[207] = t102;
            $[208] = t106;
            $[209] = t107;
        } else {
            t107 = $[209];
        }
        if ($[210] !== t107 || $[211] !== t98) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k2",
                style: t96,
                children: [
                    t98,
                    t107
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1400,
                columnNumber: 13
            }, this);
            $[210] = t107;
            $[211] = t98;
            $[212] = t19;
        } else {
            t19 = $[212];
        }
        let t108;
        if ($[213] === Symbol.for("react.memo_cache_sentinel")) {
            t108 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[213] = t108;
        } else {
            t108 = $[213];
        }
        let t109;
        if ($[214] !== t) {
            t109 = t("3. B\u1EA3ng T\u1ED5ng H\u1EE3p 6 Tr\u01B0\u1EDDng H\u1EE3p", "3. All 6 Cases Summary");
            $[214] = t;
            $[215] = t109;
        } else {
            t109 = $[215];
        }
        let t110;
        if ($[216] !== t109) {
            t110 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t109
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1427,
                columnNumber: 14
            }, this);
            $[216] = t109;
            $[217] = t110;
        } else {
            t110 = $[217];
        }
        let t111;
        if ($[218] === Symbol.for("react.memo_cache_sentinel")) {
            t111 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 16,
                transition: "all 0.3s"
            };
            $[218] = t111;
        } else {
            t111 = $[218];
        }
        let t112;
        if ($[219] !== t) {
            t112 = t("x\u2081<x\u2082", "x\u2081<x\u2082");
            $[219] = t;
            $[220] = t112;
        } else {
            t112 = $[220];
        }
        let t113;
        if ($[221] !== t) {
            t113 = t("+ ngo\xE0i | \u2212 trong | + ngo\xE0i", "+outside | \u2212inside | +outside");
            $[221] = t;
            $[222] = t113;
        } else {
            t113 = $[222];
        }
        let t114;
        if ($[223] !== t) {
            t114 = t("x<x\u2081 ho\u1EB7c x>x\u2082", "x<x\u2081 or x>x\u2082");
            $[223] = t;
            $[224] = t114;
        } else {
            t114 = $[224];
        }
        let t115;
        if ($[225] !== t) {
            t115 = t("x\u2081<x<x\u2082", "x\u2081<x<x\u2082");
            $[225] = t;
            $[226] = t115;
        } else {
            t115 = $[226];
        }
        let t116;
        if ($[227] !== t112 || $[228] !== t113 || $[229] !== t114 || $[230] !== t115) {
            t116 = {
                cond: "a>0, \u0394>0",
                roots: t112,
                sign: t113,
                pos: t114,
                neg: t115,
                c: "#1e8449",
                bg: "#eafaf1"
            };
            $[227] = t112;
            $[228] = t113;
            $[229] = t114;
            $[230] = t115;
            $[231] = t116;
        } else {
            t116 = $[231];
        }
        let t117;
        if ($[232] !== t) {
            t117 = t("\u22650 m\u1ECDi x, =0 t\u1EA1i x\u2080", "\u22650 for all x, =0 at x\u2080");
            $[232] = t;
            $[233] = t117;
        } else {
            t117 = $[233];
        }
        let t118;
        if ($[234] !== t) {
            t118 = t("m\u1ECDi x\u2260x\u2080", "all x\u2260x\u2080");
            $[234] = t;
            $[235] = t118;
        } else {
            t118 = $[235];
        }
        let t119;
        if ($[236] !== t) {
            t119 = t("\u2205 (kh\xF4ng \xE2m)", "\u2205 (not negative)");
            $[236] = t;
            $[237] = t119;
        } else {
            t119 = $[237];
        }
        let t120;
        if ($[238] !== t117 || $[239] !== t118 || $[240] !== t119) {
            t120 = {
                cond: "a>0, \u0394=0",
                roots: "x\u2080",
                sign: t117,
                pos: t118,
                neg: t119,
                c: "#1a5276",
                bg: "#eaf4fb"
            };
            $[238] = t117;
            $[239] = t118;
            $[240] = t119;
            $[241] = t120;
        } else {
            t120 = $[241];
        }
        let t121;
        if ($[242] !== t) {
            t121 = t("V\xF4 nghi\u1EC7m", "No roots");
            $[242] = t;
            $[243] = t121;
        } else {
            t121 = $[243];
        }
        let t122;
        if ($[244] !== t) {
            t122 = t(">0 m\u1ECDi x", ">0 for all x");
            $[244] = t;
            $[245] = t122;
        } else {
            t122 = $[245];
        }
        let t123;
        if ($[246] !== t121 || $[247] !== t122) {
            t123 = {
                cond: "a>0, \u0394<0",
                roots: t121,
                sign: t122,
                pos: "\u211D",
                neg: "\u2205",
                c: "#856404",
                bg: "#fff3cd"
            };
            $[246] = t121;
            $[247] = t122;
            $[248] = t123;
        } else {
            t123 = $[248];
        }
        let t124;
        if ($[249] !== t) {
            t124 = t("x\u2081<x\u2082", "x\u2081<x\u2082");
            $[249] = t;
            $[250] = t124;
        } else {
            t124 = $[250];
        }
        let t125;
        if ($[251] !== t) {
            t125 = t("\u2212 ngo\xE0i | + trong | \u2212 ngo\xE0i", "\u2212outside | +inside | \u2212outside");
            $[251] = t;
            $[252] = t125;
        } else {
            t125 = $[252];
        }
        let t126;
        if ($[253] !== t) {
            t126 = t("x\u2081<x<x\u2082", "x\u2081<x<x\u2082");
            $[253] = t;
            $[254] = t126;
        } else {
            t126 = $[254];
        }
        let t127;
        if ($[255] !== t) {
            t127 = t("x<x\u2081 ho\u1EB7c x>x\u2082", "x<x\u2081 or x>x\u2082");
            $[255] = t;
            $[256] = t127;
        } else {
            t127 = $[256];
        }
        let t128;
        if ($[257] !== t124 || $[258] !== t125 || $[259] !== t126 || $[260] !== t127) {
            t128 = {
                cond: "a<0, \u0394>0",
                roots: t124,
                sign: t125,
                pos: t126,
                neg: t127,
                c: "#922b21",
                bg: "#fdf2f2"
            };
            $[257] = t124;
            $[258] = t125;
            $[259] = t126;
            $[260] = t127;
            $[261] = t128;
        } else {
            t128 = $[261];
        }
        let t129;
        if ($[262] !== t) {
            t129 = t("\u22640 m\u1ECDi x, =0 t\u1EA1i x\u2080", "\u22640 for all x, =0 at x\u2080");
            $[262] = t;
            $[263] = t129;
        } else {
            t129 = $[263];
        }
        let t130;
        if ($[264] !== t) {
            t130 = t("\u2205 (kh\xF4ng d\u01B0\u01A1ng)", "\u2205 (not positive)");
            $[264] = t;
            $[265] = t130;
        } else {
            t130 = $[265];
        }
        let t131;
        if ($[266] !== t) {
            t131 = t("m\u1ECDi x\u2260x\u2080", "all x\u2260x\u2080");
            $[266] = t;
            $[267] = t131;
        } else {
            t131 = $[267];
        }
        let t132;
        if ($[268] !== t129 || $[269] !== t130 || $[270] !== t131) {
            t132 = {
                cond: "a<0, \u0394=0",
                roots: "x\u2080",
                sign: t129,
                pos: t130,
                neg: t131,
                c: "#6c3483",
                bg: "#f5eef8"
            };
            $[268] = t129;
            $[269] = t130;
            $[270] = t131;
            $[271] = t132;
        } else {
            t132 = $[271];
        }
        let t133;
        if ($[272] !== t) {
            t133 = t("V\xF4 nghi\u1EC7m", "No roots");
            $[272] = t;
            $[273] = t133;
        } else {
            t133 = $[273];
        }
        let t134;
        if ($[274] !== t) {
            t134 = t("<0 m\u1ECDi x", "<0 for all x");
            $[274] = t;
            $[275] = t134;
        } else {
            t134 = $[275];
        }
        let t135;
        if ($[276] !== t133 || $[277] !== t134) {
            t135 = {
                cond: "a<0, \u0394<0",
                roots: t133,
                sign: t134,
                pos: "\u2205",
                neg: "\u211D",
                c: "#555",
                bg: "#f4f6f7"
            };
            $[276] = t133;
            $[277] = t134;
            $[278] = t135;
        } else {
            t135 = $[278];
        }
        let t136;
        if ($[279] !== t116 || $[280] !== t120 || $[281] !== t123 || $[282] !== t128 || $[283] !== t132 || $[284] !== t135) {
            t136 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "70",
                style: t111,
                children: [
                    t116,
                    t120,
                    t123,
                    t128,
                    t132,
                    t135
                ].map(_Lesson21_DauTamThucBacHaiAnonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1699,
                columnNumber: 14
            }, this);
            $[279] = t116;
            $[280] = t120;
            $[281] = t123;
            $[282] = t128;
            $[283] = t132;
            $[284] = t135;
            $[285] = t136;
        } else {
            t136 = $[285];
        }
        if ($[286] !== t110 || $[287] !== t136) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k3",
                style: t108,
                children: [
                    t110,
                    t136
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1711,
                columnNumber: 13
            }, this);
            $[286] = t110;
            $[287] = t136;
            $[288] = t20;
        } else {
            t20 = $[288];
        }
        let t137;
        if ($[289] === Symbol.for("react.memo_cache_sentinel")) {
            t137 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[289] = t137;
        } else {
            t137 = $[289];
        }
        let t138;
        if ($[290] !== t) {
            t138 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[290] = t;
            $[291] = t138;
        } else {
            t138 = $[291];
        }
        let t139;
        if ($[292] !== t138) {
            t139 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\u270F\uFE0F",
                title: t138
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1738,
                columnNumber: 14
            }, this);
            $[292] = t138;
            $[293] = t139;
        } else {
            t139 = $[293];
        }
        let t140;
        if ($[294] === Symbol.for("react.memo_cache_sentinel")) {
            t140 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: 36,
                transition: "all 0.3s"
            };
            $[294] = t140;
        } else {
            t140 = $[294];
        }
        let t141;
        if ($[295] !== rev || $[296] !== t) {
            t141 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t140,
                children: [
                    {
                        id: "e1",
                        q: t("X\xE9t d\u1EA5u f(x) = x\xB2 \u2212 3x + 2.", "Determine the sign of f(x)=x\xB2\u22123x+2."),
                        a: [
                            t("a=1>0; \u0394=9\u22128=1>0", "a=1>0; \u0394=1>0"),
                            t("x\u2081=1, x\u2082=2", "x\u2081=1, x\u2082=2"),
                            t("f(x)>0 khi x<1 ho\u1EB7c x>2", "f(x)>0 when x<1 or x>2"),
                            t("f(x)<0 khi 1<x<2", "f(x)<0 when 1<x<2")
                        ]
                    },
                    {
                        id: "e2",
                        q: t("X\xE9t d\u1EA5u f(x) = \u22122x\xB2 + 4x \u2212 3.", "Sign of f(x)=\u22122x\xB2+4x\u22123."),
                        a: [
                            t("a=\u22122<0; \u0394=16\u221224=\u22128<0", "a=\u22122<0; \u0394=\u22128<0"),
                            t("\u0394<0 v\xE0 a<0 \u2192 f(x)<0 v\u1EDBi m\u1ECDi x \u2208 \u211D", "\u0394<0 and a<0 \u2192 f(x)<0 for all x\u2208\u211D")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("T\xECm x \u0111\u1EC3 f(x)=x\xB2\u22124x+4\u22650.", "Find x such that x\xB2\u22124x+4\u22650."),
                        a: [
                            t("f(x)=(x\u22122)\xB2", "f(x)=(x\u22122)\xB2"),
                            t("\u0394=16\u221216=0; x\u2080=2", "\u0394=0; double root x\u2080=2"),
                            t("(x\u22122)\xB2\u22650 v\u1EDBi m\u1ECDi x \u2192 nghi\u1EC7m: x\u2208\u211D", "(x\u22122)\xB2\u22650 for all x \u2192 solution: x\u2208\u211D")
                        ]
                    }
                ].map({
                    "Lesson21_DauTamThucBacHai[(anonymous)()]": (t142)=>{
                        const { id: id_3, q: q_3, a: a_1 } = t142;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        borderRadius: "10px 10px 0 0",
                                        background: "#f9f9f9",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 18,
                                                fontWeight: 600,
                                                marginBottom: 4
                                            },
                                            children: [
                                                "📝 ",
                                                t("B\xE0i t\u1EADp", "Exercise")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                            lineNumber: 1782,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7
                                            },
                                            children: q_3
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                            lineNumber: 1786,
                                            columnNumber: 63
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1777,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson21_DauTamThucBacHai[(anonymous)() > <button>.onClick]": ()=>tr(id_3)
                                    }["Lesson21_DauTamThucBacHai[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        display: "block",
                                        width: "100%",
                                        padding: "12px 20px",
                                        background: "black",
                                        color: "white",
                                        border: "none",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        cursor: "pointer",
                                        textAlign: "left"
                                    },
                                    children: rev[id_3] ? t("\u1EA8n \u0111\xE1p \xE1n \u25B2", "Hide \u25B2") : t("Xem \u0111\xE1p \xE1n \u25BC", "Show \u25BC")
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1789,
                                    columnNumber: 37
                                }, this),
                                rev[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_1.map(_Lesson21_DauTamThucBacHaiAnonymousA_1Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1802,
                                    columnNumber: 158
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                            lineNumber: 1777,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson21_DauTamThucBacHai[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1758,
                columnNumber: 14
            }, this);
            $[295] = rev;
            $[296] = t;
            $[297] = t141;
        } else {
            t141 = $[297];
        }
        if ($[298] !== t139 || $[299] !== t141) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "th",
                style: t137,
                children: [
                    t139,
                    t141
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1816,
                columnNumber: 13
            }, this);
            $[298] = t139;
            $[299] = t141;
            $[300] = t21;
        } else {
            t21 = $[300];
        }
        t7 = "mg";
        if ($[301] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83C\uDFAE",
                title: "Mini Game"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1829,
                columnNumber: 12
            }, this);
            $[301] = t8;
            $[302] = t9;
        } else {
            t8 = $[301];
            t9 = $[302];
        }
        let t142;
        if ($[303] === Symbol.for("react.memo_cache_sentinel")) {
            t142 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s"
            };
            $[303] = t142;
        } else {
            t142 = $[303];
        }
        let t143;
        if ($[304] !== t) {
            t143 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[304] = t;
            $[305] = t143;
        } else {
            t143 = $[305];
        }
        let t144;
        if ($[306] !== t) {
            t144 = t("5 c\xE2u", "5 Q");
            $[306] = t;
            $[307] = t144;
        } else {
            t144 = $[307];
        }
        let t145;
        if ($[308] !== t143 || $[309] !== t144) {
            t145 = [
                "mc",
                "\uD83E\uDDE9",
                t143,
                t144
            ];
            $[308] = t143;
            $[309] = t144;
            $[310] = t145;
        } else {
            t145 = $[310];
        }
        let t146;
        if ($[311] !== t) {
            t146 = t("\u0110\xFAng / Sai", "True / False");
            $[311] = t;
            $[312] = t146;
        } else {
            t146 = $[312];
        }
        let t147;
        if ($[313] !== t) {
            t147 = t("5 th\u1EBB", "5 cards");
            $[313] = t;
            $[314] = t147;
        } else {
            t147 = $[314];
        }
        let t148;
        if ($[315] !== t146 || $[316] !== t147) {
            t148 = [
                "tf",
                "\uD83C\uDCCF",
                t146,
                t147
            ];
            $[315] = t146;
            $[316] = t147;
            $[317] = t148;
        } else {
            t148 = $[317];
        }
        let t149;
        if ($[318] !== t) {
            t149 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[318] = t;
            $[319] = t149;
        } else {
            t149 = $[319];
        }
        let t150;
        if ($[320] !== t) {
            t150 = t("3 c\xE2u", "3 items");
            $[320] = t;
            $[321] = t150;
        } else {
            t150 = $[321];
        }
        let t151;
        if ($[322] !== t149 || $[323] !== t150) {
            t151 = [
                "fill",
                "\u270D\uFE0F",
                t149,
                t150
            ];
            $[322] = t149;
            $[323] = t150;
            $[324] = t151;
        } else {
            t151 = $[324];
        }
        let t152;
        if ($[325] !== t145 || $[326] !== t148 || $[327] !== t151) {
            t152 = [
                t145,
                t148,
                t151
            ];
            $[325] = t145;
            $[326] = t148;
            $[327] = t151;
            $[328] = t152;
        } else {
            t152 = $[328];
        }
        if ($[329] !== gm || $[330] !== t152) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t142,
                children: t152.map({
                    "Lesson21_DauTamThucBacHai[(anonymous)()]": (t153)=>{
                        const [mode, icon_0, label_0, sub] = t153;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson21_DauTamThucBacHai[(anonymous)() > <article>.onClick]": ()=>setGm(mode)
                            }["Lesson21_DauTamThucBacHai[(anonymous)() > <article>.onClick]"],
                            style: {
                                background: gm === mode ? "black" : "#f9f9f9",
                                color: gm === mode ? "white" : "black",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                padding: 20,
                                borderRadius: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 28,
                                        marginBottom: 6
                                    },
                                    children: icon_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1947,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1950,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1953,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                            lineNumber: 1938,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson21_DauTamThucBacHai[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 1935,
                columnNumber: 13
            }, this);
            $[329] = gm;
            $[330] = t152;
            $[331] = t10;
        } else {
            t10 = $[331];
        }
        t11 = gm === "mc" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: !md ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "#777",
                            fontSize: 15,
                            marginBottom: 8
                        },
                        children: [
                            t("C\xE2u", "Q"),
                            " ",
                            mi + 1,
                            "/",
                            mcQ.length,
                            " · ",
                            t("\u0110i\u1EC3m:", "Score:"),
                            " ",
                            msc
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 1970,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 20,
                            fontWeight: 600,
                            marginBottom: 20
                        },
                        children: mcQ[mi].q
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 1974,
                        columnNumber: 99
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQ[mi].o.map({
                            "Lesson21_DauTamThucBacHai[(anonymous)()]": (opt, i_7)=>{
                                let bg = "white";
                                let co = "black";
                                if (ms !== null) {
                                    if (i_7 === mcQ[mi].a) {
                                        bg = "#eafaf1";
                                        co = "#1e8449";
                                    } else {
                                        if (i_7 === ms) {
                                            bg = "#fdf2f2";
                                            co = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson21_DauTamThucBacHai[(anonymous)() > <button>.onClick]": ()=>sel(i_7)
                                    }["Lesson21_DauTamThucBacHai[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color: co,
                                        fontSize: 15,
                                        fontWeight: ms !== null && (i_7 === ms || i_7 === mcQ[mi].a) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_7),
                                        ". ",
                                        opt
                                    ]
                                }, i_7, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                    lineNumber: 1997,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson21_DauTamThucBacHai[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 1978,
                        columnNumber: 29
                    }, this),
                    ms !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 16,
                                    padding: "12px 16px",
                                    background: "white",
                                    borderRadius: 8,
                                    fontSize: 15,
                                    color: "#555",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                },
                                children: [
                                    "💬 ",
                                    mcQ[mi].ex
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 2012,
                                columnNumber: 82
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: nx,
                                style: {
                                    marginTop: 14,
                                    padding: "12px 28px",
                                    background: "black",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: "pointer"
                                },
                                children: mi + 1 < mcQ.length ? t("C\xE2u ti\u1EBFp \u25B6", "Next \u25B6") : t("Xem k\u1EBFt qu\u1EA3", "See Results")
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 2020,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: mri,
                onReset: rm,
                scoreLabel: msc === mcQ.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : msc >= 3 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2030,
                columnNumber: 144
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 1965,
            columnNumber: 26
        }, this);
        $[9] = fa;
        $[10] = fc;
        $[11] = gm;
        $[12] = lang;
        $[13] = md;
        $[14] = mh;
        $[15] = mi;
        $[16] = ms;
        $[17] = msc;
        $[18] = rev;
        $[19] = t;
        $[20] = tf;
        $[21] = th;
        $[22] = ti;
        $[23] = fQ;
        $[24] = fri;
        $[25] = fs;
        $[26] = rt;
        $[27] = t10;
        $[28] = t11;
        $[29] = t12;
        $[30] = t13;
        $[31] = t14;
        $[32] = t15;
        $[33] = t16;
        $[34] = t17;
        $[35] = t18;
        $[36] = t19;
        $[37] = t20;
        $[38] = t21;
        $[39] = t22;
        $[40] = t7;
        $[41] = t8;
        $[42] = t9;
        $[43] = ta;
        $[44] = tfC;
        $[45] = tn;
        $[46] = tri;
    } else {
        fQ = $[23];
        fri = $[24];
        fs = $[25];
        rt = $[26];
        t10 = $[27];
        t11 = $[28];
        t12 = $[29];
        t13 = $[30];
        t14 = $[31];
        t15 = $[32];
        t16 = $[33];
        t17 = $[34];
        t18 = $[35];
        t19 = $[36];
        t20 = $[37];
        t21 = $[38];
        t22 = $[39];
        t7 = $[40];
        t8 = $[41];
        t9 = $[42];
        ta = $[43];
        tfC = $[44];
        tn = $[45];
        tri = $[46];
    }
    let t23;
    if ($[332] !== gm || $[333] !== rt || $[334] !== t || $[335] !== ta || $[336] !== td || $[337] !== tf || $[338] !== tfC || $[339] !== ti || $[340] !== tn || $[341] !== tri || $[342] !== ts) {
        t23 = gm === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: !td ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "#777",
                            fontSize: 15,
                            marginBottom: 14
                        },
                        children: [
                            t("Th\u1EBB", "Card"),
                            " ",
                            ti + 1,
                            "/",
                            tfC.length,
                            " · ",
                            t("\u0110i\u1EC3m:", "Score:"),
                            " ",
                            ts
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 2102,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        style: {
                            background: "white",
                            borderRadius: 10,
                            padding: 24,
                            marginBottom: 20,
                            textAlign: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 18,
                                    lineHeight: 1.7,
                                    marginBottom: 24
                                },
                                children: tfC[ti].s
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 2113,
                                columnNumber: 12
                            }, this),
                            !tf ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 16,
                                    justifyContent: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson21_DauTamThucBacHai[<button>.onClick]": ()=>ta(true)
                                        }["Lesson21_DauTamThucBacHai[<button>.onClick]"],
                                        style: {
                                            padding: "12px 36px",
                                            background: "#eafaf1",
                                            color: "#1e8449",
                                            border: "2px solid #1e8449",
                                            borderRadius: 8,
                                            fontWeight: 700,
                                            fontSize: 16,
                                            cursor: "pointer"
                                        },
                                        children: [
                                            "✅ ",
                                            t("\u0110\xDANG", "TRUE")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2121,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson21_DauTamThucBacHai[<button>.onClick]": ()=>ta(false)
                                        }["Lesson21_DauTamThucBacHai[<button>.onClick]"],
                                        style: {
                                            padding: "12px 36px",
                                            background: "#fdf2f2",
                                            color: "#922b21",
                                            border: "2px solid #922b21",
                                            borderRadius: 8,
                                            fontWeight: 700,
                                            fontSize: 16,
                                            cursor: "pointer"
                                        },
                                        children: [
                                            "❌ ",
                                            t("SAI", "FALSE")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2132,
                                        columnNumber: 54
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 2117,
                                columnNumber: 38
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "12px 16px",
                                            background: "#f9f9f9",
                                            borderRadius: 8,
                                            fontSize: 15,
                                            color: "#555",
                                            textAlign: "left",
                                            marginBottom: 14,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                        },
                                        children: [
                                            "💬 ",
                                            tfC[ti].ex
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2143,
                                        columnNumber: 57
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: tn,
                                        style: {
                                            padding: "12px 28px",
                                            background: "black",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 15,
                                            cursor: "pointer"
                                        },
                                        children: ti + 1 < tfC.length ? t("Th\u1EBB ti\u1EBFp \u25B6", "Next \u25B6") : t("Xem k\u1EBFt qu\u1EA3", "See Results")
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2152,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 2106,
                        columnNumber: 103
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: tri,
                onReset: rt,
                scoreLabel: ts === tfC.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2161,
                columnNumber: 158
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2097,
            columnNumber: 26
        }, this);
        $[332] = gm;
        $[333] = rt;
        $[334] = t;
        $[335] = ta;
        $[336] = td;
        $[337] = tf;
        $[338] = tfC;
        $[339] = ti;
        $[340] = tn;
        $[341] = tri;
        $[342] = ts;
        $[343] = t23;
    } else {
        t23 = $[343];
    }
    let t24;
    if ($[344] !== fQ || $[345] !== fa || $[346] !== fc || $[347] !== fri || $[348] !== fs || $[349] !== gm || $[350] !== t) {
        t24 = gm === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: !fc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 18,
                            fontWeight: 600,
                            marginBottom: 20
                        },
                        children: t("\u0110i\u1EC1n c\xE2u tr\u1EA3 l\u1EDDi", "Fill in the blanks")
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 2184,
                        columnNumber: 17
                    }, this),
                    fQ.map({
                        "Lesson21_DauTamThucBacHai[fQ.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 15,
                                            color: "#777",
                                            marginBottom: 6
                                        },
                                        children: [
                                            t("C\xE2u", "Q"),
                                            " ",
                                            qi + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2191,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 16,
                                            lineHeight: 1.7,
                                            marginBottom: 10
                                        },
                                        children: q_4.tp
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2195,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: fa[q_4.id] || "",
                                        onChange: {
                                            "Lesson21_DauTamThucBacHai[fQ.map() > <input>.onChange]": (e_1)=>setFa({
                                                    "Lesson21_DauTamThucBacHai[fQ.map() > <input>.onChange > setFa()]": (p_0)=>({
                                                            ...p_0,
                                                            [q_4.id]: e_1.target.value
                                                        })
                                                }["Lesson21_DauTamThucBacHai[fQ.map() > <input>.onChange > setFa()]"])
                                        }["Lesson21_DauTamThucBacHai[fQ.map() > <input>.onChange]"],
                                        placeholder: t("Nh\u1EADp \u0111\xE1p \xE1n...", "Answer..."),
                                        style: {
                                            width: "100%",
                                            padding: "12px 16px",
                                            borderRadius: 8,
                                            fontSize: 15,
                                            outline: "none",
                                            border: "1px solid #ddd",
                                            background: "white",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                            boxSizing: "border-box"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                        lineNumber: 2199,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, q_4.id, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                                lineNumber: 2189,
                                columnNumber: 63
                            }, this)
                    }["Lesson21_DauTamThucBacHai[fQ.map()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "Lesson21_DauTamThucBacHai[<button>.onClick]": ()=>setFc(true)
                        }["Lesson21_DauTamThucBacHai[<button>.onClick]"],
                        style: {
                            padding: "12px 32px",
                            background: "black",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            cursor: "pointer"
                        },
                        children: t("Ki\u1EC3m tra", "Check Answers")
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                        lineNumber: 2217,
                        columnNumber: 51
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: fri,
                onReset: {
                    "Lesson21_DauTamThucBacHai[<RS>.onReset]": ()=>{
                        setFa({});
                        setFc(false);
                    }
                }["Lesson21_DauTamThucBacHai[<RS>.onReset]"],
                scoreLabel: fs === fQ.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fs >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2228,
                columnNumber: 64
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2179,
            columnNumber: 28
        }, this);
        $[344] = fQ;
        $[345] = fa;
        $[346] = fc;
        $[347] = fri;
        $[348] = fs;
        $[349] = gm;
        $[350] = t;
        $[351] = t24;
    } else {
        t24 = $[351];
    }
    let t25;
    if ($[352] !== t10 || $[353] !== t11 || $[354] !== t23 || $[355] !== t24 || $[356] !== t7 || $[357] !== t8 || $[358] !== t9) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            id: t7,
            style: t8,
            children: [
                t9,
                t10,
                t11,
                t23,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2247,
            columnNumber: 11
        }, this);
        $[352] = t10;
        $[353] = t11;
        $[354] = t23;
        $[355] = t24;
        $[356] = t7;
        $[357] = t8;
        $[358] = t9;
        $[359] = t25;
    } else {
        t25 = $[359];
    }
    let t26;
    if ($[360] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2261,
            columnNumber: 11
        }, this);
        $[360] = t26;
    } else {
        t26 = $[360];
    }
    let t27;
    if ($[361] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[361] = t27;
    } else {
        t27 = $[361];
    }
    let t28;
    if ($[362] !== t) {
        t28 = t("B\xE0i 21 / Ch\u01B0\u01A1ng VII", "Lesson 21 / Chapter VII");
        $[362] = t;
        $[363] = t28;
    } else {
        t28 = $[363];
    }
    let t29;
    if ($[364] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t27,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2290,
            columnNumber: 11
        }, this);
        $[364] = t28;
        $[365] = t29;
    } else {
        t29 = $[365];
    }
    let t30;
    let t31;
    if ($[366] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: ".reveal{opacity:0;transform:translateY(28px) scale(0.97);transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1);will-change:opacity,transform;}.reveal.visible{opacity:1;transform:translateY(0) scale(1);}.reveal[data-reveal-stagger].visible{opacity:1;transform:none;}.reveal[data-reveal-stagger]>*{opacity:0;transform:translateY(24px) scale(0.97);will-change:opacity,transform;}header.reveal{transform:translateY(-18px);opacity:0;}header.reveal.visible{opacity:1;transform:translateY(0);}article{transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease;border-radius:10px;padding:8px;}article:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 12px 28px rgba(0,0,0,0.12);}"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2299,
            columnNumber: 11
        }, this);
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2300,
            columnNumber: 11
        }, this);
        $[366] = t30;
        $[367] = t31;
    } else {
        t30 = $[366];
        t31 = $[367];
    }
    let t32;
    if ($[368] !== t12 || $[369] !== t13 || $[370] !== t14 || $[371] !== t15 || $[372] !== t16 || $[373] !== t17 || $[374] !== t18 || $[375] !== t19 || $[376] !== t20 || $[377] !== t21 || $[378] !== t25 || $[379] !== t29) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t12,
            children: [
                t13,
                t14,
                t15,
                t16,
                t17,
                t18,
                t19,
                t20,
                t21,
                t25,
                t26,
                t29,
                t30,
                t31
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2309,
            columnNumber: 11
        }, this);
        $[368] = t12;
        $[369] = t13;
        $[370] = t14;
        $[371] = t15;
        $[372] = t16;
        $[373] = t17;
        $[374] = t18;
        $[375] = t19;
        $[376] = t20;
        $[377] = t21;
        $[378] = t25;
        $[379] = t29;
        $[380] = t32;
    } else {
        t32 = $[380];
    }
    let t33;
    if ($[381] !== t22 || $[382] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t22,
            children: t32
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
            lineNumber: 2328,
            columnNumber: 11
        }, this);
        $[381] = t22;
        $[382] = t32;
        $[383] = t33;
    } else {
        t33 = $[383];
    }
    return t33;
}
_s(Lesson21_DauTamThucBacHai, "3e5ld66n3Vcdr6IFVQyUkgXiBp8=");
_c2 = Lesson21_DauTamThucBacHai;
function _Lesson21_DauTamThucBacHaiAnonymousA_1Map(l, i_6) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: l
    }, i_6, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
        lineNumber: 2338,
        columnNumber: 10
    }, this);
}
function _Lesson21_DauTamThucBacHaiAnonymous3(card, i_5) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: 16,
            borderRadius: 10,
            background: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 15,
                    fontWeight: 700,
                    color: card.c,
                    background: card.bg,
                    padding: "4px 10px",
                    borderRadius: 6,
                    display: "inline-block",
                    marginBottom: 8
                },
                children: card.cond
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2350,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#555",
                    marginBottom: 4
                },
                children: [
                    "📋 ",
                    card.sign
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2360,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#1e8449",
                    marginBottom: 2
                },
                children: [
                    "\u2705 f(x)>0: ",
                    card.pos
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2364,
                columnNumber: 28
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#922b21"
                },
                children: [
                    "\u274C f(x)<0: ",
                    card.neg
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                lineNumber: 2368,
                columnNumber: 43
            }, this)
        ]
    }, i_5, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
        lineNumber: 2345,
        columnNumber: 10
    }, this);
}
function _Lesson21_DauTamThucBacHaiAnonymous2(row, ri) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        style: {
            background: ri === 0 ? "#0B4F5C" : "white"
        },
        children: row.map({
            "Lesson21_DauTamThucBacHai[(anonymous)() > row.map()]": (cell, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    style: {
                        padding: "10px 14px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        color: ri === 0 ? "white" : cell === "0" ? "#1a5276" : cell === "\u2212" ? "#922b21" : cell === "+" ? "#1e8449" : "#555",
                        fontWeight: cell === "0" || cell === "+" || cell === "\u2212" ? 700 : 400,
                        fontFamily: "monospace",
                        fontSize: 15
                    },
                    children: cell
                }, ci, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
                    lineNumber: 2377,
                    columnNumber: 77
                }, this)
        }["Lesson21_DauTamThucBacHai[(anonymous)() > row.map()]"])
    }, ri, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
        lineNumber: 2374,
        columnNumber: 10
    }, this);
}
function _Lesson21_DauTamThucBacHaiTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson21_DauTamThucBacHaiTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson21_DauTamThucBacHaiAnonymous(o, i_4) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: [
            "• ",
            o
        ]
    }, i_4, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson21_DauTamThucBacHai.js",
        lineNumber: 2397,
        columnNumber: 10
    }, this);
}
function _Lesson21_DauTamThucBacHaiTnSetTi(i_3) {
    return i_3 + 1;
}
function _Lesson21_DauTamThucBacHaiTaSetTs(s_2) {
    return s_2 + 1;
}
function _Lesson21_DauTamThucBacHaiNxSetMi(i_2) {
    return i_2 + 1;
}
function _Lesson21_DauTamThucBacHaiSelSetMsc(s_1) {
    return s_1 + 1;
}
function _Lesson21_DauTamThucBacHaiCfAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson21_DauTamThucBacHaiSc(id) {
    const el_2 = document.getElementById(id);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson21_DauTamThucBacHaiUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson21_DauTamThucBacHaiUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp4, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson21_DauTamThucBacHai[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson21_DauTamThucBacHai[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp4(entries, observer) {
    entries.forEach({
        "Lesson21_DauTamThucBacHai[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const s_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson21_DauTamThucBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (c_0, i_0)=>setTimeout({
                                "Lesson21_DauTamThucBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    c_0.style.opacity = "1";
                                    c_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson21_DauTamThucBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * s_0)
                    }["Lesson21_DauTamThucBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson21_DauTamThucBacHai[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson21_DauTamThucBacHaiUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const s = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson21_DauTamThucBacHai[useEffect() > els.forEach() > (anonymous)()]": (c, i)=>{
                c.style.opacity = "0";
                c.style.transform = "translateY(24px) scale(0.97)";
                c.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * s}ms,transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * s}ms`;
                c.style.willChange = "opacity,transform";
            }
        }["Lesson21_DauTamThucBacHai[useEffect() > els.forEach() > (anonymous)()]"]);
    }
}
function _temp(i_0) {
    return i_0.correct;
}
function _temp2(i) {
    return i.correct;
}
function _temp3(i_1) {
    return i_1.correct;
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SH");
__turbopack_context__.k.register(_c1, "RS");
__turbopack_context__.k.register(_c2, "Lesson21_DauTamThucBacHai");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_350d2e61._.js.map