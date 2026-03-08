// src/data/businessPlan.js — UCSA Asset Company V4 Business Plan Data

export const executiveSummary = {
  tagline: "Your scalable, AI-powered renewable revenue partner for Cape properties — reliable energy at 30% savings plus new income streams for body corporates.",
  problem: "Western Cape property estates overpay for electricity by 30%+ while losing potential revenue from bulk billing inefficiencies. Body corporates managing retirement villages, lifestyle estates, and commercial precincts face escalating City of Cape Town tariffs (R2.799/kWh bulk SPU, rising 5–8% annually) with no mechanism to capture savings or generate new income streams.",
  solution: "UCSA finances, owns, and operates integrated solar PV + battery storage + prepaid metering systems under zero-upfront-cost Power Purchase Agreements. We sell solar energy at a 30% discount to municipal tariffs, earn 8% commission on tenant prepaid electricity vending, and charge R250/month per sub-meter point — three independent revenue streams from a single asset.",
  portfolio: "50 sites (25 small, 15 medium, 10 large) across the Western and Southern Cape. Total CAPEX: ZAR 165M (at ZAR 2.30M per base small site, mix-adjusted). Deployed over 3 years in milestone-linked phases.",
  theAsk: {
    equity: "ZAR 66M",
    bridge: "ZAR 20–25M",
    total: "ZAR 86–91M",
    equityPurpose: "40% of ZAR 165M CAPEX",
    bridgePurpose: "Working capital + revenue timing gap",
  },
  whyWeWin: [
    { point: "Zero client CAPEX removes the primary adoption barrier", icon: "◈" },
    { point: "Triple revenue engine (PPA 74%, vending 17%, sub-metering 5%, export 4%) diversifies income", icon: "◇" },
    { point: "Prepaid metering eliminates tenant credit risk — cash collected before energy delivered", icon: "◉" },
    { point: "Section 12B provides 100% upfront tax deduction on qualifying renewable assets (<1MW)", icon: "◆" },
    { point: "AI platform creates compounding data advantage — each site improves the model for the next", icon: "◈" },
    { point: "No identified competitor globally integrates generation + storage + prepaid billing + AI portfolio management for residential estates", icon: "⚡" },
  ],
  scenarios: [
    {
      label: "Base Case",
      wacc: "10.2%",
      projectIRR: "15.2%",
      equityIRR: "22.1%",
      npv: "ZAR 24.6M",
      payback: "7.5 years",
      dscr: "1.6x",
      note: "Currently available instruments, fundable today",
      highlight: false,
    },
    {
      label: "DFI Confirmed",
      wacc: "8.0%",
      projectIRR: "15.2%",
      equityIRR: "25.4%",
      npv: "ZAR 41.8M",
      payback: "6.8 years",
      dscr: "1.8x",
      note: "DBSA/IFC term sheets (6–12 month timeline)",
      highlight: true,
    },
    {
      label: "Stress",
      wacc: "12.0%",
      projectIRR: "15.2%",
      equityIRR: "18.8%",
      npv: "ZAR 14.2M",
      payback: "8.4 years",
      dscr: "1.4x",
      note: "Commercial debt only, no concessional terms",
      highlight: false,
    },
  ],
};

