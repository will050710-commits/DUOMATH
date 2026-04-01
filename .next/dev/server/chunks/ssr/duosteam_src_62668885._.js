module.exports = [
"[project]/duosteam/src/utils/testTimer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTestSession",
    ()=>clearTestSession,
    "formatTime",
    ()=>formatTime,
    "getRemainingTime",
    ()=>getRemainingTime,
    "getTimeSpent",
    ()=>getTimeSpent,
    "resetTimer",
    ()=>resetTimer,
    "startTimer",
    ()=>startTimer
]);
function startTimer(testKey, minutes = 60) {
    const startKey = `start-${testKey}`;
    const endKey = `end-${testKey}`;
    if (!localStorage.getItem(endKey)) {
        const start = Date.now();
        const end = start + minutes * 60 * 1000;
        localStorage.setItem(startKey, start);
        localStorage.setItem(endKey, end);
    }
}
function getRemainingTime(testKey) {
    const end = localStorage.getItem(`end-${testKey}`);
    if (!end) return 0;
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
}
function getTimeSpent(testKey) {
    const start = localStorage.getItem(`start-${testKey}`);
    if (!start) return 0;
    return Math.floor((Date.now() - start) / 1000);
}
function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}
function resetTimer(testKey) {
    localStorage.removeItem(`start-${testKey}`);
    localStorage.removeItem(`end-${testKey}`);
}
function clearTestSession(testKey) {
    localStorage.removeItem(`start-${testKey}`);
    localStorage.removeItem(`end-${testKey}`);
    localStorage.removeItem(`${testKey}_section1`);
    localStorage.removeItem(`${testKey}_section2`);
    localStorage.removeItem(`${testKey}_section3`);
    // backward compatibility keys used by older pages
    localStorage.removeItem("readingTest_section1");
    localStorage.removeItem("readingTest_section2");
    localStorage.removeItem("readingTest_section3");
    localStorage.removeItem("readingTest_result");
    localStorage.removeItem("timeSpent");
    localStorage.removeItem("lastTimeSpent");
}
}),
"[project]/duosteam/src/utils/answerStorage.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllAnswers",
    ()=>clearAllAnswers,
    "loadAnswers",
    ()=>loadAnswers,
    "saveAnswer",
    ()=>saveAnswer
]);
function loadAnswers(sectionKey) {
    return JSON.parse(localStorage.getItem(sectionKey) || "{}");
}
function saveAnswer(sectionKey, key, value) {
    const current = loadAnswers(sectionKey);
    const updated = {
        ...current,
        [key]: value
    };
    localStorage.setItem(sectionKey, JSON.stringify(updated));
}
function clearAllAnswers(testId) {
    const exam = testId || localStorage.getItem("currentTest") || "reading-test-1";
    localStorage.removeItem(`${exam}_section1`);
    localStorage.removeItem(`${exam}_section2`);
    localStorage.removeItem(`${exam}_section3`);
    // backward-compat: also clear legacy keys used by older components
    localStorage.removeItem("readingTest_section1");
    localStorage.removeItem("readingTest_section2");
    localStorage.removeItem("readingTest_section3");
}
}),
"[project]/duosteam/src/utils/questionSkills.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Question-to-skill mapping and skill metadata for the DUOSTEAM reading test.
// This file is intentionally simple so you can tweak skills/questions easily.
// Map each question to the skills it exercises.
// Keys must match the keys used in ANSWER_KEY for each section.
__turbopack_context__.s([
    "QUESTION_SKILLS",
    ()=>QUESTION_SKILLS,
    "SKILL_DEFS",
    ()=>SKILL_DEFS
]);
const QUESTION_SKILLS = {
    section1: {
        // TRUE/FALSE/NOT GIVEN – basic factual comprehension
        1: [
            "reading_detail_true_false"
        ],
        2: [
            "reading_inference",
            "reading_true_false_ng"
        ],
        3: [
            "reading_inference",
            "reading_true_false_ng"
        ],
        4: [
            "reading_detail_true_false"
        ],
        5: [
            "reading_cause_effect"
        ]
    },
    section2: {
        // Another T/F/NG set – slightly higher-level reasoning
        1: [
            "reading_detail_true_false"
        ],
        2: [
            "reading_inference"
        ],
        3: [
            "reading_inference",
            "reading_true_false_ng"
        ],
        4: [
            "reading_cause_effect"
        ],
        5: [
            "reading_overall_reasoning"
        ]
    },
    section3: {
        // Short-answer / numeric questions – here we use more general labels
        "1-0": [
            "reading_detail_scanning"
        ],
        "1-1": [
            "reading_detail_scanning"
        ],
        "2-0": [
            "reading_detail_scanning"
        ],
        "2-1": [
            "reading_inference"
        ],
        "3-0": [
            "reading_detail_scanning"
        ],
        "3-1": [
            "reading_inference"
        ],
        "4-0": [
            "reading_cause_effect"
        ],
        "4-1": [
            "reading_cause_effect"
        ],
        "5-0": [
            "reading_overall_reasoning"
        ]
    }
};
const SKILL_DEFS = {
    reading_detail_true_false: {
        id: "reading_detail_true_false",
        name: "Đọc chi tiết – TRUE/FALSE",
        topic: "Reading comprehension",
        description: "Xác định xem một thông tin chi tiết trong đoạn văn là đúng, sai hay không được đề cập."
    },
    reading_true_false_ng: {
        id: "reading_true_false_ng",
        name: "TRUE/FALSE/NOT GIVEN",
        topic: "Reading comprehension",
        description: "Phân biệt giữa thông tin trái ngược, phù hợp với bài đọc hoặc không được nhắc tới."
    },
    reading_inference: {
        id: "reading_inference",
        name: "Suy luận từ ngữ cảnh",
        topic: "Reading comprehension",
        description: "Suy ra ý ẩn sau thông tin được nêu, không chỉ dựa trên các câu chữ bề mặt."
    },
    reading_cause_effect: {
        id: "reading_cause_effect",
        name: "Nguyên nhân – Kết quả",
        topic: "Reading comprehension",
        description: "Nhận diện quan hệ nguyên nhân – kết quả giữa các sự kiện trong đoạn văn."
    },
    reading_overall_reasoning: {
        id: "reading_overall_reasoning",
        name: "Lập luận tổng thể",
        topic: "Reading comprehension",
        description: "Hiểu được mạch lập luận chung, mục tiêu và thông điệp chính của văn bản."
    },
    reading_detail_scanning: {
        id: "reading_detail_scanning",
        name: "Quét thông tin (Scanning)",
        topic: "Reading comprehension",
        description: "Tìm nhanh số liệu, tên riêng hoặc chi tiết cụ thể trong một đoạn văn dài."
    }
};
}),
"[project]/duosteam/src/components/result/pageketqua.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PageKetQua
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/testTimer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$answerStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/answerStorage.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$questionSkills$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/questionSkills.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function PageKetQua() {
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [timeSpent, setTimeSpent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("00:00:00");
    const [animatedScore, setAnimatedScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [reviewMode, setReviewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [examId, setExamId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "reading-test-1");
    const [feedback, setFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoadingFeedback, setIsLoadingFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [feedbackError, setFeedbackError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // ================= LOAD RESULT =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const data = localStorage.getItem("readingTest_result");
        if (data) {
            const parsed = JSON.parse(data);
            setResult(parsed);
            const exam = parsed.testId || localStorage.getItem("currentTest") || "reading-test-1";
            setExamId(exam);
            const savedTime = parsed.timeSpent ?? (Number(localStorage.getItem("timeSpent")) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTimeSpent"])(exam));
            if (!Number.isNaN(Number(savedTime))) setTimeSpent((0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(Number(savedTime)));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetTimer"])(exam);
        }
    }, []);
    // ================= SCORE ANIMATION =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!result) return;
        let start = 0;
        const end = result.score || 0;
        const duration = 800;
        const stepTime = 20;
        const increment = end / (duration / stepTime);
        const timer = setInterval(()=>{
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setAnimatedScore(start.toFixed(1));
        }, stepTime);
        return ()=>clearInterval(timer);
    }, [
        result
    ]);
    // ================= AI FEEDBACK =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchFeedback = async ()=>{
            if (!result) return;
            try {
                setIsLoadingFeedback(true);
                setFeedbackError("");
                const res = await fetch("/api/learning-feedback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        result
                    })
                });
                if (!res.ok) {
                    setFeedbackError("Không thể tạo gợi ý ôn tập tự động.");
                    return;
                }
                const data = await res.json();
                setFeedback(data.feedback || "");
            } catch (err) {
                setFeedbackError("Đã xảy ra lỗi khi gọi AI feedback.");
            } finally{
                setIsLoadingFeedback(false);
            }
        };
        fetchFeedback();
    }, [
        result
    ]);
    // ================= AUTO SCROLL FIRST WRONG =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!result) return;
        const firstWrongIndex = result.questions?.findIndex((q)=>!q.isCorrect && !q.isSkipped);
        if (firstWrongIndex >= 0) {
            setTimeout(()=>{
                document.getElementById(`question-${firstWrongIndex}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 600);
        }
    }, [
        result,
        reviewMode
    ]);
    if (!result) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                color: "#0B4F5C",
                fontSize: 18,
                fontWeight: 600
            },
            children: "Đang tải kết quả..."
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
            lineNumber: 90,
            columnNumber: 7
        }, this);
    }
    const { correct = 0, wrong = 0, skipped = 0, total = 0, accuracy = 0, skills = [], weakSkills = [], questions = [] } = result;
    const getAnswerBorderColor = (q)=>{
        if (q.isSkipped) return "#f0a500";
        if (q.isCorrect) return "#22a55a";
        return "#e53e3e";
    };
    const getAnswerBg = (q)=>{
        if (q.isSkipped) return "#fffbea";
        if (q.isCorrect) return "#f0faf5";
        return "#fff5f5";
    };
    const startNewTest = ()=>{
        const exam = examId || localStorage.getItem("currentTest") || "reading-test-1";
        localStorage.removeItem("readingTest_result");
        localStorage.removeItem("timeSpent");
        localStorage.removeItem("lastTimeSpent");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$answerStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllAnswers"])(exam);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetTimer"])(exam);
        window.location.href = "/";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: "100%",
            background: "#ffffff",
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: "1200px",
                maxWidth: "95%",
                color: "black",
                paddingTop: 60,
                paddingBottom: 80
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#0B4F5C",
                        marginBottom: 8,
                        letterSpacing: 1,
                        textAlign: "center"
                    },
                    children: "Kết quả bài làm"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 124,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "#777",
                        fontSize: 16,
                        marginBottom: 40,
                        textAlign: "center"
                    },
                    children: "Xem lại kết quả và gợi ý học tập của bạn bên dưới."
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#f9f9f9",
                        borderRadius: 16,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "40px 48px",
                        textAlign: "center",
                        marginBottom: 40
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 16,
                                color: "#777",
                                marginBottom: 8
                            },
                            children: "Điểm số của bạn"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 72,
                                fontWeight: "bold",
                                color: "#0B4F5C",
                                lineHeight: 1
                            },
                            children: animatedScore
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 16,
                                color: "#555",
                                fontSize: 16
                            },
                            children: [
                                "⏱ Thời gian: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: timeSpent
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 143,
                                    columnNumber: 26
                                }, this),
                                "  |  🎯 Độ chính xác: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        accuracy,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 143,
                                    columnNumber: 86
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 132,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 24,
                        marginBottom: 40
                    },
                    children: [
                        {
                            label: "✅ Đúng",
                            value: correct,
                            color: "#22a55a",
                            bg: "#f0faf5"
                        },
                        {
                            label: "❌ Sai",
                            value: wrong,
                            color: "#e53e3e",
                            bg: "#fff5f5"
                        },
                        {
                            label: "⏭ Bỏ qua",
                            value: skipped,
                            color: "#888",
                            bg: "#f9f9f9"
                        }
                    ].map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: stat.bg,
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                padding: "28px 24px",
                                textAlign: "center"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 15,
                                        color: "#555",
                                        marginBottom: 8
                                    },
                                    children: stat.label
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 44,
                                        fontWeight: "bold",
                                        color: stat.color
                                    },
                                    children: stat.value
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 14,
                                        color: "#999",
                                        marginTop: 4
                                    },
                                    children: [
                                        "/ ",
                                        total,
                                        " câu"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, stat.label, true, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 154,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 148,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: "center",
                        marginBottom: 32
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setReviewMode(!reviewMode),
                        style: {
                            background: reviewMode ? "#f9f9f9" : "#0B4F5C",
                            color: reviewMode ? "#0B4F5C" : "white",
                            border: "2px solid #0B4F5C",
                            borderRadius: 10,
                            padding: "12px 36px",
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.opacity = "0.85";
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.opacity = "1";
                        },
                        children: reviewMode ? "Ẩn đáp án" : "Xem chi tiết bài làm"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                reviewMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        marginBottom: 40
                    },
                    children: questions.map((q, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: `question-${i}`,
                            style: {
                                borderLeft: `4px solid ${getAnswerBorderColor(q)}`,
                                background: getAnswerBg(q),
                                borderRadius: 10,
                                padding: "16px 20px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 6
                                    },
                                    children: [
                                        "Câu ",
                                        i + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 205,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#555",
                                        marginBottom: 4
                                    },
                                    children: [
                                        "Trả lời: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: q.userAnswer || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                            lineNumber: 206,
                                            columnNumber: 72
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 206,
                                    columnNumber: 17
                                }, this),
                                !q.isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#e53e3e"
                                    },
                                    children: [
                                        "Đáp án đúng: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: q.correctAnswer
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                            lineNumber: 208,
                                            columnNumber: 64
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 208,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 194,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 192,
                    columnNumber: 11
                }, this),
                weakSkills.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#fff5f5",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        padding: 28,
                        marginBottom: 32,
                        borderLeft: "4px solid #e53e3e"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontWeight: "bold",
                                color: "#c00",
                                marginBottom: 16,
                                fontSize: 17
                            },
                            children: "🔴 Kỹ năng cần cải thiện"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 225,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: 10
                            },
                            children: weakSkills.map((skill)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "10px 16px",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontWeight: 600,
                                                color: "#333"
                                            },
                                            children: skill.name
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#e53e3e",
                                                fontWeight: 700
                                            },
                                            children: [
                                                skill.accuracy,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                            lineNumber: 232,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, skill.id, true, {
                                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                    lineNumber: 230,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 217,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#f9f9f9",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        padding: 28,
                        marginBottom: 48
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontWeight: "bold",
                                color: "#0B4F5C",
                                fontSize: 17,
                                marginBottom: 16
                            },
                            children: "🤖 Gợi ý học tập từ AI"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 247,
                            columnNumber: 11
                        }, this),
                        isLoadingFeedback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: "#777",
                                fontStyle: "italic"
                            },
                            children: "Đang tạo nhận xét..."
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 251,
                            columnNumber: 13
                        }, this),
                        feedbackError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: "#e53e3e"
                            },
                            children: feedbackError
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 254,
                            columnNumber: 13
                        }, this),
                        !isLoadingFeedback && !feedbackError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                whiteSpace: "pre-wrap",
                                fontSize: 15,
                                color: "#444",
                                lineHeight: 1.8
                            },
                            children: feedback || "Chưa có phản hồi."
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 257,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 240,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        justifyContent: "center",
                        gap: 20
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/xem-dap-an",
                            style: {
                                textDecoration: "none"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: {
                                    background: "#0B4F5C",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 10,
                                    padding: "16px 40px",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    transition: "opacity 0.2s ease"
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.opacity = "0.85",
                                onMouseLeave: (e)=>e.currentTarget.style.opacity = "1",
                                children: "Xem đáp án"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: startNewTest,
                            style: {
                                background: "#f9f9f9",
                                color: "#0B4F5C",
                                border: "2px solid #0B4F5C",
                                borderRadius: 10,
                                padding: "16px 40px",
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                transition: "all 0.2s ease"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = "#0B4F5C";
                                e.currentTarget.style.color = "white";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = "#f9f9f9";
                                e.currentTarget.style.color = "#0B4F5C";
                            },
                            children: "Làm bài mới"
                        }, void 0, false, {
                            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/result/pageketqua.js",
                    lineNumber: 264,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/result/pageketqua.js",
            lineNumber: 121,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/duosteam/src/components/result/pageketqua.js",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=duosteam_src_62668885._.js.map