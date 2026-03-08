import { useState } from "react";
import { theme } from "./theme";

const pillars = [
  {
    id: "intelligence",
    title: "Intelligence Layer",
    subtitle: "From Cloud Storage → Edge+Cloud Predictive Engine",
    icon: "◈",
    accent: "#34D399",
    currentState: "The Systems Plan allocates ZAR 180–360K for a cloud database and ZAR 90K for APIs. This gives storage — not intelligence. Architecture assumes reliable broadband at every site, which SA's connectivity reality doesn't support.",
    vision: "Build a hybrid edge+cloud data platform. Edge devices at each site run inference models locally (fault detection, basic dispatch) while cloud aggregates portfolio intelligence. IoT telemetry, weather, Eskom schedules, COCT tariffs, and Netvendor vending data flow into a unified lake. AI doesn't just report — it predicts and prescribes.",
    partners: "SmartHelio Autopilot (physics-informed AI, no extra hardware, 8% performance boost, Africa expansion) · Open Access Energy (SA-native, distributed energy focus) · Meteocontrol VCOM Cloud (41,000+ systems, manufacturer-agnostic)",
    opportunities: [
      {
        name: "AI Site Assessment Engine",
        description: "Satellite imagery (Google Solar API) + municipal consumption data + load profiles → automated system sizing in minutes. Train on first 10 pilot sites, improve with each deployment. Competitive scan confirms Aurora Solar (20M+ projects) and OpenSolar (free, AI-powered) as design partners.",
        impact: "Proposals from 2-3 days to 2-3 hours",
        tools: "Google Solar API, OpenSolar/Aurora, Python/TensorFlow",
        cost: "ZAR 150–250K build",
        priority: "high"
      },
      {
        name: "Edge-Deployed Fault Detection",
        description: "Lightweight ML models trained in cloud, deployed at edge. 92.8% fault detection accuracy on-device (ABB benchmark). Works during internet outages — critical for SA connectivity. Flags inverter anomalies, battery degradation, production drops locally, syncs to cloud when connected.",
        impact: "Sub-second anomaly detection vs. minutes for cloud roundtrip. Works offline.",
        tools: "Edge compute (Raspberry Pi 4/Jetson Nano), TensorFlow Lite, MQTT",
        cost: "ZAR 8-12K per site hardware + ZAR 200K model development",
        priority: "high"
      },
      {
        name: "Portfolio Digital Twin",
        description: "Real-time simulation of all 50 sites. Each site has a physics-based digital twin comparing actual vs. predicted performance. The scan found one site lost 35% output undetected for 3 months pre-digital-twin. SmartHelio's solarGPT enables natural-language querying of plant data.",
        impact: "1 person manages what currently needs 3-4. 8% performance uplift (SmartHelio benchmark).",
        tools: "SmartHelio Autopilot or custom React + InfluxDB + edge gateway",
        cost: "ZAR 200–350K build + ZAR 5-8K/month",
        priority: "high"
      },
      {
        name: "Energy Yield Forecasting",
        description: "ML model combining weather data, panel degradation curves, and real consumption patterns. Forecasts production 72 hours ahead for dynamic grid export optimization (sell when COCT prices peak via Cash for Power program — already R30.8M+ in credits).",
        impact: "10-15% improvement in SSEG export revenue",
        tools: "Weather APIs, Prophet/LSTM models, COCT feed-in tariff API",
        cost: "ZAR 180–300K development",
        priority: "medium"
      }
    ]
  },
  {
    id: "automation",
    title: "Automation Engine",
    subtitle: "From Manual Processes → Self-Running Operations",
    icon: "⚡",
    accent: "#A78BFA",
    currentState: "The Systems Plan budgets ZAR 126–180K for proposal generation and ZAR 108K for billing. These are individual tools, not an integrated automation engine. No workflow chaining between systems.",
    vision: "Chain every process into automated workflows where human involvement is the exception. The scan confirms portfolio-scale platforms now manage 200,000+ sites with automated ticketing and smart dispatch. For UCSA's 50 sites, 2-3 ops staff should manage the entire portfolio.",
    partners: "Monday.com (CRM + project hub) · Make.com (workflow automation) · Scoop Solar (250,000+ sites managed) · Volter (PPA billing automation, launched Aug 2024) · FieldPulse (technician dispatch)",
    opportunities: [
      {
        name: "Lead-to-Proposal Pipeline",
        description: "Body corporate contacts website → AI qualifies lead (estate size, consumption, roof area from satellite) → auto-generates customised financial proposal with site-specific ROI → sends via automated sequence. Sales team only touches high-intent leads. Pipeline target: 40% close rate.",
        impact: "3x pipeline throughput with same sales team",
        tools: "Monday.com + Make.com + AI site assessment + e-signature",
        cost: "ZAR 100–180K build + ZAR 8-12K/month",
        priority: "high"
      },
      {
        name: "Netvendor Revenue Automation",
        description: "Full billing cycle: IoT meters → PPA charges + Netvendor commission split → auto-invoices → payment collection → bank feed reconciliation → arrears flagging. The ZAR 6M/year commission revenue runs itself. Volter (purpose-built PPA billing) or custom integration.",
        impact: "Eliminates 1-2 finance positions (ZAR 500-800K/year saved)",
        tools: "Netvendor API, Volter or Xero integration, Make.com",
        cost: "ZAR 200–350K build",
        priority: "high"
      },
      {
        name: "Predictive Maintenance Dispatch",
        description: "Edge sensors detect anomalies → ML classifies severity → auto-creates tickets → dispatches nearest technician with parts list → mobile app confirmation → client portal update. Scan benchmark: predictive maintenance cuts costs up to 40%.",
        impact: "15-20% downtime reduction, 30% fewer emergency callouts",
        tools: "Edge ML + Monday.com/FieldPulse + mobile PWA",
        cost: "ZAR 250–400K build",
        priority: "medium"
      },
      {
        name: "Regulatory & Compliance Autopilot",
        description: "Auto-generates SSEG applications for COCT, tracks permit status, manages NERSA registration, auto-files compliance reports. Each new site follows a templatised workflow. Critical for scaling from 10 to 50 sites without adding admin staff.",
        impact: "Project onboarding from weeks to days",
        tools: "Docassemble, workflow engine, SignRequest",
        cost: "ZAR 80–150K build",
        priority: "medium"
      }
    ]
  },
  {
    id: "trading",
    title: "Energy Trading & Grid Intelligence",
    subtitle: "From Static PPAs → Dynamic Energy Platform",
    icon: "◇",
    accent: "#F59E0B",
    currentState: "The business plan models PPA and commission as flat revenue streams with simple escalation. No consideration of virtual wheeling, VPP aggregation, carbon monetization, or dynamic pricing. This leaves ZAR 4-6M/year on the table.",
    vision: "Transform UCSA's 50-site battery fleet into a tradeable energy portfolio. Virtual wheeling enables many-to-many trading across 168 municipalities. Carbon credits from 9,300 tons CO₂/year generate ZAR 1.7-2.3M annually. EV charging adds 6-9% revenue. The scan identifies this as 'the single highest-impact strategic development.'",
    partners: "Vodacom/Mezzanine (virtual wheeling, 168 municipalities) · Asoba Energy (VPP orchestration, SA-native) · Stem/AlsoEnergy PowerTrack (battery dispatch optimization, 5.6 GWh managed) · Gold Standard/Verra (carbon credit registration)",
    opportunities: [
      {
        name: "Virtual Wheeling Integration",
        description: "Vodacom's Mezzanine platform enables many-to-many energy trading across 168 municipalities without physical infrastructure changes. UCSA's distributed portfolio can sell excess generation to off-site buyers. This transforms economics from per-site to portfolio-level optimization.",
        impact: "Potentially 15-25% revenue uplift on export energy",
        tools: "Mezzanine platform API, PowerX/Etana partnerships, NERSA registration",
        cost: "ZAR 150–250K integration + licensing",
        priority: "high"
      },
      {
        name: "Virtual Power Plant Aggregation",
        description: "Aggregate 50-site battery fleet for grid services. Sunrun validates this: 217,000 systems dispatching 18 GWh, 416 MW peak output. As SA's capacity market develops, UCSA's fleet becomes a dispatchable asset. Asoba Energy's Ona platform is purpose-built for African VPP orchestration.",
        impact: "New revenue stream from grid services (ZAR 500K-1.5M/year at scale)",
        tools: "Asoba Ona platform or Stem Athena, battery fleet API, grid operator interface",
        cost: "ZAR 200–350K build",
        priority: "medium"
      },
      {
        name: "Carbon Credit Monetization",
        description: "9,300 tons CO₂ avoided annually across the portfolio. At voluntary market prices (ZAR 180-250/ton in SA 2026), that's immediate revenue. Register under Gold Standard or Verra — 4-6 month process. DFI funders love this for ESG reporting.",
        impact: "ZAR 1.7–2.3M extra annual revenue from Year 2",
        tools: "Gold Standard/Verra registration, ESG reporting platform",
        cost: "ZAR 250-300K registration + annual audit",
        priority: "high"
      },
      {
        name: "EV Charging Network",
        description: "Every site has parking. Add 4-8 EV chargers per site at marginal capex. Charge R4.50/kWh + 15% margin. Cape Town EV adoption is accelerating (GreenCape 2026 data). Low-hanging fruit that future-proofs assets and increases site stickiness.",
        impact: "+6-9% portfolio revenue by Year 4",
        tools: "EV charger hardware, billing integration, load management",
        cost: "ZAR 80-120K per site",
        priority: "medium"
      }
    ]
  },
  {
    id: "engagement",
    title: "Client Intelligence Platform",
    subtitle: "From Portal → Retention & Upsell Engine",
    icon: "◉",
    accent: "#F87171",
    currentState: "The Systems Plan allocates ZAR 180–270K for a client portal and ZAR 90K for a chatbot. Standard features every solar company will eventually offer. No competitive differentiation.",
    vision: "Build a client experience so good it becomes your #1 sales tool. Body corporates hear about it from existing clients. The portal makes the business case for expansion, referrals, and long-term retention. Globally, no competitor offers this for residential estates — the scan found UCSA's integrated model is genuinely rare among 50+ companies profiled.",
    partners: "Ivy Energy (closest US analogue for tenant billing) · Allume Energy (physical solar distribution, 2,300+ apartments) · Bboxx Pulse (500,000+ systems managed with integrated billing — platform logic is directly transferable)",
    opportunities: [
      {
        name: "Body Corporate Decision Dashboard",
        description: "Purpose-built for trustees to present at AGMs. Shows: total savings, pre-solar comparison, CO₂ reduction (feeding carbon credit data), levy impact, projected savings, and ESG score. Auto-generates PDF AGM report each quarter. No competitor offers this.",
        impact: "Directly addresses decision-maker needs (justify investment to residents)",
        tools: "React dashboard, automated PDF, email scheduling",
        cost: "ZAR 150–250K build",
        priority: "high"
      },
      {
        name: "AI-Powered Expansion Engine",
        description: "Automatically identifies upsell: 'Site X consumption grew 15% — recommend battery upgrade' or 'Estate Y has unused roof for 40kWp expansion.' Auto-sends proposals with financial projections. Adds EV charging recommendations where parking utilization is high.",
        impact: "5-8% annual organic revenue growth within existing portfolio",
        tools: "Custom analytics, automated proposal generation, CRM triggers",
        cost: "ZAR 100–180K build",
        priority: "medium"
      },
      {
        name: "Tenant Energy App",
        description: "Mobile-first app showing consumption, costs, solar contribution. Gamification (compare neighbours, monthly badges). Integrates Netvendor for prepaid top-ups. EV charging session tracking. Drives tenant satisfaction, reduces body corporate support burden.",
        impact: "40% reduction in support queries, improved tenant retention",
        tools: "React Native / PWA, Netvendor API, push notifications",
        cost: "ZAR 200–350K build",
        priority: "low"
      }
    ]
  },
  {
    id: "financial",
    title: "Financial Command Centre",
    subtitle: "From Spreadsheets → Real-Time Investor Intelligence",
    icon: "◆",
    accent: "#38BDF8",
    currentState: "Financial models and investor reporting exist as static spreadsheets and quarterly PDFs. The Monte Carlo simulation (10,000 iterations, stochastic mean project IRR 4.1%) is powerful — but only accessible to people who read the business plan.",
    vision: "Live financial data flowing from operations into investor-grade dashboards. Every ZAR tracked in real-time. Investors get a login — not quarterly PDFs. The scan confirms: most renewable portfolios report quarterly at best. This alone differentiates UCSA in fundraising and can meaningfully reduce cost of capital for DFI funders.",
    partners: "Power Factors Unity (end-to-end asset management, #1 ranked EMS) · Fluence Digital/Nispera (explicitly targets Africa, 15+ GW managed) · Custom financial engine for SA-specific metrics (Section 12B, DSCR, CEIT modelling)",
    opportunities: [
      {
        name: "Real-Time Portfolio IRR Tracker",
        description: "Live IRR, NPV, and DSCR based on actual cash flows — not projections. Compares actuals vs. business plan. Early warning when metrics trend below threshold. Integrates Monte Carlo confidence bands (deterministic 15.2% project IRR; stochastic P10: −1.5%, P50: 4.0%, P90: 9.7%).",
        impact: "Massive investor confidence — transforms fundraising conversations",
        tools: "Custom financial engine, real-time billing/Netvendor feeds, React dashboard",
        cost: "ZAR 200–350K build",
        priority: "high"
      },
      {
        name: "Automated Investor Reporting",
        description: "Monthly reports auto-generated: portfolio performance, revenue breakdown, maintenance events, ESG/carbon metrics, cash flow vs. projections. White-labelled per investor class (DFI, equity, bond holders). Includes carbon credits generated and EV charging revenue.",
        impact: "Eliminates 40+ hours/month manual reporting",
        tools: "Automated report generation, data pipeline, email distribution",
        cost: "ZAR 120–200K build",
        priority: "medium"
      },
      {
        name: "Scenario & Exit Modelling Engine",
        description: "Interactive 'what if' tool: add 10 sites? Tariff growth slows? Refinance at Year 5? Model CEIT spin-off at Year 7 vs. trade sale at Year 10 (8-9x EBITDA, ~ZAR 320-380M). Live recalculation of all metrics. Stress-test any assumption.",
        impact: "Accelerates strategic decisions, powers investor conversations",
        tools: "Custom financial model API, interactive React frontend",
        cost: "ZAR 150–250K build",
        priority: "low"
      }
    ]
  }
];

