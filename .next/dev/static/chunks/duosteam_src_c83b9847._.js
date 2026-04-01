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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson3_PhepToanTapHop
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
    if ($[0] !== "ea4fb45d504910e9c389a5f794ed659457e46e4801c3b1c92a67d3bffc0f6a89") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ea4fb45d504910e9c389a5f794ed659457e46e4801c3b1c92a67d3bffc0f6a89";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
    if ($[0] !== "ea4fb45d504910e9c389a5f794ed659457e46e4801c3b1c92a67d3bffc0f6a89") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ea4fb45d504910e9c389a5f794ed659457e46e4801c3b1c92a67d3bffc0f6a89";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                                lineNumber: 200,
                                                columnNumber: 74
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                        lineNumber: 200,
                                        columnNumber: 151
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                lineNumber: 190,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 183,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, idx, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 259,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
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
function Lesson3_PhepToanTapHop() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(440);
    if ($[0] !== "ea4fb45d504910e9c389a5f794ed659457e46e4801c3b1c92a67d3bffc0f6a89") {
        for(let $i = 0; $i < 440; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ea4fb45d504910e9c389a5f794ed659457e46e4801c3b1c92a67d3bffc0f6a89";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson3_PhepToanTapHopUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson3_PhepToanTapHop[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson3_PhepToanTapHop[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson3_PhepToanTapHop[toggleAnswer]": (id)=>setRevealedAnswers({
                    "Lesson3_PhepToanTapHop[toggleAnswer > setRevealedAnswers()]": (p)=>({
                            ...p,
                            [id]: !p[id]
                        })
                }["Lesson3_PhepToanTapHop[toggleAnswer > setRevealedAnswers()]"])
        })["Lesson3_PhepToanTapHop[toggleAnswer]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const toggleAnswer = t6;
    const scrollTo = _Lesson3_PhepToanTapHopScrollTo;
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
    let t7;
    let t8;
    let t9;
    if ($[9] !== fillAnswers || $[10] !== fillChecked || $[11] !== gameMode || $[12] !== lang || $[13] !== mcDone || $[14] !== mcHistory || $[15] !== mcIndex || $[16] !== mcScore || $[17] !== mcSelected || $[18] !== revealedAnswers || $[19] !== t || $[20] !== tfDone || $[21] !== tfFlipped || $[22] !== tfHistory || $[23] !== tfIndex || $[24] !== tfScore) {
        const mcQuestions = [
            {
                q: t("A = {1,2,3}, B = {2,3,4}. A \u222A B = ?", "A = {1,2,3}, B = {2,3,4}. A \u222A B = ?"),
                options: [
                    "{2,3}",
                    "{1,2,3,4}",
                    "{1,4}",
                    "{1,2,3,4,4}"
                ],
                answer: 1,
                explain: t("A \u222A B = {1,2,3,4} \u2014 h\u1EE3p g\u1ED3m m\u1ECDi ph\u1EA7n t\u1EED c\u1EE7a A ho\u1EB7c B (kh\xF4ng l\u1EB7p).", "A \u222A B = {1,2,3,4} \u2014 union includes all elements in A or B (no repeats).")
            },
            {
                q: t("A = {1,2,3}, B = {2,3,4}. A \u2229 B = ?", "A = {1,2,3}, B = {2,3,4}. A \u2229 B = ?"),
                options: [
                    "{1,2,3,4}",
                    "{2,3}",
                    "{1,4}",
                    "\u2205"
                ],
                answer: 1,
                explain: t("A \u2229 B = {2,3} \u2014 giao g\u1ED3m c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c c\u1EA3 A v\xE0 B.", "A \u2229 B = {2,3} \u2014 intersection includes elements in both A and B.")
            },
            {
                q: t("A = {1,2,3,4}, B = {2,4}. A \\ B = ?", "A = {1,2,3,4}, B = {2,4}. A \\ B = ?"),
                options: [
                    "{2,4}",
                    "{1,2,3,4}",
                    "{1,3}",
                    "\u2205"
                ],
                answer: 2,
                explain: t("A \\ B = {1,3} \u2014 hi\u1EC7u g\u1ED3m c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c A nh\u01B0ng kh\xF4ng thu\u1ED9c B.", "A \\ B = {1,3} \u2014 difference includes elements in A but not in B.")
            },
            {
                q: t("U = {1,2,3,4,5}, A = {1,3,5}. C\u1D64(A) = ?", "U = {1,2,3,4,5}, A = {1,3,5}. C\u1D64(A) = ?"),
                options: [
                    "{1,3,5}",
                    "{2,4}",
                    "{1,2,3,4,5}",
                    "\u2205"
                ],
                answer: 1,
                explain: t("C\u1D64(A) = {2,4} \u2014 ph\u1EA7n b\xF9 l\xE0 c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c U nh\u01B0ng kh\xF4ng thu\u1ED9c A.", "C\u1D64(A) = {2,4} \u2014 complement includes elements in U but not in A.")
            },
            {
                q: t("|A \u222A B| khi |A|=5, |B|=6, |A \u2229 B|=2?", "|A \u222A B| when |A|=5, |B|=6, |A \u2229 B|=2?"),
                options: [
                    "11",
                    "9",
                    "13",
                    "7"
                ],
                answer: 1,
                explain: t("|A \u222A B| = |A| + |B| - |A \u2229 B| = 5 + 6 - 2 = 9.", "|A \u222A B| = |A| + |B| - |A \u2229 B| = 5 + 6 - 2 = 9.")
            }
        ];
        const tfCards = [
            {
                stmt: t("A \u2229 B = B \u2229 A v\u1EDBi m\u1ECDi t\u1EADp A, B.", "A \u2229 B = B \u2229 A for all sets A, B."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 giao c\xF3 t\xEDnh giao ho\xE1n.", "TRUE \u2014 intersection is commutative.")
            },
            {
                stmt: t("A \\ B = B \\ A v\u1EDBi m\u1ECDi t\u1EADp A, B.", "A \\ B = B \\ A for all sets A, B."),
                answer: false,
                explain: t("SAI \u2014 hi\u1EC7u KH\xD4NG c\xF3 t\xEDnh giao ho\xE1n. V\xED d\u1EE5: {1,2}\\{2,3} = {1} \u2260 {3} = {2,3}\\{1,2}.", "FALSE \u2014 difference is NOT commutative. Example: {1,2}\\{2,3} = {1} \u2260 {3} = {2,3}\\{1,2}.")
            },
            {
                stmt: t("C\u1D64(C\u1D64(A)) = A.", "C\u1D64(C\u1D64(A)) = A."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 ph\u1EA7n b\xF9 c\u1EE7a ph\u1EA7n b\xF9 l\xE0 ch\xEDnh t\u1EADp \u0111\xF3.", "TRUE \u2014 the complement of the complement is the set itself.")
            },
            {
                stmt: t("A \\ B = A \u2229 C\u1D64(B).", "A \\ B = A \u2229 C\u1D64(B)."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 \u0111\xE2y l\xE0 t\u01B0\u01A1ng \u0111\u01B0\u01A1ng quan tr\u1ECDng: ph\u1EA7n t\u1EED thu\u1ED9c A v\xE0 kh\xF4ng thu\u1ED9c B.", "TRUE \u2014 this is an important equivalence: elements in A and not in B.")
            },
            {
                stmt: t("|A \u222A B| = |A| + |B| lu\xF4n \u0111\xFAng.", "|A \u222A B| = |A| + |B| is always true."),
                answer: false,
                explain: t("SAI \u2014 ch\u1EC9 \u0111\xFAng khi A \u2229 B = \u2205. C\xF4ng th\u1EE9c \u0111\xFAng: |A \u222A B| = |A| + |B| - |A \u2229 B|.", "FALSE \u2014 only true when A \u2229 B = \u2205. Correct formula: |A \u222A B| = |A| + |B| - |A \u2229 B|.")
            }
        ];
        const fillQuestions = [
            {
                id: "f1",
                template: t("A = {1,2,3}, B = {3,4,5}. A \u222A B = {___}", "A = {1,2,3}, B = {3,4,5}. A \u222A B = {___}"),
                answer: "1,2,3,4,5",
                hint: t("H\u1EE3p g\u1ED3m m\u1ECDi ph\u1EA7n t\u1EED c\u1EE7a A ho\u1EB7c B.", "Union includes all elements in A or B.")
            },
            {
                id: "f2",
                template: t("|A \u222A B| = |A| + |B| \u2212 ___ (c\xF4ng th\u1EE9c c\u1ED9ng).", "|A \u222A B| = |A| + |B| \u2212 ___ (addition formula)."),
                answer: "|A \u2229 B|",
                hint: t("Tr\u1EEB \u0111i ph\u1EA7n b\u1ECB \u0111\u1EBFm hai l\u1EA7n.", "Subtract the part counted twice.")
            },
            {
                id: "f3",
                template: t("U = {1,2,3,4,5}, A = {2,4}. C\u1D64(A) = {___}", "U = {1,2,3,4,5}, A = {2,4}. C\u1D64(A) = {___}"),
                answer: "1,3,5",
                hint: t("Ph\u1EA7n b\xF9 = U tr\u1EEB A.", "Complement = U minus A.")
            }
        ];
        const handleMcSelect = {
            "Lesson3_PhepToanTapHop[handleMcSelect]": (i_1)=>{
                if (mcSelected !== null) {
                    return;
                }
                setMcSelected(i_1);
                const correct = i_1 === mcQuestions[mcIndex].answer;
                if (correct) {
                    setMcScore(_Lesson3_PhepToanTapHopHandleMcSelectSetMcScore);
                }
                setMcHistory({
                    "Lesson3_PhepToanTapHop[handleMcSelect > setMcHistory()]": (h)=>[
                            ...h,
                            {
                                q: mcIndex,
                                selected: i_1,
                                correct
                            }
                        ]
                }["Lesson3_PhepToanTapHop[handleMcSelect > setMcHistory()]"]);
            }
        }["Lesson3_PhepToanTapHop[handleMcSelect]"];
        const handleMcNext = {
            "Lesson3_PhepToanTapHop[handleMcNext]": ()=>{
                if (mcIndex + 1 >= mcQuestions.length) {
                    setMcDone(true);
                } else {
                    setMcIndex(_Lesson3_PhepToanTapHopHandleMcNextSetMcIndex);
                    setMcSelected(null);
                }
            }
        }["Lesson3_PhepToanTapHop[handleMcNext]"];
        let t26;
        if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
            t26 = ({
                "Lesson3_PhepToanTapHop[resetMc]": ()=>{
                    setMcIndex(0);
                    setMcSelected(null);
                    setMcScore(0);
                    setMcDone(false);
                    setMcHistory([]);
                }
            })["Lesson3_PhepToanTapHop[resetMc]"];
            $[44] = t26;
        } else {
            t26 = $[44];
        }
        const resetMc = t26;
        const handleTfAnswer = {
            "Lesson3_PhepToanTapHop[handleTfAnswer]": (ans)=>{
                if (tfFlipped) {
                    return;
                }
                setTfFlipped(true);
                const correct_0 = ans === tfCards[tfIndex].answer;
                if (correct_0) {
                    setTfScore(_Lesson3_PhepToanTapHopHandleTfAnswerSetTfScore);
                }
                setTfHistory({
                    "Lesson3_PhepToanTapHop[handleTfAnswer > setTfHistory()]": (h_0)=>[
                            ...h_0,
                            {
                                q: tfIndex,
                                given: ans,
                                correct: correct_0
                            }
                        ]
                }["Lesson3_PhepToanTapHop[handleTfAnswer > setTfHistory()]"]);
            }
        }["Lesson3_PhepToanTapHop[handleTfAnswer]"];
        const handleTfNext = {
            "Lesson3_PhepToanTapHop[handleTfNext]": ()=>{
                if (tfIndex + 1 >= tfCards.length) {
                    setTfDone(true);
                } else {
                    setTfIndex(_Lesson3_PhepToanTapHopHandleTfNextSetTfIndex);
                    setTfFlipped(false);
                }
            }
        }["Lesson3_PhepToanTapHop[handleTfNext]"];
        let t27;
        if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
            t27 = ({
                "Lesson3_PhepToanTapHop[resetTf]": ()=>{
                    setTfIndex(0);
                    setTfFlipped(false);
                    setTfScore(0);
                    setTfDone(false);
                    setTfHistory([]);
                }
            })["Lesson3_PhepToanTapHop[resetTf]"];
            $[45] = t27;
        } else {
            t27 = $[45];
        }
        const resetTf = t27;
        const checkFill = {
            "Lesson3_PhepToanTapHop[checkFill]": (id_1)=>{
                const correct_1 = fillQuestions.find({
                    "Lesson3_PhepToanTapHop[checkFill > fillQuestions.find()]": (q)=>q.id === id_1
                }["Lesson3_PhepToanTapHop[checkFill > fillQuestions.find()]"]).answer.toLowerCase().replace(/[\s{}]/g, "");
                return (fillAnswers[id_1] || "").toLowerCase().replace(/[\s{}]/g, "") === correct_1;
            }
        }["Lesson3_PhepToanTapHop[checkFill]"];
        mcHistory.map({
            "Lesson3_PhepToanTapHop[mcHistory.map()]": (h_1)=>({
                    correct: h_1.correct,
                    qText: mcQuestions[h_1.q].q,
                    correctText: mcQuestions[h_1.q].options[mcQuestions[h_1.q].answer],
                    yourText: mcQuestions[h_1.q].options[h_1.selected]
                })
        }["Lesson3_PhepToanTapHop[mcHistory.map()]"]);
        tfHistory.map({
            "Lesson3_PhepToanTapHop[tfHistory.map()]": (h_2)=>({
                    correct: h_2.correct,
                    qText: tfCards[h_2.q].stmt,
                    correctText: h_2.correct ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.given ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson3_PhepToanTapHop[tfHistory.map()]"]);
        fillChecked ? fillQuestions.map({
            "Lesson3_PhepToanTapHop[fillQuestions.map()]": (q_0)=>({
                    correct: checkFill(q_0.id),
                    qText: q_0.template,
                    correctText: q_0.answer,
                    yourText: fillAnswers[q_0.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson3_PhepToanTapHop[fillQuestions.map()]"]) : [];
        let t28;
        if ($[46] !== t) {
            t28 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[46] = t;
            $[47] = t28;
        } else {
            t28 = $[47];
        }
        let t29;
        if ($[48] !== t28) {
            t29 = [
                "khoiDong",
                "\uD83D\uDE80",
                t28
            ];
            $[48] = t28;
            $[49] = t29;
        } else {
            t29 = $[49];
        }
        let t30;
        if ($[50] !== t) {
            t30 = t("1. Ph\xE9p H\u1EE3p \u222A", "1. Union \u222A");
            $[50] = t;
            $[51] = t30;
        } else {
            t30 = $[51];
        }
        let t31;
        if ($[52] !== t30) {
            t31 = [
                "khai1",
                "\uD83D\uDCD6",
                t30
            ];
            $[52] = t30;
            $[53] = t31;
        } else {
            t31 = $[53];
        }
        let t32;
        if ($[54] !== t) {
            t32 = t("2. Ph\xE9p Giao \u2229", "2. Intersection \u2229");
            $[54] = t;
            $[55] = t32;
        } else {
            t32 = $[55];
        }
        let t33;
        if ($[56] !== t32) {
            t33 = [
                "khai2",
                "\uD83D\uDCD6",
                t32
            ];
            $[56] = t32;
            $[57] = t33;
        } else {
            t33 = $[57];
        }
        let t34;
        if ($[58] !== t) {
            t34 = t("3. Ph\xE9p Hi\u1EC7u \\", "3. Difference \\");
            $[58] = t;
            $[59] = t34;
        } else {
            t34 = $[59];
        }
        let t35;
        if ($[60] !== t34) {
            t35 = [
                "khai3",
                "\uD83D\uDCD6",
                t34
            ];
            $[60] = t34;
            $[61] = t35;
        } else {
            t35 = $[61];
        }
        let t36;
        if ($[62] !== t) {
            t36 = t("4. Ph\u1EA7n B\xF9 C\u1D64", "4. Complement C\u1D64");
            $[62] = t;
            $[63] = t36;
        } else {
            t36 = $[63];
        }
        let t37;
        if ($[64] !== t36) {
            t37 = [
                "khai4",
                "\uD83D\uDCD6",
                t36
            ];
            $[64] = t36;
            $[65] = t37;
        } else {
            t37 = $[65];
        }
        let t38;
        if ($[66] !== t) {
            t38 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[66] = t;
            $[67] = t38;
        } else {
            t38 = $[67];
        }
        let t39;
        if ($[68] !== t38) {
            t39 = [
                "thucHanh",
                "\u270F\uFE0F",
                t38
            ];
            $[68] = t38;
            $[69] = t39;
        } else {
            t39 = $[69];
        }
        let t40;
        if ($[70] !== t) {
            t40 = t("Mini Game", "Mini Game");
            $[70] = t;
            $[71] = t40;
        } else {
            t40 = $[71];
        }
        let t41;
        if ($[72] !== t40) {
            t41 = [
                "miniGame",
                "\uD83C\uDFAE",
                t40
            ];
            $[72] = t40;
            $[73] = t41;
        } else {
            t41 = $[73];
        }
        let t42;
        if ($[74] !== t29 || $[75] !== t31 || $[76] !== t33 || $[77] !== t35 || $[78] !== t37 || $[79] !== t39 || $[80] !== t41) {
            t42 = [
                t29,
                t31,
                t33,
                t35,
                t37,
                t39,
                t41
            ];
            $[74] = t29;
            $[75] = t31;
            $[76] = t33;
            $[77] = t35;
            $[78] = t37;
            $[79] = t39;
            $[80] = t41;
            $[81] = t42;
        } else {
            t42 = $[81];
        }
        const tabs = t42;
        const SectionHeader = _Lesson3_PhepToanTapHopSectionHeader;
        const OpCard = _Lesson3_PhepToanTapHopOpCard;
        if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
            t25 = {
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
            $[82] = t14;
            $[83] = t25;
        } else {
            t14 = $[82];
            t25 = $[83];
        }
        let t43;
        if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
            t43 = {
                marginBottom: 24
            };
            $[84] = t43;
        } else {
            t43 = $[84];
        }
        let t44;
        if ($[85] === Symbol.for("react.memo_cache_sentinel")) {
            t44 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[85] = t44;
        } else {
            t44 = $[85];
        }
        let t45;
        if ($[86] !== t) {
            t45 = t("Quay l\u1EA1i", "Back to lessons");
            $[86] = t;
            $[87] = t45;
        } else {
            t45 = $[87];
        }
        if ($[88] !== t45) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t43,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t44,
                    children: [
                        "← ",
                        t45
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                    lineNumber: 750,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 750,
                columnNumber: 13
            }, this);
            $[88] = t45;
            $[89] = t15;
        } else {
            t15 = $[89];
        }
        let t46;
        let t47;
        if ($[90] === Symbol.for("react.memo_cache_sentinel")) {
            t46 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t47 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            };
            $[90] = t46;
            $[91] = t47;
        } else {
            t46 = $[90];
            t47 = $[91];
        }
        let t48;
        if ($[92] !== t) {
            t48 = t("Ch\u01B0\u01A1ng I \xB7 M\u1EC7nh \u0110\u1EC1 v\xE0 T\u1EADp H\u1EE3p", "Chapter I \xB7 Propositions and Sets");
            $[92] = t;
            $[93] = t48;
        } else {
            t48 = $[93];
        }
        let t49;
        if ($[94] !== t48) {
            t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t47,
                children: t48
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 789,
                columnNumber: 13
            }, this);
            $[94] = t48;
            $[95] = t49;
        } else {
            t49 = $[95];
        }
        let t50;
        if ($[96] === Symbol.for("react.memo_cache_sentinel")) {
            t50 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[96] = t50;
        } else {
            t50 = $[96];
        }
        let t51;
        if ($[97] !== t) {
            t51 = t("B\xE0i 3: C\xE1c Ph\xE9p To\xE1n Tr\xEAn T\u1EADp H\u1EE3p", "Lesson 3: Set Operations");
            $[97] = t;
            $[98] = t51;
        } else {
            t51 = $[98];
        }
        let t52;
        if ($[99] !== t51) {
            t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t50,
                children: t51
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 816,
                columnNumber: 13
            }, this);
            $[99] = t51;
            $[100] = t52;
        } else {
            t52 = $[100];
        }
        let t53;
        if ($[101] !== t49 || $[102] !== t52) {
            t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t49,
                    t52
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 824,
                columnNumber: 13
            }, this);
            $[101] = t49;
            $[102] = t52;
            $[103] = t53;
        } else {
            t53 = $[103];
        }
        let t54;
        let t55;
        if ($[104] === Symbol.for("react.memo_cache_sentinel")) {
            t54 = {
                display: "flex",
                gap: 10
            };
            t55 = ({
                "Lesson3_PhepToanTapHop[<button>.onClick]": ()=>setLang("vi")
            })["Lesson3_PhepToanTapHop[<button>.onClick]"];
            $[104] = t54;
            $[105] = t55;
        } else {
            t54 = $[104];
            t55 = $[105];
        }
        const t56 = lang === "vi" ? "black" : "#f9f9f9";
        const t57 = lang === "vi" ? "white" : "black";
        let t58;
        if ($[106] !== t56 || $[107] !== t57) {
            t58 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t55,
                style: {
                    background: t56,
                    color: t57,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 851,
                columnNumber: 13
            }, this);
            $[106] = t56;
            $[107] = t57;
            $[108] = t58;
        } else {
            t58 = $[108];
        }
        let t59;
        if ($[109] === Symbol.for("react.memo_cache_sentinel")) {
            t59 = ({
                "Lesson3_PhepToanTapHop[<button>.onClick]": ()=>setLang("en")
            })["Lesson3_PhepToanTapHop[<button>.onClick]"];
            $[109] = t59;
        } else {
            t59 = $[109];
        }
        const t60 = lang === "en" ? "black" : "#f9f9f9";
        const t61 = lang === "en" ? "white" : "black";
        let t62;
        if ($[110] !== t60 || $[111] !== t61) {
            t62 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t59,
                style: {
                    background: t60,
                    color: t61,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 880,
                columnNumber: 13
            }, this);
            $[110] = t60;
            $[111] = t61;
            $[112] = t62;
        } else {
            t62 = $[112];
        }
        let t63;
        if ($[113] !== t58 || $[114] !== t62) {
            t63 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t54,
                children: [
                    t58,
                    t62
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 898,
                columnNumber: 13
            }, this);
            $[113] = t58;
            $[114] = t62;
            $[115] = t63;
        } else {
            t63 = $[115];
        }
        if ($[116] !== t53 || $[117] !== t63) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t46,
                children: [
                    t53,
                    t63
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 906,
                columnNumber: 13
            }, this);
            $[116] = t53;
            $[117] = t63;
            $[118] = t16;
        } else {
            t16 = $[118];
        }
        let t64;
        let t65;
        if ($[119] === Symbol.for("react.memo_cache_sentinel")) {
            t64 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t65 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[119] = t64;
            $[120] = t65;
        } else {
            t64 = $[119];
            t65 = $[120];
        }
        let t66;
        if ($[121] !== t) {
            t66 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Learning Objectives");
            $[121] = t;
            $[122] = t66;
        } else {
            t66 = $[122];
        }
        let t67;
        if ($[123] !== t66) {
            t67 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t65,
                children: [
                    "🎯 ",
                    t66
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 944,
                columnNumber: 13
            }, this);
            $[123] = t66;
            $[124] = t67;
        } else {
            t67 = $[124];
        }
        let t68;
        if ($[125] !== t) {
            t68 = t("Th\u1EF1c hi\u1EC7n ph\xE9p h\u1EE3p (\u222A) v\xE0 ph\xE9p giao (\u2229) hai t\u1EADp h\u1EE3p.", "Perform union (\u222A) and intersection (\u2229) of two sets.");
            $[125] = t;
            $[126] = t68;
        } else {
            t68 = $[126];
        }
        let t69;
        if ($[127] !== t) {
            t69 = t("Th\u1EF1c hi\u1EC7n ph\xE9p hi\u1EC7u (\\) v\xE0 ph\xE9p l\u1EA5y ph\u1EA7n b\xF9 C\u1D64(A).", "Perform difference (\\) and complement C\u1D64(A).");
            $[127] = t;
            $[128] = t69;
        } else {
            t69 = $[128];
        }
        let t70;
        if ($[129] !== t) {
            t70 = t("\xC1p d\u1EE5ng c\xF4ng th\u1EE9c |A \u222A B| = |A| + |B| \u2212 |A \u2229 B|.", "Apply the formula |A \u222A B| = |A| + |B| \u2212 |A \u2229 B|.");
            $[129] = t;
            $[130] = t70;
        } else {
            t70 = $[130];
        }
        let t71;
        if ($[131] !== t) {
            t71 = t("Bi\u1EBFt c\xE1c t\xEDnh ch\u1EA5t (giao ho\xE1n, k\u1EBFt h\u1EE3p, De Morgan).", "Know properties: commutativity, associativity, De Morgan's laws.");
            $[131] = t;
            $[132] = t71;
        } else {
            t71 = $[132];
        }
        let t72;
        if ($[133] !== t68 || $[134] !== t69 || $[135] !== t70 || $[136] !== t71) {
            t72 = [
                t68,
                t69,
                t70,
                t71
            ].map(_Lesson3_PhepToanTapHopAnonymous);
            $[133] = t68;
            $[134] = t69;
            $[135] = t70;
            $[136] = t71;
            $[137] = t72;
        } else {
            t72 = $[137];
        }
        if ($[138] !== t67 || $[139] !== t72) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t64,
                children: [
                    t67,
                    t72
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 994,
                columnNumber: 13
            }, this);
            $[138] = t67;
            $[139] = t72;
            $[140] = t17;
        } else {
            t17 = $[140];
        }
        let t73;
        let t74;
        if ($[141] === Symbol.for("react.memo_cache_sentinel")) {
            t73 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t74 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[141] = t73;
            $[142] = t74;
        } else {
            t73 = $[141];
            t74 = $[142];
        }
        if ($[143] !== tabs) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t73,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t74,
                    children: tabs.map({
                        "Lesson3_PhepToanTapHop[tabs.map()]": (t75)=>{
                            const [id_2, icon_0, label] = t75;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson3_PhepToanTapHop[tabs.map() > <button>.onClick]": ()=>scrollTo(id_2)
                                }["Lesson3_PhepToanTapHop[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson3_PhepToanTapHopTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson3_PhepToanTapHopTabsMapButtonOnMouseLeave,
                                children: [
                                    icon_0,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                lineNumber: 1029,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson3_PhepToanTapHop[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                    lineNumber: 1026,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1026,
                columnNumber: 13
            }, this);
            $[143] = tabs;
            $[144] = t18;
        } else {
            t18 = $[144];
        }
        let t75;
        if ($[145] === Symbol.for("react.memo_cache_sentinel")) {
            t75 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[145] = t75;
        } else {
            t75 = $[145];
        }
        let t76;
        if ($[146] !== t) {
            t76 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[146] = t;
            $[147] = t76;
        } else {
            t76 = $[147];
        }
        let t77;
        if ($[148] !== t76) {
            t77 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDE80",
                title: t76
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1070,
                columnNumber: 13
            }, this);
            $[148] = t76;
            $[149] = t77;
        } else {
            t77 = $[149];
        }
        let t78;
        let t79;
        if ($[150] === Symbol.for("react.memo_cache_sentinel")) {
            t78 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t79 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8
            };
            $[150] = t78;
            $[151] = t79;
        } else {
            t78 = $[150];
            t79 = $[151];
        }
        let t80;
        if ($[152] !== t) {
            t80 = t("T\xECnh hu\u1ED1ng m\u1EDF \u0111\u1EA7u", "Opening Situation");
            $[152] = t;
            $[153] = t80;
        } else {
            t80 = $[153];
        }
        let t81;
        if ($[154] !== t80) {
            t81 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t79,
                children: t80
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1106,
                columnNumber: 13
            }, this);
            $[154] = t80;
            $[155] = t81;
        } else {
            t81 = $[155];
        }
        let t82;
        if ($[156] === Symbol.for("react.memo_cache_sentinel")) {
            t82 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[156] = t82;
        } else {
            t82 = $[156];
        }
        let t83;
        if ($[157] !== t) {
            t83 = t("Trong m\u1ED9t l\u1EDBp h\u1ECDc c\xF3 30 h\u1ECDc sinh: 18 em h\u1ECDc To\xE1n, 15 em h\u1ECDc L\xFD, v\xE0 7 em h\u1ECDc c\u1EA3 hai. C\xF3 bao nhi\xEAu em h\u1ECDc \xEDt nh\u1EA5t m\u1ED9t trong hai m\xF4n? L\xE0m th\u1EBF n\xE0o \u0111\u1EC3 kh\xF4ng \u0111\u1EBFm tr\xF9ng?", "In a class of 30 students: 18 study Math, 15 study Physics, and 7 study both. How many study at least one? How can we avoid counting twice?");
            $[157] = t;
            $[158] = t83;
        } else {
            t83 = $[158];
        }
        let t84;
        if ($[159] !== t83) {
            t84 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t82,
                children: t83
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1133,
                columnNumber: 13
            }, this);
            $[159] = t83;
            $[160] = t84;
        } else {
            t84 = $[160];
        }
        let t85;
        if ($[161] === Symbol.for("react.memo_cache_sentinel")) {
            t85 = {
                fontSize: 16
            };
            $[161] = t85;
        } else {
            t85 = $[161];
        }
        let t86;
        if ($[162] !== t) {
            t86 = t("\u0110\xE2y ch\xEDnh l\xE0 b\xE0i to\xE1n c\u1EE7a ph\xE9p to\xE1n t\u1EADp h\u1EE3p!", "This is exactly the problem of set operations!");
            $[162] = t;
            $[163] = t86;
        } else {
            t86 = $[163];
        }
        let t87;
        if ($[164] !== t86) {
            t87 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t85,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t86
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 1158,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1158,
                columnNumber: 13
            }, this);
            $[164] = t86;
            $[165] = t87;
        } else {
            t87 = $[165];
        }
        let t88;
        if ($[166] !== t81 || $[167] !== t84 || $[168] !== t87) {
            t88 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t78,
                children: [
                    t81,
                    t84,
                    t87
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1166,
                columnNumber: 13
            }, this);
            $[166] = t81;
            $[167] = t84;
            $[168] = t87;
            $[169] = t88;
        } else {
            t88 = $[169];
        }
        if ($[170] !== t77 || $[171] !== t88) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khoiDong",
                style: t75,
                children: [
                    t77,
                    t88
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1175,
                columnNumber: 13
            }, this);
            $[170] = t77;
            $[171] = t88;
            $[172] = t19;
        } else {
            t19 = $[172];
        }
        let t89;
        if ($[173] === Symbol.for("react.memo_cache_sentinel")) {
            t89 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[173] = t89;
        } else {
            t89 = $[173];
        }
        let t90;
        if ($[174] !== t) {
            t90 = t("1. Ph\xE9p H\u1EE3p (A \u222A B)", "1. Union (A \u222A B)");
            $[174] = t;
            $[175] = t90;
        } else {
            t90 = $[175];
        }
        let t91;
        if ($[176] !== t90) {
            t91 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t90
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1202,
                columnNumber: 13
            }, this);
            $[176] = t90;
            $[177] = t91;
        } else {
            t91 = $[177];
        }
        let t92;
        if ($[178] !== t) {
            t92 = t("H\u1EE3p hai t\u1EADp h\u1EE3p", "Union of two sets");
            $[178] = t;
            $[179] = t92;
        } else {
            t92 = $[179];
        }
        let t93;
        if ($[180] !== t) {
            t93 = t("A \u222A B l\xE0 t\u1EADp h\u1EE3p g\u1ED3m c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c A ho\u1EB7c thu\u1ED9c B (ho\u1EB7c c\u1EA3 hai).", "A \u222A B is the set of elements belonging to A or B (or both).");
            $[180] = t;
            $[181] = t93;
        } else {
            t93 = $[181];
        }
        let t94;
        if ($[182] !== t92 || $[183] !== t93) {
            t94 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OpCard, {
                op: t92,
                sym: "\u222A",
                defn: t93,
                formula: "A \u222A B = {x | x \u2208 A ho\u1EB7c x \u2208 B}",
                example: "A={1,2,3}, B={2,3,4} \u2192 A \u222A B",
                result: "{1,2,3,4}"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1226,
                columnNumber: 13
            }, this);
            $[182] = t92;
            $[183] = t93;
            $[184] = t94;
        } else {
            t94 = $[184];
        }
        let t95;
        let t96;
        if ($[185] === Symbol.for("react.memo_cache_sentinel")) {
            t95 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t96 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[185] = t95;
            $[186] = t96;
        } else {
            t95 = $[185];
            t96 = $[186];
        }
        let t97;
        if ($[187] !== t) {
            t97 = t("T\xEDnh ch\u1EA5t", "Properties");
            $[187] = t;
            $[188] = t97;
        } else {
            t97 = $[188];
        }
        let t98;
        if ($[189] !== t97) {
            t98 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t96,
                children: [
                    "📐 ",
                    t97
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1264,
                columnNumber: 13
            }, this);
            $[189] = t97;
            $[190] = t98;
        } else {
            t98 = $[190];
        }
        let t99;
        if ($[191] === Symbol.for("react.memo_cache_sentinel")) {
            t99 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                transition: "all 0.3s ease"
            };
            $[191] = t99;
        } else {
            t99 = $[191];
        }
        let t100;
        if ($[192] !== t) {
            t100 = t("Giao ho\xE1n", "Commutative");
            $[192] = t;
            $[193] = t100;
        } else {
            t100 = $[193];
        }
        let t101;
        if ($[194] !== t100) {
            t101 = [
                "A \u222A B = B \u222A A",
                t100
            ];
            $[194] = t100;
            $[195] = t101;
        } else {
            t101 = $[195];
        }
        let t102;
        if ($[196] !== t) {
            t102 = t("K\u1EBFt h\u1EE3p", "Associative");
            $[196] = t;
            $[197] = t102;
        } else {
            t102 = $[197];
        }
        let t103;
        if ($[198] !== t102) {
            t103 = [
                "(A \u222A B) \u222A C = A \u222A (B \u222A C)",
                t102
            ];
            $[198] = t102;
            $[199] = t103;
        } else {
            t103 = $[199];
        }
        let t104;
        if ($[200] !== t) {
            t104 = t("Ph\u1EA7n t\u1EED trung l\u1EADp", "Identity");
            $[200] = t;
            $[201] = t104;
        } else {
            t104 = $[201];
        }
        let t105;
        if ($[202] !== t104) {
            t105 = [
                "A \u222A \u2205 = A",
                t104
            ];
            $[202] = t104;
            $[203] = t105;
        } else {
            t105 = $[203];
        }
        let t106;
        if ($[204] !== t) {
            t106 = t("L\u0169y \u0111\u1EB3ng", "Idempotent");
            $[204] = t;
            $[205] = t106;
        } else {
            t106 = $[205];
        }
        let t107;
        if ($[206] !== t106) {
            t107 = [
                "A \u222A A = A",
                t106
            ];
            $[206] = t106;
            $[207] = t107;
        } else {
            t107 = $[207];
        }
        let t108;
        if ($[208] !== t101 || $[209] !== t103 || $[210] !== t105 || $[211] !== t107) {
            t108 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t99,
                children: [
                    t101,
                    t103,
                    t105,
                    t107
                ].map(_Lesson3_PhepToanTapHopAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1348,
                columnNumber: 14
            }, this);
            $[208] = t101;
            $[209] = t103;
            $[210] = t105;
            $[211] = t107;
            $[212] = t108;
        } else {
            t108 = $[212];
        }
        let t109;
        if ($[213] !== t108 || $[214] !== t98) {
            t109 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t95,
                children: [
                    t98,
                    t108
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1359,
                columnNumber: 14
            }, this);
            $[213] = t108;
            $[214] = t98;
            $[215] = t109;
        } else {
            t109 = $[215];
        }
        let t110;
        let t111;
        if ($[216] === Symbol.for("react.memo_cache_sentinel")) {
            t110 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t111 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 10
            };
            $[216] = t110;
            $[217] = t111;
        } else {
            t110 = $[216];
            t111 = $[217];
        }
        let t112;
        if ($[218] !== t) {
            t112 = t("C\xF4ng th\u1EE9c c\u1ED9ng (Inclusion-Exclusion)", "Inclusion-Exclusion Formula");
            $[218] = t;
            $[219] = t112;
        } else {
            t112 = $[219];
        }
        let t113;
        if ($[220] !== t112) {
            t113 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t111,
                children: [
                    "📊 ",
                    t112
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1396,
                columnNumber: 14
            }, this);
            $[220] = t112;
            $[221] = t113;
        } else {
            t113 = $[221];
        }
        let t114;
        let t115;
        if ($[222] === Symbol.for("react.memo_cache_sentinel")) {
            t114 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 20,
                    color: "#0B4F5C",
                    textAlign: "center",
                    padding: "16px 0"
                },
                children: "|A ∪ B| = |A| + |B| − |A ∩ B|"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1405,
                columnNumber: 14
            }, this);
            t115 = {
                fontSize: 15,
                color: "#777",
                textAlign: "center"
            };
            $[222] = t114;
            $[223] = t115;
        } else {
            t114 = $[222];
            t115 = $[223];
        }
        let t116;
        if ($[224] !== t) {
            t116 = t("Tr\xE1nh \u0111\u1EBFm hai l\u1EA7n c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c c\u1EA3 A v\xE0 B.", "Avoids counting twice elements in both A and B.");
            $[224] = t;
            $[225] = t116;
        } else {
            t116 = $[225];
        }
        let t117;
        if ($[226] !== t116) {
            t117 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t115,
                children: t116
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1433,
                columnNumber: 14
            }, this);
            $[226] = t116;
            $[227] = t117;
        } else {
            t117 = $[227];
        }
        let t118;
        if ($[228] !== t113 || $[229] !== t117) {
            t118 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t110,
                children: [
                    t113,
                    t114,
                    t117
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1441,
                columnNumber: 14
            }, this);
            $[228] = t113;
            $[229] = t117;
            $[230] = t118;
        } else {
            t118 = $[230];
        }
        if ($[231] !== t109 || $[232] !== t118 || $[233] !== t91 || $[234] !== t94) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai1",
                style: t89,
                children: [
                    t91,
                    t94,
                    t109,
                    t118
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1449,
                columnNumber: 13
            }, this);
            $[231] = t109;
            $[232] = t118;
            $[233] = t91;
            $[234] = t94;
            $[235] = t20;
        } else {
            t20 = $[235];
        }
        let t119;
        if ($[236] === Symbol.for("react.memo_cache_sentinel")) {
            t119 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[236] = t119;
        } else {
            t119 = $[236];
        }
        let t120;
        if ($[237] !== t) {
            t120 = t("2. Ph\xE9p Giao (A \u2229 B)", "2. Intersection (A \u2229 B)");
            $[237] = t;
            $[238] = t120;
        } else {
            t120 = $[238];
        }
        let t121;
        if ($[239] !== t120) {
            t121 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t120
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1478,
                columnNumber: 14
            }, this);
            $[239] = t120;
            $[240] = t121;
        } else {
            t121 = $[240];
        }
        let t122;
        if ($[241] !== t) {
            t122 = t("Giao hai t\u1EADp h\u1EE3p", "Intersection of two sets");
            $[241] = t;
            $[242] = t122;
        } else {
            t122 = $[242];
        }
        let t123;
        if ($[243] !== t) {
            t123 = t("A \u2229 B l\xE0 t\u1EADp h\u1EE3p g\u1ED3m c\xE1c ph\u1EA7n t\u1EED v\u1EEBa thu\u1ED9c A v\u1EEBa thu\u1ED9c B.", "A \u2229 B is the set of elements belonging to both A and B.");
            $[243] = t;
            $[244] = t123;
        } else {
            t123 = $[244];
        }
        let t124;
        if ($[245] !== t122 || $[246] !== t123) {
            t124 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OpCard, {
                op: t122,
                sym: "\u2229",
                defn: t123,
                formula: "A \u2229 B = {x | x \u2208 A v\xE0 x \u2208 B}",
                example: "A={1,2,3}, B={2,3,4} \u2192 A \u2229 B",
                result: "{2,3}"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1502,
                columnNumber: 14
            }, this);
            $[245] = t122;
            $[246] = t123;
            $[247] = t124;
        } else {
            t124 = $[247];
        }
        let t125;
        let t126;
        if ($[248] === Symbol.for("react.memo_cache_sentinel")) {
            t125 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t126 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[248] = t125;
            $[249] = t126;
        } else {
            t125 = $[248];
            t126 = $[249];
        }
        let t127;
        if ($[250] !== t) {
            t127 = t("T\xEDnh ch\u1EA5t", "Properties");
            $[250] = t;
            $[251] = t127;
        } else {
            t127 = $[251];
        }
        let t128;
        if ($[252] !== t127) {
            t128 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t126,
                children: [
                    "📐 ",
                    t127
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1539,
                columnNumber: 14
            }, this);
            $[252] = t127;
            $[253] = t128;
        } else {
            t128 = $[253];
        }
        let t129;
        if ($[254] === Symbol.for("react.memo_cache_sentinel")) {
            t129 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                transition: "all 0.3s ease"
            };
            $[254] = t129;
        } else {
            t129 = $[254];
        }
        let t130;
        if ($[255] !== t) {
            t130 = t("Giao ho\xE1n", "Commutative");
            $[255] = t;
            $[256] = t130;
        } else {
            t130 = $[256];
        }
        let t131;
        if ($[257] !== t130) {
            t131 = [
                "A \u2229 B = B \u2229 A",
                t130
            ];
            $[257] = t130;
            $[258] = t131;
        } else {
            t131 = $[258];
        }
        let t132;
        if ($[259] !== t) {
            t132 = t("K\u1EBFt h\u1EE3p", "Associative");
            $[259] = t;
            $[260] = t132;
        } else {
            t132 = $[260];
        }
        let t133;
        if ($[261] !== t132) {
            t133 = [
                "(A \u2229 B) \u2229 C = A \u2229 (B \u2229 C)",
                t132
            ];
            $[261] = t132;
            $[262] = t133;
        } else {
            t133 = $[262];
        }
        let t134;
        if ($[263] !== t) {
            t134 = t("Ph\u1EA7n t\u1EED kh\xF4ng", "Zero element");
            $[263] = t;
            $[264] = t134;
        } else {
            t134 = $[264];
        }
        let t135;
        if ($[265] !== t134) {
            t135 = [
                "A \u2229 \u2205 = \u2205",
                t134
            ];
            $[265] = t134;
            $[266] = t135;
        } else {
            t135 = $[266];
        }
        let t136;
        if ($[267] !== t) {
            t136 = t("L\u0169y \u0111\u1EB3ng", "Idempotent");
            $[267] = t;
            $[268] = t136;
        } else {
            t136 = $[268];
        }
        let t137;
        if ($[269] !== t136) {
            t137 = [
                "A \u2229 A = A",
                t136
            ];
            $[269] = t136;
            $[270] = t137;
        } else {
            t137 = $[270];
        }
        let t138;
        if ($[271] !== t131 || $[272] !== t133 || $[273] !== t135 || $[274] !== t137) {
            t138 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t129,
                children: [
                    t131,
                    t133,
                    t135,
                    t137
                ].map(_Lesson3_PhepToanTapHopAnonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1623,
                columnNumber: 14
            }, this);
            $[271] = t131;
            $[272] = t133;
            $[273] = t135;
            $[274] = t137;
            $[275] = t138;
        } else {
            t138 = $[275];
        }
        let t139;
        if ($[276] !== t128 || $[277] !== t138) {
            t139 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t125,
                children: [
                    t128,
                    t138
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1634,
                columnNumber: 14
            }, this);
            $[276] = t128;
            $[277] = t138;
            $[278] = t139;
        } else {
            t139 = $[278];
        }
        if ($[279] !== t121 || $[280] !== t124 || $[281] !== t139) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai2",
                style: t119,
                children: [
                    t121,
                    t124,
                    t139
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1642,
                columnNumber: 13
            }, this);
            $[279] = t121;
            $[280] = t124;
            $[281] = t139;
            $[282] = t21;
        } else {
            t21 = $[282];
        }
        let t140;
        if ($[283] === Symbol.for("react.memo_cache_sentinel")) {
            t140 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[283] = t140;
        } else {
            t140 = $[283];
        }
        let t141;
        if ($[284] !== t) {
            t141 = t("3. Ph\xE9p Hi\u1EC7u (A \\ B)", "3. Difference (A \\ B)");
            $[284] = t;
            $[285] = t141;
        } else {
            t141 = $[285];
        }
        let t142;
        if ($[286] !== t141) {
            t142 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t141
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1670,
                columnNumber: 14
            }, this);
            $[286] = t141;
            $[287] = t142;
        } else {
            t142 = $[287];
        }
        let t143;
        if ($[288] !== t) {
            t143 = t("Hi\u1EC7u hai t\u1EADp h\u1EE3p", "Difference of two sets");
            $[288] = t;
            $[289] = t143;
        } else {
            t143 = $[289];
        }
        let t144;
        if ($[290] !== t) {
            t144 = t("A \\ B l\xE0 t\u1EADp h\u1EE3p g\u1ED3m c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c A nh\u01B0ng kh\xF4ng thu\u1ED9c B.", "A \\ B is the set of elements in A but not in B.");
            $[290] = t;
            $[291] = t144;
        } else {
            t144 = $[291];
        }
        let t145;
        if ($[292] !== t143 || $[293] !== t144) {
            t145 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OpCard, {
                op: t143,
                sym: "\\\\",
                defn: t144,
                formula: "A \\\\ B = {x | x \u2208 A v\xE0 x \u2209 B} = A \u2229 C\u1D64(B)",
                example: "A={1,2,3,4}, B={2,4} \u2192 A \\\\ B",
                result: "{1,3}"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1694,
                columnNumber: 14
            }, this);
            $[292] = t143;
            $[293] = t144;
            $[294] = t145;
        } else {
            t145 = $[294];
        }
        let t146;
        if ($[295] === Symbol.for("react.memo_cache_sentinel")) {
            t146 = {
                padding: 14,
                borderRadius: 10,
                background: "#fdf2f2",
                fontSize: 15,
                color: "#922b21"
            };
            $[295] = t146;
        } else {
            t146 = $[295];
        }
        let t147;
        if ($[296] !== t) {
            t147 = t("Ch\xFA \xFD: A \\ B \u2260 B \\ A (ph\xE9p hi\u1EC7u KH\xD4NG c\xF3 t\xEDnh giao ho\xE1n)", "Note: A \\ B \u2260 B \\ A (difference is NOT commutative)");
            $[296] = t;
            $[297] = t147;
        } else {
            t147 = $[297];
        }
        let t148;
        if ($[298] !== t147) {
            t148 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t146,
                children: [
                    "⚠️ ",
                    t147
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1724,
                columnNumber: 14
            }, this);
            $[298] = t147;
            $[299] = t148;
        } else {
            t148 = $[299];
        }
        if ($[300] !== t142 || $[301] !== t145 || $[302] !== t148) {
            t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai3",
                style: t140,
                children: [
                    t142,
                    t145,
                    t148
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1731,
                columnNumber: 13
            }, this);
            $[300] = t142;
            $[301] = t145;
            $[302] = t148;
            $[303] = t22;
        } else {
            t22 = $[303];
        }
        let t149;
        if ($[304] === Symbol.for("react.memo_cache_sentinel")) {
            t149 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[304] = t149;
        } else {
            t149 = $[304];
        }
        let t150;
        if ($[305] !== t) {
            t150 = t("4. Ph\u1EA7n B\xF9 C\u1D64(A)", "4. Complement C\u1D64(A)");
            $[305] = t;
            $[306] = t150;
        } else {
            t150 = $[306];
        }
        let t151;
        if ($[307] !== t150) {
            t151 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t150
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1759,
                columnNumber: 14
            }, this);
            $[307] = t150;
            $[308] = t151;
        } else {
            t151 = $[308];
        }
        let t152;
        let t153;
        if ($[309] === Symbol.for("react.memo_cache_sentinel")) {
            t152 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t153 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[309] = t152;
            $[310] = t153;
        } else {
            t152 = $[309];
            t153 = $[310];
        }
        let t154;
        if ($[311] !== t) {
            t154 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[311] = t;
            $[312] = t154;
        } else {
            t154 = $[312];
        }
        let t155;
        if ($[313] !== t154) {
            t155 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t153,
                children: [
                    "📌 ",
                    t154
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1797,
                columnNumber: 14
            }, this);
            $[313] = t154;
            $[314] = t155;
        } else {
            t155 = $[314];
        }
        let t156;
        if ($[315] === Symbol.for("react.memo_cache_sentinel")) {
            t156 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[315] = t156;
        } else {
            t156 = $[315];
        }
        let t157;
        if ($[316] !== t) {
            t157 = t("Cho t\u1EADp h\u1EE3p to\xE0n th\u1EC3 U v\xE0 A \u2282 U. Ph\u1EA7n b\xF9 c\u1EE7a A trong U l\xE0 t\u1EADp g\u1ED3m c\xE1c ph\u1EA7n t\u1EED thu\u1ED9c U nh\u01B0ng kh\xF4ng thu\u1ED9c A.", "Given universe U and A \u2282 U, the complement of A in U is the set of elements in U but not in A.");
            $[316] = t;
            $[317] = t157;
        } else {
            t157 = $[317];
        }
        let t158;
        if ($[318] !== t157) {
            t158 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t156,
                children: t157
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1823,
                columnNumber: 14
            }, this);
            $[318] = t157;
            $[319] = t158;
        } else {
            t158 = $[319];
        }
        let t159;
        let t160;
        if ($[320] === Symbol.for("react.memo_cache_sentinel")) {
            t159 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 16,
                    color: "#0B4F5C",
                    margin: "10px 0",
                    padding: "8px 14px",
                    background: "white",
                    borderRadius: 8
                },
                children: [
                    "Cᵤ(A) = U \\\\ A = ",
                    "{x | x \u2208 U v\xE0 x \u2209 A}"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1832,
                columnNumber: 14
            }, this);
            t160 = {
                fontSize: 15,
                color: "#555"
            };
            $[320] = t159;
            $[321] = t160;
        } else {
            t159 = $[320];
            t160 = $[321];
        }
        let t161;
        if ($[322] === Symbol.for("react.memo_cache_sentinel")) {
            t161 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t160,
                children: [
                    "📘 U = ",
                    "{1,2,3,4,5}",
                    ", A = ",
                    "{1,3,5}",
                    " → Cᵤ(A) = ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "{2,4}"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 1853,
                        columnNumber: 82
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1853,
                columnNumber: 14
            }, this);
            $[322] = t161;
        } else {
            t161 = $[322];
        }
        let t162;
        if ($[323] !== t155 || $[324] !== t158) {
            t162 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t152,
                children: [
                    t155,
                    t158,
                    t159,
                    t161
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1860,
                columnNumber: 14
            }, this);
            $[323] = t155;
            $[324] = t158;
            $[325] = t162;
        } else {
            t162 = $[325];
        }
        let t163;
        let t164;
        if ($[326] === Symbol.for("react.memo_cache_sentinel")) {
            t163 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t164 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[326] = t163;
            $[327] = t164;
        } else {
            t163 = $[326];
            t164 = $[327];
        }
        let t165;
        if ($[328] !== t) {
            t165 = t("\u0110\u1ECBnh lu\u1EADt De Morgan", "De Morgan's Laws");
            $[328] = t;
            $[329] = t165;
        } else {
            t165 = $[329];
        }
        let t166;
        if ($[330] !== t165) {
            t166 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t164,
                children: [
                    "🔁 ",
                    t165
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1897,
                columnNumber: 14
            }, this);
            $[330] = t165;
            $[331] = t166;
        } else {
            t166 = $[331];
        }
        let t167;
        if ($[332] === Symbol.for("react.memo_cache_sentinel")) {
            t167 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
                transition: "all 0.3s ease"
            };
            $[332] = t167;
        } else {
            t167 = $[332];
        }
        let t168;
        if ($[333] !== t) {
            t168 = t("Ph\u1EA7n b\xF9 c\u1EE7a h\u1EE3p = giao c\u1EE7a hai ph\u1EA7n b\xF9", "Complement of union = intersection of complements");
            $[333] = t;
            $[334] = t168;
        } else {
            t168 = $[334];
        }
        let t169;
        if ($[335] !== t168) {
            t169 = {
                law: "C\u1D64(A \u222A B) = C\u1D64(A) \u2229 C\u1D64(B)",
                desc: t168
            };
            $[335] = t168;
            $[336] = t169;
        } else {
            t169 = $[336];
        }
        let t170;
        if ($[337] !== t) {
            t170 = t("Ph\u1EA7n b\xF9 c\u1EE7a giao = h\u1EE3p c\u1EE7a hai ph\u1EA7n b\xF9", "Complement of intersection = union of complements");
            $[337] = t;
            $[338] = t170;
        } else {
            t170 = $[338];
        }
        let t171;
        if ($[339] !== t170) {
            t171 = {
                law: "C\u1D64(A \u2229 B) = C\u1D64(A) \u222A C\u1D64(B)",
                desc: t170
            };
            $[339] = t170;
            $[340] = t171;
        } else {
            t171 = $[340];
        }
        let t172;
        if ($[341] !== t169 || $[342] !== t171) {
            t172 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t167,
                children: [
                    t169,
                    t171
                ].map(_Lesson3_PhepToanTapHopAnonymous4)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1955,
                columnNumber: 14
            }, this);
            $[341] = t169;
            $[342] = t171;
            $[343] = t172;
        } else {
            t172 = $[343];
        }
        let t173;
        if ($[344] !== t166 || $[345] !== t172) {
            t173 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t163,
                children: [
                    t166,
                    t172
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1964,
                columnNumber: 14
            }, this);
            $[344] = t166;
            $[345] = t172;
            $[346] = t173;
        } else {
            t173 = $[346];
        }
        if ($[347] !== t151 || $[348] !== t162 || $[349] !== t173) {
            t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai4",
                style: t149,
                children: [
                    t151,
                    t162,
                    t173
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 1972,
                columnNumber: 13
            }, this);
            $[347] = t151;
            $[348] = t162;
            $[349] = t173;
            $[350] = t23;
        } else {
            t23 = $[350];
        }
        let t174;
        if ($[351] === Symbol.for("react.memo_cache_sentinel")) {
            t174 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[351] = t174;
        } else {
            t174 = $[351];
        }
        let t175;
        if ($[352] !== t) {
            t175 = t("Th\u1EF1c H\xE0nh", "Practice Exercises");
            $[352] = t;
            $[353] = t175;
        } else {
            t175 = $[353];
        }
        let t176;
        if ($[354] !== t175) {
            t176 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\u270F\uFE0F",
                title: t175
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2000,
                columnNumber: 14
            }, this);
            $[354] = t175;
            $[355] = t176;
        } else {
            t176 = $[355];
        }
        let t177;
        if ($[356] === Symbol.for("react.memo_cache_sentinel")) {
            t177 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 40,
                transition: "all 0.3s ease"
            };
            $[356] = t177;
        } else {
            t177 = $[356];
        }
        let t178;
        if ($[357] !== revealedAnswers || $[358] !== t) {
            t178 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t177,
                children: [
                    {
                        id: "e1",
                        q: t("Cho A = {1,2,3,4,5}, B = {3,4,5,6,7}.\nT\xEDnh: A \u222A B, A \u2229 B, A \\ B, B \\ A.", "Let A = {1,2,3,4,5}, B = {3,4,5,6,7}.\nFind: A \u222A B, A \u2229 B, A \\ B, B \\ A."),
                        a: [
                            "A \u222A B = {1,2,3,4,5,6,7}",
                            "A \u2229 B = {3,4,5}",
                            "A \\ B = {1,2}",
                            "B \\ A = {6,7}"
                        ]
                    },
                    {
                        id: "e2",
                        q: t("L\u1EDBp 10A c\xF3 40 h\u1ECDc sinh, 25 h\u1ECDc To\xE1n, 20 h\u1ECDc V\u0103n, 10 h\u1ECDc c\u1EA3 hai. C\xF3 bao nhi\xEAu h\u1ECDc sinh h\u1ECDc \xEDt nh\u1EA5t m\u1ED9t trong hai m\xF4n?", "Class 10A: 40 students, 25 study Math, 20 study Literature, 10 study both. How many study at least one?"),
                        a: [
                            t("|M \u222A V| = |M| + |V| \u2212 |M \u2229 V| = 25 + 20 \u2212 10 = 35 h\u1ECDc sinh.", "| M \u222A V| = |M| + |V| \u2212 |M \u2229 V| = 25 + 20 \u2212 10 = 35 students.")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("Cho U = {1,2,3,4,5,6,7,8}, A = {1,3,5,7}.\nT\xECm C\u1D64(A) v\xE0 ki\u1EC3m tra C\u1D64(C\u1D64(A)) = A.", "Let U = {1,2,3,4,5,6,7,8}, A = {1,3,5,7}.\nFind C\u1D64(A) and verify C\u1D64(C\u1D64(A)) = A."),
                        a: [
                            "C\u1D64(A) = {2,4,6,8}",
                            "C\u1D64(C\u1D64(A)) = C\u1D64({2,4,6,8}) = {1,3,5,7} = A \u2713"
                        ]
                    }
                ].map({
                    "Lesson3_PhepToanTapHop[(anonymous)()]": (t179)=>{
                        const { id: id_3, q: q_1, a } = t179;
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2044,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14
                                            },
                                            children: t("To\xE1n 10", "Grade 10")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2048,
                                            columnNumber: 63
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                marginTop: 10,
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: q_1
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2051,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2039,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson3_PhepToanTapHop[(anonymous)() > <button>.onClick]": ()=>toggleAnswer(id_3)
                                    }["Lesson3_PhepToanTapHop[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2056,
                                    columnNumber: 37
                                }, this),
                                revealedAnswers[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a.map(_Lesson3_PhepToanTapHopAnonymousAMap)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2069,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2039,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson3_PhepToanTapHop[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2020,
                columnNumber: 14
            }, this);
            $[357] = revealedAnswers;
            $[358] = t;
            $[359] = t178;
        } else {
            t178 = $[359];
        }
        if ($[360] !== t176 || $[361] !== t178) {
            t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "thucHanh",
                style: t174,
                children: [
                    t176,
                    t178
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2083,
                columnNumber: 13
            }, this);
            $[360] = t176;
            $[361] = t178;
            $[362] = t24;
        } else {
            t24 = $[362];
        }
        t7 = "miniGame";
        if ($[363] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[363] = t8;
        } else {
            t8 = $[363];
        }
        let t179;
        if ($[364] !== t) {
            t179 = t("Mini Game", "Mini Game");
            $[364] = t;
            $[365] = t179;
        } else {
            t179 = $[365];
        }
        if ($[366] !== t179) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83C\uDFAE",
                title: t179
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2109,
                columnNumber: 12
            }, this);
            $[366] = t179;
            $[367] = t9;
        } else {
            t9 = $[367];
        }
        let t180;
        if ($[368] === Symbol.for("react.memo_cache_sentinel")) {
            t180 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s ease"
            };
            $[368] = t180;
        } else {
            t180 = $[368];
        }
        let t181;
        if ($[369] !== t) {
            t181 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[369] = t;
            $[370] = t181;
        } else {
            t181 = $[370];
        }
        let t182;
        if ($[371] !== t) {
            t182 = t("5 c\xE2u h\u1ECFi", "5 questions");
            $[371] = t;
            $[372] = t182;
        } else {
            t182 = $[372];
        }
        let t183;
        if ($[373] !== t181 || $[374] !== t182) {
            t183 = [
                "mc",
                "\uD83E\uDDE9",
                t181,
                t182
            ];
            $[373] = t181;
            $[374] = t182;
            $[375] = t183;
        } else {
            t183 = $[375];
        }
        let t184;
        if ($[376] !== t) {
            t184 = t("\u0110\xFAng / Sai", "True / False");
            $[376] = t;
            $[377] = t184;
        } else {
            t184 = $[377];
        }
        let t185;
        if ($[378] !== t) {
            t185 = t("5 th\u1EBB", "5 cards");
            $[378] = t;
            $[379] = t185;
        } else {
            t185 = $[379];
        }
        let t186;
        if ($[380] !== t184 || $[381] !== t185) {
            t186 = [
                "tf",
                "\uD83C\uDCCF",
                t184,
                t185
            ];
            $[380] = t184;
            $[381] = t185;
            $[382] = t186;
        } else {
            t186 = $[382];
        }
        let t187;
        if ($[383] !== t) {
            t187 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[383] = t;
            $[384] = t187;
        } else {
            t187 = $[384];
        }
        let t188;
        if ($[385] !== t) {
            t188 = t("3 c\xE2u", "3 items");
            $[385] = t;
            $[386] = t188;
        } else {
            t188 = $[386];
        }
        let t189;
        if ($[387] !== t187 || $[388] !== t188) {
            t189 = [
                "fill",
                "\u270D\uFE0F",
                t187,
                t188
            ];
            $[387] = t187;
            $[388] = t188;
            $[389] = t189;
        } else {
            t189 = $[389];
        }
        let t190;
        if ($[390] !== t183 || $[391] !== t186 || $[392] !== t189) {
            t190 = [
                t183,
                t186,
                t189
            ];
            $[390] = t183;
            $[391] = t186;
            $[392] = t189;
            $[393] = t190;
        } else {
            t190 = $[393];
        }
        if ($[394] !== gameMode || $[395] !== t190) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t180,
                children: t190.map({
                    "Lesson3_PhepToanTapHop[(anonymous)()]": (t191)=>{
                        const [mode, icon_1, label_0, sub] = t191;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson3_PhepToanTapHop[(anonymous)() > <article>.onClick]": ()=>setGameMode(mode)
                            }["Lesson3_PhepToanTapHop[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2226,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2229,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2232,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2217,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson3_PhepToanTapHop[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2214,
                columnNumber: 13
            }, this);
            $[394] = gameMode;
            $[395] = t190;
            $[396] = t10;
        } else {
            t10 = $[396];
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2249,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2253,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQuestions[mcIndex].options.map({
                            "Lesson3_PhepToanTapHop[(anonymous)()]": (opt, i_7)=>{
                                let bg = "white";
                                let color = "black";
                                if (mcSelected !== null) {
                                    if (i_7 === mcQuestions[mcIndex].answer) {
                                        bg = "#eafaf1";
                                        color = "#1e8449";
                                    } else {
                                        if (i_7 === mcSelected) {
                                            bg = "#fdf2f2";
                                            color = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson3_PhepToanTapHop[(anonymous)() > <button>.onClick]": ()=>handleMcSelect(i_7)
                                    }["Lesson3_PhepToanTapHop[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color,
                                        fontSize: 15,
                                        fontWeight: mcSelected !== null && (i_7 === mcSelected || i_7 === mcQuestions[mcIndex].answer) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "all 0.15s"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_7),
                                        ". ",
                                        opt
                                    ]
                                }, i_7, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2276,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson3_PhepToanTapHop[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2257,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                lineNumber: 2292,
                                columnNumber: 87
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                lineNumber: 2300,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2313,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2318,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2322,
                        columnNumber: 271
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2310,
                columnNumber: 157
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2244,
            columnNumber: 32
        }, this);
        if ($[397] !== gameMode || $[398] !== handleTfAnswer || $[399] !== handleTfNext || $[400] !== t || $[401] !== tfCards || $[402] !== tfDone || $[403] !== tfFlipped || $[404] !== tfIndex || $[405] !== tfScore) {
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2337,
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2348,
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
                                                "Lesson3_PhepToanTapHop[<button>.onClick]": ()=>handleTfAnswer(true)
                                            }["Lesson3_PhepToanTapHop[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2356,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: {
                                                "Lesson3_PhepToanTapHop[<button>.onClick]": ()=>handleTfAnswer(false)
                                            }["Lesson3_PhepToanTapHop[<button>.onClick]"],
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2367,
                                            columnNumber: 56
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2352,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2378,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2387,
                                            columnNumber: 53
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2341,
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2399,
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2404,
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2408,
                            columnNumber: 188
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                    lineNumber: 2396,
                    columnNumber: 169
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2332,
                columnNumber: 34
            }, this);
            $[397] = gameMode;
            $[398] = handleTfAnswer;
            $[399] = handleTfNext;
            $[400] = t;
            $[401] = tfCards;
            $[402] = tfDone;
            $[403] = tfFlipped;
            $[404] = tfIndex;
            $[405] = tfScore;
            $[406] = t12;
        } else {
            t12 = $[406];
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
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                    lineNumber: 2435,
                    columnNumber: 8
                }, this),
                fillQuestions.map({
                    "Lesson3_PhepToanTapHop[fillQuestions.map()]": (q_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    children: q_2.template
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2442,
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
                                            value: fillAnswers[q_2.id] || "",
                                            onChange: {
                                                "Lesson3_PhepToanTapHop[fillQuestions.map() > <input>.onChange]": (e_1)=>setFillAnswers({
                                                        "Lesson3_PhepToanTapHop[fillQuestions.map() > <input>.onChange > setFillAnswers()]": (p_0)=>({
                                                                ...p_0,
                                                                [q_2.id]: e_1.target.value
                                                            })
                                                    }["Lesson3_PhepToanTapHop[fillQuestions.map() > <input>.onChange > setFillAnswers()]"])
                                            }["Lesson3_PhepToanTapHop[fillQuestions.map() > <input>.onChange]"],
                                            placeholder: t("Nh\u1EADp \u0111\xE1p \xE1n...", "Enter answer..."),
                                            style: {
                                                flex: 1,
                                                padding: "12px 16px",
                                                borderRadius: 8,
                                                fontSize: 15,
                                                outline: "none",
                                                border: fillChecked ? `2px solid ${checkFill(q_2.id) ? "#1e8449" : "#922b21"}` : "1px solid #ddd",
                                                background: fillChecked ? checkFill(q_2.id) ? "#eafaf1" : "#fdf2f2" : "white",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2450,
                                            columnNumber: 14
                                        }, this),
                                        fillChecked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 13,
                                                fontWeight: 700,
                                                background: checkFill(q_2.id) ? "#eafaf1" : "#fdf2f2",
                                                color: checkFill(q_2.id) ? "#1e8449" : "#922b21",
                                                padding: "4px 12px",
                                                borderRadius: 20,
                                                whiteSpace: "nowrap"
                                            },
                                            children: checkFill(q_2.id) ? "\u2713 \u0110\xFAng" : `✗ → ${q_2.answer}`
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                            lineNumber: 2466,
                                            columnNumber: 34
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2446,
                                    columnNumber: 34
                                }, this),
                                fillChecked && !checkFill(q_2.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        q_2.hint
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                                    lineNumber: 2474,
                                    columnNumber: 133
                                }, this)
                            ]
                        }, q_2.id, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2440,
                            columnNumber: 63
                        }, this)
                }["Lesson3_PhepToanTapHop[fillQuestions.map()]"]),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 12
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson3_PhepToanTapHop[<button>.onClick]": ()=>setFillChecked(true)
                            }["Lesson3_PhepToanTapHop[<button>.onClick]"],
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2483,
                            columnNumber: 10
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Lesson3_PhepToanTapHop[<button>.onClick]": ()=>{
                                    setFillAnswers({});
                                    setFillChecked(false);
                                }
                            }["Lesson3_PhepToanTapHop[<button>.onClick]"],
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
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                            lineNumber: 2493,
                            columnNumber: 58
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                    lineNumber: 2480,
                    columnNumber: 57
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2430,
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
        $[41] = t7;
        $[42] = t8;
        $[43] = t9;
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
        t7 = $[41];
        t8 = $[42];
        t9 = $[43];
    }
    let t26;
    if ($[407] !== t10 || $[408] !== t11 || $[409] !== t12 || $[410] !== t13 || $[411] !== t7 || $[412] !== t8 || $[413] !== t9) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2566,
            columnNumber: 11
        }, this);
        $[407] = t10;
        $[408] = t11;
        $[409] = t12;
        $[410] = t13;
        $[411] = t7;
        $[412] = t8;
        $[413] = t9;
        $[414] = t26;
    } else {
        t26 = $[414];
    }
    let t27;
    if ($[415] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2580,
            columnNumber: 11
        }, this);
        $[415] = t27;
    } else {
        t27 = $[415];
    }
    let t28;
    if ($[416] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[416] = t28;
    } else {
        t28 = $[416];
    }
    let t29;
    if ($[417] !== t) {
        t29 = t("B\xE0i 3 / Ch\u01B0\u01A1ng I", "Lesson 3 / Chapter I");
        $[417] = t;
        $[418] = t29;
    } else {
        t29 = $[418];
    }
    let t30;
    if ($[419] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t28,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2609,
            columnNumber: 11
        }, this);
        $[419] = t29;
        $[420] = t30;
    } else {
        t30 = $[420];
    }
    let t31;
    let t32;
    if ($[421] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n          .reveal { opacity:0; transform:translateY(28px) scale(0.97); transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1); will-change:opacity,transform; }\n          .reveal.visible { opacity:1; transform:translateY(0) scale(1); }\n          .reveal[data-reveal-stagger].visible { opacity:1; transform:none; }\n          .reveal[data-reveal-stagger] > * { opacity:0; transform:translateY(24px) scale(0.97); will-change:opacity,transform; }\n          header.reveal { transform:translateY(-18px); opacity:0; }\n          header.reveal.visible { opacity:1; transform:translateY(0); }\n          article { transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease; border-radius:10px; padding:8px; }\n          article:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 12px 28px rgba(0,0,0,0.12); }\n        "
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2618,
            columnNumber: 11
        }, this);
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2619,
            columnNumber: 11
        }, this);
        $[421] = t31;
        $[422] = t32;
    } else {
        t31 = $[421];
        t32 = $[422];
    }
    let t33;
    if ($[423] !== t14 || $[424] !== t15 || $[425] !== t16 || $[426] !== t17 || $[427] !== t18 || $[428] !== t19 || $[429] !== t20 || $[430] !== t21 || $[431] !== t22 || $[432] !== t23 || $[433] !== t24 || $[434] !== t26 || $[435] !== t30) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                t26,
                t27,
                t30,
                t31,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2628,
            columnNumber: 11
        }, this);
        $[423] = t14;
        $[424] = t15;
        $[425] = t16;
        $[426] = t17;
        $[427] = t18;
        $[428] = t19;
        $[429] = t20;
        $[430] = t21;
        $[431] = t22;
        $[432] = t23;
        $[433] = t24;
        $[434] = t26;
        $[435] = t30;
        $[436] = t33;
    } else {
        t33 = $[436];
    }
    let t34;
    if ($[437] !== t25 || $[438] !== t33) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t25,
            children: t33
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
            lineNumber: 2648,
            columnNumber: 11
        }, this);
        $[437] = t25;
        $[438] = t33;
        $[439] = t34;
    } else {
        t34 = $[439];
    }
    return t34;
}
_s(Lesson3_PhepToanTapHop, "o9ln2GYkrW8yJye2B9T4lwZLUUE=");
_c2 = Lesson3_PhepToanTapHop;
function _Lesson3_PhepToanTapHopAnonymousAMap(line, i_6) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: line
    }, i_6, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2658,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopAnonymous4(item, i_5) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: "14px 18px",
            borderRadius: 10,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 16,
                    color: "#0B4F5C",
                    marginBottom: 6
                },
                children: item.law
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2671,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    color: "#777"
                },
                children: item.desc
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2676,
                columnNumber: 24
            }, this)
        ]
    }, i_5, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2665,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopAnonymous3(t0) {
    const [formula_1, name_0] = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: "12px 16px",
            borderRadius: 10,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 15,
                    color: "#0B4F5C",
                    marginBottom: 4
                },
                children: formula_1
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2689,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#777"
                },
                children: name_0
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2694,
                columnNumber: 25
            }, this)
        ]
    }, formula_1, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2683,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopAnonymous2(t0) {
    const [formula_0, name] = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: "12px 16px",
            borderRadius: 10,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 15,
                    color: "#0B4F5C",
                    marginBottom: 4
                },
                children: formula_0
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2707,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#777"
                },
                children: name
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2712,
                columnNumber: 25
            }, this)
        ]
    }, formula_0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2701,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson3_PhepToanTapHopTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson3_PhepToanTapHopAnonymous(obj, i_4) {
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
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2726,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopOpCard(t0) {
    const { op, sym, defn, formula, example, result } = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "reveal",
        "data-reveal": true,
        style: {
            padding: 20,
            borderRadius: 10,
            background: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: 20
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    marginBottom: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 36,
                            fontWeight: 700,
                            color: "#0B4F5C"
                        },
                        children: sym
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2752,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 18,
                            fontWeight: 600
                        },
                        children: op
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2756,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2747,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 16,
                    lineHeight: 1.8,
                    marginBottom: 10
                },
                children: defn
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2759,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 16,
                    background: "white",
                    padding: "8px 14px",
                    borderRadius: 8,
                    marginBottom: 10,
                    color: "#0B4F5C"
                },
                children: formula
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2763,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    color: "#555"
                },
                children: [
                    "📘 ",
                    example,
                    " = ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: result
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                        lineNumber: 2774,
                        columnNumber: 23
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2771,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2741,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopSectionHeader(t0) {
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2791,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
                lineNumber: 2791,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js",
        lineNumber: 2781,
        columnNumber: 10
    }, this);
}
function _Lesson3_PhepToanTapHopHandleTfNextSetTfIndex(i_3) {
    return i_3 + 1;
}
function _Lesson3_PhepToanTapHopHandleTfAnswerSetTfScore(s_0) {
    return s_0 + 1;
}
function _Lesson3_PhepToanTapHopHandleMcNextSetMcIndex(i_2) {
    return i_2 + 1;
}
function _Lesson3_PhepToanTapHopHandleMcSelectSetMcScore(s) {
    return s + 1;
}
function _Lesson3_PhepToanTapHopScrollTo(id_0) {
    const el_2 = document.getElementById(id_0);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson3_PhepToanTapHopUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson3_PhepToanTapHopUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp4, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson3_PhepToanTapHop[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson3_PhepToanTapHop[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp4(entries, observer) {
    entries.forEach({
        "Lesson3_PhepToanTapHop[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson3_PhepToanTapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "Lesson3_PhepToanTapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson3_PhepToanTapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["Lesson3_PhepToanTapHop[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson3_PhepToanTapHop[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson3_PhepToanTapHopUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson3_PhepToanTapHop[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["Lesson3_PhepToanTapHop[useEffect() > els.forEach() > (anonymous)()]"]);
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
__turbopack_context__.k.register(_c2, "Lesson3_PhepToanTapHop");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/duosteam/src/app/phep-toan-tap-hop/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PhepToanTapHopPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$Cacbaitoan10$2f$Lesson3_PhepToanTapHop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/Cacbaitoan10/Lesson3_PhepToanTapHop.js [app-client] (ecmascript)");
"use client";
;
;
;
function PhepToanTapHopPage() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "7c454e8fc1b264837b17d31a4755b561f4e3d149019c62d668a59e4e76bf08db") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7c454e8fc1b264837b17d31a4755b561f4e3d149019c62d668a59e4e76bf08db";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$Cacbaitoan10$2f$Lesson3_PhepToanTapHop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/app/phep-toan-tap-hop/page.js",
            lineNumber: 15,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = PhepToanTapHopPage;
var _c;
__turbopack_context__.k.register(_c, "PhepToanTapHopPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_c83b9847._.js.map