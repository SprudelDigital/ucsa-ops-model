import { useState } from "react";
import { theme as t } from "./theme";
import OpsModel from "./OpsModel";
import InvestmentCase from "./InvestmentCase";

export default function App() {
  const [mode, setMode] = useState("investment");

  return (
    <div style={{ fontFamily: t.fontBody, background: t.bg, minHeight: "100vh", color: t.text1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        button { font-family: inherit; }
      `}</style>

      {/* Global Header */}
      <div style={{ borderBottom: `1px solid ${t.border}`, padding: "20px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "3px", color: t.text2, marginBottom: 4 }}>
              UCSA ASSET COMPANY
            </div>
            <div style={{ fontFamily: t.fontHead, fontSize: 18, fontWeight: 700, color: t.text1 }}>
              Integrated Business Plan <span style={{ color: t.accentLime }}>V4</span>
            </div>
            <div style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2, marginTop: 2 }}>
              March 2026 · Western & Southern Cape · Confidential
            </div>
          </div>

          <div style={{ display: "flex", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
            {[
              { id: "investment", label: "INVESTMENT CASE" },
              { id: "ops", label: "OPS MODEL" },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  padding: "10px 24px",
                  border: "none",
                  background: mode === m.id ? t.accentLime : "transparent",
                  color: mode === m.id ? "#080E1A" : t.text2,
                  fontFamily: t.fontMono,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "investment" ? <InvestmentCase /> : <OpsModel />}
    </div>
  );
}
