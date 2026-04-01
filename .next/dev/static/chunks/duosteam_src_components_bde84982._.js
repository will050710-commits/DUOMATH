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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson13_GiaiTamGiac
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
    if ($[0] !== "4d5af85eaa986434fc8aaefb843071938c2455deed6a7fc7215da8a5fc11e938") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d5af85eaa986434fc8aaefb843071938c2455deed6a7fc7215da8a5fc11e938";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
    if ($[0] !== "4d5af85eaa986434fc8aaefb843071938c2455deed6a7fc7215da8a5fc11e938") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d5af85eaa986434fc8aaefb843071938c2455deed6a7fc7215da8a5fc11e938";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                                lineNumber: 198,
                                                columnNumber: 67
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 198,
                                        columnNumber: 144
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 188,
                                columnNumber: 57
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 181,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, idx, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 257,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
function Lesson13_GiaiTamGiac() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(437);
    if ($[0] !== "4d5af85eaa986434fc8aaefb843071938c2455deed6a7fc7215da8a5fc11e938") {
        for(let $i = 0; $i < 437; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4d5af85eaa986434fc8aaefb843071938c2455deed6a7fc7215da8a5fc11e938";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson13_GiaiTamGiacUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson13_GiaiTamGiac[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson13_GiaiTamGiac[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    const sc = _Lesson13_GiaiTamGiacSc;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson13_GiaiTamGiac[tr]": (id_0)=>setRev({
                    "Lesson13_GiaiTamGiac[tr > setRev()]": (p)=>({
                            ...p,
                            [id_0]: !p[id_0]
                        })
                }["Lesson13_GiaiTamGiac[tr > setRev()]"])
        })["Lesson13_GiaiTamGiac[tr]"];
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
                q: t("'Gi\u1EA3i tam gi\xE1c' ngh\u0129a l\xE0 g\xEC?", "What does 'solving a triangle' mean?"),
                o: [
                    t("T\xEDnh di\u1EC7n t\xEDch", "Find the area"),
                    t("T\xECm t\u1EA5t c\u1EA3 c\u1EA1nh v\xE0 g\xF3c ch\u01B0a bi\u1EBFt", "Find all unknown sides and angles"),
                    t("T\xEDnh chu vi", "Find the perimeter"),
                    t("Ch\u1EE9ng minh tam gi\xE1c \u0111\u1ED3ng d\u1EA1ng", "Prove similarity")
                ],
                a: 1,
                ex: t("Gi\u1EA3i tam gi\xE1c = t\xECm t\u1EA5t c\u1EA3 3 g\xF3c v\xE0 3 c\u1EA1nh t\u1EEB d\u1EEF ki\u1EC7n \u0111\xE3 cho.", "Solving = finding all 3 angles and 3 sides from the given data.")
            },
            {
                q: t("C\xF4ng th\u1EE9c di\u1EC7n t\xEDch tam gi\xE1c theo 2 c\u1EA1nh v\xE0 g\xF3c xen gi\u1EEFa l\xE0?", "Area of triangle from 2 sides and included angle?"),
                o: [
                    "S = a\xB7b",
                    "S = (1/2)\xB7a\xB7b\xB7sinC",
                    "S = (1/2)\xB7base\xB7height",
                    "S = a\xB2\xB7sinC"
                ],
                a: 1,
                ex: t("S=(1/2)\xB7a\xB7b\xB7sinC \u2014 di\u1EC7n t\xEDch qua 2 c\u1EA1nh a, b v\xE0 g\xF3c C xen gi\u1EEFa.", "S=(1/2)\xB7a\xB7b\xB7sinC using sides a, b and included angle C.")
            },
            {
                q: t("Bi\u1EBFt 3 c\u1EA1nh a=3, b=4, c=5. Di\u1EC7n t\xEDch tam gi\xE1c l\xE0?", "Sides 3,4,5. Area of triangle?"),
                o: [
                    "6",
                    "7",
                    "8",
                    "12"
                ],
                a: 0,
                ex: t("Tam gi\xE1c vu\xF4ng (3-4-5). S=(1/2)\xB73\xB74=6.", "Right triangle (3-4-5). S=(1/2)\xB73\xB74=6.")
            },
            {
                q: t("Tam gi\xE1c ABC: A=30\xB0, b=6, c=4. Di\u1EC7n t\xEDch S = ?", "Triangle: A=30\xB0, b=6, c=4. Find area S."),
                o: [
                    "6",
                    "12",
                    "3",
                    "24"
                ],
                a: 0,
                ex: t("S=(1/2)\xB7b\xB7c\xB7sinA=(1/2)\xB76\xB74\xB7sin30\xB0=12\xB7(1/2)=6.", "S=(1/2)\xB76\xB74\xB7sin30\xB0=12\xB70.5=6.")
            },
            {
                q: t("Mu\u1ED1n t\xEDnh chi\u1EC1u cao ng\u1ECDn n\xFAi t\u1EEB xa, ng\u01B0\u1EDDi ta d\xF9ng?", "To find a mountain's height from a distance, you use?"),
                o: [
                    t("Ch\u1EC9 th\u01B0\u1EDBc \u0111o", "Only a ruler"),
                    t("Ch\u1EC9 \u0110\u1ECBnh l\xED Pythagore", "Only Pythagoras"),
                    t("\u0110\u1ECBnh l\xED Sin ho\u1EB7c C\xF4sin + \u0111o g\xF3c", "Law of Sines or Cosines + angle measurement"),
                    t("Kh\xF4ng th\u1EC3 t\xEDnh \u0111\u01B0\u1EE3c", "Cannot be calculated")
                ],
                a: 2,
                ex: t("\u0110o c\xE1c g\xF3c t\u1EEB hai \u0111i\u1EC3m \u0111\xE3 bi\u1EBFt kho\u1EA3ng c\xE1ch \u2192 d\xF9ng \u0111\u1ECBnh l\xED Sin/C\xF4sin \u2192 t\xEDnh chi\u1EC1u cao.", "Measure angles from 2 known points \u2192 use Sin/Cosine law \u2192 find height.")
            }
        ];
        tfC = [
            {
                s: t("S=(1/2)\xB7a\xB7b\xB7sinC l\xE0 c\xF4ng th\u1EE9c di\u1EC7n t\xEDch tam gi\xE1c qua 2 c\u1EA1nh v\xE0 g\xF3c xen gi\u1EEFa.", "S=(1/2)\xB7a\xB7b\xB7sinC is the triangle area formula using 2 sides and the included angle."),
                a: true,
                ex: t("\u0110\xDANG \u2014 \u0111\xE2y l\xE0 c\xF4ng th\u1EE9c chu\u1EA9n.", "TRUE \u2014 this is the standard formula.")
            },
            {
                s: t("Tam gi\xE1c vu\xF4ng a=3, b=4, c=5 c\xF3 di\u1EC7n t\xEDch S=10.", "Right triangle 3-4-5 has area S=10."),
                a: false,
                ex: t("SAI \u2014 S=(1/2)\xB73\xB74=6, kh\xF4ng ph\u1EA3i 10.", "FALSE \u2014 S=(1/2)\xB73\xB74=6, not 10.")
            },
            {
                s: t("\u0110\u1EC3 gi\u1EA3i tam gi\xE1c c\u1EA7n \xEDt nh\u1EA5t 3 d\u1EEF ki\u1EC7n \u0111\u1ED9c l\u1EADp (trong \u0111\xF3 c\xF3 \xEDt nh\u1EA5t 1 c\u1EA1nh).", "To solve a triangle you need at least 3 independent pieces of data (including at least 1 side)."),
                a: true,
                ex: t("\u0110\xDANG \u2014 3 g\xF3c th\xF4i th\xEC ch\u01B0a \u0111\u1EE7 (kh\xF4ng x\xE1c \u0111\u1ECBnh k\xEDch th\u01B0\u1EDBc). C\u1EA7n \xEDt nh\u1EA5t 1 c\u1EA1nh.", "TRUE \u2014 3 angles alone don't determine size. Need at least 1 side.")
            },
            {
                s: t("Hai tam gi\xE1c \u0111\u1ED3ng d\u1EA1ng c\xF3 th\u1EC3 gi\u1EA3i \u0111\u01B0\u1EE3c b\u1EB1ng c\xF9ng m\u1ED9t b\u1ED9 s\u1ED1 g\xF3c v\xE0 c\u1EA1nh.", "Two similar triangles can be solved with the same set of angles and sides."),
                a: false,
                ex: t("SAI \u2014 \u0111\u1ED3ng d\u1EA1ng c\xF3 c\xF9ng g\xF3c nh\u01B0ng c\u1EA1nh kh\xE1c nhau (t\u1EC9 l\u1EC7).", "FALSE \u2014 similar triangles share angles but have proportionally different sides.")
            },
            {
                s: t("C\xF4ng th\u1EE9c S=(1/2)\xB7a\xB7b\xB7sinC \u0111\xFAng v\u1EDBi m\u1ECDi g\xF3c C t\u1EEB 0\xB0 \u0111\u1EBFn 180\xB0.", "S=(1/2)\xB7a\xB7b\xB7sinC holds for any angle C from 0\xB0 to 180\xB0."),
                a: true,
                ex: t("\u0110\xDANG \u2014 sinC\u22650 v\u1EDBi 0\xB0\u2264C\u2264180\xB0, n\xEAn S\u22650 v\xE0 c\xF4ng th\u1EE9c lu\xF4n \u0111\xFAng.", "TRUE \u2014 sinC\u22650 for 0\xB0\u2264C\u2264180\xB0, so S\u22650 and the formula always holds.")
            }
        ];
        fQ = [
            {
                id: "f1",
                tp: t("C\xF4ng th\u1EE9c di\u1EC7n t\xEDch qua 2 c\u1EA1nh a, b v\xE0 g\xF3c C xen gi\u1EEFa: S = (1/2) \xB7 a \xB7 b \xB7 ___", "Area via 2 sides a,b and included angle C: S = (1/2) \xB7 a \xB7 b \xB7 ___"),
                ans: "sinC",
                alt: [
                    "sinc",
                    "sin C",
                    "sin(C)",
                    "sinC"
                ],
                h: ""
            },
            {
                id: "f2",
                tp: t("Tam gi\xE1c vu\xF4ng (C=90\xB0): S = (1/2) \xB7 a \xB7 b \xB7 sin90\xB0 = (1/2) \xB7 a \xB7 ___", "Right triangle (C=90\xB0): S=(1/2)\xB7a\xB7b\xB7sin90\xB0=(1/2)\xB7a\xB7___"),
                ans: "b",
                alt: [
                    "b"
                ],
                h: "sin90\xB0=1"
            },
            {
                id: "f3",
                tp: t("\u0110\u1EC3 gi\u1EA3i ho\xE0n to\xE0n m\u1ED9t tam gi\xE1c c\u1EA7n bi\u1EBFt \xEDt nh\u1EA5t ___ d\u1EEF ki\u1EC7n (c\xF3 \xEDt nh\u1EA5t 1 c\u1EA1nh).", "To fully solve a triangle you need at least ___ pieces of data (at least 1 side)."),
                ans: "3",
                alt: [
                    "3",
                    "ba",
                    "three"
                ],
                h: ""
            }
        ];
        const cf = {
            "Lesson13_GiaiTamGiac[cf]": (id_1)=>{
                const q_0 = fQ.find({
                    "Lesson13_GiaiTamGiac[cf > fQ.find()]": (q)=>q.id === id_1
                }["Lesson13_GiaiTamGiac[cf > fQ.find()]"]);
                const r = (fa[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                return [
                    q_0.ans,
                    ...q_0.alt || []
                ].map(_Lesson13_GiaiTamGiacCfAnonymous).includes(r);
            }
        }["Lesson13_GiaiTamGiac[cf]"];
        fs = fc ? fQ.filter({
            "Lesson13_GiaiTamGiac[fQ.filter()]": (q_1)=>cf(q_1.id)
        }["Lesson13_GiaiTamGiac[fQ.filter()]"]).length : null;
        const sel = {
            "Lesson13_GiaiTamGiac[sel]": (i_1)=>{
                if (ms !== null) {
                    return;
                }
                setMs(i_1);
                const c_1 = i_1 === mcQ[mi].a;
                if (c_1) {
                    setMsc(_Lesson13_GiaiTamGiacSelSetMsc);
                }
                setMh({
                    "Lesson13_GiaiTamGiac[sel > setMh()]": (h)=>[
                            ...h,
                            {
                                q: mi,
                                s: i_1,
                                c: c_1
                            }
                        ]
                }["Lesson13_GiaiTamGiac[sel > setMh()]"]);
            }
        }["Lesson13_GiaiTamGiac[sel]"];
        const nx = {
            "Lesson13_GiaiTamGiac[nx]": ()=>{
                if (mi + 1 >= mcQ.length) {
                    setMd(true);
                } else {
                    setMi(_Lesson13_GiaiTamGiacNxSetMi);
                    setMs(null);
                }
            }
        }["Lesson13_GiaiTamGiac[nx]"];
        let t24;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = ({
                "Lesson13_GiaiTamGiac[rm]": ()=>{
                    setMi(0);
                    setMs(null);
                    setMsc(0);
                    setMd(false);
                    setMh([]);
                }
            })["Lesson13_GiaiTamGiac[rm]"];
            $[48] = t24;
        } else {
            t24 = $[48];
        }
        const rm = t24;
        ta = ({
            "Lesson13_GiaiTamGiac[ta]": (a_0)=>{
                if (tf) {
                    return;
                }
                setTf(true);
                const c_2 = a_0 === tfC[ti].a;
                if (c_2) {
                    setTs(_Lesson13_GiaiTamGiacTaSetTs);
                }
                setTh({
                    "Lesson13_GiaiTamGiac[ta > setTh()]": (h_0)=>[
                            ...h_0,
                            {
                                q: ti,
                                g: a_0,
                                c: c_2
                            }
                        ]
                }["Lesson13_GiaiTamGiac[ta > setTh()]"]);
            }
        })["Lesson13_GiaiTamGiac[ta]"];
        tn = ({
            "Lesson13_GiaiTamGiac[tn]": ()=>{
                if (ti + 1 >= tfC.length) {
                    setTd(true);
                } else {
                    setTi(_Lesson13_GiaiTamGiacTnSetTi);
                    setTf(false);
                }
            }
        })["Lesson13_GiaiTamGiac[tn]"];
        let t25;
        if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
            t25 = ({
                "Lesson13_GiaiTamGiac[rt]": ()=>{
                    setTi(0);
                    setTf(false);
                    setTs(0);
                    setTd(false);
                    setTh([]);
                }
            })["Lesson13_GiaiTamGiac[rt]"];
            $[49] = t25;
        } else {
            t25 = $[49];
        }
        rt = t25;
        const mri = mh.map({
            "Lesson13_GiaiTamGiac[mh.map()]": (h_1)=>({
                    correct: h_1.c,
                    qText: mcQ[h_1.q].q,
                    correctText: mcQ[h_1.q].o[mcQ[h_1.q].a],
                    yourText: mcQ[h_1.q].o[h_1.s]
                })
        }["Lesson13_GiaiTamGiac[mh.map()]"]);
        tri = th.map({
            "Lesson13_GiaiTamGiac[th.map()]": (h_2)=>({
                    correct: h_2.c,
                    qText: tfC[h_2.q].s,
                    correctText: tfC[h_2.q].a ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.g ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson13_GiaiTamGiac[th.map()]"]);
        fri = fc ? fQ.map({
            "Lesson13_GiaiTamGiac[fQ.map()]": (q_2)=>({
                    correct: cf(q_2.id),
                    qText: q_2.tp,
                    correctText: q_2.ans,
                    yourText: fa[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson13_GiaiTamGiac[fQ.map()]"]) : [];
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
            t28 = t("1. Kh\xE1i Ni\u1EC7m", "1. Concept");
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
            t30 = t("2. Di\u1EC7n T\xEDch", "2. Area");
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
            t32 = t("3. C\xE1c TH Gi\u1EA3i", "3. Cases");
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
            t34 = t("4. \u1EE8ng D\u1EE5ng", "4. Applications");
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
                    href: "/cacbailam10",
                    style: t41,
                    children: [
                        "← ",
                        t42
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                    lineNumber: 749,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            t45 = t("Ch\u01B0\u01A1ng IV \xB7 H\u1EC7 Th\u1EE9c L\u01B0\u1EE3ng Trong Tam Gi\xE1c", "Chapter IV \xB7 Triangle Trigonometry");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            t48 = t("B\xE0i 13: Gi\u1EA3i Tam Gi\xE1c v\xE0 \u1EE8ng D\u1EE5ng", "Lesson 13: Solving Triangles & Applications");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                "Lesson13_GiaiTamGiac[<button>.onClick]": ()=>setLang("vi")
            })["Lesson13_GiaiTamGiac[<button>.onClick]"];
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                "Lesson13_GiaiTamGiac[<button>.onClick]": ()=>setLang("en")
            })["Lesson13_GiaiTamGiac[<button>.onClick]"];
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            t65 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m 'gi\u1EA3i tam gi\xE1c'.", "Understand what 'solving a triangle' means.");
            $[125] = t;
            $[126] = t65;
        } else {
            t65 = $[126];
        }
        let t66;
        if ($[127] !== t) {
            t66 = t("T\xEDnh di\u1EC7n t\xEDch b\u1EB1ng c\xF4ng th\u1EE9c S=(1/2)\xB7a\xB7b\xB7sinC.", "Compute area using S=(1/2)\xB7a\xB7b\xB7sinC.");
            $[127] = t;
            $[128] = t66;
        } else {
            t66 = $[128];
        }
        let t67;
        if ($[129] !== t) {
            t67 = t("Bi\u1EBFt \xE1p d\u1EE5ng \u0111\u1ECBnh l\xED Sin ho\u1EB7c C\xF4sin tu\u1EF3 t\u1EEBng tr\u01B0\u1EDDng h\u1EE3p.", "Know when to apply Law of Sines vs. Cosines.");
            $[129] = t;
            $[130] = t67;
        } else {
            t67 = $[130];
        }
        let t68;
        if ($[131] !== t) {
            t68 = t("Gi\u1EA3i c\xE1c b\xE0i to\xE1n th\u1EF1c t\u1EBF: t\xEDnh chi\u1EC1u cao, kho\u1EA3ng c\xE1ch.", "Solve real-world problems: heights, distances.");
            $[131] = t;
            $[132] = t68;
        } else {
            t68 = $[132];
        }
        let t69;
        if ($[133] !== t) {
            t69 = t("Ph\xE2n t\xEDch b\xE0i to\xE1n v\xE0 l\u1EADp quy tr\xECnh gi\u1EA3i.", "Analyze a problem and set up a solution strategy.");
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
            ].map(_Lesson13_GiaiTamGiacAnonymous);
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                        "Lesson13_GiaiTamGiac[tabs.map()]": (t73)=>{
                            const [id_2, icon, label] = t73;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson13_GiaiTamGiac[tabs.map() > <button>.onClick]": ()=>sc(id_2)
                                }["Lesson13_GiaiTamGiac[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson13_GiaiTamGiacTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson13_GiaiTamGiacTabsMapButtonOnMouseLeave,
                                children: [
                                    icon,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 1036,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson13_GiaiTamGiac[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                    lineNumber: 1033,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            t78 = t("C\xE1c nh\xE0 kh\u1EA3o s\xE1t \u0111\u1ECBa h\xECnh, ki\u1EBFn tr\xFAc s\u01B0 v\xE0 hoa ti\xEAu t\xE0u bi\u1EC3n \u0111\u1EC1u c\u1EA7n gi\u1EA3i tam gi\xE1c m\u1ED7i ng\xE0y. Bi\u1EBFt g\xF3c v\xE0 kho\u1EA3ng c\xE1ch t\u1EEB c\xE1c \u0111i\u1EC3m quan s\xE1t, h\u1ECD t\xEDnh ra chi\u1EC1u cao n\xFAi, chi\u1EC1u d\xE0i c\u1EA7u hay v\u1ECB tr\xED t\xE0u. T\u1EA5t c\u1EA3 \u0111\u1EC1u quy v\u1EC1 b\xE0i to\xE1n gi\u1EA3i tam gi\xE1c.", "Surveyors, architects, and navigators solve triangles daily. From observed angles and known distances, they compute mountain heights, bridge lengths, or ship positions. All reduce to solving triangles.");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            t81 = t("C\u1EA7n t\u1ED1i thi\u1EC3u bao nhi\xEAu d\u1EEF ki\u1EC7n (bao g\u1ED3m \xEDt nh\u1EA5t 1 c\u1EA1nh) \u0111\u1EC3 x\xE1c \u0111\u1ECBnh duy nh\u1EA5t m\u1ED9t tam gi\xE1c?", "What is the minimum number of pieces of data (including at least 1 side) to uniquely determine a triangle?");
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 1138,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
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
            t85 = t("1. Kh\xE1i Ni\u1EC7m Gi\u1EA3i Tam Gi\xE1c", "1. Solving a Triangle \u2014 Concept");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1181,
                columnNumber: 13
            }, this);
            $[173] = t85;
            $[174] = t86;
        } else {
            t86 = $[174];
        }
        let t87;
        let t88;
        if ($[175] === Symbol.for("react.memo_cache_sentinel")) {
            t87 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t88 = {
                fontWeight: "bold",
                fontSize: 17,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[175] = t87;
            $[176] = t88;
        } else {
            t87 = $[175];
            t88 = $[176];
        }
        let t89;
        if ($[177] !== t) {
            t89 = t("\u0110\u1ECBnh ngh\u0129a", "Definition");
            $[177] = t;
            $[178] = t89;
        } else {
            t89 = $[178];
        }
        let t90;
        if ($[179] !== t89) {
            t90 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t88,
                children: [
                    "📌 ",
                    t89
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1219,
                columnNumber: 13
            }, this);
            $[179] = t89;
            $[180] = t90;
        } else {
            t90 = $[180];
        }
        let t91;
        if ($[181] === Symbol.for("react.memo_cache_sentinel")) {
            t91 = {
                fontSize: 15,
                lineHeight: 1.8
            };
            $[181] = t91;
        } else {
            t91 = $[181];
        }
        let t92;
        if ($[182] !== t) {
            t92 = t("Gi\u1EA3i tam gi\xE1c ABC l\xE0 t\xECm t\u1EA5t c\u1EA3 c\xE1c c\u1EA1nh (a, b, c) v\xE0 c\xE1c g\xF3c (A, B, C) ch\u01B0a bi\u1EBFt, t\u1EEB m\u1ED9t s\u1ED1 d\u1EEF ki\u1EC7n \u0111\xE3 cho.", "Solving triangle ABC means finding all unknown sides (a, b, c) and angles (A, B, C) from given data.");
            $[182] = t;
            $[183] = t92;
        } else {
            t92 = $[183];
        }
        let t93;
        if ($[184] !== t92) {
            t93 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t91,
                children: t92
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1245,
                columnNumber: 13
            }, this);
            $[184] = t92;
            $[185] = t93;
        } else {
            t93 = $[185];
        }
        let t94;
        if ($[186] !== t90 || $[187] !== t93) {
            t94 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t87,
                children: [
                    t90,
                    t93
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1253,
                columnNumber: 13
            }, this);
            $[186] = t90;
            $[187] = t93;
            $[188] = t94;
        } else {
            t94 = $[188];
        }
        let t95;
        if ($[189] === Symbol.for("react.memo_cache_sentinel")) {
            t95 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 16,
                transition: "all 0.3s"
            };
            $[189] = t95;
        } else {
            t95 = $[189];
        }
        let t96;
        if ($[190] !== t) {
            t96 = t("D\u1EEF ki\u1EC7n t\u1ED1i thi\u1EC3u", "Minimum data");
            $[190] = t;
            $[191] = t96;
        } else {
            t96 = $[191];
        }
        let t97;
        if ($[192] !== t) {
            t97 = t("3 d\u1EEF ki\u1EC7n, trong \u0111\xF3 \xEDt nh\u1EA5t 1 c\u1EA1nh (3 g\xF3c kh\xF4ng \u0111\u1EE7)", "3 pieces, at least 1 side (3 angles not enough)");
            $[192] = t;
            $[193] = t97;
        } else {
            t97 = $[193];
        }
        let t98;
        if ($[194] !== t96 || $[195] !== t97) {
            t98 = {
                icon: "\uD83D\uDCD0",
                title: t96,
                note: t97
            };
            $[194] = t96;
            $[195] = t97;
            $[196] = t98;
        } else {
            t98 = $[196];
        }
        let t99;
        if ($[197] !== t) {
            t99 = t("C\xF4ng c\u1EE5 ch\xEDnh", "Main tools");
            $[197] = t;
            $[198] = t99;
        } else {
            t99 = $[198];
        }
        let t100;
        if ($[199] !== t) {
            t100 = t("\u0110\u1ECBnh l\xED Sin + \u0110\u1ECBnh l\xED C\xF4sin + A+B+C=180\xB0", "Law of Sines + Law of Cosines + A+B+C=180\xB0");
            $[199] = t;
            $[200] = t100;
        } else {
            t100 = $[200];
        }
        let t101;
        if ($[201] !== t100 || $[202] !== t99) {
            t101 = {
                icon: "\uD83D\uDD11",
                title: t99,
                note: t100
            };
            $[201] = t100;
            $[202] = t99;
            $[203] = t101;
        } else {
            t101 = $[203];
        }
        let t102;
        if ($[204] !== t) {
            t102 = t("Nghi\u1EC7m h\u1EE3p l\u1EC7", "Valid solution");
            $[204] = t;
            $[205] = t102;
        } else {
            t102 = $[205];
        }
        let t103;
        if ($[206] !== t) {
            t103 = t("C\xE1c g\xF3c d\u01B0\u01A1ng, t\u1ED5ng 3 g\xF3c=180\xB0, c\u1EA1nh d\u01B0\u01A1ng", "Positive angles, sum=180\xB0, positive sides");
            $[206] = t;
            $[207] = t103;
        } else {
            t103 = $[207];
        }
        let t104;
        if ($[208] !== t102 || $[209] !== t103) {
            t104 = {
                icon: "\u2705",
                title: t102,
                note: t103
            };
            $[208] = t102;
            $[209] = t103;
            $[210] = t104;
        } else {
            t104 = $[210];
        }
        let t105;
        if ($[211] !== t101 || $[212] !== t104 || $[213] !== t98) {
            t105 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t95,
                children: [
                    t98,
                    t101,
                    t104
                ].map(_Lesson13_GiaiTamGiacAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1361,
                columnNumber: 14
            }, this);
            $[211] = t101;
            $[212] = t104;
            $[213] = t98;
            $[214] = t105;
        } else {
            t105 = $[214];
        }
        if ($[215] !== t105 || $[216] !== t86 || $[217] !== t94) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k1",
                style: t84,
                children: [
                    t86,
                    t94,
                    t105
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1370,
                columnNumber: 13
            }, this);
            $[215] = t105;
            $[216] = t86;
            $[217] = t94;
            $[218] = t18;
        } else {
            t18 = $[218];
        }
        let t106;
        if ($[219] === Symbol.for("react.memo_cache_sentinel")) {
            t106 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[219] = t106;
        } else {
            t106 = $[219];
        }
        let t107;
        if ($[220] !== t) {
            t107 = t("2. C\xF4ng Th\u1EE9c Di\u1EC7n T\xEDch", "2. Area Formula");
            $[220] = t;
            $[221] = t107;
        } else {
            t107 = $[221];
        }
        let t108;
        if ($[222] !== t107) {
            t108 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t107
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1398,
                columnNumber: 14
            }, this);
            $[222] = t107;
            $[223] = t108;
        } else {
            t108 = $[223];
        }
        let t109;
        let t110;
        if ($[224] === Symbol.for("react.memo_cache_sentinel")) {
            t109 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 20
            };
            t110 = {
                fontWeight: "bold",
                fontSize: 16,
                color: "#0B4F5C",
                marginBottom: 12
            };
            $[224] = t109;
            $[225] = t110;
        } else {
            t109 = $[224];
            t110 = $[225];
        }
        let t111;
        if ($[226] !== t) {
            t111 = t("Di\u1EC7n t\xEDch tam gi\xE1c qua 2 c\u1EA1nh v\xE0 g\xF3c xen gi\u1EEFa:", "Area via 2 sides and included angle:");
            $[226] = t;
            $[227] = t111;
        } else {
            t111 = $[227];
        }
        let t112;
        if ($[228] !== t111) {
            t112 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t110,
                children: t111
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1436,
                columnNumber: 14
            }, this);
            $[228] = t111;
            $[229] = t112;
        } else {
            t112 = $[229];
        }
        let t113;
        if ($[230] === Symbol.for("react.memo_cache_sentinel")) {
            t113 = {
                background: "white",
                borderRadius: 10,
                padding: "16px 20px",
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: 20,
                color: "#0B4F5C",
                fontWeight: 700,
                lineHeight: 2.4
            };
            $[230] = t113;
        } else {
            t113 = $[230];
        }
        let t114;
        if ($[231] === Symbol.for("react.memo_cache_sentinel")) {
            t114 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1461,
                columnNumber: 14
            }, this);
            $[231] = t114;
        } else {
            t114 = $[231];
        }
        let t115;
        if ($[232] === Symbol.for("react.memo_cache_sentinel")) {
            t115 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t113,
                children: [
                    "S = (1/2) · a · b · sinC",
                    t114,
                    "S = (1/2) · b · c · sinA",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 1468,
                        columnNumber: 86
                    }, this),
                    "S = (1/2) · a · c · sinB"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1468,
                columnNumber: 14
            }, this);
            $[232] = t115;
        } else {
            t115 = $[232];
        }
        let t116;
        if ($[233] !== t112) {
            t116 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t109,
                children: [
                    t112,
                    t115
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1475,
                columnNumber: 14
            }, this);
            $[233] = t112;
            $[234] = t116;
        } else {
            t116 = $[234];
        }
        let t117;
        if ($[235] === Symbol.for("react.memo_cache_sentinel")) {
            t117 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 16,
                transition: "all 0.3s"
            };
            $[235] = t117;
        } else {
            t117 = $[235];
        }
        let t118;
        if ($[236] !== t) {
            t118 = t("Tam gi\xE1c vu\xF4ng (C=90\xB0)", "Right triangle (C=90\xB0)");
            $[236] = t;
            $[237] = t118;
        } else {
            t118 = $[237];
        }
        let t119;
        if ($[238] !== t) {
            t119 = t("sin90\xB0=1", "sin90\xB0=1");
            $[238] = t;
            $[239] = t119;
        } else {
            t119 = $[239];
        }
        let t120;
        if ($[240] !== t118 || $[241] !== t119) {
            t120 = {
                shape: t118,
                formula: "S = (1/2)\xB7a\xB7b",
                note: t119,
                bg: "#eafaf1",
                c: "#1e8449"
            };
            $[240] = t118;
            $[241] = t119;
            $[242] = t120;
        } else {
            t120 = $[242];
        }
        let t121;
        if ($[243] !== t) {
            t121 = t("Tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a", "Equilateral, side a");
            $[243] = t;
            $[244] = t121;
        } else {
            t121 = $[244];
        }
        let t122;
        if ($[245] !== t) {
            t122 = t("sinA=sin60\xB0=\u221A3/2", "sinA=\u221A3/2");
            $[245] = t;
            $[246] = t122;
        } else {
            t122 = $[246];
        }
        let t123;
        if ($[247] !== t121 || $[248] !== t122) {
            t123 = {
                shape: t121,
                formula: "S = (\u221A3/4)\xB7a\xB2",
                note: t122,
                bg: "#eaf4fb",
                c: "#1a5276"
            };
            $[247] = t121;
            $[248] = t122;
            $[249] = t123;
        } else {
            t123 = $[249];
        }
        let t124;
        if ($[250] !== t) {
            t124 = t("C\xF4ng th\u1EE9c Heron (bi\u1EBFt 3 c\u1EA1nh)", "Heron's formula (3 sides known)");
            $[250] = t;
            $[251] = t124;
        } else {
            t124 = $[251];
        }
        let t125;
        if ($[252] !== t) {
            t125 = t("s=(a+b+c)/2", "s=(a+b+c)/2");
            $[252] = t;
            $[253] = t125;
        } else {
            t125 = $[253];
        }
        let t126;
        if ($[254] !== t124 || $[255] !== t125) {
            t126 = {
                shape: t124,
                formula: "S = \u221A(s(s-a)(s-b)(s-c))",
                note: t125,
                bg: "#f5eef8",
                c: "#6c3483"
            };
            $[254] = t124;
            $[255] = t125;
            $[256] = t126;
        } else {
            t126 = $[256];
        }
        let t127;
        if ($[257] !== t120 || $[258] !== t123 || $[259] !== t126) {
            t127 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t117,
                children: [
                    t120,
                    t123,
                    t126
                ].map(_Lesson13_GiaiTamGiacAnonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1588,
                columnNumber: 14
            }, this);
            $[257] = t120;
            $[258] = t123;
            $[259] = t126;
            $[260] = t127;
        } else {
            t127 = $[260];
        }
        if ($[261] !== t108 || $[262] !== t116 || $[263] !== t127) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k2",
                style: t106,
                children: [
                    t108,
                    t116,
                    t127
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1597,
                columnNumber: 13
            }, this);
            $[261] = t108;
            $[262] = t116;
            $[263] = t127;
            $[264] = t19;
        } else {
            t19 = $[264];
        }
        let t128;
        if ($[265] === Symbol.for("react.memo_cache_sentinel")) {
            t128 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[265] = t128;
        } else {
            t128 = $[265];
        }
        let t129;
        if ($[266] !== t) {
            t129 = t("3. C\xE1c Tr\u01B0\u1EDDng H\u1EE3p Gi\u1EA3i Tam Gi\xE1c", "3. Triangle Solving Cases");
            $[266] = t;
            $[267] = t129;
        } else {
            t129 = $[267];
        }
        let t130;
        if ($[268] !== t129) {
            t130 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t129
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1625,
                columnNumber: 14
            }, this);
            $[268] = t129;
            $[269] = t130;
        } else {
            t130 = $[269];
        }
        let t131;
        if ($[270] === Symbol.for("react.memo_cache_sentinel")) {
            t131 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 16,
                transition: "all 0.3s"
            };
            $[270] = t131;
        } else {
            t131 = $[270];
        }
        let t132;
        if ($[271] !== t) {
            t132 = t("Bi\u1EBFt 2 c\u1EA1nh + g\xF3c xen gi\u1EEFa", "2 sides + included angle");
            $[271] = t;
            $[272] = t132;
        } else {
            t132 = $[272];
        }
        let t133;
        if ($[273] !== t) {
            t133 = t("1. D\xF9ng \u0110.L.C\xF4sin \u2192 c\u1EA1nh th\u1EE9 3\n2. D\xF9ng \u0110.L.Sin \u2192 g\xF3c th\u1EE9 2\n3. T\u1ED5ng 3 g\xF3c \u2192 g\xF3c th\u1EE9 3", "1. Law of Cosines \u2192 3rd side\n2. Law of Sines \u2192 2nd angle\n3. Sum=180\xB0 \u2192 3rd angle");
            $[273] = t;
            $[274] = t133;
        } else {
            t133 = $[274];
        }
        let t134;
        if ($[275] !== t132 || $[276] !== t133) {
            t134 = {
                case: "SAS",
                vi: t132,
                step: t133,
                bg: "#eaf4fb",
                c: "#1a5276"
            };
            $[275] = t132;
            $[276] = t133;
            $[277] = t134;
        } else {
            t134 = $[277];
        }
        let t135;
        if ($[278] !== t) {
            t135 = t("Bi\u1EBFt 3 c\u1EA1nh", "3 sides known");
            $[278] = t;
            $[279] = t135;
        } else {
            t135 = $[279];
        }
        let t136;
        if ($[280] !== t) {
            t136 = t("1. \u0110.L.C\xF4sin \u2192 t\xEDnh cosA\n2. \u0110.L.C\xF4sin \u2192 t\xEDnh cosB\n3. T\u1ED5ng g\xF3c \u2192 C=180\xB0\u2212A\u2212B", "1. Cosine law \u2192 cosA\n2. Cosine law \u2192 cosB\n3. C=180\xB0\u2212A\u2212B");
            $[280] = t;
            $[281] = t136;
        } else {
            t136 = $[281];
        }
        let t137;
        if ($[282] !== t135 || $[283] !== t136) {
            t137 = {
                case: "SSS",
                vi: t135,
                step: t136,
                bg: "#eafaf1",
                c: "#1e8449"
            };
            $[282] = t135;
            $[283] = t136;
            $[284] = t137;
        } else {
            t137 = $[284];
        }
        let t138;
        if ($[285] !== t) {
            t138 = t("Bi\u1EBFt 2 g\xF3c + 1 c\u1EA1nh", "2 angles + 1 side");
            $[285] = t;
            $[286] = t138;
        } else {
            t138 = $[286];
        }
        let t139;
        if ($[287] !== t) {
            t139 = t("1. T\u1ED5ng 3 g\xF3c \u2192 g\xF3c th\u1EE9 3\n2. \u0110.L.Sin \u2192 c\u1EA1nh th\u1EE9 2\n3. \u0110.L.Sin \u2192 c\u1EA1nh th\u1EE9 3", "1. Sum=180\xB0 \u2192 3rd angle\n2. Law of Sines \u2192 2nd side\n3. Law of Sines \u2192 3rd side");
            $[287] = t;
            $[288] = t139;
        } else {
            t139 = $[288];
        }
        let t140;
        if ($[289] !== t138 || $[290] !== t139) {
            t140 = {
                case: "AAS/ASA",
                vi: t138,
                step: t139,
                bg: "#fff3cd",
                c: "#856404"
            };
            $[289] = t138;
            $[290] = t139;
            $[291] = t140;
        } else {
            t140 = $[291];
        }
        let t141;
        if ($[292] !== t134 || $[293] !== t137 || $[294] !== t140) {
            t141 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t131,
                children: [
                    t134,
                    t137,
                    t140
                ].map(_Lesson13_GiaiTamGiacAnonymous4)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1738,
                columnNumber: 14
            }, this);
            $[292] = t134;
            $[293] = t137;
            $[294] = t140;
            $[295] = t141;
        } else {
            t141 = $[295];
        }
        if ($[296] !== t130 || $[297] !== t141) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k3",
                style: t128,
                children: [
                    t130,
                    t141
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1747,
                columnNumber: 13
            }, this);
            $[296] = t130;
            $[297] = t141;
            $[298] = t20;
        } else {
            t20 = $[298];
        }
        let t142;
        if ($[299] === Symbol.for("react.memo_cache_sentinel")) {
            t142 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[299] = t142;
        } else {
            t142 = $[299];
        }
        let t143;
        if ($[300] !== t) {
            t143 = t("4. \u1EE8ng D\u1EE5ng Th\u1EF1c T\u1EBF", "4. Real-World Applications");
            $[300] = t;
            $[301] = t143;
        } else {
            t143 = $[301];
        }
        let t144;
        if ($[302] !== t143) {
            t144 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83D\uDCD6",
                title: t143
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1774,
                columnNumber: 14
            }, this);
            $[302] = t143;
            $[303] = t144;
        } else {
            t144 = $[303];
        }
        let t145;
        if ($[304] === Symbol.for("react.memo_cache_sentinel")) {
            t145 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: 20,
                transition: "all 0.3s"
            };
            $[304] = t145;
        } else {
            t145 = $[304];
        }
        let t146;
        if ($[305] !== t) {
            t146 = t("\u0110o chi\u1EC1u cao n\xFAi", "Mountain height");
            $[305] = t;
            $[306] = t146;
        } else {
            t146 = $[306];
        }
        let t147;
        if ($[307] !== t) {
            t147 = t("\u0110\u1EE9ng t\u1EA1i 2 \u0111i\u1EC3m A, B c\xE1ch nhau d \u0111o g\xF3c ng\u1EA9ng \u03B1, \u03B2 \u2192 h=d\xB7sin\u03B1\xB7sin\u03B2/sin(\u03B2\u2212\u03B1)", "From 2 points A,B distance d apart, measure elevation angles \u03B1,\u03B2 \u2192 h=d\xB7sin\u03B1\xB7sin\u03B2/sin(\u03B2\u2212\u03B1)");
            $[307] = t;
            $[308] = t147;
        } else {
            t147 = $[308];
        }
        let t148;
        if ($[309] !== t146 || $[310] !== t147) {
            t148 = {
                icon: "\u26F0\uFE0F",
                title: t146,
                desc: t147
            };
            $[309] = t146;
            $[310] = t147;
            $[311] = t148;
        } else {
            t148 = $[311];
        }
        let t149;
        if ($[312] !== t) {
            t149 = t("\u0110o chi\u1EC1u r\u1ED9ng s\xF4ng", "River width");
            $[312] = t;
            $[313] = t149;
        } else {
            t149 = $[313];
        }
        let t150;
        if ($[314] !== t) {
            t150 = t("Ch\u1ECDn \u0111i\u1EC3m C b\xEAn kia s\xF4ng, \u0111o \u0111\u01B0\u1EDDng c\u01A1 s\u1EDF AB v\xE0 g\xF3c CAB, CBA \u2192 d\xF9ng \u0110\u1ECBnh l\xED Sin t\xEDnh AC ho\u1EB7c BC", "Choose point C across river, measure baseline AB and angles CAB, CBA \u2192 use Sines to find AC or BC");
            $[314] = t;
            $[315] = t150;
        } else {
            t150 = $[315];
        }
        let t151;
        if ($[316] !== t149 || $[317] !== t150) {
            t151 = {
                icon: "\uD83C\uDF0A",
                title: t149,
                desc: t150
            };
            $[316] = t149;
            $[317] = t150;
            $[318] = t151;
        } else {
            t151 = $[318];
        }
        let t152;
        if ($[319] !== t) {
            t152 = t("\u0110\u1ECBnh v\u1ECB (GPS/H\xE0ng kh\xF4ng)", "Navigation (GPS/Aviation)");
            $[319] = t;
            $[320] = t152;
        } else {
            t152 = $[320];
        }
        let t153;
        if ($[321] !== t) {
            t153 = t("T\u1EEB 3 tr\u1EA1m bi\u1EBFt t\u1ECDa \u0111\u1ED9, \u0111o g\xF3c t\u1EDBi m\u1EE5c ti\xEAu \u2192 gi\u1EA3i h\u1EC7 tam gi\xE1c \u2192 x\xE1c \u0111\u1ECBnh v\u1ECB tr\xED ch\xEDnh x\xE1c", "From 3 known stations, measure angles to target \u2192 solve triangle system \u2192 find exact position");
            $[321] = t;
            $[322] = t153;
        } else {
            t153 = $[322];
        }
        let t154;
        if ($[323] !== t152 || $[324] !== t153) {
            t154 = {
                icon: "\uD83D\uDEF8",
                title: t152,
                desc: t153
            };
            $[323] = t152;
            $[324] = t153;
            $[325] = t154;
        } else {
            t154 = $[325];
        }
        let t155;
        if ($[326] !== t) {
            t155 = t("X\xE2y d\u1EF1ng & Ki\u1EBFn tr\xFAc", "Construction & Architecture");
            $[326] = t;
            $[327] = t155;
        } else {
            t155 = $[327];
        }
        let t156;
        if ($[328] !== t) {
            t156 = t("T\xEDnh g\xF3c m\xE1i nh\xE0, \u0111\u1ED9 d\xE0i k\xE8o, chi\u1EC1u cao c\u1ED9t t\u1EEB c\xE1c s\u1ED1 li\u1EC7u \u0111o \u0111\u1EA1c th\u1EF1c \u0111\u1ECBa", "Compute roof angles, rafter lengths, column heights from field measurements");
            $[328] = t;
            $[329] = t156;
        } else {
            t156 = $[329];
        }
        let t157;
        if ($[330] !== t155 || $[331] !== t156) {
            t157 = {
                icon: "\uD83C\uDFD7\uFE0F",
                title: t155,
                desc: t156
            };
            $[330] = t155;
            $[331] = t156;
            $[332] = t157;
        } else {
            t157 = $[332];
        }
        let t158;
        if ($[333] !== t148 || $[334] !== t151 || $[335] !== t154 || $[336] !== t157) {
            t158 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "90",
                style: t145,
                children: [
                    t148,
                    t151,
                    t154,
                    t157
                ].map(_Lesson13_GiaiTamGiacAnonymous5)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1910,
                columnNumber: 14
            }, this);
            $[333] = t148;
            $[334] = t151;
            $[335] = t154;
            $[336] = t157;
            $[337] = t158;
        } else {
            t158 = $[337];
        }
        if ($[338] !== t144 || $[339] !== t158) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "k4",
                style: t142,
                children: [
                    t144,
                    t158
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1920,
                columnNumber: 13
            }, this);
            $[338] = t144;
            $[339] = t158;
            $[340] = t21;
        } else {
            t21 = $[340];
        }
        let t159;
        if ($[341] === Symbol.for("react.memo_cache_sentinel")) {
            t159 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[341] = t159;
        } else {
            t159 = $[341];
        }
        let t160;
        if ($[342] !== t) {
            t160 = t("Th\u1EF1c H\xE0nh", "Practice");
            $[342] = t;
            $[343] = t160;
        } else {
            t160 = $[343];
        }
        let t161;
        if ($[344] !== t160) {
            t161 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\u270F\uFE0F",
                title: t160
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1947,
                columnNumber: 14
            }, this);
            $[344] = t160;
            $[345] = t161;
        } else {
            t161 = $[345];
        }
        let t162;
        if ($[346] === Symbol.for("react.memo_cache_sentinel")) {
            t162 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: 40,
                transition: "all 0.3s"
            };
            $[346] = t162;
        } else {
            t162 = $[346];
        }
        let t163;
        if ($[347] !== rev || $[348] !== t) {
            t163 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "90",
                style: t162,
                children: [
                    {
                        id: "e1",
                        q: t("Tam gi\xE1c ABC: A=45\xB0, b=6, c=4. T\xEDnh di\u1EC7n t\xEDch S v\xE0 c\u1EA1nh a.", "Triangle ABC: A=45\xB0, b=6, c=4. Find area S and side a."),
                        a: [
                            t("S=(1/2)\xB7b\xB7c\xB7sinA=(1/2)\xB76\xB74\xB7sin45\xB0=12\xB7(\u221A2/2)=6\u221A2\u22488.49", "S=6\u221A2\u22488.49"),
                            t("a\xB2=b\xB2+c\xB2\u22122bc\xB7cosA=36+16\u221248\xB7(\u221A2/2)=52\u221224\u221A2\u224852\u221233.9\u224818.1", "a\xB2\u224818.1 \u2192 a\u22484.25")
                        ]
                    },
                    {
                        id: "e2",
                        q: t("T\u1EEB \u0111i\u1EC3m A tr\xEAn b\u1EDD s\xF4ng, nh\xECn \u0111i\u1EC3m C b\xEAn kia s\xF4ng theo g\xF3c 60\xB0 so v\u1EDBi b\u1EDD. T\u1EEB \u0111i\u1EC3m B c\xE1ch A 100m c\xF9ng ph\xEDa, g\xF3c nh\xECn C l\xE0 45\xB0. T\xEDnh BC.", "From point A on a riverbank, point C across is seen at 60\xB0 from the bank. From B, 100m from A, the angle to C is 45\xB0. Find BC."),
                        a: [
                            t("G\xF3c ACB=180\xB0\u221260\xB0\u221245\xB0=75\xB0", "Angle ACB=75\xB0"),
                            t("BC/sinA = AB/sinACB \u2192 BC=100\xB7sin60\xB0/sin75\xB0=100\xB7(\u221A3/2)/sin75\xB0\u224889.7m", "BC=100\xB7sin60\xB0/sin75\xB0\u224889.7m")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("Tam gi\xE1c ABC: a=5, b=7, c=8. T\xEDnh di\u1EC7n t\xEDch S b\u1EB1ng c\xF4ng th\u1EE9c Heron.", "Triangle: a=5, b=7, c=8. Find area using Heron's formula."),
                        a: [
                            "s=(5+7+8)/2=10",
                            t("S=\u221A(10\xB75\xB73\xB72)=\u221A300=10\u221A3\u224817.32", "S=\u221A300=10\u221A3\u224817.32")
                        ]
                    }
                ].map({
                    "Lesson13_GiaiTamGiac[(anonymous)()]": (t164)=>{
                        const { id: id_3, q: q_3, a: a_1 } = t164;
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                            lineNumber: 1991,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 15,
                                                lineHeight: 1.7
                                            },
                                            children: q_3
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                            lineNumber: 1995,
                                            columnNumber: 63
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 1986,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson13_GiaiTamGiac[(anonymous)() > <button>.onClick]": ()=>tr(id_3)
                                    }["Lesson13_GiaiTamGiac[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 1998,
                                    columnNumber: 37
                                }, this),
                                rev[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_1.map(_Lesson13_GiaiTamGiacAnonymousA_1Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 2011,
                                    columnNumber: 158
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                            lineNumber: 1986,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson13_GiaiTamGiac[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 1967,
                columnNumber: 14
            }, this);
            $[347] = rev;
            $[348] = t;
            $[349] = t163;
        } else {
            t163 = $[349];
        }
        if ($[350] !== t161 || $[351] !== t163) {
            t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "th",
                style: t159,
                children: [
                    t161,
                    t163
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2025,
                columnNumber: 13
            }, this);
            $[350] = t161;
            $[351] = t163;
            $[352] = t22;
        } else {
            t22 = $[352];
        }
        t7 = "mg";
        if ($[353] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                icon: "\uD83C\uDFAE",
                title: "Mini Game"
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2038,
                columnNumber: 12
            }, this);
            $[353] = t8;
            $[354] = t9;
        } else {
            t8 = $[353];
            t9 = $[354];
        }
        let t164;
        if ($[355] === Symbol.for("react.memo_cache_sentinel")) {
            t164 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s"
            };
            $[355] = t164;
        } else {
            t164 = $[355];
        }
        let t165;
        if ($[356] !== t) {
            t165 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[356] = t;
            $[357] = t165;
        } else {
            t165 = $[357];
        }
        let t166;
        if ($[358] !== t) {
            t166 = t("5 c\xE2u", "5 questions");
            $[358] = t;
            $[359] = t166;
        } else {
            t166 = $[359];
        }
        let t167;
        if ($[360] !== t165 || $[361] !== t166) {
            t167 = [
                "mc",
                "\uD83E\uDDE9",
                t165,
                t166
            ];
            $[360] = t165;
            $[361] = t166;
            $[362] = t167;
        } else {
            t167 = $[362];
        }
        let t168;
        if ($[363] !== t) {
            t168 = t("\u0110\xFAng / Sai", "True / False");
            $[363] = t;
            $[364] = t168;
        } else {
            t168 = $[364];
        }
        let t169;
        if ($[365] !== t) {
            t169 = t("5 th\u1EBB", "5 cards");
            $[365] = t;
            $[366] = t169;
        } else {
            t169 = $[366];
        }
        let t170;
        if ($[367] !== t168 || $[368] !== t169) {
            t170 = [
                "tf",
                "\uD83C\uDCCF",
                t168,
                t169
            ];
            $[367] = t168;
            $[368] = t169;
            $[369] = t170;
        } else {
            t170 = $[369];
        }
        let t171;
        if ($[370] !== t) {
            t171 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[370] = t;
            $[371] = t171;
        } else {
            t171 = $[371];
        }
        let t172;
        if ($[372] !== t) {
            t172 = t("3 c\xE2u", "3 items");
            $[372] = t;
            $[373] = t172;
        } else {
            t172 = $[373];
        }
        let t173;
        if ($[374] !== t171 || $[375] !== t172) {
            t173 = [
                "fill",
                "\u270D\uFE0F",
                t171,
                t172
            ];
            $[374] = t171;
            $[375] = t172;
            $[376] = t173;
        } else {
            t173 = $[376];
        }
        let t174;
        if ($[377] !== t167 || $[378] !== t170 || $[379] !== t173) {
            t174 = [
                t167,
                t170,
                t173
            ];
            $[377] = t167;
            $[378] = t170;
            $[379] = t173;
            $[380] = t174;
        } else {
            t174 = $[380];
        }
        if ($[381] !== gm || $[382] !== t174) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t164,
                children: t174.map({
                    "Lesson13_GiaiTamGiac[(anonymous)()]": (t175)=>{
                        const [mode, icon_0, label_0, sub] = t175;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson13_GiaiTamGiac[(anonymous)() > <article>.onClick]": ()=>setGm(mode)
                            }["Lesson13_GiaiTamGiac[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 2156,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 2159,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 2162,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                            lineNumber: 2147,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson13_GiaiTamGiac[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2144,
                columnNumber: 13
            }, this);
            $[381] = gm;
            $[382] = t174;
            $[383] = t10;
        } else {
            t10 = $[383];
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2179,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2183,
                        columnNumber: 99
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQ[mi].o.map({
                            "Lesson13_GiaiTamGiac[(anonymous)()]": (opt, i_10)=>{
                                let bg = "white";
                                let co = "black";
                                if (ms !== null) {
                                    if (i_10 === mcQ[mi].a) {
                                        bg = "#eafaf1";
                                        co = "#1e8449";
                                    } else {
                                        if (i_10 === ms) {
                                            bg = "#fdf2f2";
                                            co = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson13_GiaiTamGiac[(anonymous)() > <button>.onClick]": ()=>sel(i_10)
                                    }["Lesson13_GiaiTamGiac[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color: co,
                                        fontSize: 15,
                                        fontWeight: ms !== null && (i_10 === ms || i_10 === mcQ[mi].a) ? 600 : 400,
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                    lineNumber: 2206,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson13_GiaiTamGiac[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2187,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 2222,
                                columnNumber: 77
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 2230,
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2240,
                columnNumber: 144
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2174,
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
    if ($[384] !== gm || $[385] !== rt || $[386] !== t || $[387] !== ta || $[388] !== td || $[389] !== tf || $[390] !== tfC || $[391] !== ti || $[392] !== tn || $[393] !== tri || $[394] !== ts) {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2314,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 2325,
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
                                            "Lesson13_GiaiTamGiac[<button>.onClick]": ()=>ta(true)
                                        }["Lesson13_GiaiTamGiac[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2333,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson13_GiaiTamGiac[<button>.onClick]": ()=>ta(false)
                                        }["Lesson13_GiaiTamGiac[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2344,
                                        columnNumber: 54
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 2329,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2355,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2364,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2318,
                        columnNumber: 103
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: tri,
                onReset: rt,
                scoreLabel: ts === tfC.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2373,
                columnNumber: 158
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2309,
            columnNumber: 26
        }, this);
        $[384] = gm;
        $[385] = rt;
        $[386] = t;
        $[387] = ta;
        $[388] = td;
        $[389] = tf;
        $[390] = tfC;
        $[391] = ti;
        $[392] = tn;
        $[393] = tri;
        $[394] = ts;
        $[395] = t24;
    } else {
        t24 = $[395];
    }
    let t25;
    if ($[396] !== fQ || $[397] !== fa || $[398] !== fc || $[399] !== fri || $[400] !== fs || $[401] !== gm || $[402] !== t) {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2396,
                        columnNumber: 17
                    }, this),
                    fQ.map({
                        "Lesson13_GiaiTamGiac[fQ.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2403,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2407,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: fa[q_4.id] || "",
                                        onChange: {
                                            "Lesson13_GiaiTamGiac[fQ.map() > <input>.onChange]": (e_1)=>setFa({
                                                    "Lesson13_GiaiTamGiac[fQ.map() > <input>.onChange > setFa()]": (p_0)=>({
                                                            ...p_0,
                                                            [q_4.id]: e_1.target.value
                                                        })
                                                }["Lesson13_GiaiTamGiac[fQ.map() > <input>.onChange > setFa()]"])
                                        }["Lesson13_GiaiTamGiac[fQ.map() > <input>.onChange]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                        lineNumber: 2411,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, q_4.id, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                                lineNumber: 2401,
                                columnNumber: 58
                            }, this)
                    }["Lesson13_GiaiTamGiac[fQ.map()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "Lesson13_GiaiTamGiac[<button>.onClick]": ()=>setFc(true)
                        }["Lesson13_GiaiTamGiac[<button>.onClick]"],
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2429,
                        columnNumber: 46
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RS, {
                items: fri,
                onReset: {
                    "Lesson13_GiaiTamGiac[<RS>.onReset]": ()=>{
                        setFa({});
                        setFc(false);
                    }
                }["Lesson13_GiaiTamGiac[<RS>.onReset]"],
                scoreLabel: fs === fQ.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fs >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA"),
                t: t
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2440,
                columnNumber: 64
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2391,
            columnNumber: 28
        }, this);
        $[396] = fQ;
        $[397] = fa;
        $[398] = fc;
        $[399] = fri;
        $[400] = fs;
        $[401] = gm;
        $[402] = t;
        $[403] = t25;
    } else {
        t25 = $[403];
    }
    let t26;
    if ($[404] !== t10 || $[405] !== t11 || $[406] !== t24 || $[407] !== t25 || $[408] !== t7 || $[409] !== t8 || $[410] !== t9) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2459,
            columnNumber: 11
        }, this);
        $[404] = t10;
        $[405] = t11;
        $[406] = t24;
        $[407] = t25;
        $[408] = t7;
        $[409] = t8;
        $[410] = t9;
        $[411] = t26;
    } else {
        t26 = $[411];
    }
    let t27;
    if ($[412] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2473,
            columnNumber: 11
        }, this);
        $[412] = t27;
    } else {
        t27 = $[412];
    }
    let t28;
    if ($[413] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[413] = t28;
    } else {
        t28 = $[413];
    }
    let t29;
    if ($[414] !== t) {
        t29 = t("B\xE0i 13 / Ch\u01B0\u01A1ng IV", "Lesson 13 / Chapter IV");
        $[414] = t;
        $[415] = t29;
    } else {
        t29 = $[415];
    }
    let t30;
    if ($[416] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t28,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2502,
            columnNumber: 11
        }, this);
        $[416] = t29;
        $[417] = t30;
    } else {
        t30 = $[417];
    }
    let t31;
    let t32;
    if ($[418] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: ".reveal{opacity:0;transform:translateY(28px) scale(0.97);transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1);will-change:opacity,transform;}.reveal.visible{opacity:1;transform:translateY(0) scale(1);}.reveal[data-reveal-stagger].visible{opacity:1;transform:none;}.reveal[data-reveal-stagger]>*{opacity:0;transform:translateY(24px) scale(0.97);will-change:opacity,transform;}header.reveal{transform:translateY(-18px);opacity:0;}header.reveal.visible{opacity:1;transform:translateY(0);}article{transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease;border-radius:10px;padding:8px;}article:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 12px 28px rgba(0,0,0,0.12);}"
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2511,
            columnNumber: 11
        }, this);
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2512,
            columnNumber: 11
        }, this);
        $[418] = t31;
        $[419] = t32;
    } else {
        t31 = $[418];
        t32 = $[419];
    }
    let t33;
    if ($[420] !== t12 || $[421] !== t13 || $[422] !== t14 || $[423] !== t15 || $[424] !== t16 || $[425] !== t17 || $[426] !== t18 || $[427] !== t19 || $[428] !== t20 || $[429] !== t21 || $[430] !== t22 || $[431] !== t26 || $[432] !== t30) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2521,
            columnNumber: 11
        }, this);
        $[420] = t12;
        $[421] = t13;
        $[422] = t14;
        $[423] = t15;
        $[424] = t16;
        $[425] = t17;
        $[426] = t18;
        $[427] = t19;
        $[428] = t20;
        $[429] = t21;
        $[430] = t22;
        $[431] = t26;
        $[432] = t30;
        $[433] = t33;
    } else {
        t33 = $[433];
    }
    let t34;
    if ($[434] !== t23 || $[435] !== t33) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t23,
            children: t33
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
            lineNumber: 2541,
            columnNumber: 11
        }, this);
        $[434] = t23;
        $[435] = t33;
        $[436] = t34;
    } else {
        t34 = $[436];
    }
    return t34;
}
_s(Lesson13_GiaiTamGiac, "3e5ld66n3Vcdr6IFVQyUkgXiBp8=");
_c2 = Lesson13_GiaiTamGiac;
function _Lesson13_GiaiTamGiacAnonymousA_1Map(l, i_9) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: l
    }, i_9, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
        lineNumber: 2551,
        columnNumber: 10
    }, this);
}
function _Lesson13_GiaiTamGiacAnonymous5(card_2, i_8) {
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
                    fontSize: 28,
                    marginBottom: 8
                },
                children: card_2.icon
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2563,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 6
                },
                children: card_2.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2566,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#777",
                    lineHeight: 1.6
                },
                children: card_2.desc
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2571,
                columnNumber: 28
            }, this)
        ]
    }, i_8, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
        lineNumber: 2558,
        columnNumber: 10
    }, this);
}
function _Lesson13_GiaiTamGiacAnonymous4(card_1, i_7) {
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
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            background: card_1.c,
                            color: "white",
                            fontWeight: 700,
                            padding: "3px 12px",
                            borderRadius: 20,
                            fontSize: 14
                        },
                        children: card_1.case
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2588,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            color: card_1.c,
                            fontWeight: 600
                        },
                        children: card_1.vi
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                        lineNumber: 2595,
                        columnNumber: 30
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2583,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: card_1.bg,
                    color: card_1.c,
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8
                },
                children: card_1.step
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2599,
                columnNumber: 34
            }, this)
        ]
    }, i_7, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
        lineNumber: 2578,
        columnNumber: 10
    }, this);
}
function _Lesson13_GiaiTamGiacAnonymous3(card_0, i_6) {
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
                children: card_0.shape
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2616,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: "monospace",
                    fontSize: 15,
                    fontWeight: 700,
                    color: card_0.c,
                    marginBottom: 4
                },
                children: card_0.formula
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2620,
                columnNumber: 28
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: card_0.bg,
                    color: card_0.c,
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    display: "inline-block"
                },
                children: card_0.note
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2626,
                columnNumber: 30
            }, this)
        ]
    }, i_6, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
        lineNumber: 2611,
        columnNumber: 10
    }, this);
}
function _Lesson13_GiaiTamGiacAnonymous2(card, i_5) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        style: {
            padding: 18,
            borderRadius: 10,
            background: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 28,
                    marginBottom: 8
                },
                children: card.icon
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2642,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 6
                },
                children: card.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2645,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 13,
                    color: "#777",
                    lineHeight: 1.6
                },
                children: card.note
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
                lineNumber: 2650,
                columnNumber: 26
            }, this)
        ]
    }, i_5, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
        lineNumber: 2636,
        columnNumber: 10
    }, this);
}
function _Lesson13_GiaiTamGiacTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson13_GiaiTamGiacTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson13_GiaiTamGiacAnonymous(o, i_4) {
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
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson12_GiaiTamGiac.js",
        lineNumber: 2665,
        columnNumber: 10
    }, this);
}
function _Lesson13_GiaiTamGiacTnSetTi(i_3) {
    return i_3 + 1;
}
function _Lesson13_GiaiTamGiacTaSetTs(s_2) {
    return s_2 + 1;
}
function _Lesson13_GiaiTamGiacNxSetMi(i_2) {
    return i_2 + 1;
}
function _Lesson13_GiaiTamGiacSelSetMsc(s_1) {
    return s_1 + 1;
}
function _Lesson13_GiaiTamGiacCfAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson13_GiaiTamGiacSc(id) {
    const el_2 = document.getElementById(id);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson13_GiaiTamGiacUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson13_GiaiTamGiacUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp4, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson13_GiaiTamGiac[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson13_GiaiTamGiac[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp4(entries, observer) {
    entries.forEach({
        "Lesson13_GiaiTamGiac[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const s_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson13_GiaiTamGiac[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (c_0, i_0)=>setTimeout({
                                "Lesson13_GiaiTamGiac[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    c_0.style.opacity = "1";
                                    c_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson13_GiaiTamGiac[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * s_0)
                    }["Lesson13_GiaiTamGiac[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson13_GiaiTamGiac[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson13_GiaiTamGiacUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const s = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson13_GiaiTamGiac[useEffect() > els.forEach() > (anonymous)()]": (c, i)=>{
                c.style.opacity = "0";
                c.style.transform = "translateY(24px) scale(0.97)";
                c.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * s}ms,transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * s}ms`;
                c.style.willChange = "opacity,transform";
            }
        }["Lesson13_GiaiTamGiac[useEffect() > els.forEach() > (anonymous)()]"]);
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
__turbopack_context__.k.register(_c2, "Lesson13_GiaiTamGiac");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_bde84982._.js.map