export const marketData = {
  macro: {
    title: "Macro Context",
    content: "South Africa's renewable energy sector added more than 3 GW in 2025 alone. Installed capacity now exceeds 15 GW (7.4 GW solar PV, 6.2 GW wind) and is forecast to reach 18.18 GW in 2026 and 31.31 GW by 2031 at an 11.49% CAGR. Total market value is projected at USD 179.8 billion by 2032.",
    insight: "Load shedding was effectively eliminated in 2025 (280+ clear days). This shifts the value proposition from energy security to permanent economic optimisation — a harder but more durable sale.",
  },
  westernCape: {
    title: "Western Cape Specifics",
    content: "Embedded solar PV currently stands at 440 MW (R6 billion market value) and is projected to grow to 1,500 MW (R20 billion) by 2030. The province hosts 70% of South Africa's renewable component manufacturing.",
    tariffs: [
      { label: "Bulk SPU high-consumption", value: "R2.799/kWh excl. VAT", note: "UCSA's PPA base" },
      { label: "Domestic prepaid Block 1", value: "R3.400/kWh excl. VAT", note: "Vending commission base" },
      { label: "Base-case escalation", value: "5% p.a.", note: "Conservative vs. historical 2–9.88%; Eskom 8.76% confirmed April 2026" },
    ],
  },
  addressableMarket: {
    tam: { label: "TAM", value: "ZAR 20–25B", note: "Combined small-scale solar + metering, Western/Southern Cape" },
    sam: { label: "SAM", value: "ZAR 207M", note: "~500 qualified estates × ZAR 414K avg. revenue/site = annual recurring pool" },
    som: { label: "SOM (Phase 1)", value: "ZAR 20.7M → 33–35M", note: "50 sites × ZAR 414K base, growing to Y5 with escalation. ~10% of SAM." },
    qualified: "~400–600 qualified prospects (2,213 registered estates filtered by 280,000+ kWh p.a. threshold, body corporate governance, roof/ground mounting availability)",
  },
  segments: [
    {
      label: "Small Sites",
      count: 25,
      description: "Retirement villages and small estates. High communal loads (healthcare, dining, laundry).",
      revenue: "ZAR 414K/site/year",
      closeRate: "35–45%",
      note: "Simplest governance, highest pain",
    },
    {
      label: "Medium Sites",
      count: 15,
      description: "Mid-size commercial estates and office-retail mixes. 10–15 sub-meter points.",
      revenue: "ZAR 621K/site/year",
      closeRate: "25–35%",
      note: "More stakeholders, longer procurement",
    },
    {
      label: "Large Sites",
      count: 10,
      description: "Mixed-use retail/office/residential. 14+ sub-points. Highest commission leverage.",
      revenue: "ZAR 828K/site/year",
      closeRate: "20–30%",
      note: "Complex governance, legal review required",
    },
  ],
};

export const businessModelData = {
  revenueStreams: [
    { stream: "PPA energy sales (30% discount to SPU tariff)", perSmallSite: "ZAR 307,047", portfolioY5: "ZAR 25,192K", pct: 74 },
    { stream: "Vending commission (8% on prepaid sales)", perSmallSite: "ZAR 76,149", portfolioY5: "ZAR 5,785K", pct: 17 },
    { stream: "Sub-metering fees (R250/point/month)", perSmallSite: "ZAR 21,000", portfolioY5: "ZAR 1,418K", pct: 5 },
    { stream: "Export revenue (excess solar to grid)", perSmallSite: "ZAR 10,000", portfolioY5: "ZAR 731K", pct: 4 },
  ],
  totalPerSite: "ZAR 414,196",
  totalPortfolio: "ZAR 33,126K",
  unitEconomics: [
    { label: "Gross margin post-O&M", value: "83%" },
    { label: "EBITDA margin (with overhead)", value: "49–52% at 50 sites" },
    { label: "Site contribution margin", value: "ZAR 345K/yr (ZAR 414K revenue − ZAR 69K O&M)" },
    { label: "Portfolio breakeven (overhead)", value: "~30 sites (fixed) / ~18 sites (phased hiring)" },
    { label: "LTV per site (15yr, escalated)", value: "ZAR 5.2–6.8M" },
    { label: "CAC per site", value: "ZAR 150–200K (6-month sales cycle)" },
    { label: "LTV:CAC ratio", value: "26–45x" },
  ],
  costStructure: [
    { label: "CAPEX per small site", value: "ZAR 2,300,000", note: "PV/BESS ZAR 2,079K + metering ZAR 221K. 3 independent EPC quotes." },
    { label: "Total Phase 1 CAPEX", value: "ZAR 165M", note: "Mix-adjusted (25×2.3M + 15×3.45M + 10×4.6M + 5.2M setup)" },
    { label: "O&M", value: "3% of CAPEX (ZAR 69K/yr)", note: "Escalating 2% p.a." },
    { label: "Overhead (steady state)", value: "ZAR 210K/site/yr", note: "18 staff at ZAR 10.5M total" },
  ],
  boltOns: [
    { label: "EV Charging", value: "+6–9% revenue by Y4", note: "4–8 chargers/site at ZAR 80–120K marginal CAPEX" },
    { label: "Carbon Credits", value: "ZAR 1.7–2.3M/yr from Y2", note: "9,300 tCO₂ avoided. Gold Standard/Verra. ZAR 250–300K registration." },
    { label: "Backup Premium", value: "+3–5% margin", note: "+R0.15/kWh for guaranteed 98% uptime. 30–40% uptake on critical-load estates." },
  ],
};

