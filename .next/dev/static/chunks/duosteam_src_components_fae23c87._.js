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
"[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lesson5_HeBPTBacNhatHaiAn
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
    if ($[0] !== "7ed890dbb162601c40aa14f67b330191aa5434bd88741139c2777dea7356e7f6") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7ed890dbb162601c40aa14f67b330191aa5434bd88741139c2777dea7356e7f6";
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
function Lesson5_HeBPTBacNhatHaiAn() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(438);
    if ($[0] !== "7ed890dbb162601c40aa14f67b330191aa5434bd88741139c2777dea7356e7f6") {
        for(let $i = 0; $i < 438; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7ed890dbb162601c40aa14f67b330191aa5434bd88741139c2777dea7356e7f6";
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_Lesson5_HeBPTBacNhatHaiAnUseEffect, t4);
    let t5;
    if ($[6] !== lang) {
        t5 = ({
            "Lesson5_HeBPTBacNhatHaiAn[t]": (vi, en)=>lang === "vi" ? vi : en
        })["Lesson5_HeBPTBacNhatHaiAn[t]"];
        $[6] = lang;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const t = t5;
    let t6;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "Lesson5_HeBPTBacNhatHaiAn[toggleAnswer]": (id)=>setRevealedAnswers({
                    "Lesson5_HeBPTBacNhatHaiAn[toggleAnswer > setRevealedAnswers()]": (p)=>({
                            ...p,
                            [id]: !p[id]
                        })
                }["Lesson5_HeBPTBacNhatHaiAn[toggleAnswer > setRevealedAnswers()]"])
        })["Lesson5_HeBPTBacNhatHaiAn[toggleAnswer]"];
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    const toggleAnswer = t6;
    const scrollTo = _Lesson5_HeBPTBacNhatHaiAnScrollTo;
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
                q: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT b\u1EADc nh\u1EA5t hai \u1EA9n l\xE0?", "The solution region of a system of linear inequalities in 2 variables is?"),
                options: [
                    t("H\u1EE3p c\u1EE7a c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng", "Union of half-planes"),
                    t("Giao c\u1EE7a c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng", "Intersection of half-planes"),
                    t("M\u1ED9t \u0111\u01B0\u1EDDng th\u1EB3ng", "A line"),
                    t("To\xE0n b\u1ED9 m\u1EB7t ph\u1EB3ng", "The entire plane")
                ],
                answer: 1,
                explain: t("Nghi\u1EC7m c\u1EE7a h\u1EC7 ph\u1EA3i th\u1ECFa M\u1ECCI BPT trong h\u1EC7 \u2192 giao c\u1EE7a c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng.", "A solution must satisfy ALL inequalities \u2192 intersection of half-planes.")
            },
            {
                q: t("\u0110i\u1EC3m M(1, 2) c\xF3 l\xE0 nghi\u1EC7m c\u1EE7a h\u1EC7 {x + y \u2264 4; x \u2212 y \u2265 \u22122} kh\xF4ng?", "Is M(1,2) a solution of {x+y \u2264 4; x\u2212y \u2265 \u22122}?"),
                options: [
                    t("C\xF3", "Yes"),
                    t("Kh\xF4ng", "No"),
                    t("Kh\xF4ng x\xE1c \u0111\u1ECBnh", "Cannot determine"),
                    t("Ph\u1EE5 thu\u1ED9c v\xE0o a, b", "Depends on a, b")
                ],
                answer: 0,
                explain: t("BPT 1: 1+2=3\u22644 \u2713. BPT 2: 1\u22122=\u22121\u2265\u22122 \u2713. C\u1EA3 hai th\u1ECFa \u2192 M l\xE0 nghi\u1EC7m.", "BPT 1: 3\u22644 \u2713. BPT 2: \u22121\u2265\u22122 \u2713. Both satisfied \u2192 M is a solution.")
            },
            {
                q: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 c\xF3 th\u1EC3 l\xE0?", "The solution region of a system can be?"),
                options: [
                    t("T\u1EADp r\u1ED7ng", "Empty set"),
                    t("\u0110a gi\xE1c l\u1ED3i", "Convex polygon"),
                    t("N\u1EEDa m\u1EB7t ph\u1EB3ng", "Half-plane"),
                    t("T\u1EA5t c\u1EA3 c\xE1c tr\u01B0\u1EDDng h\u1EE3p tr\xEAn", "All of the above")
                ],
                answer: 3,
                explain: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT c\xF3 th\u1EC3 l\xE0 r\u1ED7ng, \u0111a gi\xE1c l\u1ED3i (h\u1EEFu h\u1EA1n) ho\u1EB7c n\u1EEDa m\u1EB7t ph\u1EB3ng (v\xF4 h\u1EA1n).", "The solution region can be empty, a bounded convex polygon, or an unbounded half-plane.")
            },
            {
                q: t("H\u1EC7 BPT: {x \u2265 0; y \u2265 0; x + y \u2264 5}. \u0110i\u1EC3m g\xF3c c\u1EE7a mi\u1EC1n nghi\u1EC7m l\xE0?", "System: {x\u22650; y\u22650; x+y\u22645}. Vertices of the solution region?"),
                options: [
                    "(0,0), (5,0), (0,5)",
                    "(0,0), (1,0), (0,1)",
                    "(5,5), (0,0), (5,0)",
                    "(5,0), (0,5), (5,5)"
                ],
                answer: 0,
                explain: t("Giao c\xE1c \u0111\u01B0\u1EDDng bi\xEAn: O(0,0), A(5,0), B(0,5) l\xE0 3 \u0111\u1EC9nh c\u1EE7a tam gi\xE1c nghi\u1EC7m.", "Intersections of boundaries: O(0,0), A(5,0), B(0,5) are the 3 vertices.")
            },
            {
                q: t("\u0110\u1EC3 t\xECm mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT, ta d\xF9ng ph\u01B0\u01A1ng ph\xE1p n\xE0o?", "To find the solution region of a system of linear inequalities, we?"),
                options: [
                    t("L\u1EA5y h\u1EE3p c\xE1c mi\u1EC1n nghi\u1EC7m t\u1EEBng BPT", "Take the union of individual solution regions"),
                    t("L\u1EA5y giao c\xE1c mi\u1EC1n nghi\u1EC7m t\u1EEBng BPT (ph\u1EA7n chung)", "Take the intersection (common part) of individual solution regions"),
                    t("Gi\u1EA3i t\u1EEBng BPT \u0111\u1ED9c l\u1EADp", "Solve each inequality independently"),
                    t("Ch\u1EC9 c\u1EA7n x\xE9t BPT \u0111\u1EA7u ti\xEAn", "Only consider the first inequality")
                ],
                answer: 1,
                explain: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 = ph\u1EA7n giao chung c\u1EE7a t\u1EA5t c\u1EA3 c\xE1c mi\u1EC1n nghi\u1EC7m \u0111\u01A1n l\u1EBB.", "System solution = common intersection of all individual solution regions.")
            }
        ];
        tfCards = [
            {
                stmt: t("M\u1ECDi \u0111i\u1EC3m trong mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT \u0111\u1EC1u th\u1ECFa m\xE3n T\u1EA4T C\u1EA2 c\xE1c BPT trong h\u1EC7.", "Every point in the solution region of the system satisfies ALL inequalities in the system."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 \u0111\xF3 ch\xEDnh l\xE0 \u0111\u1ECBnh ngh\u0129a c\u1EE7a nghi\u1EC7m c\u1EE7a h\u1EC7 BPT.", "TRUE \u2014 that is the definition of a solution to a system of inequalities.")
            },
            {
                stmt: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT lu\xF4n l\xE0 m\u1ED9t \u0111a gi\xE1c.", "The solution region of a system of inequalities is always a polygon."),
                answer: false,
                explain: t("SAI \u2014 mi\u1EC1n nghi\u1EC7m c\xF3 th\u1EC3 l\xE0 v\xF4 h\u1EA1n (n\u1EEDa m\u1EB7t ph\u1EB3ng, g\xF3c ph\u1EA7n t\u01B0) ho\u1EB7c th\u1EADm ch\xED l\xE0 t\u1EADp r\u1ED7ng.", "FALSE \u2014 the region can be unbounded (half-plane, quadrant) or even empty.")
            },
            {
                stmt: t("N\u1EBFu O(0,0) th\u1ECFa t\u1EA5t c\u1EA3 c\xE1c BPT trong h\u1EC7, th\xEC O thu\u1ED9c mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7.", "If O(0,0) satisfies all inequalities in the system, then O is in the solution region."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 O l\xE0 nghi\u1EC7m c\u1EE7a h\u1EC7 khi v\xE0 ch\u1EC9 khi O th\u1ECFa t\u1EA5t c\u1EA3 BPT trong h\u1EC7.", "TRUE \u2014 O is a solution iff it satisfies every inequality in the system.")
            },
            {
                stmt: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 l\xE0 giao c\u1EE7a c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng t\u01B0\u01A1ng \u1EE9ng.", "The solution region is the intersection of the corresponding half-planes."),
                answer: true,
                explain: t("\u0110\xDANG \u2014 m\u1ED7i BPT cho m\u1ED9t n\u1EEDa m\u1EB7t ph\u1EB3ng, h\u1EC7 cho giao c\u1EE7a ch\xFAng.", "TRUE \u2014 each inequality gives a half-plane; the system gives their intersection.")
            },
            {
                stmt: t("H\u1EC7 c\xF3 3 BPT th\xEC mi\u1EC1n nghi\u1EC7m l\xE0 tam gi\xE1c.", "A system with 3 inequalities always has a triangular solution region."),
                answer: false,
                explain: t("SAI \u2014 c\xF3 th\u1EC3 l\xE0 v\xF4 h\u1EA1n, ho\u1EB7c t\u1EADp r\u1ED7ng t\xF9y thu\u1ED9c v\xE0o c\xE1c \u0111\u01B0\u1EDDng bi\xEAn.", "FALSE \u2014 it can be unbounded or empty depending on the boundaries.")
            }
        ];
        fillQuestions = [
            {
                id: "f1",
                template: t("Nghi\u1EC7m c\u1EE7a h\u1EC7 BPT ph\u1EA3i th\u1ECFa ___ BPT trong h\u1EC7.", "A solution of the system must satisfy ___ inequalities in the system."),
                answer: "t\u1EA5t c\u1EA3",
                altAnswers: [
                    "all",
                    "tat ca",
                    "m\u1ECDi",
                    "moi"
                ],
                hint: t("Ph\u1EA3i th\u1ECFa \u0111\u1ED3ng th\u1EDDi t\u1EA5t c\u1EA3.", "Must satisfy all simultaneously.")
            },
            {
                id: "f2",
                template: t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 = ___ c\xE1c mi\u1EC1n nghi\u1EC7m t\u1EEBng BPT.", "Solution region of system = ___ of individual solution regions."),
                answer: "giao",
                altAnswers: [
                    "intersection",
                    "giao nhau",
                    "ph\u1EA7n giao"
                ],
                hint: t("Ph\u1EA7n chung gi\u1EEFa c\xE1c mi\u1EC1n.", "The common part of the regions.")
            },
            {
                id: "f3",
                template: t("\u0110\u1EC3 t\xECm mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 tr\xEAn \u0111\u1ED3 th\u1ECB, ta t\xF4 ___ ph\u1EA7n chung c\u1EE7a c\xE1c mi\u1EC1n.", "To find the solution region graphically, we shade the ___ common part."),
                answer: "chung",
                altAnswers: [
                    "common",
                    "ph\u1EA7n chung",
                    "giao"
                ],
                hint: t("V\xF9ng thu\u1ED9c t\u1EA5t c\u1EA3 c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng.", "The region belonging to all half-planes.")
            }
        ];
        const handleMcSelect = {
            "Lesson5_HeBPTBacNhatHaiAn[handleMcSelect]": (i_1)=>{
                if (mcSelected !== null) {
                    return;
                }
                setMcSelected(i_1);
                const correct = i_1 === mcQuestions[mcIndex].answer;
                if (correct) {
                    setMcScore(_Lesson5_HeBPTBacNhatHaiAnHandleMcSelectSetMcScore);
                }
                setMcHistory({
                    "Lesson5_HeBPTBacNhatHaiAn[handleMcSelect > setMcHistory()]": (h)=>[
                            ...h,
                            {
                                q: mcIndex,
                                selected: i_1,
                                correct
                            }
                        ]
                }["Lesson5_HeBPTBacNhatHaiAn[handleMcSelect > setMcHistory()]"]);
            }
        }["Lesson5_HeBPTBacNhatHaiAn[handleMcSelect]"];
        const handleMcNext = {
            "Lesson5_HeBPTBacNhatHaiAn[handleMcNext]": ()=>{
                if (mcIndex + 1 >= mcQuestions.length) {
                    setMcDone(true);
                } else {
                    setMcIndex(_Lesson5_HeBPTBacNhatHaiAnHandleMcNextSetMcIndex);
                    setMcSelected(null);
                }
            }
        }["Lesson5_HeBPTBacNhatHaiAn[handleMcNext]"];
        let t23;
        if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
            t23 = ({
                "Lesson5_HeBPTBacNhatHaiAn[resetMc]": ()=>{
                    setMcIndex(0);
                    setMcSelected(null);
                    setMcScore(0);
                    setMcDone(false);
                    setMcHistory([]);
                }
            })["Lesson5_HeBPTBacNhatHaiAn[resetMc]"];
            $[48] = t23;
        } else {
            t23 = $[48];
        }
        const resetMc = t23;
        handleTfAnswer = ({
            "Lesson5_HeBPTBacNhatHaiAn[handleTfAnswer]": (ans)=>{
                if (tfFlipped) {
                    return;
                }
                setTfFlipped(true);
                const correct_0 = ans === tfCards[tfIndex].answer;
                if (correct_0) {
                    setTfScore(_Lesson5_HeBPTBacNhatHaiAnHandleTfAnswerSetTfScore);
                }
                setTfHistory({
                    "Lesson5_HeBPTBacNhatHaiAn[handleTfAnswer > setTfHistory()]": (h_0)=>[
                            ...h_0,
                            {
                                q: tfIndex,
                                given: ans,
                                correct: correct_0
                            }
                        ]
                }["Lesson5_HeBPTBacNhatHaiAn[handleTfAnswer > setTfHistory()]"]);
            }
        })["Lesson5_HeBPTBacNhatHaiAn[handleTfAnswer]"];
        handleTfNext = ({
            "Lesson5_HeBPTBacNhatHaiAn[handleTfNext]": ()=>{
                if (tfIndex + 1 >= tfCards.length) {
                    setTfDone(true);
                } else {
                    setTfIndex(_Lesson5_HeBPTBacNhatHaiAnHandleTfNextSetTfIndex);
                    setTfFlipped(false);
                }
            }
        })["Lesson5_HeBPTBacNhatHaiAn[handleTfNext]"];
        let t24;
        if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
            t24 = ({
                "Lesson5_HeBPTBacNhatHaiAn[resetTf]": ()=>{
                    setTfIndex(0);
                    setTfFlipped(false);
                    setTfScore(0);
                    setTfDone(false);
                    setTfHistory([]);
                }
            })["Lesson5_HeBPTBacNhatHaiAn[resetTf]"];
            $[49] = t24;
        } else {
            t24 = $[49];
        }
        resetTf = t24;
        const checkFill = {
            "Lesson5_HeBPTBacNhatHaiAn[checkFill]": (id_1)=>{
                const q_0 = fillQuestions.find({
                    "Lesson5_HeBPTBacNhatHaiAn[checkFill > fillQuestions.find()]": (q)=>q.id === id_1
                }["Lesson5_HeBPTBacNhatHaiAn[checkFill > fillQuestions.find()]"]);
                const raw = (fillAnswers[id_1] || "").toLowerCase().trim().replace(/\s/g, "");
                const answers = [
                    q_0.answer,
                    ...q_0.altAnswers || []
                ].map(_Lesson5_HeBPTBacNhatHaiAnCheckFillAnonymous);
                return answers.includes(raw);
            }
        }["Lesson5_HeBPTBacNhatHaiAn[checkFill]"];
        fillScore = fillChecked ? fillQuestions.filter({
            "Lesson5_HeBPTBacNhatHaiAn[fillQuestions.filter()]": (q_1)=>checkFill(q_1.id)
        }["Lesson5_HeBPTBacNhatHaiAn[fillQuestions.filter()]"]).length : null;
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
            t31 = t("3. C\xE1ch Gi\u1EA3i", "3. Method");
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
        const SectionHeader = _Lesson5_HeBPTBacNhatHaiAnSectionHeader;
        let t38;
        if ($[81] !== t) {
            t38 = ({
                "Lesson5_HeBPTBacNhatHaiAn[ResultSummary]": (t39)=>{
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
                                        children: items.filter(_Lesson5_HeBPTBacNhatHaiAnResultSummaryItemsFilter).length === items.length ? "\uD83C\uDFC6" : items.filter(_Lesson5_HeBPTBacNhatHaiAnResultSummaryItemsFilter2).length >= items.length * 0.6 ? "\uD83D\uDC4D" : "\uD83D\uDCAA"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                                            items.filter(_Lesson5_HeBPTBacNhatHaiAnResultSummaryItemsFilter3).length,
                                            " / ",
                                            items.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 472,
                                        columnNumber: 262
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: "#777",
                                            fontSize: 16,
                                            marginTop: 4
                                        },
                                        children: scoreLabel
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 476,
                                        columnNumber: 115
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                                    "Lesson5_HeBPTBacNhatHaiAn[ResultSummary > items.map()]": (item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                                                        lineNumber: 508,
                                                                        columnNumber: 84
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                                                lineNumber: 508,
                                                                columnNumber: 161
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                                        lineNumber: 498,
                                                        columnNumber: 67
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                                lineNumber: 491,
                                                columnNumber: 20
                                            }, this)
                                        }, idx, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                            lineNumber: 486,
                                            columnNumber: 90
                                        }, this)
                                }["Lesson5_HeBPTBacNhatHaiAn[ResultSummary > items.map()]"])
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 514,
                                    columnNumber: 16
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 512,
                                columnNumber: 82
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 466,
                        columnNumber: 18
                    }, this);
                }
            })["Lesson5_HeBPTBacNhatHaiAn[ResultSummary]"];
            $[81] = t;
            $[82] = t38;
        } else {
            t38 = $[82];
        }
        ResultSummary = t38;
        const mcResultItems = mcHistory.map({
            "Lesson5_HeBPTBacNhatHaiAn[mcHistory.map()]": (h_1)=>({
                    correct: h_1.correct,
                    qText: mcQuestions[h_1.q].q,
                    correctText: mcQuestions[h_1.q].options[mcQuestions[h_1.q].answer],
                    yourText: mcQuestions[h_1.q].options[h_1.selected]
                })
        }["Lesson5_HeBPTBacNhatHaiAn[mcHistory.map()]"]);
        tfResultItems = tfHistory.map({
            "Lesson5_HeBPTBacNhatHaiAn[tfHistory.map()]": (h_2)=>({
                    correct: h_2.correct,
                    qText: tfCards[h_2.q].stmt,
                    correctText: tfCards[h_2.q].answer ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE"),
                    yourText: h_2.given ? t("\u0110\xDANG", "TRUE") : t("SAI", "FALSE")
                })
        }["Lesson5_HeBPTBacNhatHaiAn[tfHistory.map()]"]);
        fillResultItems = fillChecked ? fillQuestions.map({
            "Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map()]": (q_2)=>({
                    correct: checkFill(q_2.id),
                    qText: q_2.template,
                    correctText: q_2.answer,
                    yourText: fillAnswers[q_2.id] || t("(b\u1ECF tr\u1ED1ng)", "(blank)")
                })
        }["Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map()]"]) : [];
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
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                    lineNumber: 608,
                    columnNumber: 68
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            t47 = t("B\xE0i 5: H\u1EC7 B\u1EA5t Ph\u01B0\u01A1ng Tr\xECnh B\u1EADc Nh\u1EA5t Hai \u1EA8n", "Lesson 5: System of Linear Inequalities in Two Variables");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                "Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]": ()=>setLang("vi")
            })["Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]"];
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                "Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]": ()=>setLang("en")
            })["Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]"];
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            t64 = t("Hi\u1EC3u kh\xE1i ni\u1EC7m h\u1EC7 BPT b\u1EADc nh\u1EA5t hai \u1EA9n.", "Understand the concept of a system of linear inequalities in 2 variables.");
            $[126] = t;
            $[127] = t64;
        } else {
            t64 = $[127];
        }
        let t65;
        if ($[128] !== t) {
            t65 = t("Bi\u1EC3u di\u1EC5n mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 BPT tr\xEAn m\u1EB7t ph\u1EB3ng t\u1ECDa \u0111\u1ED9.", "Graph the solution region of a system on the coordinate plane.");
            $[128] = t;
            $[129] = t65;
        } else {
            t65 = $[129];
        }
        let t66;
        if ($[130] !== t) {
            t66 = t("X\xE1c \u0111\u1ECBnh mi\u1EC1n nghi\u1EC7m l\xE0 giao c\u1EE7a c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng.", "Identify the solution region as the intersection of half-planes.");
            $[130] = t;
            $[131] = t66;
        } else {
            t66 = $[131];
        }
        let t67;
        if ($[132] !== t) {
            t67 = t("T\xECm c\xE1c \u0111i\u1EC3m g\xF3c (\u0111\u1EC9nh) c\u1EE7a mi\u1EC1n \u0111a gi\xE1c.", "Find the corner points (vertices) of the polygonal region.");
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
            ].map(_Lesson5_HeBPTBacNhatHaiAnAnonymous);
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                        "Lesson5_HeBPTBacNhatHaiAn[tabs.map()]": (t71)=>{
                            const [id_2, icon_0, label] = t71;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "Lesson5_HeBPTBacNhatHaiAn[tabs.map() > <button>.onClick]": ()=>scrollTo(id_2)
                                }["Lesson5_HeBPTBacNhatHaiAn[tabs.map() > <button>.onClick]"],
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
                                onMouseEnter: _Lesson5_HeBPTBacNhatHaiAnTabsMapButtonOnMouseEnter,
                                onMouseLeave: _Lesson5_HeBPTBacNhatHaiAnTabsMapButtonOnMouseLeave,
                                children: [
                                    icon_0,
                                    " ",
                                    label
                                ]
                            }, id_2, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 887,
                                columnNumber: 22
                            }, this);
                        }
                    }["Lesson5_HeBPTBacNhatHaiAn[tabs.map()]"])
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                    lineNumber: 884,
                    columnNumber: 30
                }, this)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            t79 = t("M\u1ED9t nh\xE0 m\xE1y s\u1EA3n xu\u1EA5t hai s\u1EA3n ph\u1EA9m X v\xE0 Y. V\u1EDBi c\xE1c r\xE0ng bu\u1ED9c v\u1EC1 nguy\xEAn li\u1EC7u, nh\xE2n c\xF4ng v\xE0 m\xE1y m\xF3c, ta c\xF3 nhi\u1EC1u BPT \u0111\u1ED3ng th\u1EDDi:\n\u2022 2x + y \u2264 100 (nguy\xEAn li\u1EC7u)\n\u2022 x + 3y \u2264 90 (nh\xE2n c\xF4ng)\n\u2022 x \u2265 0, y \u2265 0 (s\u1EA3n l\u01B0\u1EE3ng kh\xF4ng \xE2m)", "A factory makes products X and Y. With constraints on materials, labor and machines, we have multiple simultaneous inequalities:\n\u2022 2x + y \u2264 100 (materials)\n\u2022 x + 3y \u2264 90 (labor)\n\u2022 x \u2265 0, y \u2265 0 (non-negative quantities)");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            t82 = t("\u0110\xE2y l\xE0 h\u1EC7 BPT. B\xE0i to\xE1n t\xECm mi\u1EC1n nghi\u1EC7m xu\u1EA5t hi\u1EC7n trong nhi\u1EC1u b\xE0i to\xE1n t\u1ED1i \u01B0u th\u1EF1c t\u1EBF.", "This is a system of inequalities, appearing in many real-world optimization problems.");
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 1016,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            t86 = t("1. \u0110\u1ECBnh Ngh\u0129a H\u1EC7 BPT", "1. System Definition");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
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
            t93 = t("H\u1EC7 BPT b\u1EADc nh\u1EA5t hai \u1EA9n g\u1ED3m nhi\u1EC1u BPT b\u1EADc nh\u1EA5t hai \u1EA9n \u0111\u1EB7t \u0111\u1ED3ng th\u1EDDi. Nghi\u1EC7m c\u1EE7a h\u1EC7 l\xE0 c\u1EB7p (x\u2080, y\u2080) th\u1ECFa m\xE3n T\u1EA4T C\u1EA2 c\xE1c BPT trong h\u1EC7.", "A system of linear inequalities in two variables consists of multiple linear inequalities simultaneously. A solution is a pair (x\u2080, y\u2080) satisfying ALL inequalities in the system.");
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1124,
                columnNumber: 13
            }, this);
            $[188] = t93;
            $[189] = t94;
        } else {
            t94 = $[189];
        }
        let t95;
        if ($[190] !== t91 || $[191] !== t94) {
            t95 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t88,
                children: [
                    t91,
                    t94
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1132,
                columnNumber: 13
            }, this);
            $[190] = t91;
            $[191] = t94;
            $[192] = t95;
        } else {
            t95 = $[192];
        }
        let t96;
        let t97;
        if ($[193] === Symbol.for("react.memo_cache_sentinel")) {
            t96 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t97 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12
            };
            $[193] = t96;
            $[194] = t97;
        } else {
            t96 = $[193];
            t97 = $[194];
        }
        let t98;
        if ($[195] !== t) {
            t98 = t("V\xED d\u1EE5 h\u1EC7 BPT", "Example system");
            $[195] = t;
            $[196] = t98;
        } else {
            t98 = $[196];
        }
        let t99;
        if ($[197] !== t98) {
            t99 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t97,
                children: [
                    "📘 ",
                    t98
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1169,
                columnNumber: 13
            }, this);
            $[197] = t98;
            $[198] = t99;
        } else {
            t99 = $[198];
        }
        let t100;
        if ($[199] === Symbol.for("react.memo_cache_sentinel")) {
            t100 = {
                fontFamily: "monospace",
                fontSize: 18,
                color: "#0B4F5C",
                lineHeight: 2,
                padding: "10px 0"
            };
            $[199] = t100;
        } else {
            t100 = $[199];
        }
        let t101;
        if ($[200] === Symbol.for("react.memo_cache_sentinel")) {
            t101 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1190,
                columnNumber: 14
            }, this);
            $[200] = t101;
        } else {
            t101 = $[200];
        }
        let t102;
        let t103;
        if ($[201] === Symbol.for("react.memo_cache_sentinel")) {
            t102 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t100,
                children: [
                    "{",
                    " x + y ≤ 4",
                    t101,
                    "{",
                    " x − y ≥ −2",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 1198,
                        columnNumber: 69
                    }, this),
                    "{",
                    " x ≥ 0"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1198,
                columnNumber: 14
            }, this);
            t103 = {
                fontSize: 15,
                color: "#777",
                marginTop: 8
            };
            $[201] = t102;
            $[202] = t103;
        } else {
            t102 = $[201];
            t103 = $[202];
        }
        let t104;
        if ($[203] !== t) {
            t104 = t("Nghi\u1EC7m: m\u1ECDi \u0111i\u1EC3m (x,y) th\u1ECFa \u0111\u1ED3ng th\u1EDDi c\u1EA3 3 BPT tr\xEAn.", "Solutions: all points (x,y) satisfying all 3 inequalities simultaneously.");
            $[203] = t;
            $[204] = t104;
        } else {
            t104 = $[204];
        }
        let t105;
        if ($[205] !== t104) {
            t105 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t103,
                children: t104
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1220,
                columnNumber: 14
            }, this);
            $[205] = t104;
            $[206] = t105;
        } else {
            t105 = $[206];
        }
        let t106;
        if ($[207] !== t105 || $[208] !== t99) {
            t106 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t96,
                children: [
                    t99,
                    t102,
                    t105
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1228,
                columnNumber: 14
            }, this);
            $[207] = t105;
            $[208] = t99;
            $[209] = t106;
        } else {
            t106 = $[209];
        }
        if ($[210] !== t106 || $[211] !== t87 || $[212] !== t95) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai1",
                style: t85,
                children: [
                    t87,
                    t95,
                    t106
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1236,
                columnNumber: 13
            }, this);
            $[210] = t106;
            $[211] = t87;
            $[212] = t95;
            $[213] = t18;
        } else {
            t18 = $[213];
        }
        let t107;
        if ($[214] === Symbol.for("react.memo_cache_sentinel")) {
            t107 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[214] = t107;
        } else {
            t107 = $[214];
        }
        let t108;
        if ($[215] !== t) {
            t108 = t("2. Mi\u1EC1n Nghi\u1EC7m C\u1EE7a H\u1EC7", "2. Solution Region of the System");
            $[215] = t;
            $[216] = t108;
        } else {
            t108 = $[216];
        }
        let t109;
        if ($[217] !== t108) {
            t109 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t108
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1264,
                columnNumber: 14
            }, this);
            $[217] = t108;
            $[218] = t109;
        } else {
            t109 = $[218];
        }
        let t110;
        let t111;
        if ($[219] === Symbol.for("react.memo_cache_sentinel")) {
            t110 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t111 = {
                fontWeight: "bold",
                fontSize: 18,
                color: "#0B4F5C",
                marginBottom: 10
            };
            $[219] = t110;
            $[220] = t111;
        } else {
            t110 = $[219];
            t111 = $[220];
        }
        let t112;
        if ($[221] !== t) {
            t112 = t("T\xEDnh ch\u1EA5t", "Properties");
            $[221] = t;
            $[222] = t112;
        } else {
            t112 = $[222];
        }
        let t113;
        if ($[223] !== t112) {
            t113 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t111,
                children: [
                    "📌 ",
                    t112
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1302,
                columnNumber: 14
            }, this);
            $[223] = t112;
            $[224] = t113;
        } else {
            t113 = $[224];
        }
        let t114;
        if ($[225] === Symbol.for("react.memo_cache_sentinel")) {
            t114 = {
                fontSize: 16,
                lineHeight: 1.8
            };
            $[225] = t114;
        } else {
            t114 = $[225];
        }
        let t115;
        if ($[226] !== t) {
            t115 = t("Mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7 = giao c\u1EE7a t\u1EA5t c\u1EA3 c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng t\u01B0\u01A1ng \u1EE9ng v\u1EDBi t\u1EEBng BPT. Mi\u1EC1n n\xE0y c\xF3 th\u1EC3 l\xE0:", "Solution region = intersection of all corresponding half-planes. This region can be:");
            $[226] = t;
            $[227] = t115;
        } else {
            t115 = $[227];
        }
        let t116;
        if ($[228] !== t115) {
            t116 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t114,
                children: t115
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1328,
                columnNumber: 14
            }, this);
            $[228] = t115;
            $[229] = t116;
        } else {
            t116 = $[229];
        }
        let t117;
        if ($[230] !== t113 || $[231] !== t116) {
            t117 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t110,
                children: [
                    t113,
                    t116
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1336,
                columnNumber: 14
            }, this);
            $[230] = t113;
            $[231] = t116;
            $[232] = t117;
        } else {
            t117 = $[232];
        }
        let t118;
        if ($[233] === Symbol.for("react.memo_cache_sentinel")) {
            t118 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 24,
                transition: "all 0.3s ease"
            };
            $[233] = t118;
        } else {
            t118 = $[233];
        }
        let t119;
        if ($[234] !== t) {
            t119 = t("T\u1EADp r\u1ED7ng", "Empty set");
            $[234] = t;
            $[235] = t119;
        } else {
            t119 = $[235];
        }
        let t120;
        if ($[236] !== t) {
            t120 = t("Kh\xF4ng c\xF3 \u0111i\u1EC3m n\xE0o th\u1ECFa t\u1EA5t c\u1EA3 BPT \u2014 c\xE1c n\u1EEDa m\u1EB7t ph\u1EB3ng kh\xF4ng c\xF3 \u0111i\u1EC3m chung.", "No point satisfies all \u2014 half-planes share no common point.");
            $[236] = t;
            $[237] = t120;
        } else {
            t120 = $[237];
        }
        let t121;
        if ($[238] !== t119 || $[239] !== t120) {
            t121 = {
                icon: "\u2205",
                title: t119,
                desc: t120,
                color: "#fdf2f2",
                text: "#922b21"
            };
            $[238] = t119;
            $[239] = t120;
            $[240] = t121;
        } else {
            t121 = $[240];
        }
        let t122;
        if ($[241] !== t) {
            t122 = t("\u0110a gi\xE1c l\u1ED3i h\u1EEFu h\u1EA1n", "Bounded convex polygon");
            $[241] = t;
            $[242] = t122;
        } else {
            t122 = $[242];
        }
        let t123;
        if ($[243] !== t) {
            t123 = t("Mi\u1EC1n nghi\u1EC7m l\xE0 \u0111a gi\xE1c l\u1ED3i c\xF3 c\xE1c \u0111\u1EC9nh x\xE1c \u0111\u1ECBnh.", "Solution region is a bounded convex polygon with defined vertices.");
            $[243] = t;
            $[244] = t123;
        } else {
            t123 = $[244];
        }
        let t124;
        if ($[245] !== t122 || $[246] !== t123) {
            t124 = {
                icon: "\u25B2",
                title: t122,
                desc: t123,
                color: "#eafaf1",
                text: "#1e8449"
            };
            $[245] = t122;
            $[246] = t123;
            $[247] = t124;
        } else {
            t124 = $[247];
        }
        let t125;
        if ($[248] !== t) {
            t125 = t("V\xF9ng v\xF4 h\u1EA1n", "Unbounded region");
            $[248] = t;
            $[249] = t125;
        } else {
            t125 = $[249];
        }
        let t126;
        if ($[250] !== t) {
            t126 = t("Mi\u1EC1n nghi\u1EC7m k\xE9o d\xE0i ra v\xF4 h\u1EA1n theo m\u1ED9t ho\u1EB7c nhi\u1EC1u h\u01B0\u1EDBng.", "Solution region extends infinitely in one or more directions.");
            $[250] = t;
            $[251] = t126;
        } else {
            t126 = $[251];
        }
        let t127;
        if ($[252] !== t125 || $[253] !== t126) {
            t127 = {
                icon: "\u2197",
                title: t125,
                desc: t126,
                color: "#e8f4fd",
                text: "#1a5276"
            };
            $[252] = t125;
            $[253] = t126;
            $[254] = t127;
        } else {
            t127 = $[254];
        }
        let t128;
        if ($[255] !== t121 || $[256] !== t124 || $[257] !== t127) {
            t128 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t118,
                children: [
                    t121,
                    t124,
                    t127
                ].map(_Lesson5_HeBPTBacNhatHaiAnAnonymous2)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1450,
                columnNumber: 14
            }, this);
            $[255] = t121;
            $[256] = t124;
            $[257] = t127;
            $[258] = t128;
        } else {
            t128 = $[258];
        }
        if ($[259] !== t109 || $[260] !== t117 || $[261] !== t128) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai2",
                style: t107,
                children: [
                    t109,
                    t117,
                    t128
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1459,
                columnNumber: 13
            }, this);
            $[259] = t109;
            $[260] = t117;
            $[261] = t128;
            $[262] = t19;
        } else {
            t19 = $[262];
        }
        let t129;
        if ($[263] === Symbol.for("react.memo_cache_sentinel")) {
            t129 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[263] = t129;
        } else {
            t129 = $[263];
        }
        let t130;
        if ($[264] !== t) {
            t130 = t("3. C\xE1ch Bi\u1EC3u Di\u1EC5n Mi\u1EC1n Nghi\u1EC7m C\u1EE7a H\u1EC7", "3. Graphing the Solution Region");
            $[264] = t;
            $[265] = t130;
        } else {
            t130 = $[265];
        }
        let t131;
        if ($[266] !== t130) {
            t131 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83D\uDCD6",
                title: t130
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1487,
                columnNumber: 14
            }, this);
            $[266] = t130;
            $[267] = t131;
        } else {
            t131 = $[267];
        }
        let t132;
        let t133;
        if ($[268] === Symbol.for("react.memo_cache_sentinel")) {
            t132 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginBottom: 24
            };
            t133 = {
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 16,
                color: "#0B4F5C"
            };
            $[268] = t132;
            $[269] = t133;
        } else {
            t132 = $[268];
            t133 = $[269];
        }
        let t134;
        if ($[270] !== t) {
            t134 = t("C\xE1c b\u01B0\u1EDBc th\u1EF1c hi\u1EC7n", "Steps");
            $[270] = t;
            $[271] = t134;
        } else {
            t134 = $[271];
        }
        let t135;
        if ($[272] !== t134) {
            t135 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t133,
                children: [
                    "📋 ",
                    t134
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1525,
                columnNumber: 14
            }, this);
            $[272] = t134;
            $[273] = t135;
        } else {
            t135 = $[273];
        }
        let t136;
        if ($[274] === Symbol.for("react.memo_cache_sentinel")) {
            t136 = {
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "all 0.3s ease"
            };
            $[274] = t136;
        } else {
            t136 = $[274];
        }
        let t137;
        if ($[275] !== t) {
            t137 = t("V\u1EDBi m\u1ED7i BPT trong h\u1EC7: v\u1EBD \u0111\u01B0\u1EDDng bi\xEAn t\u01B0\u01A1ng \u1EE9ng v\xE0 x\xE1c \u0111\u1ECBnh n\u1EEDa mp nghi\u1EC7m.", "For each inequality: draw its boundary and identify the solution half-plane.");
            $[275] = t;
            $[276] = t137;
        } else {
            t137 = $[276];
        }
        let t138;
        if ($[277] !== t137) {
            t138 = {
                step: "1",
                text: t137
            };
            $[277] = t137;
            $[278] = t138;
        } else {
            t138 = $[278];
        }
        let t139;
        if ($[279] !== t) {
            t139 = t("T\xF4 m\xE0u (nh\u1EB9) t\u1EEBng mi\u1EC1n nghi\u1EC7m \u0111\u01A1n l\u1EBB theo m\xE0u kh\xE1c nhau.", "Lightly shade each individual solution region with different colors.");
            $[279] = t;
            $[280] = t139;
        } else {
            t139 = $[280];
        }
        let t140;
        if ($[281] !== t139) {
            t140 = {
                step: "2",
                text: t139
            };
            $[281] = t139;
            $[282] = t140;
        } else {
            t140 = $[282];
        }
        let t141;
        if ($[283] !== t) {
            t141 = t("Ph\u1EA7n giao chung (\u0111\u01B0\u1EE3c t\xF4 m\xE0u b\u1EDFi T\u1EA4T C\u1EA2) ch\xEDnh l\xE0 mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7.", "The common intersection (shaded by ALL) is the solution region of the system.");
            $[283] = t;
            $[284] = t141;
        } else {
            t141 = $[284];
        }
        let t142;
        if ($[285] !== t141) {
            t142 = {
                step: "3",
                text: t141
            };
            $[285] = t141;
            $[286] = t142;
        } else {
            t142 = $[286];
        }
        let t143;
        if ($[287] !== t) {
            t143 = t("T\xECm c\xE1c \u0111\u1EC9nh (\u0111i\u1EC3m g\xF3c) c\u1EE7a mi\u1EC1n b\u1EB1ng c\xE1ch gi\u1EA3i c\xE1c h\u1EC7 ph\u01B0\u01A1ng tr\xECnh \u0111\u01B0\u1EDDng bi\xEAn.", "Find the vertices by solving systems of boundary line equations.");
            $[287] = t;
            $[288] = t143;
        } else {
            t143 = $[288];
        }
        let t144;
        if ($[289] !== t143) {
            t144 = {
                step: "4",
                text: t143
            };
            $[289] = t143;
            $[290] = t144;
        } else {
            t144 = $[290];
        }
        let t145;
        if ($[291] !== t138 || $[292] !== t140 || $[293] !== t142 || $[294] !== t144) {
            t145 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t136,
                children: [
                    t138,
                    t140,
                    t142,
                    t144
                ].map(_Lesson5_HeBPTBacNhatHaiAnAnonymous3)
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1621,
                columnNumber: 14
            }, this);
            $[291] = t138;
            $[292] = t140;
            $[293] = t142;
            $[294] = t144;
            $[295] = t145;
        } else {
            t145 = $[295];
        }
        let t146;
        if ($[296] !== t135 || $[297] !== t145) {
            t146 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                style: t132,
                children: [
                    t135,
                    t145
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1632,
                columnNumber: 14
            }, this);
            $[296] = t135;
            $[297] = t145;
            $[298] = t146;
        } else {
            t146 = $[298];
        }
        let t147;
        let t148;
        if ($[299] === Symbol.for("react.memo_cache_sentinel")) {
            t147 = {
                padding: 20,
                borderRadius: 10,
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            };
            t148 = {
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12
            };
            $[299] = t147;
            $[300] = t148;
        } else {
            t147 = $[299];
            t148 = $[300];
        }
        let t149;
        if ($[301] !== t) {
            t149 = t("V\xED d\u1EE5: T\xECm mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7", "Example: Find solution region of");
            $[301] = t;
            $[302] = t149;
        } else {
            t149 = $[302];
        }
        let t150;
        if ($[303] !== t149) {
            t150 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t148,
                children: [
                    "📘 ",
                    t149
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1669,
                columnNumber: 14
            }, this);
            $[303] = t149;
            $[304] = t150;
        } else {
            t150 = $[304];
        }
        let t151;
        if ($[305] === Symbol.for("react.memo_cache_sentinel")) {
            t151 = {
                fontFamily: "monospace",
                fontSize: 18,
                color: "#0B4F5C",
                lineHeight: 2,
                marginBottom: 16
            };
            $[305] = t151;
        } else {
            t151 = $[305];
        }
        let t152;
        if ($[306] === Symbol.for("react.memo_cache_sentinel")) {
            t152 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1690,
                columnNumber: 14
            }, this);
            $[306] = t152;
        } else {
            t152 = $[306];
        }
        let t153;
        let t154;
        if ($[307] === Symbol.for("react.memo_cache_sentinel")) {
            t153 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t151,
                children: [
                    "{",
                    " x + y ≤ 4    (1)",
                    t152,
                    "{",
                    " x − y ≥ 0    (2)",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 1698,
                        columnNumber: 82
                    }, this),
                    "{",
                    " x ≥ 0       (3)"
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1698,
                columnNumber: 14
            }, this);
            t154 = {
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 15,
                color: "#555"
            };
            $[307] = t153;
            $[308] = t154;
        } else {
            t153 = $[307];
            t154 = $[308];
        }
        let t155;
        if ($[309] !== t) {
            t155 = t("\u0110\u01B0\u1EDDng bi\xEAn (1): x+y=4. Th\u1EED O: 0+0=0\u22644 \u2713 \u2192 t\xF4 ph\xEDa ch\u1EE9a O.", "Boundary (1): x+y=4. Test O: 0\u22644 \u2713 \u2192 shade O's side.");
            $[309] = t;
            $[310] = t155;
        } else {
            t155 = $[310];
        }
        let t156;
        if ($[311] !== t155) {
            t156 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    "① ",
                    t155
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1722,
                columnNumber: 14
            }, this);
            $[311] = t155;
            $[312] = t156;
        } else {
            t156 = $[312];
        }
        let t157;
        if ($[313] !== t) {
            t157 = t("\u0110\u01B0\u1EDDng bi\xEAn (2): x\u2212y=0 (y=x). Th\u1EED O: 0\u22120=0\u22650 \u2713 \u2192 t\xF4 ph\xEDa ch\u1EE9a O.", "Boundary (2): x\u2212y=0 (y=x). Test O: 0\u22650 \u2713 \u2192 shade O's side.");
            $[313] = t;
            $[314] = t157;
        } else {
            t157 = $[314];
        }
        let t158;
        if ($[315] !== t157) {
            t158 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    "② ",
                    t157
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1738,
                columnNumber: 14
            }, this);
            $[315] = t157;
            $[316] = t158;
        } else {
            t158 = $[316];
        }
        let t159;
        if ($[317] !== t) {
            t159 = t("\u0110\u01B0\u1EDDng bi\xEAn (3): x=0. Th\u1EED \u0111i\u1EC3m (1,0): 1\u22650 \u2713 \u2192 t\xF4 ph\xEDa ph\u1EA3i.", "Boundary (3): x=0. Test (1,0): 1\u22650 \u2713 \u2192 shade right side.");
            $[317] = t;
            $[318] = t159;
        } else {
            t159 = $[318];
        }
        let t160;
        if ($[319] !== t159) {
            t160 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    "③ ",
                    t159
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1754,
                columnNumber: 14
            }, this);
            $[319] = t159;
            $[320] = t160;
        } else {
            t160 = $[320];
        }
        let t161;
        if ($[321] === Symbol.for("react.memo_cache_sentinel")) {
            t161 = {
                marginTop: 8,
                padding: "10px 14px",
                background: "#eafaf1",
                borderRadius: 8,
                color: "#1e8449",
                fontWeight: 600
            };
            $[321] = t161;
        } else {
            t161 = $[321];
        }
        let t162;
        if ($[322] !== t) {
            t162 = t("\u0110\u1EC9nh mi\u1EC1n: O(0,0), A(4,0), B(2,2) \u2014 tam gi\xE1c c\xF3 c\u1EA1nh tr\xEAn \u0111\u01B0\u1EDDng y=x.", "Vertices: O(0,0), A(4,0), B(2,2) \u2014 triangle on y=x.");
            $[322] = t;
            $[323] = t162;
        } else {
            t162 = $[323];
        }
        let t163;
        if ($[324] !== t162) {
            t163 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t161,
                children: [
                    "✅ ",
                    t162
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1784,
                columnNumber: 14
            }, this);
            $[324] = t162;
            $[325] = t163;
        } else {
            t163 = $[325];
        }
        let t164;
        if ($[326] !== t156 || $[327] !== t158 || $[328] !== t160 || $[329] !== t163) {
            t164 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t154,
                children: [
                    t156,
                    t158,
                    t160,
                    t163
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1792,
                columnNumber: 14
            }, this);
            $[326] = t156;
            $[327] = t158;
            $[328] = t160;
            $[329] = t163;
            $[330] = t164;
        } else {
            t164 = $[330];
        }
        let t165;
        if ($[331] !== t150 || $[332] !== t164) {
            t165 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t147,
                children: [
                    t150,
                    t153,
                    t164
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1803,
                columnNumber: 14
            }, this);
            $[331] = t150;
            $[332] = t164;
            $[333] = t165;
        } else {
            t165 = $[333];
        }
        if ($[334] !== t131 || $[335] !== t146 || $[336] !== t165) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "khai3",
                style: t129,
                children: [
                    t131,
                    t146,
                    t165
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1811,
                columnNumber: 13
            }, this);
            $[334] = t131;
            $[335] = t146;
            $[336] = t165;
            $[337] = t20;
        } else {
            t20 = $[337];
        }
        let t166;
        if ($[338] === Symbol.for("react.memo_cache_sentinel")) {
            t166 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[338] = t166;
        } else {
            t166 = $[338];
        }
        let t167;
        if ($[339] !== t) {
            t167 = t("Th\u1EF1c H\xE0nh", "Practice Exercises");
            $[339] = t;
            $[340] = t167;
        } else {
            t167 = $[340];
        }
        let t168;
        if ($[341] !== t167) {
            t168 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\u270F\uFE0F",
                title: t167
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1839,
                columnNumber: 14
            }, this);
            $[341] = t167;
            $[342] = t168;
        } else {
            t168 = $[342];
        }
        let t169;
        if ($[343] === Symbol.for("react.memo_cache_sentinel")) {
            t169 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 40,
                transition: "all 0.3s ease"
            };
            $[343] = t169;
        } else {
            t169 = $[343];
        }
        let t170;
        if ($[344] !== revealedAnswers || $[345] !== t) {
            t170 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "100",
                style: t169,
                children: [
                    {
                        id: "e1",
                        q: t("Ki\u1EC3m tra xem M(2,1) c\xF3 thu\u1ED9c mi\u1EC1n nghi\u1EC7m c\u1EE7a h\u1EC7:\n{x + y \u2264 5; 2x \u2212 y \u2265 0; x \u2265 0} kh\xF4ng?", "Check if M(2,1) is in the solution region of:\n{x+y \u2264 5; 2x\u2212y \u2265 0; x \u2265 0}"),
                        a: [
                            "\u2460 x+y: 2+1=3\u22645 \u2713",
                            "\u2461 2x\u2212y: 4\u22121=3\u22650 \u2713",
                            "\u2462 x: 2\u22650 \u2713",
                            t("\u2192 M(2,1) THU\u1ED8C mi\u1EC1n nghi\u1EC7m \u2705", "\u2192 M(2,1) IS in the solution region \u2705")
                        ]
                    },
                    {
                        id: "e2",
                        q: t("T\xECm c\xE1c \u0111\u1EC9nh c\u1EE7a mi\u1EC1n nghi\u1EC7m h\u1EC7:\n{x + y \u2264 6; x \u2265 0; y \u2265 0}", "Find vertices of the solution region:\n{x+y \u2264 6; x \u2265 0; y \u2265 0}"),
                        a: [
                            t("Giao x+y=6 v\xE0 x=0 \u2192 (0,6)", "Intersect x+y=6 and x=0 \u2192 (0,6)"),
                            t("Giao x+y=6 v\xE0 y=0 \u2192 (6,0)", "Intersect x+y=6 and y=0 \u2192 (6,0)"),
                            t("Giao x=0 v\xE0 y=0 \u2192 O(0,0)", "Intersect x=0 and y=0 \u2192 O(0,0)"),
                            t("3 \u0111\u1EC9nh: O(0,0), A(6,0), B(0,6) \u2014 tam gi\xE1c vu\xF4ng.", "3 vertices: O(0,0), A(6,0), B(0,6) \u2014 right triangle.")
                        ]
                    },
                    {
                        id: "e3",
                        q: t("H\u1EC7 {x \u2265 2; x \u2264 0} c\xF3 mi\u1EC1n nghi\u1EC7m kh\xF4ng?", "Does {x \u2265 2; x \u2264 0} have a solution region?"),
                        a: [
                            t("BPT 1: x \u2265 2 (b\xEAn ph\u1EA3i \u0111\u01B0\u1EDDng x=2)", "BPT 1: x \u2265 2 (right of x=2)"),
                            t("BPT 2: x \u2264 0 (b\xEAn tr\xE1i \u0111\u01B0\u1EDDng x=0)", "BPT 2: x \u2264 0 (left of x=0)"),
                            t("Hai n\u1EEDa m\u1EB7t ph\u1EB3ng kh\xF4ng giao nhau \u2192 Mi\u1EC1n nghi\u1EC7m l\xE0 T\u1EACP R\u1ED6NG \u2205.", "Two non-intersecting half-planes \u2192 Solution region is EMPTY SET \u2205.")
                        ]
                    }
                ].map({
                    "Lesson5_HeBPTBacNhatHaiAn[(anonymous)()]": (t171)=>{
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                            lineNumber: 1883,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#777",
                                                fontSize: 14
                                            },
                                            children: t("To\xE1n 10", "Grade 10")
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                            lineNumber: 1887,
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
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                            lineNumber: 1890,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 1878,
                                    columnNumber: 40
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson5_HeBPTBacNhatHaiAn[(anonymous)() > <button>.onClick]": ()=>toggleAnswer(id_3)
                                    }["Lesson5_HeBPTBacNhatHaiAn[(anonymous)() > <button>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 1895,
                                    columnNumber: 37
                                }, this),
                                revealedAnswers[id_3] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: "16px 20px",
                                        background: "#eafaf1",
                                        borderRadius: "0 0 10px 10px"
                                    },
                                    children: a_0.map(_Lesson5_HeBPTBacNhatHaiAnAnonymousA_0Map)
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 1908,
                                    columnNumber: 196
                                }, this)
                            ]
                        }, id_3, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                            lineNumber: 1878,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson5_HeBPTBacNhatHaiAn[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1859,
                columnNumber: 14
            }, this);
            $[344] = revealedAnswers;
            $[345] = t;
            $[346] = t170;
        } else {
            t170 = $[346];
        }
        if ($[347] !== t168 || $[348] !== t170) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "thucHanh",
                style: t166,
                children: [
                    t168,
                    t170
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1922,
                columnNumber: 13
            }, this);
            $[347] = t168;
            $[348] = t170;
            $[349] = t21;
        } else {
            t21 = $[349];
        }
        t7 = "miniGame";
        if ($[350] === Symbol.for("react.memo_cache_sentinel")) {
            t8 = {
                scrollMarginTop: 80,
                marginBottom: 64
            };
            $[350] = t8;
        } else {
            t8 = $[350];
        }
        let t171;
        if ($[351] !== t) {
            t171 = t("Mini Game", "Mini Game");
            $[351] = t;
            $[352] = t171;
        } else {
            t171 = $[352];
        }
        if ($[353] !== t171) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                icon: "\uD83C\uDFAE",
                title: t171
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 1948,
                columnNumber: 12
            }, this);
            $[353] = t171;
            $[354] = t9;
        } else {
            t9 = $[354];
        }
        let t172;
        if ($[355] === Symbol.for("react.memo_cache_sentinel")) {
            t172 = {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 24,
                marginBottom: 32,
                transition: "all 0.3s ease"
            };
            $[355] = t172;
        } else {
            t172 = $[355];
        }
        let t173;
        if ($[356] !== t) {
            t173 = t("Tr\u1EAFc Nghi\u1EC7m", "Multiple Choice");
            $[356] = t;
            $[357] = t173;
        } else {
            t173 = $[357];
        }
        let t174;
        if ($[358] !== t) {
            t174 = t("5 c\xE2u h\u1ECFi", "5 questions");
            $[358] = t;
            $[359] = t174;
        } else {
            t174 = $[359];
        }
        let t175;
        if ($[360] !== t173 || $[361] !== t174) {
            t175 = [
                "mc",
                "\uD83E\uDDE9",
                t173,
                t174
            ];
            $[360] = t173;
            $[361] = t174;
            $[362] = t175;
        } else {
            t175 = $[362];
        }
        let t176;
        if ($[363] !== t) {
            t176 = t("\u0110\xFAng / Sai", "True / False");
            $[363] = t;
            $[364] = t176;
        } else {
            t176 = $[364];
        }
        let t177;
        if ($[365] !== t) {
            t177 = t("5 th\u1EBB", "5 cards");
            $[365] = t;
            $[366] = t177;
        } else {
            t177 = $[366];
        }
        let t178;
        if ($[367] !== t176 || $[368] !== t177) {
            t178 = [
                "tf",
                "\uD83C\uDCCF",
                t176,
                t177
            ];
            $[367] = t176;
            $[368] = t177;
            $[369] = t178;
        } else {
            t178 = $[369];
        }
        let t179;
        if ($[370] !== t) {
            t179 = t("\u0110i\u1EC1n Ch\u1ED7 Tr\u1ED1ng", "Fill in Blank");
            $[370] = t;
            $[371] = t179;
        } else {
            t179 = $[371];
        }
        let t180;
        if ($[372] !== t) {
            t180 = t("3 c\xE2u", "3 items");
            $[372] = t;
            $[373] = t180;
        } else {
            t180 = $[373];
        }
        let t181;
        if ($[374] !== t179 || $[375] !== t180) {
            t181 = [
                "fill",
                "\u270D\uFE0F",
                t179,
                t180
            ];
            $[374] = t179;
            $[375] = t180;
            $[376] = t181;
        } else {
            t181 = $[376];
        }
        let t182;
        if ($[377] !== t175 || $[378] !== t178 || $[379] !== t181) {
            t182 = [
                t175,
                t178,
                t181
            ];
            $[377] = t175;
            $[378] = t178;
            $[379] = t181;
            $[380] = t182;
        } else {
            t182 = $[380];
        }
        if ($[381] !== gameMode || $[382] !== t182) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "reveal",
                "data-reveal": true,
                "data-reveal-stagger": true,
                "data-stagger": "80",
                style: t172,
                children: t182.map({
                    "Lesson5_HeBPTBacNhatHaiAn[(anonymous)()]": (t183)=>{
                        const [mode, icon_1, label_0, sub] = t183;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            onClick: {
                                "Lesson5_HeBPTBacNhatHaiAn[(anonymous)() > <article>.onClick]": ()=>setGameMode(mode)
                            }["Lesson5_HeBPTBacNhatHaiAn[(anonymous)() > <article>.onClick]"],
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
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 2065,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 600
                                    },
                                    children: label_0
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 2068,
                                    columnNumber: 32
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        opacity: 0.7
                                    },
                                    children: sub
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 2071,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, mode, true, {
                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                            lineNumber: 2056,
                            columnNumber: 20
                        }, this);
                    }
                }["Lesson5_HeBPTBacNhatHaiAn[(anonymous)()]"])
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2053,
                columnNumber: 13
            }, this);
            $[381] = gameMode;
            $[382] = t182;
            $[383] = t10;
        } else {
            t10 = $[383];
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2088,
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2092,
                        columnNumber: 116
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 12
                        },
                        children: mcQuestions[mcIndex].options.map({
                            "Lesson5_HeBPTBacNhatHaiAn[(anonymous)()]": (opt, i_11)=>{
                                let bg = "white";
                                let color = "black";
                                if (mcSelected !== null) {
                                    if (i_11 === mcQuestions[mcIndex].answer) {
                                        bg = "#eafaf1";
                                        color = "#1e8449";
                                    } else {
                                        if (i_11 === mcSelected) {
                                            bg = "#fdf2f2";
                                            color = "#922b21";
                                        }
                                    }
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: {
                                        "Lesson5_HeBPTBacNhatHaiAn[(anonymous)() > <button>.onClick]": ()=>handleMcSelect(i_11)
                                    }["Lesson5_HeBPTBacNhatHaiAn[(anonymous)() > <button>.onClick]"],
                                    style: {
                                        textAlign: "left",
                                        padding: "14px 18px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: bg,
                                        color,
                                        fontSize: 15,
                                        fontWeight: mcSelected !== null && (i_11 === mcSelected || i_11 === mcQuestions[mcIndex].answer) ? 600 : 400,
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        transition: "all 0.15s"
                                    },
                                    children: [
                                        String.fromCharCode(65 + i_11),
                                        ". ",
                                        opt
                                    ]
                                }, i_11, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                    lineNumber: 2115,
                                    columnNumber: 22
                                }, this);
                            }
                        }["Lesson5_HeBPTBacNhatHaiAn[(anonymous)()]"])
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2096,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 2131,
                                columnNumber: 90
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 2139,
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2149,
                columnNumber: 157
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2083,
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
    if ($[384] !== ResultSummary || $[385] !== gameMode || $[386] !== handleTfAnswer || $[387] !== handleTfNext || $[388] !== resetTf || $[389] !== t || $[390] !== tfCards || $[391] !== tfDone || $[392] !== tfFlipped || $[393] !== tfIndex || $[394] !== tfResultItems || $[395] !== tfScore) {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2223,
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
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 2234,
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
                                            "Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]": ()=>handleTfAnswer(true)
                                        }["Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2242,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: {
                                            "Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]": ()=>handleTfAnswer(false)
                                        }["Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2253,
                                        columnNumber: 54
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 2238,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2264,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2273,
                                        columnNumber: 51
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2227,
                        columnNumber: 117
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                items: tfResultItems,
                onReset: resetTf,
                scoreLabel: tfScore === tfCards.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2282,
                columnNumber: 167
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2218,
            columnNumber: 32
        }, this);
        $[384] = ResultSummary;
        $[385] = gameMode;
        $[386] = handleTfAnswer;
        $[387] = handleTfNext;
        $[388] = resetTf;
        $[389] = t;
        $[390] = tfCards;
        $[391] = tfDone;
        $[392] = tfFlipped;
        $[393] = tfIndex;
        $[394] = tfResultItems;
        $[395] = tfScore;
        $[396] = t23;
    } else {
        t23 = $[396];
    }
    let t24;
    if ($[397] !== ResultSummary || $[398] !== fillAnswers || $[399] !== fillChecked || $[400] !== fillQuestions || $[401] !== fillResultItems || $[402] !== fillScore || $[403] !== gameMode || $[404] !== t) {
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2306,
                        columnNumber: 26
                    }, this),
                    fillQuestions.map({
                        "Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map()]": (q_4, qi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2313,
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2317,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: fillAnswers[q_4.id] || "",
                                        onChange: {
                                            "Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange]": (e_1)=>setFillAnswers({
                                                    "Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange > setFillAnswers()]": (p_0)=>({
                                                            ...p_0,
                                                            [q_4.id]: e_1.target.value
                                                        })
                                                }["Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange > setFillAnswers()]"])
                                        }["Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map() > <input>.onChange]"],
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
                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                        lineNumber: 2321,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, q_4.id, true, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                                lineNumber: 2311,
                                columnNumber: 74
                            }, this)
                    }["Lesson5_HeBPTBacNhatHaiAn[fillQuestions.map()]"]),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]": ()=>setFillChecked(true)
                        }["Lesson5_HeBPTBacNhatHaiAn[<button>.onClick]"],
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
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                        lineNumber: 2339,
                        columnNumber: 62
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultSummary, {
                items: fillResultItems,
                onReset: {
                    "Lesson5_HeBPTBacNhatHaiAn[<ResultSummary>.onReset]": ()=>{
                        setFillAnswers({});
                        setFillChecked(false);
                    }
                }["Lesson5_HeBPTBacNhatHaiAn[<ResultSummary>.onReset]"],
                scoreLabel: fillScore === fillQuestions.length ? t("Xu\u1EA5t s\u1EAFc! \uD83C\uDF89", "Perfect! \uD83C\uDF89") : fillScore >= 2 ? t("T\u1ED1t l\u1EAFm! \uD83D\uDC4D", "Well done! \uD83D\uDC4D") : t("C\u1ED1 g\u1EAFng th\xEAm! \uD83D\uDCAA", "Keep going! \uD83D\uDCAA")
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2350,
                columnNumber: 64
            }, this)
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2301,
            columnNumber: 34
        }, this);
        $[397] = ResultSummary;
        $[398] = fillAnswers;
        $[399] = fillChecked;
        $[400] = fillQuestions;
        $[401] = fillResultItems;
        $[402] = fillScore;
        $[403] = gameMode;
        $[404] = t;
        $[405] = t24;
    } else {
        t24 = $[405];
    }
    let t25;
    if ($[406] !== t10 || $[407] !== t11 || $[408] !== t23 || $[409] !== t24 || $[410] !== t7 || $[411] !== t8 || $[412] !== t9) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2370,
            columnNumber: 11
        }, this);
        $[406] = t10;
        $[407] = t11;
        $[408] = t23;
        $[409] = t24;
        $[410] = t7;
        $[411] = t8;
        $[412] = t9;
        $[413] = t25;
    } else {
        t25 = $[413];
    }
    let t26;
    if ($[414] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
            style: {
                width: "5px"
            }
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2384,
            columnNumber: 11
        }, this);
        $[414] = t26;
    } else {
        t26 = $[414];
    }
    let t27;
    if ($[415] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = {
            textAlign: "center",
            color: "#777",
            fontSize: 15,
            marginBottom: 60
        };
        $[415] = t27;
    } else {
        t27 = $[415];
    }
    let t28;
    if ($[416] !== t) {
        t28 = t("B\xE0i 5 / Ch\u01B0\u01A1ng II", "Lesson 5 / Chapter II");
        $[416] = t;
        $[417] = t28;
    } else {
        t28 = $[417];
    }
    let t29;
    if ($[418] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "reveal",
            "data-reveal": true,
            style: t27,
            children: [
                "Toán 10 · Chân Trời Sáng Tạo · ",
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2413,
            columnNumber: 11
        }, this);
        $[418] = t28;
        $[419] = t29;
    } else {
        t29 = $[419];
    }
    let t30;
    let t31;
    if ($[420] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
            children: "\n          .reveal { opacity:0; transform:translateY(28px) scale(0.97); transition:opacity 0.55s cubic-bezier(.2,.8,.2,1),transform 0.45s cubic-bezier(.2,.8,.2,1); will-change:opacity,transform; }\n          .reveal.visible { opacity:1; transform:translateY(0) scale(1); }\n          .reveal[data-reveal-stagger].visible { opacity:1; transform:none; }\n          .reveal[data-reveal-stagger] > * { opacity:0; transform:translateY(24px) scale(0.97); will-change:opacity,transform; }\n          header.reveal { transform:translateY(-18px); opacity:0; }\n          header.reveal.visible { opacity:1; transform:translateY(0); }\n          article { transition:transform 0.25s cubic-bezier(.2,.8,.2,1),box-shadow 0.25s ease; border-radius:10px; padding:8px; }\n          article:hover { transform:translateY(-6px) scale(1.01); box-shadow:0 12px 28px rgba(0,0,0,0.12); }\n        "
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2422,
            columnNumber: 11
        }, this);
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$DuoMCB$2f$DuoTranslate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2423,
            columnNumber: 11
        }, this);
        $[420] = t30;
        $[421] = t31;
    } else {
        t30 = $[420];
        t31 = $[421];
    }
    let t32;
    if ($[422] !== t12 || $[423] !== t13 || $[424] !== t14 || $[425] !== t15 || $[426] !== t16 || $[427] !== t17 || $[428] !== t18 || $[429] !== t19 || $[430] !== t20 || $[431] !== t21 || $[432] !== t25 || $[433] !== t29) {
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
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2432,
            columnNumber: 11
        }, this);
        $[422] = t12;
        $[423] = t13;
        $[424] = t14;
        $[425] = t15;
        $[426] = t16;
        $[427] = t17;
        $[428] = t18;
        $[429] = t19;
        $[430] = t20;
        $[431] = t21;
        $[432] = t25;
        $[433] = t29;
        $[434] = t32;
    } else {
        t32 = $[434];
    }
    let t33;
    if ($[435] !== t22 || $[436] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t22,
            children: t32
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
            lineNumber: 2451,
            columnNumber: 11
        }, this);
        $[435] = t22;
        $[436] = t32;
        $[437] = t33;
    } else {
        t33 = $[437];
    }
    return t33;
}
_s(Lesson5_HeBPTBacNhatHaiAn, "o9ln2GYkrW8yJye2B9T4lwZLUUE=");
_c1 = Lesson5_HeBPTBacNhatHaiAn;
function _Lesson5_HeBPTBacNhatHaiAnAnonymousA_0Map(line, i_10) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 15,
            color: "#555",
            marginBottom: 6
        },
        children: line
    }, i_10, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
        lineNumber: 2461,
        columnNumber: 10
    }, this);
}
function _Lesson5_HeBPTBacNhatHaiAnAnonymous3(s_1, i_9) {
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2472,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 15,
                    color: "#555",
                    lineHeight: 1.7,
                    paddingTop: 4
                },
                children: s_1.text
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2484,
                columnNumber: 24
            }, this)
        ]
    }, i_9, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
        lineNumber: 2468,
        columnNumber: 10
    }, this);
}
function _Lesson5_HeBPTBacNhatHaiAnAnonymous2(card, i_8) {
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
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#0B4F5C",
                    marginBottom: 8
                },
                children: card.icon
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2497,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 17,
                    fontWeight: 600,
                    marginBottom: 8
                },
                children: card.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2502,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 14,
                    color: "#777"
                },
                children: card.desc
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2506,
                columnNumber: 26
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10,
                    padding: "4px 10px",
                    background: card.color,
                    color: card.text,
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 20,
                    display: "inline-block"
                },
                children: card.title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2509,
                columnNumber: 25
            }, this)
        ]
    }, i_8, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
        lineNumber: 2492,
        columnNumber: 10
    }, this);
}
function _Lesson5_HeBPTBacNhatHaiAnTabsMapButtonOnMouseLeave(e_0) {
    e_0.currentTarget.style.background = "#f9f9f9";
    e_0.currentTarget.style.color = "black";
}
function _Lesson5_HeBPTBacNhatHaiAnTabsMapButtonOnMouseEnter(e) {
    e.currentTarget.style.background = "black";
    e.currentTarget.style.color = "white";
}
function _Lesson5_HeBPTBacNhatHaiAnAnonymous(obj, i_7) {
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
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
        lineNumber: 2529,
        columnNumber: 10
    }, this);
}
function _Lesson5_HeBPTBacNhatHaiAnResultSummaryItemsFilter3(i_6) {
    return i_6.correct;
}
function _Lesson5_HeBPTBacNhatHaiAnResultSummaryItemsFilter2(i_4) {
    return i_4.correct;
}
function _Lesson5_HeBPTBacNhatHaiAnResultSummaryItemsFilter(i_5) {
    return i_5.correct;
}
function _Lesson5_HeBPTBacNhatHaiAnSectionHeader(t0) {
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
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2559,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: title
            }, void 0, false, {
                fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
                lineNumber: 2559,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/Lesson5_HeBPTBacNhatHaiAn.js",
        lineNumber: 2549,
        columnNumber: 10
    }, this);
}
function _Lesson5_HeBPTBacNhatHaiAnCheckFillAnonymous(a) {
    return a.toLowerCase().replace(/\s/g, "");
}
function _Lesson5_HeBPTBacNhatHaiAnHandleTfNextSetTfIndex(i_3) {
    return i_3 + 1;
}
function _Lesson5_HeBPTBacNhatHaiAnHandleTfAnswerSetTfScore(s_0) {
    return s_0 + 1;
}
function _Lesson5_HeBPTBacNhatHaiAnHandleMcNextSetMcIndex(i_2) {
    return i_2 + 1;
}
function _Lesson5_HeBPTBacNhatHaiAnHandleMcSelectSetMcScore(s) {
    return s + 1;
}
function _Lesson5_HeBPTBacNhatHaiAnScrollTo(id_0) {
    const el_2 = document.getElementById(id_0);
    if (el_2) {
        el_2.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
function _Lesson5_HeBPTBacNhatHaiAnUseEffect() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach(_Lesson5_HeBPTBacNhatHaiAnUseEffectElsForEach);
    const obs = new IntersectionObserver(_temp, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });
    els.forEach({
        "Lesson5_HeBPTBacNhatHaiAn[useEffect() > els.forEach()]": (el_1)=>obs.observe(el_1)
    }["Lesson5_HeBPTBacNhatHaiAn[useEffect() > els.forEach()]"]);
    return ()=>obs.disconnect();
}
function _temp(entries, observer) {
    entries.forEach({
        "Lesson5_HeBPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach()]": (entry)=>{
            if (entry.isIntersecting) {
                const el_0 = entry.target;
                if (el_0.hasAttribute("data-reveal-stagger")) {
                    const stagger_0 = parseInt(el_0.getAttribute("data-stagger") || "80", 10);
                    Array.from(el_0.children).forEach({
                        "Lesson5_HeBPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]": (child_0, i_0)=>{
                            setTimeout({
                                "Lesson5_HeBPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]": ()=>{
                                    child_0.style.opacity = "1";
                                    child_0.style.transform = "translateY(0) scale(1)";
                                }
                            }["Lesson5_HeBPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)() > setTimeout()]"], i_0 * stagger_0);
                        }
                    }["Lesson5_HeBPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach() > (anonymous)()]"]);
                }
                el_0.classList.add("visible");
                observer.unobserve(el_0);
            }
        }
    }["Lesson5_HeBPTBacNhatHaiAn[useEffect() > <anonymous> > entries.forEach()]"]);
}
function _Lesson5_HeBPTBacNhatHaiAnUseEffectElsForEach(el) {
    if (el.hasAttribute("data-reveal-stagger")) {
        const stagger = parseInt(el.getAttribute("data-stagger") || "80", 10);
        Array.from(el.children).forEach({
            "Lesson5_HeBPTBacNhatHaiAn[useEffect() > els.forEach() > (anonymous)()]": (child, i)=>{
                child.style.opacity = "0";
                child.style.transform = "translateY(24px) scale(0.97)";
                child.style.transition = `opacity 0.5s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms, transform 0.45s cubic-bezier(.2,.8,.2,1) ${i * stagger}ms`;
                child.style.willChange = "opacity, transform";
            }
        }["Lesson5_HeBPTBacNhatHaiAn[useEffect() > els.forEach() > (anonymous)()]"]);
    }
}
var _c, _c1;
__turbopack_context__.k.register(_c, "SectionHeader");
__turbopack_context__.k.register(_c1, "Lesson5_HeBPTBacNhatHaiAn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=duosteam_src_components_fae23c87._.js.map