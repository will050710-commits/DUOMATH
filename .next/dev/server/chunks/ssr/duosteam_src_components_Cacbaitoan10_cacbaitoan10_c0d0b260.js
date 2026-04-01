module.exports = [
"[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CacBaiLamPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/duosteam/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
/* eslint-disable @next/next/no-img-element */ "use client";
;
;
;
// ─── LESSON REGISTRY ───────────────────────────────────────────────────────────
// Each lesson has:
//   title  – displayed on the card
//   slug   – used as the URL: /cacbailam10/[slug]
//   done   – true = clickable card | false = "coming soon" (greyed out)
// ─────────────────────────────────────────────────────────────────────────────
const sections = [
    {
        section: "Section: Algebra and Elements of Calculus",
        chapters: [
            {
                title: "Chapter 1: Propositions and Sets",
                lessons: [
                    {
                        title: "Mathematical Propositions",
                        slug: "Menh-de",
                        done: true
                    },
                    {
                        title: "Sets",
                        slug: "Tap-hop",
                        done: true
                    },
                    {
                        title: "Set Operations",
                        slug: "phep-toan-tap-hop",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 1",
                        slug: "OnTapChuong1",
                        done: true
                    }
                ]
            },
            {
                title: "Chapter 2: Linear Inequalities and Systems with 2 Variables",
                lessons: [
                    {
                        title: "Linear Inequalities in Two Variables",
                        slug: "Bpt-bac-nhat-2-an",
                        done: true
                    },
                    {
                        title: "Systems of Linear Inequalities in Two Variables",
                        slug: "Lesson5_HeBPTBacNhatHaiAn",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 2",
                        slug: "chuong2-10",
                        done: true
                    }
                ]
            },
            {
                title: "Chapter 3: Quadratic Functions and Graphs",
                lessons: [
                    {
                        title: "Functions and Graphs",
                        slug: "Ham-so-va-do-thi",
                        done: true
                    },
                    {
                        title: "Quadratic Functions",
                        slug: "Ham-so-bac-hai",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 3",
                        slug: "on-tap-chuong-3",
                        done: true
                    }
                ]
            }
        ]
    },
    {
        section: "Section: Geometry and Measurement",
        chapters: [
            {
                title: "Chapter 4: Trigonometric Relationships in a Triangle",
                lessons: [
                    {
                        title: "Trigonometric Values (0°–180°)",
                        slug: "gia-tri-luong-giac",
                        done: true
                    },
                    {
                        title: "Law of Cosines",
                        slug: "Lesson10_DinhLiCosin",
                        done: true
                    },
                    {
                        title: "Law of Sines",
                        slug: "Lesson11_DinhLiSin",
                        done: true
                    },
                    {
                        title: "Solving Triangles & Applications",
                        slug: "Lesson12_GiaiTamGiac",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 4",
                        slug: "OnTapChuong4",
                        done: true
                    }
                ]
            },
            {
                title: "Chapter 5: Vectors",
                lessons: [
                    {
                        title: "Introduction to Vectors",
                        slug: "Lesson13_KhaiNiemVecto",
                        done: true
                    },
                    {
                        title: "Sum and Difference of Vectors",
                        slug: "Lesson14_TongHieuVecto",
                        done: true
                    },
                    {
                        title: "Scalar Multiplication of a Vector",
                        slug: "Lesson15_TichSoVecto",
                        done: true
                    },
                    {
                        title: "Dot Product of Two Vectors",
                        slug: "Lesson16_TichVoHuong",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 5",
                        slug: "Lesson17_OnTapChuong5",
                        done: true
                    }
                ]
            },
            {
                title: "Chapter 6: Geometry and Measurement",
                lessons: [
                    {
                        title: "Geometric Shapes & Properties",
                        slug: "Lesson18_HinhHocDoLuong1",
                        done: true
                    },
                    {
                        title: "Area and Perimeter",
                        slug: "Lesson19_HinhHocDoLuong2",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 6",
                        slug: "Lesson20_OnTapChuong6",
                        done: true
                    }
                ]
            }
        ]
    },
    {
        section: "Section: Algebra and Elements of Calculus",
        chapters: [
            {
                title: "Chapter 7: Quadratic Inequality with One Variable",
                lessons: [
                    {
                        title: "Sign of a Quadratic Trinomial",
                        slug: "Lesson21_DauTamThucBacHai",
                        done: true
                    },
                    {
                        title: "Solving Quadratic Inequalities",
                        slug: "Lesson22_GiaiBPTBacHai",
                        done: true
                    },
                    {
                        title: "Equations Reducible to Quadratic",
                        slug: "Lesson23_PhuongTrinhQuyVeBacHai",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 7",
                        slug: "Lesson24_OnTapChuong7",
                        done: true
                    }
                ]
            },
            {
                title: "Chapter 8: Combinatorial Algebra",
                lessons: [
                    {
                        title: "Addition & Multiplication Principles",
                        slug: "Lesson25_QuyTacCongNhan",
                        done: true
                    },
                    {
                        title: "Permutations, Arrangements & Combinations",
                        slug: "Lesson26_HoanViChinhHopToHop",
                        done: true
                    },
                    {
                        title: "Binomial Theorem",
                        slug: "Lesson27_NhiThucNewton",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 8",
                        slug: "Lesson28_OnTapChuong8",
                        done: true
                    }
                ]
            }
        ]
    },
    {
        section: "Section: Geometry and Measurement",
        chapters: [
            {
                title: "Chapter 9: Coordinate Method in a Plane",
                lessons: [
                    {
                        title: "Coordinates of a Vector",
                        slug: "Lesson29_ToaDoVecto",
                        done: true
                    },
                    {
                        title: "Lines in the Coordinate Plane",
                        slug: "Lesson30_DuongThang",
                        done: true
                    },
                    {
                        title: "Circles in the Coordinate Plane",
                        slug: "Lesson31_DuongTron",
                        done: true
                    },
                    {
                        title: "Ellipse (Introduction)",
                        slug: "Lesson32_Elip",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 9",
                        slug: "Lesson33_OnTapChuong9",
                        done: true
                    }
                ]
            }
        ]
    },
    {
        section: "Section: Statistics and Probability",
        chapters: [
            {
                title: "Chapter 10: Probability",
                lessons: [
                    {
                        title: "Sample Spaces and Events",
                        slug: "Lesson34_KhongGianMau",
                        done: true
                    },
                    {
                        title: "Probability of an Event",
                        slug: "Lesson35_XacSuatBienCo",
                        done: true
                    },
                    {
                        title: "Practice & Review – Chapter 10",
                        slug: "Lesson36_OnTapChuong10",
                        done: true
                    }
                ]
            }
        ]
    }
];
function CacBaiLamPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: "100%",
            background: "#ffffff",
            display: "flex",
            justifyContent: "center",
            minHeight: "105vh"
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/Trangchu",
                    style: {
                        textDecoration: "none",
                        color: "black",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "12px 16px",
                        paddingBottom: 12,
                        borderRadius: 8,
                        fontSize: 15
                    },
                    children: [
                        "← ",
                        "Quay lại"
                    ]
                }, void 0, true, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                    lineNumber: 136,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#0B4F5C",
                        marginBottom: 8,
                        letterSpacing: 1,
                        paddingTop: 20
                    },
                    children: "Grade 10"
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: "#777",
                        fontSize: 18,
                        marginBottom: 48
                    },
                    children: "Chọn chương để bắt đầu học."
                }, void 0, false, {
                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                    lineNumber: 142,
                    columnNumber: 9
                }, this),
                sections.map((s, si)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 60
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 22,
                                    fontWeight: "bold",
                                    color: "#0B4F5C",
                                    borderLeft: "4px solid #0B4F5C",
                                    paddingLeft: 16,
                                    marginBottom: 32
                                },
                                children: s.section
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            s.chapters.map((ch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 40
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            style: {
                                                fontSize: 20,
                                                fontWeight: 600,
                                                color: "#333",
                                                marginBottom: 20
                                            },
                                            children: ch.title
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                            lineNumber: 163,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                                gap: 24
                                            },
                                            children: ch.lessons.map((lesson, idx)=>lesson.done ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/${lesson.slug}`,
                                                    style: {
                                                        textDecoration: "none"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            background: "#f9f9f9",
                                                            borderRadius: 10,
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            overflow: "hidden",
                                                            cursor: "pointer",
                                                            transition: "box-shadow 0.2s ease",
                                                            height: "100%"
                                                        },
                                                        onMouseEnter: (e)=>e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)",
                                                        onMouseLeave: (e)=>e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: "/images/math10.png",
                                                                alt: "Grade 10",
                                                                style: {
                                                                    width: "100%",
                                                                    height: 160,
                                                                    objectFit: "cover"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                lineNumber: 192,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    padding: "16px 20px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: 18,
                                                                            fontWeight: 600,
                                                                            color: "black"
                                                                        },
                                                                        children: [
                                                                            "Lesson ",
                                                                            idx + 1
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                        lineNumber: 198,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            color: "#555",
                                                                            fontSize: 14,
                                                                            margin: "4px 0 6px"
                                                                        },
                                                                        children: lesson.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                        lineNumber: 201,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: 14,
                                                                            color: "#0B4F5C",
                                                                            fontWeight: 500
                                                                        },
                                                                        children: "Click to learn →"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                        lineNumber: 204,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                lineNumber: 197,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                        lineNumber: 179,
                                                        columnNumber: 25
                                                    }, this)
                                                }, lesson.slug, false, {
                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                    lineNumber: 174,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        background: "#f3f3f3",
                                                        borderRadius: 10,
                                                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                                        overflow: "hidden",
                                                        cursor: "not-allowed",
                                                        opacity: 0.6,
                                                        height: "100%"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: "/images/math10.png",
                                                            alt: "Grade 10",
                                                            style: {
                                                                width: "100%",
                                                                height: 160,
                                                                objectFit: "cover",
                                                                filter: "grayscale(60%)"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                            lineNumber: 223,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                padding: "16px 20px"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 18,
                                                                        fontWeight: 600,
                                                                        color: "#888"
                                                                    },
                                                                    children: [
                                                                        "Lesson ",
                                                                        idx + 1
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                    lineNumber: 229,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: "#aaa",
                                                                        fontSize: 14,
                                                                        margin: "4px 0 6px"
                                                                    },
                                                                    children: lesson.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                    lineNumber: 232,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 13,
                                                                        color: "#bbb"
                                                                    },
                                                                    children: "🔜 Coming soon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                                    lineNumber: 235,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                            lineNumber: 228,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, lesson.slug, true, {
                                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                                    lineNumber: 211,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                            lineNumber: 167,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, ch.title, true, {
                                    fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this)),
                            si < sections.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$duosteam$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 1,
                                    background: "#e0e0e0",
                                    margin: "20px 0 40px"
                                }
                            }, void 0, false, {
                                fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                                lineNumber: 247,
                                columnNumber: 15
                            }, this)
                        ]
                    }, si, true, {
                        fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
            lineNumber: 135,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/duosteam/src/components/Cacbaitoan10/cacbaitoan10.js",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=duosteam_src_components_Cacbaitoan10_cacbaitoan10_c0d0b260.js.map