export const competitiveData = {
  competitors: [
    { name: "Candi Solar", origin: "Zurich/SA", model: "C&I solar PPA, 8 SA provinces, 220+ MWp", funding: "$200M+ (IFC $58.5M debt, Nov 2025)", threat: "Medium-High if they move downmarket", gap: "No metering, no body corporate focus" },
    { name: "GoSolr / GoSolr+", origin: "SA, 2021", model: "Residential solar subscription, expanding to multi-dwelling", funding: "Undisclosed", threat: "Medium — GoSolr+ targets UCSA's segment", gap: "No prepaid vending, no BESS portfolio mgmt" },
    { name: "Citiq Prepaid", origin: "SA, 2010", model: "SA's largest sub-metering, 850 GWh/yr sold", funding: "Established, profitable", threat: "High (potential) — has meter base + BC relationships", gap: "No solar, no asset ownership" },
    { name: "Starsight/SolarAfrica", origin: "Pan-African", model: "C&I EaaS, 520 MW, 656 sites", funding: "ZAR 1.25B+ equity (Helios/AIIM)", threat: "Low-Medium — different segment", gap: "No residential estates, no prepaid" },
    { name: "Hohm Energy", origin: "JHB, 2021", model: "Software marketplace, bank finance", funding: "$8M seed", threat: "Low — different model", gap: "No asset ownership" },
    { name: "Netvendor", origin: "Durban (UCSA partner)", model: "Prepaid vending platform, 600K+ meters", funding: "Established", threat: "Low — partner, not competitor", gap: "No solar" },
    { name: "Conlog", origin: "Durban, 1965", model: "Meter hardware, 17M+ meters globally", funding: "Established", threat: "Low — potential supplier", gap: "No services" },
  ],
  moat: "Across 50+ companies profiled globally, no single entity combines distributed solar+battery portfolio ownership, prepaid metering/vending, AI-driven operations, and zero-upfront PPAs for residential estates. The moat is execution complexity: integrating solar PV design, BESS sizing, prepaid vending (STS-compliant), sub-meter billing, body corporate negotiation, SSEG municipal approval, and AI-driven portfolio optimisation requires simultaneous capability across energy engineering, software, financial structuring, and property management.",
  defense: "Speed-to-reference-sites. Once 10–15 sites are live with bankable performance data, UCSA holds the only proven integrated operating track record in the segment. PPA lock-in periods (15–20 years) create structural switching costs. The AI platform's data flywheel — where each site improves sizing, maintenance prediction, and pricing for subsequent sites — creates a compounding advantage that late entrants cannot shortcut.",
  convergenceRisk: "Both metering companies (Citiq, JKNV Energy, The Meter Man) and solar companies (GoSolr) are beginning to move toward UCSA's integrated model. The window is narrowing. Cautionary precedent: Sunnova ($10.67B debt, bankrupt June 2025), SunPower (bankrupt 2024), Solar Mosaic (bankrupt 2025) — all failed from overleveraged growth. UCSA prioritises capital discipline over growth velocity.",
};

