module.exports = [
"[project]/duosteam/src/utils/testTimer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
}),
"[project]/duosteam/src/utils/answerKey.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANSWER_KEY",
    ()=>ANSWER_KEY
]);
const ANSWER_KEY = {
    "reading-test-1": {
        section1: {
            0: "TRUE",
            1: "FALSE",
            2: "NOT GIVEN",
            3: "TRUE",
            4: "FALSE"
        },
        section2: {
            0: "TRUE",
            1: "FALSE",
            2: "NOT GIVEN",
            3: "TRUE",
            4: "FALSE"
        },
        section3: {
            "1-0": "[-5/3,1]",
            "1-1": "4",
            "2-0": "24",
            "2-1": "24",
            "3-0": "1/9",
            "3-1": "(3,-2) and 2",
            "4-0": "5x+12y+35=0 or 5x+12y−17=0",
            "4-1": "x^2/181 + y^2/81 = 1",
            "5-0": "2√(2) + 27√(5)"
        }
    },
    // ===========================
    // ✅ NEW TEST 2 ANSWERS
    // ===========================
    "reading-test-2": {
        section1: {
            0: "FALSE",
            1: "NOT GIVEN",
            2: "FALSE",
            3: "TRUE",
            4: "TRUE"
        },
        section2: {
            0: "FALSE",
            1: "FALSE",
            2: "TRUE",
            3: "TRUE",
            4: "TRUE"
        },
        section3: {
            "1-0": "ANSWER_A",
            "1-1": "ANSWER_B",
            "2-0": "ANSWER_C",
            "2-1": "ANSWER_D",
            "3-0": "ANSWER_E",
            "3-1": "ANSWER_F",
            "4-0": "ANSWER_G",
            "4-1": "ANSWER_H",
            "5-0": "ANSWER_I"
        }
    }
};
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
"[project]/duosteam/src/utils/scoring.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeScoreAndMastery",
    ()=>computeScoreAndMastery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$answerKey$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/answerKey.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$questionSkills$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/questionSkills.js [app-ssr] (ecmascript)");
;
;
function computeScoreAndMastery(answersBySection = {}) {
    let total = 0;
    let correct = 0;
    let skipped = 0;
    /** @type {Array<{
   *  section: string;
   *  key: string;
   *  correctAnswer: string;
   *  userAnswer: string | null;
   *  isCorrect: boolean;
   *  isSkipped: boolean;
   *  skills: string[];
   * }>} */ const questions = [];
    /** @type {Record<string, {
   *   id: string;
   *   name: string;
   *   topic: string | null;
   *   description: string;
   *   total: number;
   *   correct: number;
   *   wrong: number;
   *   skipped: number;
   * }>} */ const skillAgg = {};
    const examId = localStorage.getItem("currentTest") || "reading-test-1";
    const examKey = __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$answerKey$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANSWER_KEY"][examId];
    Object.keys(examKey).forEach((section)=>{
        const keySet = examKey[section];
        const answersForSection = answersBySection[section] || {};
        Object.keys(keySet).forEach((qKey)=>{
            total++;
            const correctAnswer = String(keySet[qKey] ?? "").trim();
            const rawUser = answersForSection[qKey];
            const userAnswer = rawUser === undefined || rawUser === null ? null : String(rawUser);
            const normalizedUser = (userAnswer || "").trim().toLowerCase();
            const normalizedCorrect = correctAnswer.trim().toLowerCase();
            const isSkipped = !normalizedUser;
            const isCorrect = !isSkipped && normalizedUser === normalizedCorrect;
            if (isSkipped) skipped++;
            else if (isCorrect) correct++;
            const skillsForQuestion = __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$questionSkills$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUESTION_SKILLS"][section] && __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$questionSkills$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUESTION_SKILLS"][section][qKey] || [];
            questions.push({
                section,
                key: qKey,
                correctAnswer,
                userAnswer,
                isCorrect,
                isSkipped,
                skills: skillsForQuestion
            });
            skillsForQuestion.forEach((skillId)=>{
                if (!skillAgg[skillId]) {
                    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$questionSkills$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKILL_DEFS"][skillId] || {};
                    skillAgg[skillId] = {
                        id: skillId,
                        name: meta.name || skillId,
                        topic: meta.topic || null,
                        description: meta.description || "",
                        total: 0,
                        correct: 0,
                        wrong: 0,
                        skipped: 0
                    };
                }
                const s = skillAgg[skillId];
                s.total += 1;
                if (isSkipped) s.skipped += 1;
                else if (isCorrect) s.correct += 1;
                else s.wrong += 1;
            });
        });
    });
    const wrong = total - correct - skipped;
    const accuracy = total ? Math.round(correct / total * 100) : 0;
    const skills = Object.values(skillAgg).map((s)=>{
        const acc = s.total ? Math.round(s.correct / s.total * 100) : 0;
        let level = "weak";
        if (acc >= 80) level = "strong";
        else if (acc >= 50) level = "medium";
        return {
            ...s,
            accuracy: acc,
            level
        };
    });
    const weakSkills = skills.filter((s)=>s.level === "weak").sort((a, b)=>a.accuracy - b.accuracy);
    const result = {
        correct,
        wrong,
        skipped,
        total,
        score: total ? Math.round(correct / total * 9) : 0,
        accuracy,
        questions,
        skills,
        weakSkills
    };
    return result;
}
}),
"[project]/duosteam/src/utils/grader.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "gradeTest",
    ()=>gradeTest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$scoring$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/scoring.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/testTimer.js [app-ssr] (ecmascript)");
