import { useState } from "react";
import { theme as t } from "./theme";
import {
  executiveSummary,
  marketData,
  businessModelData,
  competitiveData,
  financialsData,
  gtmData,
  teamData,
  riskData,
  exitData,
} from "./data/businessPlan";

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────

function SectionLabel({ children, mt = 32 }) {
  return (
    <div style={{
      fontFamily: t.fontMono, fontSize: 9, letterSpacing: "3px",
      color: t.text2, marginBottom: 12, marginTop: mt,
    }}>
      {children}
    </div>
  );
}

function Card({ children, highlight, blue, style = {} }) {
  return (
    <div style={{
      background: highlight ? (t.accentLime + "12") : blue ? (t.accentBlue + "18") : t.surface,
      border: "1px solid " + (highlight ? t.accentLime : blue ? t.accentBlue : t.border),
      borderRadius: 8,
      padding: "20px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function MetricRow({ label, value, lime, cyan }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid " + t.border,
    }}>
      <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2 }}>{label}</span>
      <span style={{
        fontFamily: t.fontMono, fontSize: 12, fontWeight: 700,
        color: lime ? t.accentLime : cyan ? t.accentCyan : t.text1,
      }}>{value}</span>
    </div>
  );
}

// ─── TAB COMPONENTS ──────────────────────────────────────────────────────────

function SummaryTab() {
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>THE ASK · MARCH 2026</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
        <Card>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.text2, marginBottom: 8 }}>EQUITY</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 26, fontWeight: 700, color: t.text1, marginBottom: 6 }}>{executiveSummary.theAsk.equity}</div>
          <div style={{ fontSize: 12, color: t.text2 }}>{executiveSummary.theAsk.equityPurpose}</div>
        </Card>
        <Card>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.text2, marginBottom: 8 }}>BRIDGE FACILITY</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 26, fontWeight: 700, color: t.text1, marginBottom: 6 }}>{executiveSummary.theAsk.bridge}</div>
          <div style={{ fontSize: 12, color: t.text2 }}>{executiveSummary.theAsk.bridgePurpose}</div>
        </Card>
        <Card highlight>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.accentLime, marginBottom: 8 }}>TOTAL RAISE</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 26, fontWeight: 700, color: t.accentLime, marginBottom: 6 }}>{executiveSummary.theAsk.total}</div>
          <div style={{ fontSize: 12, color: t.text2 }}>ZAR 74–79M balance via senior debt + mezzanine</div>
        </Card>
      </div>

      <SectionLabel>RETURN SCENARIOS</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
        {executiveSummary.scenarios.map(s => (
          <Card key={s.label} blue={s.highlight}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: t.fontHead, fontSize: 14, fontWeight: 700, color: t.text1 }}>{s.label}</div>
                <div style={{ fontFamily: t.fontMono, fontSize: 10, color: s.highlight ? t.accentBlue : t.text2, marginTop: 2 }}>WACC {s.wacc}</div>
              </div>
              {s.highlight && (
                <span style={{ background: t.accentBlue, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "1px", padding: "3px 8px", borderRadius: 3 }}>TARGET</span>
              )}
            </div>
            <MetricRow label="PROJECT IRR" value={s.projectIRR} />
            <MetricRow label="EQUITY IRR" value={s.equityIRR} lime />
            <MetricRow label="NPV" value={s.npv} />
            <MetricRow label="PAYBACK" value={s.payback} />
            <MetricRow label="DSCR Y5" value={s.dscr} />
            <div style={{ fontSize: 11, color: t.text2, marginTop: 12, lineHeight: 1.5 }}>{s.note}</div>
          </Card>
        ))}
      </div>

      <SectionLabel>WHY THIS VENTURE WINS</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 32 }}>
        {executiveSummary.whyWeWin.map((w, i) => (
          <div key={i} style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ color: t.accentCyan, fontFamily: t.fontMono, fontSize: 16, marginTop: 1, flexShrink: 0 }}>{w.icon}</span>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: t.text1, margin: 0 }}>{w.point}</p>
          </div>
        ))}
      </div>

      <div style={{ borderLeft: "3px solid " + t.accentLime, padding: "16px 24px", background: t.surface, borderRadius: "0 8px 8px 0" }}>
        <p style={{ fontFamily: t.fontHead, fontSize: 14, fontWeight: 600, color: t.text1, margin: 0, lineHeight: 1.6 }}>
          {executiveSummary.tagline}
        </p>
      </div>
    </div>
  );
}