export const financialsData = {
  incomeStatement: [
    { item: "Revenue", y1: 2900, y2: 12800, y3: 28500, y4: 33200, y5: 34700, y10: 43100, y15: 53600 },
    { item: "O&M", y1: -540, y2: -2400, y3: -5300, y4: -5500, y5: -5700, y10: -6500, y15: -7400 },
    { item: "Gross Profit", y1: 2360, y2: 10400, y3: 23200, y4: 27700, y5: 29000, y10: 36600, y15: 46200, bold: true },
    { item: "Staffing + Overhead", y1: -5800, y2: -8800, y3: -10200, y4: -10600, y5: -11000, y10: -13400, y15: -16300 },
    { item: "EBITDA", y1: -3440, y2: 1600, y3: 13000, y4: 17100, y5: 18000, y10: 23200, y15: 29900, bold: true, highlight: true },
    { item: "Book Depreciation", y1: -2400, y2: -6700, y3: -11000, y4: -11000, y5: -11000, y10: -11000, y15: -11000 },
    { item: "Interest", y1: -2200, y2: -6100, y3: -9800, y4: -9100, y5: -8400, y10: -4900, y15: -500 },
    { item: "EBT", y1: -8040, y2: -11200, y3: -7800, y4: -3000, y5: -1400, y10: 7300, y15: 18400 },
    { item: "Tax (27%, after 12B)", y1: 0, y2: 0, y3: 0, y4: 0, y5: 0, y10: 1971, y15: 4968 },
    { item: "Net Profit", y1: -8040, y2: -11200, y3: -7800, y4: -3000, y5: -1400, y10: 5329, y15: 13432, bold: true },
  ],
  deploymentSchedule: [
    { year: "Y1", sites: 10, cumulative: 10, staff: "7→10", staffCost: "ZAR 5.8M", capex: "ZAR 36M", note: "Pilot sites (reference installs)" },
    { year: "Y2", sites: 20, cumulative: 30, staff: "12→14", staffCost: "ZAR 8.8M", capex: "ZAR 64M", note: "Scale phase" },
    { year: "Y3", sites: 20, cumulative: 50, staff: "16→18", staffCost: "ZAR 10.2M", capex: "ZAR 65M", note: "Full portfolio" },
    { year: "Y4+", sites: 0, cumulative: 50, staff: "18", staffCost: "ZAR 10.6M (4% esc.)", capex: "ZAR 0", note: "Steady state" },
  ],
  monteCarlo: {
    summary: "10,000 iterations stressing tariff escalation, solar yield, CAPEX overruns, close rate, sales delays, commission variance, staff costs, regulatory shocks, and partner failure simultaneously.",
    deterministic: { projectIRR: "15.2%", equityIRR: "22.1%", note: "50 sites, 30% close rate achieved" },
    stochastic: [
      { metric: "Project IRR (unlevered)", mean: "4.1%", p10: "-1.5%", p50: "4.0%", p90: "9.7%" },
      { metric: "Equity IRR (levered)", mean: "9.4%", p10: "1.2%", p50: "5.9%", p90: "14.0%" },
      { metric: "NPV @ 10%", mean: "ZAR -37.9M", p10: "ZAR -69.7M", p50: "—", p90: "ZAR -4.7M" },
      { metric: "Prob Project IRR > 10.2% WACC", mean: "8.2%", p10: "—", p50: "—", p90: "—" },
      { metric: "Prob Equity IRR > 14% hurdle", mean: "10.0%", p10: "—", p50: "—", p90: "—" },
      { metric: "Mean sites deployed", mean: "35", p10: "—", p50: "—", p90: "—" },
    ],
    keyDrivers: [
      { rank: 1, driver: "Tariff escalation", correlation: "r = +0.51", note: "Strongest driver" },
      { rank: 2, driver: "Close rate", correlation: "r = +0.49", note: "Confirms volume is key risk" },
      { rank: 3, driver: "Solar yield", correlation: "r = +0.25", note: "" },
      { rank: 4, driver: "CAPEX multiplier", correlation: "r = −0.24", note: "" },
    ],
    interpretation: "The gap between deterministic (15.2%) and stochastic mean (4.1%) is driven entirely by volume risk. The pilot phase specifically tests whether the close rate supports full deployment. The first 10 reference sites are the option price — they generate bankable data that either validates 40%+ close rates or reveals the model needs adjustment before committing to full scale.",
  },
  tax12B: {
    summary: "100% upfront deduction in year of commissioning for qualifying renewable assets <1MW.",
    batches: [
      { batch: "Y1 batch", deduction: "ZAR 36M", shield: "ZAR 9.7M" },
      { batch: "Y2 batch", deduction: "ZAR 64M", shield: "ZAR 17.3M" },
      { batch: "Y3 batch", deduction: "ZAR 65M", shield: "ZAR 17.6M" },
    ],
    totalShield: "ZAR 44.6M cumulative tax shield (at 27% corporate rate)",
    note: "UCSA will obtain a written tax opinion confirming Section 12B eligibility before first CAPEX deployment. Budget: ZAR 50–100K.",
  },
};

