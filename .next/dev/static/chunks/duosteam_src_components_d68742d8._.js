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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson22_GiaiBPTBacHai
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
    if ($[0] !== "838d00a2901c04e5ec87eb62fa78254019c3abd1d5c52aecb77f4e8a025ae8da") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "838d00a2901c04e5ec87eb62fa78254019c3abd1d5c52aecb77f4e8a025ae8da";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
    if ($[0] !== "838d00a2901c04e5ec87eb62fa78254019c3abd1d5c52aecb77f4e8a025ae8da") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "838d00a2901c04e5ec87eb62fa78254019c3abd1d5c52aecb77f4e8a025ae8da";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                                lineNumber: 198,
                                                columnNumber: 67
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                        lineNumber: 198,
                                        columnNumber: 144
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                lineNumber: 188,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                        lineNumber: 181,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, idx, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 257,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
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
function Lesson22_GiaiBPTBacHai() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(312);
    if ($[0] !== "838d00a2901c04e5ec87eb62fa78254019c3abd1d5c52aecb77f4e8a025ae8da") {
        for(let $i = 0; $i < 312; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "838d00a2901c04e5ec87eb62fa78254019c3abd1d5c52aecb77f4e8a025ae8da";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson22_GiaiBPTBacHaiUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson22_GiaiBPTBacHai[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson22_GiaiBPTBacHai[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    const sc = _Lesson22_GiaiBPTBacHaiSc;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson22_GiaiBPTBacHai[tr]": (id_0)=>setRev({
                    "Lesson22_GiaiBPTBacHai[tr > setRev()]": (p)=>({
                            ...p,
                            [id_0]: !p[id_0]
                        })
                }["Lesson22_GiaiBPTBacHai[tr > setRev()]"])
        })["Lesson22_GiaiBPTBacHai[tr]"];
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
                "q": "x\xB2\u22123x\u22124<0. T\u1EADp nghi\u1EC7m?",
                "o": [
                    "(\u22121,4)",
                    "(\u2212\u221E,\u22121)\u222A(4,+\u221E)",
                    "[\u22121,4]",
                    "\u2205"
                ],
                "a": 0,
                "ex": "\u0394=9+16=25>0; x\u2081=\u22121,x\u2082=4. a>0,BPT<0 \u2192 (\u22121,4)."
            },
            {
                "q": "2x\xB2\u22128>0. T\u1EADp nghi\u1EC7m?",
                "o": [
                    "(\u22122,2)",
                    "(\u2212\u221E,\u22122)\u222A(2,+\u221E)",
                    "[\u22122,2]",
                    "\u211D"
                ],
                "a": 1,
                "ex": "x\xB2>4 \u2192 x<\u22122 ho\u1EB7c x>2."
            },
            {
                "q": "\u2212x\xB2+6x\u22129\u22640. T\u1EADp nghi\u1EC7m?",
                "o": [
                    "\u2205",
                    "\u211D",
                    "{3}",
                    "\u211D\\{3}"
                ],
                "a": 1,
                "ex": "\u2212(x\u22123)\xB2\u22640 lu\xF4n \u0111\xFAng v\xEC \u2212(x\u22123)\xB2\u22640 v\u1EDBi m\u1ECDi x \u2192 \u211D."
            },
            {
                "q": "x\xB2+4x+5>0. T\u1EADp nghi\u1EC7m?",
                "o": [
                    "(\u22125,\u22121)",
                    "\u2205",
                    "\u211D",
                    "(\u2212\u221E,\u22125)\u222A(\u22121,+\u221E)"
                ],
                "a": 2,
                "ex": "\u0394=16\u221220=\u22124<0, a=1>0 \u2192 f(x)>0 m\u1ECDi x \u2192 \u211D."
            },
            {
                "q": "Gi\u1EA3i x\xB2\u22649.",
                "o": [
                    "(\u22123,3)",
                    "[\u22123,3]",
                    "(\u2212\u221E,\u22123]\u222A[3,+\u221E)",
                    "\u2205"
                ],
                "a": 1,
                "ex": "x\xB2\u22129\u22640, x\u2081=\u22123,x\u2082=3, a>0,BPT\u22640 \u2192 [\u22123,3]."
            }
        ];
        tfC = [
            {
                "s": "Nghi\u1EC7m c\u1EE7a x\xB2>0 l\xE0 \u211D\\{0}.",
                "a": true,
                "ex": "\u0110\xDANG \u2014 x\xB2>0 khi x\u22600. T\u1EA1i x=0, x\xB2=0 kh\xF4ng th\u1ECFa."
            },
            {
                "s": "Nghi\u1EC7m c\u1EE7a x\xB2+1<0 l\xE0 \u2205.",
                "a": true,
                "ex": "\u0110\xDANG \u2014 x\xB2+1\u22651>0 m\u1ECDi x \u2192 kh\xF4ng c\xF3 nghi\u1EC7m."
            },
            {
                "s": "Khi gi\u1EA3i BPT, nh\xE2n 2 v\u1EBF v\u1EDBi s\u1ED1 \xE2m th\xEC kh\xF4ng \u0111\u1ED5i chi\u1EC1u b\u1EA5t ph\u01B0\u01A1ng tr\xECnh.",
                "a": false,
                "ex": "SAI \u2014 nh\xE2n v\u1EDBi s\u1ED1 \xC2M th\xEC ph\u1EA3i \u0110\u1ED4I CHI\u1EC0U BPT."
            },
            {
                "s": "Nghi\u1EC7m c\u1EE7a ax\xB2+bx+c>0 (a>0, \u0394=0) l\xE0 x\u2208\u211D\\{x\u2080}.",
                "a": true,
                "ex": "\u0110\xDANG \u2014 a>0,\u0394=0: f(x)=a(x\u2212x\u2080)\xB2\u22650, b\u1EB1ng 0 t\u1EA1i x\u2080, d\u01B0\u01A1ng v\u1EDBi x\u2260x\u2080."
            },
            {
                "s": "Nghi\u1EC7m c\u1EE7a (x\u22121)\xB2<0 l\xE0 \u2205.",
                "a": true,
                "ex": "\u0110\xDANG \u2014 b\xECnh ph\u01B0\u01A1ng lu\xF4n \u22650, kh\xF4ng th\u1EC3 < 0."
            }
        ];
        fQ = [
            {
                "id": "f1",
                "tp": "x\xB2\u22125x+6\u22640. Nghi\u1EC7m (Solution): ___.",
                "ans": "[2,3]",
                "alt": [
                    "[2,3]",
                    "2\u2264x\u22643"
                ],
                "h": "x\u2081=2,x\u2082=3"
            },
            {
                "id": "f2",
                "tp": "a>0, \u0394<0. BPT f(x)>0 c\xF3 nghi\u1EC7m (solution): ___.",
                "ans": "\u211D",
                "alt": [
                    "R",
                    "\u211D",
                    "all real"
                ],
                "h": ""
            },
            {
                "id": "f3",
                "tp": "a<0, \u0394<0. BPT f(x)\u22640 c\xF3 nghi\u1EC7m (solution): ___.",
                "ans": "\u211D",
                "alt": [
                    "R",
                    "\u211D",
                    "all real"
                ],
                "h": ""
            }
        ];
        const cf = {
            "Lesson22_GiaiBPTBacHai[cf]": (id_1)=>{
                const q_0 = fQ.find({
                    "Lesson22_GiaiBPTBacHai[cf > fQ.find()]": (q)=>q.id === id_1
                }["Lesson22_GiaiBPTBacHai[cf > fQ.find()]"]);
                const r = (fa[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                return [
                    q_0.ans,
                    ...q_0.alt || []
                ].map(_Lesson22_GiaiBPTBacHaiCfAnonymous).includes(r);
            }
        }["Lesson22_GiaiBPTBacHai[cf]"];
        fs = fc ? fQ.filter({
            "Lesson22_GiaiBPTBacHai[fQ.filter()]": (q_1)=>cf(q_1.id)
        }["Lesson22_GiaiBPTBacHai[fQ.filter()]"]).length : null;
        const sel = {
            "Lesson22_GiaiBPTBacHai[sel]": (i_1)=>{
                if (ms !== null) {
                    return;
                }
                setMs(i_1);
                const c_1 = i_1 === mcQ[mi].a;
                if (c_1) {
                    setMsc(_Lesson22_GiaiBPTBacHaiSelSetMsc);
                }
                setMh({
                    "Lesson22_GiaiBPTBacHai[sel > setMh()]": (h)=>[
                            ...h,
                            {
                                q: mi,
                                s: i_1,
                                c: c_1
                            }
                        ]
                }["Lesson22_GiaiBPTBacHai[sel > setMh()]"]);
            }
        }["Lesson22_GiaiBPTBacHai[sel]"];
        const nx = {
            "Lesson22_GiaiBPTBacHai[nx]": ()=>{
                if (mi + 1 >= mcQ.length) {
                    setMd(true);
                } else {
                    setMi(_Lesson22_GiaiBPTBacHaiNxSetMi);
                    setMs(null);
                }
            }
        }["Lesson22_GiaiBPTBacHai[nx]"];
        let t23;
        if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
            t23 = ({
                "Lesson22_GiaiBPTBacHai[rm]": ()=>{
                    setMi(0);
                    setMs(null);
                    setMsc(0);
                    setMd(false);
                    setMh([]);
                }
            })["Lesson22_GiaiBPTBacHai[rm]"];
            $[47] = t23;
        } else {
            t23 = $[47];
        }
        const rm = t23;
        ta = ({
            "Lesson22_GiaiBPTBacHai[ta]": (a_0)=>{
                if (tf) {
                    return;
                }
                setTf(true);
                const c_2 = a_0 === tfC[ti].a;
                if (c_2) {
                    setTs(_Lesson22_GiaiBPTBacHaiTaSetTs);
                }
                setTh({
                    "Lesson22_GiaiBPTBacHai[ta > setTh()]": (h_0)=>[
                            ...h_0,
                            {
                                q: ti,
                                g: a_0,
                                c: c_2
                            }
                        ]
                }["Lesson22_GiaiBPTBacHai[ta > setTh()]"]);
            }
        })["Lesson22_GiaiBPTBacHai[ta]"];
        tn = ({
            "Lesson22_GiaiBPTBacHai[tn]": ()=>{
                if (ti + 1 >= tfC.length) {
                    setTd(true);
                } else {
                    setTi(_Lesson22_GiaiBPTBacHaiTnSetTi);
                    setTf(false);
                }
            }
        })["Lesson22_GiaiBPTBacHai[tn]"];
        let t24;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = ({
                "Lesson22_GiaiBPTBacHai[rt]": ()=>{
                    setTi(0);
                    setTf(false);
                    setTs(0);
                    setTd(false);
                    setTh([]);
                }
            })["Lesson22_GiaiBPTBacHai[rt]"];
            $[48] = t24;
        } else {
            t24 = $[48];
        }
        rt = t24;
        const mri = mh.map({
            "Lesson22_GiaiBPTBacHai[mh.map()]": (h_1)=>({
                    correct: h_1.c,
                    qText: mcQ[h_1.q].q,
                    correctText: mcQ[h_1.q].o[mcQ[h_1.q].a],
                    yourText: mcQ[h_1.q].o[h_1.s]
                })
        }["Lesson22_GiaiBPTBacHai[mh.map()]"]);
        tri = th.map({
            "Lesson22_GiaiBPTBacHai[th.map()]": (h_2)=>({
                    correct: h_2.c,
                    qText: tfC[h_2.q].s,
                    correctText: tfC[h_2.q].a ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.g ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson22_GiaiBPTBacHai[th.map()]"]);
        fri = fc ? fQ.map({
            "Lesson22_GiaiBPTBacHai[fQ.map()]": (q_2)=>({
                    correct: cf(q_2.id),
                    qText: q_2.tp,
                    correctText: q_2.ans,
                    yourText: fa[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson22_GiaiBPTBacHai[fQ.map()]"]) : [];
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
            t27 = t("1. Quy Tr\xECnh", "1. Steps");
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
            t29 = t("2. B\u1EA3ng Nghi\u1EC7m", "2. Solution Table");
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
            t31 = t("3. V\xED D\u1EE5", "3. Examples");
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
        if ($[69] !== t) {
            t35 = t("Mini Game", "Mini Game");
            $[69] = t;
            $[70] = t35;
        } else {
            t35 = $[70];
        }
        let t36;
        if ($[71] !== t35) {
            t36 = [
                "mg",
                "\uD83C\uDFAE",
                t35
            ];
            $[71] = t35;
            $[72] = t36;
        } else {
            t36 = $[72];
        }
        let t37;
        if ($[73] !== t26 || $[74] !== t28 || $[75] !== t30 || $[76] !== t32 || $[77] !== t34 || $[78] !== t36) {
            t37 = [
                t26,
                t28,
                t30,
                t32,
                t34,
                t36
            ];
            $[73] = t26;
            $[74] = t28;
            $[75] = t30;
            $[76] = t32;
            $[77] = t34;
            $[78] = t36;
            $[79] = t37;
        } else {
            t37 = $[79];
        }
        const tabs = t37;
        if ($[80] === Symbol.for("react.memo_cache_sentinel")) {
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
            $[80] = t12;
            $[81] = t22;
        } else {
            t12 = $[80];
            t22 = $[81];
        }
        let t38;
        if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
            t38 = {
                marginBottom: 24
            };
            $[82] = t38;
        } else {
            t38 = $[82];
        }
        let t39;
        if ($[83] === Symbol.for("react.memo_cache_sentinel")) {
            t39 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[83] = t39;
        } else {
            t39 = $[83];
        }
        let t40;
        if ($[84] !== t) {
            t40 = t("Quay l\u1EA1i", "Back");
            $[84] = t;
            $[85] = t40;
        } else {
            t40 = $[85];
        }
        if ($[86] !== t40) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t38,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t39,
                    children: [
                        "← ",
                        t40
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 741,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 741,
                columnNumber: 13
            }, this);
            $[86] = t40;
            $[87] = t13;
        } else {
            t13 = $[87];
        }
        let t41;
        let t42;
        let t43;
        let t44;
        if ($[88] === Symbol.for("react.memo_cache_sentinel")) {
            t41 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: "bold",
                            fontSize: 22,
                            color: "#0B4F5C"
                        },
                        children: "Chương VII · Bất Phương Trình Bậc Hai Một Ẩn"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                        lineNumber: 760,
                        columnNumber: 18
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 28,
                            fontWeight: 600,
                            marginTop: 4
                        },
                        children: "Bài 22: Giải Bất Phương Trình Bậc Hai"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                        lineNumber: 764,
                        columnNumber: 62
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 760,
                columnNumber: 13
            }, this);
            t43 = {
                display: "flex",
                gap: 10
            };
            t44 = ({
                "Lesson22_GiaiBPTBacHai[<button>.onClick]": ()=>setLang("vi")
            })["Lesson22_GiaiBPTBacHai[<button>.onClick]"];
            $[88] = t41;
            $[89] = t42;
            $[90] = t43;
            $[91] = t44;
        } else {
            t41 = $[88];
            t42 = $[89];
            t43 = $[90];
            t44 = $[91];
        }
        const t45 = lang === "vi" ? "black" : "#f9f9f9";
        const t46 = lang === "vi" ? "white" : "black";
        let t47;
        if ($[92] !== t45 || $[93] !== t46) {
            t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t44,
                style: {
                    background: t45,
                    color: t46,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 790,
                columnNumber: 13
            }, this);
            $[92] = t45;
            $[93] = t46;
            $[94] = t47;
        } else {
            t47 = $[94];
        }
        let t48;
        if ($[95] === Symbol.for("react.memo_cache_sentinel")) {
            t48 = ({
                "Lesson22_GiaiBPTBacHai[<button>.onClick]": ()=>setLang("en")
            })["Lesson22_GiaiBPTBacHai[<button>.onClick]"];
            $[95] = t48;
        } else {
            t48 = $[95];
        }
        const t49 = lang === "en" ? "black" : "#f9f9f9";
        const t50 = lang === "en" ? "white" : "black";
        let t51;
        if ($[96] !== t49 || $[97] !== t50) {
            t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t48,
                style: {
                    background: t49,
                    color: t50,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 819,
                columnNumber: 13
            }, this);
            $[96] = t49;
            $[97] = t50;
            $[98] = t51;
        } else {
            t51 = $[98];
        }
        if ($[99] !== t47 || $[100] !== t51) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t41,
                children: [
                    t42,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: t43,
                        children: [
                            t47,
                            t51
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                        lineNumber: 836,
                        columnNumber: 76
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 836,
                columnNumber: 13
            }, this);
            $[99] = t47;
            $[100] = t51;
            $[101] = t14;
        } else {
            t14 = $[101];
        }
        let t52;
        let t53;
        if ($[102] === Symbol.for("react.memo_cache_sentinel")) {
            t52 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t53 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[102] = t52;
            $[103] = t53;
        } else {
            t52 = $[102];
            t53 = $[103];
        }
        let t54;
        if ($[104] !== t) {
            t54 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Objectives");
            $[104] = t;
            $[105] = t54;
        } else {
            t54 = $[105];
        }
        let t55;
        if ($[106] !== t54) {
            t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t53,
                children: [
                    "🎯 ",
                    t54
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 874,
                columnNumber: 13
            }, this);
            $[106] = t54;
            $[107] = t55;
        } else {
            t55 = $[107];
        }
        let t56;
        if ($[108] !== t) {
            t56 = t("N\u1EAFm v\u1EEFng quy tr\xECnh 3 b\u01B0\u1EDBc gi\u1EA3i BPT b\u1EADc hai.", "Master the 3-step process for solving quadratic inequalities.");
            $[108] = t;
            $[109] = t56;
        } else {
            t56 = $[109];
        }
        let t57;
        if ($[110] !== t) {
            t57 = t("\xC1p d\u1EE5ng b\u1EA3ng x\xE9t d\u1EA5u \u0111\u1EC3 \u0111\u1ECDc nghi\u1EC7m.", "Use sign tables to read solutions.");
            $[110] = t;
            $[111] = t57;
        } else {
            t57 = $[111];
        }
        let t58;
        if ($[112] !== t) {
            t58 = t("Gi\u1EA3i th\xE0nh th\u1EA1o 4 d\u1EA1ng: >, \u2265, <, \u2264.", "Fluently solve all 4 forms: >, \u2265, <, \u2264.");
            $[112] = t;
            $[113] = t58;
        } else {
            t58 = $[113];
        }
        let t59;
        if ($[114] !== t) {
            t59 = t("X\u1EED l\xFD tr\u01B0\u1EDDng h\u1EE3p \u0111\u1EB7c bi\u1EC7t \u0394=0 v\xE0 \u0394<0.", "Handle special cases \u0394=0 and \u0394<0.");
            $[114] = t;
            $[115] = t59;
        } else {
            t59 = $[115];
        }
        let t60;
        if ($[116] !== t) {
            t60 = t("Gi\u1EA3i BPT b\u1EADc hai ch\u1EE9a tham s\u1ED1.", "Solve quadratic inequalities with parameters.");
            $[116] = t;
            $[117] = t60;
        } else {
            t60 = $[117];
        }
        let t61;
        if ($[118] !== t56 || $[119] !== t57 || $[120] !== t58 || $[121] !== t59 || $[122] !== t60) {
            t61 = [
                t56,
                t57,
                t58,
                t59,
                t60
            ].map(_Lesson22_GiaiBPTBacHaiAnonymous);
            $[118] = t56;
            $[119] = t57;
            $[120] = t58;
            $[121] = t59;
            $[122] = t60;
            $[123] = t61;
        } else {
            t61 = $[123];
        }
        if ($[124] !== t55 || $[125] !== t61) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t52,
                children: [
                    t55,
                    t61
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 933,
                columnNumber: 13
            }, this);
            $[124] = t55;
            $[125] = t61;
            $[126] = t15;
        } else {
            t15 = $[126];
        }
        let t62;
        let t63;
        if ($[127] === Symbol.for("react.memo_cache_sentinel")) {
            t62 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t63 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[127] = t62;
            $[128] = t63;
        } else {
            t62 = $[127];
            t63 = $[128];
        }
        if ($[129] !== tabs) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t62,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t63,
                    children: tabs.map({
                        "Lesson22_GiaiBPTBacHai[tabs.map()]": (t64)=>{
                            const [id_2, icon, label] = t64;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson22_GiaiBPTBacHai[tabs.map() > <button>.onClick]": ()=>sc(id_2)
                                }["Lesson22_GiaiBPTBacHai[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson22_GiaiBPTBacHaiTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson22_GiaiBPTBacHaiTabsMapButtonOnMouseLeave,
                                children: [
                                    icon,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                lineNumber: 968,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson22_GiaiBPTBacHai[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 965,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 965,
                columnNumber: 13
            }, this);
            $[129] = tabs;
            $[130] = t16;
        } else {
            t16 = $[130];
        }
        let t64;
        if ($[131] === Symbol.for("react.memo_cache_sentinel")) {
            t64 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[131] = t64;
        } else {
            t64 = $[131];
        }
        let t65;
        if ($[132] !== t) {
            t65 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[132] = t;
            $[133] = t65;
        } else {
            t65 = $[133];
        }
        let t66;
        if ($[134] !== t65) {
            t66 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDE80",
                title: t65
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1009,
                columnNumber: 13
            }, this);
            $[134] = t65;
            $[135] = t66;
        } else {
            t66 = $[135];
        }
        let t67;
        let t68;
        if ($[136] === Symbol.for("react.memo_cache_sentinel")) {
            t67 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t68 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[136] = t67;
            $[137] = t68;
        } else {
            t67 = $[136];
            t68 = $[137];
        }
        let t69;
        if ($[138] !== t) {
            t69 = t("B\xE0i to\xE1n kinh t\u1EBF: doanh thu R(x)=\u2212x\xB2+10x v\xE0 chi ph\xED C(x)=2x+15. C\u1EA7n t\xECm x \u0111\u1EC3 c\xF3 l\xE3i: R(x)>C(x), t\u1EE9c \u2212x\xB2+10x>2x+15, t\u1EE9c \u2212x\xB2+8x\u221215>0. \u0110\xE2y l\xE0 b\u1EA5t ph\u01B0\u01A1ng tr\xECnh b\u1EADc hai!", "Economic problem: revenue R(x)=\u2212x\xB2+10x, cost C(x)=2x+15. Find x for profit: R(x)>C(x) \u2192 \u2212x\xB2+8x\u221215>0. This is a quadratic inequality!");
            $[138] = t;
            $[139] = t69;
        } else {
            t69 = $[139];
        }
        let t70;
        if ($[140] !== t69) {
            t70 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t68,
                children: t69
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1045,
                columnNumber: 13
            }, this);
            $[140] = t69;
            $[141] = t70;
        } else {
            t70 = $[141];
        }
        let t71;
        if ($[142] === Symbol.for("react.memo_cache_sentinel")) {
            t71 = {
                fontSize: 16
            };
            $[142] = t71;
        } else {
            t71 = $[142];
        }
        let t72;
        if ($[143] !== t) {
            t72 = t("Gi\u1EA3i \u2212x\xB2+8x\u221215>0. G\u1EE3i \xFD: t\xECm nghi\u1EC7m r\u1ED3i d\xF9ng b\u1EA3ng x\xE9t d\u1EA5u.", "Solve \u2212x\xB2+8x\u221215>0. Hint: find roots then use sign table.");
            $[143] = t;
            $[144] = t72;
        } else {
            t72 = $[144];
        }
        let t73;
        if ($[145] !== t72) {
            t73 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t71,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t72
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                        lineNumber: 1070,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1070,
                columnNumber: 13
            }, this);
            $[145] = t72;
            $[146] = t73;
        } else {
            t73 = $[146];
        }
        let t74;
        if ($[147] !== t70 || $[148] !== t73) {
            t74 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t67,
                children: [
                    t70,
                    t73
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1078,
                columnNumber: 13
            }, this);
            $[147] = t70;
            $[148] = t73;
            $[149] = t74;
        } else {
            t74 = $[149];
        }
        if ($[150] !== t66 || $[151] !== t74) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "w",
                style: t64,
                children: [
                    t66,
                    t74
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1086,
                columnNumber: 13
            }, this);
            $[150] = t66;
            $[151] = t74;
            $[152] = t17;
        } else {
            t17 = $[152];
        }
        let t75;
        if ($[153] === Symbol.for("react.memo_cache_sentinel")) {
            t75 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[153] = t75;
        } else {
            t75 = $[153];
        }
        let t76;
        if ($[154] !== t) {
            t76 = t("1. Quy Tr\xECnh Gi\u1EA3i BPT B\u1EADc Hai", "1. Steps to Solve Quadratic Inequality");
            $[154] = t;
            $[155] = t76;
        } else {
            t76 = $[155];
        }
        let t77;
        if ($[156] !== t76) {
            t77 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t76
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1113,
                columnNumber: 13
            }, this);
            $[156] = t76;
            $[157] = t77;
        } else {
            t77 = $[157];
        }
        let t78;
        let t79;
        if ($[158] === Symbol.for("react.memo_cache_sentinel")) {
            t78 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t79 = {
                fontWeight: "bold",
                fontSize: 16,
                color: "#0B4F5C",
                marginBottom: 14
            };
            $[158] = t78;
            $[159] = t79;
        } else {
            t78 = $[158];
            t79 = $[159];
        }
        let t80;
        if ($[160] !== t) {
            t80 = t("3 b\u01B0\u1EDBc gi\u1EA3i b\u1EA5t ph\u01B0\u01A1ng tr\xECnh b\u1EADc hai ax\xB2+bx+c \u2265 0 (ho\u1EB7c >0, \u22640, <0):", "3 steps to solve ax\xB2+bx+c\u22650 (or >0,\u22640,<0):");
            $[160] = t;
            $[161] = t80;
        } else {
            t80 = $[161];
        }
        let t81;
        if ($[162] !== t80) {
            t81 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t79,
                children: t80
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1151,
                columnNumber: 13
            }, this);
            $[162] = t80;
            $[163] = t81;
        } else {
            t81 = $[163];
        }
        let t82;
        if ($[164] === Symbol.for("react.memo_cache_sentinel")) {
            t82 = {
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "all 0.3s"
            };
            $[164] = t82;
        } else {
            t82 = $[164];
        }
        let t83;
        if ($[165] !== t) {
            t83 = t("\u2460 T\xEDnh \u0394=b\xB2\u22124ac. N\u1EBFu \u0394>0 t\xECm x\u2081<x\u2082; \u0394=0 t\xECm x\u2080; \u0394<0 ghi 'v\xF4 nghi\u1EC7m'", "\u2460 Compute \u0394=b\xB2\u22124ac. If \u0394>0 find x\u2081<x\u2082; \u0394=0 find x\u2080; \u0394<0 note 'no real roots'");
            $[165] = t;
            $[166] = t83;
        } else {
            t83 = $[166];
        }
        let t84;
        if ($[167] !== t) {
            t84 = t("\u2461 L\u1EADp b\u1EA3ng x\xE9t d\u1EA5u c\u1EE7a f(x)=ax\xB2+bx+c", "\u2461 Build the sign table for f(x)=ax\xB2+bx+c");
            $[167] = t;
            $[168] = t84;
        } else {
            t84 = $[168];
        }
        let t85;
        if ($[169] !== t) {
            t85 = t("\u2462 \u0110\u1ECDc nghi\u1EC7m t\u1EEB b\u1EA3ng d\u1EA5u theo y\xEAu c\u1EA7u b\u1EA5t ph\u01B0\u01A1ng tr\xECnh", "\u2462 Read solution from sign table according to the inequality direction");
            $[169] = t;
            $[170] = t85;
        } else {
            t85 = $[170];
        }
        let t86;
        if ($[171] !== t83 || $[172] !== t84 || $[173] !== t85) {
            t86 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t82,
                children: [
                    t83,
                    t84,
                    t85
                ].map(_Lesson22_GiaiBPTBacHaiAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1195,
                columnNumber: 13
            }, this);
            $[171] = t83;
            $[172] = t84;
            $[173] = t85;
            $[174] = t86;
        } else {
            t86 = $[174];
        }
        let t87;
        if ($[175] !== t81 || $[176] !== t86) {
            t87 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t78,
                children: [
                    t81,
                    t86
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1205,
                columnNumber: 13
            }, this);
            $[175] = t81;
            $[176] = t86;
            $[177] = t87;
        } else {
            t87 = $[177];
        }
        if ($[178] !== t77 || $[179] !== t87) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k1",
                style: t75,
                children: [
                    t77,
                    t87
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1213,
                columnNumber: 13
            }, this);
            $[178] = t77;
            $[179] = t87;
            $[180] = t18;
        } else {
            t18 = $[180];
        }
        let t88;
        if ($[181] === Symbol.for("react.memo_cache_sentinel")) {
            t88 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[181] = t88;
        } else {
            t88 = $[181];
        }
        let t89;
        if ($[182] !== t) {
            t89 = t("2. B\u1EA3ng T\u1ED5ng H\u1EE3p Nghi\u1EC7m", "2. Solution Summary Table");
            $[182] = t;
            $[183] = t89;
        } else {
            t89 = $[183];
        }
        let t90;
        if ($[184] !== t89) {
            t90 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t89
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1240,
                columnNumber: 13
            }, this);
            $[184] = t89;
            $[185] = t90;
        } else {
            t90 = $[185];
        }
        let t91;
        let t92;
        let t93;
        if ($[186] === Symbol.for("react.memo_cache_sentinel")) {
            t91 = {
                overflowX: "auto",
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t92 = {
                borderCollapse: "collapse",
                width: "100%",
                fontSize: 13,
                minWidth: 600
            };
            t93 = {
                background: "#0B4F5C",
                color: "white"
            };
            $[186] = t91;
            $[187] = t92;
            $[188] = t93;
        } else {
            t91 = $[186];
            t92 = $[187];
            t93 = $[188];
        }
        let t94;
        if ($[189] !== t) {
            t94 = t("\u0110i\u1EC1u ki\u1EC7n", "Condition");
            $[189] = t;
            $[190] = t94;
        } else {
            t94 = $[190];
        }
        let t95;
        if ($[191] !== t) {
            t95 = t("BPT: f(x)>0", "f(x)>0");
            $[191] = t;
            $[192] = t95;
        } else {
            t95 = $[192];
        }
        let t96;
        if ($[193] !== t) {
            t96 = t("BPT: f(x)\u22650", "f(x)\u22650");
            $[193] = t;
            $[194] = t96;
        } else {
            t96 = $[194];
        }
        let t97;
        if ($[195] !== t) {
            t97 = t("BPT: f(x)<0", "f(x)<0");
            $[195] = t;
            $[196] = t97;
        } else {
            t97 = $[196];
        }
        let t98;
        if ($[197] !== t) {
            t98 = t("BPT: f(x)\u22640", "f(x)\u22640");
            $[197] = t;
            $[198] = t98;
        } else {
            t98 = $[198];
        }
        let t99;
        if ($[199] !== t94 || $[200] !== t95 || $[201] !== t96 || $[202] !== t97 || $[203] !== t98) {
            t99 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                    style: t93,
                    children: [
                        t94,
                        t95,
                        t96,
                        t97,
                        t98
                    ].map(_Lesson22_GiaiBPTBacHaiAnonymous3)
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 1315,
                    columnNumber: 20
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1315,
                columnNumber: 13
            }, this);
            $[199] = t94;
            $[200] = t95;
            $[201] = t96;
            $[202] = t97;
            $[203] = t98;
            $[204] = t99;
        } else {
            t99 = $[204];
        }
        let t100;
        if ($[205] === Symbol.for("react.memo_cache_sentinel")) {
            t100 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                children: [
                    [
                        "a>0, \u0394>0",
                        "(\u2212\u221E,x\u2081)\u222A(x\u2082,+\u221E)",
                        "(\u2212\u221E,x\u2081]\u222A[x\u2082,+\u221E)",
                        "(x\u2081,x\u2082)",
                        "[x\u2081,x\u2082]"
                    ],
                    [
                        "a>0, \u0394=0",
                        "x\u2260x\u2080 (\u211D{x\u2080})",
                        "\u211D",
                        "\u2205",
                        "{x\u2080}"
                    ],
                    [
                        "a>0, \u0394<0",
                        "\u211D",
                        "\u211D",
                        "\u2205",
                        "\u2205"
                    ],
                    [
                        "a<0, \u0394>0",
                        "(x\u2081,x\u2082)",
                        "[x\u2081,x\u2082]",
                        "(\u2212\u221E,x\u2081)\u222A(x\u2082,+\u221E)",
                        "(\u2212\u221E,x\u2081]\u222A[x\u2082,+\u221E)"
                    ],
                    [
                        "a<0, \u0394=0",
                        "\u2205",
                        "{x\u2080}",
                        "x\u2260x\u2080 (\u211D{x\u2080})",
                        "\u211D"
                    ],
                    [
                        "a<0, \u0394<0",
                        "\u2205",
                        "\u2205",
                        "\u211D",
                        "\u211D"
                    ]
                ].map(_Lesson22_GiaiBPTBacHaiAnonymous4)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1327,
                columnNumber: 14
            }, this);
            $[205] = t100;
        } else {
            t100 = $[205];
        }
        let t101;
        if ($[206] !== t99) {
            t101 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t91,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: t92,
                    children: [
                        t99,
                        t100
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 1334,
                    columnNumber: 69
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1334,
                columnNumber: 14
            }, this);
            $[206] = t99;
            $[207] = t101;
        } else {
            t101 = $[207];
        }
        if ($[208] !== t101 || $[209] !== t90) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k2",
                style: t88,
                children: [
                    t90,
                    t101
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1341,
                columnNumber: 13
            }, this);
            $[208] = t101;
            $[209] = t90;
            $[210] = t19;
        } else {
            t19 = $[210];
        }
        let t102;
        if ($[211] === Symbol.for("react.memo_cache_sentinel")) {
            t102 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[211] = t102;
        } else {
            t102 = $[211];
        }
        let t103;
        if ($[212] !== t) {
            t103 = t("3. V\xED D\u1EE5 Minh Ho\u1EA1", "3. Worked Examples");
            $[212] = t;
            $[213] = t103;
        } else {
            t103 = $[213];
        }
        let t104;
        if ($[214] !== t103) {
            t104 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t103
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1368,
                columnNumber: 14
            }, this);
            $[214] = t103;
            $[215] = t104;
        } else {
            t104 = $[215];
        }
        let t105;
        if ($[216] === Symbol.for("react.memo_cache_sentinel")) {
            t105 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 20,
                transition: "all 0.3s"
            };
            $[216] = t105;
        } else {
            t105 = $[216];
        }
        let t106;
        if ($[217] !== t) {
            t106 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "90",
                style: t105,
                children: [
                    {
                        title: "x\xB2\u22125x+6<0",
                        steps: [
                            t("a=1>0, \u0394=25\u221224=1>0", "a=1>0, \u0394=1>0"),
                            t("x\u2081=2, x\u2082=3", "x\u2081=2, x\u2082=3"),
                            t("a>0,\u0394>0,BPT<0 \u2192 nghi\u1EC7m: (2,3)", "a>0,\u0394>0,BPT<0 \u2192 solution: (2,3)")
                        ],
                        c: "#1e8449",
                        bg: "#eafaf1"
                    },
                    {
                        title: "\u2212x\xB2+4x\u22123\u22650",
                        steps: [
                            t("Nh\xE2n (\u22121): x\xB2\u22124x+3\u22640", "Multiply by \u22121: x\xB2\u22124x+3\u22640 (flip sign)"),
                            t("a=1>0, \u0394=16\u221212=4>0", "a=1>0, \u0394=4>0"),
                            t("x\u2081=1, x\u2082=3. BPT\u22640 \u2192 nghi\u1EC7m: [1,3]", "x\u2081=1, x\u2082=3. \u2192 solution: [1,3]")
                        ],
                        c: "#1a5276",
                        bg: "#eaf4fb"
                    },
                    {
                        title: "x\xB2+x+1>0",
                        steps: [
                            t("a=1>0, \u0394=1\u22124=\u22123<0", "a=1>0, \u0394=\u22123<0"),
                            t("a>0, \u0394<0 \u2192 f(x)>0 m\u1ECDi x", "a>0, \u0394<0 \u2192 f(x)>0 for all x"),
                            t("Nghi\u1EC7m: x\u2208\u211D", "Solution: x\u2208\u211D")
                        ],
                        c: "#856404",
                        bg: "#fff3cd"
                    }
                ].map(_Lesson22_GiaiBPTBacHaiAnonymous5)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1388,
                columnNumber: 14
            }, this);
            $[217] = t;
            $[218] = t106;
        } else {
            t106 = $[218];
        }
        if ($[219] !== t104 || $[220] !== t106) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k3",
                style: t102,
                children: [
                    t104,
                    t106
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1410,
                columnNumber: 13
            }, this);
            $[219] = t104;
            $[220] = t106;
            $[221] = t20;
        } else {
            t20 = $[221];
        }
        let t107;
        if ($[222] === Symbol.for("react.memo_cache_sentinel")) {
            t107 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[222] = t107;
        } else {
            t107 = $[222];
        }
        let t108;
        if ($[223] !== t) {
            t108 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[223] = t;
            $[224] = t108;
        } else {
            t108 = $[224];
        }
        let t109;
        if ($[225] !== t108) {
            t109 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\u270F\uFE0F",
                title: t108
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1437,
                columnNumber: 14
            }, this);
            $[225] = t108;
            $[226] = t109;
        } else {
            t109 = $[226];
        }
        let t110;
        if ($[227] === Symbol.for("react.memo_cache_sentinel")) {
            t110 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: 36,
                transition: "all 0.3s"
            };
            $[227] = t110;
        } else {
            t110 = $[227];
        }
        let t111;
        if ($[228] !== rev || $[229] !== t) {
            t111 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t110,
                children: [
                    {
                        id: "e1",
                        q: "2x\xB2\u22127x+3\u22640",
                        a: [
                            t("a=2>0, \u0394=49\u221224=25", "a=2>0, \u0394=25"),
                            t("x\u2081=(7\u22125)/4=1/2, x\u2082=(7+5)/4=3", "x\u2081=1/2, x\u2082=3"),
                            t("a>0,\u0394>0,BPT\u22640 \u2192 [1/2, 3]", "solution: [1/2, 3]")
                        ]
                    },
                    {
                        id: "e2",
                        q: "\u22123x\xB2+6x\u22123<0",
                        a: [
                            t("\u22123(x\xB2\u22122x+1)=\u22123(x\u22121)\xB2", "factor: \u22123(x\u22121)\xB2"),
                            t("\u0394=0, x\u2080=1. a=\u22123<0", "\u0394=0, x\u2080=1, a<0"),
                            t("a<0,\u0394=0: f<0 khi x\u22601 \u2192 nghi\u1EC7m: x\u2208\u211D{1}", "solution: \u211D{1}")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("T\xECm m \u0111\u1EC3 x\xB2\u22122mx+m\xB2\u22121>0 v\u1EDBi m\u1ECDi x.", "Find m so that x\xB2\u22122mx+m\xB2\u22121>0 for all x."),
                        a: [
                            t("a=1>0. C\u1EA7n \u0394<0 \u0111\u1EC3 lu\xF4n d\u01B0\u01A1ng.", "a=1>0. Need \u0394<0 for always positive."),
                            t("\u0394=4m\xB2\u22124(m\xB2\u22121)=4<0? \u2192 4<0 v\xF4 l\xFD!", "\u0394=4<0? \u2192 impossible! \u0394=4>0 always"),
                            t("\u0394=4>0 lu\xF4n \u0111\xFAng \u2192 kh\xF4ng c\xF3 m n\xE0o tho\u1EA3 m\xE3n.", "\u0394=4>0 always \u2192 no such m exists.")
                        ]
                    }
                ].map({
                    "Lesson22_GiaiBPTBacHai[(anonymous)()]": (t112)=>{
                        const { id: id_3, q: q_3, a: a_1 } = t112;
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
                                                t("Gi\u1EA3i BPT", "Solve")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1481,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: "monospace",
                                                fontSize: 16,
                                                color: "#0B4F5C"
                                            },
                                            children: q_3
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1485,
                                            columnNumber: 58
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1476,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson22_GiaiBPTBacHai[(anonymous)() > <button>.onClick]": ()=>tr(id_3)
                                    }["Lesson22_GiaiBPTBacHai[(anonymous)() > <button>.onClick]"],
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
                                    children: rev[id_3] ? t("\u1EA8n \u25B2", "Hide \u25B2") : t("Xem \u0111\xE1p \xE1n \u25BC", "Show \u25BC")
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1489,
                                    columnNumber: 37
                                }, this),
                                rev[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_1.map(_Lesson22_GiaiBPTBacHaiAnonymousA_1Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1502,
                                    columnNumber: 140
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1476,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson22_GiaiBPTBacHai[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1457,
                columnNumber: 14
            }, this);
            $[228] = rev;
            $[229] = t;
            $[230] = t111;
        } else {
            t111 = $[230];
        }
        if ($[231] !== t109 || $[232] !== t111) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "th",
                style: t107,
                children: [
                    t109,
                    t111
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1516,
                columnNumber: 13
            }, this);
            $[231] = t109;
            $[232] = t111;
            $[233] = t21;
        } else {
            t21 = $[233];
        }
        t7 = "mg";
        if ($[234] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83C\uDFAE",
                title: "Mini Game"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1529,
                columnNumber: 12
            }, this);
            $[234] = t8;
            $[235] = t9;
        } else {
            t8 = $[234];
            t9 = $[235];
        }
        let t112;
        if ($[236] === Symbol.for("react.memo_cache_sentinel")) {
            t112 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s"
            };
            $[236] = t112;
        } else {
            t112 = $[236];
        }
        let t113;
        if ($[237] !== t) {
            t113 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[237] = t;
            $[238] = t113;
        } else {
            t113 = $[238];
        }
        let t114;
        if ($[239] !== t) {
            t114 = t("5 c\xE2u", "5 Q");
            $[239] = t;
            $[240] = t114;
        } else {
            t114 = $[240];
        }
        let t115;
        if ($[241] !== t113 || $[242] !== t114) {
            t115 = [
                "mc",
                "\uD83E\uDDE9",
                t113,
                t114
            ];
            $[241] = t113;
            $[242] = t114;
            $[243] = t115;
        } else {
            t115 = $[243];
        }
        let t116;
        if ($[244] !== t) {
            t116 = t("\u0110\xFAng / Sai", "True / False");
            $[244] = t;
            $[245] = t116;
        } else {
            t116 = $[245];
        }
        let t117;
        if ($[246] !== t) {
            t117 = t("5 th\u1EBB", "5 cards");
            $[246] = t;
            $[247] = t117;
        } else {
            t117 = $[247];
        }
        let t118;
        if ($[248] !== t116 || $[249] !== t117) {
            t118 = [
                "tf",
                "\uD83C\uDCCF",
                t116,
                t117
            ];
            $[248] = t116;
            $[249] = t117;
            $[250] = t118;
        } else {
            t118 = $[250];
        }
        let t119;
        if ($[251] !== t) {
            t119 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[251] = t;
            $[252] = t119;
        } else {
            t119 = $[252];
        }
        let t120;
        if ($[253] !== t) {
            t120 = t("3 c\xE2u", "3 items");
            $[253] = t;
            $[254] = t120;
        } else {
            t120 = $[254];
        }
        let t121;
        if ($[255] !== t119 || $[256] !== t120) {
            t121 = [
                "fill",
                "\u270D\uFE0F",
                t119,
                t120
            ];
            $[255] = t119;
            $[256] = t120;
            $[257] = t121;
        } else {
            t121 = $[257];
        }
        let t122;
        if ($[258] !== t115 || $[259] !== t118 || $[260] !== t121) {
            t122 = [
                t115,
                t118,
                t121
            ];
            $[258] = t115;
            $[259] = t118;
            $[260] = t121;
            $[261] = t122;
        } else {
            t122 = $[261];
        }
        if ($[262] !== gm || $[263] !== t122) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t112,
                children: t122.map({
                    "Lesson22_GiaiBPTBacHai[(anonymous)()]": (t123)=>{
                        const [mode, icon_0, label_0, sub] = t123;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson22_GiaiBPTBacHai[(anonymous)() > <article>.onClick]": ()=>setGm(mode)
                            }["Lesson22_GiaiBPTBacHai[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1647,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1650,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1653,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1638,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson22_GiaiBPTBacHai[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 1635,
                columnNumber: 13
            }, this);
            $[262] = gm;
            $[263] = t122;
            $[264] = t10;
        } else {
            t10 = $[264];
        }
        t11 = gm === "mc" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: [
                " ",
                !md ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1670,
                            columnNumber: 18
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 20
                            },
                            children: mcQ[mi].q
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1674,
                            columnNumber: 99
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 12
                            },
                            children: mcQ[mi].o.map({
                                "Lesson22_GiaiBPTBacHai[(anonymous)()]": (opt, i_8)=>{
                                    let bg = "white";
                                    let co = "black";
                                    if (ms !== null) {
                                        if (i_8 === mcQ[mi].a) {
                                            bg = "#eafaf1";
                                            co = "#1e8449";
                                        } else {
                                            if (i_8 === ms) {
                                                bg = "#fdf2f2";
                                                co = "#922b21";
                                            }
                                        }
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson22_GiaiBPTBacHai[(anonymous)() > <button>.onClick]": ()=>sel(i_8)
                                        }["Lesson22_GiaiBPTBacHai[(anonymous)() > <button>.onClick]"],
                                        style: {
                                            textAlign: "left",
                                            padding: "14px 18px",
                                            borderRadius: 10,
                                            border: "none",
                                            background: bg,
                                            color: co,
                                            fontSize: 15,
                                            fontWeight: ms !== null && (i_8 === ms || i_8 === mcQ[mi].a) ? 600 : 400,
                                            cursor: "pointer",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                        },
                                        children: [
                                            String.fromCharCode(65 + i_8),
                                            ". ",
                                            opt
                                        ]
                                    }, i_8, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                        lineNumber: 1697,
                                        columnNumber: 22
                                    }, this);
                                }
                            }["Lesson22_GiaiBPTBacHai[(anonymous)()]"])
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1678,
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1712,
                                    columnNumber: 79
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1720,
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
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 1730,
                    columnNumber: 144
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1665,
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
    if ($[265] !== gm || $[266] !== rt || $[267] !== t || $[268] !== ta || $[269] !== td || $[270] !== tf || $[271] !== tfC || $[272] !== ti || $[273] !== tn || $[274] !== tri || $[275] !== ts) {
        t23 = gm === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: [
                " ",
                !td ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1802,
                            columnNumber: 18
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1813,
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
                                                "Lesson22_GiaiBPTBacHai[<button>.onClick]": ()=>ta(true)
                                            }["Lesson22_GiaiBPTBacHai[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1821,
                                            columnNumber: 14
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "Lesson22_GiaiBPTBacHai[<button>.onClick]": ()=>ta(false)
                                            }["Lesson22_GiaiBPTBacHai[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1832,
                                            columnNumber: 54
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1817,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1843,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1852,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1806,
                            columnNumber: 103
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                    items: tri,
                    onReset: rt,
                    scoreLabel: ts === tfC.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                    t: t
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 1861,
                    columnNumber: 158
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1797,
            columnNumber: 26
        }, this);
        $[265] = gm;
        $[266] = rt;
        $[267] = t;
        $[268] = ta;
        $[269] = td;
        $[270] = tf;
        $[271] = tfC;
        $[272] = ti;
        $[273] = tn;
        $[274] = tri;
        $[275] = ts;
        $[276] = t23;
    } else {
        t23 = $[276];
    }
    let t24;
    if ($[277] !== fQ || $[278] !== fa || $[279] !== fc || $[280] !== fri || $[281] !== fs || $[282] !== gm || $[283] !== t) {
        t24 = gm === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: [
                " ",
                !fc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 18,
                                fontWeight: 600,
                                marginBottom: 20
                            },
                            children: t("\u0110i\u1EC1n c\xE2u tr\u1EA3 l\u1EDDi", "Fill in the blanks")
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1884,
                            columnNumber: 18
                        }, this),
                        fQ.map({
                            "Lesson22_GiaiBPTBacHai[fQ.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1891,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1895,
                                            columnNumber: 49
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: fa[q_4.id] || "",
                                            onChange: {
                                                "Lesson22_GiaiBPTBacHai[fQ.map() > <input>.onChange]": (e_1)=>setFa({
                                                        "Lesson22_GiaiBPTBacHai[fQ.map() > <input>.onChange > setFa()]": (p_0)=>({
                                                                ...p_0,
                                                                [q_4.id]: e_1.target.value
                                                            })
                                                    }["Lesson22_GiaiBPTBacHai[fQ.map() > <input>.onChange > setFa()]"])
                                            }["Lesson22_GiaiBPTBacHai[fQ.map() > <input>.onChange]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                            lineNumber: 1899,
                                            columnNumber: 30
                                        }, this)
                                    ]
                                }, q_4.id, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                    lineNumber: 1889,
                                    columnNumber: 60
                                }, this)
                        }["Lesson22_GiaiBPTBacHai[fQ.map()]"]),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson22_GiaiBPTBacHai[<button>.onClick]": ()=>setFc(true)
                            }["Lesson22_GiaiBPTBacHai[<button>.onClick]"],
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                            lineNumber: 1917,
                            columnNumber: 48
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                    items: fri,
                    onReset: {
                        "Lesson22_GiaiBPTBacHai[<RS>.onReset]": ()=>{
                            setFa({});
                            setFc(false);
                        }
                    }["Lesson22_GiaiBPTBacHai[<RS>.onReset]"],
                    scoreLabel: fs === fQ.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fs >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                    t: t
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                    lineNumber: 1928,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1879,
            columnNumber: 28
        }, this);
        $[277] = fQ;
        $[278] = fa;
        $[279] = fc;
        $[280] = fri;
        $[281] = fs;
        $[282] = gm;
        $[283] = t;
        $[284] = t24;
    } else {
        t24 = $[284];
    }
    let t25;
    if ($[285] !== t10 || $[286] !== t11 || $[287] !== t23 || $[288] !== t24 || $[289] !== t7 || $[290] !== t8 || $[291] !== t9) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1947,
            columnNumber: 11
        }, this);
        $[285] = t10;
        $[286] = t11;
        $[287] = t23;
        $[288] = t24;
        $[289] = t7;
        $[290] = t8;
        $[291] = t9;
        $[292] = t25;
    } else {
        t25 = $[292];
    }
    let t26;
    if ($[293] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1961,
            columnNumber: 11
        }, this);
        $[293] = t26;
    } else {
        t26 = $[293];
    }
    let t27;
    let t28;
    let t29;
    if ($[294] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: {
                textAlign: "center",
                color: "#777",
                fontSize: 15,
                marginBottom: 60
            },
            children: "Toán 10 · Chân Trời Sáng Tạo · Bài 24 / Chương VII"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1972,
            columnNumber: 11
        }, this);
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: ".reveal{opacity:0;transform:translateY(28px) scale(0.97);transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1);will-change:opacity,transform;}.reveal.visible{opacity:1;transform:translateY(0) scale(1);}.reveal[data-reveal-stagger].visible{opacity:1;transform:none;}.reveal[data-reveal-stagger]>*{opacity:0;transform:translateY(24px) scale(0.97);will-change:opacity,transform;}header.reveal{transform:translateY(-18px);opacity:0;}header.reveal.visible{opacity:1;transform:translateY(0);}article{transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease;border-radius:10px;padding:8px;}article:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 12px 28px rgba(0,0,0,0.12);}"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1978,
            columnNumber: 11
        }, this);
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1979,
            columnNumber: 11
        }, this);
        $[294] = t27;
        $[295] = t28;
        $[296] = t29;
    } else {
        t27 = $[294];
        t28 = $[295];
        t29 = $[296];
    }
    let t30;
    if ($[297] !== t12 || $[298] !== t13 || $[299] !== t14 || $[300] !== t15 || $[301] !== t16 || $[302] !== t17 || $[303] !== t18 || $[304] !== t19 || $[305] !== t20 || $[306] !== t21 || $[307] !== t25) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                t27,
                t28,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 1990,
            columnNumber: 11
        }, this);
        $[297] = t12;
        $[298] = t13;
        $[299] = t14;
        $[300] = t15;
        $[301] = t16;
        $[302] = t17;
        $[303] = t18;
        $[304] = t19;
        $[305] = t20;
        $[306] = t21;
        $[307] = t25;
        $[308] = t30;
    } else {
        t30 = $[308];
    }
    let t31;
    if ($[309] !== t22 || $[310] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t22,
            children: t30
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
            lineNumber: 2008,
            columnNumber: 11
        }, this);
        $[309] = t22;
        $[310] = t30;
        $[311] = t31;
    } else {
        t31 = $[311];
    }
    return t31;
}
_s(Lesson22_GiaiBPTBacHai, "3e5ld66n3Vcdr6IFVQyUkgXiBp8=");
_c2 = Lesson22_GiaiBPTBacHai;
function _Lesson22_GiaiBPTBacHaiAnonymousA_1Map(l, i_7) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: l
    }, i_7, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2018,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiAnonymous5(ex, i_6) {
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
                    fontFamily: "monospace",
                    fontSize: 16,
                    fontWeight: 700,
                    color: ex.c,
                    background: ex.bg,
                    padding: "4px 12px",
                    borderRadius: 6,
                    display: "inline-block",
                    marginBottom: 10
                },
                children: ex.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 2030,
                columnNumber: 6
            }, this),
            ex.steps.map({
                "Lesson22_GiaiBPTBacHai[(anonymous)() > ex.steps.map()]": (s_3, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 14,
                            color: "#555",
                            marginBottom: 6,
                            display: "flex",
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: ex.c,
                                    fontWeight: 700,
                                    flexShrink: 0
                                },
                                children: "→"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                lineNumber: 2047,
                                columnNumber: 10
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: s_3
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                                lineNumber: 2051,
                                columnNumber: 20
                            }, this)
                        ]
                    }, j, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                        lineNumber: 2041,
                        columnNumber: 77
                    }, this)
            }["Lesson22_GiaiBPTBacHai[(anonymous)() > ex.steps.map()]"])
        ]
    }, i_6, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2025,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiAnonymous4(row, ri) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        style: {
            background: ri % 2 === 0 ? "#f9f9f9" : "white"
        },
        children: row.map(_Lesson22_GiaiBPTBacHaiAnonymousRowMap)
    }, ri, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2055,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiAnonymousRowMap(cell, ci) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        style: {
            padding: "8px 12px",
            textAlign: "center",
            border: "1px solid #e0e0e0",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: ci === 0 ? 700 : 400,
            color: ci === 0 ? "#0B4F5C" : "#333"
        },
        children: cell
    }, ci, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2060,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiAnonymous3(h_3, i_5) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        style: {
            padding: "10px 12px",
            textAlign: "center",
            fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.2)"
        },
        children: h_3
    }, i_5, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2071,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiAnonymous2(step, i_4) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            gap: 14,
            alignItems: "flex-start"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "black",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0
                },
                children: i_4 + 1
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 2083,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    color: "#555",
                    lineHeight: 1.7,
                    paddingTop: 4
                },
                children: step
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
                lineNumber: 2095,
                columnNumber: 23
            }, this)
        ]
    }, i_4, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2079,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson22_GiaiBPTBacHaiTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson22_GiaiBPTBacHaiAnonymous(item, idx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: item
    }, idx, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson22_GiaiBPTBacHai.js",
        lineNumber: 2111,
        columnNumber: 10
    }, this);
}
function _Lesson22_GiaiBPTBacHaiTnSetTi(i_3) {
    return i_3 + 1;
}
function _Lesson22_GiaiBPTBacHaiTaSetTs(s_2) {
    return s_2 + 1;
}
function _Lesson22_GiaiBPTBacHaiNxSetMi(i_2) {
    return i_2 + 1;
}
function _Lesson22_GiaiBPTBacHaiSelSetMsc(s_1) {
    return s_1 + 1;
}
function _Lesson22_GiaiBPTBacHaiCfAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson22_GiaiBPTBacHaiSc(id) {
    const el_2 = document.getElementById(id);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson22_GiaiBPTBacHaiUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson22_GiaiBPTBacHaiUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp4, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson22_GiaiBPTBacHai[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson22_GiaiBPTBacHai[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp4(entries, observer) {
    entries.forEach({
        "Lesson22_GiaiBPTBacHai[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const s_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson22_GiaiBPTBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (c_0, i_0)=>setTimeout({
                                "Lesson22_GiaiBPTBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    c_0.style.opacity = "1";
                                    c_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson22_GiaiBPTBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * s_0)
                    }["Lesson22_GiaiBPTBacHai[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson22_GiaiBPTBacHai[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson22_GiaiBPTBacHaiUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const s = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson22_GiaiBPTBacHai[useEffect() > els.forEach() > (anonymous)()]": (c, i)=>{
                c.style.opacity = "0";
                c.style.transform = "translateY(24px) scale(0.97)";
                c.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * s}ms,transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * s}ms`;
                c.style.willChange = "opacity,transform";
            }
        }["Lesson22_GiaiBPTBacHai[useEffect() > els.forEach() > (anonymous)()]"]);
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
__turbopack_context__.k.register(_c2, "Lesson22_GiaiBPTBacHai");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_d68742d8._.js.map