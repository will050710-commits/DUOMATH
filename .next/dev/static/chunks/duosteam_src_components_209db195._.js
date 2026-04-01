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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson6_OnTapChuong2
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
    if ($[0] !== "3addfc4ed91996008445e966f54c3ebe642588ebbfcd74ae3f46d9636455b063") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3addfc4ed91996008445e966f54c3ebe642588ebbfcd74ae3f46d9636455b063";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
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
function Lesson6_OnTapChuong2() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(278);
    if ($[0] !== "3addfc4ed91996008445e966f54c3ebe642588ebbfcd74ae3f46d9636455b063") {
        for(let $i = 0; $i < 278; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3addfc4ed91996008445e966f54c3ebe642588ebbfcd74ae3f46d9636455b063";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson6_OnTapChuong2UseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson6_OnTapChuong2[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson6_OnTapChuong2[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson6_OnTapChuong2[toggleAnswer]": (id)=>setRevealedAnswers({
                    "Lesson6_OnTapChuong2[toggleAnswer > setRevealedAnswers()]": (p)=>({
                            ...p,
                            [id]: !p[id]
                        })
                }["Lesson6_OnTapChuong2[toggleAnswer > setRevealedAnswers()]"])
        })["Lesson6_OnTapChuong2[toggleAnswer]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const toggleAnswer = t6;
    const scrollTo = _Lesson6_OnTapChuong2ScrollTo;
    let ResultSummary;
    let fillQuestions;
    let fillResultItems;
    let fillScore;
    let handleTfAnswer;
    let handleTfNext;
    let resetTf;
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
    let t7;
    let t8;
    let t9;
    let tfCards;
    let tfResultItems;
    if ($[9] !== fillAnswers || $[10] !== fillChecked || $[11] !== gameMode || $[12] !== lang || $[13] !== mcDone || $[14] !== mcHistory || $[15] !== mcIndex || $[16] !== mcScore || $[17] !== mcSelected || $[18] !== revealedAnswers || $[19] !== t || $[20] !== tfFlipped || $[21] !== tfHistory || $[22] !== tfIndex) {
        const mcQuestions = [
            {
                q: t("BPT 3x \u2212 y > 6. \u0110i\u1EC3m n\xE0o sau \u0111\xE2y l\xE0 nghi\u1EC7m?", "BPT 3x \u2212 y > 6. Which point is a solution?"),
                options: [
                    "(2, 0)",
                    "(3, 1)",
                    "(0, \u22127)",
                    "(1, \u22123)"
                ],
                answer: 2,
                explain: t("(0,\u22127): 3(0)\u2212(\u22127)=7>6 \u2713. C\xE1c \u0111i\u1EC3m kh\xE1c: (2,0)\u21926\u226F6; (3,1)\u21928>6 \u2713 \u2014 c\u0169ng \u0111\xFAng! Nh\u01B0ng (0,\u22127) l\xE0 \u0111\xE1p \xE1n s\u1EAFp x\u1EBFp \u0111\u1EA7u ti\xEAn.", "(0,\u22127): 3(0)\u2212(\u22127)=7>6 \u2713. Note: (3,1) also works \u2192 check carefully.")
            },
            {
                q: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT x \u2212 y \u2264 0 l\xE0 v\xF9ng ch\u1EE9a \u0111i\u1EC3m n\xE0o?", "The solution region of x \u2212 y \u2264 0 contains which point?"),
                options: [
                    "(2, 1)",
                    "(3, \u22121)",
                    "(0, 1)",
                    "(5, 2)"
                ],
                answer: 2,
                explain: t("(0,1): 0\u22121=\u22121\u22640 \u2713. (2,1): 1\u22700. (3,\u22121): 4\u22700. (5,2): 3\u22700.", "(0,1): 0\u22121=\u22121\u22640 \u2713.")
            },
            {
                q: t("H\u1EC7 {x+y \u2264 3; x\u2212y \u2265 1; x \u2265 0}. \u0110i\u1EC3m n\xE0o thu\u1ED9c mi\u1EC1n nghi\u1EC7m?", "System {x+y \u2264 3; x\u2212y \u2265 1; x \u2265 0}. Which point is in the region?"),
                options: [
                    "(0, 3)",
                    "(2, 0)",
                    "(1, 2)",
                    "(\u22121, 0)"
                ],
                answer: 1,
                explain: t("(2,0): \u24602+0=2\u22643\u2713 \u24612\u22120=2\u22651\u2713 \u24622\u22650\u2713 \u2014 th\u1ECFa c\u1EA3 3.", "(2,0): \u24602\u22643\u2713 \u24612\u22651\u2713 \u24622\u22650\u2713 \u2014 all 3 satisfied.")
            },
            {
                q: t("\u0110\u1EC3 bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT ax+by+c<0, \u0111\u01B0\u1EDDng bi\xEAn \u0111\u01B0\u1EE3c v\u1EBD nh\u01B0 th\u1EBF n\xE0o?", "To graph ax+by+c<0, the boundary is drawn as?"),
                options: [
                    t("\u0110\u01B0\u1EDDng li\u1EC1n n\xE9t (thu\u1ED9c mi\u1EC1n nghi\u1EC7m)", "Solid line (included)"),
                    t("\u0110\u01B0\u1EDDng n\xE9t \u0111\u1EE9t (kh\xF4ng thu\u1ED9c mi\u1EC1n nghi\u1EC7m)", "Dashed line (excluded)"),
                    t("\u0110\u01B0\u1EDDng n\xE9t \u0111\xF4i", "Double line"),
                    t("Kh\xF4ng c\u1EA7n v\u1EBD \u0111\u01B0\u1EDDng bi\xEAn", "No boundary needed")
                ],
                answer: 1,
                explain: t("D\u1EA5u < (ho\u1EB7c >) \u2192 \u0111\u01B0\u1EDDng bi\xEAn kh\xF4ng thu\u1ED9c mi\u1EC1n nghi\u1EC7m \u2192 v\u1EBD n\xE9t \u0111\u1EE9t.", "< or > \u2192 boundary excluded \u2192 draw dashed line.")
            },
            {
                q: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 {x\u22650; y\u22650; x+y\u22644} c\xF3 bao nhi\xEAu \u0111\u1EC9nh?", "How many vertices does the solution region of {x\u22650; y\u22650; x+y\u22644} have?"),
                options: [
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                answer: 1,
                explain: t("Ba \u0111\u01B0\u1EDDng bi\xEAn giao nhau t\u1EA1o 3 \u0111\u1EC9nh: O(0,0), A(4,0), B(0,4) \u2014 tam gi\xE1c.", "3 boundary lines create 3 vertices: O(0,0), A(4,0), B(0,4) \u2014 a triangle.")
            }
        ];
        tfCards = [
            {
                stmt: t("BPT ax + by + c \u2265 0 c\xF3 mi\u1EC1n nghi\u1EC7m l\xE0 n\u1EEDa m\u1EB7t ph\u1EB3ng \u0110\xD3NG (k\u1EC3 c\u1EA3 \u0111\u01B0\u1EDDng bi\xEAn).", "BPT ax+by+c \u2265 0 has a CLOSED half-plane as solution region (boundary included)."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 d\u1EA5u \u2265 \u2192 \u0111\u01B0\u1EDDng bi\xEAn l\xE0 m\u1ED9t ph\u1EA7n c\u1EE7a mi\u1EC1n nghi\u1EC7m.", "TRUE \u2014 \u2265 means boundary is part of the solution region.")
            },
            {
                stmt: t("H\u1EC7 BPT lu\xF4n c\xF3 nghi\u1EC7m.", "A system of linear inequalities always has solutions."),
                answer: false,
                explain: t("SAI \u2014 h\u1EC7 c\xF3 th\u1EC3 v\xF4 nghi\u1EC7m n\u1EBFu c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng kh\xF4ng giao nhau.", "FALSE \u2014 the system may have no solution if the half-planes don't intersect.")
            },
            {
                stmt: t("\u0110i\u1EC3m n\u1EB1m tr\xEAn \u0111\u01B0\u1EDDng bi\xEAn ax+by+c=0 lu\xF4n l\xE0 nghi\u1EC7m c\u1EE7a c\u1EA3 BPT ax+by+c>0 v\xE0 ax+by+c<0.", "A point on ax+by+c=0 is always a solution of both ax+by+c>0 and ax+by+c<0."),
                answer: false,
                explain: t("SAI \u2014 \u0111i\u1EC3m tr\xEAn \u0111\u01B0\u1EDDng bi\xEAn th\u1ECFa ax+by+c=0, kh\xF4ng th\u1ECFa > hay <.", "FALSE \u2014 points on the boundary satisfy =0, not > or <.")
            },
            {
                stmt: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT l\xE0 giao c\u1EE7a c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng.", "The solution region of a system is the intersection of half-planes."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 \u0111\xE2y l\xE0 \u0111\u1ECBnh ngh\u0129a c\u01A1 b\u1EA3n.", "TRUE \u2014 this is the basic definition.")
            },
            {
                stmt: t("\u0110\u1EC9nh (\u0111i\u1EC3m g\xF3c) c\u1EE7a mi\u1EC1n nghi\u1EC7m l\xE0 giao \u0111i\u1EC3m c\u1EE7a c\xE1c \u0111\u01B0\u1EDDng bi\xEAn.", "The vertices of the solution region are intersections of boundary lines."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 c\xE1c \u0111\u1EC9nh \u0111\u01B0\u1EE3c t\xECm b\u1EB1ng c\xE1ch gi\u1EA3i h\u1EC7 ph\u01B0\u01A1ng tr\xECnh t\u1EEBng c\u1EB7p \u0111\u01B0\u1EDDng bi\xEAn.", "TRUE \u2014 vertices are found by solving systems of pairs of boundary equations.")
            }
        ];
        fillQuestions = [
            {
                id: "f1",
                template: t("BPT b\u1EADc nh\u1EA5t HAI \u1EA9n c\xF3 d\u1EA1ng ax + ___ + c \u2265 0.", "Linear inequality in TWO variables has form ax + ___ + c \u2265 0."),
                answer: "by",
                altAnswers: [
                    "BY"
                ],
                hint: t("\u1EA8n th\u1EE9 hai l\xE0 y, h\u1EC7 s\u1ED1 l\xE0 b.", "Second variable is y with coefficient b.")
            },
            {
                id: "f2",
                template: t("\u0110\u1EC3 ki\u1EC3m tra \u0111i\u1EC3m M(x\u2080,y\u2080) c\xF3 thu\u1ED9c mi\u1EC1n nghi\u1EC7m kh\xF4ng, ta ___ v\xE0o BPT.", "To check if M(x\u2080,y\u2080) is in the solution region, we ___ into the inequality."),
                answer: "thay",
                altAnswers: [
                    "substitute",
                    "thay v\xE0o",
                    "th\u1EBF v\xE0o",
                    "th\u1EBF"
                ],
                hint: t("Thay gi\xE1 tr\u1ECB x\u2080, y\u2080 v\xE0o bi\u1EC3u th\u1EE9c ax+by+c.", "Substitute x\u2080, y\u2080 into ax+by+c.")
            },
            {
                id: "f3",
                template: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT b\u1EB1ng ___ c\u1EE7a c\xE1c mi\u1EC1n nghi\u1EC7m \u0111\u01A1n l\u1EBB.", "Solution region of a system equals the ___ of individual solution regions."),
                answer: "giao",
                altAnswers: [
                    "intersection",
                    "giao nhau",
                    "ph\u1EA7n giao chung"
                ],
                hint: t("Ph\u1EA7n chung c\u1EE7a t\u1EA5t c\u1EA3.", "The common part of all.")
            }
        ];
        const handleMcSelect = {
            "Lesson6_OnTapChuong2[handleMcSelect]": (i_1)=>{
                if (mcSelected !== null) {
                    return;
                }
                setMcSelected(i_1);
                const correct = i_1 === mcQuestions[mcIndex].answer;
                if (correct) {
                    setMcScore(_Lesson6_OnTapChuong2HandleMcSelectSetMcScore);
                }
                setMcHistory({
                    "Lesson6_OnTapChuong2[handleMcSelect > setMcHistory()]": (h)=>[
                            ...h,
                            {
                                q: mcIndex,
                                selected: i_1,
                                correct
                            }
                        ]
                }["Lesson6_OnTapChuong2[handleMcSelect > setMcHistory()]"]);
            }
        }["Lesson6_OnTapChuong2[handleMcSelect]"];
        const handleMcNext = {
            "Lesson6_OnTapChuong2[handleMcNext]": ()=>{
                if (mcIndex + 1 >= mcQuestions.length) {
                    setMcDone(true);
                } else {
                    setMcIndex(_Lesson6_OnTapChuong2HandleMcNextSetMcIndex);
                    setMcSelected(null);
                }
            }
        }["Lesson6_OnTapChuong2[handleMcNext]"];
        let t21;
        if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
            t21 = ({
                "Lesson6_OnTapChuong2[resetMc]": ()=>{
                    setMcIndex(0);
                    setMcSelected(null);
                    setMcScore(0);
                    setMcDone(false);
                    setMcHistory([]);
                }
            })["Lesson6_OnTapChuong2[resetMc]"];
            $[46] = t21;
        } else {
            t21 = $[46];
        }
        const resetMc = t21;
        handleTfAnswer = ({
            "Lesson6_OnTapChuong2[handleTfAnswer]": (ans)=>{
                if (tfFlipped) {
                    return;
                }
                setTfFlipped(true);
                const correct_0 = ans === tfCards[tfIndex].answer;
                if (correct_0) {
                    setTfScore(_Lesson6_OnTapChuong2HandleTfAnswerSetTfScore);
                }
                setTfHistory({
                    "Lesson6_OnTapChuong2[handleTfAnswer > setTfHistory()]": (h_0)=>[
                            ...h_0,
                            {
                                q: tfIndex,
                                given: ans,
                                correct: correct_0
                            }
                        ]
                }["Lesson6_OnTapChuong2[handleTfAnswer > setTfHistory()]"]);
            }
        })["Lesson6_OnTapChuong2[handleTfAnswer]"];
        handleTfNext = ({
            "Lesson6_OnTapChuong2[handleTfNext]": ()=>{
                if (tfIndex + 1 >= tfCards.length) {
                    setTfDone(true);
                } else {
                    setTfIndex(_Lesson6_OnTapChuong2HandleTfNextSetTfIndex);
                    setTfFlipped(false);
                }
            }
        })["Lesson6_OnTapChuong2[handleTfNext]"];
        let t22;
        if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
            t22 = ({
                "Lesson6_OnTapChuong2[resetTf]": ()=>{
                    setTfIndex(0);
                    setTfFlipped(false);
                    setTfScore(0);
                    setTfDone(false);
                    setTfHistory([]);
                }
            })["Lesson6_OnTapChuong2[resetTf]"];
            $[47] = t22;
        } else {
            t22 = $[47];
        }
        resetTf = t22;
        const checkFill = {
            "Lesson6_OnTapChuong2[checkFill]": (id_1)=>{
                const q_0 = fillQuestions.find({
                    "Lesson6_OnTapChuong2[checkFill > fillQuestions.find()]": (q)=>q.id === id_1
                }["Lesson6_OnTapChuong2[checkFill > fillQuestions.find()]"]);
                const raw = (fillAnswers[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                const answers = [
                    q_0.answer,
                    ...q_0.altAnswers || []
                ].map(_Lesson6_OnTapChuong2CheckFillAnonymous);
                return answers.includes(raw);
            }
        }["Lesson6_OnTapChuong2[checkFill]"];
        fillScore = fillChecked ? fillQuestions.filter({
            "Lesson6_OnTapChuong2[fillQuestions.filter()]": (q_1)=>checkFill(q_1.id)
        }["Lesson6_OnTapChuong2[fillQuestions.filter()]"]).length : null;
        let t23;
        if ($[48] !== t) {
            t23 = t("T\xF3m T\u1EAFt", "Summary");
            $[48] = t;
            $[49] = t23;
        } else {
            t23 = $[49];
        }
        let t24;
        if ($[50] !== t23) {
            t24 = [
                "tomTat",
                "\uD83D\uDCDA",
                t23
            ];
            $[50] = t23;
            $[51] = t24;
        } else {
            t24 = $[51];
        }
        let t25;
        if ($[52] !== t) {
            t25 = t("C\xF4ng Th\u1EE9c", "Key Formulas");
            $[52] = t;
            $[53] = t25;
        } else {
            t25 = $[53];
        }
        let t26;
        if ($[54] !== t25) {
            t26 = [
                "congThuc",
                "\uD83D\uDCD0",
                t25
            ];
            $[54] = t25;
            $[55] = t26;
        } else {
            t26 = $[55];
        }
        let t27;
        if ($[56] !== t) {
            t27 = t("B\xE0i T\u1EADp TH", "Mixed Exercises");
            $[56] = t;
            $[57] = t27;
        } else {
            t27 = $[57];
        }
        let t28;
        if ($[58] !== t27) {
            t28 = [
                "baiTapTongHop",
                "\u270F\uFE0F",
                t27
            ];
            $[58] = t27;
            $[59] = t28;
        } else {
            t28 = $[59];
        }
        let t29;
        if ($[60] !== t) {
            t29 = t("Mini Game", "Mini Game");
            $[60] = t;
            $[61] = t29;
        } else {
            t29 = $[61];
        }
        let t30;
        if ($[62] !== t29) {
            t30 = [
                "miniGame",
                "\uD83C\uDFAE",
                t29
            ];
            $[62] = t29;
            $[63] = t30;
        } else {
            t30 = $[63];
        }
        let t31;
        if ($[64] !== t24 || $[65] !== t26 || $[66] !== t28 || $[67] !== t30) {
            t31 = [
                t24,
                t26,
                t28,
                t30
            ];
            $[64] = t24;
            $[65] = t26;
            $[66] = t28;
            $[67] = t30;
            $[68] = t31;
        } else {
            t31 = $[68];
        }
        const tabs = t31;
        const SectionHeader = _Lesson6_OnTapChuong2SectionHeader;
        let t32;
        if ($[69] !== t) {
            t32 = ({
                "Lesson6_OnTapChuong2[ResultSummary]": (t33)=>{
                    const { items, onReset, scoreLabel } = t33;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: "center",
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 48,
                                            marginBottom: 8
                                        },
                                        children: items.filter(_Lesson6_OnTapChuong2ResultSummaryItemsFilter).length === items.length ? "\uD83C\uDFC6" : items.filter(_Lesson6_OnTapChuong2ResultSummaryItemsFilter2).length >= items.length * 0.6 ? "\uD83D\uDC4D" : "\uD83D\uDCAA"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 433,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 26,
                                            fontWeight: 700,
                                            color: "#0B4F5C"
                                        },
                                        children: [
                                            items.filter(_Lesson6_OnTapChuong2ResultSummaryItemsFilter3).length,
                                            " / ",
                                            items.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 436,
                                        columnNumber: 252
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#777",
                                            fontSize: 16,
                                            marginTop: 4
                                        },
                                        children: scoreLabel
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 440,
                                        columnNumber: 110
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 430,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    marginBottom: 24
                                },
                                children: items.map({
                                    "Lesson6_OnTapChuong2[ResultSummary > items.map()]": (item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                        lineNumber: 459,
                                                        columnNumber: 22
                                                    }, this),
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
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                                lineNumber: 464,
                                                                columnNumber: 24
                                                            }, this),
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
                                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                                        lineNumber: 472,
                                                                        columnNumber: 84
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                                lineNumber: 469,
                                                                columnNumber: 92
                                                            }, this),
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
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                                lineNumber: 472,
                                                                columnNumber: 161
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                        lineNumber: 462,
                                                        columnNumber: 67
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                lineNumber: 455,
                                                columnNumber: 20
                                            }, this)
                                        }, idx, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                            lineNumber: 450,
                                            columnNumber: 85
                                        }, this)
                                }["Lesson6_OnTapChuong2[ResultSummary > items.map()]"])
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 444,
                                columnNumber: 42
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onReset,
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
                                    children: [
                                        "🔄 ",
                                        t("Ch\u01A1i l\u1EA1i", "Play Again")
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 478,
                                    columnNumber: 16
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 476,
                                columnNumber: 77
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 430,
                        columnNumber: 18
                    }, this);
                }
            })["Lesson6_OnTapChuong2[ResultSummary]"];
            $[69] = t;
            $[70] = t32;
        } else {
            t32 = $[70];
        }
        ResultSummary = t32;
        const mcResultItems = mcHistory.map({
            "Lesson6_OnTapChuong2[mcHistory.map()]": (h_1)=>({
                    correct: h_1.correct,
                    qText: mcQuestions[h_1.q].q,
                    correctText: mcQuestions[h_1.q].options[mcQuestions[h_1.q].answer],
                    yourText: mcQuestions[h_1.q].options[h_1.selected]
                })
        }["Lesson6_OnTapChuong2[mcHistory.map()]"]);
        tfResultItems = tfHistory.map({
            "Lesson6_OnTapChuong2[tfHistory.map()]": (h_2)=>({
                    correct: h_2.correct,
                    qText: tfCards[h_2.q].stmt,
                    correctText: tfCards[h_2.q].answer ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.given ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson6_OnTapChuong2[tfHistory.map()]"]);
        fillResultItems = fillChecked ? fillQuestions.map({
            "Lesson6_OnTapChuong2[fillQuestions.map()]": (q_2)=>({
                    correct: checkFill(q_2.id),
                    qText: q_2.template,
                    correctText: q_2.answer,
                    yourText: fillAnswers[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson6_OnTapChuong2[fillQuestions.map()]"]) : [];
        if ($[71] === Symbol.for("react.memo_cache_sentinel")) {
            t20 = {
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
            $[71] = t12;
            $[72] = t20;
        } else {
            t12 = $[71];
            t20 = $[72];
        }
        let t33;
        if ($[73] === Symbol.for("react.memo_cache_sentinel")) {
            t33 = {
                marginBottom: 24
            };
            $[73] = t33;
        } else {
            t33 = $[73];
        }
        let t34;
        if ($[74] === Symbol.for("react.memo_cache_sentinel")) {
            t34 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[74] = t34;
        } else {
            t34 = $[74];
        }
        let t35;
        if ($[75] !== t) {
            t35 = t("Quay l\u1EA1i", "Back to lessons");
            $[75] = t;
            $[76] = t35;
        } else {
            t35 = $[76];
        }
        if ($[77] !== t35) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t33,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t34,
                    children: [
                        "← ",
                        t35
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                    lineNumber: 572,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 572,
                columnNumber: 13
            }, this);
            $[77] = t35;
            $[78] = t13;
        } else {
            t13 = $[78];
        }
        let t36;
        let t37;
        if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
            t36 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t37 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            };
            $[79] = t36;
            $[80] = t37;
        } else {
            t36 = $[79];
            t37 = $[80];
        }
        let t38;
        if ($[81] !== t) {
            t38 = t("Ch\u01B0\u01A1ng II \xB7 B\u1EA5t Ph\u01B0\u01A1ng Tr\xECnh B\u1EADc Nh\u1EA5t", "Chapter II \xB7 Linear Inequalities");
            $[81] = t;
            $[82] = t38;
        } else {
            t38 = $[82];
        }
        let t39;
        if ($[83] !== t38) {
            t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t37,
                children: t38
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 611,
                columnNumber: 13
            }, this);
            $[83] = t38;
            $[84] = t39;
        } else {
            t39 = $[84];
        }
        let t40;
        if ($[85] === Symbol.for("react.memo_cache_sentinel")) {
            t40 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[85] = t40;
        } else {
            t40 = $[85];
        }
        let t41;
        if ($[86] !== t) {
            t41 = t("\xD4n T\u1EADp Ch\u01B0\u01A1ng II", "Chapter II Review");
            $[86] = t;
            $[87] = t41;
        } else {
            t41 = $[87];
        }
        let t42;
        if ($[88] !== t41) {
            t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t40,
                children: t41
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 638,
                columnNumber: 13
            }, this);
            $[88] = t41;
            $[89] = t42;
        } else {
            t42 = $[89];
        }
        let t43;
        if ($[90] !== t39 || $[91] !== t42) {
            t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t39,
                    t42
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 646,
                columnNumber: 13
            }, this);
            $[90] = t39;
            $[91] = t42;
            $[92] = t43;
        } else {
            t43 = $[92];
        }
        let t44;
        let t45;
        if ($[93] === Symbol.for("react.memo_cache_sentinel")) {
            t44 = {
                display: "flex",
                gap: 10
            };
            t45 = ({
                "Lesson6_OnTapChuong2[<button>.onClick]": ()=>setLang("vi")
            })["Lesson6_OnTapChuong2[<button>.onClick]"];
            $[93] = t44;
            $[94] = t45;
        } else {
            t44 = $[93];
            t45 = $[94];
        }
        const t46 = lang === "vi" ? "black" : "#f9f9f9";
        const t47 = lang === "vi" ? "white" : "black";
        let t48;
        if ($[95] !== t46 || $[96] !== t47) {
            t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t45,
                style: {
                    background: t46,
                    color: t47,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 673,
                columnNumber: 13
            }, this);
            $[95] = t46;
            $[96] = t47;
            $[97] = t48;
        } else {
            t48 = $[97];
        }
        let t49;
        if ($[98] === Symbol.for("react.memo_cache_sentinel")) {
            t49 = ({
                "Lesson6_OnTapChuong2[<button>.onClick]": ()=>setLang("en")
            })["Lesson6_OnTapChuong2[<button>.onClick]"];
            $[98] = t49;
        } else {
            t49 = $[98];
        }
        const t50 = lang === "en" ? "black" : "#f9f9f9";
        const t51 = lang === "en" ? "white" : "black";
        let t52;
        if ($[99] !== t50 || $[100] !== t51) {
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
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 702,
                columnNumber: 13
            }, this);
            $[99] = t50;
            $[100] = t51;
            $[101] = t52;
        } else {
            t52 = $[101];
        }
        let t53;
        if ($[102] !== t48 || $[103] !== t52) {
            t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t44,
                children: [
                    t48,
                    t52
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 720,
                columnNumber: 13
            }, this);
            $[102] = t48;
            $[103] = t52;
            $[104] = t53;
        } else {
            t53 = $[104];
        }
        if ($[105] !== t43 || $[106] !== t53) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t36,
                children: [
                    t43,
                    t53
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 728,
                columnNumber: 13
            }, this);
            $[105] = t43;
            $[106] = t53;
            $[107] = t14;
        } else {
            t14 = $[107];
        }
        let t54;
        if ($[108] === Symbol.for("react.memo_cache_sentinel")) {
            t54 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 40,
                transition: "all 0.3s ease"
            };
            $[108] = t54;
        } else {
            t54 = $[108];
        }
        let t55;
        if ($[109] !== t) {
            t55 = t("BPT B\u1EADc Nh\u1EA5t Hai \u1EA8n", "Linear Inequality (2 vars)");
            $[109] = t;
            $[110] = t55;
        } else {
            t55 = $[110];
        }
        let t56;
        if ($[111] !== t55) {
            t56 = {
                slug: "bpt-bac-nhat-hai-an",
                num: "4",
                title: t55
            };
            $[111] = t55;
            $[112] = t56;
        } else {
            t56 = $[112];
        }
        let t57;
        if ($[113] !== t) {
            t57 = t("H\u1EC7 BPT B\u1EADc Nh\u1EA5t Hai \u1EA8n", "System of Inequalities");
            $[113] = t;
            $[114] = t57;
        } else {
            t57 = $[114];
        }
        let t58;
        if ($[115] !== t57) {
            t58 = {
                slug: "he-bpt-bac-nhat-hai-an",
                num: "5",
                title: t57
            };
            $[115] = t57;
            $[116] = t58;
        } else {
            t58 = $[116];
        }
        let t59;
        if ($[117] !== t56 || $[118] !== t58) {
            t59 = [
                t56,
                t58
            ];
            $[117] = t56;
            $[118] = t58;
            $[119] = t59;
        } else {
            t59 = $[119];
        }
        if ($[120] !== t || $[121] !== t59) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t54,
                children: t59.map({
                    "Lesson6_OnTapChuong2[(anonymous)()]": (lesson)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/cacbailam10/${lesson.slug}`,
                            style: {
                                textDecoration: "none"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                style: {
                                    padding: 16,
                                    borderRadius: 10,
                                    background: "#f9f9f9",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    cursor: "pointer"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            color: "#777",
                                            marginBottom: 4
                                        },
                                        children: [
                                            t("B\xE0i", "Lesson"),
                                            " ",
                                            lesson.num
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 807,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: "#0B4F5C"
                                        },
                                        children: lesson.title
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 811,
                                        columnNumber: 60
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 13,
                                            color: "#aaa",
                                            marginTop: 4
                                        },
                                        children: [
                                            "← ",
                                            t("\xD4n l\u1EA1i", "Review")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 815,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 801,
                                columnNumber: 14
                            }, this)
                        }, lesson.slug, false, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                            lineNumber: 799,
                            columnNumber: 60
                        }, this)
                }["Lesson6_OnTapChuong2[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 798,
                columnNumber: 13
            }, this);
            $[120] = t;
            $[121] = t59;
            $[122] = t15;
        } else {
            t15 = $[122];
        }
        let t60;
        let t61;
        if ($[123] === Symbol.for("react.memo_cache_sentinel")) {
            t60 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t61 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[123] = t60;
            $[124] = t61;
        } else {
            t60 = $[123];
            t61 = $[124];
        }
        if ($[125] !== tabs) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t60,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t61,
                    children: tabs.map({
                        "Lesson6_OnTapChuong2[tabs.map()]": (t62)=>{
                            const [id_2, icon_0, label] = t62;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson6_OnTapChuong2[tabs.map() > <button>.onClick]": ()=>scrollTo(id_2)
                                }["Lesson6_OnTapChuong2[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson6_OnTapChuong2TabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson6_OnTapChuong2TabsMapButtonOnMouseLeave,
                                children: [
                                    icon_0,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 855,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson6_OnTapChuong2[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                    lineNumber: 852,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 852,
                columnNumber: 13
            }, this);
            $[125] = tabs;
            $[126] = t16;
        } else {
            t16 = $[126];
        }
        let t62;
        if ($[127] === Symbol.for("react.memo_cache_sentinel")) {
            t62 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[127] = t62;
        } else {
            t62 = $[127];
        }
        let t63;
        if ($[128] !== t) {
            t63 = t("T\xF3m T\u1EAFt Ch\u01B0\u01A1ng II", "Chapter II Summary");
            $[128] = t;
            $[129] = t63;
        } else {
            t63 = $[129];
        }
        let t64;
        if ($[130] !== t63) {
            t64 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCDA",
                title: t63
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 896,
                columnNumber: 13
            }, this);
            $[130] = t63;
            $[131] = t64;
        } else {
            t64 = $[131];
        }
        let t65;
        if ($[132] === Symbol.for("react.memo_cache_sentinel")) {
            t65 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[132] = t65;
        } else {
            t65 = $[132];
        }
        let t66;
        if ($[133] !== t) {
            t66 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t65,
                children: [
                    {
                        title: t("B\xE0i 4 \xB7 BPT B\u1EADc Nh\u1EA5t Hai \u1EA8n", "Lesson 4 \xB7 Linear Inequality (2 vars)"),
                        points: [
                            t("D\u1EA1ng: ax + by + c > 0 (ho\u1EB7c <, \u2265, \u2264)", "Form: ax + by + c > 0 (or <, \u2265, \u2264)"),
                            t("Nghi\u1EC7m: c\u1EB7p (x\u2080, y\u2080) th\u1ECFa BPT", "Solution: pair (x\u2080, y\u2080) satisfying the BPT"),
                            t("Mi\u1EC1n nghi\u1EC7m: n\u1EEDa m\u1EB7t ph\u1EB3ng", "Solution region: half-plane"),
                            t("Bi\xEAn: li\u1EC1n n\xE9t (\u2265, \u2264), n\xE9t \u0111\u1EE9t (>, <)", "Boundary: solid (\u2265, \u2264), dashed (>, <)"),
                            t("Ki\u1EC3m tra: th\u1EED \u0111i\u1EC3m O(0,0)", "Test: try point O(0,0)")
                        ]
                    },
                    {
                        title: t("B\xE0i 5 \xB7 H\u1EC7 BPT B\u1EADc Nh\u1EA5t Hai \u1EA8n", "Lesson 5 \xB7 System of Inequalities"),
                        points: [
                            t("Nghi\u1EC7m h\u1EC7: th\u1ECFa T\u1EA4T C\u1EA2 BPT trong h\u1EC7", "System solution: satisfies ALL inequalities"),
                            t("Mi\u1EC1n nghi\u1EC7m = giao c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng", "Solution region = intersection of half-planes"),
                            t("C\xF3 th\u1EC3: \u0111a gi\xE1c l\u1ED3i, v\xF4 h\u1EA1n, ho\u1EB7c t\u1EADp r\u1ED7ng", "Can be: convex polygon, unbounded, or empty"),
                            t("\u0110\u1EC9nh: giao \u0111i\u1EC3m c\xE1c c\u1EB7p \u0111\u01B0\u1EDDng bi\xEAn", "Vertices: pairwise boundary intersections")
                        ]
                    }
                ].map(_Lesson6_OnTapChuong2Anonymous)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 916,
                columnNumber: 13
            }, this);
            $[133] = t;
            $[134] = t66;
        } else {
            t66 = $[134];
        }
        if ($[135] !== t64 || $[136] !== t66) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "tomTat",
                style: t62,
                children: [
                    t64,
                    t66
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 929,
                columnNumber: 13
            }, this);
            $[135] = t64;
            $[136] = t66;
            $[137] = t17;
        } else {
            t17 = $[137];
        }
        let t67;
        if ($[138] === Symbol.for("react.memo_cache_sentinel")) {
            t67 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[138] = t67;
        } else {
            t67 = $[138];
        }
        let t68;
        if ($[139] !== t) {
            t68 = t("C\xF4ng Th\u1EE9c v\xE0 Quy T\u1EAFc Quan Tr\u1ECDng", "Key Formulas and Rules");
            $[139] = t;
            $[140] = t68;
        } else {
            t68 = $[140];
        }
        let t69;
        if ($[141] !== t68) {
            t69 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD0",
                title: t68
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 956,
                columnNumber: 13
            }, this);
            $[141] = t68;
            $[142] = t69;
        } else {
            t69 = $[142];
        }
        let t70;
        if ($[143] === Symbol.for("react.memo_cache_sentinel")) {
            t70 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[143] = t70;
        } else {
            t70 = $[143];
        }
        let t71;
        if ($[144] !== t) {
            t71 = t("X\xE1c \u0111\u1ECBnh n\u1EEDa m\u1EB7t ph\u1EB3ng nghi\u1EC7m", "Finding solution half-plane");
            $[144] = t;
            $[145] = t71;
        } else {
            t71 = $[145];
        }
        let t72;
        if ($[146] !== t) {
            t72 = t("Th\u1EED O(0,0) v\xE0o BPT:\n\u2022 Th\u1ECFa \u2192 t\xF4 ph\xEDa O\n\u2022 Kh\xF4ng th\u1ECFa \u2192 t\xF4 ph\xEDa kia", "Test O(0,0):\n\u2022 Satisfies \u2192 shade O's side\n\u2022 Fails \u2192 shade opposite");
            $[146] = t;
            $[147] = t72;
        } else {
            t72 = $[147];
        }
        let t73;
        if ($[148] !== t71 || $[149] !== t72) {
            t73 = {
                label: t71,
                formula: t72
            };
            $[148] = t71;
            $[149] = t72;
            $[150] = t73;
        } else {
            t73 = $[150];
        }
        let t74;
        if ($[151] !== t) {
            t74 = t("\u0110\u01B0\u1EDDng bi\xEAn", "Boundary line");
            $[151] = t;
            $[152] = t74;
        } else {
            t74 = $[152];
        }
        let t75;
        if ($[153] !== t) {
            t75 = t("\u2265 ho\u1EB7c \u2264 \u2192 li\u1EC1n n\xE9t (\u0111\u01B0\u1EDDng bi\xEAn thu\u1ED9c MN)\n> ho\u1EB7c < \u2192 n\xE9t \u0111\u1EE9t (kh\xF4ng thu\u1ED9c MN)", "\u2265 or \u2264 \u2192 solid line (boundary included)\n> or < \u2192 dashed line (boundary excluded)");
            $[153] = t;
            $[154] = t75;
        } else {
            t75 = $[154];
        }
        let t76;
        if ($[155] !== t74 || $[156] !== t75) {
            t76 = {
                label: t74,
                formula: t75
            };
            $[155] = t74;
            $[156] = t75;
            $[157] = t76;
        } else {
            t76 = $[157];
        }
        let t77;
        if ($[158] !== t) {
            t77 = t("Mi\u1EC1n nghi\u1EC7m h\u1EC7 BPT", "System solution region");
            $[158] = t;
            $[159] = t77;
        } else {
            t77 = $[159];
        }
        let t78;
        if ($[160] !== t) {
            t78 = t("MN(h\u1EC7) = MN(BPT\u2081) \u2229 MN(BPT\u2082) \u2229 ...\n= ph\u1EA7n chung c\u1EE7a t\u1EA5t c\u1EA3", "SR(system) = SR(BPT\u2081) \u2229 SR(BPT\u2082) \u2229 ...\n= common part of all");
            $[160] = t;
            $[161] = t78;
        } else {
            t78 = $[161];
        }
        let t79;
        if ($[162] !== t77 || $[163] !== t78) {
            t79 = {
                label: t77,
                formula: t78
            };
            $[162] = t77;
            $[163] = t78;
            $[164] = t79;
        } else {
            t79 = $[164];
        }
        let t80;
        if ($[165] !== t) {
            t80 = t("T\xECm \u0111\u1EC9nh mi\u1EC1n nghi\u1EC7m", "Finding vertices");
            $[165] = t;
            $[166] = t80;
        } else {
            t80 = $[166];
        }
        let t81;
        if ($[167] !== t) {
            t81 = t("Gi\u1EA3i h\u1EC7 PT t\u1EEBng c\u1EB7p \u0111\u01B0\u1EDDng bi\xEAn:\n{ d\u2081: a\u2081x+b\u2081y+c\u2081=0\n{ d\u2082: a\u2082x+b\u2082y+c\u2082=0", "Solve each pair of boundary equations:\n{ d\u2081: a\u2081x+b\u2081y+c\u2081=0\n{ d\u2082: a\u2082x+b\u2082y+c\u2082=0");
            $[167] = t;
            $[168] = t81;
        } else {
            t81 = $[168];
        }
        let t82;
        if ($[169] !== t80 || $[170] !== t81) {
            t82 = {
                label: t80,
                formula: t81
            };
            $[169] = t80;
            $[170] = t81;
            $[171] = t82;
        } else {
            t82 = $[171];
        }
        let t83;
        if ($[172] !== t73 || $[173] !== t76 || $[174] !== t79 || $[175] !== t82) {
            t83 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t70,
                children: [
                    t73,
                    t76,
                    t79,
                    t82
                ].map(_Lesson6_OnTapChuong2Anonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1088,
                columnNumber: 13
            }, this);
            $[172] = t73;
            $[173] = t76;
            $[174] = t79;
            $[175] = t82;
            $[176] = t83;
        } else {
            t83 = $[176];
        }
        if ($[177] !== t69 || $[178] !== t83) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "congThuc",
                style: t67,
                children: [
                    t69,
                    t83
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1098,
                columnNumber: 13
            }, this);
            $[177] = t69;
            $[178] = t83;
            $[179] = t18;
        } else {
            t18 = $[179];
        }
        let t84;
        if ($[180] === Symbol.for("react.memo_cache_sentinel")) {
            t84 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[180] = t84;
        } else {
            t84 = $[180];
        }
        let t85;
        if ($[181] !== t) {
            t85 = t("B\xE0i T\u1EADp T\u1ED5ng H\u1EE3p", "Mixed Practice Exercises");
            $[181] = t;
            $[182] = t85;
        } else {
            t85 = $[182];
        }
        let t86;
        if ($[183] !== t85) {
            t86 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\u270F\uFE0F",
                title: t85
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1125,
                columnNumber: 13
            }, this);
            $[183] = t85;
            $[184] = t86;
        } else {
            t86 = $[184];
        }
        let t87;
        if ($[185] === Symbol.for("react.memo_cache_sentinel")) {
            t87 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 40,
                transition: "all 0.3s ease"
            };
            $[185] = t87;
        } else {
            t87 = $[185];
        }
        let t88;
        if ($[186] !== revealedAnswers || $[187] !== t) {
            t88 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t87,
                children: [
                    {
                        id: "e1",
                        badge: t("B\xE0i 4", "L4"),
                        q: t("Bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m c\u1EE7a:\n2x + 3y \u2265 6", "Graph the solution region of:\n2x + 3y \u2265 6"),
                        a: [
                            t("\u0110\u01B0\u1EDDng bi\xEAn: 2x+3y=6 (li\u1EC1n n\xE9t, d\u1EA5u \u2265)", "Boundary: 2x+3y=6 (solid line, \u2265)"),
                            t("Hai \u0111i\u1EC3m tr\xEAn bi\xEAn: A(3,0) v\xE0 B(0,2)", "Two boundary points: A(3,0) and B(0,2)"),
                            t("Th\u1EED O(0,0): 0+0=0 < 6 \u2192 O kh\xF4ng th\u1ECFa", "Test O(0,0): 0 < 6 \u2192 O fails"),
                            t("T\xF4 m\xE0u n\u1EEDa mp KH\xD4NG ch\u1EE9a O (ph\xEDa tr\xEAn-ph\u1EA3i)", "Shade half-plane NOT containing O (upper-right)")
                        ]
                    },
                    {
                        id: "e2",
                        badge: t("B\xE0i 5", "L5"),
                        q: t("T\xECm mi\u1EC1n nghi\u1EC7m v\xE0 c\xE1c \u0111\u1EC9nh c\u1EE7a h\u1EC7:\n{x + y \u2264 5\n{2x \u2212 y \u2264 4\n{x \u2265 0, y \u2265 0", "Find solution region and vertices of:\n{x+y \u2264 5\n{2x\u2212y \u2264 4\n{x \u2265 0, y \u2265 0"),
                        a: [
                            t("Gi\u1EA3i h\u1EC7 x+y=5 v\xE0 2x\u2212y=4: c\u1ED9ng \u2192 3x=9 \u2192 x=3, y=2 \u2192 P(3,2)", "Solve x+y=5 and 2x\u2212y=4: add \u2192 3x=9 \u2192 x=3, y=2 \u2192 P(3,2)"),
                            t("Giao x+y=5 v\xE0 x=0 \u2192 Q(0,5)", "Intersect x+y=5 and x=0 \u2192 Q(0,5)"),
                            t("Giao 2x\u2212y=4 v\xE0 y=0 \u2192 R(2,0)", "Intersect 2x\u2212y=4 and y=0 \u2192 R(2,0)"),
                            t("Giao x=0 v\xE0 y=0 \u2192 O(0,0)", "Intersect x=0 and y=0 \u2192 O(0,0)"),
                            t("4 \u0111\u1EC9nh: O(0,0), R(2,0), P(3,2), Q(0,5)", "4 vertices: O(0,0), R(2,0), P(3,2), Q(0,5)")
                        ]
                    },
                    {
                        id: "e3",
                        badge: t("T\u1ED5ng h\u1EE3p", "Mixed"),
                        q: t("M\u1ED9t nh\xE0 h\xE0ng c\u1EA7n pha ch\u1EBF 2 lo\u1EA1i n\u01B0\u1EDBc u\u1ED1ng A, B v\u1EDBi x l\xEDt A v\xE0 y l\xEDt B. Y\xEAu c\u1EA7u: x+y \u2265 10, 2x+y \u2264 24, x \u2265 2, y \u2265 3. Ki\u1EC3m tra xem (4, 8) c\xF3 th\u1ECFa kh\xF4ng?", "A restaurant makes x liters of drink A and y liters of drink B. Constraints: x+y\u226510, 2x+y\u226424, x\u22652, y\u22653. Does (4,8) satisfy all?"),
                        a: [
                            "\u2460 x+y: 4+8=12\u226510 \u2713",
                            "\u2461 2x+y: 8+8=16\u226424 \u2713",
                            "\u2462 x: 4\u22652 \u2713",
                            "\u2463 y: 8\u22653 \u2713",
                            t("\u2192 (4,8) TH\u1ECEA m\xE3n t\u1EA5t c\u1EA3 \u0111i\u1EC1u ki\u1EC7n \u2705", "\u2192 (4,8) SATISFIES all constraints \u2705")
                        ]
                    }
                ].map({
                    "Lesson6_OnTapChuong2[(anonymous)()]": (t89)=>{
                        const { id: id_3, q: q_3, a: a_0, badge } = t89;
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
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                marginBottom: 4
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: 18,
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        "📝 ",
                                                        t("B\xE0i t\u1EADp", "Exercise")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                    lineNumber: 1178,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        background: "black",
                                                        color: "white",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        padding: "2px 10px",
                                                        borderRadius: 20
                                                    },
                                                    children: badge
                                                }, void 0, false, {
                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                                    lineNumber: 1181,
                                                    columnNumber: 65
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                            lineNumber: 1173,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14,
                                                marginBottom: 10
                                            },
                                            children: t("To\xE1n 10", "Grade 10")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                            lineNumber: 1188,
                                            columnNumber: 42
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: q_3
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                            lineNumber: 1192,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1168,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson6_OnTapChuong2[(anonymous)() > <button>.onClick]": ()=>toggleAnswer(id_3)
                                    }["Lesson6_OnTapChuong2[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1196,
                                    columnNumber: 37
                                }, this),
                                revealedAnswers[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_0.map(_Lesson6_OnTapChuong2AnonymousA_0Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1209,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                            lineNumber: 1168,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson6_OnTapChuong2[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1145,
                columnNumber: 13
            }, this);
            $[186] = revealedAnswers;
            $[187] = t;
            $[188] = t88;
        } else {
            t88 = $[188];
        }
        if ($[189] !== t86 || $[190] !== t88) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "baiTapTongHop",
                style: t84,
                children: [
                    t86,
                    t88
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1223,
                columnNumber: 13
            }, this);
            $[189] = t86;
            $[190] = t88;
            $[191] = t19;
        } else {
            t19 = $[191];
        }
        t7 = "miniGame";
        if ($[192] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[192] = t8;
        } else {
            t8 = $[192];
        }
        let t89;
        if ($[193] !== t) {
            t89 = t("Mini Game \xB7 \xD4n T\u1EADp Ch\u01B0\u01A1ng II", "Mini Game \xB7 Chapter II Review");
            $[193] = t;
            $[194] = t89;
        } else {
            t89 = $[194];
        }
        if ($[195] !== t89) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83C\uDFAE",
                title: t89
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1249,
                columnNumber: 12
            }, this);
            $[195] = t89;
            $[196] = t9;
        } else {
            t9 = $[196];
        }
        let t90;
        if ($[197] === Symbol.for("react.memo_cache_sentinel")) {
            t90 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s ease"
            };
            $[197] = t90;
        } else {
            t90 = $[197];
        }
        let t91;
        if ($[198] !== t) {
            t91 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[198] = t;
            $[199] = t91;
        } else {
            t91 = $[199];
        }
        let t92;
        if ($[200] !== t) {
            t92 = t("5 c\xE2u h\u1ECFi", "5 questions");
            $[200] = t;
            $[201] = t92;
        } else {
            t92 = $[201];
        }
        let t93;
        if ($[202] !== t91 || $[203] !== t92) {
            t93 = [
                "mc",
                "\uD83E\uDDE9",
                t91,
                t92
            ];
            $[202] = t91;
            $[203] = t92;
            $[204] = t93;
        } else {
            t93 = $[204];
        }
        let t94;
        if ($[205] !== t) {
            t94 = t("\u0110\xFAng / Sai", "True / False");
            $[205] = t;
            $[206] = t94;
        } else {
            t94 = $[206];
        }
        let t95;
        if ($[207] !== t) {
            t95 = t("5 th\u1EBB", "5 cards");
            $[207] = t;
            $[208] = t95;
        } else {
            t95 = $[208];
        }
        let t96;
        if ($[209] !== t94 || $[210] !== t95) {
            t96 = [
                "tf",
                "\uD83C\uDCCF",
                t94,
                t95
            ];
            $[209] = t94;
            $[210] = t95;
            $[211] = t96;
        } else {
            t96 = $[211];
        }
        let t97;
        if ($[212] !== t) {
            t97 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[212] = t;
            $[213] = t97;
        } else {
            t97 = $[213];
        }
        let t98;
        if ($[214] !== t) {
            t98 = t("3 c\xE2u", "3 items");
            $[214] = t;
            $[215] = t98;
        } else {
            t98 = $[215];
        }
        let t99;
        if ($[216] !== t97 || $[217] !== t98) {
            t99 = [
                "fill",
                "\u270D\uFE0F",
                t97,
                t98
            ];
            $[216] = t97;
            $[217] = t98;
            $[218] = t99;
        } else {
            t99 = $[218];
        }
        let t100;
        if ($[219] !== t93 || $[220] !== t96 || $[221] !== t99) {
            t100 = [
                t93,
                t96,
                t99
            ];
            $[219] = t93;
            $[220] = t96;
            $[221] = t99;
            $[222] = t100;
        } else {
            t100 = $[222];
        }
        if ($[223] !== gameMode || $[224] !== t100) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t90,
                children: t100.map({
                    "Lesson6_OnTapChuong2[(anonymous)()]": (t101)=>{
                        const [mode, icon_1, label_0, sub] = t101;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson6_OnTapChuong2[(anonymous)() > <article>.onClick]": ()=>setGameMode(mode)
                            }["Lesson6_OnTapChuong2[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1366,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1369,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1372,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                            lineNumber: 1357,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson6_OnTapChuong2[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1354,
                columnNumber: 13
            }, this);
            $[223] = gameMode;
            $[224] = t100;
            $[225] = t10;
        } else {
            t10 = $[225];
        }
        t11 = gameMode === "mc" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1389,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1393,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQuestions[mcIndex].options.map({
                            "Lesson6_OnTapChuong2[(anonymous)()]": (opt, i_10)=>{
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
                                        "Lesson6_OnTapChuong2[(anonymous)() > <button>.onClick]": ()=>handleMcSelect(i_10)
                                    }["Lesson6_OnTapChuong2[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                    lineNumber: 1416,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson6_OnTapChuong2[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1397,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 1432,
                                columnNumber: 85
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 1440,
                                columnNumber: 53
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                items: mcResultItems,
                onReset: resetMc,
                scoreLabel: mcScore === mcQuestions.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : mcScore >= 3 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1450,
                columnNumber: 157
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1384,
            columnNumber: 32
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
        $[20] = tfFlipped;
        $[21] = tfHistory;
        $[22] = tfIndex;
        $[23] = ResultSummary;
        $[24] = fillQuestions;
        $[25] = fillResultItems;
        $[26] = fillScore;
        $[27] = handleTfAnswer;
        $[28] = handleTfNext;
        $[29] = resetTf;
        $[30] = t10;
        $[31] = t11;
        $[32] = t12;
        $[33] = t13;
        $[34] = t14;
        $[35] = t15;
        $[36] = t16;
        $[37] = t17;
        $[38] = t18;
        $[39] = t19;
        $[40] = t20;
        $[41] = t7;
        $[42] = t8;
        $[43] = t9;
        $[44] = tfCards;
        $[45] = tfResultItems;
    } else {
        ResultSummary = $[23];
        fillQuestions = $[24];
        fillResultItems = $[25];
        fillScore = $[26];
        handleTfAnswer = $[27];
        handleTfNext = $[28];
        resetTf = $[29];
        t10 = $[30];
        t11 = $[31];
        t12 = $[32];
        t13 = $[33];
        t14 = $[34];
        t15 = $[35];
        t16 = $[36];
        t17 = $[37];
        t18 = $[38];
        t19 = $[39];
        t20 = $[40];
        t7 = $[41];
        t8 = $[42];
        t9 = $[43];
        tfCards = $[44];
        tfResultItems = $[45];
    }
    let t21;
    if ($[226] !== ResultSummary || $[227] !== gameMode || $[228] !== handleTfAnswer || $[229] !== handleTfNext || $[230] !== resetTf || $[231] !== t || $[232] !== tfCards || $[233] !== tfDone || $[234] !== tfFlipped || $[235] !== tfIndex || $[236] !== tfResultItems || $[237] !== tfScore) {
        t21 = gameMode === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1520,
                        columnNumber: 21
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 1531,
                                columnNumber: 12
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
                                            "Lesson6_OnTapChuong2[<button>.onClick]": ()=>handleTfAnswer(true)
                                        }["Lesson6_OnTapChuong2[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1539,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson6_OnTapChuong2[<button>.onClick]": ()=>handleTfAnswer(false)
                                        }["Lesson6_OnTapChuong2[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1550,
                                        columnNumber: 54
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 1535,
                                columnNumber: 57
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1561,
                                        columnNumber: 57
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1570,
                                        columnNumber: 51
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1524,
                        columnNumber: 117
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                items: tfResultItems,
                onReset: resetTf,
                scoreLabel: tfScore === tfCards.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1579,
                columnNumber: 167
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1515,
            columnNumber: 32
        }, this);
        $[226] = ResultSummary;
        $[227] = gameMode;
        $[228] = handleTfAnswer;
        $[229] = handleTfNext;
        $[230] = resetTf;
        $[231] = t;
        $[232] = tfCards;
        $[233] = tfDone;
        $[234] = tfFlipped;
        $[235] = tfIndex;
        $[236] = tfResultItems;
        $[237] = tfScore;
        $[238] = t21;
    } else {
        t21 = $[238];
    }
    let t22;
    if ($[239] !== ResultSummary || $[240] !== fillAnswers || $[241] !== fillChecked || $[242] !== fillQuestions || $[243] !== fillResultItems || $[244] !== fillScore || $[245] !== gameMode || $[246] !== t) {
        t22 = gameMode === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            },
            children: !fillChecked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 18,
                            fontWeight: 600,
                            marginBottom: 20
                        },
                        children: t("\u0110i\u1EC1n c\xE2u tr\u1EA3 l\u1EDDi v\xE0o ch\u1ED7 tr\u1ED1ng", "Fill in each blank")
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1603,
                        columnNumber: 26
                    }, this),
                    fillQuestions.map({
                        "Lesson6_OnTapChuong2[fillQuestions.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1610,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 16,
                                            lineHeight: 1.7,
                                            marginBottom: 10
                                        },
                                        children: q_4.template
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1614,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: fillAnswers[q_4.id] || "",
                                        onChange: {
                                            "Lesson6_OnTapChuong2[fillQuestions.map() > <input>.onChange]": (e_1)=>setFillAnswers({
                                                    "Lesson6_OnTapChuong2[fillQuestions.map() > <input>.onChange > setFillAnswers()]": (p_0)=>({
                                                            ...p_0,
                                                            [q_4.id]: e_1.target.value
                                                        })
                                                }["Lesson6_OnTapChuong2[fillQuestions.map() > <input>.onChange > setFillAnswers()]"])
                                        }["Lesson6_OnTapChuong2[fillQuestions.map() > <input>.onChange]"],
                                        placeholder: t("Nh\u1EADp \u0111\xE1p \xE1n...", "Enter answer..."),
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                        lineNumber: 1618,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, q_4.id, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                                lineNumber: 1608,
                                columnNumber: 69
                            }, this)
                    }["Lesson6_OnTapChuong2[fillQuestions.map()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "Lesson6_OnTapChuong2[<button>.onClick]": ()=>setFillChecked(true)
                        }["Lesson6_OnTapChuong2[<button>.onClick]"],
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                        lineNumber: 1636,
                        columnNumber: 57
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                items: fillResultItems,
                onReset: {
                    "Lesson6_OnTapChuong2[<ResultSummary>.onReset]": ()=>{
                        setFillAnswers({});
                        setFillChecked(false);
                    }
                }["Lesson6_OnTapChuong2[<ResultSummary>.onReset]"],
                scoreLabel: fillScore === fillQuestions.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fillScore >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1647,
                columnNumber: 64
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1598,
            columnNumber: 34
        }, this);
        $[239] = ResultSummary;
        $[240] = fillAnswers;
        $[241] = fillChecked;
        $[242] = fillQuestions;
        $[243] = fillResultItems;
        $[244] = fillScore;
        $[245] = gameMode;
        $[246] = t;
        $[247] = t22;
    } else {
        t22 = $[247];
    }
    let t23;
    if ($[248] !== t10 || $[249] !== t11 || $[250] !== t21 || $[251] !== t22 || $[252] !== t7 || $[253] !== t8 || $[254] !== t9) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            id: t7,
            style: t8,
            children: [
                t9,
                t10,
                t11,
                t21,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1667,
            columnNumber: 11
        }, this);
        $[248] = t10;
        $[249] = t11;
        $[250] = t21;
        $[251] = t22;
        $[252] = t7;
        $[253] = t8;
        $[254] = t9;
        $[255] = t23;
    } else {
        t23 = $[255];
    }
    let t24;
    if ($[256] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1681,
            columnNumber: 11
        }, this);
        $[256] = t24;
    } else {
        t24 = $[256];
    }
    let t25;
    if ($[257] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[257] = t25;
    } else {
        t25 = $[257];
    }
    let t26;
    if ($[258] !== t) {
        t26 = t("\xD4n T\u1EADp Ch\u01B0\u01A1ng II", "Chapter II Review");
        $[258] = t;
        $[259] = t26;
    } else {
        t26 = $[259];
    }
    let t27;
    if ($[260] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t25,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1710,
            columnNumber: 11
        }, this);
        $[260] = t26;
        $[261] = t27;
    } else {
        t27 = $[261];
    }
    let t28;
    let t29;
    if ($[262] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n          .reveal { opacity:0; transform:translateY(28px) scale(0.97); transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1); will-change:opacity,transform; }\n          .reveal.visible { opacity:1; transform:translateY(0) scale(1); }\n          .reveal[data-reveal-stagger].visible { opacity:1; transform:none; }\n          .reveal[data-reveal-stagger] > * { opacity:0; transform:translateY(24px) scale(0.97); will-change:opacity,transform; }\n          header.reveal { transform:translateY(-18px); opacity:0; }\n          header.reveal.visible { opacity:1; transform:translateY(0); }\n          article { transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease; border-radius:10px; padding:8px; }\n          article:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 12px 28px rgba(0,0,0,0.12); }\n        "
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1719,
            columnNumber: 11
        }, this);
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1720,
            columnNumber: 11
        }, this);
        $[262] = t28;
        $[263] = t29;
    } else {
        t28 = $[262];
        t29 = $[263];
    }
    let t30;
    if ($[264] !== t12 || $[265] !== t13 || $[266] !== t14 || $[267] !== t15 || $[268] !== t16 || $[269] !== t17 || $[270] !== t18 || $[271] !== t19 || $[272] !== t23 || $[273] !== t27) {
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
                t23,
                t24,
                t27,
                t28,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1729,
            columnNumber: 11
        }, this);
        $[264] = t12;
        $[265] = t13;
        $[266] = t14;
        $[267] = t15;
        $[268] = t16;
        $[269] = t17;
        $[270] = t18;
        $[271] = t19;
        $[272] = t23;
        $[273] = t27;
        $[274] = t30;
    } else {
        t30 = $[274];
    }
    let t31;
    if ($[275] !== t20 || $[276] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t20,
            children: t30
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
            lineNumber: 1746,
            columnNumber: 11
        }, this);
        $[275] = t20;
        $[276] = t30;
        $[277] = t31;
    } else {
        t31 = $[277];
    }
    return t31;
}
_s(Lesson6_OnTapChuong2, "o9ln2GYkrW8yJye2B9T4lwZLUUE=");
_c1 = Lesson6_OnTapChuong2;
function _Lesson6_OnTapChuong2AnonymousA_0Map(line, i_9) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: line
    }, i_9, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
        lineNumber: 1756,
        columnNumber: 10
    }, this);
}
function _Lesson6_OnTapChuong2Anonymous2(card_0, i_8) {
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
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 10
                },
                children: card_0.label
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1768,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: "#333",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    background: "white",
                    padding: "10px 14px",
                    borderRadius: 8
                },
                children: card_0.formula
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1773,
                columnNumber: 28
            }, this)
        ]
    }, i_8, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
        lineNumber: 1763,
        columnNumber: 10
    }, this);
}
function _Lesson6_OnTapChuong2Anonymous(card, i_7) {
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
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 12
                },
                children: card.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1790,
                columnNumber: 6
            }, this),
            card.points.map(_Lesson6_OnTapChuong2AnonymousCardPointsMap)
        ]
    }, i_7, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
        lineNumber: 1785,
        columnNumber: 10
    }, this);
}
function _Lesson6_OnTapChuong2AnonymousCardPointsMap(pt, j) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 14,
            color: "#555",
            marginBottom: 8,
            display: "flex",
            alignItems: "flex-start",
            gap: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: "#0B4F5C",
                    fontWeight: 700,
                    flexShrink: 0
                },
                children: "•"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1805,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: pt
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1809,
                columnNumber: 16
            }, this)
        ]
    }, j, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
        lineNumber: 1798,
        columnNumber: 10
    }, this);
}
function _Lesson6_OnTapChuong2TabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson6_OnTapChuong2TabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson6_OnTapChuong2ResultSummaryItemsFilter3(i_6) {
    return i_6.correct;
}
function _Lesson6_OnTapChuong2ResultSummaryItemsFilter2(i_4) {
    return i_4.correct;
}
function _Lesson6_OnTapChuong2ResultSummaryItemsFilter(i_5) {
    return i_5.correct;
}
function _Lesson6_OnTapChuong2SectionHeader(t0) {
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1843,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
                lineNumber: 1843,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson6_OnTapChuong2.js",
        lineNumber: 1833,
        columnNumber: 10
    }, this);
}
function _Lesson6_OnTapChuong2CheckFillAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson6_OnTapChuong2HandleTfNextSetTfIndex(i_3) {
    return i_3 + 1;
}
function _Lesson6_OnTapChuong2HandleTfAnswerSetTfScore(s_0) {
    return s_0 + 1;
}
function _Lesson6_OnTapChuong2HandleMcNextSetMcIndex(i_2) {
    return i_2 + 1;
}
function _Lesson6_OnTapChuong2HandleMcSelectSetMcScore(s) {
    return s + 1;
}
function _Lesson6_OnTapChuong2ScrollTo(id_0) {
    const el_2 = document.getElementById(id_0);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson6_OnTapChuong2UseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson6_OnTapChuong2UseEffectElsForEach);
    const obs = new IntersectionObserver(_temp, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson6_OnTapChuong2[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson6_OnTapChuong2[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp(entries, observer) {
    entries.forEach({
        "Lesson6_OnTapChuong2[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson6_OnTapChuong2[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "Lesson6_OnTapChuong2[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson6_OnTapChuong2[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["Lesson6_OnTapChuong2[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson6_OnTapChuong2[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson6_OnTapChuong2UseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson6_OnTapChuong2[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["Lesson6_OnTapChuong2[useEffect() > els.forEach() > (anonymous)()]"]);
    }
}
var _c, _c1;
__turbopack_context__.k.register(_c, "SectionHeader");
__turbopack_context__.k.register(_c1, "Lesson6_OnTapChuong2");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_209db195._.js.map