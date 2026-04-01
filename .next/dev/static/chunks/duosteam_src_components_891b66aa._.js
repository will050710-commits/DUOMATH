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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson4_BPTBacNhatHaiAn
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
    if ($[0] !== "f2f2f898259c4d452942da7bc0411f0e697094c03365130a1442f5aaa18db782") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f2f2f898259c4d452942da7bc0411f0e697094c03365130a1442f5aaa18db782";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
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
function Lesson4_BPTBacNhatHaiAn() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(443);
    if ($[0] !== "f2f2f898259c4d452942da7bc0411f0e697094c03365130a1442f5aaa18db782") {
        for(let $i = 0; $i < 443; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f2f2f898259c4d452942da7bc0411f0e697094c03365130a1442f5aaa18db782";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson4_BPTBacNhatHaiAnUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson4_BPTBacNhatHaiAn[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson4_BPTBacNhatHaiAn[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson4_BPTBacNhatHaiAn[toggleAnswer]": (id)=>setRevealedAnswers({
                    "Lesson4_BPTBacNhatHaiAn[toggleAnswer > setRevealedAnswers()]": (p)=>({
                            ...p,
                            [id]: !p[id]
                        })
                }["Lesson4_BPTBacNhatHaiAn[toggleAnswer > setRevealedAnswers()]"])
        })["Lesson4_BPTBacNhatHaiAn[toggleAnswer]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const toggleAnswer = t6;
    const scrollTo = _Lesson4_BPTBacNhatHaiAnScrollTo;
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
    let t21;
    let t22;
    let t7;
    let t8;
    let t9;
    let tfCards;
    let tfResultItems;
    if ($[9] !== fillAnswers || $[10] !== fillChecked || $[11] !== gameMode || $[12] !== lang || $[13] !== mcDone || $[14] !== mcHistory || $[15] !== mcIndex || $[16] !== mcScore || $[17] !== mcSelected || $[18] !== revealedAnswers || $[19] !== t || $[20] !== tfFlipped || $[21] !== tfHistory || $[22] !== tfIndex) {
        const mcQuestions = [
            {
                q: t("BPT b\u1EADc nh\u1EA5t hai \u1EA9n c\xF3 d\u1EA1ng t\u1ED5ng qu\xE1t n\xE0o?", "What is the general form of a linear inequality in two variables?"),
                options: [
                    "ax\xB2 + bx + c > 0",
                    "ax + by + c \u2265 0",
                    "ax + by\xB2 + c < 0",
                    "ax\xB2 + by\xB2 = 0"
                ],
                answer: 1,
                explain: t("D\u1EA1ng ax + by + c \u2265 0 (ho\u1EB7c >, <, \u2264) v\u1EDBi a, b kh\xF4ng \u0111\u1ED3ng th\u1EDDi b\u1EB1ng 0.", "Form ax + by + c \u2265 0 (or >, <, \u2264) where a, b are not both zero.")
            },
            {
                q: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT 2x + y \u2265 4 l\xE0?", "The solution region of 2x + y \u2265 4 is?"),
                options: [
                    t("N\u1EEDa m\u1EB7t ph\u1EB3ng kh\xF4ng ch\u1EE9a g\u1ED1c O(0,0)", "The half-plane not containing origin O(0,0)"),
                    t("N\u1EEDa m\u1EB7t ph\u1EB3ng ch\u1EE9a g\u1ED1c O(0,0)", "The half-plane containing origin O(0,0)"),
                    t("To\xE0n b\u1ED9 m\u1EB7t ph\u1EB3ng Oxy", "The entire Oxy plane"),
                    t("Ch\u1EC9 \u0111\u01B0\u1EDDng th\u1EB3ng 2x + y = 4", "Only the line 2x + y = 4")
                ],
                answer: 0,
                explain: t("Th\u1EED O(0,0): 2(0)+0 = 0 < 4 \u2192 O kh\xF4ng th\u1ECFa \u2192 mi\u1EC1n nghi\u1EC7m l\xE0 n\u1EEDa mp kh\xF4ng ch\u1EE9a O.", "Test O(0,0): 2(0)+0 = 0 < 4 \u2192 O fails \u2192 solution is the half-plane not containing O.")
            },
            {
                q: t("\u0110i\u1EC3m n\xE0o sau \u0111\xE2y l\xE0 nghi\u1EC7m c\u1EE7a BPT x \u2212 2y < 3?", "Which point is a solution of x \u2212 2y < 3?"),
                options: [
                    "(3, 0)",
                    "(5, 1)",
                    "(1, 2)",
                    "(4, 0)"
                ],
                answer: 2,
                explain: t("Th\u1EED (1,2): 1 \u2212 2(2) = 1\u22124 = \u22123 < 3 \u2713. C\xE1c \u0111i\u1EC3m kh\xE1c: (3,0)\u21923\u226E3; (5,1)\u21923\u226E3; (4,0)\u21924\u226E3.", "Test (1,2): 1\u22122(2) = \u22123 < 3 \u2713. Others: (3,0)\u21923, (5,1)\u21923, (4,0)\u21924, none < 3.")
            },
            {
                q: t("\u0110\u01B0\u1EDDng th\u1EB3ng ax + by + c = 0 chia m\u1EB7t ph\u1EB3ng th\xE0nh bao nhi\xEAu ph\u1EA7n?", "The line ax + by + c = 0 divides the plane into how many parts?"),
                options: [
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                answer: 1,
                explain: t("M\u1ED9t \u0111\u01B0\u1EDDng th\u1EB3ng chia m\u1EB7t ph\u1EB3ng th\xE0nh 2 n\u1EEDa m\u1EB7t ph\u1EB3ng (hai ph\u1EA7n m\u1EDF).", "A line divides the plane into 2 open half-planes.")
            },
            {
                q: t("BPT x + y > 1. \u0110i\u1EC3m (0, 0) c\xF3 th\u1ECFa BPT kh\xF4ng?", "BPT x + y > 1. Does the point (0, 0) satisfy it?"),
                options: [
                    t("C\xF3, v\xEC 0 + 0 > 1", "Yes, because 0 + 0 > 1"),
                    t("Kh\xF4ng, v\xEC 0 + 0 \u2264 1", "No, because 0 + 0 \u2264 1"),
                    t("C\xF3, (0,0) lu\xF4n l\xE0 nghi\u1EC7m", "Yes, (0,0) is always a solution"),
                    t("Kh\xF4ng x\xE1c \u0111\u1ECBnh", "Undetermined")
                ],
                answer: 1,
                explain: t("0 + 0 = 0 < 1, kh\xF4ng th\u1ECFa \u0111i\u1EC1u ki\u1EC7n > 1.", "0 + 0 = 0 < 1, does not satisfy > 1.")
            }
        ];
        tfCards = [
            {
                stmt: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT ax + by + c > 0 lu\xF4n l\xE0 n\u1EEDa m\u1EB7t ph\u1EB3ng m\u1EDF (kh\xF4ng k\u1EC3 bi\xEAn).", "The solution region of ax + by + c > 0 is always an open half-plane (boundary excluded)."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 d\u1EA5u > ho\u1EB7c < kh\xF4ng k\u1EC3 \u0111\u01B0\u1EDDng bi\xEAn. D\u1EA5u \u2265, \u2264 th\xEC k\u1EC3 bi\xEAn.", "TRUE \u2014 strict inequalities (>, <) exclude the boundary. \u2265, \u2264 include it.")
            },
            {
                stmt: t("\u0110i\u1EC3m O(0, 0) lu\xF4n kh\xF4ng ph\u1EA3i nghi\u1EC7m c\u1EE7a BPT ax + by + c > 0.", "The origin O(0,0) is never a solution of ax + by + c > 0."),
                answer: false,
                explain: t("SAI \u2014 ph\u1EE5 thu\u1ED9c v\xE0o c. N\u1EBFu c > 0 th\xEC O(0,0) th\u1ECFa ax+by+c > 0.", "FALSE \u2014 depends on c. If c > 0, O(0,0) satisfies the inequality.")
            },
            {
                stmt: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT l\xE0 m\u1ED9t n\u1EEDa m\u1EB7t ph\u1EB3ng (n\u1EEDa mp m\u1EDF ho\u1EB7c \u0111\xF3ng).", "The solution region of a linear inequality in 2 variables is a half-plane (open or closed)."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 nghi\u1EC7m c\u1EE7a BPT b\u1EADc nh\u1EA5t hai \u1EA9n lu\xF4n l\xE0 n\u1EEDa m\u1EB7t ph\u1EB3ng.", "TRUE \u2014 the solution of a linear inequality in two variables is always a half-plane.")
            },
            {
                stmt: t("BPT b\u1EADc nh\u1EA5t hai \u1EA9n c\xF3 th\u1EC3 v\xF4 nghi\u1EC7m.", "A linear inequality in two variables can have no solution."),
                answer: false,
                explain: t("SAI \u2014 BPT b\u1EADc nh\u1EA5t hai \u1EA9n lu\xF4n c\xF3 mi\u1EC1n nghi\u1EC7m l\xE0 n\u1EEDa m\u1EB7t ph\u1EB3ng (v\xF4 s\u1ED1 nghi\u1EC7m).", "FALSE \u2014 it always has a half-plane as its solution region (infinitely many solutions).")
            },
            {
                stmt: t("\u0110\u1EC3 bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m, ta t\xF4 m\xE0u v\xF9ng th\u1ECFa m\xE3n BPT.", "To represent the solution region, we shade the region satisfying the inequality."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 quy \u01B0\u1EDBc t\xF4 m\xE0u (ho\u1EB7c g\u1EA1ch ch\xE9o) v\xE0o v\xF9ng nghi\u1EC7m.", "TRUE \u2014 convention is to shade (or hatch) the solution region.")
            }
        ];
        fillQuestions = [
            {
                id: "f1",
                template: t("D\u1EA1ng t\u1ED5ng qu\xE1t c\u1EE7a BPT b\u1EADc nh\u1EA5t hai \u1EA9n: ax + by ___ 0 (\u0111i\u1EC1n d\u1EA5u b\u1EA5t k\u1EF3).", "General form of linear inequality in 2 variables: ax + by ___ 0 (fill any inequality sign)."),
                answer: ">",
                altAnswers: [
                    "<",
                    ">=",
                    "<=",
                    "\u2265",
                    "\u2264"
                ],
                hint: t("M\u1ED9t trong b\u1ED1n d\u1EA5u: >, <, \u2265, \u2264.", "One of four signs: >, <, \u2265, \u2264.")
            },
            {
                id: "f2",
                template: t("\u0110\u1EC3 x\xE1c \u0111\u1ECBnh n\u1EEDa m\u1EB7t ph\u1EB3ng ch\u1EE9a nghi\u1EC7m, ta th\u1EED \u0111i\u1EC3m ___ v\xE0o BPT.", "To find which half-plane contains solutions, we test the point ___ in the inequality."),
                answer: "o",
                altAnswers: [
                    "(0,0)",
                    "O(0,0)",
                    "g\u1ED1c t\u1ECDa \u0111\u1ED9",
                    "origin"
                ],
                hint: t("Th\u01B0\u1EDDng d\xF9ng g\u1ED1c t\u1ECDa \u0111\u1ED9 O(0,0).", "We usually use the origin O(0,0).")
            },
            {
                id: "f3",
                template: t("BPT x + 2y \u2264 6. Th\u1EED A(0,0): 0 + 0 = 0 ___ 6, n\xEAn O ___ mi\u1EC1n nghi\u1EC7m.", "BPT x + 2y \u2264 6. Test A(0,0): 0 + 0 = 0 ___ 6, so O ___ in the solution region."),
                answer: "\u2264, thu\u1ED9c",
                altAnswers: [
                    "<=, thuoc",
                    "\u2264,thu\u1ED9c",
                    "<=,thu\u1ED9c"
                ],
                hint: t("0 \u2264 6 \u0111\xFAng, n\xEAn O thu\u1ED9c mi\u1EC1n nghi\u1EC7m.", "0 \u2264 6 is true, so O is in the solution region.")
            }
        ];
        const handleMcSelect = {
            "Lesson4_BPTBacNhatHaiAn[handleMcSelect]": (i_1)=>{
                if (mcSelected !== null) {
                    return;
                }
                setMcSelected(i_1);
                const correct = i_1 === mcQuestions[mcIndex].answer;
                if (correct) {
                    setMcScore(_Lesson4_BPTBacNhatHaiAnHandleMcSelectSetMcScore);
                }
                setMcHistory({
                    "Lesson4_BPTBacNhatHaiAn[handleMcSelect > setMcHistory()]": (h)=>[
                            ...h,
                            {
                                q: mcIndex,
                                selected: i_1,
                                correct
                            }
                        ]
                }["Lesson4_BPTBacNhatHaiAn[handleMcSelect > setMcHistory()]"]);
            }
        }["Lesson4_BPTBacNhatHaiAn[handleMcSelect]"];
        const handleMcNext = {
            "Lesson4_BPTBacNhatHaiAn[handleMcNext]": ()=>{
                if (mcIndex + 1 >= mcQuestions.length) {
                    setMcDone(true);
                } else {
                    setMcIndex(_Lesson4_BPTBacNhatHaiAnHandleMcNextSetMcIndex);
                    setMcSelected(null);
                }
            }
        }["Lesson4_BPTBacNhatHaiAn[handleMcNext]"];
        let t23;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t23 = ({
                "Lesson4_BPTBacNhatHaiAn[resetMc]": ()=>{
                    setMcIndex(0);
                    setMcSelected(null);
                    setMcScore(0);
                    setMcDone(false);
                    setMcHistory([]);
                }
            })["Lesson4_BPTBacNhatHaiAn[resetMc]"];
            $[48] = t23;
        } else {
            t23 = $[48];
        }
        const resetMc = t23;
        handleTfAnswer = ({
            "Lesson4_BPTBacNhatHaiAn[handleTfAnswer]": (ans)=>{
                if (tfFlipped) {
                    return;
                }
                setTfFlipped(true);
                const correct_0 = ans === tfCards[tfIndex].answer;
                if (correct_0) {
                    setTfScore(_Lesson4_BPTBacNhatHaiAnHandleTfAnswerSetTfScore);
                }
                setTfHistory({
                    "Lesson4_BPTBacNhatHaiAn[handleTfAnswer > setTfHistory()]": (h_0)=>[
                            ...h_0,
                            {
                                q: tfIndex,
                                given: ans,
                                correct: correct_0
                            }
                        ]
                }["Lesson4_BPTBacNhatHaiAn[handleTfAnswer > setTfHistory()]"]);
            }
        })["Lesson4_BPTBacNhatHaiAn[handleTfAnswer]"];
        handleTfNext = ({
            "Lesson4_BPTBacNhatHaiAn[handleTfNext]": ()=>{
                if (tfIndex + 1 >= tfCards.length) {
                    setTfDone(true);
                } else {
                    setTfIndex(_Lesson4_BPTBacNhatHaiAnHandleTfNextSetTfIndex);
                    setTfFlipped(false);
                }
            }
        })["Lesson4_BPTBacNhatHaiAn[handleTfNext]"];
        let t24;
        if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = ({
                "Lesson4_BPTBacNhatHaiAn[resetTf]": ()=>{
                    setTfIndex(0);
                    setTfFlipped(false);
                    setTfScore(0);
                    setTfDone(false);
                    setTfHistory([]);
                }
            })["Lesson4_BPTBacNhatHaiAn[resetTf]"];
            $[49] = t24;
        } else {
            t24 = $[49];
        }
        resetTf = t24;
        const checkFill = {
            "Lesson4_BPTBacNhatHaiAn[checkFill]": (id_1)=>{
                const q_0 = fillQuestions.find({
                    "Lesson4_BPTBacNhatHaiAn[checkFill > fillQuestions.find()]": (q)=>q.id === id_1
                }["Lesson4_BPTBacNhatHaiAn[checkFill > fillQuestions.find()]"]);
                const raw = (fillAnswers[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                const answers = [
                    q_0.answer,
                    ...q_0.altAnswers || []
                ].map(_Lesson4_BPTBacNhatHaiAnCheckFillAnonymous);
                return answers.includes(raw);
            }
        }["Lesson4_BPTBacNhatHaiAn[checkFill]"];
        fillScore = fillChecked ? fillQuestions.filter({
            "Lesson4_BPTBacNhatHaiAn[fillQuestions.filter()]": (q_1)=>checkFill(q_1.id)
        }["Lesson4_BPTBacNhatHaiAn[fillQuestions.filter()]"]).length : null;
        let t25;
        if ($[50] !== t) {
            t25 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[50] = t;
            $[51] = t25;
        } else {
            t25 = $[51];
        }
        let t26;
        if ($[52] !== t25) {
            t26 = [
                "khoiDong",
                "\uD83D\uDE80",
                t25
            ];
            $[52] = t25;
            $[53] = t26;
        } else {
            t26 = $[53];
        }
        let t27;
        if ($[54] !== t) {
            t27 = t("1. \u0110\u1ECBnh Ngh\u0129a", "1. Definition");
            $[54] = t;
            $[55] = t27;
        } else {
            t27 = $[55];
        }
        let t28;
        if ($[56] !== t27) {
            t28 = [
                "khai1",
                "\uD83D\uDCD6",
                t27
            ];
            $[56] = t27;
            $[57] = t28;
        } else {
            t28 = $[57];
        }
        let t29;
        if ($[58] !== t) {
            t29 = t("2. Mi\u1EC1n Nghi\u1EC7m", "2. Solution Region");
            $[58] = t;
            $[59] = t29;
        } else {
            t29 = $[59];
        }
        let t30;
        if ($[60] !== t29) {
            t30 = [
                "khai2",
                "\uD83D\uDCD6",
                t29
            ];
            $[60] = t29;
            $[61] = t30;
        } else {
            t30 = $[61];
        }
        let t31;
        if ($[62] !== t) {
            t31 = t("3. Bi\u1EC3u Di\u1EC5n", "3. Graphing");
            $[62] = t;
            $[63] = t31;
        } else {
            t31 = $[63];
        }
        let t32;
        if ($[64] !== t31) {
            t32 = [
                "khai3",
                "\uD83D\uDCD6",
                t31
            ];
            $[64] = t31;
            $[65] = t32;
        } else {
            t32 = $[65];
        }
        let t33;
        if ($[66] !== t) {
            t33 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[66] = t;
            $[67] = t33;
        } else {
            t33 = $[67];
        }
        let t34;
        if ($[68] !== t33) {
            t34 = [
                "thucHanh",
                "\u270F\uFE0F",
                t33
            ];
            $[68] = t33;
            $[69] = t34;
        } else {
            t34 = $[69];
        }
        let t35;
        if ($[70] !== t) {
            t35 = t("Mini Game", "Mini Game");
            $[70] = t;
            $[71] = t35;
        } else {
            t35 = $[71];
        }
        let t36;
        if ($[72] !== t35) {
            t36 = [
                "miniGame",
                "\uD83C\uDFAE",
                t35
            ];
            $[72] = t35;
            $[73] = t36;
        } else {
            t36 = $[73];
        }
        let t37;
        if ($[74] !== t26 || $[75] !== t28 || $[76] !== t30 || $[77] !== t32 || $[78] !== t34 || $[79] !== t36) {
            t37 = [
                t26,
                t28,
                t30,
                t32,
                t34,
                t36
            ];
            $[74] = t26;
            $[75] = t28;
            $[76] = t30;
            $[77] = t32;
            $[78] = t34;
            $[79] = t36;
            $[80] = t37;
        } else {
            t37 = $[80];
        }
        const tabs = t37;
        const SectionHeader = _Lesson4_BPTBacNhatHaiAnSectionHeader;
        let t38;
        if ($[81] !== t) {
            t38 = ({
                "Lesson4_BPTBacNhatHaiAn[ResultSummary]": (t39)=>{
                    const { items, onReset, scoreLabel } = t39;
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
                                        children: items.filter(_Lesson4_BPTBacNhatHaiAnResultSummaryItemsFilter).length === items.length ? "\uD83C\uDFC6" : items.filter(_Lesson4_BPTBacNhatHaiAnResultSummaryItemsFilter2).length >= items.length * 0.6 ? "\uD83D\uDC4D" : "\uD83D\uDCAA"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 469,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 26,
                                            fontWeight: 700,
                                            color: "#0B4F5C"
                                        },
                                        children: [
                                            items.filter(_Lesson4_BPTBacNhatHaiAnResultSummaryItemsFilter3).length,
                                            " / ",
                                            items.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 472,
                                        columnNumber: 258
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#777",
                                            fontSize: 16,
                                            marginTop: 4
                                        },
                                        children: scoreLabel
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 476,
                                        columnNumber: 113
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 466,
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
                                    "Lesson4_BPTBacNhatHaiAn[ResultSummary > items.map()]": (item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                        lineNumber: 495,
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
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                                lineNumber: 500,
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
                                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                                        lineNumber: 508,
                                                                        columnNumber: 84
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                                lineNumber: 505,
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
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                                lineNumber: 508,
                                                                columnNumber: 161
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                        lineNumber: 498,
                                                        columnNumber: 67
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                                lineNumber: 491,
                                                columnNumber: 20
                                            }, this)
                                        }, idx, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                            lineNumber: 486,
                                            columnNumber: 88
                                        }, this)
                                }["Lesson4_BPTBacNhatHaiAn[ResultSummary > items.map()]"])
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 480,
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 514,
                                    columnNumber: 16
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 512,
                                columnNumber: 80
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 466,
                        columnNumber: 18
                    }, this);
                }
            })["Lesson4_BPTBacNhatHaiAn[ResultSummary]"];
            $[81] = t;
            $[82] = t38;
        } else {
            t38 = $[82];
        }
        ResultSummary = t38;
        const mcResultItems = mcHistory.map({
            "Lesson4_BPTBacNhatHaiAn[mcHistory.map()]": (h_1)=>({
                    correct: h_1.correct,
                    qText: mcQuestions[h_1.q].q,
                    correctText: mcQuestions[h_1.q].options[mcQuestions[h_1.q].answer],
                    yourText: mcQuestions[h_1.q].options[h_1.selected]
                })
        }["Lesson4_BPTBacNhatHaiAn[mcHistory.map()]"]);
        tfResultItems = tfHistory.map({
            "Lesson4_BPTBacNhatHaiAn[tfHistory.map()]": (h_2)=>({
                    correct: h_2.correct,
                    qText: tfCards[h_2.q].stmt,
                    correctText: tfCards[h_2.q].answer ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.given ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson4_BPTBacNhatHaiAn[tfHistory.map()]"]);
        fillResultItems = fillChecked ? fillQuestions.map({
            "Lesson4_BPTBacNhatHaiAn[fillQuestions.map()]": (q_2)=>({
                    correct: checkFill(q_2.id),
                    qText: q_2.template,
                    correctText: q_2.answer,
                    yourText: fillAnswers[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson4_BPTBacNhatHaiAn[fillQuestions.map()]"]) : [];
        if ($[83] === Symbol.for("react.memo_cache_sentinel")) {
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
            $[83] = t12;
            $[84] = t22;
        } else {
            t12 = $[83];
            t22 = $[84];
        }
        let t39;
        if ($[85] === Symbol.for("react.memo_cache_sentinel")) {
            t39 = {
                marginBottom: 24
            };
            $[85] = t39;
        } else {
            t39 = $[85];
        }
        let t40;
        if ($[86] === Symbol.for("react.memo_cache_sentinel")) {
            t40 = {
                textDecoration: "none",
                color: "black",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 15
            };
            $[86] = t40;
        } else {
            t40 = $[86];
        }
        let t41;
        if ($[87] !== t) {
            t41 = t("Quay l\u1EA1i", "Back to lessons");
            $[87] = t;
            $[88] = t41;
        } else {
            t41 = $[88];
        }
        if ($[89] !== t41) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t39,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Cacbaitoan10",
                    style: t40,
                    children: [
                        "← ",
                        t41
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                    lineNumber: 608,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 608,
                columnNumber: 13
            }, this);
            $[89] = t41;
            $[90] = t13;
        } else {
            t13 = $[90];
        }
        let t42;
        let t43;
        if ($[91] === Symbol.for("react.memo_cache_sentinel")) {
            t42 = {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                position: "relative",
                zIndex: 300
            };
            t43 = {
                fontWeight: "bold",
                fontSize: 22,
                color: "#0B4F5C",
                letterSpacing: 1
            };
            $[91] = t42;
            $[92] = t43;
        } else {
            t42 = $[91];
            t43 = $[92];
        }
        let t44;
        if ($[93] !== t) {
            t44 = t("Ch\u01B0\u01A1ng II \xB7 B\u1EA5t Ph\u01B0\u01A1ng Tr\xECnh B\u1EADc Nh\u1EA5t", "Chapter II \xB7 Linear Inequalities");
            $[93] = t;
            $[94] = t44;
        } else {
            t44 = $[94];
        }
        let t45;
        if ($[95] !== t44) {
            t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t43,
                children: t44
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 647,
                columnNumber: 13
            }, this);
            $[95] = t44;
            $[96] = t45;
        } else {
            t45 = $[96];
        }
        let t46;
        if ($[97] === Symbol.for("react.memo_cache_sentinel")) {
            t46 = {
                fontSize: 28,
                fontWeight: 600,
                marginTop: 4
            };
            $[97] = t46;
        } else {
            t46 = $[97];
        }
        let t47;
        if ($[98] !== t) {
            t47 = t("B\xE0i 4: B\u1EA5t Ph\u01B0\u01A1ng Tr\xECnh B\u1EADc Nh\u1EA5t Hai \u1EA8n", "Lesson 4: Linear Inequality in Two Variables");
            $[98] = t;
            $[99] = t47;
        } else {
            t47 = $[99];
        }
        let t48;
        if ($[100] !== t47) {
            t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t46,
                children: t47
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 674,
                columnNumber: 13
            }, this);
            $[100] = t47;
            $[101] = t48;
        } else {
            t48 = $[101];
        }
        let t49;
        if ($[102] !== t45 || $[103] !== t48) {
            t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t45,
                    t48
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 682,
                columnNumber: 13
            }, this);
            $[102] = t45;
            $[103] = t48;
            $[104] = t49;
        } else {
            t49 = $[104];
        }
        let t50;
        let t51;
        if ($[105] === Symbol.for("react.memo_cache_sentinel")) {
            t50 = {
                display: "flex",
                gap: 10
            };
            t51 = ({
                "Lesson4_BPTBacNhatHaiAn[<button>.onClick]": ()=>setLang("vi")
            })["Lesson4_BPTBacNhatHaiAn[<button>.onClick]"];
            $[105] = t50;
            $[106] = t51;
        } else {
            t50 = $[105];
            t51 = $[106];
        }
        const t52 = lang === "vi" ? "black" : "#f9f9f9";
        const t53 = lang === "vi" ? "white" : "black";
        let t54;
        if ($[107] !== t52 || $[108] !== t53) {
            t54 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t51,
                style: {
                    background: t52,
                    color: t53,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                },
                children: "🇻🇳 Tiếng Việt"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 709,
                columnNumber: 13
            }, this);
            $[107] = t52;
            $[108] = t53;
            $[109] = t54;
        } else {
            t54 = $[109];
        }
        let t55;
        if ($[110] === Symbol.for("react.memo_cache_sentinel")) {
            t55 = ({
                "Lesson4_BPTBacNhatHaiAn[<button>.onClick]": ()=>setLang("en")
            })["Lesson4_BPTBacNhatHaiAn[<button>.onClick]"];
            $[110] = t55;
        } else {
            t55 = $[110];
        }
        const t56 = lang === "en" ? "black" : "#f9f9f9";
        const t57 = lang === "en" ? "white" : "black";
        let t58;
        if ($[111] !== t56 || $[112] !== t57) {
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
                children: "🇬🇧 English"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 738,
                columnNumber: 13
            }, this);
            $[111] = t56;
            $[112] = t57;
            $[113] = t58;
        } else {
            t58 = $[113];
        }
        let t59;
        if ($[114] !== t54 || $[115] !== t58) {
            t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t50,
                children: [
                    t54,
                    t58
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 756,
                columnNumber: 13
            }, this);
            $[114] = t54;
            $[115] = t58;
            $[116] = t59;
        } else {
            t59 = $[116];
        }
        if ($[117] !== t49 || $[118] !== t59) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "reveal",
                "data-reveal": true,
                style: t42,
                children: [
                    t49,
                    t59
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 764,
                columnNumber: 13
            }, this);
            $[117] = t49;
            $[118] = t59;
            $[119] = t14;
        } else {
            t14 = $[119];
        }
        let t60;
        let t61;
        if ($[120] === Symbol.for("react.memo_cache_sentinel")) {
            t60 = {
                marginBottom: 40,
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t61 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 14
            };
            $[120] = t60;
            $[121] = t61;
        } else {
            t60 = $[120];
            t61 = $[121];
        }
        let t62;
        if ($[122] !== t) {
            t62 = t("Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t", "Learning Objectives");
            $[122] = t;
            $[123] = t62;
        } else {
            t62 = $[123];
        }
        let t63;
        if ($[124] !== t62) {
            t63 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t61,
                children: [
                    "🎯 ",
                    t62
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 802,
                columnNumber: 13
            }, this);
            $[124] = t62;
            $[125] = t63;
        } else {
            t63 = $[125];
        }
        let t64;
        if ($[126] !== t) {
            t64 = t("Nh\u1EADn bi\u1EBFt b\u1EA5t ph\u01B0\u01A1ng tr\xECnh b\u1EADc nh\u1EA5t hai \u1EA9n.", "Identify linear inequalities in two variables.");
            $[126] = t;
            $[127] = t64;
        } else {
            t64 = $[127];
        }
        let t65;
        if ($[128] !== t) {
            t65 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m nghi\u1EC7m v\xE0 mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT.", "Understand solutions and solution regions.");
            $[128] = t;
            $[129] = t65;
        } else {
            t65 = $[129];
        }
        let t66;
        if ($[130] !== t) {
            t66 = t("Bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m tr\xEAn m\u1EB7t ph\u1EB3ng t\u1ECDa \u0111\u1ED9.", "Graph the solution region on the coordinate plane.");
            $[130] = t;
            $[131] = t66;
        } else {
            t66 = $[131];
        }
        let t67;
        if ($[132] !== t) {
            t67 = t("X\xE1c \u0111\u1ECBnh m\u1ED9t \u0111i\u1EC3m c\xF3 thu\u1ED9c mi\u1EC1n nghi\u1EC7m kh\xF4ng.", "Determine whether a point belongs to the solution region.");
            $[132] = t;
            $[133] = t67;
        } else {
            t67 = $[133];
        }
        let t68;
        if ($[134] !== t64 || $[135] !== t65 || $[136] !== t66 || $[137] !== t67) {
            t68 = [
                t64,
                t65,
                t66,
                t67
            ].map(_Lesson4_BPTBacNhatHaiAnAnonymous);
            $[134] = t64;
            $[135] = t65;
            $[136] = t66;
            $[137] = t67;
            $[138] = t68;
        } else {
            t68 = $[138];
        }
        if ($[139] !== t63 || $[140] !== t68) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "60",
                style: t60,
                children: [
                    t63,
                    t68
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 852,
                columnNumber: 13
            }, this);
            $[139] = t63;
            $[140] = t68;
            $[141] = t15;
        } else {
            t15 = $[141];
        }
        let t69;
        let t70;
        if ($[142] === Symbol.for("react.memo_cache_sentinel")) {
            t69 = {
                position: "sticky",
                top: 0,
                zIndex: 200,
                background: "#fff",
                paddingTop: 12,
                paddingBottom: 12,
                marginBottom: 48,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)"
            };
            t70 = {
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
            };
            $[142] = t69;
            $[143] = t70;
        } else {
            t69 = $[142];
            t70 = $[143];
        }
        if ($[144] !== tabs) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t69,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: t70,
                    children: tabs.map({
                        "Lesson4_BPTBacNhatHaiAn[tabs.map()]": (t71)=>{
                            const [id_2, icon_0, label] = t71;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson4_BPTBacNhatHaiAn[tabs.map() > <button>.onClick]": ()=>scrollTo(id_2)
                                }["Lesson4_BPTBacNhatHaiAn[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson4_BPTBacNhatHaiAnTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson4_BPTBacNhatHaiAnTabsMapButtonOnMouseLeave,
                                children: [
                                    icon_0,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 887,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson4_BPTBacNhatHaiAn[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                    lineNumber: 884,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 884,
                columnNumber: 13
            }, this);
            $[144] = tabs;
            $[145] = t16;
        } else {
            t16 = $[145];
        }
        let t71;
        if ($[146] === Symbol.for("react.memo_cache_sentinel")) {
            t71 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[146] = t71;
        } else {
            t71 = $[146];
        }
        let t72;
        if ($[147] !== t) {
            t72 = t("Kh\u1EDFi \u0111\u1ED9ng", "Warm-Up");
            $[147] = t;
            $[148] = t72;
        } else {
            t72 = $[148];
        }
        let t73;
        if ($[149] !== t72) {
            t73 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDE80",
                title: t72
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 928,
                columnNumber: 13
            }, this);
            $[149] = t72;
            $[150] = t73;
        } else {
            t73 = $[150];
        }
        let t74;
        let t75;
        if ($[151] === Symbol.for("react.memo_cache_sentinel")) {
            t74 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t75 = {
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8
            };
            $[151] = t74;
            $[152] = t75;
        } else {
            t74 = $[151];
            t75 = $[152];
        }
        let t76;
        if ($[153] !== t) {
            t76 = t("T\xECnh hu\u1ED1ng m\u1EDF \u0111\u1EA7u", "Opening Situation");
            $[153] = t;
            $[154] = t76;
        } else {
            t76 = $[154];
        }
        let t77;
        if ($[155] !== t76) {
            t77 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t75,
                children: t76
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 964,
                columnNumber: 13
            }, this);
            $[155] = t76;
            $[156] = t77;
        } else {
            t77 = $[156];
        }
        let t78;
        if ($[157] === Symbol.for("react.memo_cache_sentinel")) {
            t78 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 16
            };
            $[157] = t78;
        } else {
            t78 = $[157];
        }
        let t79;
        if ($[158] !== t) {
            t79 = t("M\u1ED9t x\u01B0\u1EDFng s\u1EA3n xu\u1EA5t hai lo\u1EA1i s\u1EA3n ph\u1EA9m A v\xE0 B. M\u1ED7i s\u1EA3n ph\u1EA9m A t\u1ED1n 2 gi\u1EDD, m\u1ED7i s\u1EA3n ph\u1EA9m B t\u1ED1n 3 gi\u1EDD. T\u1ED5ng th\u1EDDi gian l\xE0m vi\u1EC7c kh\xF4ng qu\xE1 120 gi\u1EDD/ng\xE0y. \u0110i\u1EC1u ki\u1EC7n n\xE0y c\xF3 th\u1EC3 m\xF4 t\u1EA3 b\u1EB1ng: 2x + 3y \u2264 120, v\u1EDBi x, y \u2265 0.", "A factory produces two products A and B. Each A takes 2 hours, each B takes 3 hours. Total working time is at most 120 hours/day. This condition is: 2x + 3y \u2264 120, with x, y \u2265 0.");
            $[158] = t;
            $[159] = t79;
        } else {
            t79 = $[159];
        }
        let t80;
        if ($[160] !== t79) {
            t80 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t78,
                children: t79
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 991,
                columnNumber: 13
            }, this);
            $[160] = t79;
            $[161] = t80;
        } else {
            t80 = $[161];
        }
        let t81;
        if ($[162] === Symbol.for("react.memo_cache_sentinel")) {
            t81 = {
                fontSize: 16
            };
            $[162] = t81;
        } else {
            t81 = $[162];
        }
        let t82;
        if ($[163] !== t) {
            t82 = t("\u0110\xE2y l\xE0 v\xED d\u1EE5 c\u1EE7a b\u1EA5t ph\u01B0\u01A1ng tr\xECnh b\u1EADc nh\u1EA5t hai \u1EA9n. T\u1EADp nghi\u1EC7m l\xE0 m\u1ED9t v\xF9ng tr\xEAn m\u1EB7t ph\u1EB3ng Oxy.", "This is a linear inequality in two variables. The solution set is a region on the Oxy plane.");
            $[163] = t;
            $[164] = t82;
        } else {
            t82 = $[164];
        }
        let t83;
        if ($[165] !== t82) {
            t83 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t81,
                children: [
                    "❓ ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        children: t82
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 1016,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1016,
                columnNumber: 13
            }, this);
            $[165] = t82;
            $[166] = t83;
        } else {
            t83 = $[166];
        }
        let t84;
        if ($[167] !== t77 || $[168] !== t80 || $[169] !== t83) {
            t84 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t74,
                children: [
                    t77,
                    t80,
                    t83
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1024,
                columnNumber: 13
            }, this);
            $[167] = t77;
            $[168] = t80;
            $[169] = t83;
            $[170] = t84;
        } else {
            t84 = $[170];
        }
        if ($[171] !== t73 || $[172] !== t84) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khoiDong",
                style: t71,
                children: [
                    t73,
                    t84
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1033,
                columnNumber: 13
            }, this);
            $[171] = t73;
            $[172] = t84;
            $[173] = t17;
        } else {
            t17 = $[173];
        }
        let t85;
        if ($[174] === Symbol.for("react.memo_cache_sentinel")) {
            t85 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[174] = t85;
        } else {
            t85 = $[174];
        }
        let t86;
        if ($[175] !== t) {
            t86 = t("1. \u0110\u1ECBnh Ngh\u0129a", "1. Definition");
            $[175] = t;
            $[176] = t86;
        } else {
            t86 = $[176];
        }
        let t87;
        if ($[177] !== t86) {
            t87 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t86
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1060,
                columnNumber: 13
            }, this);
            $[177] = t86;
            $[178] = t87;
        } else {
            t87 = $[178];
        }
        let t88;
        let t89;
        if ($[179] === Symbol.for("react.memo_cache_sentinel")) {
            t88 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t89 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[179] = t88;
            $[180] = t89;
        } else {
            t88 = $[179];
            t89 = $[180];
        }
        let t90;
        if ($[181] !== t) {
            t90 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[181] = t;
            $[182] = t90;
        } else {
            t90 = $[182];
        }
        let t91;
        if ($[183] !== t90) {
            t91 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t89,
                children: [
                    "📌 ",
                    t90
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1098,
                columnNumber: 13
            }, this);
            $[183] = t90;
            $[184] = t91;
        } else {
            t91 = $[184];
        }
        let t92;
        if ($[185] === Symbol.for("react.memo_cache_sentinel")) {
            t92 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[185] = t92;
        } else {
            t92 = $[185];
        }
        let t93;
        if ($[186] !== t) {
            t93 = t("B\u1EA5t ph\u01B0\u01A1ng tr\xECnh b\u1EADc nh\u1EA5t hai \u1EA9n x, y c\xF3 d\u1EA1ng:", "A linear inequality in two variables x, y has the form:");
            $[186] = t;
            $[187] = t93;
        } else {
            t93 = $[187];
        }
        let t94;
        if ($[188] !== t93) {
            t94 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t92,
                children: t93
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1124,
                columnNumber: 13
            }, this);
            $[188] = t93;
            $[189] = t94;
        } else {
            t94 = $[189];
        }
        let t95;
        let t96;
        if ($[190] === Symbol.for("react.memo_cache_sentinel")) {
            t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 22,
                    color: "#0B4F5C",
                    textAlign: "center",
                    padding: "16px 0"
                },
                children: [
                    "ax + by + c ",
                    ">",
                    " 0  |  ax + by + c ",
                    "<",
                    " 0  |  ax + by + c ≥ 0  |  ax + by + c ≤ 0"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1133,
                columnNumber: 13
            }, this);
            t96 = {
                fontSize: 15,
                color: "#777"
            };
            $[190] = t95;
            $[191] = t96;
        } else {
            t95 = $[190];
            t96 = $[191];
        }
        let t97;
        if ($[192] !== t) {
            t97 = t("Trong \u0111\xF3 a, b, c \u2208 \u211D v\xE0 a, b kh\xF4ng \u0111\u1ED3ng th\u1EDDi b\u1EB1ng 0.", "Where a, b, c \u2208 \u211D and a, b are not both zero.");
            $[192] = t;
            $[193] = t97;
        } else {
            t97 = $[193];
        }
        let t98;
        if ($[194] !== t97) {
            t98 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t96,
                children: t97
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1160,
                columnNumber: 13
            }, this);
            $[194] = t97;
            $[195] = t98;
        } else {
            t98 = $[195];
        }
        let t99;
        if ($[196] !== t91 || $[197] !== t94 || $[198] !== t98) {
            t99 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t88,
                children: [
                    t91,
                    t94,
                    t95,
                    t98
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1168,
                columnNumber: 13
            }, this);
            $[196] = t91;
            $[197] = t94;
            $[198] = t98;
            $[199] = t99;
        } else {
            t99 = $[199];
        }
        let t100;
        if ($[200] === Symbol.for("react.memo_cache_sentinel")) {
            t100 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[200] = t100;
        } else {
            t100 = $[200];
        }
        let t101;
        if ($[201] !== t) {
            t101 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t100,
                children: [
                    {
                        label: t("\u2705 BPT b\u1EADc nh\u1EA5t hai \u1EA9n", "\u2705 Linear inequalities in 2 vars"),
                        items: [
                            "2x + 3y > 6",
                            "x \u2212 y \u2264 0",
                            "\u2212x + 2y + 1 \u2265 0"
                        ],
                        ok: true
                    },
                    {
                        label: t("\u274C KH\xD4NG ph\u1EA3i BPT b\u1EADc nh\u1EA5t hai \u1EA9n", "\u274C NOT linear in 2 vars"),
                        items: [
                            "x\xB2 + y > 0  (c\xF3 x\xB2)",
                            "x + y + z < 1  (3 \u1EA9n)",
                            "2x + 3y = 6  (ph\u01B0\u01A1ng tr\xECnh)"
                        ],
                        ok: false
                    }
                ].map(_Lesson4_BPTBacNhatHaiAnAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1190,
                columnNumber: 14
            }, this);
            $[201] = t;
            $[202] = t101;
        } else {
            t101 = $[202];
        }
        if ($[203] !== t101 || $[204] !== t87 || $[205] !== t99) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai1",
                style: t85,
                children: [
                    t87,
                    t99,
                    t101
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1205,
                columnNumber: 13
            }, this);
            $[203] = t101;
            $[204] = t87;
            $[205] = t99;
            $[206] = t18;
        } else {
            t18 = $[206];
        }
        let t102;
        if ($[207] === Symbol.for("react.memo_cache_sentinel")) {
            t102 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[207] = t102;
        } else {
            t102 = $[207];
        }
        let t103;
        if ($[208] !== t) {
            t103 = t("2. Nghi\u1EC7m v\xE0 Mi\u1EC1n Nghi\u1EC7m", "2. Solutions and Solution Region");
            $[208] = t;
            $[209] = t103;
        } else {
            t103 = $[209];
        }
        let t104;
        if ($[210] !== t103) {
            t104 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t103
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1233,
                columnNumber: 14
            }, this);
            $[210] = t103;
            $[211] = t104;
        } else {
            t104 = $[211];
        }
        let t105;
        let t106;
        if ($[212] === Symbol.for("react.memo_cache_sentinel")) {
            t105 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t106 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[212] = t105;
            $[213] = t106;
        } else {
            t105 = $[212];
            t106 = $[213];
        }
        let t107;
        if ($[214] !== t) {
            t107 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[214] = t;
            $[215] = t107;
        } else {
            t107 = $[215];
        }
        let t108;
        if ($[216] !== t107) {
            t108 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t106,
                children: [
                    "📌 ",
                    t107
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1271,
                columnNumber: 14
            }, this);
            $[216] = t107;
            $[217] = t108;
        } else {
            t108 = $[217];
        }
        let t109;
        if ($[218] === Symbol.for("react.memo_cache_sentinel")) {
            t109 = {
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 10
            };
            $[218] = t109;
        } else {
            t109 = $[218];
        }
        let t110;
        if ($[219] !== t) {
            t110 = t("C\u1EB7p s\u1ED1 (x\u2080, y\u2080) l\xE0 nghi\u1EC7m c\u1EE7a BPT ax + by + c > 0 n\u1EBFu khi thay x = x\u2080, y = y\u2080 v\xE0o BPT, ta \u0111\u01B0\u1EE3c b\u1EA5t \u0111\u1EB3ng th\u1EE9c \u0111\xFAng.", "A pair (x\u2080, y\u2080) is a solution of ax + by + c > 0 if substituting x = x\u2080, y = y\u2080 yields a true inequality.");
            $[219] = t;
            $[220] = t110;
        } else {
            t110 = $[220];
        }
        let t111;
        if ($[221] !== t110) {
            t111 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t109,
                children: t110
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1298,
                columnNumber: 14
            }, this);
            $[221] = t110;
            $[222] = t111;
        } else {
            t111 = $[222];
        }
        let t112;
        if ($[223] === Symbol.for("react.memo_cache_sentinel")) {
            t112 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[223] = t112;
        } else {
            t112 = $[223];
        }
        let t113;
        if ($[224] !== t) {
            t113 = t("T\u1EADp h\u1EE3p t\u1EA5t c\u1EA3 c\xE1c nghi\u1EC7m g\u1ECDi l\xE0 mi\u1EC1n nghi\u1EC7m. Mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT b\u1EADc nh\u1EA5t hai \u1EA9n l\xE0 m\u1ED9t n\u1EEDa m\u1EB7t ph\u1EB3ng.", "The set of all solutions is called the solution region. For a linear inequality in two variables, it is always a half-plane.");
            $[224] = t;
            $[225] = t113;
        } else {
            t113 = $[225];
        }
        let t114;
        if ($[226] !== t113) {
            t114 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t112,
                children: t113
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1324,
                columnNumber: 14
            }, this);
            $[226] = t113;
            $[227] = t114;
        } else {
            t114 = $[227];
        }
        let t115;
        if ($[228] !== t108 || $[229] !== t111 || $[230] !== t114) {
            t115 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t105,
                children: [
                    t108,
                    t111,
                    t114
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1332,
                columnNumber: 14
            }, this);
            $[228] = t108;
            $[229] = t111;
            $[230] = t114;
            $[231] = t115;
        } else {
            t115 = $[231];
        }
        let t116;
        let t117;
        if ($[232] === Symbol.for("react.memo_cache_sentinel")) {
            t116 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t117 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 14
            };
            $[232] = t116;
            $[233] = t117;
        } else {
            t116 = $[232];
            t117 = $[233];
        }
        let t118;
        if ($[234] !== t) {
            t118 = t("Nh\u1EADn x\xE9t quan tr\u1ECDng", "Key Observation");
            $[234] = t;
            $[235] = t118;
        } else {
            t118 = $[235];
        }
        let t119;
        if ($[236] !== t118) {
            t119 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t117,
                children: [
                    "🔑 ",
                    t118
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1370,
                columnNumber: 14
            }, this);
            $[236] = t118;
            $[237] = t119;
        } else {
            t119 = $[237];
        }
        let t120;
        if ($[238] === Symbol.for("react.memo_cache_sentinel")) {
            t120 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                transition: "all 0.3s ease"
            };
            $[238] = t120;
        } else {
            t120 = $[238];
        }
        let t121;
        if ($[239] !== t) {
            t121 = t("\u0110\u01B0\u1EDDng bi\xEAn", "Boundary line");
            $[239] = t;
            $[240] = t121;
        } else {
            t121 = $[240];
        }
        let t122;
        if ($[241] !== t) {
            t122 = t("\u0110\u01B0\u1EDDng th\u1EB3ng ax + by + c = 0 l\xE0 bi\xEAn chia mp th\xE0nh 2 n\u1EEDa.", "Line ax + by + c = 0 is the boundary dividing the plane in 2.");
            $[241] = t;
            $[242] = t122;
        } else {
            t122 = $[242];
        }
        let t123;
        if ($[243] !== t121 || $[244] !== t122) {
            t123 = {
                icon: "\uD83D\uDCCF",
                title: t121,
                desc: t122
            };
            $[243] = t121;
            $[244] = t122;
            $[245] = t123;
        } else {
            t123 = $[245];
        }
        let t124;
        if ($[246] !== t) {
            t124 = t("\u0110\u01B0\u1EDDng k\xEDn / m\u1EDF", "Closed / open boundary");
            $[246] = t;
            $[247] = t124;
        } else {
            t124 = $[247];
        }
        let t125;
        if ($[248] !== t) {
            t125 = t("D\u1EA5u \u2265, \u2264 \u2192 \u0111\u01B0\u1EDDng bi\xEAn thu\u1ED9c mi\u1EC1n nghi\u1EC7m (v\u1EBD li\u1EC1n n\xE9t).\nD\u1EA5u >, < \u2192 \u0111\u01B0\u1EDDng bi\xEAn kh\xF4ng thu\u1ED9c (v\u1EBD n\xE9t \u0111\u1EE9t).", "\u2265, \u2264 \u2192 boundary included (solid line).\n>, < \u2192 boundary excluded (dashed line).");
            $[248] = t;
            $[249] = t125;
        } else {
            t125 = $[249];
        }
        let t126;
        if ($[250] !== t124 || $[251] !== t125) {
            t126 = {
                icon: "\uD83D\uDD12",
                title: t124,
                desc: t125
            };
            $[250] = t124;
            $[251] = t125;
            $[252] = t126;
        } else {
            t126 = $[252];
        }
        let t127;
        if ($[253] !== t) {
            t127 = t("Ki\u1EC3m tra v\u1EDBi O(0,0)", "Test with O(0,0)");
            $[253] = t;
            $[254] = t127;
        } else {
            t127 = $[254];
        }
        let t128;
        if ($[255] !== t) {
            t128 = t("Th\u1EED g\u1ED1c t\u1ECDa \u0111\u1ED9 v\xE0o BPT:\n\u2022 Th\u1ECFa \u2192 O thu\u1ED9c mi\u1EC1n nghi\u1EC7m \u2192 t\xF4 ph\xEDa O\n\u2022 Kh\xF4ng th\u1ECFa \u2192 t\xF4 ph\xEDa \u0111\u1ED1i di\u1EC7n", "Test origin:\n\u2022 Satisfies \u2192 shade O's side\n\u2022 Fails \u2192 shade opposite side");
            $[255] = t;
            $[256] = t128;
        } else {
            t128 = $[256];
        }
        let t129;
        if ($[257] !== t127 || $[258] !== t128) {
            t129 = {
                icon: "\uD83C\uDFAF",
                title: t127,
                desc: t128
            };
            $[257] = t127;
            $[258] = t128;
            $[259] = t129;
        } else {
            t129 = $[259];
        }
        let t130;
        if ($[260] !== t123 || $[261] !== t126 || $[262] !== t129) {
            t130 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t120,
                children: [
                    t123,
                    t126,
                    t129
                ].map(_Lesson4_BPTBacNhatHaiAnAnonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1477,
                columnNumber: 14
            }, this);
            $[260] = t123;
            $[261] = t126;
            $[262] = t129;
            $[263] = t130;
        } else {
            t130 = $[263];
        }
        let t131;
        if ($[264] !== t119 || $[265] !== t130) {
            t131 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t116,
                children: [
                    t119,
                    t130
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1487,
                columnNumber: 14
            }, this);
            $[264] = t119;
            $[265] = t130;
            $[266] = t131;
        } else {
            t131 = $[266];
        }
        if ($[267] !== t104 || $[268] !== t115 || $[269] !== t131) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai2",
                style: t102,
                children: [
                    t104,
                    t115,
                    t131
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1495,
                columnNumber: 13
            }, this);
            $[267] = t104;
            $[268] = t115;
            $[269] = t131;
            $[270] = t19;
        } else {
            t19 = $[270];
        }
        let t132;
        if ($[271] === Symbol.for("react.memo_cache_sentinel")) {
            t132 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[271] = t132;
        } else {
            t132 = $[271];
        }
        let t133;
        if ($[272] !== t) {
            t133 = t("3. C\xE1ch Bi\u1EC3u Di\u1EC5n Mi\u1EC1n Nghi\u1EC7m", "3. Graphing the Solution Region");
            $[272] = t;
            $[273] = t133;
        } else {
            t133 = $[273];
        }
        let t134;
        if ($[274] !== t133) {
            t134 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t133
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1523,
                columnNumber: 14
            }, this);
            $[274] = t133;
            $[275] = t134;
        } else {
            t134 = $[275];
        }
        let t135;
        let t136;
        if ($[276] === Symbol.for("react.memo_cache_sentinel")) {
            t135 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t136 = {
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 16,
                color: "#0B4F5C"
            };
            $[276] = t135;
            $[277] = t136;
        } else {
            t135 = $[276];
            t136 = $[277];
        }
        let t137;
        if ($[278] !== t) {
            t137 = t("C\xE1c b\u01B0\u1EDBc th\u1EF1c hi\u1EC7n", "Steps");
            $[278] = t;
            $[279] = t137;
        } else {
            t137 = $[279];
        }
        let t138;
        if ($[280] !== t137) {
            t138 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t136,
                children: [
                    "📋 ",
                    t137
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1561,
                columnNumber: 14
            }, this);
            $[280] = t137;
            $[281] = t138;
        } else {
            t138 = $[281];
        }
        let t139;
        if ($[282] === Symbol.for("react.memo_cache_sentinel")) {
            t139 = {
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "all 0.3s ease"
            };
            $[282] = t139;
        } else {
            t139 = $[282];
        }
        let t140;
        if ($[283] !== t) {
            t140 = t("V\u1EBD \u0111\u01B0\u1EDDng th\u1EB3ng d: ax + by + c = 0 (d\u1EA1ng ph\u01B0\u01A1ng tr\xECnh \u0111\u01B0\u1EDDng th\u1EB3ng).", "Draw the line d: ax + by + c = 0.");
            $[283] = t;
            $[284] = t140;
        } else {
            t140 = $[284];
        }
        let t141;
        if ($[285] !== t140) {
            t141 = {
                step: "1",
                text: t140
            };
            $[285] = t140;
            $[286] = t141;
        } else {
            t141 = $[286];
        }
        let t142;
        if ($[287] !== t) {
            t142 = t("Ch\u1ECDn m\u1ED9t \u0111i\u1EC3m th\u1EED kh\xF4ng n\u1EB1m tr\xEAn d (th\u01B0\u1EDDng d\xF9ng O(0,0)).", "Choose a test point not on d (usually O(0,0)).");
            $[287] = t;
            $[288] = t142;
        } else {
            t142 = $[288];
        }
        let t143;
        if ($[289] !== t142) {
            t143 = {
                step: "2",
                text: t142
            };
            $[289] = t142;
            $[290] = t143;
        } else {
            t143 = $[290];
        }
        let t144;
        if ($[291] !== t) {
            t144 = t("Thay \u0111i\u1EC3m th\u1EED v\xE0o BPT:\n\u2022 Th\u1ECFa \u2192 t\xF4 m\xE0u n\u1EEDa mp ch\u1EE9a \u0111i\u1EC3m th\u1EED\n\u2022 Kh\xF4ng th\u1ECFa \u2192 t\xF4 m\xE0u n\u1EEDa mp \u0111\u1ED1i di\u1EC7n", "Substitute test point:\n\u2022 Satisfies \u2192 shade the side containing it\n\u2022 Fails \u2192 shade the opposite side");
            $[291] = t;
            $[292] = t144;
        } else {
            t144 = $[292];
        }
        let t145;
        if ($[293] !== t144) {
            t145 = {
                step: "3",
                text: t144
            };
            $[293] = t144;
            $[294] = t145;
        } else {
            t145 = $[294];
        }
        let t146;
        if ($[295] !== t) {
            t146 = t("Quy \u01B0\u1EDBc v\u1EBD \u0111\u01B0\u1EDDng bi\xEAn: li\u1EC1n n\xE9t (\u2265, \u2264), n\xE9t \u0111\u1EE9t (>, <).", "Draw boundary: solid line (\u2265, \u2264), dashed line (>, <).");
            $[295] = t;
            $[296] = t146;
        } else {
            t146 = $[296];
        }
        let t147;
        if ($[297] !== t146) {
            t147 = {
                step: "4",
                text: t146
            };
            $[297] = t146;
            $[298] = t147;
        } else {
            t147 = $[298];
        }
        let t148;
        if ($[299] !== t141 || $[300] !== t143 || $[301] !== t145 || $[302] !== t147) {
            t148 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t139,
                children: [
                    t141,
                    t143,
                    t145,
                    t147
                ].map(_Lesson4_BPTBacNhatHaiAnAnonymous4)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1657,
                columnNumber: 14
            }, this);
            $[299] = t141;
            $[300] = t143;
            $[301] = t145;
            $[302] = t147;
            $[303] = t148;
        } else {
            t148 = $[303];
        }
        let t149;
        if ($[304] !== t138 || $[305] !== t148) {
            t149 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t135,
                children: [
                    t138,
                    t148
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1668,
                columnNumber: 14
            }, this);
            $[304] = t138;
            $[305] = t148;
            $[306] = t149;
        } else {
            t149 = $[306];
        }
        let t150;
        let t151;
        if ($[307] === Symbol.for("react.memo_cache_sentinel")) {
            t150 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t151 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12
            };
            $[307] = t150;
            $[308] = t151;
        } else {
            t150 = $[307];
            t151 = $[308];
        }
        let t152;
        if ($[309] !== t) {
            t152 = t("V\xED d\u1EE5: Bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m c\u1EE7a 2x + y \u2265 4", "Example: Graph 2x + y \u2265 4");
            $[309] = t;
            $[310] = t152;
        } else {
            t152 = $[310];
        }
        let t153;
        if ($[311] !== t152) {
            t153 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t151,
                children: [
                    "📘 ",
                    t152
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1705,
                columnNumber: 14
            }, this);
            $[311] = t152;
            $[312] = t153;
        } else {
            t153 = $[312];
        }
        let t154;
        if ($[313] === Symbol.for("react.memo_cache_sentinel")) {
            t154 = {
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 15,
                color: "#555",
                lineHeight: 1.8
            };
            $[313] = t154;
        } else {
            t154 = $[313];
        }
        let t155;
        if ($[314] !== t) {
            t155 = t("\u0110\u01B0\u1EDDng bi\xEAn: 2x + y = 4. V\u1EBD li\u1EC1n n\xE9t (d\u1EA5u \u2265).", "Boundary: 2x + y = 4. Draw solid (\u2265).");
            $[314] = t;
            $[315] = t155;
        } else {
            t155 = $[315];
        }
        let t156;
        if ($[316] !== t155) {
            t156 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    "① ",
                    t155
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1735,
                columnNumber: 14
            }, this);
            $[316] = t155;
            $[317] = t156;
        } else {
            t156 = $[317];
        }
        let t157;
        if ($[318] !== t) {
            t157 = t("Th\u1EED O(0,0): 2(0) + 0 = 0 < 4 \u2192 kh\xF4ng th\u1ECFa.", "Test O(0,0): 2(0)+0 = 0 < 4 \u2192 fails.");
            $[318] = t;
            $[319] = t157;
        } else {
            t157 = $[319];
        }
        let t158;
        if ($[320] !== t157) {
            t158 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    "② ",
                    t157
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1751,
                columnNumber: 14
            }, this);
            $[320] = t157;
            $[321] = t158;
        } else {
            t158 = $[321];
        }
        let t159;
        if ($[322] !== t) {
            t159 = t("T\xF4 m\xE0u n\u1EEDa m\u1EB7t ph\u1EB3ng kh\xF4ng ch\u1EE9a O (ph\xEDa tr\xEAn-ph\u1EA3i \u0111\u01B0\u1EDDng bi\xEAn).", "Shade the half-plane not containing O (above-right of boundary).");
            $[322] = t;
            $[323] = t159;
        } else {
            t159 = $[323];
        }
        let t160;
        if ($[324] !== t159) {
            t160 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    "③ ",
                    t159
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1767,
                columnNumber: 14
            }, this);
            $[324] = t159;
            $[325] = t160;
        } else {
            t160 = $[325];
        }
        let t161;
        if ($[326] === Symbol.for("react.memo_cache_sentinel")) {
            t161 = {
                marginTop: 8,
                padding: "10px 14px",
                background: "#eafaf1",
                borderRadius: 8,
                color: "#1e8449",
                fontWeight: 600
            };
            $[326] = t161;
        } else {
            t161 = $[326];
        }
        let t162;
        if ($[327] !== t) {
            t162 = t("Mi\u1EC1n t\xF4 m\xE0u (k\u1EC3 c\u1EA3 \u0111\u01B0\u1EDDng bi\xEAn) ch\xEDnh l\xE0 mi\u1EC1n nghi\u1EC7m.", "The shaded region (including boundary) is the solution region.");
            $[327] = t;
            $[328] = t162;
        } else {
            t162 = $[328];
        }
        let t163;
        if ($[329] !== t162) {
            t163 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t161,
                children: [
                    "✅ ",
                    t162
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1797,
                columnNumber: 14
            }, this);
            $[329] = t162;
            $[330] = t163;
        } else {
            t163 = $[330];
        }
        let t164;
        if ($[331] !== t156 || $[332] !== t158 || $[333] !== t160 || $[334] !== t163) {
            t164 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t154,
                children: [
                    t156,
                    t158,
                    t160,
                    t163
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1805,
                columnNumber: 14
            }, this);
            $[331] = t156;
            $[332] = t158;
            $[333] = t160;
            $[334] = t163;
            $[335] = t164;
        } else {
            t164 = $[335];
        }
        let t165;
        if ($[336] !== t153 || $[337] !== t164) {
            t165 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t150,
                children: [
                    t153,
                    t164
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1816,
                columnNumber: 14
            }, this);
            $[336] = t153;
            $[337] = t164;
            $[338] = t165;
        } else {
            t165 = $[338];
        }
        if ($[339] !== t134 || $[340] !== t149 || $[341] !== t165) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai3",
                style: t132,
                children: [
                    t134,
                    t149,
                    t165
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1824,
                columnNumber: 13
            }, this);
            $[339] = t134;
            $[340] = t149;
            $[341] = t165;
            $[342] = t20;
        } else {
            t20 = $[342];
        }
        let t166;
        if ($[343] === Symbol.for("react.memo_cache_sentinel")) {
            t166 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[343] = t166;
        } else {
            t166 = $[343];
        }
        let t167;
        if ($[344] !== t) {
            t167 = t("Th\u1EF1c H\xE0nh", "Practice Exercises");
            $[344] = t;
            $[345] = t167;
        } else {
            t167 = $[345];
        }
        let t168;
        if ($[346] !== t167) {
            t168 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\u270F\uFE0F",
                title: t167
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1852,
                columnNumber: 14
            }, this);
            $[346] = t167;
            $[347] = t168;
        } else {
            t168 = $[347];
        }
        let t169;
        if ($[348] === Symbol.for("react.memo_cache_sentinel")) {
            t169 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 40,
                transition: "all 0.3s ease"
            };
            $[348] = t169;
        } else {
            t169 = $[348];
        }
        let t170;
        if ($[349] !== revealedAnswers || $[350] !== t) {
            t170 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t169,
                children: [
                    {
                        id: "e1",
                        q: t("X\xE9t xem \u0111i\u1EC3m n\xE0o l\xE0 nghi\u1EC7m c\u1EE7a BPT 3x \u2212 2y > 6:\n(a) A(4, 2)\n(b) B(1, \u22123)\n(c) C(2, 0)", "Which points satisfy 3x \u2212 2y > 6:\n(a) A(4, 2)\n(b) B(1, \u22123)\n(c) C(2, 0)"),
                        a: [
                            t("(a) 3(4)\u22122(2)=12\u22124=8>6 \u2713 \u2192 A l\xE0 nghi\u1EC7m", "(a) 3(4)\u22122(2)=8>6 \u2713 \u2192 A is a solution"),
                            t("(b) 3(1)\u22122(\u22123)=3+6=9>6 \u2713 \u2192 B l\xE0 nghi\u1EC7m", "(b) 3(1)\u22122(\u22123)=9>6 \u2713 \u2192 B is a solution"),
                            t("(c) 3(2)\u22122(0)=6, 6>6 sai \u2192 C kh\xF4ng l\xE0 nghi\u1EC7m", "(c) 3(2)\u22122(0)=6, 6>6 is false \u2192 C is not a solution")
                        ]
                    },
                    {
                        id: "e2",
                        q: t("Bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT: x + 2y \u2264 6", "Graph the solution region of: x + 2y \u2264 6"),
                        a: [
                            t("B\u01B0\u1EDBc 1: \u0110\u01B0\u1EDDng bi\xEAn x + 2y = 6 (li\u1EC1n n\xE9t v\xEC \u2264).", "Step 1: Boundary x + 2y = 6 (solid line, \u2264)."),
                            t("B\u01B0\u1EDBc 2: Th\u1EED O(0,0): 0+0 = 0 \u2264 6 \u2713 \u2192 O thu\u1ED9c mi\u1EC1n nghi\u1EC7m.", "Step 2: Test O(0,0): 0 \u2264 6 \u2713 \u2192 O is in the region."),
                            t("B\u01B0\u1EDBc 3: T\xF4 m\xE0u n\u1EEDa m\u1EB7t ph\u1EB3ng ch\u1EE9a O (ph\xEDa d\u01B0\u1EDBi-tr\xE1i \u0111\u01B0\u1EDDng bi\xEAn).", "Step 3: Shade the half-plane containing O (below-left of boundary).")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("Trong m\u1EB7t ph\u1EB3ng Oxy, \u0111i\u1EC3m M(\u22121, 3) thu\u1ED9c mi\u1EC1n nghi\u1EC7m c\u1EE7a BPT n\xE0o?", "In the Oxy plane, which inequality has M(\u22121, 3) as a solution?"),
                        a: [
                            t("Th\u1EED v\u1EDBi 2x \u2212 y + 5 \u2265 0:", "Test with 2x \u2212 y + 5 \u2265 0:"),
                            t("2(\u22121) \u2212 3 + 5 = \u22122\u22123+5 = 0 \u2265 0 \u2713 \u2192 M l\xE0 nghi\u1EC7m", "2(\u22121)\u22123+5 = 0 \u2265 0 \u2713 \u2192 M is a solution"),
                            t("Th\u1EED x + y \u2212 1 > 0: \u22121+3\u22121 = 1 > 0 \u2713 \u2192 M c\u0169ng l\xE0 nghi\u1EC7m c\u1EE7a BPT n\xE0y.", "Test x+y\u22121>0: \u22121+3\u22121=1>0 \u2713 \u2192 M is also a solution of this one.")
                        ]
                    }
                ].map({
                    "Lesson4_BPTBacNhatHaiAn[(anonymous)()]": (t171)=>{
                        const { id: id_3, q: q_3, a: a_0 } = t171;
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                            lineNumber: 1896,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14
                                            },
                                            children: t("To\xE1n 10", "Grade 10")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                            lineNumber: 1900,
                                            columnNumber: 63
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                marginTop: 10,
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: q_3
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                            lineNumber: 1903,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 1891,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson4_BPTBacNhatHaiAn[(anonymous)() > <button>.onClick]": ()=>toggleAnswer(id_3)
                                    }["Lesson4_BPTBacNhatHaiAn[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 1908,
                                    columnNumber: 37
                                }, this),
                                revealedAnswers[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_0.map(_Lesson4_BPTBacNhatHaiAnAnonymousA_0Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 1921,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                            lineNumber: 1891,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson4_BPTBacNhatHaiAn[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1872,
                columnNumber: 14
            }, this);
            $[349] = revealedAnswers;
            $[350] = t;
            $[351] = t170;
        } else {
            t170 = $[351];
        }
        if ($[352] !== t168 || $[353] !== t170) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "thucHanh",
                style: t166,
                children: [
                    t168,
                    t170
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1935,
                columnNumber: 13
            }, this);
            $[352] = t168;
            $[353] = t170;
            $[354] = t21;
        } else {
            t21 = $[354];
        }
        t7 = "miniGame";
        if ($[355] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[355] = t8;
        } else {
            t8 = $[355];
        }
        let t171;
        if ($[356] !== t) {
            t171 = t("Mini Game", "Mini Game");
            $[356] = t;
            $[357] = t171;
        } else {
            t171 = $[357];
        }
        if ($[358] !== t171) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83C\uDFAE",
                title: t171
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 1961,
                columnNumber: 12
            }, this);
            $[358] = t171;
            $[359] = t9;
        } else {
            t9 = $[359];
        }
        let t172;
        if ($[360] === Symbol.for("react.memo_cache_sentinel")) {
            t172 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s ease"
            };
            $[360] = t172;
        } else {
            t172 = $[360];
        }
        let t173;
        if ($[361] !== t) {
            t173 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[361] = t;
            $[362] = t173;
        } else {
            t173 = $[362];
        }
        let t174;
        if ($[363] !== t) {
            t174 = t("5 c\xE2u h\u1ECFi", "5 questions");
            $[363] = t;
            $[364] = t174;
        } else {
            t174 = $[364];
        }
        let t175;
        if ($[365] !== t173 || $[366] !== t174) {
            t175 = [
                "mc",
                "\uD83E\uDDE9",
                t173,
                t174
            ];
            $[365] = t173;
            $[366] = t174;
            $[367] = t175;
        } else {
            t175 = $[367];
        }
        let t176;
        if ($[368] !== t) {
            t176 = t("\u0110\xFAng / Sai", "True / False");
            $[368] = t;
            $[369] = t176;
        } else {
            t176 = $[369];
        }
        let t177;
        if ($[370] !== t) {
            t177 = t("5 th\u1EBB", "5 cards");
            $[370] = t;
            $[371] = t177;
        } else {
            t177 = $[371];
        }
        let t178;
        if ($[372] !== t176 || $[373] !== t177) {
            t178 = [
                "tf",
                "\uD83C\uDCCF",
                t176,
                t177
            ];
            $[372] = t176;
            $[373] = t177;
            $[374] = t178;
        } else {
            t178 = $[374];
        }
        let t179;
        if ($[375] !== t) {
            t179 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[375] = t;
            $[376] = t179;
        } else {
            t179 = $[376];
        }
        let t180;
        if ($[377] !== t) {
            t180 = t("3 c\xE2u", "3 items");
            $[377] = t;
            $[378] = t180;
        } else {
            t180 = $[378];
        }
        let t181;
        if ($[379] !== t179 || $[380] !== t180) {
            t181 = [
                "fill",
                "\u270D\uFE0F",
                t179,
                t180
            ];
            $[379] = t179;
            $[380] = t180;
            $[381] = t181;
        } else {
            t181 = $[381];
        }
        let t182;
        if ($[382] !== t175 || $[383] !== t178 || $[384] !== t181) {
            t182 = [
                t175,
                t178,
                t181
            ];
            $[382] = t175;
            $[383] = t178;
            $[384] = t181;
            $[385] = t182;
        } else {
            t182 = $[385];
        }
        if ($[386] !== gameMode || $[387] !== t182) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t172,
                children: t182.map({
                    "Lesson4_BPTBacNhatHaiAn[(anonymous)()]": (t183)=>{
                        const [mode, icon_1, label_0, sub] = t183;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson4_BPTBacNhatHaiAn[(anonymous)() > <article>.onClick]": ()=>setGameMode(mode)
                            }["Lesson4_BPTBacNhatHaiAn[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 2078,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 2081,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 2084,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                            lineNumber: 2069,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson4_BPTBacNhatHaiAn[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2066,
                columnNumber: 13
            }, this);
            $[386] = gameMode;
            $[387] = t182;
            $[388] = t10;
        } else {
            t10 = $[388];
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2101,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2105,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQuestions[mcIndex].options.map({
                            "Lesson4_BPTBacNhatHaiAn[(anonymous)()]": (opt, i_12)=>{
                                let bg = "white";
                                let color = "black";
                                if (mcSelected !== null) {
                                    if (i_12 === mcQuestions[mcIndex].answer) {
                                        bg = "#eafaf1";
                                        color = "#1e8449";
                                    } else {
                                        if (i_12 === mcSelected) {
                                            bg = "#fdf2f2";
                                            color = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson4_BPTBacNhatHaiAn[(anonymous)() > <button>.onClick]": ()=>handleMcSelect(i_12)
                                    }["Lesson4_BPTBacNhatHaiAn[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color,
                                        fontSize: 15,
                                        fontWeight: mcSelected !== null && (i_12 === mcSelected || i_12 === mcQuestions[mcIndex].answer) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "all 0.15s"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_12),
                                        ". ",
                                        opt
                                    ]
                                }, i_12, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                    lineNumber: 2128,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson4_BPTBacNhatHaiAn[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2109,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2144,
                                columnNumber: 88
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2152,
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2162,
                columnNumber: 157
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2096,
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
        $[41] = t21;
        $[42] = t22;
        $[43] = t7;
        $[44] = t8;
        $[45] = t9;
        $[46] = tfCards;
        $[47] = tfResultItems;
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
        t21 = $[41];
        t22 = $[42];
        t7 = $[43];
        t8 = $[44];
        t9 = $[45];
        tfCards = $[46];
        tfResultItems = $[47];
    }
    let t23;
    if ($[389] !== ResultSummary || $[390] !== gameMode || $[391] !== handleTfAnswer || $[392] !== handleTfNext || $[393] !== resetTf || $[394] !== t || $[395] !== tfCards || $[396] !== tfDone || $[397] !== tfFlipped || $[398] !== tfIndex || $[399] !== tfResultItems || $[400] !== tfScore) {
        t23 = gameMode === "tf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2236,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2247,
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
                                            "Lesson4_BPTBacNhatHaiAn[<button>.onClick]": ()=>handleTfAnswer(true)
                                        }["Lesson4_BPTBacNhatHaiAn[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2255,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson4_BPTBacNhatHaiAn[<button>.onClick]": ()=>handleTfAnswer(false)
                                        }["Lesson4_BPTBacNhatHaiAn[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2266,
                                        columnNumber: 54
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2251,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2277,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2286,
                                        columnNumber: 51
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2240,
                        columnNumber: 117
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                items: tfResultItems,
                onReset: resetTf,
                scoreLabel: tfScore === tfCards.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2295,
                columnNumber: 167
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2231,
            columnNumber: 32
        }, this);
        $[389] = ResultSummary;
        $[390] = gameMode;
        $[391] = handleTfAnswer;
        $[392] = handleTfNext;
        $[393] = resetTf;
        $[394] = t;
        $[395] = tfCards;
        $[396] = tfDone;
        $[397] = tfFlipped;
        $[398] = tfIndex;
        $[399] = tfResultItems;
        $[400] = tfScore;
        $[401] = t23;
    } else {
        t23 = $[401];
    }
    let t24;
    if ($[402] !== ResultSummary || $[403] !== fillAnswers || $[404] !== fillChecked || $[405] !== fillQuestions || $[406] !== fillResultItems || $[407] !== fillScore || $[408] !== gameMode || $[409] !== t) {
        t24 = gameMode === "fill" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2319,
                        columnNumber: 26
                    }, this),
                    fillQuestions.map({
                        "Lesson4_BPTBacNhatHaiAn[fillQuestions.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2326,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2330,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: fillAnswers[q_4.id] || "",
                                        onChange: {
                                            "Lesson4_BPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange]": (e_1)=>setFillAnswers({
                                                    "Lesson4_BPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange > setFillAnswers()]": (p_0)=>({
                                                            ...p_0,
                                                            [q_4.id]: e_1.target.value
                                                        })
                                                }["Lesson4_BPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange > setFillAnswers()]"])
                                        }["Lesson4_BPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                        lineNumber: 2334,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, q_4.id, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2324,
                                columnNumber: 72
                            }, this)
                    }["Lesson4_BPTBacNhatHaiAn[fillQuestions.map()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "Lesson4_BPTBacNhatHaiAn[<button>.onClick]": ()=>setFillChecked(true)
                        }["Lesson4_BPTBacNhatHaiAn[<button>.onClick]"],
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2352,
                        columnNumber: 60
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                    items: fillResultItems,
                    onReset: {
                        "Lesson4_BPTBacNhatHaiAn[<ResultSummary>.onReset]": ()=>{
                            setFillAnswers({});
                            setFillChecked(false);
                        }
                    }["Lesson4_BPTBacNhatHaiAn[<ResultSummary>.onReset]"],
                    scoreLabel: fillScore === fillQuestions.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fillScore >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                    lineNumber: 2363,
                    columnNumber: 66
                }, this)
            }, void 0, false)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2314,
            columnNumber: 34
        }, this);
        $[402] = ResultSummary;
        $[403] = fillAnswers;
        $[404] = fillChecked;
        $[405] = fillQuestions;
        $[406] = fillResultItems;
        $[407] = fillScore;
        $[408] = gameMode;
        $[409] = t;
        $[410] = t24;
    } else {
        t24 = $[410];
    }
    let t25;
    if ($[411] !== t10 || $[412] !== t11 || $[413] !== t23 || $[414] !== t24 || $[415] !== t7 || $[416] !== t8 || $[417] !== t9) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2383,
            columnNumber: 11
        }, this);
        $[411] = t10;
        $[412] = t11;
        $[413] = t23;
        $[414] = t24;
        $[415] = t7;
        $[416] = t8;
        $[417] = t9;
        $[418] = t25;
    } else {
        t25 = $[418];
    }
    let t26;
    if ($[419] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2397,
            columnNumber: 11
        }, this);
        $[419] = t26;
    } else {
        t26 = $[419];
    }
    let t27;
    if ($[420] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[420] = t27;
    } else {
        t27 = $[420];
    }
    let t28;
    if ($[421] !== t) {
        t28 = t("B\xE0i 4 / Ch\u01B0\u01A1ng II", "Lesson 4 / Chapter II");
        $[421] = t;
        $[422] = t28;
    } else {
        t28 = $[422];
    }
    let t29;
    if ($[423] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t27,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2426,
            columnNumber: 11
        }, this);
        $[423] = t28;
        $[424] = t29;
    } else {
        t29 = $[424];
    }
    let t30;
    let t31;
    if ($[425] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n          .reveal { opacity:0; transform:translateY(28px) scale(0.97); transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1); will-change:opacity,transform; }\n          .reveal.visible { opacity:1; transform:translateY(0) scale(1); }\n          .reveal[data-reveal-stagger].visible { opacity:1; transform:none; }\n          .reveal[data-reveal-stagger] > * { opacity:0; transform:translateY(24px) scale(0.97); will-change:opacity,transform; }\n          header.reveal { transform:translateY(-18px); opacity:0; }\n          header.reveal.visible { opacity:1; transform:translateY(0); }\n          article { transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease; border-radius:10px; padding:8px; }\n          article:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 12px 28px rgba(0,0,0,0.12); }\n        "
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2435,
            columnNumber: 11
        }, this);
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2436,
            columnNumber: 11
        }, this);
        $[425] = t30;
        $[426] = t31;
    } else {
        t30 = $[425];
        t31 = $[426];
    }
    let t32;
    if ($[427] !== t12 || $[428] !== t13 || $[429] !== t14 || $[430] !== t15 || $[431] !== t16 || $[432] !== t17 || $[433] !== t18 || $[434] !== t19 || $[435] !== t20 || $[436] !== t21 || $[437] !== t25 || $[438] !== t29) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2445,
            columnNumber: 11
        }, this);
        $[427] = t12;
        $[428] = t13;
        $[429] = t14;
        $[430] = t15;
        $[431] = t16;
        $[432] = t17;
        $[433] = t18;
        $[434] = t19;
        $[435] = t20;
        $[436] = t21;
        $[437] = t25;
        $[438] = t29;
        $[439] = t32;
    } else {
        t32 = $[439];
    }
    let t33;
    if ($[440] !== t22 || $[441] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t22,
            children: t32
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
            lineNumber: 2464,
            columnNumber: 11
        }, this);
        $[440] = t22;
        $[441] = t32;
        $[442] = t33;
    } else {
        t33 = $[442];
    }
    return t33;
}
_s(Lesson4_BPTBacNhatHaiAn, "o9ln2GYkrW8yJye2B9T4lwZLUUE=");
_c1 = Lesson4_BPTBacNhatHaiAn;
function _Lesson4_BPTBacNhatHaiAnAnonymousA_0Map(line, i_11) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: line
    }, i_11, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
        lineNumber: 2474,
        columnNumber: 10
    }, this);
}
function _Lesson4_BPTBacNhatHaiAnAnonymous4(s_1, i_10) {
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
                children: s_1.step
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2485,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    color: "#555",
                    lineHeight: 1.7,
                    paddingTop: 4,
                    whiteSpace: "pre-wrap"
                },
                children: s_1.text
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2497,
                columnNumber: 24
            }, this)
        ]
    }, i_10, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
        lineNumber: 2481,
        columnNumber: 10
    }, this);
}
function _Lesson4_BPTBacNhatHaiAnAnonymous3(card, i_9) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: 16,
            borderRadius: 10,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 24,
                    marginBottom: 6
                },
                children: card.icon
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2511,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 6
                },
                children: card.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2514,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    color: "#777",
                    whiteSpace: "pre-wrap"
                },
                children: card.desc
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2518,
                columnNumber: 26
            }, this)
        ]
    }, i_9, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
        lineNumber: 2506,
        columnNumber: 10
    }, this);
}
function _Lesson4_BPTBacNhatHaiAnAnonymous2(g, i_8) {
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
                children: g.label
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2530,
                columnNumber: 6
            }, this),
            g.items.map({
                "Lesson4_BPTBacNhatHaiAn[(anonymous)() > g.items.map()]": (item_0, ii)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 15,
                            color: "#555",
                            marginBottom: 8,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: item_0
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2542,
                                columnNumber: 10
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: g.ok ? "#eafaf1" : "#fdf2f2",
                                    color: g.ok ? "#1e8449" : "#922b21",
                                    padding: "2px 10px",
                                    borderRadius: 20,
                                    marginLeft: 8
                                },
                                children: g.ok ? "\u2713" : "\u2717"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                                lineNumber: 2544,
                                columnNumber: 27
                            }, this)
                        ]
                    }, ii, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                        lineNumber: 2535,
                        columnNumber: 81
                    }, this)
            }["Lesson4_BPTBacNhatHaiAn[(anonymous)() > g.items.map()]"])
        ]
    }, i_8, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
        lineNumber: 2525,
        columnNumber: 10
    }, this);
}
function _Lesson4_BPTBacNhatHaiAnTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson4_BPTBacNhatHaiAnTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson4_BPTBacNhatHaiAnAnonymous(obj, i_7) {
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
    }, i_7, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
        lineNumber: 2564,
        columnNumber: 10
    }, this);
}
function _Lesson4_BPTBacNhatHaiAnResultSummaryItemsFilter3(i_6) {
    return i_6.correct;
}
function _Lesson4_BPTBacNhatHaiAnResultSummaryItemsFilter2(i_4) {
    return i_4.correct;
}
function _Lesson4_BPTBacNhatHaiAnResultSummaryItemsFilter(i_5) {
    return i_5.correct;
}
function _Lesson4_BPTBacNhatHaiAnSectionHeader(t0) {
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2594,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
                lineNumber: 2594,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson4_BPTBacNhatHaiAn.js",
        lineNumber: 2584,
        columnNumber: 10
    }, this);
}
function _Lesson4_BPTBacNhatHaiAnCheckFillAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson4_BPTBacNhatHaiAnHandleTfNextSetTfIndex(i_3) {
    return i_3 + 1;
}
function _Lesson4_BPTBacNhatHaiAnHandleTfAnswerSetTfScore(s_0) {
    return s_0 + 1;
}
function _Lesson4_BPTBacNhatHaiAnHandleMcNextSetMcIndex(i_2) {
    return i_2 + 1;
}
function _Lesson4_BPTBacNhatHaiAnHandleMcSelectSetMcScore(s) {
    return s + 1;
}
function _Lesson4_BPTBacNhatHaiAnScrollTo(id_0) {
    const el_2 = document.getElementById(id_0);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson4_BPTBacNhatHaiAnUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson4_BPTBacNhatHaiAnUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson4_BPTBacNhatHaiAn[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson4_BPTBacNhatHaiAn[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp(entries, observer) {
    entries.forEach({
        "Lesson4_BPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson4_BPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "Lesson4_BPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson4_BPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["Lesson4_BPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson4_BPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson4_BPTBacNhatHaiAnUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson4_BPTBacNhatHaiAn[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["Lesson4_BPTBacNhatHaiAn[useEffect() > els.forEach() > (anonymous)()]"]);
    }
}
var _c, _c1;
__turbopack_context__.k.register(_c, "SectionHeader");
__turbopack_context__.k.register(_c1, "Lesson4_BPTBacNhatHaiAn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_891b66aa._.js.map