export const gtmData = {
  conversionFunnel: [
    { stage: "Total addressable estates (WC, >280K kWh)", count: "~500", conversion: "—", source: "GreenCape, estate registries" },
    { stage: "Qualified leads (engaged, data obtained)", count: "80–120", conversion: "16–24% of addressable", source: "Direct outreach + Netvendor intros" },
    { stage: "Proposals issued", count: "50–70", conversion: "60% of qualified", source: "ROI calculator + site assessment" },
    { stage: "PPA signed (30% base case)", count: "50 over 3 years", conversion: "30% of proposals", source: "Segment-weighted" },
    { stage: "PPA signed (25% stress)", count: "42 over 3 years", conversion: "25%", source: "Reduces Y5 revenue ~16%" },
    { stage: "PPA signed (40% upside)", count: "50 in 2.5 years", conversion: "40%", source: "Accelerated with reference data" },
  ],
  pilotStrategy: {
    discount: "35% tariff discount (vs. standard 30%) for first 10–15 reference sites",
    selectionCriteria: [
      "Geographic clustering (reduces O&M travel costs)",
      "Body corporate governance simplicity (smaller estates, fewer decision-makers)",
      "High solar irradiance (maximises yield for reference data)",
      "Mix of retirement + residential (proves both segments)",
    ],
    salesCycle: "90-day target for pilot sites with pre-qualified leads. 6–9 months for non-pilot commercial deals.",
  },
  priorityTargets: [
    { name: "Helderberg Village", location: "Somerset West", description: "600+ units, large communal load. Classic UCSA profile.", priority: "URGENT" },
    { name: "Val de Vie Estate", location: "Paarl", description: "5,000+ ha, 4,000+ homes. Massive opportunity.", priority: "URGENT" },
    { name: "Rabie / Century City / Oasis Life", location: "Cape Town", description: "800,000m² GLA + retirement villages.", priority: "URGENT" },
    { name: "De Zalze Golf Estate", location: "Stellenbosch", description: "~1,000 homes. Golf + clubhouse load.", priority: "HIGH" },
    { name: "Fancourt Estate", location: "George", description: "3 golf courses, 5-star hotel. Large C&I consumer.", priority: "HIGH" },
  ],
  salesProcess: "The sales cycle for body corporate PPA decisions runs 6–9 months: body corporate governance (monthly/quarterly meetings), special resolution requirement (75% of members by value for 15–20 year commitment), legal review (4–8 weeks), and SSEG approval from City of Cape Town (4–12 weeks).",
  positioning: "\"Your scalable, AI-powered renewable revenue partner for Cape properties — reliable energy at 30% savings plus new income streams for body corporates.\"",
  keyMessages: [
    "Permanent 30% cost reduction on your largest operating expense",
    "New revenue from electricity vending — your estate earns money, not just saves it",
    "Future-proof your property with an appreciating energy asset",
  ],
};

