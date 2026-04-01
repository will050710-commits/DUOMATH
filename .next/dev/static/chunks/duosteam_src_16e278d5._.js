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
"use client";
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
        "DuoTranslate.useCallback[handleMouseUp]": (e_0)=>{
            if (panelRef.current?.contains(e_0.target)) return;
            if (isInteractive(mouseDownRef.current.target)) return;
            const dx = Math.abs(e_0.clientX - mouseDownRef.current.x);
            const dy = Math.abs(e_0.clientY - mouseDownRef.current.y);
            if (dx < 8 && dy < 8) return; // plain click, not a drag selection
            // Wait 80ms so React onClick handlers settle before we read the selection
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
        sessionId
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    async function doTranslate(text_0) {
        setSelectedText(text_0);
        setIsOpen(true);
        setLoading(true);
        setResults(null);
        try {
            // duoServer.translateText builds the strict JSON prompt internally
            const parsed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$duoServer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translateText"])(sessionId, text_0);
            setResults(parsed);
        } catch (e_1) {
            setResults({
                error: true,
                raw: `Unexpected error: ${e_1?.message || e_1}\n\nMake sure server.py is running.`
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
                lineNumber: 117,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backdrop,
                onClick: handleClose
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                lineNumber: 119,
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
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerTitle,
                                                children: "DuoTranslate"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 128,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].headerSub,
                                                children: "EN → VI"
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 129,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].closeBtn,
                                onClick: handleClose,
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                        lineNumber: 124,
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
                                lineNumber: 137,
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
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                        lineNumber: 136,
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
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Translating..."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 143,
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
                                        lineNumber: 150,
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
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 149,
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
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].translationText,
                                                children: results.translation
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 169,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 167,
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
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summaryText,
                                                children: results.summary
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 172,
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
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, this),
                                            results.words.map((w, i_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordCard,
                                                    style: {
                                                        animationDelay: `${i_0 * 0.06}s`
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
                                                                    lineNumber: 183,
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
                                                                    lineNumber: 184,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 182,
                                                            columnNumber: 23
                                                        }, this),
                                                        w.pronunciation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordPronun,
                                                            children: w.pronunciation
                                                        }, void 0, false, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 191,
                                                            columnNumber: 43
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordVi,
                                                            children: w.vietnamese
                                                        }, void 0, false, {
                                                            fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                            lineNumber: 192,
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
                                                            lineNumber: 193,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, i_0, true, {
                                                    fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                                    lineNumber: 179,
                                                    columnNumber: 50
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 177,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 165,
                                columnNumber: 53
                            }, this),
                            !loading && !results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hintState,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "🖱️"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 200,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Bôi đen bất kỳ đoạn văn nào để dịch sang tiếng Việt"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                                lineNumber: 199,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
                lineNumber: 121,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/DuoMCB/DuoTranslate.js",
        lineNumber: 116,
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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson1_MenhDe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/DuoMCB/DuoTranslate.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable react-hooks/static-components */ "use client";
;
;
;
;
const SectionHeader = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "0389d34a815a7b2cba352b51e5a1624598987d9a8bd6ea8262eb96396bd4ab07") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0389d34a815a7b2cba352b51e5a1624598987d9a8bd6ea8262eb96396bd4ab07";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 40,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 48,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 56,
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
_c = SectionHeader;
const ResultSummary = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(37);
    if ($[0] !== "0389d34a815a7b2cba352b51e5a1624598987d9a8bd6ea8262eb96396bd4ab07") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0389d34a815a7b2cba352b51e5a1624598987d9a8bd6ea8262eb96396bd4ab07";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 99,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 126,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 146,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 154,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 187,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                        lineNumber: 192,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !item.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            color: "#922b21"
                                        },
                                        children: [
                                            t("\u0110\xE1p \xE1n \u0111\xFAng:", "Correct answer:"),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: item.correctText
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                                lineNumber: 200,
                                                columnNumber: 74
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                        lineNumber: 197,
                                        columnNumber: 82
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    item.yourText && !item.correct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            color: "#777"
                                        },
                                        children: [
                                            t("B\u1EA1n ch\u1ECDn:", "You answered:"),
                                            " ",
                                            item.yourText
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                        lineNumber: 200,
                                        columnNumber: 151
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 190,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 183,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, idx, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 178,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 218,
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 259,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 259,
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 268,
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
_c1 = ResultSummary;
function Lesson1_MenhDe() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(525);
    if ($[0] !== "0389d34a815a7b2cba352b51e5a1624598987d9a8bd6ea8262eb96396bd4ab07") {
        for(let $i = 0; $i < 525; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0389d34a815a7b2cba352b51e5a1624598987d9a8bd6ea8262eb96396bd4ab07";
    }
    const [lang, setLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("vi");
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {};
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [revealedAnswers, setRevealedAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    const [gameMode, setGameMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("mc");
    const [mcIndex, setMcIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [mcSelected, setMcSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mcScore, setMcScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [mcDone, setMcDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [mcHistory, setMcHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [tfIndex, setTfIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tfFlipped, setTfFlipped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tfScore, setTfScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tfDone, setTfDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const [tfHistory, setTfHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t2);
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {};
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const [fillAnswers, setFillAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    const [fillChecked, setFillChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = [];
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson1_MenhDeUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson1_MenhDe[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson1_MenhDe[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson1_MenhDe[toggleAnswer]": (id)=>setRevealedAnswers({
                    "Lesson1_MenhDe[toggleAnswer > setRevealedAnswers()]": (p)=>({
                            ...p,
                            [id]: !p[id]
                        })
                }["Lesson1_MenhDe[toggleAnswer > setRevealedAnswers()]"])
        })["Lesson1_MenhDe[toggleAnswer]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const toggleAnswer = t6;
    const scrollTo = _Lesson1_MenhDeScrollTo;
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
    let t24;
    let t25;
    let t26;
    let t7;
    let t8;
    let t9;
    if ($[9] !== fillAnswers || $[10] !== fillChecked || $[11] !== gameMode || $[12] !== lang || $[13] !== mcDone || $[14] !== mcHistory || $[15] !== mcIndex || $[16] !== mcScore || $[17] !== mcSelected || $[18] !== revealedAnswers || $[19] !== t || $[20] !== tfDone || $[21] !== tfFlipped || $[22] !== tfHistory || $[23] !== tfIndex || $[24] !== tfScore) {
        const mcQuestions = [
            {
                q: t("C\xE2u n\xE0o d\u01B0\u1EDBi \u0111\xE2y l\xE0 m\u1EC7nh \u0111\u1EC1 \u0111\xFAng?", "Which of the following is a true proposition?"),
                options: [
                    t("\"x + 1 = 5\"", "\"x + 1 = 5\""),
                    t("\"B\u1EA1n c\xF3 kh\u1ECFe kh\xF4ng?\"", "\"Are you well?\""),
                    t("\"2 + 2 = 4\"", "\"2 + 2 = 4\""),
                    t("\"H\xE3y h\u1ECDc ch\u0103m ch\u1EC9!\"", "\"Study hard!\"")
                ],
                answer: 2,
                explain: t("\"2 + 2 = 4\" c\xF3 gi\xE1 tr\u1ECB ch\xE2n l\xFD x\xE1c \u0111\u1ECBnh (\u0110\xDANG) \u2192 l\xE0 m\u1EC7nh \u0111\u1EC1.", "\"2 + 2 = 4\" has a definite truth value (TRUE) \u2192 it is a proposition.")
            },
            {
                q: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a P: \"\u221A2 l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\" l\xE0?", "The negation of P: \"\u221A2 is rational\" is?"),
                options: [
                    t("\"\u221A2 l\xE0 s\u1ED1 th\u1EF1c\"", "\"\u221A2 is real\""),
                    t("\"\u221A2 kh\xF4ng l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\"", "\"\u221A2 is not rational\""),
                    "\"\u221A2 = 1.41\"",
                    t("\"\u221A2 l\xE0 s\u1ED1 nguy\xEAn\"", "\"\u221A2 is an integer\"")
                ],
                answer: 1,
                explain: t("\xACP: \"\u221A2 kh\xF4ng l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\" \u2192 \u0110\xDANG.", "\xACP: \"\u221A2 is not rational\" \u2192 TRUE.")
            },
            {
                q: t("P \u21D2 Q sai khi n\xE0o?", "When is P \u21D2 Q false?"),
                options: [
                    t("P sai, Q \u0111\xFAng", "P false, Q true"),
                    t("P \u0111\xFAng, Q \u0111\xFAng", "P true, Q true"),
                    t("P \u0111\xFAng, Q sai", "P true, Q false"),
                    t("P sai, Q sai", "P false, Q false")
                ],
                answer: 2,
                explain: t("P \u21D2 Q ch\u1EC9 SAI khi P \u0111\xFAng v\xE0 Q sai.", "P \u21D2 Q is FALSE only when P is true and Q is false.")
            },
            {
                q: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a \"\u2200x \u2208 \u211D, x\xB2 \u2265 0\" l\xE0?", "Negation of \"\u2200x \u2208 \u211D, x\xB2 \u2265 0\" is?"),
                options: [
                    "\u2200x \u2208 \u211D, x\xB2 < 0",
                    "\u2203x \u2208 \u211D, x\xB2 < 0",
                    "\u2203x \u2208 \u211D, x\xB2 \u2265 0",
                    "\u2200x \u2208 \u211D, x\xB2 > 0"
                ],
                answer: 1,
                explain: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a \u2200 l\xE0 \u2203: \u2203x \u2208 \u211D, x\xB2 < 0.", "Negation of \u2200 is \u2203: \u2203x \u2208 \u211D, x\xB2 < 0.")
            },
            {
                q: t("P \u27FA Q \u0111\xFAng khi n\xE0o?", "When is P \u27FA Q true?"),
                options: [
                    t("P \u0111\xFAng, Q sai", "P true, Q false"),
                    t("P sai, Q \u0111\xFAng", "P false, Q true"),
                    t("P v\xE0 Q c\xF9ng gi\xE1 tr\u1ECB ch\xE2n l\xFD", "P and Q share the same truth value"),
                    t("P v\xE0 Q kh\xE1c nhau", "P and Q differ")
                ],
                answer: 2,
                explain: t("P \u27FA Q \u0111\xFAng khi c\u1EA3 hai c\xF9ng \u0111\xFAng ho\u1EB7c c\xF9ng sai.", "P \u27FA Q is true when both are true or both are false.")
            }
        ];
        const tfCards = [
            {
                stmt: t("\"5 l\xE0 s\u1ED1 ch\u1EB5n\" l\xE0 m\u1EC7nh \u0111\u1EC1 \u0111\xFAng.", "\"5 is an even number\" is a true proposition."),
                answer: false,
                explain: t("SAI \u2014 \"5 l\xE0 s\u1ED1 ch\u1EB5n\" l\xE0 m\u1EC7nh \u0111\u1EC1 nh\u01B0ng c\xF3 gi\xE1 tr\u1ECB SAI (5 l\xE0 s\u1ED1 l\u1EBB).", "FALSE \u2014 it IS a proposition but its truth value is FALSE (5 is odd).")
            },
            {
                stmt: t("C\xE2u h\u1ECFi kh\xF4ng ph\u1EA3i l\xE0 m\u1EC7nh \u0111\u1EC1.", "A question is not a proposition."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 m\u1EC7nh \u0111\u1EC1 ph\u1EA3i l\xE0 c\xE2u kh\u1EB3ng \u0111\u1ECBnh c\xF3 th\u1EC3 x\xE1c \u0111\u1ECBnh \u0111\xFAng/sai.", "TRUE \u2014 a proposition must be declarative with a definite truth value.")
            },
            {
                stmt: t("P \u21D2 Q v\xE0 Q \u21D2 P lu\xF4n c\xF3 c\xF9ng gi\xE1 tr\u1ECB ch\xE2n l\xFD.", "P \u21D2 Q and Q \u21D2 P always share the same truth value."),
                answer: false,
                explain: t("SAI \u2014 v\xED d\u1EE5: \"chia h\u1EBFt 6 \u21D2 chia h\u1EBFt 2\" \u0111\xFAng nh\u01B0ng chi\u1EC1u ng\u01B0\u1EE3c l\u1EA1i sai.", "FALSE \u2014 \"divisible by 6 \u21D2 divisible by 2\" is true but the converse is false.")
            },
            {
                stmt: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a m\u1EC7nh \u0111\u1EC1 \u0111\xFAng l\xE0 m\u1EC7nh \u0111\u1EC1 sai.", "The negation of a true proposition is a false proposition."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 \xACP lu\xF4n c\xF3 gi\xE1 tr\u1ECB ng\u01B0\u1EE3c l\u1EA1i v\u1EDBi P.", "TRUE \u2014 \xACP always has the opposite truth value of P.")
            },
            {
                stmt: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a \u2203 l\xE0 \u2200.", "The negation of \u2203 is \u2200."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 \xAC(\u2203x, P(x)) = \u2200x, \xACP(x).", "TRUE \u2014 \xAC(\u2203x, P(x)) = \u2200x, \xACP(x).")
            }
        ];
        const fillQuestions = [
            {
                id: "f1",
                template: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a P: \"12 chia h\u1EBFt cho 3\" l\xE0 \xACP: \"___\"", "Negation of P: \"12 is divisible by 3\" is \xACP: \"___\""),
                answer: t("12 kh\xF4ng chia h\u1EBFt cho 3", "12 is not divisible by 3"),
                hint: t("Th\xEAm 'kh\xF4ng' v\xE0o m\u1EC7nh \u0111\u1EC1.", "Add 'not' to the proposition.")
            },
            {
                id: "f2",
                template: t("P \u21D2 Q ch\u1EC9 SAI khi P ___ v\xE0 Q ___.", "P \u21D2 Q is FALSE only when P is ___ and Q is ___."),
                answer: t("\u0111\xFAng, sai", "true, false"),
                hint: t("Xem l\u1EA1i b\u1EA3ng ch\xE2n tr\u1ECB.", "Review the truth table.")
            },
            {
                id: "f3",
                template: t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a \u2200x \u2208 A, P(x) l\xE0: ___ x \u2208 A, \xACP(x).", "Negation of \u2200x \u2208 A, P(x) is: ___ x \u2208 A, \xACP(x)."),
                answer: "\u2203",
                hint: t("'V\u1EDBi m\u1ECDi' \u2192 'T\u1ED3n t\u1EA1i'.", "'For all' \u2192 'There exists'.")
            }
        ];
        const handleMcSelect = {
            "Lesson1_MenhDe[handleMcSelect]": (i_1)=>{
                if (mcSelected !== null) {
                    return;
                }
                setMcSelected(i_1);
                const correct = i_1 === mcQuestions[mcIndex].answer;
                if (correct) {
                    setMcScore(_Lesson1_MenhDeHandleMcSelectSetMcScore);
                }
                setMcHistory({
                    "Lesson1_MenhDe[handleMcSelect > setMcHistory()]": (h)=>[
                            ...h,
                            {
                                q: mcIndex,
                                selected: i_1,
                                correct
                            }
                        ]
                }["Lesson1_MenhDe[handleMcSelect > setMcHistory()]"]);
            }
        }["Lesson1_MenhDe[handleMcSelect]"];
        const handleMcNext = {
            "Lesson1_MenhDe[handleMcNext]": ()=>{
                if (mcIndex + 1 >= mcQuestions.length) {
                    setMcDone(true);
                } else {
                    setMcIndex(_Lesson1_MenhDeHandleMcNextSetMcIndex);
                    setMcSelected(null);
                }
            }
        }["Lesson1_MenhDe[handleMcNext]"];
        let t27;
        if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
            t27 = ({
                "Lesson1_MenhDe[resetMc]": ()=>{
                    setMcIndex(0);
                    setMcSelected(null);
                    setMcScore(0);
                    setMcDone(false);
                    setMcHistory([]);
                }
            })["Lesson1_MenhDe[resetMc]"];
            $[45] = t27;
        } else {
            t27 = $[45];
        }
        const resetMc = t27;
        const handleTfAnswer = {
            "Lesson1_MenhDe[handleTfAnswer]": (ans)=>{
                if (tfFlipped) {
                    return;
                }
                setTfFlipped(true);
                const correct_0 = ans === tfCards[tfIndex].answer;
                if (correct_0) {
                    setTfScore(_Lesson1_MenhDeHandleTfAnswerSetTfScore);
                }
                setTfHistory({
                    "Lesson1_MenhDe[handleTfAnswer > setTfHistory()]": (h_0)=>[
                            ...h_0,
                            {
                                q: tfIndex,
                                given: ans,
                                correct: correct_0
                            }
                        ]
                }["Lesson1_MenhDe[handleTfAnswer > setTfHistory()]"]);
            }
        }["Lesson1_MenhDe[handleTfAnswer]"];
        const handleTfNext = {
            "Lesson1_MenhDe[handleTfNext]": ()=>{
                if (tfIndex + 1 >= tfCards.length) {
                    setTfDone(true);
                } else {
                    setTfIndex(_Lesson1_MenhDeHandleTfNextSetTfIndex);
                    setTfFlipped(false);
                }
            }
        }["Lesson1_MenhDe[handleTfNext]"];
        let t28;
        if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
            t28 = ({
                "Lesson1_MenhDe[resetTf]": ()=>{
                    setTfIndex(0);
                    setTfFlipped(false);
                    setTfScore(0);
                    setTfDone(false);
                    setTfHistory([]);
                }
            })["Lesson1_MenhDe[resetTf]"];
            $[46] = t28;
        } else {
            t28 = $[46];
        }
        const resetTf = t28;
        const checkFill = {
            "Lesson1_MenhDe[checkFill]": (id_1)=>{
                const correct_1 = fillQuestions.find({
                    "Lesson1_MenhDe[checkFill > fillQuestions.find()]": (q)=>q.id === id_1
                }["Lesson1_MenhDe[checkFill > fillQuestions.find()]"]).answer.toLowerCase().replace(/\s/g, "");
                return (fillAnswers[id_1] || "").toLowerCase().replace(/\s/g, "") === correct_1;
            }
        }["Lesson1_MenhDe[checkFill]"];
        mcHistory.map({
            "Lesson1_MenhDe[mcHistory.map()]": (h_1)=>({
                    correct: h_1.correct,
                    qText: mcQuestions[h_1.q].q,
                    correctText: mcQuestions[h_1.q].options[mcQuestions[h_1.q].answer],
                    yourText: mcQuestions[h_1.q].options[h_1.selected]
                })
        }["Lesson1_MenhDe[mcHistory.map()]"]);
        tfHistory.map({
            "Lesson1_MenhDe[tfHistory.map()]": (h_2)=>({
                    correct: h_2.correct,
                    qText: tfCards[h_2.q].stmt,
                    correctText: h_2.correct ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.given ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson1_MenhDe[tfHistory.map()]"]);
        fillChecked ? fillQuestions.map({
            "Lesson1_MenhDe[fillQuestions.map()]": (q_0)=>({
                    correct: checkFill(q_0.id),
                    qText: q_0.template,
                    correctText: q_0.answer,
                    yourText: fillAnswers[q_0.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson1_MenhDe[fillQuestions.map()]"]) : [];
        let t29;
        if ($[47] !== t) {
            t29 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[47] = t;
            $[48] = t29;
        } else {
            t29 = $[48];
        }
        let t30;
        if ($[49] !== t29) {
            t30 = [
                "khoiDong",
                "\uD83D\uDE80",
                t29
            ];
            $[49] = t29;
            $[50] = t30;
        } else {
            t30 = $[50];
        }
        let t31;
        if ($[51] !== t) {
            t31 = t("1. M\u1EC7nh \u0110\u1EC1", "1. Propositions");
            $[51] = t;
            $[52] = t31;
        } else {
            t31 = $[52];
        }
        let t32;
        if ($[53] !== t31) {
            t32 = [
                "khai1",
                "\uD83D\uDCD6",
                t31
            ];
            $[53] = t31;
            $[54] = t32;
        } else {
            t32 = $[54];
        }
        let t33;
        if ($[55] !== t) {
            t33 = t("2. Ph\u1EE7 \u0110\u1ECBnh", "2. Negation");
            $[55] = t;
            $[56] = t33;
        } else {
            t33 = $[56];
        }
        let t34;
        if ($[57] !== t33) {
            t34 = [
                "khai2",
                "\uD83D\uDCD6",
                t33
            ];
            $[57] = t33;
            $[58] = t34;
        } else {
            t34 = $[58];
        }
        let t35;
        if ($[59] !== t) {
            t35 = t("3. K\xE9o Theo", "3. Implication");
            $[59] = t;
            $[60] = t35;
        } else {
            t35 = $[60];
        }
        let t36;
        if ($[61] !== t35) {
            t36 = [
                "khai3",
                "\uD83D\uDCD6",
                t35
            ];
            $[61] = t35;
            $[62] = t36;
        } else {
            t36 = $[62];
        }
        let t37;
        if ($[63] !== t) {
            t37 = t("4. T\u01B0\u01A1ng \u0110\u01B0\u01A1ng", "4. Equivalence");
            $[63] = t;
            $[64] = t37;
        } else {
            t37 = $[64];
        }
        let t38;
        if ($[65] !== t37) {
            t38 = [
                "khai4",
                "\uD83D\uDCD6",
                t37
            ];
            $[65] = t37;
            $[66] = t38;
        } else {
            t38 = $[66];
        }
        let t39;
        if ($[67] !== t) {
            t39 = t("5. \u2200 v\xE0 \u2203", "5. Quantifiers");
            $[67] = t;
            $[68] = t39;
        } else {
            t39 = $[68];
        }
        let t40;
        if ($[69] !== t39) {
            t40 = [
                "khai5",
                "\uD83D\uDCD6",
                t39
            ];
            $[69] = t39;
            $[70] = t40;
        } else {
            t40 = $[70];
        }
        let t41;
        if ($[71] !== t) {
            t41 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[71] = t;
            $[72] = t41;
        } else {
            t41 = $[72];
        }
        let t42;
        if ($[73] !== t41) {
            t42 = [
                "thucHanh",
                "\u270F\uFE0F",
                t41
            ];
            $[73] = t41;
            $[74] = t42;
        } else {
            t42 = $[74];
        }
        let t43;
        if ($[75] !== t) {
            t43 = t("Mini Game", "Mini Game");
            $[75] = t;
            $[76] = t43;
        } else {
            t43 = $[76];
        }
        let t44;
        if ($[77] !== t43) {
            t44 = [
                "miniGame",
                "\uD83C\uDFAE",
                t43
            ];
            $[77] = t43;
            $[78] = t44;
        } else {
            t44 = $[78];
        }
        let t45;
        if ($[79] !== t30 || $[80] !== t32 || $[81] !== t34 || $[82] !== t36 || $[83] !== t38 || $[84] !== t40 || $[85] !== t42 || $[86] !== t44) {
            t45 = [
                t30,
                t32,
                t34,
                t36,
                t38,
                t40,
                t42,
                t44
            ];
            $[79] = t30;
            $[80] = t32;
            $[81] = t34;
            $[82] = t36;
            $[83] = t38;
            $[84] = t40;
            $[85] = t42;
            $[86] = t44;
            $[87] = t45;
        } else {
            t45 = $[87];
        }
        const tabs = t45;
        const SectionHeader = _Lesson1_MenhDeSectionHeader;
        if ($[88] === Symbol.for("react.memo_cache_sentinel")) {
            t26 = {
                width: "100%",
                background: "#ffffff",
                display: "flex",
                justifyContent: "center"
            };
            t14 = {
                width: "1200px",
                maxWidth: "95%",
                color: "black",
                paddingTop: 60,
                paddingBottom: 80
            };
            $[88] = t14;
            $[89] = t26;
        } else {
            t14 = $[88];
            t26 = $[89];
        }
        let t46;
        if ($[90] === Symbol.for("react.memo_cache_sentinel")) {
            t46 = {
                marginBottom: 24
            };
            $[90] = t46;
        } else {
            t46 = $[90];
        }
        let t47;
        if ($[91] === Symbol.for("react.memo_cache_sentinel")) {
            t47 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[91] = t47;
        } else {
            t47 = $[91];
        }
        let t48;
        if ($[92] !== t) {
            t48 = t("Quay l\u1EA1i", "Back to lessons");
            $[92] = t;
            $[93] = t48;
        } else {
            t48 = $[93];
        }
        if ($[94] !== t48) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t46,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t47,
                    children: [
                        "← ",
                        t48
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 767,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 767,
                columnNumber: 13
            }, this);
            $[94] = t48;
            $[95] = t15;
        } else {
            t15 = $[95];
        }
        let t49;
        let t50;
        if ($[96] === Symbol.for("react.memo_cache_sentinel")) {
            t49 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t50 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            };
            $[96] = t49;
            $[97] = t50;
        } else {
            t49 = $[96];
            t50 = $[97];
        }
        let t51;
        if ($[98] !== t) {
            t51 = t("Ch\u01B0\u01A1ng I \xB7 M\u1EC7nh \u0110\u1EC1 v\xE0 T\u1EADp H\u1EE3p", "Chapter I \xB7 Propositions and Sets");
            $[98] = t;
            $[99] = t51;
        } else {
            t51 = $[99];
        }
        let t52;
        if ($[100] !== t51) {
            t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t50,
                children: t51
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 806,
                columnNumber: 13
            }, this);
            $[100] = t51;
            $[101] = t52;
        } else {
            t52 = $[101];
        }
        let t53;
        if ($[102] === Symbol.for("react.memo_cache_sentinel")) {
            t53 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[102] = t53;
        } else {
            t53 = $[102];
        }
        let t54;
        if ($[103] !== t) {
            t54 = t("B\xE0i 1: M\u1EC7nh \u0110\u1EC1", "Lesson 1: Mathematical Propositions");
            $[103] = t;
            $[104] = t54;
        } else {
            t54 = $[104];
        }
        let t55;
        if ($[105] !== t54) {
            t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t53,
                children: t54
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 833,
                columnNumber: 13
            }, this);
            $[105] = t54;
            $[106] = t55;
        } else {
            t55 = $[106];
        }
        let t56;
        if ($[107] !== t52 || $[108] !== t55) {
            t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t52,
                    t55
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 841,
                columnNumber: 13
            }, this);
            $[107] = t52;
            $[108] = t55;
            $[109] = t56;
        } else {
            t56 = $[109];
        }
        let t57;
        let t58;
        if ($[110] === Symbol.for("react.memo_cache_sentinel")) {
            t57 = {
                display: "flex",
                gap: 10
            };
            t58 = ({
                "Lesson1_MenhDe[<button>.onClick]": ()=>setLang("vi")
            })["Lesson1_MenhDe[<button>.onClick]"];
            $[110] = t57;
            $[111] = t58;
        } else {
            t57 = $[110];
            t58 = $[111];
        }
        const t59 = lang === "vi" ? "black" : "#f9f9f9";
        const t60 = lang === "vi" ? "white" : "black";
        let t61;
        if ($[112] !== t59 || $[113] !== t60) {
            t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t58,
                style: {
                    background: t59,
                    color: t60,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 868,
                columnNumber: 13
            }, this);
            $[112] = t59;
            $[113] = t60;
            $[114] = t61;
        } else {
            t61 = $[114];
        }
        let t62;
        if ($[115] === Symbol.for("react.memo_cache_sentinel")) {
            t62 = ({
                "Lesson1_MenhDe[<button>.onClick]": ()=>setLang("en")
            })["Lesson1_MenhDe[<button>.onClick]"];
            $[115] = t62;
        } else {
            t62 = $[115];
        }
        const t63 = lang === "en" ? "black" : "#f9f9f9";
        const t64 = lang === "en" ? "white" : "black";
        let t65;
        if ($[116] !== t63 || $[117] !== t64) {
            t65 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t62,
                style: {
                    background: t63,
                    color: t64,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 897,
                columnNumber: 13
            }, this);
            $[116] = t63;
            $[117] = t64;
            $[118] = t65;
        } else {
            t65 = $[118];
        }
        let t66;
        if ($[119] !== t61 || $[120] !== t65) {
            t66 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t57,
                children: [
                    t61,
                    t65
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 915,
                columnNumber: 13
            }, this);
            $[119] = t61;
            $[120] = t65;
            $[121] = t66;
        } else {
            t66 = $[121];
        }
        if ($[122] !== t56 || $[123] !== t66) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t49,
                children: [
                    t56,
                    t66
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 923,
                columnNumber: 13
            }, this);
            $[122] = t56;
            $[123] = t66;
            $[124] = t16;
        } else {
            t16 = $[124];
        }
        let t67;
        let t68;
        if ($[125] === Symbol.for("react.memo_cache_sentinel")) {
            t67 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t68 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[125] = t67;
            $[126] = t68;
        } else {
            t67 = $[125];
            t68 = $[126];
        }
        let t69;
        if ($[127] !== t) {
            t69 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Learning Objectives");
            $[127] = t;
            $[128] = t69;
        } else {
            t69 = $[128];
        }
        let t70;
        if ($[129] !== t69) {
            t70 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t68,
                children: [
                    "🎯 ",
                    t69
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 961,
                columnNumber: 13
            }, this);
            $[129] = t69;
            $[130] = t70;
        } else {
            t70 = $[130];
        }
        let t71;
        if ($[131] !== t) {
            t71 = t("Nh\u1EADn bi\u1EBFt \u0111\u01B0\u1EE3c m\u1EC7nh \u0111\u1EC1 v\xE0 m\u1EC7nh \u0111\u1EC1 ch\u1EE9a bi\u1EBFn.", "Identify propositions and propositional functions.");
            $[131] = t;
            $[132] = t71;
        } else {
            t71 = $[132];
        }
        let t72;
        if ($[133] !== t) {
            t72 = t("Ph\xE2n bi\u1EC7t m\u1EC7nh \u0111\u1EC1 \u0111\xFAng v\xE0 m\u1EC7nh \u0111\u1EC1 sai.", "Distinguish true and false propositions.");
            $[133] = t;
            $[134] = t72;
        } else {
            t72 = $[134];
        }
        let t73;
        if ($[135] !== t) {
            t73 = t("Hi\u1EC3u v\xE0 v\u1EADn d\u1EE5ng m\u1EC7nh \u0111\u1EC1 ph\u1EE7 \u0111\u1ECBnh (\xACP).", "Understand and apply negation (\xACP).");
            $[135] = t;
            $[136] = t73;
        } else {
            t73 = $[136];
        }
        let t74;
        if ($[137] !== t) {
            t74 = t("Hi\u1EC3u m\u1EC7nh \u0111\u1EC1 k\xE9o theo (\u21D2) v\xE0 t\u01B0\u01A1ng \u0111\u01B0\u01A1ng (\u27FA).", "Understand implication (\u21D2) and equivalence (\u27FA).");
            $[137] = t;
            $[138] = t74;
        } else {
            t74 = $[138];
        }
        let t75;
        if ($[139] !== t) {
            t75 = t("S\u1EED d\u1EE5ng k\xFD hi\u1EC7u \u2200 (v\u1EDBi m\u1ECDi) v\xE0 \u2203 (t\u1ED3n t\u1EA1i).", "Use quantifiers \u2200 (for all) and \u2203 (there exists).");
            $[139] = t;
            $[140] = t75;
        } else {
            t75 = $[140];
        }
        let t76;
        if ($[141] !== t71 || $[142] !== t72 || $[143] !== t73 || $[144] !== t74 || $[145] !== t75) {
            t76 = [
                t71,
                t72,
                t73,
                t74,
                t75
            ].map(_Lesson1_MenhDeAnonymous);
            $[141] = t71;
            $[142] = t72;
            $[143] = t73;
            $[144] = t74;
            $[145] = t75;
            $[146] = t76;
        } else {
            t76 = $[146];
        }
        if ($[147] !== t70 || $[148] !== t76) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t67,
                children: [
                    t70,
                    t76
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1020,
                columnNumber: 13
            }, this);
            $[147] = t70;
            $[148] = t76;
            $[149] = t17;
        } else {
            t17 = $[149];
        }
        let t77;
        let t78;
        if ($[150] === Symbol.for("react.memo_cache_sentinel")) {
            t77 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t78 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[150] = t77;
            $[151] = t78;
        } else {
            t77 = $[150];
            t78 = $[151];
        }
        if ($[152] !== tabs) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t77,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t78,
                    children: tabs.map({
                        "Lesson1_MenhDe[tabs.map()]": (t79)=>{
                            const [id_2, icon_0, label] = t79;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson1_MenhDe[tabs.map() > <button>.onClick]": ()=>scrollTo(id_2)
                                }["Lesson1_MenhDe[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson1_MenhDeTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson1_MenhDeTabsMapButtonOnMouseLeave,
                                children: [
                                    icon_0,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 1055,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson1_MenhDe[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 1052,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1052,
                columnNumber: 13
            }, this);
            $[152] = tabs;
            $[153] = t18;
        } else {
            t18 = $[153];
        }
        let t79;
        if ($[154] === Symbol.for("react.memo_cache_sentinel")) {
            t79 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[154] = t79;
        } else {
            t79 = $[154];
        }
        let t80;
        if ($[155] !== t) {
            t80 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[155] = t;
            $[156] = t80;
        } else {
            t80 = $[156];
        }
        let t81;
        if ($[157] !== t80) {
            t81 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDE80",
                title: t80
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1096,
                columnNumber: 13
            }, this);
            $[157] = t80;
            $[158] = t81;
        } else {
            t81 = $[158];
        }
        let t82;
        let t83;
        if ($[159] === Symbol.for("react.memo_cache_sentinel")) {
            t82 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t83 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8
            };
            $[159] = t82;
            $[160] = t83;
        } else {
            t82 = $[159];
            t83 = $[160];
        }
        let t84;
        if ($[161] !== t) {
            t84 = t("T\xECnh hu\u1ED1ng m\u1EDF \u0111\u1EA7u", "Opening Situation");
            $[161] = t;
            $[162] = t84;
        } else {
            t84 = $[162];
        }
        let t85;
        if ($[163] !== t84) {
            t85 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t83,
                children: t84
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1132,
                columnNumber: 13
            }, this);
            $[163] = t84;
            $[164] = t85;
        } else {
            t85 = $[164];
        }
        let t86;
        if ($[165] === Symbol.for("react.memo_cache_sentinel")) {
            t86 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[165] = t86;
        } else {
            t86 = $[165];
        }
        let t87;
        if ($[166] !== t) {
            t87 = t("Trong cu\u1ED9c s\u1ED1ng h\u1EB1ng ng\xE0y, ch\xFAng ta th\u01B0\u1EDDng ph\xE1t bi\u1EC3u nh\u1EEFng c\xE2u kh\u1EB3ng \u0111\u1ECBnh \u2014 v\xED d\u1EE5: \"H\xF4m nay tr\u1EDDi n\u1EAFng\" hay \"2 + 2 = 4\". Li\u1EC7u m\u1ECDi c\xE2u \u0111\u1EC1u c\xF3 th\u1EC3 x\xE1c \u0111\u1ECBnh \u0111\xFAng hay sai kh\xF4ng?", "In everyday life we often make statements \u2014 e.g. \"Today is sunny\" or \"2 + 2 = 4\". Can every sentence be judged as true or false?");
            $[166] = t;
            $[167] = t87;
        } else {
            t87 = $[167];
        }
        let t88;
        if ($[168] !== t87) {
            t88 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t86,
                children: t87
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1159,
                columnNumber: 13
            }, this);
            $[168] = t87;
            $[169] = t88;
        } else {
            t88 = $[169];
        }
        let t89;
        if ($[170] === Symbol.for("react.memo_cache_sentinel")) {
            t89 = {
                fontSize: 16
            };
            $[170] = t89;
        } else {
            t89 = $[170];
        }
        let t90;
        if ($[171] !== t) {
            t90 = t("H\xE3y cho v\xED d\u1EE5 m\u1ED9t c\xE2u c\xF3 th\u1EC3 x\xE1c \u0111\u1ECBnh \u0111\xFAng/sai v\xE0 m\u1ED9t c\xE2u kh\xF4ng th\u1EC3.", "Give an example of a sentence that can be judged true/false, and one that cannot.");
            $[171] = t;
            $[172] = t90;
        } else {
            t90 = $[172];
        }
        let t91;
        if ($[173] !== t90) {
            t91 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t89,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t90
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 1184,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1184,
                columnNumber: 13
            }, this);
            $[173] = t90;
            $[174] = t91;
        } else {
            t91 = $[174];
        }
        let t92;
        if ($[175] !== t85 || $[176] !== t88 || $[177] !== t91) {
            t92 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t82,
                children: [
                    t85,
                    t88,
                    t91
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1192,
                columnNumber: 13
            }, this);
            $[175] = t85;
            $[176] = t88;
            $[177] = t91;
            $[178] = t92;
        } else {
            t92 = $[178];
        }
        if ($[179] !== t81 || $[180] !== t92) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khoiDong",
                style: t79,
                children: [
                    t81,
                    t92
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1201,
                columnNumber: 13
            }, this);
            $[179] = t81;
            $[180] = t92;
            $[181] = t19;
        } else {
            t19 = $[181];
        }
        let t93;
        if ($[182] === Symbol.for("react.memo_cache_sentinel")) {
            t93 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[182] = t93;
        } else {
            t93 = $[182];
        }
        let t94;
        if ($[183] !== t) {
            t94 = t("1. Kh\xE1i Ni\u1EC7m M\u1EC7nh \u0110\u1EC1", "1. Propositions");
            $[183] = t;
            $[184] = t94;
        } else {
            t94 = $[184];
        }
        let t95;
        if ($[185] !== t94) {
            t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t94
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1228,
                columnNumber: 13
            }, this);
            $[185] = t94;
            $[186] = t95;
        } else {
            t95 = $[186];
        }
        let t96;
        let t97;
        if ($[187] === Symbol.for("react.memo_cache_sentinel")) {
            t96 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t97 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[187] = t96;
            $[188] = t97;
        } else {
            t96 = $[187];
            t97 = $[188];
        }
        let t98;
        if ($[189] !== t) {
            t98 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[189] = t;
            $[190] = t98;
        } else {
            t98 = $[190];
        }
        let t99;
        if ($[191] !== t98) {
            t99 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t97,
                children: [
                    "📌 ",
                    t98
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1266,
                columnNumber: 13
            }, this);
            $[191] = t98;
            $[192] = t99;
        } else {
            t99 = $[192];
        }
        let t100;
        if ($[193] === Symbol.for("react.memo_cache_sentinel")) {
            t100 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[193] = t100;
        } else {
            t100 = $[193];
        }
        let t101;
        if ($[194] !== t) {
            t101 = t("M\u1EC7nh \u0111\u1EC1 l\xE0 m\u1ED9t c\xE2u kh\u1EB3ng \u0111\u1ECBnh c\xF3 gi\xE1 tr\u1ECB ch\xE2n l\xFD x\xE1c \u0111\u1ECBnh \u2014 ho\u1EB7c \u0111\xFAng (\u0110) ho\u1EB7c sai (S), kh\xF4ng th\u1EC3 v\u1EEBa \u0111\xFAng v\u1EEBa sai.", "A proposition is a declarative sentence with a definite truth value \u2014 either true (T) or false (F), but not both.");
            $[194] = t;
            $[195] = t101;
        } else {
            t101 = $[195];
        }
        let t102;
        if ($[196] !== t101) {
            t102 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t100,
                children: t101
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1292,
                columnNumber: 14
            }, this);
            $[196] = t101;
            $[197] = t102;
        } else {
            t102 = $[197];
        }
        let t103;
        if ($[198] === Symbol.for("react.memo_cache_sentinel")) {
            t103 = {
                color: "#777",
                fontSize: 15,
                marginTop: 10
            };
            $[198] = t103;
        } else {
            t103 = $[198];
        }
        let t104;
        if ($[199] !== t) {
            t104 = t("M\u1EC7nh \u0111\u1EC1 k\xFD hi\u1EC7u b\u1EB1ng ch\u1EEF in hoa: P, Q, R. C\xE2u h\u1ECFi v\xE0 m\u1EC7nh l\u1EC7nh kh\xF4ng ph\u1EA3i m\u1EC7nh \u0111\u1EC1.", "Propositions are denoted P, Q, R. Questions and commands are NOT propositions.");
            $[199] = t;
            $[200] = t104;
        } else {
            t104 = $[200];
        }
        let t105;
        if ($[201] !== t104) {
            t105 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t103,
                children: [
                    "💡 ",
                    t104
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1319,
                columnNumber: 14
            }, this);
            $[201] = t104;
            $[202] = t105;
        } else {
            t105 = $[202];
        }
        let t106;
        if ($[203] !== t102 || $[204] !== t105 || $[205] !== t99) {
            t106 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t96,
                children: [
                    t99,
                    t102,
                    t105
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1327,
                columnNumber: 14
            }, this);
            $[203] = t102;
            $[204] = t105;
            $[205] = t99;
            $[206] = t106;
        } else {
            t106 = $[206];
        }
        let t107;
        if ($[207] === Symbol.for("react.memo_cache_sentinel")) {
            t107 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[207] = t107;
        } else {
            t107 = $[207];
        }
        let t108;
        if ($[208] !== t) {
            t108 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t107,
                children: [
                    {
                        label: t("\u2705 M\u1EC7nh \u0111\u1EC1 \u0110\xDANG", "\u2705 TRUE Propositions"),
                        items: [
                            "\"2 + 2 = 4\"",
                            t("\"H\xE0 N\u1ED9i l\xE0 th\u1EE7 \u0111\xF4 Vi\u1EC7t Nam\"", "\"Hanoi is the capital of Vietnam\""),
                            t("\"S\u1ED1 7 l\xE0 s\u1ED1 nguy\xEAn t\u1ED1\"", "\"7 is a prime number\"")
                        ],
                        bc: "#1e8449",
                        bb: "#eafaf1",
                        badge: t("\u0110\xDANG", "TRUE")
                    },
                    {
                        label: t("\u274C M\u1EC7nh \u0111\u1EC1 SAI", "\u274C FALSE Propositions"),
                        items: [
                            "\"3 + 4 = 8\"",
                            t("\"M\u1EB7t tr\u1EDDi quay quanh Tr\xE1i \u0110\u1EA5t\"", "\"The Sun orbits the Earth\"")
                        ],
                        bc: "#922b21",
                        bb: "#fdf2f2",
                        badge: t("SAI", "FALSE")
                    },
                    {
                        label: t("\uD83D\uDEAB KH\xD4NG ph\u1EA3i m\u1EC7nh \u0111\u1EC1", "\uD83D\uDEAB NOT Propositions"),
                        items: [
                            t("\"x + 1 = 5\" (ch\u1EE9a bi\u1EBFn)", "\"x + 1 = 5\" (has variable)"),
                            t("\"B\u1EA1n c\xF3 kh\u1ECFe kh\xF4ng?\" (c\xE2u h\u1ECFi)", "\"Are you well?\" (question)"),
                            t("\"H\u1ECDc ch\u0103m ch\u1EC9!\" (l\u1EC7nh)", "\"Study hard!\" (command)")
                        ],
                        bc: "#555",
                        bb: "#f0f0f0",
                        badge: t("Kh\xF4ng x\xE1c \u0111\u1ECBnh", "Undetermined")
                    }
                ].map(_Lesson1_MenhDeAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1349,
                columnNumber: 14
            }, this);
            $[208] = t;
            $[209] = t108;
        } else {
            t108 = $[209];
        }
        if ($[210] !== t106 || $[211] !== t108 || $[212] !== t95) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai1",
                style: t93,
                children: [
                    t95,
                    t106,
                    t108
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1374,
                columnNumber: 13
            }, this);
            $[210] = t106;
            $[211] = t108;
            $[212] = t95;
            $[213] = t20;
        } else {
            t20 = $[213];
        }
        let t109;
        if ($[214] === Symbol.for("react.memo_cache_sentinel")) {
            t109 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[214] = t109;
        } else {
            t109 = $[214];
        }
        let t110;
        if ($[215] !== t) {
            t110 = t("2. M\u1EC7nh \u0110\u1EC1 Ph\u1EE7 \u0110\u1ECBnh (\xACP)", "2. Negation (\xACP)");
            $[215] = t;
            $[216] = t110;
        } else {
            t110 = $[216];
        }
        let t111;
        if ($[217] !== t110) {
            t111 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t110
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1402,
                columnNumber: 14
            }, this);
            $[217] = t110;
            $[218] = t111;
        } else {
            t111 = $[218];
        }
        let t112;
        let t113;
        if ($[219] === Symbol.for("react.memo_cache_sentinel")) {
            t112 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t113 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[219] = t112;
            $[220] = t113;
        } else {
            t112 = $[219];
            t113 = $[220];
        }
        let t114;
        if ($[221] !== t) {
            t114 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[221] = t;
            $[222] = t114;
        } else {
            t114 = $[222];
        }
        let t115;
        if ($[223] !== t114) {
            t115 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t113,
                children: [
                    "📌 ",
                    t114
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1440,
                columnNumber: 14
            }, this);
            $[223] = t114;
            $[224] = t115;
        } else {
            t115 = $[224];
        }
        let t116;
        if ($[225] === Symbol.for("react.memo_cache_sentinel")) {
            t116 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[225] = t116;
        } else {
            t116 = $[225];
        }
        let t117;
        if ($[226] !== t) {
            t117 = t("Ph\u1EE7 \u0111\u1ECBnh c\u1EE7a m\u1EC7nh \u0111\u1EC1 P, k\xFD hi\u1EC7u \xACP, l\xE0 m\u1EC7nh \u0111\u1EC1 c\xF3 gi\xE1 tr\u1ECB ch\xE2n l\xFD ng\u01B0\u1EE3c l\u1EA1i v\u1EDBi P.", "The negation of P, written \xACP, is the proposition with the opposite truth value of P.");
            $[226] = t;
            $[227] = t117;
        } else {
            t117 = $[227];
        }
        let t118;
        if ($[228] !== t117) {
            t118 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t116,
                children: t117
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1466,
                columnNumber: 14
            }, this);
            $[228] = t117;
            $[229] = t118;
        } else {
            t118 = $[229];
        }
        let t119;
        if ($[230] !== t115 || $[231] !== t118) {
            t119 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t112,
                children: [
                    t115,
                    t118
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1474,
                columnNumber: 14
            }, this);
            $[230] = t115;
            $[231] = t118;
            $[232] = t119;
        } else {
            t119 = $[232];
        }
        let t120;
        let t121;
        if ($[233] === Symbol.for("react.memo_cache_sentinel")) {
            t120 = {
                marginBottom: 24
            };
            t121 = {
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 14
            };
            $[233] = t120;
            $[234] = t121;
        } else {
            t120 = $[233];
            t121 = $[234];
        }
        let t122;
        if ($[235] !== t) {
            t122 = t("B\u1EA3ng ch\xE2n tr\u1ECB", "Truth Table");
            $[235] = t;
            $[236] = t122;
        } else {
            t122 = $[236];
        }
        let t123;
        if ($[237] !== t122) {
            t123 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t121,
                children: t122
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1508,
                columnNumber: 14
            }, this);
            $[237] = t122;
            $[238] = t123;
        } else {
            t123 = $[238];
        }
        let t124;
        let t125;
        let t126;
        let t127;
        if ($[239] === Symbol.for("react.memo_cache_sentinel")) {
            t124 = {
                display: "inline-block",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: 10,
                overflow: "hidden"
            };
            t125 = {
                borderCollapse: "collapse",
                fontSize: 15
            };
            t126 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                    children: [
                        "P",
                        "\xACP"
                    ].map(_Lesson1_MenhDeAnonymous3)
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 1529,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1529,
                columnNumber: 14
            }, this);
            t127 = {
                padding: "10px 48px",
                textAlign: "center",
                background: "#eafaf1",
                color: "#1e8449",
                fontWeight: 600,
                border: "1px solid #eee"
            };
            $[239] = t124;
            $[240] = t125;
            $[241] = t126;
            $[242] = t127;
        } else {
            t124 = $[239];
            t125 = $[240];
            t126 = $[241];
            t127 = $[242];
        }
        let t128;
        if ($[243] !== t) {
            t128 = t("\u0110\xFAng", "True");
            $[243] = t;
            $[244] = t128;
        } else {
            t128 = $[244];
        }
        let t129;
        if ($[245] !== t128) {
            t129 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: t127,
                children: t128
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1558,
                columnNumber: 14
            }, this);
            $[245] = t128;
            $[246] = t129;
        } else {
            t129 = $[246];
        }
        let t130;
        if ($[247] === Symbol.for("react.memo_cache_sentinel")) {
            t130 = {
                padding: "10px 48px",
                textAlign: "center",
                background: "#fdf2f2",
                color: "#922b21",
                fontWeight: 600,
                border: "1px solid #eee"
            };
            $[247] = t130;
        } else {
            t130 = $[247];
        }
        let t131;
        if ($[248] !== t) {
            t131 = t("Sai", "False");
            $[248] = t;
            $[249] = t131;
        } else {
            t131 = $[249];
        }
        let t132;
        if ($[250] !== t131) {
            t132 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: t130,
                children: t131
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1588,
                columnNumber: 14
            }, this);
            $[250] = t131;
            $[251] = t132;
        } else {
            t132 = $[251];
        }
        let t133;
        if ($[252] !== t129 || $[253] !== t132) {
            t133 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                children: [
                    t129,
                    t132
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1596,
                columnNumber: 14
            }, this);
            $[252] = t129;
            $[253] = t132;
            $[254] = t133;
        } else {
            t133 = $[254];
        }
        let t134;
        if ($[255] === Symbol.for("react.memo_cache_sentinel")) {
            t134 = {
                padding: "10px 48px",
                textAlign: "center",
                background: "#fdf2f2",
                color: "#922b21",
                fontWeight: 600,
                border: "1px solid #eee"
            };
            $[255] = t134;
        } else {
            t134 = $[255];
        }
        let t135;
        if ($[256] !== t) {
            t135 = t("Sai", "False");
            $[256] = t;
            $[257] = t135;
        } else {
            t135 = $[257];
        }
        let t136;
        if ($[258] !== t135) {
            t136 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: t134,
                children: t135
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1627,
                columnNumber: 14
            }, this);
            $[258] = t135;
            $[259] = t136;
        } else {
            t136 = $[259];
        }
        let t137;
        if ($[260] === Symbol.for("react.memo_cache_sentinel")) {
            t137 = {
                padding: "10px 48px",
                textAlign: "center",
                background: "#eafaf1",
                color: "#1e8449",
                fontWeight: 600,
                border: "1px solid #eee"
            };
            $[260] = t137;
        } else {
            t137 = $[260];
        }
        let t138;
        if ($[261] !== t) {
            t138 = t("\u0110\xFAng", "True");
            $[261] = t;
            $[262] = t138;
        } else {
            t138 = $[262];
        }
        let t139;
        if ($[263] !== t138) {
            t139 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: t137,
                children: t138
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1657,
                columnNumber: 14
            }, this);
            $[263] = t138;
            $[264] = t139;
        } else {
            t139 = $[264];
        }
        let t140;
        if ($[265] !== t136 || $[266] !== t139) {
            t140 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                children: [
                    t136,
                    t139
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1665,
                columnNumber: 14
            }, this);
            $[265] = t136;
            $[266] = t139;
            $[267] = t140;
        } else {
            t140 = $[267];
        }
        let t141;
        if ($[268] !== t133 || $[269] !== t140) {
            t141 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t124,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: t125,
                    children: [
                        t126,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                t133,
                                t140
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 1674,
                            columnNumber: 58
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 1674,
                    columnNumber: 32
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1674,
                columnNumber: 14
            }, this);
            $[268] = t133;
            $[269] = t140;
            $[270] = t141;
        } else {
            t141 = $[270];
        }
        let t142;
        if ($[271] !== t123 || $[272] !== t141) {
            t142 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t120,
                children: [
                    t123,
                    t141
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1683,
                columnNumber: 14
            }, this);
            $[271] = t123;
            $[272] = t141;
            $[273] = t142;
        } else {
            t142 = $[273];
        }
        let t143;
        if ($[274] === Symbol.for("react.memo_cache_sentinel")) {
            t143 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[274] = t143;
        } else {
            t143 = $[274];
        }
        let t144;
        if ($[275] !== t) {
            t144 = t("P: \"12 chia h\u1EBFt cho 3\"", "P: \"12 is divisible by 3\"");
            $[275] = t;
            $[276] = t144;
        } else {
            t144 = $[276];
        }
        let t145;
        if ($[277] !== t) {
            t145 = t("\xACP: \"12 kh\xF4ng chia h\u1EBFt cho 3\"", "\xACP: \"12 is not divisible by 3\"");
            $[277] = t;
            $[278] = t145;
        } else {
            t145 = $[278];
        }
        let t146;
        if ($[279] !== t144 || $[280] !== t145) {
            t146 = {
                p: t144,
                pv: true,
                np: t145,
                npv: false
            };
            $[279] = t144;
            $[280] = t145;
            $[281] = t146;
        } else {
            t146 = $[281];
        }
        let t147;
        if ($[282] !== t) {
            t147 = t("P: \"\u221A2 l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\"", "P: \"\u221A2 is rational\"");
            $[282] = t;
            $[283] = t147;
        } else {
            t147 = $[283];
        }
        let t148;
        if ($[284] !== t) {
            t148 = t("\xACP: \"\u221A2 kh\xF4ng l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\"", "\xACP: \"\u221A2 is not rational\"");
            $[284] = t;
            $[285] = t148;
        } else {
            t148 = $[285];
        }
        let t149;
        if ($[286] !== t147 || $[287] !== t148) {
            t149 = {
                p: t147,
                pv: false,
                np: t148,
                npv: true
            };
            $[286] = t147;
            $[287] = t148;
            $[288] = t149;
        } else {
            t149 = $[288];
        }
        let t150;
        if ($[289] !== t146 || $[290] !== t149) {
            t150 = [
                t146,
                t149
            ];
            $[289] = t146;
            $[290] = t149;
            $[291] = t150;
        } else {
            t150 = $[291];
        }
        let t151;
        if ($[292] !== t || $[293] !== t150) {
            t151 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t143,
                children: t150.map({
                    "Lesson1_MenhDe[(anonymous)()]": (ex, i_5)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            style: {
                                padding: 20,
                                borderRadius: 10,
                                background: "#f9f9f9",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15
                                            },
                                            children: ex.p
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 1784,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 12,
                                                fontWeight: 700,
                                                background: ex.pv ? "#eafaf1" : "#fdf2f2",
                                                color: ex.pv ? "#1e8449" : "#922b21",
                                                padding: "2px 10px",
                                                borderRadius: 20
                                            },
                                            children: ex.pv ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 1786,
                                            columnNumber: 30
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 1779,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15
                                            },
                                            children: ex.np
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 1797,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 12,
                                                fontWeight: 700,
                                                background: ex.npv ? "#eafaf1" : "#fdf2f2",
                                                color: ex.npv ? "#1e8449" : "#922b21",
                                                padding: "2px 10px",
                                                borderRadius: 20
                                            },
                                            children: ex.npv ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 1799,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 1793,
                                    columnNumber: 86
                                }, this)
                            ]
                        }, i_5, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 1774,
                            columnNumber: 57
                        }, this)
                }["Lesson1_MenhDe[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1773,
                columnNumber: 14
            }, this);
            $[292] = t;
            $[293] = t150;
            $[294] = t151;
        } else {
            t151 = $[294];
        }
        if ($[295] !== t111 || $[296] !== t119 || $[297] !== t142 || $[298] !== t151) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai2",
                style: t109,
                children: [
                    t111,
                    t119,
                    t142,
                    t151
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1815,
                columnNumber: 13
            }, this);
            $[295] = t111;
            $[296] = t119;
            $[297] = t142;
            $[298] = t151;
            $[299] = t21;
        } else {
            t21 = $[299];
        }
        let t152;
        if ($[300] === Symbol.for("react.memo_cache_sentinel")) {
            t152 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[300] = t152;
        } else {
            t152 = $[300];
        }
        let t153;
        if ($[301] !== t) {
            t153 = t("3. M\u1EC7nh \u0110\u1EC1 K\xE9o Theo (P \u21D2 Q)", "3. Implication (P \u21D2 Q)");
            $[301] = t;
            $[302] = t153;
        } else {
            t153 = $[302];
        }
        let t154;
        if ($[303] !== t153) {
            t154 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t153
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1844,
                columnNumber: 14
            }, this);
            $[303] = t153;
            $[304] = t154;
        } else {
            t154 = $[304];
        }
        let t155;
        let t156;
        if ($[305] === Symbol.for("react.memo_cache_sentinel")) {
            t155 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t156 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[305] = t155;
            $[306] = t156;
        } else {
            t155 = $[305];
            t156 = $[306];
        }
        let t157;
        if ($[307] !== t) {
            t157 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[307] = t;
            $[308] = t157;
        } else {
            t157 = $[308];
        }
        let t158;
        if ($[309] !== t157) {
            t158 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t156,
                children: [
                    "📌 ",
                    t157
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1882,
                columnNumber: 14
            }, this);
            $[309] = t157;
            $[310] = t158;
        } else {
            t158 = $[310];
        }
        let t159;
        if ($[311] === Symbol.for("react.memo_cache_sentinel")) {
            t159 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[311] = t159;
        } else {
            t159 = $[311];
        }
        let t160;
        if ($[312] !== t) {
            t160 = t("M\u1EC7nh \u0111\u1EC1 \"N\u1EBFu P th\xEC Q\", k\xFD hi\u1EC7u P \u21D2 Q. P l\xE0 gi\u1EA3 thi\u1EBFt, Q l\xE0 k\u1EBFt lu\u1EADn. P \u21D2 Q ch\u1EC9 SAI khi P \u0111\xFAng v\xE0 Q sai.", "\"If P then Q\", written P \u21D2 Q. P is hypothesis, Q is conclusion. P \u21D2 Q is FALSE only when P is true and Q is false.");
            $[312] = t;
            $[313] = t160;
        } else {
            t160 = $[313];
        }
        let t161;
        if ($[314] !== t160) {
            t161 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t159,
                children: t160
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1908,
                columnNumber: 14
            }, this);
            $[314] = t160;
            $[315] = t161;
        } else {
            t161 = $[315];
        }
        let t162;
        if ($[316] === Symbol.for("react.memo_cache_sentinel")) {
            t162 = {
                color: "#777",
                fontSize: 15,
                marginTop: 10
            };
            $[316] = t162;
        } else {
            t162 = $[316];
        }
        let t163;
        if ($[317] !== t) {
            t163 = t("P l\xE0 \u0111i\u1EC1u ki\u1EC7n \u0111\u1EE7 \u0111\u1EC3 c\xF3 Q; Q l\xE0 \u0111i\u1EC1u ki\u1EC7n c\u1EA7n \u0111\u1EC3 c\xF3 P.", "P is sufficient for Q; Q is necessary for P.");
            $[317] = t;
            $[318] = t163;
        } else {
            t163 = $[318];
        }
        let t164;
        if ($[319] !== t163) {
            t164 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t162,
                children: [
                    "💡 ",
                    t163
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1935,
                columnNumber: 14
            }, this);
            $[319] = t163;
            $[320] = t164;
        } else {
            t164 = $[320];
        }
        let t165;
        if ($[321] !== t158 || $[322] !== t161 || $[323] !== t164) {
            t165 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t155,
                children: [
                    t158,
                    t161,
                    t164
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1943,
                columnNumber: 14
            }, this);
            $[321] = t158;
            $[322] = t161;
            $[323] = t164;
            $[324] = t165;
        } else {
            t165 = $[324];
        }
        let t166;
        let t167;
        if ($[325] === Symbol.for("react.memo_cache_sentinel")) {
            t166 = {
                marginBottom: 24
            };
            t167 = {
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 14
            };
            $[325] = t166;
            $[326] = t167;
        } else {
            t166 = $[325];
            t167 = $[326];
        }
        let t168;
        if ($[327] !== t) {
            t168 = t("B\u1EA3ng ch\xE2n tr\u1ECB P \u21D2 Q", "Truth Table for P \u21D2 Q");
            $[327] = t;
            $[328] = t168;
        } else {
            t168 = $[328];
        }
        let t169;
        if ($[329] !== t168) {
            t169 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t167,
                children: t168
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1978,
                columnNumber: 14
            }, this);
            $[329] = t168;
            $[330] = t169;
        } else {
            t169 = $[330];
        }
        let t170;
        if ($[331] === Symbol.for("react.memo_cache_sentinel")) {
            t170 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "inline-block",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderRadius: 10,
                    overflow: "hidden"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        borderCollapse: "collapse",
                        fontSize: 15
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    "P",
                                    "Q",
                                    "P \u21D2 Q"
                                ].map(_Lesson1_MenhDeAnonymous4)
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 1994,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 1994,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                [
                                    "T",
                                    "T",
                                    "T"
                                ],
                                [
                                    "T",
                                    "F",
                                    "F"
                                ],
                                [
                                    "F",
                                    "T",
                                    "T"
                                ],
                                [
                                    "F",
                                    "F",
                                    "T"
                                ]
                            ].map(_Lesson1_MenhDeAnonymous5)
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 1994,
                            columnNumber: 93
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 1991,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 1986,
                columnNumber: 14
            }, this);
            $[331] = t170;
        } else {
            t170 = $[331];
        }
        let t171;
        if ($[332] !== t169) {
            t171 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t166,
                children: [
                    t169,
                    t170
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2001,
                columnNumber: 14
            }, this);
            $[332] = t169;
            $[333] = t171;
        } else {
            t171 = $[333];
        }
        let t172;
        if ($[334] === Symbol.for("react.memo_cache_sentinel")) {
            t172 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[334] = t172;
        } else {
            t172 = $[334];
        }
        let t173;
        if ($[335] !== t) {
            t173 = t("\"N\u1EBFu n chia h\u1EBFt cho 6 th\xEC n chia h\u1EBFt cho 2\"", "\"If n is divisible by 6 then n is divisible by 2\"");
            $[335] = t;
            $[336] = t173;
        } else {
            t173 = $[336];
        }
        let t174;
        if ($[337] !== t) {
            t174 = t("M\u1ECDi b\u1ED9i c\u1EE7a 6 \u0111\u1EC1u l\xE0 b\u1ED9i c\u1EE7a 2.", "Every multiple of 6 is a multiple of 2.");
            $[337] = t;
            $[338] = t174;
        } else {
            t174 = $[338];
        }
        let t175;
        if ($[339] !== t173 || $[340] !== t174) {
            t175 = {
                expr: t173,
                v: true,
                note: t174
            };
            $[339] = t173;
            $[340] = t174;
            $[341] = t175;
        } else {
            t175 = $[341];
        }
        let t176;
        if ($[342] !== t) {
            t176 = t("\"N\u1EBFu n chia h\u1EBFt cho 2 th\xEC n chia h\u1EBFt cho 6\"", "\"If n is divisible by 2 then n is divisible by 6\"");
            $[342] = t;
            $[343] = t176;
        } else {
            t176 = $[343];
        }
        let t177;
        if ($[344] !== t) {
            t177 = t("Ph\u1EA3n v\xED d\u1EE5: n = 4.", "Counter-example: n = 4.");
            $[344] = t;
            $[345] = t177;
        } else {
            t177 = $[345];
        }
        let t178;
        if ($[346] !== t176 || $[347] !== t177) {
            t178 = {
                expr: t176,
                v: false,
                note: t177
            };
            $[346] = t176;
            $[347] = t177;
            $[348] = t178;
        } else {
            t178 = $[348];
        }
        let t179;
        if ($[349] !== t175 || $[350] !== t178) {
            t179 = [
                t175,
                t178
            ];
            $[349] = t175;
            $[350] = t178;
            $[351] = t179;
        } else {
            t179 = $[351];
        }
        let t180;
        if ($[352] !== t || $[353] !== t179) {
            t180 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t172,
                children: t179.map({
                    "Lesson1_MenhDe[(anonymous)()]": (ex_0, i_6)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            style: {
                                padding: 20,
                                borderRadius: 10,
                                background: "#f9f9f9",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 15,
                                        marginBottom: 12
                                    },
                                    children: ex_0.expr
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2094,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 12,
                                                fontWeight: 700,
                                                background: ex_0.v ? "#eafaf1" : "#fdf2f2",
                                                color: ex_0.v ? "#1e8449" : "#922b21",
                                                padding: "2px 10px",
                                                borderRadius: 20
                                            },
                                            children: ex_0.v ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2101,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14,
                                                fontStyle: "italic"
                                            },
                                            children: ex_0.note
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2108,
                                            columnNumber: 81
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2097,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, i_6, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2089,
                            columnNumber: 59
                        }, this)
                }["Lesson1_MenhDe[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2088,
                columnNumber: 14
            }, this);
            $[352] = t;
            $[353] = t179;
            $[354] = t180;
        } else {
            t180 = $[354];
        }
        if ($[355] !== t154 || $[356] !== t165 || $[357] !== t171 || $[358] !== t180) {
            t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai3",
                style: t152,
                children: [
                    t154,
                    t165,
                    t171,
                    t180
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2121,
                columnNumber: 13
            }, this);
            $[355] = t154;
            $[356] = t165;
            $[357] = t171;
            $[358] = t180;
            $[359] = t22;
        } else {
            t22 = $[359];
        }
        let t181;
        if ($[360] === Symbol.for("react.memo_cache_sentinel")) {
            t181 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[360] = t181;
        } else {
            t181 = $[360];
        }
        let t182;
        if ($[361] !== t) {
            t182 = t("4. M\u1EC7nh \u0110\u1EC1 T\u01B0\u01A1ng \u0110\u01B0\u01A1ng (P \u27FA Q)", "4. Equivalence (P \u27FA Q)");
            $[361] = t;
            $[362] = t182;
        } else {
            t182 = $[362];
        }
        let t183;
        if ($[363] !== t182) {
            t183 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t182
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2150,
                columnNumber: 14
            }, this);
            $[363] = t182;
            $[364] = t183;
        } else {
            t183 = $[364];
        }
        let t184;
        let t185;
        if ($[365] === Symbol.for("react.memo_cache_sentinel")) {
            t184 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t185 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[365] = t184;
            $[366] = t185;
        } else {
            t184 = $[365];
            t185 = $[366];
        }
        let t186;
        if ($[367] !== t) {
            t186 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[367] = t;
            $[368] = t186;
        } else {
            t186 = $[368];
        }
        let t187;
        if ($[369] !== t186) {
            t187 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t185,
                children: [
                    "📌 ",
                    t186
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2188,
                columnNumber: 14
            }, this);
            $[369] = t186;
            $[370] = t187;
        } else {
            t187 = $[370];
        }
        let t188;
        if ($[371] === Symbol.for("react.memo_cache_sentinel")) {
            t188 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[371] = t188;
        } else {
            t188 = $[371];
        }
        let t189;
        if ($[372] !== t) {
            t189 = t("M\u1EC7nh \u0111\u1EC1 \"P khi v\xE0 ch\u1EC9 khi Q\", k\xFD hi\u1EC7u P \u27FA Q, \u0111\xFAng khi P v\xE0 Q c\xF9ng gi\xE1 tr\u1ECB ch\xE2n l\xFD.", "\"P if and only if Q\", written P \u27FA Q, is true when P and Q share the same truth value.");
            $[372] = t;
            $[373] = t189;
        } else {
            t189 = $[373];
        }
        let t190;
        if ($[374] !== t189) {
            t190 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t188,
                children: t189
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2214,
                columnNumber: 14
            }, this);
            $[374] = t189;
            $[375] = t190;
        } else {
            t190 = $[375];
        }
        let t191;
        if ($[376] === Symbol.for("react.memo_cache_sentinel")) {
            t191 = {
                color: "#777",
                fontSize: 15,
                marginTop: 10
            };
            $[376] = t191;
        } else {
            t191 = $[376];
        }
        let t192;
        if ($[377] !== t) {
            t192 = t("P \u27FA Q t\u01B0\u01A1ng \u0111\u01B0\u01A1ng v\u1EDBi (P \u21D2 Q) \u2227 (Q \u21D2 P). P, Q l\xE0 \u0111i\u1EC1u ki\u1EC7n c\u1EA7n v\xE0 \u0111\u1EE7 c\u1EE7a nhau.", "P \u27FA Q \u2261 (P \u21D2 Q) \u2227 (Q \u21D2 P). P and Q are necessary and sufficient conditions for each other.");
            $[377] = t;
            $[378] = t192;
        } else {
            t192 = $[378];
        }
        let t193;
        if ($[379] !== t192) {
            t193 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t191,
                children: [
                    "💡 ",
                    t192
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2241,
                columnNumber: 14
            }, this);
            $[379] = t192;
            $[380] = t193;
        } else {
            t193 = $[380];
        }
        let t194;
        if ($[381] !== t187 || $[382] !== t190 || $[383] !== t193) {
            t194 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t184,
                children: [
                    t187,
                    t190,
                    t193
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2249,
                columnNumber: 14
            }, this);
            $[381] = t187;
            $[382] = t190;
            $[383] = t193;
            $[384] = t194;
        } else {
            t194 = $[384];
        }
        let t195;
        let t196;
        if ($[385] === Symbol.for("react.memo_cache_sentinel")) {
            t195 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "inline-flex",
                alignItems: "center",
                gap: 16
            };
            t196 = {
                fontSize: 15
            };
            $[385] = t195;
            $[386] = t196;
        } else {
            t195 = $[385];
            t196 = $[386];
        }
        let t197;
        if ($[387] !== t) {
            t197 = t("\"n chia h\u1EBFt cho 2 khi v\xE0 ch\u1EC9 khi n l\xE0 s\u1ED1 ch\u1EB5n\"", "\"n is divisible by 2 if and only if n is even\"");
            $[387] = t;
            $[388] = t197;
        } else {
            t197 = $[388];
        }
        let t198;
        if ($[389] !== t197) {
            t198 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t196,
                children: t197
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2288,
                columnNumber: 14
            }, this);
            $[389] = t197;
            $[390] = t198;
        } else {
            t198 = $[390];
        }
        let t199;
        if ($[391] === Symbol.for("react.memo_cache_sentinel")) {
            t199 = {
                fontSize: 12,
                fontWeight: 700,
                background: "#eafaf1",
                color: "#1e8449",
                padding: "2px 10px",
                borderRadius: 20,
                whiteSpace: "nowrap"
            };
            $[391] = t199;
        } else {
            t199 = $[391];
        }
        let t200;
        if ($[392] !== t) {
            t200 = t("\u0110\xDANG", "TRUE");
            $[392] = t;
            $[393] = t200;
        } else {
            t200 = $[393];
        }
        let t201;
        if ($[394] !== t200) {
            t201 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: t199,
                children: t200
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2319,
                columnNumber: 14
            }, this);
            $[394] = t200;
            $[395] = t201;
        } else {
            t201 = $[395];
        }
        let t202;
        if ($[396] !== t198 || $[397] !== t201) {
            t202 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    style: t195,
                    children: [
                        t198,
                        t201
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 2327,
                    columnNumber: 57
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2327,
                columnNumber: 14
            }, this);
            $[396] = t198;
            $[397] = t201;
            $[398] = t202;
        } else {
            t202 = $[398];
        }
        if ($[399] !== t183 || $[400] !== t194 || $[401] !== t202) {
            t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai4",
                style: t181,
                children: [
                    t183,
                    t194,
                    t202
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2335,
                columnNumber: 13
            }, this);
            $[399] = t183;
            $[400] = t194;
            $[401] = t202;
            $[402] = t23;
        } else {
            t23 = $[402];
        }
        let t203;
        if ($[403] === Symbol.for("react.memo_cache_sentinel")) {
            t203 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[403] = t203;
        } else {
            t203 = $[403];
        }
        let t204;
        if ($[404] !== t) {
            t204 = t("5. K\xFD Hi\u1EC7u \u2200 v\xE0 \u2203", "5. Quantifiers \u2200 and \u2203");
            $[404] = t;
            $[405] = t204;
        } else {
            t204 = $[405];
        }
        let t205;
        if ($[406] !== t204) {
            t205 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t204
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2363,
                columnNumber: 14
            }, this);
            $[406] = t204;
            $[407] = t205;
        } else {
            t205 = $[407];
        }
        let t206;
        if ($[408] === Symbol.for("react.memo_cache_sentinel")) {
            t206 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[408] = t206;
        } else {
            t206 = $[408];
        }
        let t207;
        if ($[409] !== t) {
            t207 = t("V\u1EDBi m\u1ECDi (l\u01B0\u1EE3ng t\u1EEB ph\u1ED5 d\u1EE5ng)", "For all (universal quantifier)");
            $[409] = t;
            $[410] = t207;
        } else {
            t207 = $[410];
        }
        let t208;
        if ($[411] !== t) {
            t208 = t("\"\u2200x \u2208 A, P(x)\" \u2014 P(x) \u0111\xFAng v\u1EDBi m\u1ECDi x thu\u1ED9c A.", "\"\u2200x \u2208 A, P(x)\" \u2014 P(x) is true for every x in A.");
            $[411] = t;
            $[412] = t208;
        } else {
            t208 = $[412];
        }
        let t209;
        if ($[413] !== t) {
            t209 = t("\"\u2200n \u2208 \u2115, n\xB2 \u2265 0\" \u2192 \u0110\xDANG", "\"\u2200n \u2208 \u2115, n\xB2 \u2265 0\" \u2192 TRUE");
            $[413] = t;
            $[414] = t209;
        } else {
            t209 = $[414];
        }
        let t210;
        if ($[415] !== t207 || $[416] !== t208 || $[417] !== t209) {
            t210 = {
                sym: "\u2200",
                name: t207,
                desc: t208,
                neg: "\xAC(\u2200x \u2208 A, P(x)) = \u2203x \u2208 A, \xACP(x)",
                ex: t209
            };
            $[415] = t207;
            $[416] = t208;
            $[417] = t209;
            $[418] = t210;
        } else {
            t210 = $[418];
        }
        let t211;
        if ($[419] !== t) {
            t211 = t("T\u1ED3n t\u1EA1i (l\u01B0\u1EE3ng t\u1EEB v\u1ECB t\u1EEB)", "There exists (existential quantifier)");
            $[419] = t;
            $[420] = t211;
        } else {
            t211 = $[420];
        }
        let t212;
        if ($[421] !== t) {
            t212 = t("\"\u2203x \u2208 A, P(x)\" \u2014 t\u1ED3n t\u1EA1i \xEDt nh\u1EA5t m\u1ED9t x \u2208 A sao cho P(x) \u0111\xFAng.", "\"\u2203x \u2208 A, P(x)\" \u2014 there is at least one x \u2208 A such that P(x) holds.");
            $[421] = t;
            $[422] = t212;
        } else {
            t212 = $[422];
        }
        let t213;
        if ($[423] !== t) {
            t213 = t("\"\u2203x \u2208 \u211D, x\xB2 = 2\" \u2192 \u0110\xDANG (x = \u221A2)", "\"\u2203x \u2208 \u211D, x\xB2 = 2\" \u2192 TRUE (x = \u221A2)");
            $[423] = t;
            $[424] = t213;
        } else {
            t213 = $[424];
        }
        let t214;
        if ($[425] !== t211 || $[426] !== t212 || $[427] !== t213) {
            t214 = {
                sym: "\u2203",
                name: t211,
                desc: t212,
                neg: "\xAC(\u2203x \u2208 A, P(x)) = \u2200x \u2208 A, \xACP(x)",
                ex: t213
            };
            $[425] = t211;
            $[426] = t212;
            $[427] = t213;
            $[428] = t214;
        } else {
            t214 = $[428];
        }
        let t215;
        if ($[429] !== t210 || $[430] !== t214) {
            t215 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "120",
                style: t206,
                children: [
                    t210,
                    t214
                ].map(_Lesson1_MenhDeAnonymous6)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2463,
                columnNumber: 14
            }, this);
            $[429] = t210;
            $[430] = t214;
            $[431] = t215;
        } else {
            t215 = $[431];
        }
        if ($[432] !== t205 || $[433] !== t215) {
            t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai5",
                style: t203,
                children: [
                    t205,
                    t215
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2471,
                columnNumber: 13
            }, this);
            $[432] = t205;
            $[433] = t215;
            $[434] = t24;
        } else {
            t24 = $[434];
        }
        let t216;
        if ($[435] === Symbol.for("react.memo_cache_sentinel")) {
            t216 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[435] = t216;
        } else {
            t216 = $[435];
        }
        let t217;
        if ($[436] !== t) {
            t217 = t("Th\u1EF1c H\xE0nh", "Practice Exercises");
            $[436] = t;
            $[437] = t217;
        } else {
            t217 = $[437];
        }
        let t218;
        if ($[438] !== t217) {
            t218 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\u270F\uFE0F",
                title: t217
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2498,
                columnNumber: 14
            }, this);
            $[438] = t217;
            $[439] = t218;
        } else {
            t218 = $[439];
        }
        let t219;
        if ($[440] === Symbol.for("react.memo_cache_sentinel")) {
            t219 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 40,
                transition: "all 0.3s ease"
            };
            $[440] = t219;
        } else {
            t219 = $[440];
        }
        let t220;
        if ($[441] !== revealedAnswers || $[442] !== t) {
            t220 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t219,
                children: [
                    {
                        id: "e1",
                        q: t("Trong c\xE1c c\xE2u sau, c\xE2u n\xE0o l\xE0 m\u1EC7nh \u0111\u1EC1? X\xE1c \u0111\u1ECBnh \u0111\xFAng/sai.\n(a) \"5 l\xE0 s\u1ED1 ch\u1EB5n\"\n(b) \"x + 3 = 7\"\n(c) \"T\u1ED5ng ba g\xF3c c\u1EE7a tam gi\xE1c b\u1EB1ng 180\xB0\"", "Which are propositions? State T/F.\n(a) \"5 is even\"\n(b) \"x + 3 = 7\"\n(c) \"Sum of angles in a triangle = 180\xB0\""),
                        a: [
                            t("(a) M\u1EC7nh \u0111\u1EC1 \u2014 SAI (5 l\xE0 s\u1ED1 l\u1EBB)", "(a) Proposition \u2014 FALSE (5 is odd)"),
                            t("(b) Kh\xF4ng ph\u1EA3i m\u1EC7nh \u0111\u1EC1 (ch\u1EE9a bi\u1EBFn x)", "(b) Not a proposition (contains variable x)"),
                            t("(c) M\u1EC7nh \u0111\u1EC1 \u2014 \u0110\xDANG", "(c) Proposition \u2014 TRUE")
                        ]
                    },
                    {
                        id: "e2",
                        q: t("Vi\u1EBFt ph\u1EE7 \u0111\u1ECBnh:\n(a) P: \"\u221A5 l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\"\n(b) Q: \"M\u1ECDi s\u1ED1 nguy\xEAn t\u1ED1 \u0111\u1EC1u l\xE0 s\u1ED1 l\u1EBB\"", "Write the negation:\n(a) P: \"\u221A5 is rational\"\n(b) Q: \"Every prime is odd\""),
                        a: [
                            t("(a) \xACP: \"\u221A5 kh\xF4ng l\xE0 s\u1ED1 h\u1EEFu t\u1EC9\" \u2192 \u0110\xDANG", "(a) \xACP: \"\u221A5 is not rational\" \u2192 TRUE"),
                            t("(b) \xACQ: \"T\u1ED3n t\u1EA1i s\u1ED1 nguy\xEAn t\u1ED1 kh\xF4ng ph\u1EA3i s\u1ED1 l\u1EBB\" \u2192 \u0110\xDANG (s\u1ED1 2)", "(b) \xACQ: \"There exists a prime that is not odd\" \u2192 TRUE (2)")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("P: \"\u0394ABC vu\xF4ng t\u1EA1i A\", Q: \"BC\xB2 = AB\xB2 + AC\xB2\".\nPh\xE1t bi\u1EC3u P \u21D2 Q v\xE0 ki\u1EC3m tra.", "P: \"\u25B3ABC is right-angled at A\", Q: \"BC\xB2 = AB\xB2 + AC\xB2\".\nState P \u21D2 Q and check."),
                        a: [
                            t("P \u21D2 Q: \"N\u1EBFu \u0394ABC vu\xF4ng t\u1EA1i A th\xEC BC\xB2 = AB\xB2 + AC\xB2\"", "P \u21D2 Q: \"If \u25B3ABC is right-angled at A, then BC\xB2 = AB\xB2 + AC\xB2\""),
                            t("\u0110\xE2y l\xE0 \u0110\u1ECBnh l\xFD Pythagoras \u2192 \u0110\xDANG", "This is the Pythagorean Theorem \u2192 TRUE")
                        ]
                    }
                ].map({
                    "Lesson1_MenhDe[(anonymous)()]": (t221)=>{
                        const { id: id_3, q: q_2, a } = t221;
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2542,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14
                                            },
                                            children: t("To\xE1n 10", "Grade 10")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2546,
                                            columnNumber: 63
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                marginTop: 10,
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: q_2
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2549,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2537,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson1_MenhDe[(anonymous)() > <button>.onClick]": ()=>toggleAnswer(id_3)
                                    }["Lesson1_MenhDe[(anonymous)() > <button>.onClick]"],
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
                                    children: revealedAnswers[id_3] ? t("\u1EA8n \u0111\xE1p \xE1n \u25B2", "Hide Answer \u25B2") : t("Xem \u0111\xE1p \xE1n \u25BC", "Show Answer \u25BC")
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2554,
                                    columnNumber: 37
                                }, this),
                                revealedAnswers[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a.map(_Lesson1_MenhDeAnonymousAMap)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2567,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2537,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson1_MenhDe[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2518,
                columnNumber: 14
            }, this);
            $[441] = revealedAnswers;
            $[442] = t;
            $[443] = t220;
        } else {
            t220 = $[443];
        }
        if ($[444] !== t218 || $[445] !== t220) {
            t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "thucHanh",
                style: t216,
                children: [
                    t218,
                    t220
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2581,
                columnNumber: 13
            }, this);
            $[444] = t218;
            $[445] = t220;
            $[446] = t25;
        } else {
            t25 = $[446];
        }
        t7 = "miniGame";
        if ($[447] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[447] = t8;
        } else {
            t8 = $[447];
        }
        let t221;
        if ($[448] !== t) {
            t221 = t("Mini Game", "Mini Game");
            $[448] = t;
            $[449] = t221;
        } else {
            t221 = $[449];
        }
        if ($[450] !== t221) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83C\uDFAE",
                title: t221
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2607,
                columnNumber: 12
            }, this);
            $[450] = t221;
            $[451] = t9;
        } else {
            t9 = $[451];
        }
        let t222;
        if ($[452] === Symbol.for("react.memo_cache_sentinel")) {
            t222 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s ease"
            };
            $[452] = t222;
        } else {
            t222 = $[452];
        }
        let t223;
        if ($[453] !== t) {
            t223 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[453] = t;
            $[454] = t223;
        } else {
            t223 = $[454];
        }
        let t224;
        if ($[455] !== t) {
            t224 = t("5 c\xE2u h\u1ECFi", "5 questions");
            $[455] = t;
            $[456] = t224;
        } else {
            t224 = $[456];
        }
        let t225;
        if ($[457] !== t223 || $[458] !== t224) {
            t225 = [
                "mc",
                "\uD83E\uDDE9",
                t223,
                t224
            ];
            $[457] = t223;
            $[458] = t224;
            $[459] = t225;
        } else {
            t225 = $[459];
        }
        let t226;
        if ($[460] !== t) {
            t226 = t("\u0110\xFAng / Sai", "True / False");
            $[460] = t;
            $[461] = t226;
        } else {
            t226 = $[461];
        }
        let t227;
        if ($[462] !== t) {
            t227 = t("5 th\u1EBB", "5 cards");
            $[462] = t;
            $[463] = t227;
        } else {
            t227 = $[463];
        }
        let t228;
        if ($[464] !== t226 || $[465] !== t227) {
            t228 = [
                "tf",
                "\uD83C\uDCCF",
                t226,
                t227
            ];
            $[464] = t226;
            $[465] = t227;
            $[466] = t228;
        } else {
            t228 = $[466];
        }
        let t229;
        if ($[467] !== t) {
            t229 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[467] = t;
            $[468] = t229;
        } else {
            t229 = $[468];
        }
        let t230;
        if ($[469] !== t) {
            t230 = t("3 c\xE2u", "3 items");
            $[469] = t;
            $[470] = t230;
        } else {
            t230 = $[470];
        }
        let t231;
        if ($[471] !== t229 || $[472] !== t230) {
            t231 = [
                "fill",
                "\u270D\uFE0F",
                t229,
                t230
            ];
            $[471] = t229;
            $[472] = t230;
            $[473] = t231;
        } else {
            t231 = $[473];
        }
        let t232;
        if ($[474] !== t225 || $[475] !== t228 || $[476] !== t231) {
            t232 = [
                t225,
                t228,
                t231
            ];
            $[474] = t225;
            $[475] = t228;
            $[476] = t231;
            $[477] = t232;
        } else {
            t232 = $[477];
        }
        if ($[478] !== gameMode || $[479] !== t232) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t222,
                children: t232.map({
                    "Lesson1_MenhDe[(anonymous)()]": (t233)=>{
                        const [mode, icon_1, label_0, sub] = t233;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson1_MenhDe[(anonymous)() > <article>.onClick]": ()=>setGameMode(mode)
                            }["Lesson1_MenhDe[(anonymous)() > <article>.onClick]"],
                            style: {
                                background: gameMode === mode ? "black" : "#f9f9f9",
                                color: gameMode === mode ? "white" : "black",
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
                                    children: icon_1
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2724,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2727,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2730,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2715,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson1_MenhDe[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2712,
                columnNumber: 13
            }, this);
            $[478] = gameMode;
            $[479] = t232;
            $[480] = t10;
        } else {
            t10 = $[480];
        }
        t11 = gameMode === "mc" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: !mcDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                            mcIndex + 1,
                            "/",
                            mcQuestions.length,
                            " · ",
                            t("\u0110i\u1EC3m:", "Score:"),
                            " ",
                            mcScore
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 2747,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 20,
                            fontWeight: 600,
                            marginBottom: 20
                        },
                        children: mcQuestions[mcIndex].q
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 2751,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQuestions[mcIndex].options.map({
                            "Lesson1_MenhDe[(anonymous)()]": (opt, i_9)=>{
                                let bg = "white";
                                let color = "black";
                                if (mcSelected !== null) {
                                    if (i_9 === mcQuestions[mcIndex].answer) {
                                        bg = "#eafaf1";
                                        color = "#1e8449";
                                    } else {
                                        if (i_9 === mcSelected) {
                                            bg = "#fdf2f2";
                                            color = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson1_MenhDe[(anonymous)() > <button>.onClick]": ()=>handleMcSelect(i_9)
                                    }["Lesson1_MenhDe[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color,
                                        fontSize: 15,
                                        fontWeight: mcSelected !== null && (i_9 === mcSelected || i_9 === mcQuestions[mcIndex].answer) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "all 0.15s"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_9),
                                        ". ",
                                        opt
                                    ]
                                }, i_9, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2774,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson1_MenhDe[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 2755,
                        columnNumber: 42
                    }, this),
                    mcSelected !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                                    mcQuestions[mcIndex].explain
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 2790,
                                columnNumber: 79
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleMcNext,
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
                                children: mcIndex + 1 < mcQuestions.length ? t("C\xE2u ti\u1EBFp \u25B6", "Next \u25B6") : t("Xem k\u1EBFt qu\u1EA3", "See Results")
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 2798,
                                columnNumber: 53
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: "center",
                    padding: 20
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 22,
                            fontWeight: "bold",
                            color: "#0B4F5C",
                            marginBottom: 8
                        },
                        children: [
                            "🏆 ",
                            mcScore,
                            "/",
                            mcQuestions.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 2811,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "#777",
                            fontSize: 18,
                            marginBottom: 20
                        },
                        children: mcScore === mcQuestions.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : mcScore >= 3 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 2816,
                        columnNumber: 51
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: resetMc,
                        style: {
                            padding: "10px 18px",
                            background: "black",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: "pointer"
                        },
                        children: t("Ch\u01A1i l\u1EA1i", "Play Again")
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 2820,
                        columnNumber: 271
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2808,
                columnNumber: 157
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 2742,
            columnNumber: 32
        }, this);
        if ($[481] !== gameMode || $[482] !== handleTfAnswer || $[483] !== handleTfNext || $[484] !== t || $[485] !== tfCards || $[486] !== tfDone || $[487] !== tfFlipped || $[488] !== tfIndex || $[489] !== tfScore) {
            t12 = gameMode === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 20,
                    borderRadius: 10,
                    background: "#f9f9f9",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: !tfDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                                tfIndex + 1,
                                "/",
                                tfCards.length,
                                " · ",
                                t("\u0110i\u1EC3m:", "Score:"),
                                " ",
                                tfScore
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2835,
                            columnNumber: 23
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
                                    children: tfCards[tfIndex].stmt
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2846,
                                    columnNumber: 14
                                }, this),
                                !tfFlipped ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: 16,
                                        justifyContent: "center"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "Lesson1_MenhDe[<button>.onClick]": ()=>handleTfAnswer(true)
                                            }["Lesson1_MenhDe[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2854,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "Lesson1_MenhDe[<button>.onClick]": ()=>handleTfAnswer(false)
                                            }["Lesson1_MenhDe[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2865,
                                            columnNumber: 56
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2850,
                                    columnNumber: 59
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
                                                tfCards[tfIndex].explain
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2876,
                                            columnNumber: 59
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleTfNext,
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
                                            children: tfIndex + 1 < tfCards.length ? t("Th\u1EBB ti\u1EBFp \u25B6", "Next \u25B6") : t("Xem k\u1EBFt qu\u1EA3", "See Results")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2885,
                                            columnNumber: 53
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2839,
                            columnNumber: 119
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: "center",
                        padding: 20
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 22,
                                fontWeight: "bold",
                                color: "#0B4F5C",
                                marginBottom: 8
                            },
                            children: [
                                "🏆 ",
                                tfScore,
                                "/",
                                tfCards.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2897,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                color: "#777",
                                fontSize: 18,
                                marginBottom: 20
                            },
                            children: tfScore === tfCards.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2902,
                            columnNumber: 49
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: resetTf,
                            style: {
                                padding: "10px 18px",
                                background: "black",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                cursor: "pointer"
                            },
                            children: t("Ch\u01A1i l\u1EA1i", "Play Again")
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2906,
                            columnNumber: 188
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 2894,
                    columnNumber: 169
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 2830,
                columnNumber: 34
            }, this);
            $[481] = gameMode;
            $[482] = handleTfAnswer;
            $[483] = handleTfNext;
            $[484] = t;
            $[485] = tfCards;
            $[486] = tfDone;
            $[487] = tfFlipped;
            $[488] = tfIndex;
            $[489] = tfScore;
            $[490] = t12;
        } else {
            t12 = $[490];
        }
        t13 = gameMode === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 20
                    },
                    children: t("\u0110i\u1EC1n c\xE2u tr\u1EA3 l\u1EDDi v\xE0o ch\u1ED7 tr\u1ED1ng", "Fill in each blank")
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 2933,
                    columnNumber: 8
                }, this),
                fillQuestions.map({
                    "Lesson1_MenhDe[fillQuestions.map()]": (q_3)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 24
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 16,
                                        lineHeight: 1.7,
                                        marginBottom: 10
                                    },
                                    children: q_3.template
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2940,
                                    columnNumber: 12
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: fillAnswers[q_3.id] || "",
                                            onChange: {
                                                "Lesson1_MenhDe[fillQuestions.map() > <input>.onChange]": (e_1)=>setFillAnswers({
                                                        "Lesson1_MenhDe[fillQuestions.map() > <input>.onChange > setFillAnswers()]": (p_0)=>({
                                                                ...p_0,
                                                                [q_3.id]: e_1.target.value
                                                            })
                                                    }["Lesson1_MenhDe[fillQuestions.map() > <input>.onChange > setFillAnswers()]"])
                                            }["Lesson1_MenhDe[fillQuestions.map() > <input>.onChange]"],
                                            placeholder: t("Nh\u1EADp \u0111\xE1p \xE1n...", "Enter answer..."),
                                            style: {
                                                flex: 1,
                                                padding: "12px 16px",
                                                borderRadius: 8,
                                                fontSize: 15,
                                                outline: "none",
                                                border: fillChecked ? `2px solid ${checkFill(q_3.id) ? "#1e8449" : "#922b21"}` : "1px solid #ddd",
                                                background: fillChecked ? checkFill(q_3.id) ? "#eafaf1" : "#fdf2f2" : "white",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2948,
                                            columnNumber: 14
                                        }, this),
                                        fillChecked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 13,
                                                fontWeight: 700,
                                                background: checkFill(q_3.id) ? "#eafaf1" : "#fdf2f2",
                                                color: checkFill(q_3.id) ? "#1e8449" : "#922b21",
                                                padding: "4px 12px",
                                                borderRadius: 20,
                                                whiteSpace: "nowrap"
                                            },
                                            children: checkFill(q_3.id) ? "\u2713 \u0110\xFAng" : `✗ → ${q_3.answer}`
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                            lineNumber: 2964,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2944,
                                    columnNumber: 34
                                }, this),
                                fillChecked && !checkFill(q_3.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        color: "#777",
                                        fontStyle: "italic",
                                        marginTop: 6
                                    },
                                    children: [
                                        "💡 ",
                                        t("G\u1EE3i \xFD:", "Hint:"),
                                        " ",
                                        q_3.hint
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                    lineNumber: 2972,
                                    columnNumber: 133
                                }, this)
                            ]
                        }, q_3.id, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2938,
                            columnNumber: 55
                        }, this)
                }["Lesson1_MenhDe[fillQuestions.map()]"]),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 12
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson1_MenhDe[<button>.onClick]": ()=>setFillChecked(true)
                            }["Lesson1_MenhDe[<button>.onClick]"],
                            style: {
                                padding: "10px 18px",
                                background: "black",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                cursor: "pointer"
                            },
                            children: t("Ki\u1EC3m tra", "Check Answers")
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2981,
                            columnNumber: 10
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson1_MenhDe[<button>.onClick]": ()=>{
                                    setFillAnswers({});
                                    setFillChecked(false);
                                }
                            }["Lesson1_MenhDe[<button>.onClick]"],
                            style: {
                                padding: "10px 18px",
                                background: "#f9f9f9",
                                color: "black",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            },
                            children: t("L\xE0m l\u1EA1i", "Reset")
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                            lineNumber: 2991,
                            columnNumber: 58
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                    lineNumber: 2978,
                    columnNumber: 49
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 2928,
            columnNumber: 34
        }, this);
        $[9] = fillAnswers;
        $[10] = fillChecked;
        $[11] = gameMode;
        $[12] = lang;
        $[13] = mcDone;
        $[14] = mcHistory;
        $[15] = mcIndex;
        $[16] = mcScore;
        $[17] = mcSelected;
        $[18] = revealedAnswers;
        $[19] = t;
        $[20] = tfDone;
        $[21] = tfFlipped;
        $[22] = tfHistory;
        $[23] = tfIndex;
        $[24] = tfScore;
        $[25] = t10;
        $[26] = t11;
        $[27] = t12;
        $[28] = t13;
        $[29] = t14;
        $[30] = t15;
        $[31] = t16;
        $[32] = t17;
        $[33] = t18;
        $[34] = t19;
        $[35] = t20;
        $[36] = t21;
        $[37] = t22;
        $[38] = t23;
        $[39] = t24;
        $[40] = t25;
        $[41] = t26;
        $[42] = t7;
        $[43] = t8;
        $[44] = t9;
    } else {
        t10 = $[25];
        t11 = $[26];
        t12 = $[27];
        t13 = $[28];
        t14 = $[29];
        t15 = $[30];
        t16 = $[31];
        t17 = $[32];
        t18 = $[33];
        t19 = $[34];
        t20 = $[35];
        t21 = $[36];
        t22 = $[37];
        t23 = $[38];
        t24 = $[39];
        t25 = $[40];
        t26 = $[41];
        t7 = $[42];
        t8 = $[43];
        t9 = $[44];
    }
    let t27;
    if ($[491] !== t10 || $[492] !== t11 || $[493] !== t12 || $[494] !== t13 || $[495] !== t7 || $[496] !== t8 || $[497] !== t9) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            id: t7,
            style: t8,
            children: [
                t9,
                t10,
                t11,
                t12,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3066,
            columnNumber: 11
        }, this);
        $[491] = t10;
        $[492] = t11;
        $[493] = t12;
        $[494] = t13;
        $[495] = t7;
        $[496] = t8;
        $[497] = t9;
        $[498] = t27;
    } else {
        t27 = $[498];
    }
    let t28;
    if ($[499] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3080,
            columnNumber: 11
        }, this);
        $[499] = t28;
    } else {
        t28 = $[499];
    }
    let t29;
    if ($[500] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[500] = t29;
    } else {
        t29 = $[500];
    }
    let t30;
    if ($[501] !== t) {
        t30 = t("B\xE0i 1 / Ch\u01B0\u01A1ng I", "Lesson 1 / Chapter I");
        $[501] = t;
        $[502] = t30;
    } else {
        t30 = $[502];
    }
    let t31;
    if ($[503] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t29,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t30
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3109,
            columnNumber: 11
        }, this);
        $[503] = t30;
        $[504] = t31;
    } else {
        t31 = $[504];
    }
    let t32;
    let t33;
    if ($[505] === Symbol.for("react.memo_cache_sentinel")) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n          .reveal { opacity:0; transform:translateY(28px) scale(0.97); transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1); will-change:opacity,transform; }\n          .reveal.visible { opacity:1; transform:translateY(0) scale(1); }\n          .reveal[data-reveal-stagger].visible { opacity:1; transform:none; }\n          .reveal[data-reveal-stagger] > * { opacity:0; transform:translateY(24px) scale(0.97); will-change:opacity,transform; }\n          header.reveal { transform:translateY(-18px); opacity:0; }\n          header.reveal.visible { opacity:1; transform:translateY(0); }\n          article { transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease; border-radius:10px; padding:8px; }\n          article:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 12px 28px rgba(0,0,0,0.12); }\n        "
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3118,
            columnNumber: 11
        }, this);
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3119,
            columnNumber: 11
        }, this);
        $[505] = t32;
        $[506] = t33;
    } else {
        t32 = $[505];
        t33 = $[506];
    }
    let t34;
    if ($[507] !== t14 || $[508] !== t15 || $[509] !== t16 || $[510] !== t17 || $[511] !== t18 || $[512] !== t19 || $[513] !== t20 || $[514] !== t21 || $[515] !== t22 || $[516] !== t23 || $[517] !== t24 || $[518] !== t25 || $[519] !== t27 || $[520] !== t31) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t14,
            children: [
                t15,
                t16,
                t17,
                t18,
                t19,
                t20,
                t21,
                t22,
                t23,
                t24,
                t25,
                t27,
                t28,
                t31,
                t32,
                t33
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3128,
            columnNumber: 11
        }, this);
        $[507] = t14;
        $[508] = t15;
        $[509] = t16;
        $[510] = t17;
        $[511] = t18;
        $[512] = t19;
        $[513] = t20;
        $[514] = t21;
        $[515] = t22;
        $[516] = t23;
        $[517] = t24;
        $[518] = t25;
        $[519] = t27;
        $[520] = t31;
        $[521] = t34;
    } else {
        t34 = $[521];
    }
    let t35;
    if ($[522] !== t26 || $[523] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t26,
            children: t34
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
            lineNumber: 3149,
            columnNumber: 11
        }, this);
        $[522] = t26;
        $[523] = t34;
        $[524] = t35;
    } else {
        t35 = $[524];
    }
    return t35;
}
_s(Lesson1_MenhDe, "o9ln2GYkrW8yJye2B9T4lwZLUUE=");
_c2 = Lesson1_MenhDe;
function _Lesson1_MenhDeAnonymousAMap(line, i_8) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: line
    }, i_8, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3159,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeAnonymous6(q_1, i_7) {
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
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 8
                },
                children: q_1.sym
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3171,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 6
                },
                children: q_1.name
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3176,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    color: "#555",
                    marginBottom: 10
                },
                children: q_1.desc
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3180,
                columnNumber: 24
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    color: "#777",
                    marginBottom: 6,
                    fontFamily: "monospace",
                    background: "white",
                    padding: "6px 10px",
                    borderRadius: 6
                },
                children: [
                    "📌 ",
                    q_1.neg
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3184,
                columnNumber: 24
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    color: "#777"
                },
                children: [
                    "📘 ",
                    q_1.ex
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3192,
                columnNumber: 26
            }, this)
        ]
    }, i_7, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3166,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeAnonymous5(row, ri) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        children: row.map(_Lesson1_MenhDeAnonymousRowMap)
    }, ri, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3198,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeAnonymousRowMap(c, ci) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        style: {
            padding: "10px 40px",
            textAlign: "center",
            background: c === "T" ? "#eafaf1" : "#fdf2f2",
            color: c === "T" ? "#1e8449" : "#922b21",
            fontWeight: 600,
            border: "1px solid #eee"
        },
        children: c
    }, ci, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3201,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeAnonymous4(h_4) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        style: {
            background: "black",
            color: "white",
            padding: "12px 40px",
            textAlign: "center"
        },
        children: h_4
    }, h_4, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3211,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeAnonymous3(h_3) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        style: {
            background: "black",
            color: "white",
            padding: "12px 48px",
            textAlign: "center"
        },
        children: h_3
    }, h_3, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3219,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeAnonymous2(group, gi) {
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
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12
                },
                children: group.label
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3232,
                columnNumber: 6
            }, this),
            group.items.map({
                "Lesson1_MenhDe[(anonymous)() > group.items.map()]": (item, ii)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 15,
                            color: "#555",
                            marginBottom: 8,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 3244,
                                columnNumber: 10
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: group.bb,
                                    color: group.bc,
                                    padding: "2px 10px",
                                    borderRadius: 20,
                                    marginLeft: 8,
                                    whiteSpace: "nowrap"
                                },
                                children: group.badge
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                                lineNumber: 3244,
                                columnNumber: 29
                            }, this)
                        ]
                    }, ii, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                        lineNumber: 3237,
                        columnNumber: 74
                    }, this)
            }["Lesson1_MenhDe[(anonymous)() > group.items.map()]"])
        ]
    }, gi, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3227,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson1_MenhDeTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson1_MenhDeAnonymous(obj, i_4) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: [
            "• ",
            obj
        ]
    }, i_4, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3265,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeSectionHeader(t0) {
    const { icon, title } = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            fontWeight: 700,
            color: "#0B4F5C",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "2px solid #f0f0f0"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: icon
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3286,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
                lineNumber: 3286,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js",
        lineNumber: 3276,
        columnNumber: 10
    }, this);
}
function _Lesson1_MenhDeHandleTfNextSetTfIndex(i_3) {
    return i_3 + 1;
}
function _Lesson1_MenhDeHandleTfAnswerSetTfScore(s_0) {
    return s_0 + 1;
}
function _Lesson1_MenhDeHandleMcNextSetMcIndex(i_2) {
    return i_2 + 1;
}
function _Lesson1_MenhDeHandleMcSelectSetMcScore(s) {
    return s + 1;
}
function _Lesson1_MenhDeScrollTo(id_0) {
    const el_2 = document.getElementById(id_0);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson1_MenhDeUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson1_MenhDeUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp4, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson1_MenhDe[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson1_MenhDe[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp4(entries, observer) {
    entries.forEach({
        "Lesson1_MenhDe[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson1_MenhDe[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "Lesson1_MenhDe[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson1_MenhDe[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["Lesson1_MenhDe[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson1_MenhDe[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson1_MenhDeUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson1_MenhDe[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["Lesson1_MenhDe[useEffect() > els.forEach() > (anonymous)()]"]);
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
__turbopack_context__.k.register(_c, "SectionHeader");
__turbopack_context__.k.register(_c1, "ResultSummary");
__turbopack_context__.k.register(_c2, "Lesson1_MenhDe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/app/Menh-de/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson1_MenhDe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$Cacbaitoan10$2f$Lesson1_MenhDe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/Cacbaitoan10/Lesson1_MenhDe.js [app-client] (ecmascript)");
"use client";
;
;
;
function Lesson1_MenhDe() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "b2a3dac41f370d66848617ec080e74f4c77069e47a5310f4832ea423ddff7863") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b2a3dac41f370d66848617ec080e74f4c77069e47a5310f4832ea423ddff7863";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$Cacbaitoan10$2f$Lesson1_MenhDe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/app/Menh-de/page.js",
            lineNumber: 15,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = Lesson1_MenhDe;
var _c;
__turbopack_context__.k.register(_c, "Lesson1_MenhDe");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_16e278d5._.js.map