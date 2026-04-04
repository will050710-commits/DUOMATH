"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./DuoMCBPage.module.css";
import Image from "next/image";
import { createSession, chat } from "./duoServer";
import Link from "next/link";
import TrangChuForm from "../trangchu/TrangChuForm";
const SUGGESTED = [
  { icon: "📐", text: "Solve x² - 5x + 6 = 0 step by step" },
  { icon: "📊", text: "Explain mean, median and standard deviation" },
  { icon: "📝", text: "Give me bilingual exercises on trigonometry" },
  { icon: "🧪", text: "What is Newton's second law of motion?" },
];

export default function DuoMCBPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [chatHistory] = useState([
    { id: 1, title: "Quadratic equations help", date: "Today" },
    { id: 2, title: "Statistics exercises", date: "Today" },
    { id: 3, title: "Newton's laws review", date: "Yesterday" },
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { initSession(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function initSession() {
    const sid = await createSession();
    setSessionId(sid || "offline-" + Date.now());
  }

  async function ensureSession() {
    let sid = sessionId;
    if (!sid || sid.startsWith("offline-")) {
      sid = await createSession();
      if (!sid) sid = "offline-" + Date.now();
      setSessionId(sid);
    }
    return sid;
  }

  // ── Image file selection ──
  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageBase64(ev.target.result);
      setShowImageModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // ── Send image with chosen mode ──
  async function sendImageMessage(mode) {
    setShowImageModal(false);
    const modeText = mode === "hint"
      ? "Provide A FEW HINTS to solve this problem without giving the answer"
      : "Look at the problem in this image and solve it STEP BY STEP for me.";

    const userMsg = { role: "user", content: modeText, image: imagePreview, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const sid = await ensureSession();

    try {
      const data = await chat(sid, modeText, { image: imageBase64 });
      if (data.error) throw new Error("bad response");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || data.error, id: Date.now() + 1 }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Không thể xử lý ảnh. Kiểm tra server.py đang chạy.", id: Date.now() + 1 }]);
    } finally {
      setLoading(false);
      setImagePreview(null);
      setImageBase64(null);
    }
  }

  // ── Send text message ──
  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const sid = await ensureSession();
    setMessages((prev) => [...prev, { role: "user", content: msg, id: Date.now() }]);
    setLoading(true);
    try {
      const data = await chat(sid, msg);
      if (data.error) throw new Error("bad response");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, id: Date.now() + 1 }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Could not connect to DuoMCB server.", id: Date.now() + 1 }]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([]);
    initSession();
    inputRef.current?.focus();
  }

  const isEmpty = messages.length === 0;

  return (
    <div className={styles.root}>

      {/* ── IMAGE MODAL ── */}
      {showImageModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowImageModal(false); setImagePreview(null); setImageBase64(null); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span>🖼️ Ảnh đã tải lên</span>
              <button className={styles.modalClose} onClick={() => { setShowImageModal(false); setImagePreview(null); setImageBase64(null); }}>✕</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Preview" className={styles.modalPreview} />
            <p className={styles.modalQuestion}>Bạn muốn DuoMCB làm gì với bài toán này?</p>
            <div className={styles.modalActions}>
              <button className={styles.hintBtn} onClick={() => sendImageMessage("hint")}>
                💡 Cho tôi Gợi ý
              </button>
              <button className={styles.answerBtn} onClick={() => sendImageMessage("answer")}>
                ✅ Giải đầy đủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}></span>
            {sidebarOpen && <span className={styles.logoText}>DuoMCB</span>}
          </div>
          <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        {sidebarOpen && (
          <>
            <button className={styles.newChatBtn} onClick={newChat}>
              <span>✏️</span> New Chat
            </button>
            <div className={styles.historySection}>
              <p className={styles.historyLabel}>Recent</p>
              {chatHistory.map((h) => (
                <button key={h.id} className={styles.historyItem}>
                  <span className={styles.historyIcon}>💬</span>
                  <span className={styles.historyTitle}>{h.title}</span>
                </button>
              ))}
            </div>
            <div className={styles.sidebarFooter}>
              <div className={styles.modelBadge}>
                <span className={styles.modelDot} />
                llama-3.3-70b
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.headerTitle}>DuoMCB</span>
          <span className={styles.headerSub}>Bilingual AI Tutor</span>
          <div className={styles.headerActions}> <Link href="/">Go back</Link></div>
        </header>

        <div className={styles.chatArea}>
          {isEmpty ? (
            <div className={styles.welcome}>
              <Image src="/images/duosteamicon-removebg-preview.png" alt="DuoMCB Logo" width={64} height={64} style={{ width: 64, height: "auto" }} />
              <h1 className={styles.welcomeTitle}>Hello, I&apos;m DuoMCB</h1>
              <p className={styles.welcomeSub}>Your bilingual <strong>DUOMATH</strong> chatbot!</p>
              <div className={styles.suggestions}>
                {SUGGESTED.map((s, i) => (
                  <button key={i} className={styles.suggestionCard} onClick={() => sendMessage(s.text)}>
                    <span className={styles.suggestionIcon}>{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.messages}>
              {messages.map((m) => (
                <div key={m.id} className={`${styles.msgRow} ${m.role === "user" ? styles.userRow : styles.botRow}`}>
                  {m.role === "assistant" && (
                    <div className={styles.avatar}>
                      <Image src="/images/duosteamicon-removebg-preview.png" alt="DuoMCB" width={32} height={32} />
                    </div>
                  )}
                  <div className={`${styles.bubble} ${m.role === "user" ? styles.userBubble : styles.botBubble}`}>
                    {m.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt="Uploaded" className={styles.bubbleImage} />
                    )}
                    {(m.content || "").split("\n").map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </div>
                  {m.role === "user" && <div className={styles.userAvatar}>👤</div>}
                </div>
              ))}
              {loading && (
                <div className={`${styles.msgRow} ${styles.botRow}`}>
                  <div className={styles.avatar}>
                    <Image src="/images/duosteamicon-removebg-preview.png" alt="DuoMCB" width={32} height={32} />
                  </div>
                  <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
                    <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className={styles.inputBar}>
          <div className={styles.inputWrapper}>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
            <button className={styles.imageBtn} onClick={() => fileInputRef.current?.click()} title="Tải ảnh lên" disabled={loading}>
              +
            </button>
            <textarea
              ref={inputRef}
              className={styles.input}
              placeholder="Ask me anything..."
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            />
            <button
              className={`${styles.sendBtn} ${input.trim() && !loading ? styles.sendActive : ""}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >➤</button>
          </div>
          <p className={styles.disclaimer}>DuoMCB có thể mắc lỗi. Hãy kiểm tra lại các đáp án quan trọng.</p>
        </div>
      </main>
    </div>
  );
}