export const teamData = {
  founders: [
    { role: "Managing Director — Reuben Naude", bio: "Strategy + investor relations + first closes. Energy/property/finance background." },
    { role: "Co-Founder / Commercial Lead — Petrus", bio: "Commercial sales, industry relationships, pipeline development." },
  ],
  milestoneHiring: [
    { milestone: "Financing close", headcount: 7, cost: "ZAR 5.1M", roles: "MD, CTO, Data Engineer, 2 Project Managers, 2 Sales", impact: "Lean start — overhead breakeven at ~18 sites" },
    { milestone: "First 5 sites commissioned", headcount: 10, cost: "ZAR 7.0M", roles: "+ Metering Specialist, 2 Field Technicians, 1 PM", impact: "Field capacity proven, metering live" },
    { milestone: "15 sites commissioned", headcount: 14, cost: "ZAR 9.2M", roles: "+ 1 Sales, 2 Field Technicians, 1 Admin", impact: "Sales momentum, tech handles portfolio monitoring" },
    { milestone: "25+ sites commissioned", headcount: 18, cost: "ZAR 10.5M", roles: "+ 1 PM, 2 Field Technicians, 1 Support", impact: "Full steady-state team. Overhead breakeven well behind." },
  ],
  hiringImpact: "Overhead breakeven drops from ~30 sites (fixed hiring) to ~18 sites (phased). Year 1 staff cost drops from ZAR 8.2M to ZAR 5.1M, reducing the liquidity gap by ZAR 3.1M.",
  advisory: "3–4 person advisory board from Day 1: independent engineer (asset performance oversight), DFI/infrastructure finance professional, SA property industry specialist. Budget: ZAR 150–250K p.a.",
};

export const riskData = [
  { id: 1, risk: "Financing delay >6 months", prob: "High", impact: "Critical", score: 20, mitigation: "Parallel-track 3 DFI applications; pre-qualify bridge lenders; begin bond prospectus Month 1", owner: "MD/CFO", trigger: "No term sheet by Month 4 → activate bridge-only plan" },
  { id: 2, risk: "Close rate below 25%", prob: "Med-High", impact: "High", score: 16, mitigation: "Reduce Y1 target to 8 sites; increase pipeline to 100+ leads; 35% pilot discount; ROI calculator at first meeting", owner: "Sales Lead", trigger: "Pipeline conversion <20% at Month 6 → restructure sales approach" },
  { id: 3, risk: "CAPEX overrun >15%", prob: "Medium", impact: "High", score: 12, mitigation: "3 independent EPC quotes; lock FX on panel orders; contractual cap with EPC; 10% contingency", owner: "Project Director", trigger: "First 3 site actuals >10% over budget → renegotiate supplier" },
  { id: 4, risk: "Netvendor dependency", prob: "Medium", impact: "High", score: 12, mitigation: "MOU with 24-month pricing lock; qualify Citiq as backup; UCSA owns all meter data", owner: "MD/Legal", trigger: "Netvendor M&A or pricing change → activate Citiq onboarding" },
  { id: 5, risk: "Tariff escalation below 3%", prob: "Low-Med", impact: "High", score: 10, mitigation: "PPA escalator floors at CPI; diversify to TOU arbitrage and export; Backup Premium upsell", owner: "Commercial", trigger: "Municipal tariff <3% for 2 consecutive years → remodel" },
  { id: 6, risk: "Section 12B change", prob: "Low", impact: "Critical", score: 10, mitigation: "Written tax opinion before first deployment; structure to qualify; maintain DTL reserve", owner: "Tax Advisor", trigger: "Budget speech or SARS ruling → immediate legal review" },
  { id: 7, risk: "AI platform delay", prob: "Medium", impact: "Medium", score: 9, mitigation: "Decouple AI from site commissioning (manual operation as fallback); backup dev agency identified", owner: "CTO", trigger: "Phase 1 milestone missed by >4 weeks → engage backup" },
  { id: 8, risk: "Grid/wheeling delays", prob: "Medium", impact: "Medium", score: 9, mitigation: "Partner with PowerX/Etana for trader-led wheeling; PPAs structured to work BTM-only as fallback", owner: "Commercial", trigger: "Wheeling licence not obtained Month 9 → default BTM" },
  { id: 9, risk: "Key person risk", prob: "Low", impact: "Critical", score: 10, mitigation: "Key person insurance; COO appointment by Month 6; documented SOPs", owner: "Board", trigger: "Any C-suite departure → succession plan" },
  { id: 10, risk: "BEE non-compliance", prob: "Medium", impact: "High", score: 12, mitigation: "25.1% Black ownership from incorporation; BEE advisor appointed; target Level 2 by Year 2", owner: "MD/Legal", trigger: "DFI BEE condition → already compliant" },
  { id: 11, risk: "Solar yield <P90 by >10%", prob: "Low", impact: "Medium", score: 6, mitigation: "P90 modelling (not P50); 25yr panel warranties; independent engineering review", owner: "Technical", trigger: "6-month actuals >8% below P90 → engineering audit" },
  { id: 12, risk: "Tenant non-payment", prob: "Low", impact: "Low", score: 3, mitigation: "Prepaid model eliminates receivables; auto-disconnect on zero balance", owner: "Operations", trigger: "N/A — structurally mitigated" },
];