const teamPhases = {
  phases: [
    {
      year: "Year 1",
      sites: "10 sites (reference installs)",
      headcount: 12,
      cost: "ZAR 8.2M",
      roles: [
        { role: "Managing Director", count: 1, cost: 1200, note: "Strategy + investor relations + first closes" },
        { role: "Data Engineer", count: 1, cost: 800, note: "Builds edge+cloud infrastructure" },
        { role: "AI Developer", count: 1, cost: 900, note: "ML models, digital twin, site assessment engine" },
        { role: "Project Managers", count: 2, cost: 1200, note: "10 pilot sites — AI handles scheduling" },
        { role: "Sales / BD", count: 2, cost: 1000, note: "Pipeline building while AI qualifies leads" },
        { role: "Field Technicians", count: 4, cost: 1600, note: "Installation + first maintenance baselines" },
        { role: "Metering Specialist", count: 1, cost: 600, note: "Netvendor integration + edge meter setup" },
      ]
    },
    {
      year: "Year 2",
      sites: "+20 sites (scale)",
      headcount: 15,
      cost: "ZAR 9.5M",
      roles: [
        { role: "Managing Director", count: 1, cost: 1200, note: "DFI relationships + Round 2 fundraising" },
        { role: "Data Engineer", count: 1, cost: 800, note: "Maintains automation stack + edge fleet" },
        { role: "AI Developer", count: 1, cost: 900, note: "Models trained on 10-site pilot data" },
        { role: "Project Managers", count: 3, cost: 1800, note: "AI-assisted — each manages 10+ sites" },
        { role: "Sales / BD", count: 3, cost: 1500, note: "AI proposals flowing — they close deals" },
        { role: "Field Technicians", count: 5, cost: 2000, note: "Predictive dispatch reduces per-site visits" },
        { role: "Metering Specialist", count: 1, cost: 600, note: "Carbon credit registration + EV prep" },
      ]
    },
    {
      year: "Year 3",
      sites: "+15 sites + steady state",
      headcount: 18,
      cost: "ZAR 10.5M",
      roles: [
        { role: "Managing Director", count: 1, cost: 1200, note: "CEIT feasibility + Phase 2 planning" },
        { role: "Full-Stack Engineers", count: 2, cost: 1600, note: "Replaced separate data/AI roles — stack is mature" },
        { role: "Ops Manager", count: 1, cost: 700, note: "Digital twin monitors 50 sites from one desk" },
        { role: "Project Managers", count: 4, cost: 2400, note: "Each manages 12+ sites via automation" },
        { role: "Sales / BD", count: 3, cost: 1500, note: "Expansion engine generating organic leads" },
        { role: "Field Technicians", count: 6, cost: 2400, note: "Predictive dispatch — 25% fewer visits than traditional" },
        { role: "Admin / Support", count: 1, cost: 300, note: "Finance automation reduces admin need" },
      ]
    }
  ],
  comparison: {
    traditional: { label: "Traditional Model (20 people)", cost: "ZAR 11.5M/yr" },
    ucsa_y3: { label: "UCSA AI-Augmented (18 people, Y3)", cost: "ZAR 10.5M/yr" },
    ucsa_equivalent: { label: "Equivalent traditional output", cost: "~ZAR 16M/yr" },
    effective_savings: "ZAR 5.5M/yr effective leverage (34%)"
  }
};

