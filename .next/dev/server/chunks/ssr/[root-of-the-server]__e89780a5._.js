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
"[project]/duosteam/src/components/bailam/section3-page2-L10.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
/* eslint-disable react-hooks/exhaustive-deps */ "use client";
;
;
;
;
;
;
const LEGACY_KEY = "readingTest_section3";
const SECTION = "section3";
const TEST_KEY = "reading-test-2";
const mathProblems = [
    {
        id: 1,
        source: "Grade 10 — Semester II Exam, Gia Dinh High School, Ho Chi Minh City, 2023–2024",
        label: "Problem 1",
        parts: [
            "a) Solve the inequality: x² − x − 6 > 0.",
            "b) Find the set of values of m for which the equation x² − 2mx + (m² − 1) = 0 has two distinct real roots."
        ],
        fields: [
            "Answer (a):",
            "Answer (b):"
        ]
    },
    {
        id: 2,
        source: "Grade 10 — Semester II Exam, Nguyen Thi Minh Khai High School, 2023–2024",
        label: "Problem 2",
        parts: [
            "a) How many 5-digit natural numbers can be formed from the digits {1, 2, 3, 4, 5} if each digit is used at most once and the number is even?",
            "b) In the expansion of (1 + x)ⁿ, the coefficient of x² is 45. Find n."
        ],
        fields: [
            "Answer (a):",
            "Answer (b):"
        ]
    },
    {
        id: 3,
        source: "Grade 10 — End-of-Year Exam, Bui Thi Xuan High School, 2022–2023",
        label: "Problem 3",
        parts: [
            "A bag contains 4 red balls, 3 blue balls, and 2 green balls. One ball is drawn at random.",
            "a) What is the probability that the ball drawn is red?",
            "b) What is the probability that the ball drawn is NOT green?"
        ],
        fields: [
            "Answer (a) — P(red):",
            "Answer (b) — P(not green):"
        ]
    },
    {
        id: 4,
        source: "Grade 10 — Semester II Exam, Phan Chau Trinh High School, Da Nang, 2023–2024",
        label: "Problem 4",
        parts: [
            "In the coordinate plane Oxy, given points A(1, 3) and B(5, −1).",
            "a) Find the coordinates of the midpoint M of segment AB and the length |AB|.",
            "b) Write the equation of the perpendicular bisector of AB."
        ],
        fields: [
            "Answer (a) — M and |AB|:",
            "Answer (b) — perpendicular bisector:"
        ]
    },
    {
        id: 5,
        source: "Grade 10 — End-of-Year Exam, Quoc Hoc Hue High School, 2023–2024",
        label: "Problem 5",
        parts: [
            "Given triangle ABC with A(0, 4), B(−3, 0), C(3, 0).",
            "a) Show that triangle ABC is isosceles.",
            "b) Find the equation of the circle passing through all three vertices of triangle ABC."
        ],
        fields: [
            "Answer (a):",
            "Answer (b) — circle equation:"
        ]
    }
];
function Page() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem("currentTest", TEST_KEY);
        const exam = localStorage.getItem("currentTest") || TEST_KEY;
        const timerExists = localStorage.getItem(`end-${TEST_KEY}`);
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
        const exam = localStorage.getItem("currentTest") || TEST_KEY;
        localStorage.setItem(`${exam}_${SECTION}`, JSON.stringify(updated));
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
                                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "#555",
                                    fontSize: 14,
                                    marginTop: 2
                                },
                                children: "Bilingual Math Test 2 — Section 3: Short-Answer Math (Grade 10)"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 119,
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
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                lineNumber: 118,
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
                                                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                                lineNumber: 134,
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
                                                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                                lineNumber: 135,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                        lineNumber: 133,
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
                                            fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, prob.id, true, {
                                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 130,
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
                                    fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                    lineNumber: 147,
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
                                                    fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                                    lineNumber: 151,
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
                                                            fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                                            lineNumber: 156,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                                    lineNumber: 152,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, prob.id, true, {
                                            fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                lineNumber: 127,
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
                        href: "/section1-L10-2",
                        label: "SECTION 1"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "/section2-L10-2",
                        label: "SECTION 2"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "/section3-L10-2",
                        label: "SECTION 3",
                        active: true
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 175,
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
                        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
        lineNumber: 115,
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
            fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
            lineNumber: 188,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/duosteam/src/components/bailam/section3-page2-L10.js",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e89780a5._.js.map