function MarketTab() {
  const { tam, sam, som } = marketData.addressableMarket;
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>MACRO CONTEXT</SectionLabel>
      <p style={{ fontSize: 14, color: t.text2, lineHeight: 1.7, marginBottom: 16, maxWidth: 760 }}>
        {marketData.macro.content}
      </p>
      <div style={{ borderLeft: "3px solid " + t.accentCyan, padding: "14px 20px", background: t.surface, borderRadius: "0 8px 8px 0", marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: t.text1, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: t.accentCyan }}>Post-load-shedding shift: </strong>{marketData.macro.insight}
        </p>
      </div>

      <SectionLabel>TAM → SAM → SOM (PHASE 1)</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr 32px 1fr", alignItems: "center", marginBottom: 32 }}>
        <Card>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.accentLime, marginBottom: 8 }}>{tam.label}</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, color: t.text1, marginBottom: 8 }}>{tam.value}</div>
          <div style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{tam.note}</div>
        </Card>
        <div style={{ textAlign: "center", fontFamily: t.fontMono, fontSize: 20, color: t.accentLime }}>→</div>
        <Card>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.accentLime, marginBottom: 8 }}>{sam.label}</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, color: t.text1, marginBottom: 8 }}>{sam.value}</div>
          <div style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{sam.note}</div>
        </Card>
        <div style={{ textAlign: "center", fontFamily: t.fontMono, fontSize: 20, color: t.accentLime }}>→</div>
        <Card>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.accentLime, marginBottom: 8 }}>{som.label}</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, color: t.text1, marginBottom: 8 }}>{som.value}</div>
          <div style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{som.note}</div>
        </Card>
      </div>

      <SectionLabel>CITY OF CAPE TOWN TARIFFS (2025/26, CURRENT MARCH 2026)</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        {marketData.westernCape.tariffs.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16,
            padding: "13px 18px",
            borderBottom: i < marketData.westernCape.tariffs.length - 1 ? "1px solid " + t.border : "none",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 13, color: t.text1 }}>{row.label}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 700, color: t.accentCyan }}>{row.value}</span>
            <span style={{ fontSize: 11, color: t.text2 }}>{row.note}</span>
          </div>
        ))}
      </div>

      <SectionLabel>CUSTOMER SEGMENTS (50-SITE PORTFOLIO)</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {marketData.segments.map(seg => (
          <Card key={seg.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: t.fontHead, fontSize: 14, fontWeight: 700, color: t.text1 }}>{seg.label}</div>
              <span style={{ background: t.accentLime + "22", color: t.accentLime, fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", padding: "3px 8px", borderRadius: 3 }}>{seg.count} sites</span>
            </div>
            <p style={{ fontSize: 12, color: t.text2, lineHeight: 1.6, marginBottom: 14 }}>{seg.description}</p>
            <div style={{ borderTop: "1px solid " + t.border, paddingTop: 12 }}>
              <MetricRow label="REVENUE/SITE" value={seg.revenue} lime />
              <MetricRow label="CLOSE RATE" value={seg.closeRate} />
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: t.text2, fontStyle: "italic" }}>{seg.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ModelTab() {
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>REVENUE STREAMS — TRIPLE ENGINE</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px", padding: "10px 18px", borderBottom: "1px solid " + t.border }}>
          {["Revenue Stream", "Per Small Site (Y1)", "Portfolio Y5 (50 sites)", "Share"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {businessModelData.revenueStreams.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px",
            padding: "13px 18px",
            borderBottom: "1px solid " + t.border,
            alignItems: "center",
          }}>
            <span style={{ fontSize: 13, color: t.text1 }}>{row.stream}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 12, color: t.text1 }}>{row.perSmallSite}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 12, color: t.accentCyan }}>{row.portfolioY5}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: t.border, borderRadius: 2 }}>
                <div style={{ width: row.pct + "%", height: "100%", background: t.accentLime, borderRadius: 2 }} />
              </div>
              <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.accentLime, minWidth: 28 }}>{row.pct}%</span>
            </div>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 90px", padding: "13px 18px", background: t.surfaceHigh }}>
          <span style={{ fontFamily: t.fontHead, fontSize: 13, fontWeight: 700, color: t.text1 }}>Total</span>
          <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.accentLime }}>{businessModelData.totalPerSite}</span>
          <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.accentLime }}>{businessModelData.totalPortfolio}</span>
          <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentLime }}>100%</span>
        </div>
      </div>

      <SectionLabel>UNIT ECONOMICS</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 32 }}>
        {businessModelData.unitEconomics.map((u, i) => (
          <div key={i} style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: t.text2 }}>{u.label}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.accentLime, whiteSpace: "nowrap" }}>{u.value}</span>
          </div>
        ))}
      </div>

      <SectionLabel>COST STRUCTURE (PER SMALL SITE)</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        {businessModelData.costStructure.map((c, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: 16,
            padding: "13px 18px",
            borderBottom: i < businessModelData.costStructure.length - 1 ? "1px solid " + t.border : "none",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 13, color: t.text2 }}>{c.label}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.text1 }}>{c.value}</span>
            <span style={{ fontSize: 12, color: t.text2 }}>{c.note}</span>
          </div>
        ))}
      </div>

      <SectionLabel>REVENUE BOLT-ONS (NOT IN BASE CASE)</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {businessModelData.boltOns.map((b, i) => (
          <Card key={i} style={{ borderColor: t.borderHigh }}>
            <div style={{ fontFamily: t.fontHead, fontSize: 13, fontWeight: 700, color: t.accentCyan, marginBottom: 8 }}>{b.label}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 16, fontWeight: 700, color: t.accentLime, marginBottom: 10 }}>{b.value}</div>
            <div style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{b.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompetitiveTab() {
  const threatColor = (threat) => {
    if (threat.startsWith("High")) return "#F87171";
    if (threat.startsWith("Medium")) return t.accentCyan;
    return t.text2;
  };
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>COMPETITIVE LANDSCAPE — 50+ COMPANIES PROFILED GLOBALLY</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "auto", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1.2fr 1.5fr", padding: "10px 18px", borderBottom: "1px solid " + t.border, minWidth: 700 }}>
          {["Competitor", "Model", "Funding", "Threat to UCSA", "UCSA Gap"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {competitiveData.competitors.map((c, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1.2fr 1.5fr",
            padding: "13px 18px",
            borderBottom: i < competitiveData.competitors.length - 1 ? "1px solid " + t.border : "none",
            alignItems: "start", gap: 8, minWidth: 700,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: t.text2 }}>{c.origin}</div>
            </div>
            <span style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{c.model}</span>
            <span style={{ fontSize: 12, color: t.text2 }}>{c.funding}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, color: threatColor(c.threat), lineHeight: 1.5 }}>{c.threat}</span>
            <span style={{ fontSize: 12, color: t.accentCyan, lineHeight: 1.5 }}>{c.gap}</span>
          </div>
        ))}
      </div>

      <SectionLabel>UCSA'S COMPETITIVE MOAT</SectionLabel>
      <div style={{ borderLeft: "3px solid " + t.accentLime, padding: "18px 24px", background: t.surface, borderRadius: "0 8px 8px 0", marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: t.text1, lineHeight: 1.7, margin: 0 }}>{competitiveData.moat}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.accentCyan, marginBottom: 10 }}>DEFENSIVE STRATEGY</div>
          <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.7, margin: 0 }}>{competitiveData.defense}</p>
        </Card>
        <Card highlight>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.accentLime, marginBottom: 10 }}>CONVERGENCE RISK</div>
          <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.7, margin: 0 }}>{competitiveData.convergenceRisk}</p>
        </Card>
      </div>
    </div>
  );
}

