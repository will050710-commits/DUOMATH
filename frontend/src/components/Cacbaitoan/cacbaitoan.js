/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";

const grades = [
  { label: "Grade 10", href: "/Cacbaitoan10", img: "/images/math10.png" },
  { label: "Grade 11 (Coming soon)", href: "/Cacbaitoan11", img: "/images/math11.png" },
  { label: "Grade 12 (Coming soon)", href: "/Cacbaitoan12", img: "/images/math12.png" },
];

export default function CacbailamPage() {
  return (
    <div style={{ width: "100%", background: "#ffffff", display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ width: "1200px", maxWidth: "95%", color: "black", paddingTop: 60, paddingBottom: 80 }}>

        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#0B4F5C", marginBottom: 8, letterSpacing: 1 }}>
          Bilingual Math Lessons for High School Students
        </h1>
        <p style={{ color: "#777", fontSize: 18, marginBottom: 48 }}>
          Choose a class to learn
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {grades.map((g) => (
            <Link key={g.label} href={g.href} style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 32,
                  background: "#f9f9f9",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "28px 36px",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
              >
                <img src={g.img} alt={g.label} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10 }} />
                <span style={{ fontSize: 36, fontWeight: "bold", color: "#0B4F5C" }}>{g.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 28, color: "#aaa" }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