;
;
function gradeTest() {
    const answersBySection = {};
    const testId = localStorage.getItem("currentTest") || "reading-test-1";
    [
        "section1",
        "section2",
        "section3"
    ].forEach((section)=>{
        const primaryKey = `${testId}_${section}`;
        const legacyKey = `readingTest_${section}`;
        const savedRaw = localStorage.getItem(primaryKey) || localStorage.getItem(legacyKey);
        answersBySection[section] = savedRaw ? JSON.parse(savedRaw) : {};
    });
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$scoring$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeScoreAndMastery"])(answersBySection);
    // Attach metadata so result page can determine which test this belongs to
    result.testId = testId;
    result.timeSpent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTimeSpent"])(testId);
    localStorage.setItem("timeSpent", String(result.timeSpent));
    localStorage.setItem("readingTest_result", JSON.stringify(result));
    return result;
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
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
"[project]/duosteam/src/app/ketqua/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PageKetQua
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$result$2f$pageketqua$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/components/result/pageketqua.js [app-ssr] (ecmascript)");
;
;
function PageKetQua() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$components$2f$result$2f$pageketqua$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/duosteam/src/app/ketqua/page.js",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[project]/duosteam/src/components/bailam/section3-page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/testTimer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$grader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/grader.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$app$2f$ketqua$2f$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/app/ketqua/page.js [app-ssr] (ecmascript)");
/* eslint-disable react-hooks/exhaustive-deps */ "use client";
;
;
;
;
;
;
;
const STORAGE_KEY = "mathTest1_section3";
const TEST_KEY = "math-bilingual-test-1";
const LEGACY_KEY = "readingTest_section3";
const SECTION = "section3";
const mathProblems = [
    {
        id: 1,
        source: "Grade 10 — Semester II Exam, Nguyen Hue High School, 2023–2024",
        label: "Problem 1",
        parts: [
            "a) Solve the quadratic inequality: 2x² − 7x + 3 ≤ 0.",
            "b) Find all values of m such that the quadratic trinomial f(x) = x² − 2(m+1)x + 4m is always positive for all x ∈ ℝ."
        ],
        fields: [
            "Answer (a):",
            "Answer (b):"
        ]
    },
    {
        id: 2,
        source: "Grade 10 — Semester II Exam, Chu Van An High School, 2023–2024",
        label: "Problem 2",
        parts: [
            "a) A class has 15 boys and 12 girls. In how many ways can a group of 4 students be selected that includes exactly 2 boys and 2 girls?",
            "b) Find the coefficient of x³ in the expansion of (2 + x)⁶ using the Binomial Theorem."
        ],
        fields: [
            "Answer (a):",
            "Answer (b):"
        ]
    },
    {
        id: 3,
        source: "Grade 10 — Final Exam, Le Hong Phong High School, 2022–2023",
        label: "Problem 3",
        parts: [
            "A fair six-sided die is rolled twice.",
            "a) Write the sample space Ω and find n(Ω).",
            "b) Let A be the event 'the sum of the two outcomes is at least 10'. Find P(A)."
        ],
        fields: [
            "Answer (a) — n(Ω):",
            "Answer (b) — P(A):"
        ]
    },
    {
        id: 4,
        source: "Grade 10 — Semester II Exam, Tran Phu High School, 2023–2024",
        label: "Problem 4",
        parts: [
            "In the coordinate plane Oxy, the circle (C) has equation: x² + y² − 4x + 6y − 3 = 0.",
            "a) Find the centre I and radius R of (C).",
            "b) Write the equation of the tangent line to (C) at the point M(5, 0)."
        ],
        fields: [
            "Answer (a) — I and R:",
            "Answer (b) — tangent equation:"
        ]
    },
    {
        id: 5,
        source: "Grade 10 — End-of-Year Exam, Hai Ba Trung High School, 2023–2024",
        label: "Problem 5",
        parts: [
            "Given the vectors →a = (3, −1) and →b = (−2, 4).",
            "a) Compute the dot product →a · →b and determine whether →a and →b are perpendicular.",
            "b) Find the coordinates of the vector →c = 2→a − →b and compute its magnitude |→c|."
        ],
        fields: [
            "Answer (a):",
            "Answer (b):"
        ]
    }
];
function Page() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timerExists = localStorage.getItem(`endTime_${TEST_KEY}`);
        if (timerExists) {
            const saved = localStorage.getItem(`${exam}_${SECTION}`) || localStorage.getItem(LEGACY_KEY);
            if (saved) setAnswers(JSON.parse(saved));
        } else {
            localStorage.removeItem(`${exam}_${SECTION}`);
            localStorage.removeItem(LEGACY_KEY);
        }
    }, []);
    const saveAnswer = (key, value)=>{
        const updated = {
            ...answers,
            [key]: value
        };
        setAnswers(updated);
        const exam1 = localStorage.getItem("currentTest") || TEST_KEY;
        localStorage.setItem(`${exam1}_${SECTION}`, JSON.stringify(updated));
        localStorage.setItem(LEGACY_KEY, JSON.stringify(updated));
    };
    const submitTest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const seconds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTimeSpent"])(TEST_KEY);
        localStorage.setItem("lastTimeSpent", seconds);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$grader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gradeTest"])();
        router.push("/ketqua");
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startTimer"])(TEST_KEY, 60);
        const interval = setInterval(()=>{
            const remain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRemainingTime"])(TEST_KEY);
            setTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(remain));
            if (remain <= 0) {
                clearInterval(interval);
                submitTest();
            }
        }, 1000);
        return ()=>clearInterval(interval);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "#f5f5f5"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    background: "#ffffff",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "16px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    color: "#0B4F5C",
                                    letterSpacing: 1
                                },
                                children: "DUOSTEAM"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "#555",
                                    fontSize: 14,
                                    marginTop: 2
                                },
                                children: "Bilingual Math Test 1 — Section 3: Short-Answer Math (Grade 10)"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#fff0f0",
                            border: "1px solid #ffcccc",
                            borderRadius: 8,
                            padding: "8px 20px",
                            fontWeight: 600,
                            fontSize: 18,
                            color: "#c00"
                        },
                        children: [
                            "⏱ ",
                            time
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flex: 1,
                    overflow: "hidden"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflowY: "auto",
                            padding: 28
                        },
                        children: mathProblems.map((prob)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    borderRadius: 12,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    padding: 28,
                                    marginBottom: 20
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            marginBottom: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    background: "#0B4F5C",
                                                    color: "white",
                                                    fontWeight: 700,
                                                    fontSize: 13,
                                                    padding: "3px 14px",
                                                    borderRadius: 20
                                                },
                                                children: prob.label
                                            }, void 0, false, {
                                                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 12,
                                                    color: "#999",
                                                    fontStyle: "italic"
                                                },
                                                children: [
                                                    "Source: ",
                                                    prob.source
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    prob.parts.map((p, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#333",
                                                lineHeight: 1.8,
                                                marginBottom: 6
                                            },
                                            children: p
                                        }, j, false, {
                                            fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                            lineNumber: 142,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, prob.id, true, {
                                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflowY: "auto",
                            padding: 28,
                            background: "#fafafa",
                            borderLeft: "1px solid #e8e8e8"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "#ffffff",
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                padding: 28
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: "#0B4F5C",
                                        marginBottom: 20
                                    },
                                    children: "Your Answers"
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 20
                                    },
                                    children: mathProblems.map((prob)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "#f9f9f9",
                                                borderRadius: 10,
                                                padding: "16px 20px",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontWeight: 700,
                                                        color: "#0B4F5C",
                                                        marginBottom: 12
                                                    },
                                                    children: prob.label
                                                }, void 0, false, {
                                                    fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                                    lineNumber: 154,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 10
                                                    },
                                                    children: prob.fields.map((placeholder, i)=>{
                                                        const key = `${prob.id}-${i}`;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: answers[key] || "",
                                                            onChange: (e)=>saveAnswer(key, e.target.value),
                                                            placeholder: placeholder,
                                                            style: {
                                                                width: "100%",
                                                                border: "1.5px solid #d0d0d0",
                                                                borderRadius: 8,
                                                                padding: "10px 14px",
                                                                fontSize: 15,
                                                                color: "black",
                                                                outline: "none",
                                                                background: "#fff",
                                                                boxSizing: "border-box"
                                                            },
                                                            onFocus: (e)=>e.target.style.borderColor = "#0B4F5C",
                                                            onBlur: (e)=>e.target.style.borderColor = "#d0d0d0"
                                                        }, i, false, {
                                                            fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                                            lineNumber: 159,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                                    lineNumber: 155,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, prob.id, true, {
                                            fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                            lineNumber: 153,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                style: {
                    background: "#ffffff",
                    borderTop: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 32px",
                    height: 72,
                    flexShrink: 0,
                    boxShadow: "0 -2px 8px rgba(0,0,0,0.05)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "section1-L10",
                        label: "SECTION 1"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "section2-L10",
                        label: "SECTION 2"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "section3-L10",
                        label: "SECTION 3",
                        active: true
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: submitTest,
                        style: {
                            background: "#c00",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 28px",
                            fontWeight: 600,
                            fontSize: 15,
                            cursor: "pointer"
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.background = "#a00",
                        onMouseLeave: (e)=>e.currentTarget.style.background = "#c00",
                        children: "Nộp bài"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
function NavCard({ href, label, active }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        style: {
            textDecoration: "none"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                border: `2px solid ${active ? "#0B4F5C" : "#d0d0d0"}`,
                borderRadius: 8,
                padding: "10px 24px",
                color: active ? "#fff" : "#333",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                background: active ? "#0B4F5C" : "#f9f9f9",
                transition: "all 0.2s ease"
            },
            onMouseEnter: (e)=>{
                if (!active) {
                    e.currentTarget.style.background = "#0B4F5C";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "#0B4F5C";
                }
            },
            onMouseLeave: (e)=>{
                if (!active) {
                    e.currentTarget.style.background = "#f9f9f9";
                    e.currentTarget.style.color = "#333";
                    e.currentTarget.style.borderColor = "#d0d0d0";
                }
            },
            children: label
        }, void 0, false, {
            fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
            lineNumber: 209,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/duosteam/src/components/bailam/section3-page.js",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a905846e._.js.map