function FinancialsTab() {
  const [scenario, setScenario] = useState(0);
  const active = executiveSummary.scenarios[scenario];
  const years = ["Y1", "Y2", "Y3", "Y4", "Y5", "Y10", "Y15"];
  const keys = ["y1", "y2", "y3", "y4", "y5", "y10", "y15"];

  const fmt = (val) => {
    if (val === 0) return "—";
    const abs = Math.abs(val).toLocaleString();
    return val < 0 ? "(" + abs + ")" : abs;
  };

  return (
    <div className="fade-in">
      <SectionLabel mt={0}>SCENARIO SELECTOR</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {executiveSummary.scenarios.map((s, i) => (
          <button key={i} onClick={() => setScenario(i)} style={{
            padding: "10px 20px",
            border: "1px solid " + (scenario === i ? t.accentLime : t.border),
            background: scenario === i ? (t.accentLime + "18") : t.surface,
            color: scenario === i ? t.accentLime : t.text2,
            borderRadius: 6, cursor: "pointer",
            fontFamily: t.fontMono, fontSize: 11,
            fontWeight: scenario === i ? 700 : 400,
            transition: "all 0.15s",
          }}>
            {s.label} — WACC {s.wacc}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 32 }}>
        {[
          { label: "PROJECT IRR", value: active.projectIRR, cyan: true },
          { label: "EQUITY IRR", value: active.equityIRR, lime: true },
          { label: "NPV", value: active.npv },
          { label: "PAYBACK", value: active.payback },
          { label: "DSCR Y5", value: active.dscr },
        ].map(m => (
          <div key={m.label} style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1.5px", color: t.text2, marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 18, fontWeight: 700, color: m.lime ? t.accentLime : m.cyan ? t.accentCyan : t.text1 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <SectionLabel>INCOME STATEMENT (ZAR '000)</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "auto", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid " + t.border }}>
              <th style={{ padding: "10px 18px", textAlign: "left", fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2, fontWeight: 400, minWidth: 160 }}>LINE ITEM</th>
              {years.map(y => (
                <th key={y} style={{ padding: "10px 12px", textAlign: "right", fontFamily: t.fontMono, fontSize: 9, color: t.text2, fontWeight: 400 }}>{y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {financialsData.incomeStatement.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid " + t.border, background: row.highlight ? (t.accentLime + "0A") : "transparent" }}>
                <td style={{
                  padding: "11px 18px",
                  fontFamily: row.bold ? t.fontHead : t.fontBody,
                  fontSize: row.bold ? 13 : 12,
                  fontWeight: row.bold ? 700 : 400,
                  color: row.bold ? t.text1 : t.text2,
                }}>{row.item}</td>
                {keys.map(k => {
                  const val = row[k];
                  return (
                    <td key={k} style={{
                      padding: "11px 12px", textAlign: "right",
                      fontFamily: t.fontMono, fontSize: 11,
                      fontWeight: row.bold ? 700 : 400,
                      color: row.highlight ? t.accentLime : val < 0 ? "#F87171" : val === 0 ? t.text2 : t.text1,
                    }}>
                      {fmt(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "10px 18px", fontSize: 11, color: t.text2, borderTop: "1px solid " + t.border }}>
          Note: Revenue in Y1 reflects 10 sites at 50% capacity (commissioning year). Y3 onward reflects escalation at 5% p.a.
        </div>
      </div>

      <SectionLabel>DEPLOYMENT SCHEDULE</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 80px 100px 80px 130px 110px 1fr", padding: "10px 18px", borderBottom: "1px solid " + t.border }}>
          {["Year", "Sites", "Cumulative", "Staff", "Staff Cost", "CAPEX", "Note"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {financialsData.deploymentSchedule.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "60px 80px 100px 80px 130px 110px 1fr",
            padding: "12px 18px",
            borderBottom: i < 3 ? "1px solid " + t.border : "none",
            alignItems: "center",
          }}>
            <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.accentLime }}>{row.year}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 12, color: t.text1 }}>{row.sites}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 12, color: t.text1 }}>{row.cumulative}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2 }}>{row.staff}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2 }}>{row.staffCost}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentCyan }}>{row.capex}</span>
            <span style={{ fontSize: 12, color: t.text2 }}>{row.note}</span>
          </div>
        ))}
      </div>

      <SectionLabel>MONTE CARLO — 10,000 ITERATIONS</SectionLabel>
      <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 16 }}>{financialsData.monteCarlo.summary}</p>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 18px", borderBottom: "1px solid " + t.border }}>
          {["Metric", "Mean", "P10", "P50", "P90"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {financialsData.monteCarlo.stochastic.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            padding: "12px 18px",
            borderBottom: i < financialsData.monteCarlo.stochastic.length - 1 ? "1px solid " + t.border : "none",
          }}>
            <span style={{ fontSize: 12, color: t.text1 }}>{row.metric}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentLime }}>{row.mean}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2 }}>{row.p10}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2 }}>{row.p50}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentCyan }}>{row.p90}</span>
          </div>
        ))}
      </div>
      <Card blue style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: t.text1, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: t.accentCyan }}>Investor interpretation: </strong>{financialsData.monteCarlo.interpretation}
        </p>
      </Card>

      <SectionLabel>SECTION 12B TAX TREATMENT</SectionLabel>
      <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, marginBottom: 14 }}>{financialsData.tax12B.summary}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {financialsData.tax12B.batches.map((b, i) => (
          <div key={i} style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 9, color: t.text2, marginBottom: 6 }}>{b.batch}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.text1, marginBottom: 4 }}>{b.deduction}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentLime }}>Shield: {b.shield}</div>
          </div>
        ))}
        <Card highlight>
          <div style={{ fontFamily: t.fontMono, fontSize: 9, color: t.accentLime, marginBottom: 6 }}>TOTAL SHIELD</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.accentLime }}>{financialsData.tax12B.totalShield}</div>
        </Card>
      </div>
    </div>
  );
}