const phases = [
  {
    phase: "Phase 0 — Foundation",
    duration: "Months 1–2",
    focus: "Connective tissue before custom builds",
    tasks: [
      "Monday.com as central CRM + project hub",
      "Make.com for workflow automation (connects everything)",
      "Xero/QuickBooks for automated financial tracking",
      "Cloud infrastructure (AWS/Vercel) + edge device procurement",
      "Map every manual process → identify 5 highest-ROI automations",
      "Engage SmartHelio / Open Access Energy for platform evaluation"
    ],
    cost: "ZAR 80–120K",
    outcome: "Operational backbone in place, team aligned on digital-first workflows"
  },
  {
    phase: "Phase 1 — Sales Intelligence",
    duration: "Months 2–5",
    focus: "Revenue first — 10 reference installs (de-risked from 15)",
    tasks: [
      "Build AI Site Assessment Engine (satellite + consumption → sizing)",
      "Automated proposal pipeline with financial calculator",
      "Lead scoring + automated nurture sequences",
      "Body corporate interactive ROI tool",
      "CRM → proposal → e-signature → project kickoff chain",
      "First 2-3 sites as bankable reference installs for DFIs"
    ],
    cost: "ZAR 250–400K",
    outcome: "10 pilot proposals in half the time. Bankable performance data for Round 2."
  },
  {
    phase: "Phase 2 — Operations & Edge",
    duration: "Months 4–8",
    focus: "Build the operational engine as first 10 sites go live",
    tasks: [
      "Deploy edge compute + IoT monitoring across pilot sites",
      "Build digital twin dashboard (SmartHelio or custom)",
      "Netvendor billing automation pipeline (Volter evaluation)",
      "Predictive maintenance ML (rule-based initially, evolves with data)",
      "Regulatory compliance automation workflows",
      "Begin VPP architecture and virtual wheeling partner integration"
    ],
    cost: "ZAR 400–600K",
    outcome: "Pilot sites at 70% less manual intervention. Edge infrastructure proven."
  },
  {
    phase: "Phase 3 — Trading & Client Platform",
    duration: "Months 7–11",
    focus: "Revenue expansion + retention + fundraising tools",
    tasks: [
      "Launch body corporate decision dashboard with ESG metrics",
      "Deploy real-time portfolio IRR tracker for investors",
      "Automated investor reporting (white-labelled per class)",
      "Virtual wheeling integration (Mezzanine platform)",
      "Carbon credit registration (Gold Standard / Verra)",
      "Expansion engine (automated upsell identification)"
    ],
    cost: "ZAR 350–500K",
    outcome: "Investor-ready platform. Carbon credits generating. Virtual wheeling live."
  },
  {
    phase: "Phase 4 — Scale & Optimise",
    duration: "Months 10–16",
    focus: "Refine with real data, prepare 25→50 expansion",
    tasks: [
      "Train ML models on 10-site pilot data (sizing, maintenance, yield)",
      "Optimise billing/collection based on actuals vs. projections",
      "Scenario + CEIT exit modelling engine",
      "EV charging rollout across high-parking sites",
      "Dynamic pricing (time-of-use + Backup Premium tariff option)",
      "Document + templatise for rapid site onboarding"
    ],
    cost: "ZAR 200–350K",
    outcome: "Self-improving system. Each new site makes the model smarter. EV revenue flowing."
  }
];

