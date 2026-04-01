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
"[project]/duosteam/src/components/bailam/pagebailam2-L10.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/src/utils/testTimer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/navigation.js [app-ssr] (ecmascript)");
/* eslint-disable react/no-unescaped-entities */ "use client";
;
;
;
;
;
const LEGACY_KEY = "readingTest_section1";
const SECTION = "section1";
const TEST_KEY = "reading-test-2";
const passage1Questions = [
    {
        id: "p1q1",
        text: "1. The main idea of the passage is that",
        options: [
            "A. solar energy is the only viable renewable alternative to fossil fuels",
            "B. the transition to renewable energy requires overcoming both technical and economic barriers",
            "C. wind power is more cost-effective than solar in all geographic contexts",
            "D. governments should privatise all energy infrastructure immediately"
        ],
        answer: "B"
    },
    {
        id: "p1q2",
        text: "2. According to paragraph 2, the 'intermittency problem' refers to",
        options: [
            "A. the difficulty of training engineers for the renewable sector",
            "B. the fact that renewable sources do not produce power continuously",
            "C. fluctuations in government subsidies for clean energy",
            "D. the irregular pace of technological development"
        ],
        answer: "B"
    },
    {
        id: "p1q3",
        text: "3. The word 'incumbent' in paragraph 3 most closely means",
        options: [
            "A. emerging",
            "B. costly",
            "C. currently dominant",
            "D. environmentally harmful"
        ],
        answer: "C"
    },
    {
        id: "p1q4",
        text: "4. The author's tone toward the energy transition can best be described as",
        options: [
            "A. pessimistic and dismissive",
            "B. cautiously optimistic",
            "C. enthusiastic and uncritical",
            "D. neutral and indifferent"
        ],
        answer: "B"
    },
    {
        id: "p1q5",
        text: "5. Which evidence from the passage best supports the claim that renewable energy is becoming economically competitive?",
        options: [
            "A. Several countries have committed to net-zero emissions targets",
            "B. The cost of solar panels has fallen by over 90% in the past decade",
            "C. Wind farms are being built offshore to capture stronger winds",
            "D. Battery technology improves steadily every year"
        ],
        answer: "B"
    }
];
const passage2Questions = [
    {
        id: "p2q1",
        text: "6. The passage primarily argues that",
        options: [
            "A. people always make economically rational decisions",
            "B. default options have little effect on individual behaviour",
            "C. subtle design choices can significantly influence human decision-making",
            "D. financial incentives are the most effective tool for behaviour change"
        ],
        answer: "C"
    },
    {
        id: "p2q2",
        text: "7. The term 'nudge' as used in the passage refers to",
        options: [
            "A. a financial penalty for poor choices",
            "B. a law mandating certain behaviours",
            "C. an environmental adjustment that guides behaviour without compulsion",
            "D. a type of advertising campaign"
        ],
        answer: "C"
    },
    {
        id: "p2q3",
        text: "8. The organ donation example is used in the passage to demonstrate",
        options: [
            "A. that citizens distrust government health agencies",
            "B. the power of opt-out defaults in increasing participation rates",
            "C. that medical education improves donation rates",
            "D. that laws are more effective than nudges"
        ],
        answer: "B"
    },
    {
        id: "p2q4",
        text: "9. According to the passage, a key criticism of nudge theory is that",
        options: [
            "A. it is too expensive to implement at scale",
            "B. it manipulates people without their full awareness or consent",
            "C. it only works in healthcare settings",
            "D. nudges have no measurable effect on behaviour"
        ],
        answer: "B"
    },
    {
        id: "p2q5",
        text: "10. Based on the passage, which scenario best exemplifies a 'nudge'?",
        options: [
            "A. A government imposes a tax on sugary drinks",
            "B. A school cafeteria places fruit at eye level and less healthy foods out of sight",
            "C. A city bans single-use plastic bags",
            "D. An employer deducts pension contributions automatically and penalises opt-outs"
        ],
        answer: "B"
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
        if (!timerExists) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTestSession"])(TEST_KEY);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startTimer"])(TEST_KEY, 60);
        }
        const saved = localStorage.getItem(`${exam}_${SECTION}`) || localStorage.getItem(LEGACY_KEY);
        if (saved) {
            setTimeout(()=>setAnswers(JSON.parse(saved)), 0);
        }
        const interval = setInterval(()=>{
            const remain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRemainingTime"])(TEST_KEY);
            setTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$src$2f$utils$2f$testTimer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(remain));
            if (remain <= 0) {
                clearInterval(interval);
                router.push("/ketqua");
            }
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
        router
    ]);
    const saveAnswer = (id, value)=>{
        const updated = {
            ...answers,
            [id]: value
        };
        setAnswers(updated);
        const exam = localStorage.getItem("currentTest") || TEST_KEY;
        localStorage.setItem(`${exam}_${SECTION}`, JSON.stringify(updated));
        localStorage.setItem(LEGACY_KEY, JSON.stringify(updated));
    };
    const allQuestions = [
        ...passage1Questions,
        ...passage2Questions
    ];
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
                                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "#555",
                                    fontSize: 14,
                                    marginTop: 2
                                },
                                children: "Bilingual Math Test 2 — Section 1: SAT Reading (Multiple Choice)"
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 179,
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
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                lineNumber: 174,
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
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    borderRadius: 12,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    padding: 28,
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "inline-block",
                                            background: "#0B4F5C",
                                            color: "white",
                                            fontSize: 12,
                                            fontWeight: 700,
                                            padding: "3px 12px",
                                            borderRadius: 20,
                                            marginBottom: 12,
                                            letterSpacing: 1
                                        },
                                        children: "PASSAGE 1 — Questions 1–5"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            color: "#0B4F5C",
                                            marginBottom: 16
                                        },
                                        children: "The Renewable Energy Revolution"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85,
                                            marginBottom: 12
                                        },
                                        children: "The global energy landscape is undergoing a profound transformation. Driven by falling costs, advancing technology, and mounting pressure to address climate change, renewable energy sources — particularly solar and wind — are rapidly gaining market share at the expense of fossil fuels. In many regions, new renewable installations are now cheaper to build and operate than the cheapest coal plants. The cost of utility-scale solar photovoltaics, for instance, plummeted by more than 90 percent between 2010 and 2023, a rate of cost reduction with few parallels in industrial history."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85,
                                            marginBottom: 12
                                        },
                                        children: "Yet the transition is not without complexity. The intermittency problem — the fact that the sun does not always shine and the wind does not always blow — poses a significant engineering challenge. Electrical grids built for the predictable output of coal and gas plants must be redesigned to accommodate variable renewable generation. Energy storage, particularly grid-scale batteries, is central to this challenge. While battery costs have also fallen sharply, deploying storage at the scale needed to fully decarbonise electricity grids remains a formidable task."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85,
                                            marginBottom: 12
                                        },
                                        children: "Political economy presents another layer of difficulty. Incumbent fossil fuel industries employ millions of workers and wield considerable political influence. In regions where coal or oil are major employers, transitions can generate significant social disruption. Managed transitions — including retraining programmes and targeted investment in affected communities — are widely regarded by economists as essential to sustaining political support for climate policy."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85
                                        },
                                        children: "Despite these challenges, projections from major energy agencies suggest that renewable capacity will continue to expand rapidly through the 2030s. The question is no longer whether the world will transition away from fossil fuels, but how quickly and equitably that transition can be managed."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    borderRadius: 12,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    padding: 28
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "inline-block",
                                            background: "#0B4F5C",
                                            color: "white",
                                            fontSize: 12,
                                            fontWeight: 700,
                                            padding: "3px 12px",
                                            borderRadius: 20,
                                            marginBottom: 12,
                                            letterSpacing: 1
                                        },
                                        children: "PASSAGE 2 — Questions 6–10"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            color: "#0B4F5C",
                                            marginBottom: 16
                                        },
                                        children: "Nudging Behaviour: The Science of Choice Architecture"
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85,
                                            marginBottom: 12
                                        },
                                        children: "Classical economic theory rests on the assumption that individuals are rational agents who consistently make decisions in their own best interest. Decades of behavioural research, however, tell a more complicated story. People are subject to cognitive biases, mental shortcuts, and a tendency toward inertia that routinely leads them to make choices that conflict with their stated preferences and long-term goals. Behavioural economics seeks to understand these patterns — and, increasingly, to harness them for public benefit."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85,
                                            marginBottom: 12
                                        },
                                        children: "The concept of the 'nudge', popularised by economists Richard Thaler and Cass Sunstein, refers to any aspect of the choice environment that predictably alters behaviour without forbidding options or significantly changing economic incentives. A nudge exploits the tendency toward inertia by making the socially desirable option the default. If employees must actively opt out of a workplace pension scheme rather than opt in, participation rates rise substantially. If a cafeteria places fruit at eye level and relegates unhealthy options to lower shelves, students select more nutritious meals — without any rule being imposed."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85,
                                            marginBottom: 12
                                        },
                                        children: "Perhaps the most cited example is organ donation. Countries that use opt-out systems — where citizens are presumed to consent to donation unless they formally withdraw — consistently have far higher donation rates than countries relying on opt-in consent. The difference in outcomes stems not from any difference in values or education, but simply from the power of the default."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#333",
                                            lineHeight: 1.85
                                        },
                                        children: "Critics raise ethical concerns. If nudges influence behaviour without people's full knowledge, do they undermine genuine autonomy? Proponents counter that all environments involve defaults — the question is not whether to design them, but whether to design them thoughtfully, with citizens' welfare in mind. As governments worldwide adopt nudge units and behavioural insight teams, this ethical debate is unlikely to be resolved soon."
                                    }, void 0, false, {
                                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 190,
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
                                    children: "Questions 1–10 (Multiple Choice)"
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 20
                                    },
                                    children: allQuestions.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                background: "#f9f9f9",
                                                borderRadius: 10,
                                                padding: "16px 20px",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontWeight: 600,
                                                        color: "#333",
                                                        marginBottom: 12,
                                                        lineHeight: 1.5
                                                    },
                                                    children: q.text
                                                }, void 0, false, {
                                                    fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                                    lineNumber: 220,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8
                                                    },
                                                    children: q.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            style: {
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                gap: 8,
                                                                cursor: "pointer",
                                                                color: "#333",
                                                                fontWeight: answers[q.id] === opt ? 700 : 400,
                                                                lineHeight: 1.5
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    name: q.id,
                                                                    value: opt,
                                                                    checked: answers[q.id] === opt,
                                                                    onChange: ()=>saveAnswer(q.id, opt),
                                                                    style: {
                                                                        marginTop: 3,
                                                                        flexShrink: 0
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                                                    lineNumber: 224,
                                                                    columnNumber: 25
                                                                }, this),
                                                                opt
                                                            ]
                                                        }, opt, true, {
                                                            fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                                            lineNumber: 223,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                                    lineNumber: 221,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, q.id, true, {
                                            fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                lineNumber: 187,
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
                        label: "SECTION 1",
                        active: true
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "/section2-L10-2",
                        label: "SECTION 2"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavCard, {
                        href: "/section3-L10-2",
                        label: "SECTION 3"
                    }, void 0, false, {
                        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
                lineNumber: 237,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
        lineNumber: 171,
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
            fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
            lineNumber: 249,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/duosteam/src/components/bailam/pagebailam2-L10.js",
        lineNumber: 248,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__80db4623._.js.map