export const exitData = {
  options: [
    {
      label: "Option A",
      title: "Trade Sale",
      timing: "Year 8–10",
      multiple: "8–9x steady-state EBITDA",
      value: "ZAR 184–207M",
      note: "At Year 10 EBITDA of ~ZAR 23M. Comparable: Starsight Energy/SolarAfrica merger valued at ZAR 1.25B+ for 656 sites.",
      highlight: false,
    },
    {
      label: "Option B",
      title: "CEIT Spin-Off",
      timing: "Year 7",
      multiple: "Listed REIT premium",
      value: "ZAR 300M+ (Phase 2 scale)",
      note: "South African REIT rules now allow renewable energy assets. Spin mature assets into a listed Clean Energy Investment Trust for liquidity + recurring management fees. Regulatory pathway via JSE.",
      highlight: true,
    },
    {
      label: "Option C",
      title: "Refinancing",
      timing: "Year 5",
      multiple: "Capital return",
      value: "Excess capital distributed",
      note: "Refinance the debt component at lower rates (post-pilot, with bankable data), distributing excess capital to equity holders while retaining operational control.",
      highlight: false,
    },
  ],
  capitalStructure: {
    scenarios: [
      {
        label: "Base Case (10.2% WACC)",
        seniorDebt: "45% @ 8.5% (commercial/DFI standard)",
        equity: "40% @ 14%",
        mezz: "15% @ 11%",
        grants: "0%",
        wacc: "10.2%",
      },
      {
        label: "DFI Confirmed (8.0% WACC)",
        seniorDebt: "30% @ 3% (concessional) + 20% @ 6% (green bonds)",
        equity: "40% @ 14%",
        mezz: "0%",
        grants: "10% @ 0%",
        wacc: "8.0%",
      },
      {
        label: "Stress (12.0% WACC)",
        seniorDebt: "40% @ 10% (commercial only)",
        equity: "50% @ 14%",
        mezz: "10% @ 12%",
        grants: "0%",
        wacc: "12.0%",
      },
    ],
    pathway: [
      "Months 1–3: Equity raise (ZAR 66M target). Parallel-track DBSA and IFC pre-qualification.",
      "Months 3–6: First 10 sites commissioned with equity + bridge capital only.",
      "Months 6–12: DFI term sheets received based on pilot performance data.",
      "Months 12–18: Tranches 2–3 funded via confirmed DFI/bond structure at reduced WACC.",
    ],
  },
};