const insights = [
  {
    title: "Globally Rare — That's the Moat",
    content: "Across 50+ companies profiled worldwide, no single entity combines generation + storage + prepaid billing + AI portfolio management targeting residential estates. PowerGen (Kenya) serves off-grid communities. Ivy Energy (US) doesn't own assets. Citiq has meters but no solar. GoSolr has solar but no integrated billing. The convergence from both sides validates UCSA's position — this is a market opportunity, not an untested experiment."
  },
  {
    title: "The Data Flywheel",
    content: "Every site generates training data for better models. Site #50 will be sized more accurately, maintained more cheaply, and generate more revenue than Site #1. SmartHelio proves physics-informed AI delivers 8% performance gains at <0.1% of revenue cost. This compounding advantage is nearly impossible for competitors to replicate without their own portfolio data."
  },
  {
    title: "Virtual Wheeling Changes Everything",
    content: "Vodacom's Mezzanine platform enables many-to-many energy trading across 168 municipalities without physical infrastructure changes. Combined with Cape Town's Cash for Power (R30.8M+ in credits), this transforms UCSA from per-site economics to portfolio-level energy trading. The competitive scan identifies this as the single highest-impact strategic development for the business."
  },
  {
    title: "Capital Discipline Over Growth Velocity",
    content: "Sunnova ($10.67B debt, bankrupt June 2025), SunPower (bankrupt 2024), Solar Mosaic (bankrupt 2025) — all failed from overleveraged growth. The consultant's advice to slow Y1 to 10 sites is correct. Reference installs generate bankable data, reduce peak liquidity draw by ~ZAR 12M, and prove the AI platform before scaling. The Monte Carlo shows <4% negative NPV probability — don't erode that margin by over-running Year 1."
  },
  {
    title: "ZAR 4-6M/Year Left on the Table",
    content: "Carbon credits (ZAR 1.7-2.3M/yr), EV charging (+6-9% revenue by Y4), and Backup Premium tariff (+3-5% margin) aren't in the base model. These are quick wins that compound over the 15-year portfolio life. Carbon registration costs ZAR 250-300K and takes 4-6 months. EV chargers at ZAR 80-120K/site pay back in under 2 years."
  },
  {
    title: "Platform Company, Not Solar Installer",
    content: "The exit modelling matters: a well-run solar installer trades at 4-5x EBITDA. A data-driven energy platform with compounding AI advantages trades at 8-9x. At Y10 EBITDA of ~ZAR 22M, that's the difference between a ZAR 88-110M exit and a ZAR 176-198M exit. Every pillar in this ops model should be evaluated through that lens — does this build platform value or just operational efficiency?"
  }
];

