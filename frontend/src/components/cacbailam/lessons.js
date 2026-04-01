/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";

const gradeData = [
  { grade: "Grade 10", img: "/images/math10.png", count: 6, comingSoon: false },
  { grade: "Grade 11", img: "/images/math11.png", count: 6, comingSoon: true },
  { grade: "Grade 12", img: "/images/math12.png", count: 6, comingSoon: true },
];

export default function CacBaiLamPage() {
  return (
    <div style={{ width: "100%", background: "#ffffff", display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ width: "1200px", maxWidth: "95%", color: "black", paddingTop: 60, paddingBottom: 80 }}>

        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#0B4F5C", marginBottom: 8, letterSpacing: 1 }}>
          Bilingual Math Tests
        </h1>
        <p style={{ color: "#777", fontSize: 18, marginBottom: 48 }}>
          Choose a test to practice
        </p>

        {gradeData.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#0B4F5C", marginBottom: 28 }}>
              {g.grade}{g.comingSoon ? " (Coming soon)" : ""}
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 32,
              background: "#f9f9f9",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: 28,
            }}>
              {Array.from({ length: g.count }).map((_, idx) => (
                <div key={idx} style={{
                  background: "#ffffff",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                  opacity: g.comingSoon ? 0.5 : 1,
                  cursor: g.comingSoon ? "not-allowed" : "pointer",
                  transition: "box-shadow 0.2s ease",
                }}
                  onMouseEnter={e => { if (!g.comingSoon) e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.13)"; }}
                  onMouseLeave={e => { if (!g.comingSoon) e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
                >
                  <img src={g.img} alt={g.grade} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 20, fontWeight: 600, color: "black" }}>Test {idx + 1}</div>
                    <div style={{ color: "#777", fontSize: 16, marginTop: 4 }}>{g.grade}{g.comingSoon ? " (coming soon)" : ""}</div>
                    <div style={{ fontSize: 15, color: "#555", marginTop: 4 }}>15 questions • Short answer + T/F/NG</div>
                  </div>
                </div>
              ))}
            </div>

            {gi < gradeData.length - 1 && (
              <div style={{ height: 1, background: "#e0e0e0", margin: "48px 0 0" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