function GTMTab() {
  const priorityColor = { URGENT: t.accentLime, HIGH: t.accentCyan };
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>CONVERSION FUNNEL</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr", padding: "10px 18px", borderBottom: "1px solid " + t.border }}>
          {["Stage", "Count", "Conversion", "Source"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {gtmData.conversionFunnel.map((step, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 1.5fr",
            padding: "13px 18px",
            borderBottom: i < gtmData.conversionFunnel.length - 1 ? "1px solid " + t.border : "none",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 13, color: t.text1 }}>{step.stage}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 700, color: t.accentLime }}>{step.count}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentCyan }}>{step.conversion}</span>
            <span style={{ fontSize: 11, color: t.text2 }}>{step.source}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div>
          <SectionLabel mt={0}>PILOT STRATEGY</SectionLabel>
          <Card>
            <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentLime, fontWeight: 700, marginBottom: 14 }}>{gtmData.pilotStrategy.discount}</div>
            {gtmData.pilotStrategy.selectionCriteria.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: t.accentLime, marginTop: 2, flexShrink: 0 }}>◈</span>
                <span style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: "10px 14px", background: t.surfaceHigh, borderRadius: 6, fontSize: 11, color: t.text2, lineHeight: 1.5 }}>
              {gtmData.pilotStrategy.salesCycle}
            </div>
          </Card>
        </div>
        <div>
          <SectionLabel mt={0}>POSITIONING & KEY MESSAGES</SectionLabel>
          <Card>
            <div style={{ borderLeft: "3px solid " + t.accentLime, paddingLeft: 14, marginBottom: 16 }}>
              <p style={{ fontFamily: t.fontHead, fontSize: 13, fontWeight: 600, color: t.text1, lineHeight: 1.6, margin: 0 }}>{gtmData.positioning}</p>
            </div>
            {gtmData.keyMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: t.accentCyan, marginTop: 2, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>"{m}"</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <SectionLabel>PRIORITY PILOT TARGETS — TIER 7 DIRECT UCSA FIT</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {gtmData.priorityTargets.map((target, i) => (
          <div key={i} style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, color: t.border, minWidth: 36, flexShrink: 0 }}>0{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text1 }}>{target.name}</div>
              <div style={{ fontSize: 12, color: t.text2, marginTop: 2 }}>{target.location} · {target.description}</div>
            </div>
            <span style={{
              background: (priorityColor[target.priority] || t.text2) + "22",
              color: priorityColor[target.priority] || t.text2,
              fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px",
              padding: "4px 10px", borderRadius: 3, whiteSpace: "nowrap",
            }}>
              {target.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTab() {
  const scoreColor = (score) => {
    if (score >= 16) return "#F87171";
    if (score >= 10) return t.accentLime;
    return t.accentCyan;
  };
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>MILESTONE-LINKED HIRING (CRITICAL STRUCTURAL FIX)</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 60px 110px 2fr 1fr", padding: "10px 18px", borderBottom: "1px solid " + t.border }}>
          {["Milestone", "Staff", "Cost", "Key Roles Added", "Impact"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {teamData.milestoneHiring.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1.5fr 60px 110px 2fr 1fr",
            padding: "14px 18px",
            borderBottom: i < 3 ? "1px solid " + t.border : "none",
            alignItems: "start", gap: 8,
          }}>
            <span style={{ fontFamily: t.fontHead, fontSize: 13, fontWeight: 600, color: t.accentLime }}>{row.milestone}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 16, fontWeight: 700, color: t.text1 }}>{row.headcount}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text1 }}>{row.cost}</span>
            <span style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{row.roles}</span>
            <span style={{ fontSize: 12, color: t.text2, lineHeight: 1.5 }}>{row.impact}</span>
          </div>
        ))}
      </div>
      <div style={{ background: t.accentLime + "12", border: "1px solid " + t.accentLime + "44", borderRadius: 8, padding: "14px 18px", marginBottom: 14 }}>
        <p style={{ fontFamily: t.fontMono, fontSize: 12, color: t.accentLime, margin: 0 }}>◈ {teamData.hiringImpact}</p>
      </div>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "14px 18px", marginBottom: 32 }}>
        <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "2px", color: t.text2, marginBottom: 8 }}>ADVISORY BOARD</div>
        <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, margin: 0 }}>{teamData.advisory}</p>
      </div>

      <SectionLabel>RISK REGISTER — 12 RISKS IDENTIFIED & MITIGATED</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "28px 1.5fr 70px 70px 48px 2fr 1.2fr", padding: "10px 14px", borderBottom: "1px solid " + t.border, minWidth: 800 }}>
          {["#", "Risk", "Prob", "Impact", "Score", "Mitigation", "Trigger"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {riskData.map((risk, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "28px 1.5fr 70px 70px 48px 2fr 1.2fr",
            padding: "12px 14px",
            borderBottom: i < riskData.length - 1 ? "1px solid " + t.border : "none",
            alignItems: "start", gap: 8, minWidth: 800,
          }}>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2 }}>{risk.id}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.text1, lineHeight: 1.4 }}>{risk.risk}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2 }}>{risk.prob}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2 }}>{risk.impact}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 700, color: scoreColor(risk.score) }}>{risk.score}</span>
            <span style={{ fontSize: 11, color: t.text2, lineHeight: 1.5 }}>{risk.mitigation}</span>
            <span style={{ fontSize: 11, color: t.text2, lineHeight: 1.5, fontStyle: "italic" }}>{risk.trigger}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExitTab() {
  return (
    <div className="fade-in">
      <SectionLabel mt={0}>EXIT OPTIONS</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40 }}>
        {exitData.options.map(opt => (
          <Card key={opt.label} blue={opt.highlight}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2 }}>{opt.label}</span>
              {opt.highlight && <span style={{ background: t.accentBlue, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "1px", padding: "3px 8px", borderRadius: 3 }}>PREFERRED</span>}
            </div>
            <div style={{ fontFamily: t.fontHead, fontSize: 20, fontWeight: 700, color: t.text1, marginBottom: 4 }}>{opt.title}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 10, color: opt.highlight ? t.accentBlue : t.text2, marginBottom: 16 }}>{opt.timing} · {opt.multiple}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 24, fontWeight: 700, color: t.accentLime, marginBottom: 16 }}>{opt.value}</div>
            <p style={{ fontSize: 12, color: t.text2, lineHeight: 1.6, margin: 0 }}>{opt.note}</p>
          </Card>
        ))}
      </div>

      <SectionLabel>CAPITAL STRUCTURE — THREE SCENARIOS</SectionLabel>
      <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.5fr 1fr 1fr 1fr 70px", padding: "10px 18px", borderBottom: "1px solid " + t.border }}>
          {["Scenario", "Senior Debt", "Equity", "Mezz/Bridge", "Grants", "WACC"].map(h => (
            <span key={h} style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: "1px", color: t.text2 }}>{h}</span>
          ))}
        </div>
        {exitData.capitalStructure.scenarios.map((s, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1.3fr 1.5fr 1fr 1fr 1fr 70px",
            padding: "14px 18px",
            borderBottom: i < 2 ? "1px solid " + t.border : "none",
            alignItems: "center", gap: 8,
          }}>
            <span style={{ fontFamily: t.fontHead, fontSize: 12, fontWeight: 600, color: t.text1 }}>{s.label}</span>
            <span style={{ fontSize: 11, color: t.text2 }}>{s.seniorDebt}</span>
            <span style={{ fontSize: 11, color: t.text2 }}>{s.equity}</span>
            <span style={{ fontSize: 11, color: t.text2 }}>{s.mezz}</span>
            <span style={{ fontSize: 11, color: t.text2 }}>{s.grants}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 15, fontWeight: 700, color: t.accentLime }}>{s.wacc}</span>
          </div>
        ))}
      </div>

      <SectionLabel>FINANCING PATHWAY</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {exitData.capitalStructure.pathway.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: t.surface, border: "1px solid " + t.border, borderRadius: 8, padding: "14px 18px" }}>
            <div style={{
              background: t.accentLime, color: t.bg,
              fontFamily: t.fontMono, fontSize: 10, fontWeight: 700,
              width: 24, height: 24, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: 1,
            }}>{i + 1}</div>
            <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.6, margin: 0 }}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN SHELL ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "market", label: "Market" },
  { id: "model", label: "Business Model" },
  { id: "competitive", label: "Competitive" },
  { id: "financials", label: "Financials" },
  { id: "gtm", label: "Go-to-Market" },
  { id: "team", label: "Team & Risk" },
  { id: "exit", label: "Exit" },
];

export default function InvestmentCase() {
  const [tab, setTab] = useState("summary");

  return (
    <div>
      <div style={{ borderBottom: "1px solid " + t.border, position: "sticky", top: 0, zIndex: 20, background: t.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              padding: "13px 20px",
              border: "none", background: "transparent", cursor: "pointer",
              fontFamily: t.fontMono, fontSize: 11, letterSpacing: "0.5px",
              fontWeight: tab === tb.id ? 700 : 400,
              color: tab === tb.id ? t.accentLime : t.text2,
              borderBottom: tab === tb.id ? ("2px solid " + t.accentLime) : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all 0.15s",
            }}>
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 80px" }}>
        {tab === "summary" && <SummaryTab />}
        {tab === "market" && <MarketTab />}
        {tab === "model" && <ModelTab />}
        {tab === "competitive" && <CompetitiveTab />}
        {tab === "financials" && <FinancialsTab />}
        {tab === "gtm" && <GTMTab />}
        {tab === "team" && <TeamTab />}
        {tab === "exit" && <ExitTab />}
      </div>
    </div>
  );
}