function PriorityTag({ priority }) {
  const config = {
    high: { color: "#34D399", label: "HIGH" },
    medium: { color: "#FBBF24", label: "MED" },
    low: { color: "#94A3B8", label: "LATER" }
  };
  const c = config[priority];
  return (
    <span style={{
      color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
      border: `1px solid ${c.color}33`, padding: "2px 8px", borderRadius: 3
    }}>
      {c.label}
    </span>
  );
}

export default function OpsModel() {
  const [tab, setTab] = useState("pillars");
  const [openPillar, setOpenPillar] = useState(null);
  const [openOpp, setOpenOpp] = useState(null);
  const [teamYear, setTeamYear] = useState(0);

  const font = theme.fontMono;
  const bodyFont = theme.fontBody;
  const bg = theme.bg;
  const surface = theme.surface;
  const border = theme.border;
  const text1 = theme.text1;
  const text2 = theme.text2;
  const accent = theme.accentLime;

  const tabs = [
    { id: "pillars", label: "Pillars" },
    { id: "team", label: "Team" },
    { id: "roadmap", label: "Roadmap" },
    { id: "insights", label: "Insights" }
  ];

  const metrics = [
    { label: "CAPEX", value: "ZAR 165M" },
    { label: "PROJECT IRR", value: "15.2%" },
    { label: "EQUITY IRR", value: "21–23%" },
    { label: "NPV (BASE)", value: "ZAR 22–28M" },
    { label: "PAYBACK", value: "7.5yr" },
  ];

  return (
    <div style={{ fontFamily: bodyFont, background: bg, minHeight: "100vh", color: text1 }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${border}`, padding: "24px 28px 20px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ fontFamily: font, fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: text1, lineHeight: 1.3 }}>
            Advanced Operational Model
          </h2>
          <p style={{ fontSize: 14, color: text2, margin: "0 0 20px", maxWidth: 600, lineHeight: 1.6 }}>
            Five-pillar intelligence platform for a 50-site solar portfolio. Refined against global competitive scan of 50+ companies and stress-tested financial model.
          </p>

          {/* Metrics strip */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {metrics.map((m, i) => (
              <div key={i} style={{
                background: surface, border: `1px solid ${border}`, borderRadius: 6,
                padding: "8px 14px", minWidth: 100
              }}>
                <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "1.5px", color: text2, marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: i === 1 ? accent : text1 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 20, background: bg }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "12px 20px", border: "none", background: "transparent", cursor: "pointer",
              fontFamily: font, fontSize: 12, letterSpacing: "0.5px", fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? accent : text2,
              borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent",
              transition: "all 0.15s"
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 28px 64px" }}>

        {/* ═══════════ PILLARS ═══════════ */}
        {tab === "pillars" && (
          <div className="fade-in">
            <p style={{ fontSize: 14, color: text2, lineHeight: 1.7, marginBottom: 28, maxWidth: 680 }}>
              Five interconnected capabilities that compound in value. Each pillar feeds the others — intelligence improves automation, automation enables trading, trading funds engagement, engagement generates data for intelligence. Built on findings from a global scan of 50+ comparable companies.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pillars.map(p => {
                const isOpen = openPillar === p.id;
                return (
                  <div key={p.id} style={{ background: surface, border: `1px solid ${isOpen ? p.accent + "44" : border}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.2s" }}>
                    <button onClick={() => { setOpenPillar(isOpen ? null : p.id); setOpenOpp(null); }} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 20px", border: "none", background: "transparent",
                      cursor: "pointer", textAlign: "left"
                    }}>
                      <span style={{ fontFamily: font, fontSize: 20, color: p.accent }}>{p.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: text1 }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: text2, marginTop: 2 }}>{p.subtitle}</div>
                      </div>
                      <span style={{ fontFamily: font, fontSize: 14, color: text2, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                    </button>

                    {isOpen && (
                      <div className="fade-in" style={{ padding: "0 20px 20px" }}>
                        {/* Current vs Vision */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                          <div style={{ background: "#1A0A0A", border: "1px solid #2D1515", borderRadius: 6, padding: 14 }}>
                            <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "1.5px", color: "#F87171", marginBottom: 6 }}>CURRENT PLAN</div>
                            <div style={{ fontSize: 12, lineHeight: 1.65, color: text2 }}>{p.currentState}</div>
                          </div>
                          <div style={{ background: "#0A1A14", border: `1px solid ${p.accent}22`, borderRadius: 6, padding: 14 }}>
                            <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "1.5px", color: p.accent, marginBottom: 6 }}>ADVANCED VISION</div>
                            <div style={{ fontSize: 12, lineHeight: 1.65, color: text2 }}>{p.vision}</div>
                          </div>
                        </div>

                        {/* Partners */}
                        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
                          <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "1.5px", color: text2, marginBottom: 4 }}>RECOMMENDED PARTNERS</div>
                          <div style={{ fontSize: 12, color: text1, lineHeight: 1.6 }}>{p.partners}</div>
                        </div>

                        {/* Opportunities */}
                        <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "1.5px", color: text2, marginBottom: 10 }}>OPPORTUNITIES</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {p.opportunities.map((opp, i) => {
                            const key = `${p.id}-${i}`;
                            const isExp = openOpp === key;
                            return (
                              <div key={i} style={{ border: `1px solid ${border}`, borderRadius: 6, overflow: "hidden" }}>
                                <button onClick={() => setOpenOpp(isExp ? null : key)} style={{
                                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                  padding: "10px 14px", border: "none", background: isExp ? bg : "transparent",
                                  cursor: "pointer", textAlign: "left"
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: text1 }}>{opp.name}</span>
                                    <PriorityTag priority={opp.priority} />
                                  </div>
                                  <span style={{ fontFamily: font, fontSize: 12, color: text2 }}>{isExp ? "−" : "+"}</span>
                                </button>
                                {isExp && (
                                  <div className="fade-in" style={{ padding: "0 14px 14px", background: bg }}>
                                    <p style={{ fontSize: 12, lineHeight: 1.7, color: text2, margin: "0 0 12px" }}>{opp.description}</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                      {[
                                        { label: "IMPACT", value: opp.impact, color: accent },
                                        { label: "TOOLS", value: opp.tools, color: "#A78BFA" },
                                        { label: "COST", value: opp.cost, color: "#FBBF24" }
                                      ].map((d, j) => (
                                        <div key={j} style={{ background: surface, borderRadius: 4, padding: "8px 10px" }}>
                                          <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "1px", color: d.color, marginBottom: 3 }}>{d.label}</div>
                                          <div style={{ fontSize: 11, color: text2, lineHeight: 1.5 }}>{d.value}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════ TEAM ═══════════ */}
        {tab === "team" && (
          <div className="fade-in">
            <p style={{ fontSize: 14, color: text2, lineHeight: 1.7, marginBottom: 24, maxWidth: 680 }}>
              Phased hiring that scales people with automation — not before it. The goal isn't fewer people; it's making each person dramatically more effective. A PM with AI schedules and a digital twin manages 12+ sites instead of 5.
            </p>

            {/* Year selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {teamPhases.phases.map((tp, i) => (
                <button key={i} onClick={() => setTeamYear(i)} style={{
                  padding: "8px 16px", borderRadius: 6, border: `1px solid ${teamYear === i ? accent : border}`,
                  background: teamYear === i ? accent + "11" : "transparent", cursor: "pointer",
                  fontFamily: font, fontSize: 12, color: teamYear === i ? accent : text2,
                  transition: "all 0.15s"
                }}>
                  {tp.year}
                </button>
              ))}
            </div>

            {/* Active year detail */}
            {(() => {
              const tp = teamPhases.phases[teamYear];
              return (
                <div className="fade-in" style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: text1 }}>{tp.year} — {tp.headcount} people</div>
                      <div style={{ fontSize: 12, color: text2, marginTop: 2 }}>{tp.sites}</div>
                    </div>
                    <div style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: accent }}>{tp.cost}</div>
                  </div>
                  <div style={{ padding: "12px 20px" }}>
                    {tp.roles.map((r, i) => (
                      <div key={i} style={{ padding: "10px 0", borderBottom: i < tp.roles.length - 1 ? `1px solid ${border}` : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: text1 }}>{r.role} <span style={{ color: text2 }}>({r.count})</span></span>
                          <span style={{ fontFamily: font, fontSize: 12, color: text2 }}>ZAR {(r.cost / 1000).toFixed(1)}M</span>
                        </div>
                        <div style={{ fontSize: 11, color: text2, marginTop: 3, fontStyle: "italic", opacity: 0.8 }}>{r.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Effective leverage */}
            <div style={{ background: accent + "08", border: `1px solid ${accent}22`, borderRadius: 8, padding: "20px 24px" }}>
              <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "2px", color: accent, marginBottom: 8 }}>EFFECTIVE LEVERAGE</div>
              <div style={{ fontSize: 14, color: text1, lineHeight: 1.7 }}>
                At steady state (Y3, 18 people, ZAR 10.5M), UCSA's AI-augmented team delivers output equivalent to a traditional 24-26 person team (~ZAR 16M). That's <span style={{ color: accent, fontWeight: 600 }}>ZAR 5.5M/year in effective leverage</span> — compounding to approximately ZAR 80M+ over the 15-year portfolio life.
              </div>
              <div style={{ fontSize: 12, color: text2, marginTop: 10, lineHeight: 1.6 }}>
                Key shifts: PMs manage 12+ sites via digital twin (vs. 5 traditional). Sales closes 3x more deals via AI proposals. Technicians dispatched by prediction, not schedule. Finance runs automatically through Netvendor+Volter pipeline.
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ ROADMAP ═══════════ */}
        {tab === "roadmap" && (
          <div className="fade-in">
            <p style={{ fontSize: 14, color: text2, lineHeight: 1.7, marginBottom: 8, maxWidth: 680 }}>
              Build sales automation first (revenue), then ops automation (cost reduction), then trading + client platforms (expansion + fundraising). The system pays for itself before you finish building it.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
              <div style={{ fontFamily: font, fontSize: 11, color: accent, background: accent + "11", border: `1px solid ${accent}22`, borderRadius: 4, padding: "5px 12px" }}>
                Total: ZAR 1.3–2.0M
              </div>
              <div style={{ fontFamily: font, fontSize: 11, color: "#FBBF24", background: "#FBBF2411", border: "1px solid #FBBF2422", borderRadius: 4, padding: "5px 12px" }}>
                16 months — 10-site pilot first
              </div>
            </div>

            {phases.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                {/* Timeline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 28 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", border: `2px solid ${accent}`,
                    background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: font, fontSize: 12, fontWeight: 700, color: accent
                  }}>
                    {i}
                  </div>
                  {i < phases.length - 1 && <div style={{ width: 1, flex: 1, background: border, marginTop: 4 }} />}
                </div>

                {/* Card */}
                <div style={{ flex: 1, background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: text1 }}>{p.phase}</div>
                      <div style={{ fontFamily: font, fontSize: 11, color: accent, marginTop: 2 }}>{p.duration}</div>
                    </div>
                    <div style={{ fontFamily: font, fontSize: 11, color: text2, background: bg, borderRadius: 4, padding: "3px 8px", border: `1px solid ${border}` }}>{p.cost}</div>
                  </div>
                  <div style={{ fontSize: 12, color: text2, fontStyle: "italic", marginBottom: 10 }}>{p.focus}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {p.tasks.map((t, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "start" }}>
                        <span style={{ color: accent, fontSize: 8, marginTop: 5 }}>●</span>
                        <span style={{ fontSize: 12, color: text2, lineHeight: 1.55 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: "8px 12px", background: accent + "08", borderRadius: 4, border: `1px solid ${accent}15` }}>
                    <span style={{ fontFamily: font, fontSize: 9, letterSpacing: "1px", color: accent }}>OUTCOME </span>
                    <span style={{ fontSize: 12, color: text2 }}>{p.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════ INSIGHTS ═══════════ */}
        {tab === "insights" && (
          <div className="fade-in">
            <p style={{ fontSize: 14, color: text2, lineHeight: 1.7, marginBottom: 28, maxWidth: 680 }}>
              Strategic considerations drawn from competitive scan of 50+ global companies and stress-tested financial modelling. These define whether UCSA builds a good solar business or a platform that happens to install solar.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: accent, background: accent + "15", width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: text1, margin: 0 }}>{ins.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: text2, margin: 0 }}>{ins.content}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ marginTop: 32, background: surface, borderRadius: 8, padding: "24px 28px", border: `1px solid ${accent}22` }}>
              <div style={{ fontFamily: font, fontSize: 9, letterSpacing: "2px", color: accent, marginBottom: 8 }}>THE CORE QUESTION</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: text2, margin: 0 }}>
                Is UCSA building an energy company that uses technology, or a technology platform that delivers energy?
                The same ZAR 1.8M budget, deployed differently, creates fundamentally different businesses by Year 5.
                One trades at 4-5× EBITDA. The other at 8-9×. At Year 10, that's the difference between a ZAR 110M exit and a ZAR 198M exit.
                <span style={{ color: text1, fontWeight: 500 }}> Every operational decision should be evaluated through that lens.</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
