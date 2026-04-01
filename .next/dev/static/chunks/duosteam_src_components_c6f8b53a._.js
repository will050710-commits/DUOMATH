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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson18_HinhHocDoLuong1
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
    if ($[0] !== "fdb31a81ee9b47d0b3a5e2ad464777a7a66568301bc7d0066b83dda58f5cb31b") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fdb31a81ee9b47d0b3a5e2ad464777a7a66568301bc7d0066b83dda58f5cb31b";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
    if ($[0] !== "fdb31a81ee9b47d0b3a5e2ad464777a7a66568301bc7d0066b83dda58f5cb31b") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fdb31a81ee9b47d0b3a5e2ad464777a7a66568301bc7d0066b83dda58f5cb31b";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                                lineNumber: 198,
                                                columnNumber: 67
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 198,
                                        columnNumber: 144
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 188,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 181,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, idx, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 257,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
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
function Lesson18_HinhHocDoLuong1() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(391);
    if ($[0] !== "fdb31a81ee9b47d0b3a5e2ad464777a7a66568301bc7d0066b83dda58f5cb31b") {
        for(let $i = 0; $i < 391; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fdb31a81ee9b47d0b3a5e2ad464777a7a66568301bc7d0066b83dda58f5cb31b";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson18_HinhHocDoLuong1UseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson18_HinhHocDoLuong1[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson18_HinhHocDoLuong1[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    const sc = _Lesson18_HinhHocDoLuong1Sc;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson18_HinhHocDoLuong1[tr]": (id_0)=>setRev({
                    "Lesson18_HinhHocDoLuong1[tr > setRev()]": (p)=>({
                            ...p,
                            [id_0]: !p[id_0]
                        })
                }["Lesson18_HinhHocDoLuong1[tr > setRev()]"])
        })["Lesson18_HinhHocDoLuong1[tr]"];
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
    let t23;
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
                q: t("B\xE1n k\xEDnh \u0111\u01B0\u1EDDng tr\xF2n ngo\u1EA1i ti\u1EBFp tam gi\xE1c R li\xEAn h\u1EC7 v\u1EDBi \u0110\u1ECBnh l\xED Sin nh\u01B0 th\u1EBF n\xE0o?", "How does circumradius R relate to the Law of Sines?"),
                o: [
                    "R = a\xB7sinA",
                    "R = a/(2sinA)",
                    "R = 2a\xB7sinA",
                    "R = sinA/a"
                ],
                a: 1,
                ex: t("T\u1EEB \u0110\u1ECBnh l\xED Sin: a/sinA=2R \u2192 R=a/(2sinA).", "From Law of Sines: a/sinA=2R \u2192 R=a/(2sinA).")
            },
            {
                q: t("\u0110\u01B0\u1EDDng trung tuy\u1EBFn ma c\u1EE7a tam gi\xE1c ABC t\xEDnh theo c\xF4ng th\u1EE9c?", "The median ma of triangle ABC is given by?"),
                o: [
                    "ma\xB2=b\xB2+c\xB2\u2212a\xB2/2",
                    "ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4",
                    "ma=\u221A(b\xB2+c\xB2)/2",
                    "ma=(b+c)/2"
                ],
                a: 1,
                ex: t("C\xF4ng th\u1EE9c \u0111\u01B0\u1EDDng trung tuy\u1EBFn: ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4.", "Median formula: ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4.")
            },
            {
                q: t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a. B\xE1n k\xEDnh n\u1ED9i ti\u1EBFp r = ?", "Equilateral triangle side a. Inradius r = ?"),
                o: [
                    "a\u221A3/6",
                    "a\u221A3/3",
                    "a/2",
                    "a\u221A3/2"
                ],
                a: 0,
                ex: t("r=a\u221A3/6 (= R/2 v\u1EDBi R=a\u221A3/3 l\xE0 ngo\u1EA1i ti\u1EBFp).", "r=a\u221A3/6 (= R/2 where R=a\u221A3/3 is circumradius).")
            },
            {
                q: t("C\xF4ng th\u1EE9c li\xEAn h\u1EC7 b\xE1n k\xEDnh n\u1ED9i ti\u1EBFp r, di\u1EC7n t\xEDch S v\xE0 n\u1EEDa chu vi p l\xE0?", "The formula relating inradius r, area S and semi-perimeter p is?"),
                o: [
                    "S=r\xB7p",
                    "S=r/p",
                    "r=S\xB7p",
                    "p=r\xB7S"
                ],
                a: 0,
                ex: t("S=r\xB7p, trong \u0111\xF3 p=(a+b+c)/2 l\xE0 n\u1EEDa chu vi.", "S=r\xB7p, where p=(a+b+c)/2 is the semi-perimeter.")
            },
            {
                q: t("Trong tam gi\xE1c ABC vu\xF4ng t\u1EA1i C, b\xE1n k\xEDnh ngo\u1EA1i ti\u1EBFp R = ?", "Right triangle with right angle at C. Circumradius R = ?"),
                o: [
                    "a/2",
                    "b/2",
                    "c/2",
                    "(a+b)/2"
                ],
                a: 2,
                ex: t("Trong tam gi\xE1c vu\xF4ng, c\u1EA1nh huy\u1EC1n c l\xE0 \u0111\u01B0\u1EDDng k\xEDnh \u2192 R=c/2.", "In a right triangle, hypotenuse c is diameter \u2192 R=c/2.")
            }
        ];
        tfC = [
            {
                s: t("\u0110\u01B0\u1EDDng tr\xF2n ngo\u1EA1i ti\u1EBFp tam gi\xE1c \u0111i qua c\u1EA3 3 \u0111\u1EC9nh.", "The circumscribed circle passes through all 3 vertices."),
                a: true,
                ex: t("\u0110\xDANG \u2014 \u0111\u1ECBnh ngh\u0129a \u0111\u01B0\u1EDDng tr\xF2n ngo\u1EA1i ti\u1EBFp.", "TRUE \u2014 definition of circumscribed circle.")
            },
            {
                s: t("B\xE1n k\xEDnh n\u1ED9i ti\u1EBFp r = S/p v\u1EDBi S l\xE0 di\u1EC7n t\xEDch v\xE0 p l\xE0 n\u1EEDa chu vi.", "Inradius r = S/p where S = area and p = semi-perimeter."),
                a: true,
                ex: t("\u0110\xDANG \u2014 t\u1EEB S=r\xB7p \u2192 r=S/p.", "TRUE \u2014 from S=r\xB7p \u2192 r=S/p.")
            },
            {
                s: t("Tam gi\xE1c \u0111\u1EC1u lu\xF4n c\xF3 R = 2r.", "An equilateral triangle always has R = 2r."),
                a: true,
                ex: t("\u0110\xDANG \u2014 \u0111\u1EC1u: R=a\u221A3/3, r=a\u221A3/6 \u2192 R=2r.", "TRUE \u2014 equilateral: R=a\u221A3/3, r=a\u221A3/6 \u2192 R=2r.")
            },
            {
                s: t("C\xF4ng th\u1EE9c \u0111\u01B0\u1EDDng trung tuy\u1EBFn: ma\xB2=b\xB2+c\xB2\u2212a\xB2/2.", "Median formula: ma\xB2=b\xB2+c\xB2\u2212a\xB2/2."),
                a: false,
                ex: t("SAI \u2014 \u0111\xFAng l\xE0 ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4.", "FALSE \u2014 correct is ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4.")
            },
            {
                s: t("Trong tam gi\xE1c vu\xF4ng t\u1EA1i C, \u0111\u01B0\u1EDDng trung tuy\u1EBFn mc=c/2.", "Right triangle at C: median mc=c/2."),
                a: true,
                ex: t("\u0110\xDANG \u2014 trong tam gi\xE1c vu\xF4ng, trung tuy\u1EBFn t\u1EDBi c\u1EA1nh huy\u1EC1n = n\u1EEDa c\u1EA1nh huy\u1EC1n.", "TRUE \u2014 in a right triangle, median to hypotenuse = half hypotenuse.")
            }
        ];
        fQ = [
            {
                id: "f1",
                tp: t("B\xE1n k\xEDnh ngo\u1EA1i ti\u1EBFp: R = a / (2 \xB7 ___)", "Circumradius: R = a / (2 \xB7 ___)"),
                ans: "sinA",
                alt: [
                    "sina",
                    "sin A",
                    "sinA",
                    "sin(A)"
                ],
                h: ""
            },
            {
                id: "f2",
                tp: t("Di\u1EC7n t\xEDch tam gi\xE1c: S = r \xB7 ___ (r = b\xE1n k\xEDnh n\u1ED9i ti\u1EBFp)", "Area: S = r \xB7 ___ (r = inradius)"),
                ans: "p",
                alt: [
                    "p"
                ],
                h: t("p = n\u1EEDa chu vi", "p = semi-perimeter")
            },
            {
                id: "f3",
                tp: t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a: \u0111\u01B0\u1EDDng trung tuy\u1EBFn m = (a___ )/2", "Equilateral side a: median m = (a___ )/2"),
                ans: "\u221A3",
                alt: [
                    "\u221A3",
                    "sqrt(3)",
                    "c\u0103n 3",
                    "can 3"
                ],
                h: t("Trung tuy\u1EBFn = chi\u1EC1u cao trong tam gi\xE1c \u0111\u1EC1u", "Median = altitude in equilateral triangle")
            }
        ];
        const cf = {
            "Lesson18_HinhHocDoLuong1[cf]": (id_1)=>{
                const q_0 = fQ.find({
                    "Lesson18_HinhHocDoLuong1[cf > fQ.find()]": (q)=>q.id === id_1
                }["Lesson18_HinhHocDoLuong1[cf > fQ.find()]"]);
                const r = (fa[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                return [
                    q_0.ans,
                    ...q_0.alt || []
                ].map(_Lesson18_HinhHocDoLuong1CfAnonymous).includes(r);
            }
        }["Lesson18_HinhHocDoLuong1[cf]"];
        fs = fc ? fQ.filter({
            "Lesson18_HinhHocDoLuong1[fQ.filter()]": (q_1)=>cf(q_1.id)
        }["Lesson18_HinhHocDoLuong1[fQ.filter()]"]).length : null;
        const sel = {
            "Lesson18_HinhHocDoLuong1[sel]": (i_1)=>{
                if (ms !== null) {
                    return;
                }
                setMs(i_1);
                const c_1 = i_1 === mcQ[mi].a;
                if (c_1) {
                    setMsc(_Lesson18_HinhHocDoLuong1SelSetMsc);
                }
                setMh({
                    "Lesson18_HinhHocDoLuong1[sel > setMh()]": (h)=>[
                            ...h,
                            {
                                q: mi,
                                s: i_1,
                                c: c_1
                            }
                        ]
                }["Lesson18_HinhHocDoLuong1[sel > setMh()]"]);
            }
        }["Lesson18_HinhHocDoLuong1[sel]"];
        const nx = {
            "Lesson18_HinhHocDoLuong1[nx]": ()=>{
                if (mi + 1 >= mcQ.length) {
                    setMd(true);
                } else {
                    setMi(_Lesson18_HinhHocDoLuong1NxSetMi);
                    setMs(null);
                }
            }
        }["Lesson18_HinhHocDoLuong1[nx]"];
        let t24;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = ({
                "Lesson18_HinhHocDoLuong1[rm]": ()=>{
                    setMi(0);
                    setMs(null);
                    setMsc(0);
                    setMd(false);
                    setMh([]);
                }
            })["Lesson18_HinhHocDoLuong1[rm]"];
            $[48] = t24;
        } else {
            t24 = $[48];
        }
        const rm = t24;
        ta = ({
            "Lesson18_HinhHocDoLuong1[ta]": (a_0)=>{
                if (tf) {
                    return;
                }
                setTf(true);
                const c_2 = a_0 === tfC[ti].a;
                if (c_2) {
                    setTs(_Lesson18_HinhHocDoLuong1TaSetTs);
                }
                setTh({
                    "Lesson18_HinhHocDoLuong1[ta > setTh()]": (h_0)=>[
                            ...h_0,
                            {
                                q: ti,
                                g: a_0,
                                c: c_2
                            }
                        ]
                }["Lesson18_HinhHocDoLuong1[ta > setTh()]"]);
            }
        })["Lesson18_HinhHocDoLuong1[ta]"];
        tn = ({
            "Lesson18_HinhHocDoLuong1[tn]": ()=>{
                if (ti + 1 >= tfC.length) {
                    setTd(true);
                } else {
                    setTi(_Lesson18_HinhHocDoLuong1TnSetTi);
                    setTf(false);
                }
            }
        })["Lesson18_HinhHocDoLuong1[tn]"];
        let t25;
        if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
            t25 = ({
                "Lesson18_HinhHocDoLuong1[rt]": ()=>{
                    setTi(0);
                    setTf(false);
                    setTs(0);
                    setTd(false);
                    setTh([]);
                }
            })["Lesson18_HinhHocDoLuong1[rt]"];
            $[49] = t25;
        } else {
            t25 = $[49];
        }
        rt = t25;
        const mri = mh.map({
            "Lesson18_HinhHocDoLuong1[mh.map()]": (h_1)=>({
                    correct: h_1.c,
                    qText: mcQ[h_1.q].q,
                    correctText: mcQ[h_1.q].o[mcQ[h_1.q].a],
                    yourText: mcQ[h_1.q].o[h_1.s]
                })
        }["Lesson18_HinhHocDoLuong1[mh.map()]"]);
        tri = th.map({
            "Lesson18_HinhHocDoLuong1[th.map()]": (h_2)=>({
                    correct: h_2.c,
                    qText: tfC[h_2.q].s,
                    correctText: tfC[h_2.q].a ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.g ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson18_HinhHocDoLuong1[th.map()]"]);
        fri = fc ? fQ.map({
            "Lesson18_HinhHocDoLuong1[fQ.map()]": (q_2)=>({
                    correct: cf(q_2.id),
                    qText: q_2.tp,
                    correctText: q_2.ans,
                    yourText: fa[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson18_HinhHocDoLuong1[fQ.map()]"]) : [];
        let t26;
        if ($[50] !== t) {
            t26 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[50] = t;
            $[51] = t26;
        } else {
            t26 = $[51];
        }
        let t27;
        if ($[52] !== t26) {
            t27 = [
                "w",
                "\uD83D\uDE80",
                t26
            ];
            $[52] = t26;
            $[53] = t27;
        } else {
            t27 = $[53];
        }
        let t28;
        if ($[54] !== t) {
            t28 = t("1. \u0110\u01B0\u1EDDng Tr\xF2n NT/NTip", "1. Circum/Inradius");
            $[54] = t;
            $[55] = t28;
        } else {
            t28 = $[55];
        }
        let t29;
        if ($[56] !== t28) {
            t29 = [
                "k1",
                "\uD83D\uDCD6",
                t28
            ];
            $[56] = t28;
            $[57] = t29;
        } else {
            t29 = $[57];
        }
        let t30;
        if ($[58] !== t) {
            t30 = t("2. \u0110\u01B0\u1EDDng Trung Tuy\u1EBFn", "2. Medians");
            $[58] = t;
            $[59] = t30;
        } else {
            t30 = $[59];
        }
        let t31;
        if ($[60] !== t30) {
            t31 = [
                "k2",
                "\uD83D\uDCD6",
                t30
            ];
            $[60] = t30;
            $[61] = t31;
        } else {
            t31 = $[61];
        }
        let t32;
        if ($[62] !== t) {
            t32 = t("3. \u0110\u01B0\u1EDDng Cao", "3. Altitudes");
            $[62] = t;
            $[63] = t32;
        } else {
            t32 = $[63];
        }
        let t33;
        if ($[64] !== t32) {
            t33 = [
                "k3",
                "\uD83D\uDCD6",
                t32
            ];
            $[64] = t32;
            $[65] = t33;
        } else {
            t33 = $[65];
        }
        let t34;
        if ($[66] !== t) {
            t34 = t("4. H\u1EC7 Th\u1EE9c \u0110\u1EB7c Bi\u1EC7t", "4. Special Cases");
            $[66] = t;
            $[67] = t34;
        } else {
            t34 = $[67];
        }
        let t35;
        if ($[68] !== t34) {
            t35 = [
                "k4",
                "\uD83D\uDCD6",
                t34
            ];
            $[68] = t34;
            $[69] = t35;
        } else {
            t35 = $[69];
        }
        let t36;
        if ($[70] !== t) {
            t36 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[70] = t;
            $[71] = t36;
        } else {
            t36 = $[71];
        }
        let t37;
        if ($[72] !== t36) {
            t37 = [
                "th",
                "\u270F\uFE0F",
                t36
            ];
            $[72] = t36;
            $[73] = t37;
        } else {
            t37 = $[73];
        }
        let t38;
        if ($[74] === Symbol.for("react.memo_cache_sentinel")) {
            t38 = [
                "mg",
                "\uD83C\uDFAE",
                "Mini Game"
            ];
            $[74] = t38;
        } else {
            t38 = $[74];
        }
        let t39;
        if ($[75] !== t27 || $[76] !== t29 || $[77] !== t31 || $[78] !== t33 || $[79] !== t35 || $[80] !== t37) {
            t39 = [
                t27,
                t29,
                t31,
                t33,
                t35,
                t37,
                t38
            ];
            $[75] = t27;
            $[76] = t29;
            $[77] = t31;
            $[78] = t33;
            $[79] = t35;
            $[80] = t37;
            $[81] = t39;
        } else {
            t39 = $[81];
        }
        const tabs = t39;
        if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
            t23 = {
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
            $[82] = t12;
            $[83] = t23;
        } else {
            t12 = $[82];
            t23 = $[83];
        }
        let t40;
        if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
            t40 = {
                marginBottom: 24
            };
            $[84] = t40;
        } else {
            t40 = $[84];
        }
        let t41;
        if ($[85] === Symbol.for("react.memo_cache_sentinel")) {
            t41 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[85] = t41;
        } else {
            t41 = $[85];
        }
        let t42;
        if ($[86] !== t) {
            t42 = t("Quay l\u1EA1i", "Back");
            $[86] = t;
            $[87] = t42;
        } else {
            t42 = $[87];
        }
        if ($[88] !== t42) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t40,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t41,
                    children: [
                        "← ",
                        t42
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                    lineNumber: 749,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 749,
                columnNumber: 13
            }, this);
            $[88] = t42;
            $[89] = t13;
        } else {
            t13 = $[89];
        }
        let t43;
        let t44;
        if ($[90] === Symbol.for("react.memo_cache_sentinel")) {
            t43 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t44 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C"
            };
            $[90] = t43;
            $[91] = t44;
        } else {
            t43 = $[90];
            t44 = $[91];
        }
        let t45;
        if ($[92] !== t) {
            t45 = t("Ch\u01B0\u01A1ng VI \xB7 H\xECnh H\u1ECDc \u0110o L\u01B0\u1EDDng", "Chapter VI \xB7 Geometry & Measurement");
            $[92] = t;
            $[93] = t45;
        } else {
            t45 = $[93];
        }
        let t46;
        if ($[94] !== t45) {
            t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t44,
                children: t45
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 787,
                columnNumber: 13
            }, this);
            $[94] = t45;
            $[95] = t46;
        } else {
            t46 = $[95];
        }
        let t47;
        if ($[96] === Symbol.for("react.memo_cache_sentinel")) {
            t47 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[96] = t47;
        } else {
            t47 = $[96];
        }
        let t48;
        if ($[97] !== t) {
            t48 = t("B\xE0i 18: H\xECnh H\u1ECDc Ph\u1EB3ng \u2013 H\u1EC7 Th\u1EE9c L\u01B0\u1EE3ng", "Lesson 18: Plane Geometry \u2013 Metric Relations");
            $[97] = t;
            $[98] = t48;
        } else {
            t48 = $[98];
        }
        let t49;
        if ($[99] !== t48) {
            t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t47,
                children: t48
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 814,
                columnNumber: 13
            }, this);
            $[99] = t48;
            $[100] = t49;
        } else {
            t49 = $[100];
        }
        let t50;
        if ($[101] !== t46 || $[102] !== t49) {
            t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t46,
                    t49
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 822,
                columnNumber: 13
            }, this);
            $[101] = t46;
            $[102] = t49;
            $[103] = t50;
        } else {
            t50 = $[103];
        }
        let t51;
        let t52;
        if ($[104] === Symbol.for("react.memo_cache_sentinel")) {
            t51 = {
                display: "flex",
                gap: 10
            };
            t52 = ({
                "Lesson18_HinhHocDoLuong1[<button>.onClick]": ()=>setLang("vi")
            })["Lesson18_HinhHocDoLuong1[<button>.onClick]"];
            $[104] = t51;
            $[105] = t52;
        } else {
            t51 = $[104];
            t52 = $[105];
        }
        const t53 = lang === "vi" ? "black" : "#f9f9f9";
        const t54 = lang === "vi" ? "white" : "black";
        let t55;
        if ($[106] !== t53 || $[107] !== t54) {
            t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t52,
                style: {
                    background: t53,
                    color: t54,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 849,
                columnNumber: 13
            }, this);
            $[106] = t53;
            $[107] = t54;
            $[108] = t55;
        } else {
            t55 = $[108];
        }
        let t56;
        if ($[109] === Symbol.for("react.memo_cache_sentinel")) {
            t56 = ({
                "Lesson18_HinhHocDoLuong1[<button>.onClick]": ()=>setLang("en")
            })["Lesson18_HinhHocDoLuong1[<button>.onClick]"];
            $[109] = t56;
        } else {
            t56 = $[109];
        }
        const t57 = lang === "en" ? "black" : "#f9f9f9";
        const t58 = lang === "en" ? "white" : "black";
        let t59;
        if ($[110] !== t57 || $[111] !== t58) {
            t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t56,
                style: {
                    background: t57,
                    color: t58,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 878,
                columnNumber: 13
            }, this);
            $[110] = t57;
            $[111] = t58;
            $[112] = t59;
        } else {
            t59 = $[112];
        }
        let t60;
        if ($[113] !== t55 || $[114] !== t59) {
            t60 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t51,
                children: [
                    t55,
                    t59
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 896,
                columnNumber: 13
            }, this);
            $[113] = t55;
            $[114] = t59;
            $[115] = t60;
        } else {
            t60 = $[115];
        }
        if ($[116] !== t50 || $[117] !== t60) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t43,
                children: [
                    t50,
                    t60
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 904,
                columnNumber: 13
            }, this);
            $[116] = t50;
            $[117] = t60;
            $[118] = t14;
        } else {
            t14 = $[118];
        }
        let t61;
        let t62;
        if ($[119] === Symbol.for("react.memo_cache_sentinel")) {
            t61 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t62 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[119] = t61;
            $[120] = t62;
        } else {
            t61 = $[119];
            t62 = $[120];
        }
        let t63;
        if ($[121] !== t) {
            t63 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Objectives");
            $[121] = t;
            $[122] = t63;
        } else {
            t63 = $[122];
        }
        let t64;
        if ($[123] !== t63) {
            t64 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t62,
                children: [
                    "🎯 ",
                    t63
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 942,
                columnNumber: 13
            }, this);
            $[123] = t63;
            $[124] = t64;
        } else {
            t64 = $[124];
        }
        let t65;
        if ($[125] !== t) {
            t65 = t("T\xEDnh b\xE1n k\xEDnh \u0111\u01B0\u1EDDng tr\xF2n ngo\u1EA1i ti\u1EBFp R v\xE0 n\u1ED9i ti\u1EBFp r c\u1EE7a tam gi\xE1c.", "Compute circumradius R and inradius r of a triangle.");
            $[125] = t;
            $[126] = t65;
        } else {
            t65 = $[126];
        }
        let t66;
        if ($[127] !== t) {
            t66 = t("\xC1p d\u1EE5ng c\xF4ng th\u1EE9c \u0111\u01B0\u1EDDng trung tuy\u1EBFn: ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4.", "Apply the median formula: ma\xB2=(2b\xB2+2c\xB2\u2212a\xB2)/4.");
            $[127] = t;
            $[128] = t66;
        } else {
            t66 = $[128];
        }
        let t67;
        if ($[129] !== t) {
            t67 = t("T\xEDnh \u0111\u01B0\u1EDDng cao ha = 2S/a.", "Compute altitude ha = 2S/a.");
            $[129] = t;
            $[130] = t67;
        } else {
            t67 = $[130];
        }
        let t68;
        if ($[131] !== t) {
            t68 = t("Nh\u1EADn bi\u1EBFt h\u1EC7 th\u1EE9c \u0111\u1EB7c bi\u1EC7t trong tam gi\xE1c vu\xF4ng v\xE0 \u0111\u1EC1u.", "Identify special formulas for right and equilateral triangles.");
            $[131] = t;
            $[132] = t68;
        } else {
            t68 = $[132];
        }
        let t69;
        if ($[133] !== t) {
            t69 = t("Li\xEAn h\u1EC7 R v\xE0 r qua chu vi v\xE0 di\u1EC7n t\xEDch.", "Connect R and r through perimeter and area.");
            $[133] = t;
            $[134] = t69;
        } else {
            t69 = $[134];
        }
        let t70;
        if ($[135] !== t65 || $[136] !== t66 || $[137] !== t67 || $[138] !== t68 || $[139] !== t69) {
            t70 = [
                t65,
                t66,
                t67,
                t68,
                t69
            ].map(_Lesson18_HinhHocDoLuong1Anonymous);
            $[135] = t65;
            $[136] = t66;
            $[137] = t67;
            $[138] = t68;
            $[139] = t69;
            $[140] = t70;
        } else {
            t70 = $[140];
        }
        if ($[141] !== t64 || $[142] !== t70) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t61,
                children: [
                    t64,
                    t70
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1001,
                columnNumber: 13
            }, this);
            $[141] = t64;
            $[142] = t70;
            $[143] = t15;
        } else {
            t15 = $[143];
        }
        let t71;
        let t72;
        if ($[144] === Symbol.for("react.memo_cache_sentinel")) {
            t71 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t72 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[144] = t71;
            $[145] = t72;
        } else {
            t71 = $[144];
            t72 = $[145];
        }
        if ($[146] !== tabs) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t71,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t72,
                    children: tabs.map({
                        "Lesson18_HinhHocDoLuong1[tabs.map()]": (t73)=>{
                            const [id_2, icon, label] = t73;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson18_HinhHocDoLuong1[tabs.map() > <button>.onClick]": ()=>sc(id_2)
                                }["Lesson18_HinhHocDoLuong1[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson18_HinhHocDoLuong1TabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson18_HinhHocDoLuong1TabsMapButtonOnMouseLeave,
                                children: [
                                    icon,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 1036,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson18_HinhHocDoLuong1[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                    lineNumber: 1033,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1033,
                columnNumber: 13
            }, this);
            $[146] = tabs;
            $[147] = t16;
        } else {
            t16 = $[147];
        }
        let t73;
        if ($[148] === Symbol.for("react.memo_cache_sentinel")) {
            t73 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[148] = t73;
        } else {
            t73 = $[148];
        }
        let t74;
        if ($[149] !== t) {
            t74 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[149] = t;
            $[150] = t74;
        } else {
            t74 = $[150];
        }
        let t75;
        if ($[151] !== t74) {
            t75 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDE80",
                title: t74
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1077,
                columnNumber: 13
            }, this);
            $[151] = t74;
            $[152] = t75;
        } else {
            t75 = $[152];
        }
        let t76;
        let t77;
        if ($[153] === Symbol.for("react.memo_cache_sentinel")) {
            t76 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t77 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[153] = t76;
            $[154] = t77;
        } else {
            t76 = $[153];
            t77 = $[154];
        }
        let t78;
        if ($[155] !== t) {
            t78 = t("C\xE1c nh\xE0 thi\u1EBFt k\u1EBF m\u1EA1ch \u0111i\u1EC7n, ki\u1EBFn tr\xFAc s\u01B0 x\xE2y v\xF2m, v\xE0 k\u1EF9 s\u01B0 c\u01A1 kh\xED th\u01B0\u1EDDng xuy\xEAn c\u1EA7n t\xEDnh \u0111\u01B0\u1EDDng tr\xF2n bao quanh ho\u1EB7c n\u1EB1m trong m\u1ED9t h\xECnh tam gi\xE1c. Nh\u1EEFng c\xF4ng th\u1EE9c h\u1EC7 th\u1EE9c l\u01B0\u1EE3ng trong tam gi\xE1c gi\xFAp gi\u1EA3i quy\u1EBFt ch\xEDnh x\xE1c c\xE1c b\xE0i to\xE1n \u0111\xF3.", "Circuit designers, arch architects, and mechanical engineers regularly need circles surrounding or inscribed in triangles. The metric relations of triangles solve these problems precisely.");
            $[155] = t;
            $[156] = t78;
        } else {
            t78 = $[156];
        }
        let t79;
        if ($[157] !== t78) {
            t79 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t77,
                children: t78
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1113,
                columnNumber: 13
            }, this);
            $[157] = t78;
            $[158] = t79;
        } else {
            t79 = $[158];
        }
        let t80;
        if ($[159] === Symbol.for("react.memo_cache_sentinel")) {
            t80 = {
                fontSize: 16
            };
            $[159] = t80;
        } else {
            t80 = $[159];
        }
        let t81;
        if ($[160] !== t) {
            t81 = t("N\u1EBFu \u0111\u01B0\u1EDDng tr\xF2n ngo\u1EA1i ti\u1EBFp tam gi\xE1c c\xF3 b\xE1n k\xEDnh R, th\xEC R li\xEAn h\u1EC7 g\xEC v\u1EDBi c\u1EA1nh v\xE0 g\xF3c c\u1EE7a tam gi\xE1c?", "If the circumscribed circle has radius R, how does R relate to the triangle's sides and angles?");
            $[160] = t;
            $[161] = t81;
        } else {
            t81 = $[161];
        }
        let t82;
        if ($[162] !== t81) {
            t82 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t80,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t81
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 1138,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1138,
                columnNumber: 13
            }, this);
            $[162] = t81;
            $[163] = t82;
        } else {
            t82 = $[163];
        }
        let t83;
        if ($[164] !== t79 || $[165] !== t82) {
            t83 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t76,
                children: [
                    t79,
                    t82
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1146,
                columnNumber: 13
            }, this);
            $[164] = t79;
            $[165] = t82;
            $[166] = t83;
        } else {
            t83 = $[166];
        }
        if ($[167] !== t75 || $[168] !== t83) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "w",
                style: t73,
                children: [
                    t75,
                    t83
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1154,
                columnNumber: 13
            }, this);
            $[167] = t75;
            $[168] = t83;
            $[169] = t17;
        } else {
            t17 = $[169];
        }
        let t84;
        if ($[170] === Symbol.for("react.memo_cache_sentinel")) {
            t84 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[170] = t84;
        } else {
            t84 = $[170];
        }
        let t85;
        if ($[171] !== t) {
            t85 = t("1. \u0110\u01B0\u1EDDng Tr\xF2n Ngo\u1EA1i Ti\u1EBFp v\xE0 N\u1ED9i Ti\u1EBFp", "1. Circumscribed and Inscribed Circles");
            $[171] = t;
            $[172] = t85;
        } else {
            t85 = $[172];
        }
        let t86;
        if ($[173] !== t85) {
            t86 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t85
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1181,
                columnNumber: 13
            }, this);
            $[173] = t85;
            $[174] = t86;
        } else {
            t86 = $[174];
        }
        let t87;
        if ($[175] === Symbol.for("react.memo_cache_sentinel")) {
            t87 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 24,
                transition: "all 0.3s"
            };
            $[175] = t87;
        } else {
            t87 = $[175];
        }
        let t88;
        if ($[176] !== t) {
            t88 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "90",
                style: t87,
                children: [
                    {
                        icon: "\u2B55",
                        title: t("\u0110\u01B0\u1EDDng tr\xF2n NGO\u1EA0I TI\u1EBEP", "Circumscribed Circle"),
                        items: [
                            t("B\xE1n k\xEDnh R: \u0111i qua 3 \u0111\u1EC9nh", "Radius R: passes through 3 vertices"),
                            t("R = a/(2sinA) = b/(2sinB) = c/(2sinC)", "R = a/(2sinA)"),
                            t("Tam gi\xE1c vu\xF4ng t\u1EA1i C: R = c/2", "Right at C: R = c/2"),
                            t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a: R = a\u221A3/3", "Equilateral: R = a\u221A3/3")
                        ],
                        bg: "#eaf4fb",
                        c: "#1a5276"
                    },
                    {
                        icon: "\uD83D\uDD35",
                        title: t("\u0110\u01B0\u1EDDng tr\xF2n N\u1ED8I TI\u1EBEP", "Inscribed Circle"),
                        items: [
                            t("B\xE1n k\xEDnh r: ti\u1EBFp x\xFAc 3 c\u1EA1nh", "Radius r: tangent to 3 sides"),
                            t("r = S/p (S=di\u1EC7n t\xEDch, p=n\u1EEDa chu vi)", "r = S/p (S=area, p=semi-perimeter)"),
                            t("Tam gi\xE1c vu\xF4ng: r = (a+b\u2212c)/2", "Right triangle: r = (a+b\u2212c)/2"),
                            t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a: r = a\u221A3/6", "Equilateral: r = a\u221A3/6")
                        ],
                        bg: "#eafaf1",
                        c: "#1e8449"
                    },
                    {
                        icon: "\uD83D\uDCD0",
                        title: t("Quan h\u1EC7 R v\xE0 r", "Relationship R and r"),
                        items: [
                            t("Euler: OI\xB2 = R\xB2\u22122Rr (O=t\xE2m ngo\u1EA1i, I=t\xE2m n\u1ED9i)", "Euler: OI\xB2=R\xB2\u22122Rr"),
                            t("R \u2265 2r (d\u1EA5u = khi tam gi\xE1c \u0111\u1EC1u)", "R \u2265 2r (equality for equilateral)"),
                            t("Tam gi\xE1c \u0111\u1EC1u: R = 2r", "Equilateral: R = 2r")
                        ],
                        bg: "#f5eef8",
                        c: "#6c3483"
                    }
                ].map(_Lesson18_HinhHocDoLuong1Anonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1201,
                columnNumber: 13
            }, this);
            $[176] = t;
            $[177] = t88;
        } else {
            t88 = $[177];
        }
        if ($[178] !== t86 || $[179] !== t88) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k1",
                style: t84,
                children: [
                    t86,
                    t88
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1226,
                columnNumber: 13
            }, this);
            $[178] = t86;
            $[179] = t88;
            $[180] = t18;
        } else {
            t18 = $[180];
        }
        let t89;
        if ($[181] === Symbol.for("react.memo_cache_sentinel")) {
            t89 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[181] = t89;
        } else {
            t89 = $[181];
        }
        let t90;
        if ($[182] !== t) {
            t90 = t("2. \u0110\u01B0\u1EDDng Trung Tuy\u1EBFn", "2. Medians");
            $[182] = t;
            $[183] = t90;
        } else {
            t90 = $[183];
        }
        let t91;
        if ($[184] !== t90) {
            t91 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t90
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1253,
                columnNumber: 13
            }, this);
            $[184] = t90;
            $[185] = t91;
        } else {
            t91 = $[185];
        }
        let t92;
        let t93;
        if ($[186] === Symbol.for("react.memo_cache_sentinel")) {
            t92 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t93 = {
                fontWeight: "bold",
                fontSize: 16,
                color: "#0B4F5C",
                marginBottom: 12
            };
            $[186] = t92;
            $[187] = t93;
        } else {
            t92 = $[186];
            t93 = $[187];
        }
        let t94;
        if ($[188] !== t) {
            t94 = t("C\xF4ng th\u1EE9c \u0111\u01B0\u1EDDng trung tuy\u1EBFn:", "Median formulas:");
            $[188] = t;
            $[189] = t94;
        } else {
            t94 = $[189];
        }
        let t95;
        if ($[190] !== t94) {
            t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t93,
                children: t94
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1291,
                columnNumber: 13
            }, this);
            $[190] = t94;
            $[191] = t95;
        } else {
            t95 = $[191];
        }
        let t96;
        if ($[192] === Symbol.for("react.memo_cache_sentinel")) {
            t96 = {
                background: "white",
                borderRadius: 8,
                padding: "14px 18px",
                fontFamily: "monospace",
                fontSize: 15,
                lineHeight: 2.4,
                textAlign: "center"
            };
            $[192] = t96;
        } else {
            t96 = $[192];
        }
        let t97;
        if ($[193] === Symbol.for("react.memo_cache_sentinel")) {
            t97 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1314,
                columnNumber: 13
            }, this);
            $[193] = t97;
        } else {
            t97 = $[193];
        }
        let t98;
        if ($[194] === Symbol.for("react.memo_cache_sentinel")) {
            t98 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t96,
                children: [
                    "ma² = (2b² + 2c² − a²) / 4",
                    t97,
                    "mb² = (2a² + 2c² − b²) / 4",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 1321,
                        columnNumber: 87
                    }, this),
                    "mc² = (2a² + 2b² − c²) / 4"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1321,
                columnNumber: 13
            }, this);
            $[194] = t98;
        } else {
            t98 = $[194];
        }
        let t99;
        if ($[195] !== t95) {
            t99 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t92,
                children: [
                    t95,
                    t98
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1328,
                columnNumber: 13
            }, this);
            $[195] = t95;
            $[196] = t99;
        } else {
            t99 = $[196];
        }
        let t100;
        if ($[197] === Symbol.for("react.memo_cache_sentinel")) {
            t100 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: 16,
                transition: "all 0.3s"
            };
            $[197] = t100;
        } else {
            t100 = $[197];
        }
        let t101;
        if ($[198] !== t) {
            t101 = t("T\xEDnh ch\u1EA5t tr\u1ECDng t\xE2m G", "Centroid G");
            $[198] = t;
            $[199] = t101;
        } else {
            t101 = $[199];
        }
        let t102;
        if ($[200] !== t) {
            t102 = t("G chia m\u1ED7i \u0111\u01B0\u1EDDng trung tuy\u1EBFn theo t\u1EC9 l\u1EC7 2:1 k\u1EC3 t\u1EEB \u0111\u1EC9nh.", "G divides each median 2:1 from vertex.");
            $[200] = t;
            $[201] = t102;
        } else {
            t102 = $[201];
        }
        let t103;
        if ($[202] !== t101 || $[203] !== t102) {
            t103 = {
                title: t101,
                note: t102,
                formula: "AG = (2/3)ma"
            };
            $[202] = t101;
            $[203] = t102;
            $[204] = t103;
        } else {
            t103 = $[204];
        }
        let t104;
        if ($[205] !== t) {
            t104 = t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a", "Equilateral, side a");
            $[205] = t;
            $[206] = t104;
        } else {
            t104 = $[206];
        }
        let t105;
        if ($[207] !== t) {
            t105 = t("3 \u0111\u01B0\u1EDDng trung tuy\u1EBFn b\u1EB1ng nhau.", "All 3 medians are equal.");
            $[207] = t;
            $[208] = t105;
        } else {
            t105 = $[208];
        }
        let t106;
        if ($[209] !== t104 || $[210] !== t105) {
            t106 = {
                title: t104,
                note: t105,
                formula: "m = a\u221A3/2"
            };
            $[209] = t104;
            $[210] = t105;
            $[211] = t106;
        } else {
            t106 = $[211];
        }
        let t107;
        if ($[212] !== t) {
            t107 = t("Tam gi\xE1c vu\xF4ng t\u1EA1i C", "Right triangle at C");
            $[212] = t;
            $[213] = t107;
        } else {
            t107 = $[213];
        }
        let t108;
        if ($[214] !== t) {
            t108 = t("Trung tuy\u1EBFn t\u1EDBi c\u1EA1nh huy\u1EC1n = R.", "Median to hypotenuse = R.");
            $[214] = t;
            $[215] = t108;
        } else {
            t108 = $[215];
        }
        let t109;
        if ($[216] !== t107 || $[217] !== t108) {
            t109 = {
                title: t107,
                note: t108,
                formula: "mc = c/2 = R"
            };
            $[216] = t107;
            $[217] = t108;
            $[218] = t109;
        } else {
            t109 = $[218];
        }
        let t110;
        if ($[219] !== t103 || $[220] !== t106 || $[221] !== t109) {
            t110 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t100,
                children: [
                    t103,
                    t106,
                    t109
                ].map(_Lesson18_HinhHocDoLuong1Anonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1435,
                columnNumber: 14
            }, this);
            $[219] = t103;
            $[220] = t106;
            $[221] = t109;
            $[222] = t110;
        } else {
            t110 = $[222];
        }
        if ($[223] !== t110 || $[224] !== t91 || $[225] !== t99) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k2",
                style: t89,
                children: [
                    t91,
                    t99,
                    t110
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1444,
                columnNumber: 13
            }, this);
            $[223] = t110;
            $[224] = t91;
            $[225] = t99;
            $[226] = t19;
        } else {
            t19 = $[226];
        }
        let t111;
        if ($[227] === Symbol.for("react.memo_cache_sentinel")) {
            t111 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[227] = t111;
        } else {
            t111 = $[227];
        }
        let t112;
        if ($[228] !== t) {
            t112 = t("3. \u0110\u01B0\u1EDDng Cao", "3. Altitudes");
            $[228] = t;
            $[229] = t112;
        } else {
            t112 = $[229];
        }
        let t113;
        if ($[230] !== t112) {
            t113 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t112
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1472,
                columnNumber: 14
            }, this);
            $[230] = t112;
            $[231] = t113;
        } else {
            t113 = $[231];
        }
        let t114;
        let t115;
        if ($[232] === Symbol.for("react.memo_cache_sentinel")) {
            t114 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t115 = {
                fontWeight: "bold",
                fontSize: 16,
                color: "#0B4F5C",
                marginBottom: 12
            };
            $[232] = t114;
            $[233] = t115;
        } else {
            t114 = $[232];
            t115 = $[233];
        }
        let t116;
        if ($[234] !== t) {
            t116 = t("C\xF4ng th\u1EE9c \u0111\u01B0\u1EDDng cao:", "Altitude formulas:");
            $[234] = t;
            $[235] = t116;
        } else {
            t116 = $[235];
        }
        let t117;
        if ($[236] !== t116) {
            t117 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t115,
                children: t116
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1510,
                columnNumber: 14
            }, this);
            $[236] = t116;
            $[237] = t117;
        } else {
            t117 = $[237];
        }
        let t118;
        let t119;
        if ($[238] === Symbol.for("react.memo_cache_sentinel")) {
            t118 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "white",
                    borderRadius: 8,
                    padding: "14px 18px",
                    fontFamily: "monospace",
                    fontSize: 15,
                    lineHeight: 2.4,
                    textAlign: "center"
                },
                children: "ha = 2S / a     hb = 2S / b     hc = 2S / c"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1519,
                columnNumber: 14
            }, this);
            t119 = {
                marginTop: 12,
                padding: "10px 14px",
                background: "#fff3cd",
                borderRadius: 8,
                fontSize: 14
            };
            $[238] = t118;
            $[239] = t119;
        } else {
            t118 = $[238];
            t119 = $[239];
        }
        let t120;
        if ($[240] !== t) {
            t120 = t("C\u0169ng c\xF3 th\u1EC3 d\xF9ng: ha = b\xB7sinC = c\xB7sinB", "Also: ha = b\xB7sinC = c\xB7sinB");
            $[240] = t;
            $[241] = t120;
        } else {
            t120 = $[241];
        }
        let t121;
        if ($[242] !== t120) {
            t121 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t119,
                children: [
                    "💡 ",
                    t120
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1551,
                columnNumber: 14
            }, this);
            $[242] = t120;
            $[243] = t121;
        } else {
            t121 = $[243];
        }
        let t122;
        if ($[244] !== t117 || $[245] !== t121) {
            t122 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t114,
                children: [
                    t117,
                    t118,
                    t121
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1559,
                columnNumber: 14
            }, this);
            $[244] = t117;
            $[245] = t121;
            $[246] = t122;
        } else {
            t122 = $[246];
        }
        let t123;
        if ($[247] === Symbol.for("react.memo_cache_sentinel")) {
            t123 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: 16,
                transition: "all 0.3s"
            };
            $[247] = t123;
        } else {
            t123 = $[247];
        }
        let t124;
        if ($[248] !== t) {
            t124 = t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a", "Equilateral, side a");
            $[248] = t;
            $[249] = t124;
        } else {
            t124 = $[249];
        }
        let t125;
        if ($[250] !== t124) {
            t125 = {
                shape: t124,
                formula: "h = a\u221A3/2 (= \u0111\u01B0\u1EDDng trung tuy\u1EBFn)"
            };
            $[250] = t124;
            $[251] = t125;
        } else {
            t125 = $[251];
        }
        let t126;
        if ($[252] !== t) {
            t126 = t("Tam gi\xE1c vu\xF4ng t\u1EA1i C (c\u1EA1nh g\xF3c vu\xF4ng a, b)", "Right triangle, legs a, b");
            $[252] = t;
            $[253] = t126;
        } else {
            t126 = $[253];
        }
        let t127;
        if ($[254] !== t126) {
            t127 = {
                shape: t126,
                formula: "hc = ab/c (\u0111\u01B0\u1EDDng cao t\u1EDBi c\u1EA1nh huy\u1EC1n)"
            };
            $[254] = t126;
            $[255] = t127;
        } else {
            t127 = $[255];
        }
        let t128;
        if ($[256] !== t) {
            t128 = t("H\u1EC7 th\u1EE9c trong tam gi\xE1c vu\xF4ng", "Right triangle relations");
            $[256] = t;
            $[257] = t128;
        } else {
            t128 = $[257];
        }
        let t129;
        if ($[258] !== t128) {
            t129 = {
                shape: t128,
                formula: "hc\xB2 = ha'\xB7hb'\n(t\xEDch c\xE1c h\xECnh chi\u1EBFu tr\xEAn huy\u1EC1n)"
            };
            $[258] = t128;
            $[259] = t129;
        } else {
            t129 = $[259];
        }
        let t130;
        if ($[260] !== t125 || $[261] !== t127 || $[262] !== t129) {
            t130 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "90",
                style: t123,
                children: [
                    t125,
                    t127,
                    t129
                ].map(_Lesson18_HinhHocDoLuong1Anonymous4)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1637,
                columnNumber: 14
            }, this);
            $[260] = t125;
            $[261] = t127;
            $[262] = t129;
            $[263] = t130;
        } else {
            t130 = $[263];
        }
        if ($[264] !== t113 || $[265] !== t122 || $[266] !== t130) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k3",
                style: t111,
                children: [
                    t113,
                    t122,
                    t130
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1646,
                columnNumber: 13
            }, this);
            $[264] = t113;
            $[265] = t122;
            $[266] = t130;
            $[267] = t20;
        } else {
            t20 = $[267];
        }
        let t131;
        if ($[268] === Symbol.for("react.memo_cache_sentinel")) {
            t131 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[268] = t131;
        } else {
            t131 = $[268];
        }
        let t132;
        if ($[269] !== t) {
            t132 = t("4. H\u1EC7 Th\u1EE9c Trong Tam Gi\xE1c Vu\xF4ng", "4. Right Triangle Relations");
            $[269] = t;
            $[270] = t132;
        } else {
            t132 = $[270];
        }
        let t133;
        if ($[271] !== t132) {
            t133 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t132
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1674,
                columnNumber: 14
            }, this);
            $[271] = t132;
            $[272] = t133;
        } else {
            t133 = $[272];
        }
        let t134;
        let t135;
        if ($[273] === Symbol.for("react.memo_cache_sentinel")) {
            t134 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t135 = {
                fontWeight: "bold",
                fontSize: 16,
                color: "#0B4F5C",
                marginBottom: 12
            };
            $[273] = t134;
            $[274] = t135;
        } else {
            t134 = $[273];
            t135 = $[274];
        }
        let t136;
        if ($[275] !== t) {
            t136 = t("Tam gi\xE1c vu\xF4ng t\u1EA1i C, \u0111\u01B0\u1EDDng cao CH = h, h\xECnh chi\u1EBFu A&apos; v\xE0 B&apos;:", "Right triangle at C, altitude CH=h, projections A&apos; and B&apos;:");
            $[275] = t;
            $[276] = t136;
        } else {
            t136 = $[276];
        }
        let t137;
        if ($[277] !== t136) {
            t137 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t135,
                children: t136
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1712,
                columnNumber: 14
            }, this);
            $[277] = t136;
            $[278] = t137;
        } else {
            t137 = $[278];
        }
        let t138;
        if ($[279] === Symbol.for("react.memo_cache_sentinel")) {
            t138 = {
                background: "white",
                borderRadius: 8,
                padding: "14px 18px",
                fontFamily: "monospace",
                fontSize: 14,
                lineHeight: 2.2
            };
            $[279] = t138;
        } else {
            t138 = $[279];
        }
        let t139;
        if ($[280] === Symbol.for("react.memo_cache_sentinel")) {
            t139 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1734,
                columnNumber: 14
            }, this);
            $[280] = t139;
        } else {
            t139 = $[280];
        }
        let t140;
        if ($[281] === Symbol.for("react.memo_cache_sentinel")) {
            t140 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1741,
                columnNumber: 14
            }, this);
            $[281] = t140;
        } else {
            t140 = $[281];
        }
        let t141;
        if ($[282] === Symbol.for("react.memo_cache_sentinel")) {
            t141 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1748,
                columnNumber: 14
            }, this);
            $[282] = t141;
        } else {
            t141 = $[282];
        }
        let t142;
        if ($[283] === Symbol.for("react.memo_cache_sentinel")) {
            t142 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t138,
                children: [
                    "c² = a² + b² (Pythagore)",
                    t139,
                    "h = ab/c",
                    t140,
                    "a² = c·CA'      b² = c·CB'",
                    t141,
                    "h² = CA'·CB'",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 1755,
                        columnNumber: 120
                    }, this),
                    "1/h² = 1/a² + 1/b²"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1755,
                columnNumber: 14
            }, this);
            $[283] = t142;
        } else {
            t142 = $[283];
        }
        let t143;
        if ($[284] !== t137) {
            t143 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t134,
                children: [
                    t137,
                    t142
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1762,
                columnNumber: 14
            }, this);
            $[284] = t137;
            $[285] = t143;
        } else {
            t143 = $[285];
        }
        let t144;
        if ($[286] === Symbol.for("react.memo_cache_sentinel")) {
            t144 = {
                padding: 14,
                borderRadius: 10,
                background: "#fff3cd",
                border: "1px solid #ffc107",
                fontSize: 15
            };
            $[286] = t144;
        } else {
            t144 = $[286];
        }
        let t145;
        if ($[287] !== t) {
            t145 = t("C\xE1c h\u1EC7 th\u1EE9c n\xE0y r\u1EA5t quan tr\u1ECDng trong thi c\u1EED v\xE0 \u1EE9ng d\u1EE5ng th\u1EF1c t\u1EBF (t\xEDnh \u0111\u1ED9 d\u1ED1c, chi\u1EC1u cao t\xF2a nh\xE0, v.v.).", "These relations are crucial in exams and applications (slope, building height, etc.).");
            $[287] = t;
            $[288] = t145;
        } else {
            t145 = $[288];
        }
        let t146;
        if ($[289] !== t145) {
            t146 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t144,
                children: [
                    "⭐ ",
                    t145
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1791,
                columnNumber: 14
            }, this);
            $[289] = t145;
            $[290] = t146;
        } else {
            t146 = $[290];
        }
        if ($[291] !== t133 || $[292] !== t143 || $[293] !== t146) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k4",
                style: t131,
                children: [
                    t133,
                    t143,
                    t146
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1798,
                columnNumber: 13
            }, this);
            $[291] = t133;
            $[292] = t143;
            $[293] = t146;
            $[294] = t21;
        } else {
            t21 = $[294];
        }
        let t147;
        if ($[295] === Symbol.for("react.memo_cache_sentinel")) {
            t147 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[295] = t147;
        } else {
            t147 = $[295];
        }
        let t148;
        if ($[296] !== t) {
            t148 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[296] = t;
            $[297] = t148;
        } else {
            t148 = $[297];
        }
        let t149;
        if ($[298] !== t148) {
            t149 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\u270F\uFE0F",
                title: t148
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1826,
                columnNumber: 14
            }, this);
            $[298] = t148;
            $[299] = t149;
        } else {
            t149 = $[299];
        }
        let t150;
        if ($[300] === Symbol.for("react.memo_cache_sentinel")) {
            t150 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: 36,
                transition: "all 0.3s"
            };
            $[300] = t150;
        } else {
            t150 = $[300];
        }
        let t151;
        if ($[301] !== rev || $[302] !== t) {
            t151 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t150,
                children: [
                    {
                        id: "e1",
                        q: t("Tam gi\xE1c ABC: a=5, b=7, c=8. T\xEDnh:\n(a) B\xE1n k\xEDnh ngo\u1EA1i ti\u1EBFp R\n(b) B\xE1n k\xEDnh n\u1ED9i ti\u1EBFp r", "Triangle: a=5, b=7, c=8.\n(a) Circumradius R\n(b) Inradius r"),
                        a: [
                            t("Di\u1EC7n t\xEDch: s=(5+7+8)/2=10, S=\u221A(10\xB75\xB73\xB72)=\u221A300=10\u221A3", "Area: s=10, S=10\u221A3"),
                            t("(a) R=a/(2sinA). Tr\u01B0\u1EDBc: cosA=(b\xB2+c\xB2\u2212a\xB2)/(2bc)=(49+64\u221225)/112=88/112=11/14", "cosA=11/14, sinA=\u221A(1\u2212121/196)=\u221A(75/196)=5\u221A3/14"),
                            t("R=5/(2\xB75\u221A3/14)=5\xB714/(10\u221A3)=7/\u221A3=7\u221A3/3\u22484.04", "R=7\u221A3/3\u22484.04"),
                            t("(b) r=S/p=10\u221A3/10=\u221A3\u22481.73", "r=\u221A3\u22481.73")
                        ]
                    },
                    {
                        id: "e2",
                        q: t("Tam gi\xE1c ABC: a=6, b=8, c=10. T\xEDnh \u0111\u01B0\u1EDDng cao ha v\xE0 \u0111\u01B0\u1EDDng trung tuy\u1EBFn ma.", "Triangle: a=6, b=8, c=10.\nFind altitude ha and median ma."),
                        a: [
                            t("Ki\u1EC3m tra: 6\xB2+8\xB2=36+64=100=10\xB2 \u2192 tam gi\xE1c VU\xD4NG t\u1EA1i C (c=10)", "6\xB2+8\xB2=100=10\xB2 \u2192 RIGHT at C"),
                            t("S=(1/2)\xB76\xB78=24", "S=24"),
                            t("ha=2S/a=48/6=8", "ha=8"),
                            t("ma\xB2=(2\xB764+2\xB7100\u221236)/4=(128+200\u221236)/4=292/4=73 \u2192 ma=\u221A73\u22488.54", "ma=\u221A73\u22488.54")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a=6. T\xEDnh R, r, v\xE0 \u0111\u01B0\u1EDDng cao h.", "Equilateral, side 6. Find R, r, and altitude h."),
                        a: [
                            t("h = 6\u221A3/2 = 3\u221A3\u22485.20", "h=3\u221A3"),
                            t("R = a\u221A3/3 = 6\u221A3/3 = 2\u221A3\u22483.46", "R=2\u221A3"),
                            t("r = a\u221A3/6 = 6\u221A3/6 = \u221A3\u22481.73", "r=\u221A3"),
                            t("Ki\u1EC3m tra: R = 2r = 2\u221A3 \u2713", "R=2r \u2713")
                        ]
                    }
                ].map({
                    "Lesson18_HinhHocDoLuong1[(anonymous)()]": (t152)=>{
                        const { id: id_3, q: q_3, a: a_1 } = t152;
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                            lineNumber: 1870,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: q_3
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                            lineNumber: 1874,
                                            columnNumber: 63
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 1865,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson18_HinhHocDoLuong1[(anonymous)() > <button>.onClick]": ()=>tr(id_3)
                                    }["Lesson18_HinhHocDoLuong1[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 1878,
                                    columnNumber: 37
                                }, this),
                                rev[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_1.map(_Lesson18_HinhHocDoLuong1AnonymousA_1Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 1891,
                                    columnNumber: 158
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                            lineNumber: 1865,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson18_HinhHocDoLuong1[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1846,
                columnNumber: 14
            }, this);
            $[301] = rev;
            $[302] = t;
            $[303] = t151;
        } else {
            t151 = $[303];
        }
        if ($[304] !== t149 || $[305] !== t151) {
            t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "th",
                style: t147,
                children: [
                    t149,
                    t151
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1905,
                columnNumber: 13
            }, this);
            $[304] = t149;
            $[305] = t151;
            $[306] = t22;
        } else {
            t22 = $[306];
        }
        t7 = "mg";
        if ($[307] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83C\uDFAE",
                title: "Mini Game"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 1918,
                columnNumber: 12
            }, this);
            $[307] = t8;
            $[308] = t9;
        } else {
            t8 = $[307];
            t9 = $[308];
        }
        let t152;
        if ($[309] === Symbol.for("react.memo_cache_sentinel")) {
            t152 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s"
            };
            $[309] = t152;
        } else {
            t152 = $[309];
        }
        let t153;
        if ($[310] !== t) {
            t153 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[310] = t;
            $[311] = t153;
        } else {
            t153 = $[311];
        }
        let t154;
        if ($[312] !== t) {
            t154 = t("5 c\xE2u", "5 Q");
            $[312] = t;
            $[313] = t154;
        } else {
            t154 = $[313];
        }
        let t155;
        if ($[314] !== t153 || $[315] !== t154) {
            t155 = [
                "mc",
                "\uD83E\uDDE9",
                t153,
                t154
            ];
            $[314] = t153;
            $[315] = t154;
            $[316] = t155;
        } else {
            t155 = $[316];
        }
        let t156;
        if ($[317] !== t) {
            t156 = t("\u0110\xFAng / Sai", "True / False");
            $[317] = t;
            $[318] = t156;
        } else {
            t156 = $[318];
        }
        let t157;
        if ($[319] !== t) {
            t157 = t("5 th\u1EBB", "5 cards");
            $[319] = t;
            $[320] = t157;
        } else {
            t157 = $[320];
        }
        let t158;
        if ($[321] !== t156 || $[322] !== t157) {
            t158 = [
                "tf",
                "\uD83C\uDCCF",
                t156,
                t157
            ];
            $[321] = t156;
            $[322] = t157;
            $[323] = t158;
        } else {
            t158 = $[323];
        }
        let t159;
        if ($[324] !== t) {
            t159 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[324] = t;
            $[325] = t159;
        } else {
            t159 = $[325];
        }
        let t160;
        if ($[326] !== t) {
            t160 = t("3 c\xE2u", "3 items");
            $[326] = t;
            $[327] = t160;
        } else {
            t160 = $[327];
        }
        let t161;
        if ($[328] !== t159 || $[329] !== t160) {
            t161 = [
                "fill",
                "\u270D\uFE0F",
                t159,
                t160
            ];
            $[328] = t159;
            $[329] = t160;
            $[330] = t161;
        } else {
            t161 = $[330];
        }
        let t162;
        if ($[331] !== t155 || $[332] !== t158 || $[333] !== t161) {
            t162 = [
                t155,
                t158,
                t161
            ];
            $[331] = t155;
            $[332] = t158;
            $[333] = t161;
            $[334] = t162;
        } else {
            t162 = $[334];
        }
        if ($[335] !== gm || $[336] !== t162) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t152,
                children: t162.map({
                    "Lesson18_HinhHocDoLuong1[(anonymous)()]": (t163)=>{
                        const [mode, icon_0, label_0, sub] = t163;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson18_HinhHocDoLuong1[(anonymous)() > <article>.onClick]": ()=>setGm(mode)
                            }["Lesson18_HinhHocDoLuong1[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 2036,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 2039,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 2042,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                            lineNumber: 2027,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson18_HinhHocDoLuong1[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2024,
                columnNumber: 13
            }, this);
            $[335] = gm;
            $[336] = t162;
            $[337] = t10;
        } else {
            t10 = $[337];
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2059,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2063,
                        columnNumber: 99
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQ[mi].o.map({
                            "Lesson18_HinhHocDoLuong1[(anonymous)()]": (opt, i_9)=>{
                                let bg = "white";
                                let co = "black";
                                if (ms !== null) {
                                    if (i_9 === mcQ[mi].a) {
                                        bg = "#eafaf1";
                                        co = "#1e8449";
                                    } else {
                                        if (i_9 === ms) {
                                            bg = "#fdf2f2";
                                            co = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson18_HinhHocDoLuong1[(anonymous)() > <button>.onClick]": ()=>sel(i_9)
                                    }["Lesson18_HinhHocDoLuong1[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color: co,
                                        fontSize: 15,
                                        fontWeight: ms !== null && (i_9 === ms || i_9 === mcQ[mi].a) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_9),
                                        ". ",
                                        opt
                                    ]
                                }, i_9, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                    lineNumber: 2086,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson18_HinhHocDoLuong1[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2067,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2101,
                                columnNumber: 81
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2109,
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2119,
                columnNumber: 144
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2054,
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
        $[40] = t23;
        $[41] = t7;
        $[42] = t8;
        $[43] = t9;
        $[44] = ta;
        $[45] = tfC;
        $[46] = tn;
        $[47] = tri;
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
        t23 = $[40];
        t7 = $[41];
        t8 = $[42];
        t9 = $[43];
        ta = $[44];
        tfC = $[45];
        tn = $[46];
        tri = $[47];
    }
    let t24;
    if ($[338] !== gm || $[339] !== rt || $[340] !== t || $[341] !== ta || $[342] !== td || $[343] !== tf || $[344] !== tfC || $[345] !== ti || $[346] !== tn || $[347] !== tri || $[348] !== ts) {
        t24 = gm === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2193,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2204,
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
                                            "Lesson18_HinhHocDoLuong1[<button>.onClick]": ()=>ta(true)
                                        }["Lesson18_HinhHocDoLuong1[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2212,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson18_HinhHocDoLuong1[<button>.onClick]": ()=>ta(false)
                                        }["Lesson18_HinhHocDoLuong1[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2223,
                                        columnNumber: 54
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2208,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2234,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2243,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2197,
                        columnNumber: 103
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: tri,
                onReset: rt,
                scoreLabel: ts === tfC.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2252,
                columnNumber: 158
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2188,
            columnNumber: 26
        }, this);
        $[338] = gm;
        $[339] = rt;
        $[340] = t;
        $[341] = ta;
        $[342] = td;
        $[343] = tf;
        $[344] = tfC;
        $[345] = ti;
        $[346] = tn;
        $[347] = tri;
        $[348] = ts;
        $[349] = t24;
    } else {
        t24 = $[349];
    }
    let t25;
    if ($[350] !== fQ || $[351] !== fa || $[352] !== fc || $[353] !== fri || $[354] !== fs || $[355] !== gm || $[356] !== t) {
        t25 = gm === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2275,
                        columnNumber: 17
                    }, this),
                    fQ.map({
                        "Lesson18_HinhHocDoLuong1[fQ.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2282,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2286,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: fa[q_4.id] || "",
                                        onChange: {
                                            "Lesson18_HinhHocDoLuong1[fQ.map() > <input>.onChange]": (e_1)=>setFa({
                                                    "Lesson18_HinhHocDoLuong1[fQ.map() > <input>.onChange > setFa()]": (p_0)=>({
                                                            ...p_0,
                                                            [q_4.id]: e_1.target.value
                                                        })
                                                }["Lesson18_HinhHocDoLuong1[fQ.map() > <input>.onChange > setFa()]"])
                                        }["Lesson18_HinhHocDoLuong1[fQ.map() > <input>.onChange]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                        lineNumber: 2290,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, q_4.id, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2280,
                                columnNumber: 62
                            }, this)
                    }["Lesson18_HinhHocDoLuong1[fQ.map()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "Lesson18_HinhHocDoLuong1[<button>.onClick]": ()=>setFc(true)
                        }["Lesson18_HinhHocDoLuong1[<button>.onClick]"],
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2308,
                        columnNumber: 50
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: fri,
                onReset: {
                    "Lesson18_HinhHocDoLuong1[<RS>.onReset]": ()=>{
                        setFa({});
                        setFc(false);
                    }
                }["Lesson18_HinhHocDoLuong1[<RS>.onReset]"],
                scoreLabel: fs === fQ.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fs >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2319,
                columnNumber: 64
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2270,
            columnNumber: 28
        }, this);
        $[350] = fQ;
        $[351] = fa;
        $[352] = fc;
        $[353] = fri;
        $[354] = fs;
        $[355] = gm;
        $[356] = t;
        $[357] = t25;
    } else {
        t25 = $[357];
    }
    let t26;
    if ($[358] !== t10 || $[359] !== t11 || $[360] !== t24 || $[361] !== t25 || $[362] !== t7 || $[363] !== t8 || $[364] !== t9) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            id: t7,
            style: t8,
            children: [
                t9,
                t10,
                t11,
                t24,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2338,
            columnNumber: 11
        }, this);
        $[358] = t10;
        $[359] = t11;
        $[360] = t24;
        $[361] = t25;
        $[362] = t7;
        $[363] = t8;
        $[364] = t9;
        $[365] = t26;
    } else {
        t26 = $[365];
    }
    let t27;
    if ($[366] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2352,
            columnNumber: 11
        }, this);
        $[366] = t27;
    } else {
        t27 = $[366];
    }
    let t28;
    if ($[367] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[367] = t28;
    } else {
        t28 = $[367];
    }
    let t29;
    if ($[368] !== t) {
        t29 = t("B\xE0i 20 / Ch\u01B0\u01A1ng VI", "Lesson 20 / Chapter VI");
        $[368] = t;
        $[369] = t29;
    } else {
        t29 = $[369];
    }
    let t30;
    if ($[370] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t28,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2381,
            columnNumber: 11
        }, this);
        $[370] = t29;
        $[371] = t30;
    } else {
        t30 = $[371];
    }
    let t31;
    let t32;
    if ($[372] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: ".reveal{opacity:0;transform:translateY(28px) scale(0.97);transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1);will-change:opacity,transform;}.reveal.visible{opacity:1;transform:translateY(0) scale(1);}.reveal[data-reveal-stagger].visible{opacity:1;transform:none;}.reveal[data-reveal-stagger]>*{opacity:0;transform:translateY(24px) scale(0.97);will-change:opacity,transform;}header.reveal{transform:translateY(-18px);opacity:0;}header.reveal.visible{opacity:1;transform:translateY(0);}article{transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease;border-radius:10px;padding:8px;}article:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 12px 28px rgba(0,0,0,0.12);}"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2390,
            columnNumber: 11
        }, this);
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2391,
            columnNumber: 11
        }, this);
        $[372] = t31;
        $[373] = t32;
    } else {
        t31 = $[372];
        t32 = $[373];
    }
    let t33;
    if ($[374] !== t12 || $[375] !== t13 || $[376] !== t14 || $[377] !== t15 || $[378] !== t16 || $[379] !== t17 || $[380] !== t18 || $[381] !== t19 || $[382] !== t20 || $[383] !== t21 || $[384] !== t22 || $[385] !== t26 || $[386] !== t30) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                t22,
                t26,
                t27,
                t30,
                t31,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2400,
            columnNumber: 11
        }, this);
        $[374] = t12;
        $[375] = t13;
        $[376] = t14;
        $[377] = t15;
        $[378] = t16;
        $[379] = t17;
        $[380] = t18;
        $[381] = t19;
        $[382] = t20;
        $[383] = t21;
        $[384] = t22;
        $[385] = t26;
        $[386] = t30;
        $[387] = t33;
    } else {
        t33 = $[387];
    }
    let t34;
    if ($[388] !== t23 || $[389] !== t33) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t23,
            children: t33
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
            lineNumber: 2420,
            columnNumber: 11
        }, this);
        $[388] = t23;
        $[389] = t33;
        $[390] = t34;
    } else {
        t34 = $[390];
    }
    return t34;
}
_s(Lesson18_HinhHocDoLuong1, "3e5ld66n3Vcdr6IFVQyUkgXiBp8=");
_c2 = Lesson18_HinhHocDoLuong1;
function _Lesson18_HinhHocDoLuong1AnonymousA_1Map(l, i_8) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: l
    }, i_8, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
        lineNumber: 2430,
        columnNumber: 10
    }, this);
}
function _Lesson18_HinhHocDoLuong1Anonymous4(card_1, i_7) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: 18,
            borderRadius: 10,
            background: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    color: "#777",
                    marginBottom: 6
                },
                children: card_1.shape
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2442,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0B4F5C",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8
                },
                children: card_1.formula
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2446,
                columnNumber: 28
            }, this)
        ]
    }, i_7, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
        lineNumber: 2437,
        columnNumber: 10
    }, this);
}
function _Lesson18_HinhHocDoLuong1Anonymous3(card_0, i_6) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: 18,
            borderRadius: 10,
            background: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 6
                },
                children: card_0.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2461,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#777",
                    marginBottom: 8,
                    lineHeight: 1.6
                },
                children: card_0.note
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2466,
                columnNumber: 28
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0B4F5C",
                    background: "white",
                    padding: "6px 12px",
                    borderRadius: 6
                },
                children: card_0.formula
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2471,
                columnNumber: 27
            }, this)
        ]
    }, i_6, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
        lineNumber: 2456,
        columnNumber: 10
    }, this);
}
function _Lesson18_HinhHocDoLuong1Anonymous2(card, i_5) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 24,
                    marginBottom: 8
                },
                children: card.icon
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2487,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 16,
                    fontWeight: 700,
                    color: card.c,
                    marginBottom: 12
                },
                children: card.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                lineNumber: 2490,
                columnNumber: 25
            }, this),
            card.items.map({
                "Lesson18_HinhHocDoLuong1[(anonymous)() > card.items.map()]": (item, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            color: "#555",
                            marginBottom: 8,
                            display: "flex",
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: card.c,
                                    fontWeight: 700,
                                    flexShrink: 0
                                },
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2502,
                                columnNumber: 10
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: item
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                                lineNumber: 2506,
                                columnNumber: 20
                            }, this)
                        ]
                    }, j, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
                        lineNumber: 2496,
                        columnNumber: 82
                    }, this)
            }["Lesson18_HinhHocDoLuong1[(anonymous)() > card.items.map()]"])
        ]
    }, i_5, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
        lineNumber: 2482,
        columnNumber: 10
    }, this);
}
function _Lesson18_HinhHocDoLuong1TabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson18_HinhHocDoLuong1TabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson18_HinhHocDoLuong1Anonymous(o, i_4) {
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
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson18_HinhHocDoLuong1.js",
        lineNumber: 2520,
        columnNumber: 10
    }, this);
}
function _Lesson18_HinhHocDoLuong1TnSetTi(i_3) {
    return i_3 + 1;
}
function _Lesson18_HinhHocDoLuong1TaSetTs(s_2) {
    return s_2 + 1;
}
function _Lesson18_HinhHocDoLuong1NxSetMi(i_2) {
    return i_2 + 1;
}
function _Lesson18_HinhHocDoLuong1SelSetMsc(s_1) {
    return s_1 + 1;
}
function _Lesson18_HinhHocDoLuong1CfAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson18_HinhHocDoLuong1Sc(id) {
    const el_2 = document.getElementById(id);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson18_HinhHocDoLuong1UseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson18_HinhHocDoLuong1UseEffectElsForEach);
    const obs = new IntersectionObserver(_temp4, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson18_HinhHocDoLuong1[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson18_HinhHocDoLuong1[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp4(entries, observer) {
    entries.forEach({
        "Lesson18_HinhHocDoLuong1[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const s_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson18_HinhHocDoLuong1[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (c_0, i_0)=>setTimeout({
                                "Lesson18_HinhHocDoLuong1[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    c_0.style.opacity = "1";
                                    c_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson18_HinhHocDoLuong1[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * s_0)
                    }["Lesson18_HinhHocDoLuong1[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson18_HinhHocDoLuong1[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson18_HinhHocDoLuong1UseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const s = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson18_HinhHocDoLuong1[useEffect() > els.forEach() > (anonymous)()]": (c, i)=>{
                c.style.opacity = "0";
                c.style.transform = "translateY(24px) scale(0.97)";
                c.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * s}ms,transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * s}ms`;
                c.style.willChange = "opacity,transform";
            }
        }["Lesson18_HinhHocDoLuong1[useEffect() > els.forEach() > (anonymous)()]"]);
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
__turbopack_context__.k.register(_c2, "Lesson18_HinhHocDoLuong1");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_c6f8b53a._.js.map