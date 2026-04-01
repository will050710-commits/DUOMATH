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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson2_TapHop
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
function Lesson2_TapHop() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(477);
    if ($[0] !== "6d6344088cb54583429f437119accdfcdde9b910b2e9e55cb7cc085ed65f9c0e") {
        for(let $i = 0; $i < 477; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6d6344088cb54583429f437119accdfcdde9b910b2e9e55cb7cc085ed65f9c0e";
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
    const [tfIndex, setTfIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tfFlipped, setTfFlipped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tfScore, setTfScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tfDone, setTfDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {};
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [fillAnswers, setFillAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [fillChecked, setFillChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson2_TapHopUseEffect, t2);
    let t3;
    if ($[4] !== lang) {
        t3 = ({
            "Lesson2_TapHop[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson2_TapHop[t]"];
        $[4] = lang;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const t = t3;
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "Lesson2_TapHop[toggleAnswer]": (id)=>setRevealedAnswers({
                    "Lesson2_TapHop[toggleAnswer > setRevealedAnswers()]": (p)=>({
                            ...p,
                            [id]: !p[id]
                        })
                }["Lesson2_TapHop[toggleAnswer > setRevealedAnswers()]"])
        })["Lesson2_TapHop[toggleAnswer]"];
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    const toggleAnswer = t4;
    const scrollTo = _Lesson2_TapHopScrollTo;
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
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[7] !== fillAnswers || $[8] !== fillChecked || $[9] !== gameMode || $[10] !== lang || $[11] !== mcDone || $[12] !== mcIndex || $[13] !== mcScore || $[14] !== mcSelected || $[15] !== revealedAnswers || $[16] !== t || $[17] !== tfDone || $[18] !== tfFlipped || $[19] !== tfIndex || $[20] !== tfScore) {
        const mcQuestions = [
            {
                q: t("C\xE1ch n\xE0o KH\xD4NG ph\u1EA3i l\xE0 c\xE1ch x\xE1c \u0111\u1ECBnh t\u1EADp h\u1EE3p?", "Which is NOT a valid way to define a set?"),
                options: [
                    t("Li\u1EC7t k\xEA c\xE1c ph\u1EA7n t\u1EED", "List the elements"),
                    t("Ch\u1EC9 ra t\xEDnh ch\u1EA5t \u0111\u1EB7c tr\u01B0ng", "State a characteristic property"),
                    t("\u0110\u1EB7t t\xEAn b\u1EB1ng ch\u1EEF th\u01B0\u1EDDng", "Use a lowercase letter as name"),
                    t("D\xF9ng bi\u1EC3u \u0111\u1ED3 Venn", "Use a Venn diagram")
                ],
                answer: 2,
                explain: t("T\u1EADp h\u1EE3p \u0111\u01B0\u1EE3c \u0111\u1EB7t t\xEAn b\u1EB1ng ch\u1EEF IN HOA (A, B, C...), kh\xF4ng d\xF9ng ch\u1EEF th\u01B0\u1EDDng.", "Sets are named with UPPERCASE letters (A, B, C...), not lowercase.")
            },
            {
                q: t("T\u1EADp h\u1EE3p A = {1, 2, 3, 4}. M\u1EC7nh \u0111\u1EC1 n\xE0o \u0111\xFAng?", "Set A = {1, 2, 3, 4}. Which statement is true?"),
                options: [
                    "5 \u2208 A",
                    "3 \u2209 A",
                    "{1, 2} \u2282 A",
                    "A \u2282 {1, 2}"
                ],
                answer: 2,
                explain: t("{1,2} \u2282 A v\xEC m\u1ECDi ph\u1EA7n t\u1EED c\u1EE7a {1,2} \u0111\u1EC1u thu\u1ED9c A.", "{1,2} \u2282 A because every element of {1,2} belongs to A.")
            },
            {
                q: t("T\u1EADp h\u1EE3p n\xE0o l\xE0 t\u1EADp con c\u1EE7a t\u1EADp \u2205?", "Which set is a subset of \u2205?"),
                options: [
                    "{0}",
                    "{\u2205}",
                    "\u2205",
                    t("Kh\xF4ng c\xF3 t\u1EADp n\xE0o", "No set")
                ],
                answer: 2,
                explain: t("\u2205 l\xE0 t\u1EADp con c\u1EE7a m\u1ECDi t\u1EADp h\u1EE3p, k\u1EC3 c\u1EA3 \u2205 \u2282 \u2205.", "\u2205 is a subset of every set, including \u2205 \u2282 \u2205.")
            },
            {
                q: t("A = {a, b, c}. T\u1EADp A c\xF3 bao nhi\xEAu t\u1EADp con?", "A = {a, b, c}. How many subsets does A have?"),
                options: [
                    "3",
                    "6",
                    "8",
                    "9"
                ],
                answer: 2,
                explain: t("T\u1EADp n ph\u1EA7n t\u1EED c\xF3 2\u207F t\u1EADp con. 2\xB3 = 8.", "A set with n elements has 2\u207F subsets. 2\xB3 = 8.")
            },
            {
                q: t("A = {1,2,3}, B = {1,2,3}. K\u1EBFt lu\u1EADn n\xE0o \u0111\xFAng?", "A = {1,2,3}, B = {1,2,3}. Which conclusion is correct?"),
                options: [
                    "A \u2282 B nh\u01B0ng B \u2284 A",
                    "A \u2283 B nh\u01B0ng A \u2260 B",
                    "A = B",
                    "A v\xE0 B kh\xF4ng so s\xE1nh \u0111\u01B0\u1EE3c"
                ],
                answer: 2,
                explain: t("A = B v\xEC A \u2282 B v\xE0 B \u2282 A (c\xF9ng ph\u1EA7n t\u1EED, kh\xF4ng ph\u1EE5 thu\u1ED9c th\u1EE9 t\u1EF1).", "A = B since A \u2282 B and B \u2282 A (same elements, order does not matter).")
            }
        ];
        let t23;
        if ($[39] !== t) {
            t23 = t("T\u1EADp h\u1EE3p r\u1ED7ng \u2205 kh\xF4ng l\xE0 t\u1EADp con c\u1EE7a b\u1EA5t k\u1EF3 t\u1EADp h\u1EE3p n\xE0o.", "The empty set \u2205 is not a subset of any set.");
            $[39] = t;
            $[40] = t23;
        } else {
            t23 = $[40];
        }
        let t24;
        if ($[41] !== t) {
            t24 = t("SAI \u2014 \u2205 l\xE0 t\u1EADp con c\u1EE7a m\u1ECDi t\u1EADp h\u1EE3p.", "FALSE \u2014 \u2205 is a subset of every set.");
            $[41] = t;
            $[42] = t24;
        } else {
            t24 = $[42];
        }
        let t25;
        if ($[43] !== t23 || $[44] !== t24) {
            t25 = {
                stmt: t23,
                answer: false,
                explain: t24
            };
            $[43] = t23;
            $[44] = t24;
            $[45] = t25;
        } else {
            t25 = $[45];
        }
        let t26;
        if ($[46] !== t) {
            t26 = t("N\u1EBFu A \u2282 B v\xE0 B \u2282 A th\xEC A = B.", "If A \u2282 B and B \u2282 A, then A = B.");
            $[46] = t;
            $[47] = t26;
        } else {
            t26 = $[47];
        }
        let t27;
        if ($[48] !== t) {
            t27 = t("\u0110\xDANG \u2014 \u0111\xE2y l\xE0 \u0111\u1ECBnh ngh\u0129a hai t\u1EADp b\u1EB1ng nhau.", "TRUE \u2014 this is the definition of set equality.");
            $[48] = t;
            $[49] = t27;
        } else {
            t27 = $[49];
        }
        let t28;
        if ($[50] !== t26 || $[51] !== t27) {
            t28 = {
                stmt: t26,
                answer: true,
                explain: t27
            };
            $[50] = t26;
            $[51] = t27;
            $[52] = t28;
        } else {
            t28 = $[52];
        }
        let t29;
        if ($[53] !== t) {
            t29 = t("{1, 2, 3} = {3, 1, 2}.", "{1, 2, 3} = {3, 1, 2}.");
            $[53] = t;
            $[54] = t29;
        } else {
            t29 = $[54];
        }
        let t30;
        if ($[55] !== t) {
            t30 = t("\u0110\xDANG \u2014 th\u1EE9 t\u1EF1 c\xE1c ph\u1EA7n t\u1EED kh\xF4ng \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn t\u1EADp h\u1EE3p.", "TRUE \u2014 order of elements does not matter in a set.");
            $[55] = t;
            $[56] = t30;
        } else {
            t30 = $[56];
        }
        let t31;
        if ($[57] !== t29 || $[58] !== t30) {
            t31 = {
                stmt: t29,
                answer: true,
                explain: t30
            };
            $[57] = t29;
            $[58] = t30;
            $[59] = t31;
        } else {
            t31 = $[59];
        }
        let t32;
        if ($[60] !== t) {
            t32 = t("{1, 1, 2} = {1, 2}.", "{1, 1, 2} = {1, 2}.");
            $[60] = t;
            $[61] = t32;
        } else {
            t32 = $[61];
        }
        let t33;
        if ($[62] !== t) {
            t33 = t("\u0110\xDANG \u2014 m\u1ED7i ph\u1EA7n t\u1EED ch\u1EC9 xu\u1EA5t hi\u1EC7n m\u1ED9t l\u1EA7n; ph\u1EA7n t\u1EED l\u1EB7p b\u1ECB b\u1ECF qua.", "TRUE \u2014 each element appears only once; duplicates are ignored.");
            $[62] = t;
            $[63] = t33;
        } else {
            t33 = $[63];
        }
        let t34;
        if ($[64] !== t32 || $[65] !== t33) {
            t34 = {
                stmt: t32,
                answer: true,
                explain: t33
            };
            $[64] = t32;
            $[65] = t33;
            $[66] = t34;
        } else {
            t34 = $[66];
        }
        let t35;
        if ($[67] !== t) {
            t35 = t("A \u2282 B v\xE0 a \u2208 A suy ra a \u2208 B.", "A \u2282 B and a \u2208 A implies a \u2208 B.");
            $[67] = t;
            $[68] = t35;
        } else {
            t35 = $[68];
        }
        let t36;
        if ($[69] !== t) {
            t36 = t("\u0110\xDANG \u2014 \u0111\u1ECBnh ngh\u0129a c\u1EE7a t\u1EADp con: m\u1ECDi ph\u1EA7n t\u1EED c\u1EE7a A \u0111\u1EC1u thu\u1ED9c B.", "TRUE \u2014 definition of subset: every element of A belongs to B.");
            $[69] = t;
            $[70] = t36;
        } else {
            t36 = $[70];
        }
        let t37;
        if ($[71] !== t35 || $[72] !== t36) {
            t37 = {
                stmt: t35,
                answer: true,
                explain: t36
            };
            $[71] = t35;
            $[72] = t36;
            $[73] = t37;
        } else {
            t37 = $[73];
        }
        let t38;
        if ($[74] !== t25 || $[75] !== t28 || $[76] !== t31 || $[77] !== t34 || $[78] !== t37) {
            t38 = [
                t25,
                t28,
                t31,
                t34,
                t37
            ];
            $[74] = t25;
            $[75] = t28;
            $[76] = t31;
            $[77] = t34;
            $[78] = t37;
            $[79] = t38;
        } else {
            t38 = $[79];
        }
        const tfCards = t38;
        const fillQuestions = [
            {
                id: "f1",
                template: t("Cho A = {x \u2208 \u2115 | x < 5}. Vi\u1EBFt A b\u1EB1ng c\xE1ch li\u1EC7t k\xEA: A = {___}", "Let A = {x \u2208 \u2115 | x < 5}. Write A by listing: A = {___}"),
                answer: "0,1,2,3,4",
                hint: t("C\xE1c s\u1ED1 t\u1EF1 nhi\xEAn nh\u1ECF h\u01A1n 5.", "Natural numbers less than 5.")
            },
            {
                id: "f2",
                template: t("T\u1EADp h\u1EE3p n ph\u1EA7n t\u1EED c\xF3 ___ t\u1EADp con.", "A set with n elements has ___ subsets."),
                answer: "2^n",
                hint: "2\u207F"
            },
            {
                id: "f3",
                template: t("\u2205 ___ m\u1ECDi t\u1EADp h\u1EE3p (d\xF9ng k\xFD hi\u1EC7u \u2282 ho\u1EB7c \u2284).", "\u2205 ___ every set (use \u2282 or \u2284)."),
                answer: "\u2282",
                hint: t("T\u1EADp r\u1ED7ng l\xE0 t\u1EADp con c\u1EE7a m\u1ECDi t\u1EADp h\u1EE3p.", "The empty set is a subset of every set.")
            }
        ];
        const handleMcSelect = {
            "Lesson2_TapHop[handleMcSelect]": (i_1)=>{
                if (mcSelected !== null) {
                    return;
                }
                setMcSelected(i_1);
                if (i_1 === mcQuestions[mcIndex].answer) {
                    setMcScore(_Lesson2_TapHopHandleMcSelectSetMcScore);
                }
            }
        }["Lesson2_TapHop[handleMcSelect]"];
        const handleMcNext = {
            "Lesson2_TapHop[handleMcNext]": ()=>{
                if (mcIndex + 1 >= mcQuestions.length) {
                    setMcDone(true);
                } else {
                    setMcIndex(_Lesson2_TapHopHandleMcNextSetMcIndex);
                    setMcSelected(null);
                }
            }
        }["Lesson2_TapHop[handleMcNext]"];
        let t39;
        if ($[80] === Symbol.for("react.memo_cache_sentinel")) {
            t39 = ({
                "Lesson2_TapHop[resetMc]": ()=>{
                    setMcIndex(0);
                    setMcSelected(null);
                    setMcScore(0);
                    setMcDone(false);
                }
            })["Lesson2_TapHop[resetMc]"];
            $[80] = t39;
        } else {
            t39 = $[80];
        }
        const resetMc = t39;
        let t40;
        if ($[81] !== tfCards || $[82] !== tfFlipped || $[83] !== tfIndex) {
            t40 = ({
                "Lesson2_TapHop[handleTfAnswer]": (ans)=>{
                    if (tfFlipped) {
                        return;
                    }
                    setTfFlipped(true);
                    if (ans === tfCards[tfIndex].answer) {
                        setTfScore(_Lesson2_TapHopHandleTfAnswerSetTfScore);
                    }
                }
            })["Lesson2_TapHop[handleTfAnswer]"];
            $[81] = tfCards;
            $[82] = tfFlipped;
            $[83] = tfIndex;
            $[84] = t40;
        } else {
            t40 = $[84];
        }
        const handleTfAnswer = t40;
        let t41;
        if ($[85] !== tfCards.length || $[86] !== tfIndex) {
            t41 = ({
                "Lesson2_TapHop[handleTfNext]": ()=>{
                    if (tfIndex + 1 >= tfCards.length) {
                        setTfDone(true);
                    } else {
                        setTfIndex(_Lesson2_TapHopHandleTfNextSetTfIndex);
                        setTfFlipped(false);
                    }
                }
            })["Lesson2_TapHop[handleTfNext]"];
            $[85] = tfCards.length;
            $[86] = tfIndex;
            $[87] = t41;
        } else {
            t41 = $[87];
        }
        const handleTfNext = t41;
        let t42;
        if ($[88] === Symbol.for("react.memo_cache_sentinel")) {
            t42 = ({
                "Lesson2_TapHop[resetTf]": ()=>{
                    setTfIndex(0);
                    setTfFlipped(false);
                    setTfScore(0);
                    setTfDone(false);
                }
            })["Lesson2_TapHop[resetTf]"];
            $[88] = t42;
        } else {
            t42 = $[88];
        }
        const resetTf = t42;
        const checkFill = {
            "Lesson2_TapHop[checkFill]": (id_1)=>{
                const correct = fillQuestions.find({
                    "Lesson2_TapHop[checkFill > fillQuestions.find()]": (q)=>q.id === id_1
                }["Lesson2_TapHop[checkFill > fillQuestions.find()]"]).answer.toLowerCase().replace(/\s/g, "");
                return (fillAnswers[id_1] || "").toLowerCase().replace(/\s/g, "") === correct;
            }
        }["Lesson2_TapHop[checkFill]"];
        let t43;
        if ($[89] !== t) {
            t43 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[89] = t;
            $[90] = t43;
        } else {
            t43 = $[90];
        }
        let t44;
        if ($[91] !== t43) {
            t44 = [
                "khoiDong",
                "\uD83D\uDE80",
                t43
            ];
            $[91] = t43;
            $[92] = t44;
        } else {
            t44 = $[92];
        }
        let t45;
        if ($[93] !== t) {
            t45 = t("1. T\u1EADp H\u1EE3p", "1. Sets");
            $[93] = t;
            $[94] = t45;
        } else {
            t45 = $[94];
        }
        let t46;
        if ($[95] !== t45) {
            t46 = [
                "khai1",
                "\uD83D\uDCD6",
                t45
            ];
            $[95] = t45;
            $[96] = t46;
        } else {
            t46 = $[96];
        }
        let t47;
        if ($[97] !== t) {
            t47 = t("2. T\u1EADp Con", "2. Subsets");
            $[97] = t;
            $[98] = t47;
        } else {
            t47 = $[98];
        }
        let t48;
        if ($[99] !== t47) {
            t48 = [
                "khai2",
                "\uD83D\uDCD6",
                t47
            ];
            $[99] = t47;
            $[100] = t48;
        } else {
            t48 = $[100];
        }
        let t49;
        if ($[101] !== t) {
            t49 = t("3. T\u1EADp B\u1EB1ng Nhau", "3. Equal Sets");
            $[101] = t;
            $[102] = t49;
        } else {
            t49 = $[102];
        }
        let t50;
        if ($[103] !== t49) {
            t50 = [
                "khai3",
                "\uD83D\uDCD6",
                t49
            ];
            $[103] = t49;
            $[104] = t50;
        } else {
            t50 = $[104];
        }
        let t51;
        if ($[105] !== t) {
            t51 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[105] = t;
            $[106] = t51;
        } else {
            t51 = $[106];
        }
        let t52;
        if ($[107] !== t51) {
            t52 = [
                "thucHanh",
                "\u270F\uFE0F",
                t51
            ];
            $[107] = t51;
            $[108] = t52;
        } else {
            t52 = $[108];
        }
        let t53;
        if ($[109] !== t) {
            t53 = t("Mini Game", "Mini Game");
            $[109] = t;
            $[110] = t53;
        } else {
            t53 = $[110];
        }
        let t54;
        if ($[111] !== t53) {
            t54 = [
                "miniGame",
                "\uD83C\uDFAE",
                t53
            ];
            $[111] = t53;
            $[112] = t54;
        } else {
            t54 = $[112];
        }
        let t55;
        if ($[113] !== t44 || $[114] !== t46 || $[115] !== t48 || $[116] !== t50 || $[117] !== t52 || $[118] !== t54) {
            t55 = [
                t44,
                t46,
                t48,
                t50,
                t52,
                t54
            ];
            $[113] = t44;
            $[114] = t46;
            $[115] = t48;
            $[116] = t50;
            $[117] = t52;
            $[118] = t54;
            $[119] = t55;
        } else {
            t55 = $[119];
        }
        const tabs = t55;
        const SectionHeader = _Lesson2_TapHopSectionHeader;
        if ($[120] === Symbol.for("react.memo_cache_sentinel")) {
            t22 = {
                width: "100%",
                background: "#ffffff",
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
            $[120] = t12;
            $[121] = t22;
        } else {
            t12 = $[120];
            t22 = $[121];
        }
        let t56;
        if ($[122] === Symbol.for("react.memo_cache_sentinel")) {
            t56 = {
                marginBottom: 24
            };
            $[122] = t56;
        } else {
            t56 = $[122];
        }
        let t57;
        if ($[123] === Symbol.for("react.memo_cache_sentinel")) {
            t57 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[123] = t57;
        } else {
            t57 = $[123];
        }
        let t58;
        if ($[124] !== t) {
            t58 = t("Quay l\u1EA1i", "Back to lessons");
            $[124] = t;
            $[125] = t58;
        } else {
            t58 = $[125];
        }
        if ($[126] !== t58) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t56,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t57,
                    children: [
                        "← ",
                        t58
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                    lineNumber: 560,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 560,
                columnNumber: 13
            }, this);
            $[126] = t58;
            $[127] = t13;
        } else {
            t13 = $[127];
        }
        let t59;
        let t60;
        if ($[128] === Symbol.for("react.memo_cache_sentinel")) {
            t59 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t60 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            };
            $[128] = t59;
            $[129] = t60;
        } else {
            t59 = $[128];
            t60 = $[129];
        }
        let t61;
        if ($[130] !== t) {
            t61 = t("Ch\u01B0\u01A1ng I \xB7 M\u1EC7nh \u0110\u1EC1 v\xE0 T\u1EADp H\u1EE3p", "Chapter I \xB7 Propositions and Sets");
            $[130] = t;
            $[131] = t61;
        } else {
            t61 = $[131];
        }
        let t62;
        if ($[132] !== t61) {
            t62 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t60,
                children: t61
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 599,
                columnNumber: 13
            }, this);
            $[132] = t61;
            $[133] = t62;
        } else {
            t62 = $[133];
        }
        let t63;
        if ($[134] === Symbol.for("react.memo_cache_sentinel")) {
            t63 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[134] = t63;
        } else {
            t63 = $[134];
        }
        let t64;
        if ($[135] !== t) {
            t64 = t("B\xE0i 2: T\u1EADp H\u1EE3p", "Lesson 2: Sets");
            $[135] = t;
            $[136] = t64;
        } else {
            t64 = $[136];
        }
        let t65;
        if ($[137] !== t64) {
            t65 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t63,
                children: t64
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 626,
                columnNumber: 13
            }, this);
            $[137] = t64;
            $[138] = t65;
        } else {
            t65 = $[138];
        }
        let t66;
        if ($[139] !== t62 || $[140] !== t65) {
            t66 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t62,
                    t65
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 634,
                columnNumber: 13
            }, this);
            $[139] = t62;
            $[140] = t65;
            $[141] = t66;
        } else {
            t66 = $[141];
        }
        let t67;
        let t68;
        if ($[142] === Symbol.for("react.memo_cache_sentinel")) {
            t67 = {
                display: "flex",
                gap: 10
            };
            t68 = ({
                "Lesson2_TapHop[<button>.onClick]": ()=>setLang("vi")
            })["Lesson2_TapHop[<button>.onClick]"];
            $[142] = t67;
            $[143] = t68;
        } else {
            t67 = $[142];
            t68 = $[143];
        }
        const t69 = lang === "vi" ? "black" : "#f9f9f9";
        const t70 = lang === "vi" ? "white" : "black";
        let t71;
        if ($[144] !== t69 || $[145] !== t70) {
            t71 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t68,
                style: {
                    background: t69,
                    color: t70,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 661,
                columnNumber: 13
            }, this);
            $[144] = t69;
            $[145] = t70;
            $[146] = t71;
        } else {
            t71 = $[146];
        }
        let t72;
        if ($[147] === Symbol.for("react.memo_cache_sentinel")) {
            t72 = ({
                "Lesson2_TapHop[<button>.onClick]": ()=>setLang("en")
            })["Lesson2_TapHop[<button>.onClick]"];
            $[147] = t72;
        } else {
            t72 = $[147];
        }
        const t73 = lang === "en" ? "black" : "#f9f9f9";
        const t74 = lang === "en" ? "white" : "black";
        let t75;
        if ($[148] !== t73 || $[149] !== t74) {
            t75 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t72,
                style: {
                    background: t73,
                    color: t74,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 690,
                columnNumber: 13
            }, this);
            $[148] = t73;
            $[149] = t74;
            $[150] = t75;
        } else {
            t75 = $[150];
        }
        let t76;
        if ($[151] !== t71 || $[152] !== t75) {
            t76 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t67,
                children: [
                    t71,
                    t75
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 708,
                columnNumber: 13
            }, this);
            $[151] = t71;
            $[152] = t75;
            $[153] = t76;
        } else {
            t76 = $[153];
        }
        if ($[154] !== t66 || $[155] !== t76) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t59,
                children: [
                    t66,
                    t76
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 716,
                columnNumber: 13
            }, this);
            $[154] = t66;
            $[155] = t76;
            $[156] = t14;
        } else {
            t14 = $[156];
        }
        let t77;
        let t78;
        if ($[157] === Symbol.for("react.memo_cache_sentinel")) {
            t77 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t78 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[157] = t77;
            $[158] = t78;
        } else {
            t77 = $[157];
            t78 = $[158];
        }
        let t79;
        if ($[159] !== t) {
            t79 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Learning Objectives");
            $[159] = t;
            $[160] = t79;
        } else {
            t79 = $[160];
        }
        let t80;
        if ($[161] !== t79) {
            t80 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t78,
                children: [
                    "🎯 ",
                    t79
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 754,
                columnNumber: 13
            }, this);
            $[161] = t79;
            $[162] = t80;
        } else {
            t80 = $[162];
        }
        let t81;
        if ($[163] !== t) {
            t81 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m t\u1EADp h\u1EE3p v\xE0 ph\u1EA7n t\u1EED.", "Understand the concept of a set and its elements.");
            $[163] = t;
            $[164] = t81;
        } else {
            t81 = $[164];
        }
        let t82;
        if ($[165] !== t) {
            t82 = t("Bi\u1EBFt c\xE1c c\xE1ch x\xE1c \u0111\u1ECBnh t\u1EADp h\u1EE3p (li\u1EC7t k\xEA v\xE0 t\xEDnh ch\u1EA5t \u0111\u1EB7c tr\u01B0ng).", "Know ways to define sets (listing and characteristic property).");
            $[165] = t;
            $[166] = t82;
        } else {
            t82 = $[166];
        }
        let t83;
        if ($[167] !== t) {
            t83 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m t\u1EADp con (A \u2282 B).", "Understand subsets (A \u2282 B).");
            $[167] = t;
            $[168] = t83;
        } else {
            t83 = $[168];
        }
        let t84;
        if ($[169] !== t) {
            t84 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m hai t\u1EADp h\u1EE3p b\u1EB1ng nhau.", "Understand equal sets.");
            $[169] = t;
            $[170] = t84;
        } else {
            t84 = $[170];
        }
        let t85;
        if ($[171] !== t) {
            t85 = t("Bi\u1EBFt t\u1EADp h\u1EE3p r\u1ED7ng \u2205 v\xE0 t\xEDnh ch\u1EA5t c\u1EE7a n\xF3.", "Know the empty set \u2205 and its properties.");
            $[171] = t;
            $[172] = t85;
        } else {
            t85 = $[172];
        }
        let t86;
        if ($[173] !== t81 || $[174] !== t82 || $[175] !== t83 || $[176] !== t84 || $[177] !== t85) {
            t86 = [
                t81,
                t82,
                t83,
                t84,
                t85
            ].map(_Lesson2_TapHopAnonymous);
            $[173] = t81;
            $[174] = t82;
            $[175] = t83;
            $[176] = t84;
            $[177] = t85;
            $[178] = t86;
        } else {
            t86 = $[178];
        }
        if ($[179] !== t80 || $[180] !== t86) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t77,
                children: [
                    t80,
                    t86
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 813,
                columnNumber: 13
            }, this);
            $[179] = t80;
            $[180] = t86;
            $[181] = t15;
        } else {
            t15 = $[181];
        }
        let t87;
        let t88;
        if ($[182] === Symbol.for("react.memo_cache_sentinel")) {
            t87 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t88 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[182] = t87;
            $[183] = t88;
        } else {
            t87 = $[182];
            t88 = $[183];
        }
        if ($[184] !== tabs) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t87,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t88,
                    children: tabs.map({
                        "Lesson2_TapHop[tabs.map()]": (t89)=>{
                            const [id_2, icon_0, label] = t89;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson2_TapHop[tabs.map() > <button>.onClick]": ()=>scrollTo(id_2)
                                }["Lesson2_TapHop[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson2_TapHopTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson2_TapHopTabsMapButtonOnMouseLeave,
                                children: [
                                    icon_0,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                lineNumber: 848,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson2_TapHop[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                    lineNumber: 845,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 845,
                columnNumber: 13
            }, this);
            $[184] = tabs;
            $[185] = t16;
        } else {
            t16 = $[185];
        }
        let t89;
        if ($[186] === Symbol.for("react.memo_cache_sentinel")) {
            t89 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[186] = t89;
        } else {
            t89 = $[186];
        }
        let t90;
        if ($[187] !== t) {
            t90 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[187] = t;
            $[188] = t90;
        } else {
            t90 = $[188];
        }
        let t91;
        if ($[189] !== t90) {
            t91 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDE80",
                title: t90
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 889,
                columnNumber: 13
            }, this);
            $[189] = t90;
            $[190] = t91;
        } else {
            t91 = $[190];
        }
        let t92;
        let t93;
        if ($[191] === Symbol.for("react.memo_cache_sentinel")) {
            t92 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t93 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8
            };
            $[191] = t92;
            $[192] = t93;
        } else {
            t92 = $[191];
            t93 = $[192];
        }
        let t94;
        if ($[193] !== t) {
            t94 = t("T\xECnh hu\u1ED1ng m\u1EDF \u0111\u1EA7u", "Opening Situation");
            $[193] = t;
            $[194] = t94;
        } else {
            t94 = $[194];
        }
        let t95;
        if ($[195] !== t94) {
            t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t93,
                children: t94
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 925,
                columnNumber: 13
            }, this);
            $[195] = t94;
            $[196] = t95;
        } else {
            t95 = $[196];
        }
        let t96;
        if ($[197] === Symbol.for("react.memo_cache_sentinel")) {
            t96 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[197] = t96;
        } else {
            t96 = $[197];
        }
        let t97;
        if ($[198] !== t) {
            t97 = t("Khi n\xF3i v\u1EC1 m\u1ED9t nh\xF3m v\u1EADt th\u1EC3 \u2014 v\xED d\u1EE5 \"c\xE1c s\u1ED1 t\u1EF1 nhi\xEAn nh\u1ECF h\u01A1n 10\" hay \"c\xE1c h\u1ECDc sinh trong l\u1EDBp\" \u2014 ta c\u1EA7n m\u1ED9t kh\xE1i ni\u1EC7m to\xE1n h\u1ECDc \u0111\u1EC3 bi\u1EC3u di\u1EC5n ch\xFAng. To\xE1n h\u1ECDc g\u1ECDi \u0111\xF3 l\xE0 t\u1EADp h\u1EE3p.", "When talking about a collection of objects \u2014 e.g. \"natural numbers less than 10\" or \"students in a class\" \u2014 we need a mathematical concept to represent them. Mathematics calls this a set.");
            $[198] = t;
            $[199] = t97;
        } else {
            t97 = $[199];
        }
        let t98;
        if ($[200] !== t97) {
            t98 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t96,
                children: t97
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 952,
                columnNumber: 13
            }, this);
            $[200] = t97;
            $[201] = t98;
        } else {
            t98 = $[201];
        }
        let t99;
        if ($[202] === Symbol.for("react.memo_cache_sentinel")) {
            t99 = {
                fontSize: 16
            };
            $[202] = t99;
        } else {
            t99 = $[202];
        }
        let t100;
        if ($[203] !== t) {
            t100 = t("H\xE3y k\u1EC3 t\xEAn 3 v\xED d\u1EE5 v\u1EC1 t\u1EADp h\u1EE3p trong cu\u1ED9c s\u1ED1ng h\u1EB1ng ng\xE0y.", "Name 3 examples of sets in everyday life.");
            $[203] = t;
            $[204] = t100;
        } else {
            t100 = $[204];
        }
        let t101;
        if ($[205] !== t100) {
            t101 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t99,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t100
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 977,
                        columnNumber: 33
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 977,
                columnNumber: 14
            }, this);
            $[205] = t100;
            $[206] = t101;
        } else {
            t101 = $[206];
        }
        let t102;
        if ($[207] !== t101 || $[208] !== t95 || $[209] !== t98) {
            t102 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t92,
                children: [
                    t95,
                    t98,
                    t101
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 985,
                columnNumber: 14
            }, this);
            $[207] = t101;
            $[208] = t95;
            $[209] = t98;
            $[210] = t102;
        } else {
            t102 = $[210];
        }
        if ($[211] !== t102 || $[212] !== t91) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khoiDong",
                style: t89,
                children: [
                    t91,
                    t102
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 994,
                columnNumber: 13
            }, this);
            $[211] = t102;
            $[212] = t91;
            $[213] = t17;
        } else {
            t17 = $[213];
        }
        let t103;
        if ($[214] === Symbol.for("react.memo_cache_sentinel")) {
            t103 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[214] = t103;
        } else {
            t103 = $[214];
        }
        let t104;
        if ($[215] !== t) {
            t104 = t("1. Kh\xE1i Ni\u1EC7m T\u1EADp H\u1EE3p", "1. Sets");
            $[215] = t;
            $[216] = t104;
        } else {
            t104 = $[216];
        }
        let t105;
        if ($[217] !== t104) {
            t105 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t104
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1021,
                columnNumber: 14
            }, this);
            $[217] = t104;
            $[218] = t105;
        } else {
            t105 = $[218];
        }
        let t106;
        let t107;
        let t108;
        if ($[219] === Symbol.for("react.memo_cache_sentinel")) {
            t106 = {
                display: "grid",
                gap: 24
            };
            t107 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t108 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[219] = t106;
            $[220] = t107;
            $[221] = t108;
        } else {
            t106 = $[219];
            t107 = $[220];
            t108 = $[221];
        }
        let t109;
        if ($[222] !== t) {
            t109 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[222] = t;
            $[223] = t109;
        } else {
            t109 = $[223];
        }
        let t110;
        if ($[224] !== t109) {
            t110 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t108,
                children: [
                    "📌 ",
                    t109
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1065,
                columnNumber: 14
            }, this);
            $[224] = t109;
            $[225] = t110;
        } else {
            t110 = $[225];
        }
        let t111;
        if ($[226] === Symbol.for("react.memo_cache_sentinel")) {
            t111 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[226] = t111;
        } else {
            t111 = $[226];
        }
        let t112;
        if ($[227] !== t) {
            t112 = t("T\u1EADp h\u1EE3p l\xE0 m\u1ED9t nh\xF3m c\xE1c \u0111\u1ED1i t\u01B0\u1EE3ng, m\u1ED7i \u0111\u1ED1i t\u01B0\u1EE3ng g\u1ECDi l\xE0 ph\u1EA7n t\u1EED. T\u1EADp h\u1EE3p \u0111\u01B0\u1EE3c k\xFD hi\u1EC7u b\u1EB1ng ch\u1EEF in hoa, ph\u1EA7n t\u1EED \u0111\u01B0\u1EE3c li\u1EC7t k\xEA trong d\u1EA5u ngo\u1EB7c nh\u1ECDn { }.", "A set is a collection of objects; each object is an element. Sets are denoted by uppercase letters; elements are listed inside curly braces { }.");
            $[227] = t;
            $[228] = t112;
        } else {
            t112 = $[228];
        }
        let t113;
        if ($[229] !== t112) {
            t113 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t111,
                children: t112
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1091,
                columnNumber: 14
            }, this);
            $[229] = t112;
            $[230] = t113;
        } else {
            t113 = $[230];
        }
        let t114;
        if ($[231] === Symbol.for("react.memo_cache_sentinel")) {
            t114 = {
                color: "#777",
                fontSize: 15,
                marginTop: 10
            };
            $[231] = t114;
        } else {
            t114 = $[231];
        }
        let t115;
        if ($[232] !== t) {
            t115 = t("N\u1EBFu a l\xE0 ph\u1EA7n t\u1EED c\u1EE7a A: a \u2208 A. N\u1EBFu kh\xF4ng: a \u2209 A.", "If a is an element of A: a \u2208 A. Otherwise: a \u2209 A.");
            $[232] = t;
            $[233] = t115;
        } else {
            t115 = $[233];
        }
        let t116;
        if ($[234] !== t115) {
            t116 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t114,
                children: [
                    "💡 ",
                    t115
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1118,
                columnNumber: 14
            }, this);
            $[234] = t115;
            $[235] = t116;
        } else {
            t116 = $[235];
        }
        let t117;
        if ($[236] !== t110 || $[237] !== t113 || $[238] !== t116) {
            t117 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t107,
                children: [
                    t110,
                    t113,
                    t116
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1126,
                columnNumber: 14
            }, this);
            $[236] = t110;
            $[237] = t113;
            $[238] = t116;
            $[239] = t117;
        } else {
            t117 = $[239];
        }
        let t118;
        if ($[240] === Symbol.for("react.memo_cache_sentinel")) {
            t118 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[240] = t118;
        } else {
            t118 = $[240];
        }
        let t119;
        if ($[241] !== t) {
            t119 = t("Hai c\xE1ch x\xE1c \u0111\u1ECBnh t\u1EADp h\u1EE3p", "Two ways to define a set");
            $[241] = t;
            $[242] = t119;
        } else {
            t119 = $[242];
        }
        let t120;
        if ($[243] !== t119) {
            t120 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t118,
                children: t119
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1155,
                columnNumber: 14
            }, this);
            $[243] = t119;
            $[244] = t120;
        } else {
            t120 = $[244];
        }
        let t121;
        if ($[245] === Symbol.for("react.memo_cache_sentinel")) {
            t121 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[245] = t121;
        } else {
            t121 = $[245];
        }
        let t122;
        if ($[246] !== t) {
            t122 = t("\u2460 Li\u1EC7t k\xEA ph\u1EA7n t\u1EED", "\u2460 Listing elements");
            $[246] = t;
            $[247] = t122;
        } else {
            t122 = $[247];
        }
        let t123;
        if ($[248] !== t) {
            t123 = t("Li\u1EC7t k\xEA h\u1EBFt c\xE1c ph\u1EA7n t\u1EED, ng\u0103n c\xE1ch b\u1EDFi d\u1EA5u ph\u1EA9y.", "List all elements separated by commas.");
            $[248] = t;
            $[249] = t123;
        } else {
            t123 = $[249];
        }
        let t124;
        if ($[250] !== t122 || $[251] !== t123) {
            t124 = {
                method: t122,
                example: "A = {1, 2, 3, 4, 5}",
                note: t123
            };
            $[250] = t122;
            $[251] = t123;
            $[252] = t124;
        } else {
            t124 = $[252];
        }
        let t125;
        if ($[253] !== t) {
            t125 = t("\u2461 T\xEDnh ch\u1EA5t \u0111\u1EB7c tr\u01B0ng", "\u2461 Characteristic property");
            $[253] = t;
            $[254] = t125;
        } else {
            t125 = $[254];
        }
        let t126;
        if ($[255] !== t) {
            t126 = t("D\xF9ng \u0111i\u1EC1u ki\u1EC7n \u0111\u1EC3 x\xE1c \u0111\u1ECBnh ph\u1EA7n t\u1EED thu\u1ED9c t\u1EADp h\u1EE3p.", "Use a condition to define which elements belong.");
            $[255] = t;
            $[256] = t126;
        } else {
            t126 = $[256];
        }
        let t127;
        if ($[257] !== t125 || $[258] !== t126) {
            t127 = {
                method: t125,
                example: "B = {x \u2208 \u2115 | x \u2264 5}",
                note: t126
            };
            $[257] = t125;
            $[258] = t126;
            $[259] = t127;
        } else {
            t127 = $[259];
        }
        let t128;
        if ($[260] !== t124 || $[261] !== t127) {
            t128 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t121,
                children: [
                    t124,
                    t127
                ].map(_Lesson2_TapHopAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1233,
                columnNumber: 14
            }, this);
            $[260] = t124;
            $[261] = t127;
            $[262] = t128;
        } else {
            t128 = $[262];
        }
        let t129;
        if ($[263] !== t120 || $[264] !== t128) {
            t129 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                children: [
                    t120,
                    t128
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1242,
                columnNumber: 14
            }, this);
            $[263] = t120;
            $[264] = t128;
            $[265] = t129;
        } else {
            t129 = $[265];
        }
        let t130;
        let t131;
        if ($[266] === Symbol.for("react.memo_cache_sentinel")) {
            t130 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t131 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[266] = t130;
            $[267] = t131;
        } else {
            t130 = $[266];
            t131 = $[267];
        }
        let t132;
        if ($[268] !== t) {
            t132 = t("T\u1EADp h\u1EE3p r\u1ED7ng", "The Empty Set");
            $[268] = t;
            $[269] = t132;
        } else {
            t132 = $[269];
        }
        let t133;
        if ($[270] !== t132) {
            t133 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t131,
                children: [
                    "∅ — ",
                    t132
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1279,
                columnNumber: 14
            }, this);
            $[270] = t132;
            $[271] = t133;
        } else {
            t133 = $[271];
        }
        let t134;
        if ($[272] === Symbol.for("react.memo_cache_sentinel")) {
            t134 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[272] = t134;
        } else {
            t134 = $[272];
        }
        let t135;
        if ($[273] !== t) {
            t135 = t("T\u1EADp h\u1EE3p kh\xF4ng c\xF3 ph\u1EA7n t\u1EED n\xE0o g\u1ECDi l\xE0 t\u1EADp h\u1EE3p r\u1ED7ng, k\xFD hi\u1EC7u \u2205 ho\u1EB7c {}.", "A set with no elements is called the empty set, denoted \u2205 or {}.");
            $[273] = t;
            $[274] = t135;
        } else {
            t135 = $[274];
        }
        let t136;
        if ($[275] !== t135) {
            t136 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t134,
                children: t135
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1305,
                columnNumber: 14
            }, this);
            $[275] = t135;
            $[276] = t136;
        } else {
            t136 = $[276];
        }
        let t137;
        if ($[277] === Symbol.for("react.memo_cache_sentinel")) {
            t137 = {
                marginTop: 12,
                display: "flex",
                gap: 16,
                flexWrap: "wrap"
            };
            $[277] = t137;
        } else {
            t137 = $[277];
        }
        let t138;
        if ($[278] !== t) {
            t138 = t("\u2205 l\xE0 t\u1EADp con c\u1EE7a m\u1ECDi t\u1EADp h\u1EE3p", "\u2205 is a subset of every set");
            $[278] = t;
            $[279] = t138;
        } else {
            t138 = $[279];
        }
        let t139;
        if ($[280] !== t) {
            t139 = t("\u2205 \u2260 {0} (t\u1EADp {0} c\xF3 m\u1ED9t ph\u1EA7n t\u1EED)", "\u2205 \u2260 {0} (the set {0} has one element)");
            $[280] = t;
            $[281] = t139;
        } else {
            t139 = $[281];
        }
        let t140;
        if ($[282] !== t138 || $[283] !== t139) {
            t140 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t137,
                children: [
                    t138,
                    t139
                ].map(_Lesson2_TapHopAnonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1341,
                columnNumber: 14
            }, this);
            $[282] = t138;
            $[283] = t139;
            $[284] = t140;
        } else {
            t140 = $[284];
        }
        let t141;
        if ($[285] !== t133 || $[286] !== t136 || $[287] !== t140) {
            t141 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t130,
                children: [
                    t133,
                    t136,
                    t140
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1350,
                columnNumber: 14
            }, this);
            $[285] = t133;
            $[286] = t136;
            $[287] = t140;
            $[288] = t141;
        } else {
            t141 = $[288];
        }
        let t142;
        if ($[289] !== t117 || $[290] !== t129 || $[291] !== t141) {
            t142 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ora",
                style: t106,
                children: [
                    t117,
                    t129,
                    t141
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1360,
                columnNumber: 14
            }, this);
            $[289] = t117;
            $[290] = t129;
            $[291] = t141;
            $[292] = t142;
        } else {
            t142 = $[292];
        }
        if ($[293] !== t105 || $[294] !== t142) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai1",
                style: t103,
                children: [
                    t105,
                    t142
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1369,
                columnNumber: 13
            }, this);
            $[293] = t105;
            $[294] = t142;
            $[295] = t18;
        } else {
            t18 = $[295];
        }
        let t143;
        if ($[296] === Symbol.for("react.memo_cache_sentinel")) {
            t143 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[296] = t143;
        } else {
            t143 = $[296];
        }
        let t144;
        if ($[297] !== t) {
            t144 = t("2. T\u1EADp Con (A \u2282 B)", "2. Subsets (A \u2282 B)");
            $[297] = t;
            $[298] = t144;
        } else {
            t144 = $[298];
        }
        let t145;
        if ($[299] !== t144) {
            t145 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t144
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1396,
                columnNumber: 14
            }, this);
            $[299] = t144;
            $[300] = t145;
        } else {
            t145 = $[300];
        }
        let t146;
        let t147;
        if ($[301] === Symbol.for("react.memo_cache_sentinel")) {
            t146 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t147 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[301] = t146;
            $[302] = t147;
        } else {
            t146 = $[301];
            t147 = $[302];
        }
        let t148;
        if ($[303] !== t) {
            t148 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[303] = t;
            $[304] = t148;
        } else {
            t148 = $[304];
        }
        let t149;
        if ($[305] !== t148) {
            t149 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t147,
                children: [
                    "📌 ",
                    t148
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1434,
                columnNumber: 14
            }, this);
            $[305] = t148;
            $[306] = t149;
        } else {
            t149 = $[306];
        }
        let t150;
        if ($[307] === Symbol.for("react.memo_cache_sentinel")) {
            t150 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[307] = t150;
        } else {
            t150 = $[307];
        }
        let t151;
        if ($[308] !== t) {
            t151 = t("A l\xE0 t\u1EADp con c\u1EE7a B (A \u2282 B) khi m\u1ECDi ph\u1EA7n t\u1EED c\u1EE7a A \u0111\u1EC1u l\xE0 ph\u1EA7n t\u1EED c\u1EE7a B.", "A is a subset of B (A \u2282 B) when every element of A is also an element of B.");
            $[308] = t;
            $[309] = t151;
        } else {
            t151 = $[309];
        }
        let t152;
        if ($[310] !== t151) {
            t152 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t150,
                children: t151
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1460,
                columnNumber: 14
            }, this);
            $[310] = t151;
            $[311] = t152;
        } else {
            t152 = $[311];
        }
        let t153;
        if ($[312] === Symbol.for("react.memo_cache_sentinel")) {
            t153 = {
                color: "#777",
                fontSize: 15,
                marginTop: 10
            };
            $[312] = t153;
        } else {
            t153 = $[312];
        }
        let t154;
        if ($[313] !== t) {
            t154 = t("A \u2284 B khi t\u1ED3n t\u1EA1i \xEDt nh\u1EA5t m\u1ED9t ph\u1EA7n t\u1EED c\u1EE7a A kh\xF4ng thu\u1ED9c B.", "A \u2284 B when at least one element of A does not belong to B.");
            $[313] = t;
            $[314] = t154;
        } else {
            t154 = $[314];
        }
        let t155;
        if ($[315] !== t154) {
            t155 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t153,
                children: [
                    "💡 ",
                    t154
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1487,
                columnNumber: 14
            }, this);
            $[315] = t154;
            $[316] = t155;
        } else {
            t155 = $[316];
        }
        let t156;
        if ($[317] !== t149 || $[318] !== t152 || $[319] !== t155) {
            t156 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t146,
                children: [
                    t149,
                    t152,
                    t155
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1495,
                columnNumber: 14
            }, this);
            $[317] = t149;
            $[318] = t152;
            $[319] = t155;
            $[320] = t156;
        } else {
            t156 = $[320];
        }
        let t157;
        let t158;
        if ($[321] === Symbol.for("react.memo_cache_sentinel")) {
            t157 = {
                marginBottom: 24,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t158 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[321] = t157;
            $[322] = t158;
        } else {
            t157 = $[321];
            t158 = $[322];
        }
        let t159;
        if ($[323] !== t) {
            t159 = t("S\u1ED1 t\u1EADp con c\u1EE7a t\u1EADp n ph\u1EA7n t\u1EED", "Number of subsets of an n-element set");
            $[323] = t;
            $[324] = t159;
        } else {
            t159 = $[324];
        }
        let t160;
        if ($[325] !== t159) {
            t160 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t158,
                children: t159
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1534,
                columnNumber: 14
            }, this);
            $[325] = t159;
            $[326] = t160;
        } else {
            t160 = $[326];
        }
        let t161;
        if ($[327] === Symbol.for("react.memo_cache_sentinel")) {
            t161 = {
                fontFamily: "monospace",
                fontSize: 22,
                color: "#0B4F5C",
                textAlign: "center",
                padding: "12px 0"
            };
            $[327] = t161;
        } else {
            t161 = $[327];
        }
        let t162;
        if ($[328] !== t) {
            t162 = t("s\u1ED1 t\u1EADp con", "subsets");
            $[328] = t;
            $[329] = t162;
        } else {
            t162 = $[329];
        }
        let t163;
        if ($[330] !== t162) {
            t163 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t161,
                children: [
                    "|A| = n → ",
                    t162,
                    " = 2ⁿ"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1563,
                columnNumber: 14
            }, this);
            $[330] = t162;
            $[331] = t163;
        } else {
            t163 = $[331];
        }
        let t164;
        if ($[332] === Symbol.for("react.memo_cache_sentinel")) {
            t164 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: {
                    display: "flex",
                    gap: 24,
                    flexWrap: "wrap",
                    marginTop: 16,
                    transition: "all 0.3s ease"
                },
                children: [
                    [
                        "A = {a}",
                        1,
                        2,
                        [
                            "{}",
                            "{a}"
                        ]
                    ],
                    [
                        "A = {a,b}",
                        2,
                        4,
                        [
                            "{}",
                            "{a}",
                            "{b}",
                            "{a,b}"
                        ]
                    ],
                    [
                        "A = {a,b,c}",
                        3,
                        8,
                        [
                            "...",
                            "8 t\u1EADp con"
                        ]
                    ]
                ].map(_Lesson2_TapHopAnonymous4)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1571,
                columnNumber: 14
            }, this);
            $[332] = t164;
        } else {
            t164 = $[332];
        }
        let t165;
        if ($[333] !== t160 || $[334] !== t163) {
            t165 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t157,
                children: [
                    t160,
                    t163,
                    t164
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1584,
                columnNumber: 14
            }, this);
            $[333] = t160;
            $[334] = t163;
            $[335] = t165;
        } else {
            t165 = $[335];
        }
        if ($[336] !== t145 || $[337] !== t156 || $[338] !== t165) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai2",
                style: t143,
                children: [
                    t145,
                    t156,
                    t165
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1592,
                columnNumber: 13
            }, this);
            $[336] = t145;
            $[337] = t156;
            $[338] = t165;
            $[339] = t19;
        } else {
            t19 = $[339];
        }
        let t166;
        if ($[340] === Symbol.for("react.memo_cache_sentinel")) {
            t166 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[340] = t166;
        } else {
            t166 = $[340];
        }
        let t167;
        if ($[341] !== t) {
            t167 = t("3. Hai T\u1EADp H\u1EE3p B\u1EB1ng Nhau", "3. Equal Sets");
            $[341] = t;
            $[342] = t167;
        } else {
            t167 = $[342];
        }
        let t168;
        if ($[343] !== t167) {
            t168 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t167
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1620,
                columnNumber: 14
            }, this);
            $[343] = t167;
            $[344] = t168;
        } else {
            t168 = $[344];
        }
        let t169;
        let t170;
        if ($[345] === Symbol.for("react.memo_cache_sentinel")) {
            t169 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t170 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[345] = t169;
            $[346] = t170;
        } else {
            t169 = $[345];
            t170 = $[346];
        }
        let t171;
        if ($[347] !== t) {
            t171 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[347] = t;
            $[348] = t171;
        } else {
            t171 = $[348];
        }
        let t172;
        if ($[349] !== t171) {
            t172 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t170,
                children: [
                    "📌 ",
                    t171
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1658,
                columnNumber: 14
            }, this);
            $[349] = t171;
            $[350] = t172;
        } else {
            t172 = $[350];
        }
        let t173;
        if ($[351] === Symbol.for("react.memo_cache_sentinel")) {
            t173 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[351] = t173;
        } else {
            t173 = $[351];
        }
        let t174;
        if ($[352] !== t) {
            t174 = t("A = B khi v\xE0 ch\u1EC9 khi A \u2282 B v\xE0 B \u2282 A, t\u1EE9c l\xE0 hai t\u1EADp c\xF3 c\xF9ng t\u1EADp ph\u1EA7n t\u1EED.", "A = B if and only if A \u2282 B and B \u2282 A, meaning both sets contain exactly the same elements.");
            $[352] = t;
            $[353] = t174;
        } else {
            t174 = $[353];
        }
        let t175;
        if ($[354] !== t174) {
            t175 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t173,
                children: t174
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1684,
                columnNumber: 14
            }, this);
            $[354] = t174;
            $[355] = t175;
        } else {
            t175 = $[355];
        }
        let t176;
        if ($[356] === Symbol.for("react.memo_cache_sentinel")) {
            t176 = {
                color: "#777",
                fontSize: 15,
                marginTop: 10
            };
            $[356] = t176;
        } else {
            t176 = $[356];
        }
        let t177;
        if ($[357] !== t) {
            t177 = t("Th\u1EE9 t\u1EF1 li\u1EC7t k\xEA v\xE0 s\u1ED1 l\u1EA7n l\u1EB7p ph\u1EA7n t\u1EED kh\xF4ng \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn t\u1EADp h\u1EE3p.", "The order of listing and repetition of elements do not affect the set.");
            $[357] = t;
            $[358] = t177;
        } else {
            t177 = $[358];
        }
        let t178;
        if ($[359] !== t177) {
            t178 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t176,
                children: [
                    "💡 ",
                    t177
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1711,
                columnNumber: 14
            }, this);
            $[359] = t177;
            $[360] = t178;
        } else {
            t178 = $[360];
        }
        let t179;
        if ($[361] !== t172 || $[362] !== t175 || $[363] !== t178) {
            t179 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t169,
                children: [
                    t172,
                    t175,
                    t178
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1719,
                columnNumber: 14
            }, this);
            $[361] = t172;
            $[362] = t175;
            $[363] = t178;
            $[364] = t179;
        } else {
            t179 = $[364];
        }
        let t180;
        if ($[365] === Symbol.for("react.memo_cache_sentinel")) {
            t180 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[365] = t180;
        } else {
            t180 = $[365];
        }
        let t181;
        if ($[366] !== t) {
            t181 = t("C\xF9ng ph\u1EA7n t\u1EED, kh\xE1c th\u1EE9 t\u1EF1 \u2192 b\u1EB1ng nhau", "Same elements, different order \u2192 equal");
            $[366] = t;
            $[367] = t181;
        } else {
            t181 = $[367];
        }
        let t182;
        if ($[368] !== t181) {
            t182 = {
                a: "{1, 2, 3}",
                b: "{3, 1, 2}",
                eq: true,
                reason: t181
            };
            $[368] = t181;
            $[369] = t182;
        } else {
            t182 = $[369];
        }
        let t183;
        if ($[370] !== t) {
            t183 = t("Ph\u1EA7n t\u1EED l\u1EB7p kh\xF4ng t\xEDnh \u2192 b\u1EB1ng nhau", "Repeated element counted once \u2192 equal");
            $[370] = t;
            $[371] = t183;
        } else {
            t183 = $[371];
        }
        let t184;
        if ($[372] !== t183) {
            t184 = {
                a: "{1, 1, 2}",
                b: "{1, 2}",
                eq: true,
                reason: t183
            };
            $[372] = t183;
            $[373] = t184;
        } else {
            t184 = $[373];
        }
        let t185;
        if ($[374] !== t) {
            t185 = t("A c\xF3 ph\u1EA7n t\u1EED 3 m\xE0 B kh\xF4ng c\xF3 \u2192 kh\xE1c nhau", "A has element 3 that B does not \u2192 not equal");
            $[374] = t;
            $[375] = t185;
        } else {
            t185 = $[375];
        }
        let t186;
        if ($[376] !== t185) {
            t186 = {
                a: "{1, 2, 3}",
                b: "{1, 2}",
                eq: false,
                reason: t185
            };
            $[376] = t185;
            $[377] = t186;
        } else {
            t186 = $[377];
        }
        let t187;
        if ($[378] !== t182 || $[379] !== t184 || $[380] !== t186) {
            t187 = [
                t182,
                t184,
                t186
            ];
            $[378] = t182;
            $[379] = t184;
            $[380] = t186;
            $[381] = t187;
        } else {
            t187 = $[381];
        }
        let t188;
        if ($[382] !== t || $[383] !== t187) {
            t188 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t180,
                children: t187.map({
                    "Lesson2_TapHop[(anonymous)()]": (ex, i_8)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            style: {
                                padding: 20,
                                borderRadius: 10,
                                background: "#f9f9f9",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: "monospace",
                                        fontSize: 16,
                                        marginBottom: 8
                                    },
                                    children: [
                                        ex.a,
                                        " ",
                                        ex.eq ? "=" : "\u2260",
                                        " ",
                                        ex.b
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 1820,
                                    columnNumber: 14
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 12,
                                        fontWeight: 700,
                                        background: ex.eq ? "#eafaf1" : "#fdf2f2",
                                        color: ex.eq ? "#1e8449" : "#922b21",
                                        padding: "2px 10px",
                                        borderRadius: 20
                                    },
                                    children: ex.eq ? t("B\u1EB0NG NHAU", "EQUAL") : t("KH\xC1C NHAU", "NOT EQUAL")
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 1824,
                                    columnNumber: 60
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        color: "#777",
                                        marginTop: 8,
                                        fontStyle: "italic"
                                    },
                                    children: ex.reason
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 1831,
                                    columnNumber: 94
                                }, this)
                            ]
                        }, i_8, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 1815,
                            columnNumber: 57
                        }, this)
                }["Lesson2_TapHop[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1814,
                columnNumber: 14
            }, this);
            $[382] = t;
            $[383] = t187;
            $[384] = t188;
        } else {
            t188 = $[384];
        }
        if ($[385] !== t168 || $[386] !== t179 || $[387] !== t188) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai3",
                style: t166,
                children: [
                    t168,
                    t179,
                    t188
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1845,
                columnNumber: 13
            }, this);
            $[385] = t168;
            $[386] = t179;
            $[387] = t188;
            $[388] = t20;
        } else {
            t20 = $[388];
        }
        let t189;
        if ($[389] === Symbol.for("react.memo_cache_sentinel")) {
            t189 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[389] = t189;
        } else {
            t189 = $[389];
        }
        let t190;
        if ($[390] !== t) {
            t190 = t("Th\u1EF1c H\xE0nh", "Practice Exercises");
            $[390] = t;
            $[391] = t190;
        } else {
            t190 = $[391];
        }
        let t191;
        if ($[392] !== t190) {
            t191 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\u270F\uFE0F",
                title: t190
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1873,
                columnNumber: 14
            }, this);
            $[392] = t190;
            $[393] = t191;
        } else {
            t191 = $[393];
        }
        let t192;
        if ($[394] === Symbol.for("react.memo_cache_sentinel")) {
            t192 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 40,
                transition: "all 0.3s ease"
            };
            $[394] = t192;
        } else {
            t192 = $[394];
        }
        let t193;
        if ($[395] !== revealedAnswers || $[396] !== t) {
            t193 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t192,
                children: [
                    {
                        id: "e1",
                        q: t("Vi\u1EBFt l\u1EA1i c\xE1c t\u1EADp h\u1EE3p sau b\u1EB1ng c\xE1ch li\u1EC7t k\xEA ph\u1EA7n t\u1EED:\n(a) A = {x \u2208 \u2115 | x \u2264 4}\n(b) B = {x \u2208 \u2124 | -2 \u2264 x \u2264 2}", "Rewrite by listing elements:\n(a) A = {x \u2208 \u2115 | x \u2264 4}\n(b) B = {x \u2208 \u2124 | -2 \u2264 x \u2264 2}"),
                        a: [
                            "(a) A = {0, 1, 2, 3, 4}",
                            "(b) B = {-2, -1, 0, 1, 2}"
                        ]
                    },
                    {
                        id: "e2",
                        q: t("Cho A = {1, 2, 3}. Li\u1EC7t k\xEA t\u1EA5t c\u1EA3 c\xE1c t\u1EADp con c\u1EE7a A.", "For A = {1, 2, 3}, list all subsets of A."),
                        a: [
                            t("\u2205, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3} \u2014 t\u1ED5ng c\u1ED9ng 2\xB3 = 8 t\u1EADp con.", "\u2205, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3} \u2014 total 2\xB3 = 8 subsets.")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("Cho A = {1, 2, 4}, B = {x \u2208 \u2115 | x l\xE0 \u01B0\u1EDBc c\u1EE7a 4}.\nA v\xE0 B c\xF3 b\u1EB1ng nhau kh\xF4ng?", "Let A = {1, 2, 4}, B = {x \u2208 \u2115 | x is a divisor of 4}.\nAre A and B equal?"),
                        a: [
                            t("B = {1, 2, 4} (\u01B0\u1EDBc c\u1EE7a 4 l\xE0 1, 2, 4)", "B = {1, 2, 4} (divisors of 4 are 1, 2, 4)"),
                            t("A = {1,2,4} = B \u2192 A = B \u2713", "A = {1,2,4} = B \u2192 A = B \u2713")
                        ]
                    }
                ].map({
                    "Lesson2_TapHop[(anonymous)()]": (t194)=>{
                        const { id: id_3, q: q_0, a } = t194;
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 1917,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14
                                            },
                                            children: t("To\xE1n 10", "Grade 10")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 1921,
                                            columnNumber: 63
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                marginTop: 10,
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: q_0
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 1924,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 1912,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson2_TapHop[(anonymous)() > <button>.onClick]": ()=>toggleAnswer(id_3)
                                    }["Lesson2_TapHop[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 1929,
                                    columnNumber: 37
                                }, this),
                                revealedAnswers[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a.map(_Lesson2_TapHopAnonymousAMap)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 1942,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 1912,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson2_TapHop[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1893,
                columnNumber: 14
            }, this);
            $[395] = revealedAnswers;
            $[396] = t;
            $[397] = t193;
        } else {
            t193 = $[397];
        }
        if ($[398] !== t191 || $[399] !== t193) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "thucHanh",
                style: t189,
                children: [
                    t191,
                    t193
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1956,
                columnNumber: 13
            }, this);
            $[398] = t191;
            $[399] = t193;
            $[400] = t21;
        } else {
            t21 = $[400];
        }
        t5 = "miniGame";
        if ($[401] === Symbol.for("react.memo_cache_sentinel")) {
            t6 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[401] = t6;
        } else {
            t6 = $[401];
        }
        let t194;
        if ($[402] !== t) {
            t194 = t("Mini Game", "Mini Game");
            $[402] = t;
            $[403] = t194;
        } else {
            t194 = $[403];
        }
        if ($[404] !== t194) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83C\uDFAE",
                title: t194
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 1982,
                columnNumber: 12
            }, this);
            $[404] = t194;
            $[405] = t7;
        } else {
            t7 = $[405];
        }
        let t195;
        if ($[406] === Symbol.for("react.memo_cache_sentinel")) {
            t195 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s ease"
            };
            $[406] = t195;
        } else {
            t195 = $[406];
        }
        let t196;
        if ($[407] !== t) {
            t196 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[407] = t;
            $[408] = t196;
        } else {
            t196 = $[408];
        }
        let t197;
        if ($[409] !== t) {
            t197 = t("5 c\xE2u h\u1ECFi", "5 questions");
            $[409] = t;
            $[410] = t197;
        } else {
            t197 = $[410];
        }
        let t198;
        if ($[411] !== t196 || $[412] !== t197) {
            t198 = [
                "mc",
                "\uD83E\uDDE9",
                t196,
                t197
            ];
            $[411] = t196;
            $[412] = t197;
            $[413] = t198;
        } else {
            t198 = $[413];
        }
        let t199;
        if ($[414] !== t) {
            t199 = t("\u0110\xFAng / Sai", "True / False");
            $[414] = t;
            $[415] = t199;
        } else {
            t199 = $[415];
        }
        let t200;
        if ($[416] !== t) {
            t200 = t("5 th\u1EBB", "5 cards");
            $[416] = t;
            $[417] = t200;
        } else {
            t200 = $[417];
        }
        let t201;
        if ($[418] !== t199 || $[419] !== t200) {
            t201 = [
                "tf",
                "\uD83C\uDCCF",
                t199,
                t200
            ];
            $[418] = t199;
            $[419] = t200;
            $[420] = t201;
        } else {
            t201 = $[420];
        }
        let t202;
        if ($[421] !== t) {
            t202 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[421] = t;
            $[422] = t202;
        } else {
            t202 = $[422];
        }
        let t203;
        if ($[423] !== t) {
            t203 = t("3 c\xE2u", "3 items");
            $[423] = t;
            $[424] = t203;
        } else {
            t203 = $[424];
        }
        let t204;
        if ($[425] !== t202 || $[426] !== t203) {
            t204 = [
                "fill",
                "\u270D\uFE0F",
                t202,
                t203
            ];
            $[425] = t202;
            $[426] = t203;
            $[427] = t204;
        } else {
            t204 = $[427];
        }
        let t205;
        if ($[428] !== t198 || $[429] !== t201 || $[430] !== t204) {
            t205 = [
                t198,
                t201,
                t204
            ];
            $[428] = t198;
            $[429] = t201;
            $[430] = t204;
            $[431] = t205;
        } else {
            t205 = $[431];
        }
        if ($[432] !== gameMode || $[433] !== t205) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t195,
                children: t205.map({
                    "Lesson2_TapHop[(anonymous)()]": (t206)=>{
                        const [mode, icon_1, label_1, sub] = t206;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson2_TapHop[(anonymous)() > <article>.onClick]": ()=>setGameMode(mode)
                            }["Lesson2_TapHop[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2099,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_1
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2102,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2105,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2090,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson2_TapHop[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2087,
                columnNumber: 12
            }, this);
            $[432] = gameMode;
            $[433] = t205;
            $[434] = t8;
        } else {
            t8 = $[434];
        }
        t9 = gameMode === "mc" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 2122,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 2126,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQuestions[mcIndex].options.map({
                            "Lesson2_TapHop[(anonymous)()]": (opt, i_10)=>{
                                let bg = "white";
                                let color = "black";
                                if (mcSelected !== null) {
                                    if (i_10 === mcQuestions[mcIndex].answer) {
                                        bg = "#eafaf1";
                                        color = "#1e8449";
                                    } else {
                                        if (i_10 === mcSelected) {
                                            bg = "#fdf2f2";
                                            color = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson2_TapHop[(anonymous)() > <button>.onClick]": ()=>handleMcSelect(i_10)
                                    }["Lesson2_TapHop[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color,
                                        fontSize: 15,
                                        fontWeight: mcSelected !== null && (i_10 === mcSelected || i_10 === mcQuestions[mcIndex].answer) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "all 0.15s"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_10),
                                        ". ",
                                        opt
                                    ]
                                }, i_10, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2149,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson2_TapHop[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 2130,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                lineNumber: 2165,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                lineNumber: 2173,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 2186,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 2191,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                        lineNumber: 2195,
                        columnNumber: 271
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2183,
                columnNumber: 157
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2117,
            columnNumber: 31
        }, this);
        if ($[435] !== gameMode || $[436] !== handleTfAnswer || $[437] !== handleTfNext || $[438] !== t || $[439] !== tfCards || $[440] !== tfDone || $[441] !== tfFlipped || $[442] !== tfIndex || $[443] !== tfScore) {
            t10 = gameMode === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2210,
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2221,
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
                                                "Lesson2_TapHop[<button>.onClick]": ()=>handleTfAnswer(true)
                                            }["Lesson2_TapHop[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 2229,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "Lesson2_TapHop[<button>.onClick]": ()=>handleTfAnswer(false)
                                            }["Lesson2_TapHop[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 2240,
                                            columnNumber: 56
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2225,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 2251,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 2260,
                                            columnNumber: 53
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2214,
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2272,
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2277,
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2281,
                            columnNumber: 188
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                    lineNumber: 2269,
                    columnNumber: 169
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2205,
                columnNumber: 34
            }, this);
            $[435] = gameMode;
            $[436] = handleTfAnswer;
            $[437] = handleTfNext;
            $[438] = t;
            $[439] = tfCards;
            $[440] = tfDone;
            $[441] = tfFlipped;
            $[442] = tfIndex;
            $[443] = tfScore;
            $[444] = t10;
        } else {
            t10 = $[444];
        }
        t11 = gameMode === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                    lineNumber: 2308,
                    columnNumber: 8
                }, this),
                fillQuestions.map({
                    "Lesson2_TapHop[fillQuestions.map()]": (q_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    children: q_1.template
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2315,
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
                                            value: fillAnswers[q_1.id] || "",
                                            onChange: {
                                                "Lesson2_TapHop[fillQuestions.map() > <input>.onChange]": (e_1)=>setFillAnswers({
                                                        "Lesson2_TapHop[fillQuestions.map() > <input>.onChange > setFillAnswers()]": (p_0)=>({
                                                                ...p_0,
                                                                [q_1.id]: e_1.target.value
                                                            })
                                                    }["Lesson2_TapHop[fillQuestions.map() > <input>.onChange > setFillAnswers()]"])
                                            }["Lesson2_TapHop[fillQuestions.map() > <input>.onChange]"],
                                            placeholder: t("Nh\u1EADp \u0111\xE1p \xE1n...", "Enter answer..."),
                                            style: {
                                                flex: 1,
                                                padding: "12px 16px",
                                                borderRadius: 8,
                                                fontSize: 15,
                                                outline: "none",
                                                border: fillChecked ? `2px solid ${checkFill(q_1.id) ? "#1e8449" : "#922b21"}` : "1px solid #ddd",
                                                background: fillChecked ? checkFill(q_1.id) ? "#eafaf1" : "#fdf2f2" : "white",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 2323,
                                            columnNumber: 14
                                        }, this),
                                        fillChecked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 13,
                                                fontWeight: 700,
                                                background: checkFill(q_1.id) ? "#eafaf1" : "#fdf2f2",
                                                color: checkFill(q_1.id) ? "#1e8449" : "#922b21",
                                                padding: "4px 12px",
                                                borderRadius: 20,
                                                whiteSpace: "nowrap"
                                            },
                                            children: checkFill(q_1.id) ? "\u2713 \u0110\xFAng" : `✗ → ${q_1.answer}`
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                            lineNumber: 2339,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2319,
                                    columnNumber: 34
                                }, this),
                                fillChecked && !checkFill(q_1.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        q_1.hint
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                                    lineNumber: 2347,
                                    columnNumber: 133
                                }, this)
                            ]
                        }, q_1.id, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2313,
                            columnNumber: 55
                        }, this)
                }["Lesson2_TapHop[fillQuestions.map()]"]),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 12
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson2_TapHop[<button>.onClick]": ()=>setFillChecked(true)
                            }["Lesson2_TapHop[<button>.onClick]"],
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2356,
                            columnNumber: 10
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson2_TapHop[<button>.onClick]": ()=>{
                                    setFillAnswers({});
                                    setFillChecked(false);
                                }
                            }["Lesson2_TapHop[<button>.onClick]"],
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                            lineNumber: 2366,
                            columnNumber: 58
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                    lineNumber: 2353,
                    columnNumber: 49
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2303,
            columnNumber: 34
        }, this);
        $[7] = fillAnswers;
        $[8] = fillChecked;
        $[9] = gameMode;
        $[10] = lang;
        $[11] = mcDone;
        $[12] = mcIndex;
        $[13] = mcScore;
        $[14] = mcSelected;
        $[15] = revealedAnswers;
        $[16] = t;
        $[17] = tfDone;
        $[18] = tfFlipped;
        $[19] = tfIndex;
        $[20] = tfScore;
        $[21] = t10;
        $[22] = t11;
        $[23] = t12;
        $[24] = t13;
        $[25] = t14;
        $[26] = t15;
        $[27] = t16;
        $[28] = t17;
        $[29] = t18;
        $[30] = t19;
        $[31] = t20;
        $[32] = t21;
        $[33] = t22;
        $[34] = t5;
        $[35] = t6;
        $[36] = t7;
        $[37] = t8;
        $[38] = t9;
    } else {
        t10 = $[21];
        t11 = $[22];
        t12 = $[23];
        t13 = $[24];
        t14 = $[25];
        t15 = $[26];
        t16 = $[27];
        t17 = $[28];
        t18 = $[29];
        t19 = $[30];
        t20 = $[31];
        t21 = $[32];
        t22 = $[33];
        t5 = $[34];
        t6 = $[35];
        t7 = $[36];
        t8 = $[37];
        t9 = $[38];
    }
    let t23;
    if ($[445] !== t10 || $[446] !== t11 || $[447] !== t5 || $[448] !== t6 || $[449] !== t7 || $[450] !== t8 || $[451] !== t9) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            id: t5,
            style: t6,
            children: [
                t7,
                t8,
                t9,
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2435,
            columnNumber: 11
        }, this);
        $[445] = t10;
        $[446] = t11;
        $[447] = t5;
        $[448] = t6;
        $[449] = t7;
        $[450] = t8;
        $[451] = t9;
        $[452] = t23;
    } else {
        t23 = $[452];
    }
    let t24;
    if ($[453] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2449,
            columnNumber: 11
        }, this);
        $[453] = t24;
    } else {
        t24 = $[453];
    }
    let t25;
    if ($[454] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[454] = t25;
    } else {
        t25 = $[454];
    }
    let t26;
    if ($[455] !== t) {
        t26 = t("B\xE0i 2 / Ch\u01B0\u01A1ng I", "Lesson 2 / Chapter I");
        $[455] = t;
        $[456] = t26;
    } else {
        t26 = $[456];
    }
    let t27;
    if ($[457] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t25,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2478,
            columnNumber: 11
        }, this);
        $[457] = t26;
        $[458] = t27;
    } else {
        t27 = $[458];
    }
    let t28;
    let t29;
    if ($[459] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n          .reveal { opacity:0; transform:translateY(28px) scale(0.97); transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1); will-change:opacity,transform; }\n          .reveal.visible { opacity:1; transform:translateY(0) scale(1); }\n          .reveal[data-reveal-stagger].visible { opacity:1; transform:none; }\n          .reveal[data-reveal-stagger] > * { opacity:0; transform:translateY(24px) scale(0.97); will-change:opacity,transform; }\n          header.reveal { transform:translateY(-18px); opacity:0; }\n          header.reveal.visible { opacity:1; transform:translateY(0); }\n          article { transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease; border-radius:10px; padding:8px; }\n          article:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 12px 28px rgba(0,0,0,0.12); }\n        "
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2487,
            columnNumber: 11
        }, this);
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2488,
            columnNumber: 11
        }, this);
        $[459] = t28;
        $[460] = t29;
    } else {
        t28 = $[459];
        t29 = $[460];
    }
    let t30;
    if ($[461] !== t12 || $[462] !== t13 || $[463] !== t14 || $[464] !== t15 || $[465] !== t16 || $[466] !== t17 || $[467] !== t18 || $[468] !== t19 || $[469] !== t20 || $[470] !== t21 || $[471] !== t23 || $[472] !== t27) {
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
                t23,
                t24,
                t27,
                t28,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2497,
            columnNumber: 11
        }, this);
        $[461] = t12;
        $[462] = t13;
        $[463] = t14;
        $[464] = t15;
        $[465] = t16;
        $[466] = t17;
        $[467] = t18;
        $[468] = t19;
        $[469] = t20;
        $[470] = t21;
        $[471] = t23;
        $[472] = t27;
        $[473] = t30;
    } else {
        t30 = $[473];
    }
    let t31;
    if ($[474] !== t22 || $[475] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t22,
            children: t30
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
            lineNumber: 2516,
            columnNumber: 11
        }, this);
        $[474] = t22;
        $[475] = t30;
        $[476] = t31;
    } else {
        t31 = $[476];
    }
    return t31;
}
_s(Lesson2_TapHop, "sKQmoATogM8Dtkl8aRzPFFRTuao=");
_c = Lesson2_TapHop;
function _Lesson2_TapHopAnonymousAMap(line, i_9) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: line
    }, i_9, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
        lineNumber: 2526,
        columnNumber: 10
    }, this);
}
function _Lesson2_TapHopAnonymous4(t0, i_7) {
    const [label_0, n, count, subsets] = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            flex: "1 1 180px",
            padding: 16,
            borderRadius: 10,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 6
                },
                children: label_0
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2541,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#0B4F5C"
                },
                children: [
                    "2",
                    n === 1 ? "\xB9" : n === 2 ? "\xB2" : "\xB3",
                    " = ",
                    count
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2545,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#777",
                    marginTop: 6
                },
                children: subsets.join(", ")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2549,
                columnNumber: 71
            }, this)
        ]
    }, i_7, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
        lineNumber: 2534,
        columnNumber: 10
    }, this);
}
function _Lesson2_TapHopAnonymous3(note, i_6) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: "white",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 14,
            color: "#555",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        children: [
            "💡 ",
            note
        ]
    }, i_6, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
        lineNumber: 2556,
        columnNumber: 10
    }, this);
}
function _Lesson2_TapHopAnonymous2(card, i_5) {
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
                    fontSize: 17,
                    fontWeight: 600,
                    marginBottom: 10
                },
                children: card.method
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2571,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 18,
                    color: "#0B4F5C",
                    marginBottom: 10,
                    padding: "8px 12px",
                    background: "white",
                    borderRadius: 6
                },
                children: card.example
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2575,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    color: "#777"
                },
                children: card.note
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2583,
                columnNumber: 28
            }, this)
        ]
    }, i_5, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
        lineNumber: 2566,
        columnNumber: 10
    }, this);
}
function _Lesson2_TapHopTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson2_TapHopTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson2_TapHopAnonymous(obj, i_4) {
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
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
        lineNumber: 2597,
        columnNumber: 10
    }, this);
}
function _Lesson2_TapHopSectionHeader(t0) {
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2618,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
                lineNumber: 2618,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js",
        lineNumber: 2608,
        columnNumber: 10
    }, this);
}
function _Lesson2_TapHopHandleTfNextSetTfIndex(i_3) {
    return i_3 + 1;
}
function _Lesson2_TapHopHandleTfAnswerSetTfScore(s_0) {
    return s_0 + 1;
}
function _Lesson2_TapHopHandleMcNextSetMcIndex(i_2) {
    return i_2 + 1;
}
function _Lesson2_TapHopHandleMcSelectSetMcScore(s) {
    return s + 1;
}
function _Lesson2_TapHopScrollTo(id_0) {
    const el_2 = document.getElementById(id_0);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson2_TapHopUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson2_TapHopUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson2_TapHop[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson2_TapHop[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp(entries, observer) {
    entries.forEach({
        "Lesson2_TapHop[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson2_TapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "Lesson2_TapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson2_TapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["Lesson2_TapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson2_TapHop[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson2_TapHopUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson2_TapHop[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["Lesson2_TapHop[useEffect() > els.forEach() > (anonymous)()]"]);
    }
}
var _c;
__turbopack_context__.k.register(_c, "Lesson2_TapHop");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/app/Tap-hop/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TapHopPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$Cacbaitoan10$2f$Lesson2_TapHop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/Cacbaitoan10/Lesson2_TapHop.js [app-client] (ecmascript)");
"use client";
;
;
;
function TapHopPage() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "8a05c896bbbe164a911fab02becdb5b3f6b21726777f8e03b993aca224b6164b") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8a05c896bbbe164a911fab02becdb5b3f6b21726777f8e03b993aca224b6164b";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$Cacbaitoan10$2f$Lesson2_TapHop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/app/Tap-hop/page.js",
            lineNumber: 15,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = TapHopPage;
var _c;
__turbopack_context__.k.register(_c, "TapHopPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_4ed791ba._.js.map