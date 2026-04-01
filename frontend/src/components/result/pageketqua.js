"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resetTimer, getTimeSpent, formatTime } from "../../utils/testTimer";
import { clearAllAnswers } from "../../utils/answerStorage";
import { SKILL_DEFS } from "../../utils/questionSkills";

export default function PageKetQua() {
  const [result, setResult] = useState(null);
  const [timeSpent, setTimeSpent] = useState("00:00:00");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [examId, setExamId] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("currentTest") || "reading-test-1"
      : "reading-test-1"
  );
  const [feedback, setFeedback] = useState("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  // ================= LOAD RESULT =================
  useEffect(() => {
    const data = localStorage.getItem("readingTest_result");
    if (data) {
      const parsed = JSON.parse(data);
      setResult(parsed);
      const exam = parsed.testId || localStorage.getItem("currentTest") || "reading-test-1";
      setExamId(exam);
      const savedTime = parsed.timeSpent ?? (Number(localStorage.getItem("timeSpent")) || getTimeSpent(exam));
      if (!Number.isNaN(Number(savedTime))) setTimeSpent(formatTime(Number(savedTime)));
      resetTimer(exam);
    }
  }, []);

  // ================= SCORE ANIMATION =================
  useEffect(() => {
    if (!result) return;
    let start = 0;
    const end = result.score || 0;
    const duration = 800;
    const stepTime = 20;
    const increment = end / (duration / stepTime);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { start = end; clearInterval(timer); }
      setAnimatedScore(start.toFixed(1));
    }, stepTime);
    return () => clearInterval(timer);
  }, [result]);

  // ================= AI FEEDBACK =================
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!result) return;
      try {
        setIsLoadingFeedback(true);
        setFeedbackError("");
        const res = await fetch("/api/learning-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });
        if (!res.ok) { setFeedbackError("Không thể tạo gợi ý ôn tập tự động."); return; }
        const data = await res.json();
        setFeedback(data.feedback || "");
      } catch (err) {
        setFeedbackError("Đã xảy ra lỗi khi gọi AI feedback.");
      } finally {
        setIsLoadingFeedback(false);
      }
    };
    fetchFeedback();
  }, [result]);

  // ================= AUTO SCROLL FIRST WRONG =================
  useEffect(() => {
    if (!result) return;
    const firstWrongIndex = result.questions?.findIndex((q) => !q.isCorrect && !q.isSkipped);
    if (firstWrongIndex >= 0) {
      setTimeout(() => {
        document.getElementById(`question-${firstWrongIndex}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    }
  }, [result, reviewMode]);

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", color: "#0B4F5C", fontSize: 18, fontWeight: 600 }}>
        Đang tải kết quả...
      </div>
    );
  }

  const { correct = 0, wrong = 0, skipped = 0, total = 0, accuracy = 0, skills = [], weakSkills = [], questions = [] } = result;

  const getAnswerBorderColor = (q) => {
    if (q.isSkipped) return "#f0a500";
    if (q.isCorrect) return "#22a55a";
    return "#e53e3e";
  };
  const getAnswerBg = (q) => {
    if (q.isSkipped) return "#fffbea";
    if (q.isCorrect) return "#f0faf5";
    return "#fff5f5";
  };

  const startNewTest = () => {
    const exam = examId || localStorage.getItem("currentTest") || "reading-test-1";
    localStorage.removeItem("readingTest_result");
    localStorage.removeItem("timeSpent");
    localStorage.removeItem("lastTimeSpent");
    clearAllAnswers(exam);
    resetTimer(exam);
    window.location.href = "/";
  };

  return (
    <div style={{ width: "100%", background: "#ffffff", display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ width: "1200px", maxWidth: "95%", color: "black", paddingTop: 60, paddingBottom: 80 }}>

        {/* TITLE */}
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#0B4F5C", marginBottom: 8, letterSpacing: 1, textAlign: "center" }}>
          Kết quả bài làm
        </h1>
        <p style={{ color: "#777", fontSize: 16, marginBottom: 40, textAlign: "center" }}>
          Xem lại kết quả và gợi ý học tập của bạn bên dưới.
        </p>

        {/* SCORE HERO */}
        <div style={{
          background: "#f9f9f9",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "40px 48px",
          textAlign: "center",
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 16, color: "#777", marginBottom: 8 }}>Điểm số của bạn</div>
          <div style={{ fontSize: 72, fontWeight: "bold", color: "#0B4F5C", lineHeight: 1 }}>{animatedScore}</div>
          <div style={{ marginTop: 16, color: "#555", fontSize: 16 }}>
            ⏱ Thời gian: <strong>{timeSpent}</strong> &nbsp;|&nbsp; 🎯 Độ chính xác: <strong>{accuracy}%</strong>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
          {[
            { label: "✅ Đúng", value: correct, color: "#22a55a", bg: "#f0faf5" },
            { label: "❌ Sai", value: wrong, color: "#e53e3e", bg: "#fff5f5" },
            { label: "⏭ Bỏ qua", value: skipped, color: "#888", bg: "#f9f9f9" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: stat.bg,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "28px 24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 44, fontWeight: "bold", color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: "#999", marginTop: 4 }}>/ {total} câu</div>
            </div>
          ))}
        </div>

        {/* REVIEW TOGGLE */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <button
            onClick={() => setReviewMode(!reviewMode)}
            style={{
              background: reviewMode ? "#f9f9f9" : "#0B4F5C",
              color: reviewMode ? "#0B4F5C" : "white",
              border: "2px solid #0B4F5C",
              borderRadius: 10,
              padding: "12px 36px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {reviewMode ? "Ẩn đáp án" : "Xem chi tiết bài làm"}
          </button>
        </div>

        {/* ANSWER REVIEW */}
        {reviewMode && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {questions.map((q, i) => (
              <div
                key={i}
                id={`question-${i}`}
                style={{
                  borderLeft: `4px solid ${getAnswerBorderColor(q)}`,
                  background: getAnswerBg(q),
                  borderRadius: 10,
                  padding: "16px 20px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                <p style={{ fontWeight: 600, color: "#333", marginBottom: 6 }}>Câu {i + 1}</p>
                <p style={{ color: "#555", marginBottom: 4 }}>Trả lời: <strong>{q.userAnswer || "—"}</strong></p>
                {!q.isCorrect && (
                  <p style={{ color: "#e53e3e" }}>Đáp án đúng: <strong>{q.correctAnswer}</strong></p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* WEAK SKILLS */}
        {weakSkills.length > 0 && (
          <div style={{
            background: "#fff5f5",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            padding: 28,
            marginBottom: 32,
            borderLeft: "4px solid #e53e3e",
          }}>
            <p style={{ fontWeight: "bold", color: "#c00", marginBottom: 16, fontSize: 17 }}>
              🔴 Kỹ năng cần cải thiện
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {weakSkills.map((skill) => (
                <div key={skill.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 8, padding: "10px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <span style={{ fontWeight: 600, color: "#333" }}>{skill.name}</span>
                  <span style={{ color: "#e53e3e", fontWeight: 700 }}>{skill.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI FEEDBACK */}
        <div style={{
          background: "#f9f9f9",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          padding: 28,
          marginBottom: 48,
        }}>
          <p style={{ fontWeight: "bold", color: "#0B4F5C", fontSize: 17, marginBottom: 16 }}>
            🤖 Gợi ý học tập từ AI
          </p>
          {isLoadingFeedback && (
            <p style={{ color: "#777", fontStyle: "italic" }}>Đang tạo nhận xét...</p>
          )}
          {feedbackError && (
            <p style={{ color: "#e53e3e" }}>{feedbackError}</p>
          )}
          {!isLoadingFeedback && !feedbackError && (
            <div style={{ whiteSpace: "pre-wrap", fontSize: 15, color: "#444", lineHeight: 1.8 }}>
              {feedback || "Chưa có phản hồi."}
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <Link href="/xem-dap-an" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#0B4F5C",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "16px 40px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "opacity 0.2s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Xem đáp án
            </button>
          </Link>

          <button
            onClick={startNewTest}
            style={{
              background: "#f9f9f9",
              color: "#0B4F5C",
              border: "2px solid #0B4F5C",
              borderRadius: 10,
              padding: "16px 40px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0B4F5C"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f9f9f9"; e.currentTarget.style.color = "#0B4F5C"; }}
          >
            Làm bài mới
          </button>
        </div>

      </div>
    </div>
  );
}
