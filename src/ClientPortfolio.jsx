import { useState, useMemo } from "react";
import { theme as t } from "./theme";

// ── Service Line Definitions ─────────────────────────────────────────────
const SVC = [
  { key: "metering", label: "Smart/Standard Metering", short: "Metering", accent: "#34D399" },
  { key: "recovery", label: "Building Recovery", short: "Recovery", accent: "#60A5FA" },
  { key: "solar", label: "Solar Installation/Mgmt", short: "Solar", accent: "#FBBF24" },
  { key: "generator", label: "Generator Supply/Service", short: "Generator", accent: "#F87171" },
  { key: "prepaid", label: "Prepaid Metering", short: "Prepaid", accent: "#A78BFA" },
  { key: "logging", label: "Logging (Smappee/PTrack)", short: "Logging", accent: "#2DD4BF" },
  { key: "munic", label: "Municipal Account Summary", short: "Munic Acct", accent: "#FB923C" },
  { key: "tariff", label: "Tariff Savings", short: "Tariff", accent: "#E879F9" },
  { key: "automation", label: "Automation", short: "Automation", accent: "#38BDF8" },
  { key: "leds", label: "LEDs Installed", short: "LEDs", accent: "#4ADE80" },
  { key: "aircon", label: "Aircon Install/Service", short: "Aircon", accent: "#FB7185" },
];

// ── 164 Clients — verified against source spreadsheet (Copy_of_UC_CLIENTS.xlsx) ──
const RAW = [
  { n: "78 ON MANE HAIRSALON SSW", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "139  KLOOF STREET", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "143 THE SIX", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "154 VOORTREKKER", s: [1,1,1,0,1,0,0,0,0,0,0] },
  { n: "18 JIG RD.", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "198 HORAK - JNA", s: [1,1,0,0,1,0,0,0,0,0,0] },
  { n: "22B KERKSTRAAT", s: [1,1,1,0,0,0,0,0,0,0,0] },
  { n: "31 AIRWAY", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "A BOTHA", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "AG PLASTICS SOLAR", s: [0,0,1,0,0,1,0,1,0,0,0] },
  { n: "AGS BELLVILLE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "ANDER DE WAAL", s: [0,0,1,0,0,1,0,0,0,0,0] },
  { n: "ANNENDALE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "ASSEGAAI", s: [1,1,1,0,0,1,0,0,0,0,0] },
  { n: "ATLANTICA", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "ATLANTIS CONVENIENCE CENTRE", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "AVANTI CENTRE VREDENBURG", s: [1,1,0,0,1,0,0,0,0,0,0] },
  { n: "B SLABBERT", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "BANBURRY CROSS./BURGER KING", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "BELLVILLE GK", s: [1,0,1,0,0,1,1,1,1,0,0] },
  { n: "BELLVILLE HOëRSKOOL", s: [1,0,0,1,0,0,0,0,0,0,0] },
  { n: "BIDFOODS", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "BIDVEST AIRPORT", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "BIDVEST WOODSTOCK", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "BIRKENHEAD", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "BOSSA NOVA SSW", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "BOTSWANA SOLAR", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "BRANDHOUSE", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "BRYAN FENN", s: [0,0,1,0,0,0,0,0,1,0,0] },
  { n: "CAPE DUTCH", s: [1,0,1,0,0,0,0,1,0,0,0] },
  { n: "CAPE MOHAIR", s: [1,0,0,0,0,1,0,0,0,0,0] },
  { n: "CAPE PRECIOUS METALS", s: [1,0,0,0,0,0,0,1,0,0,0] },
  { n: "CARL VON BACH", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "CITY CAPITAL - 12 OXBOW SOLAR", s: [0,0,1,0,0,1,0,0,0,0,0] },
  { n: "CITY CAPITAL - 13 OXBOW SOLAR", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "CITY CAPITAL - TVC 2 MANAGEMENT & SOLAR", s: [1,1,1,0,0,1,0,0,0,0,0] },
  { n: "CLUB MYKONOS", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "CLUVER", s: [1,0,0,0,1,0,0,0,1,0,0] },
  { n: "CURE DAY HOSPITAL", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "D VAN DER SPUY", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "DA GAMA APARTMENTS", s: [1,0,0,0,1,0,0,0,0,0,0] },
  { n: "DEAN STREET ARCADE", s: [1,1,0,1,0,0,0,1,0,0,0] },
  { n: "DENNEGEUR", s: [1,0,0,0,0,0,0,1,0,0,0] },
  { n: "DIAZ STREET", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "DKI FRUIT", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "DR ROOMS VREDENBURG", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "DR. SAAIMAN", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "DURBANVILLE GC", s: [1,1,0,0,0,1,1,1,0,0,0] },
  { n: "E NEL (HERMANUS)", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "E NEL (KENRIDGE)", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "EASIPACK", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "EIKENDAL LODGE", s: [1,0,1,0,0,1,0,0,0,0,0] },
  { n: "EIKENDAL VINEYARDS", s: [1,1,1,1,1,1,0,0,0,0,0] },
  { n: "EMERALD BAY", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "FRIEDLANDER", s: [1,0,0,0,0,0,0,0,1,0,0] },
  { n: "G BOTHA", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "GATTIS GEORGE", s: [0,0,0,0,0,0,0,1,1,0,0] },
  { n: "GIOVANNIS RESTAURAN & CONFERENCE CENTRE", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "GOLD REEF PLAZA/ AMIGOS NIGHTCLUB", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "GORDONS BAY VILLAGE PLAZA", s: [1,1,1,1,1,0,1,0,1,0,0] },
  { n: "GVV INV.", s: [1,1,1,0,0,0,0,1,0,0,0] },
  { n: "H LOUW", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "HAGEN ZWEERS TENANT", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "HOTTENTOTS HOëRSKOOL", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "HUNGRY LION (MUTIPLE BRANCHES)", s: [0,0,0,0,0,1,0,1,0,0,0] },
  { n: "IBIS STREET SSW", s: [1,0,1,0,0,0,0,0,0,0,0] },
  { n: "ISI CARSTENS", s: [0,1,0,0,0,0,1,1,0,0,0] },
  { n: "JB'S NISSAN", s: [1,0,1,0,0,1,0,0,1,0,0] },
  { n: "JNA KENWILL", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "KFC BRACKENFELL", s: [1,0,0,1,0,0,0,0,0,0,0] },
  { n: "KING FISHER BUSINESS PARK", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "KLARADYN SOLAR", s: [0,1,1,0,1,0,0,1,0,0,0] },
  { n: "KLEIN WELGEMEEND", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "KLIPBANK - BOKKIE MOSTERT", s: [0,0,1,0,0,1,0,1,0,0,0] },
  { n: "KLIPHUIS", s: [1,0,1,0,0,0,0,0,0,0,0] },
  { n: "KRUGERSDORP SECURITAS", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "KUILSRIVIER GC", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "LA CLE DES MONTAGNES", s: [1,0,0,0,0,0,1,1,0,0,0] },
  { n: "LA ROUGE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "LA VIE RETIREMENT VILLAGE", s: [1,1,0,0,0,1,0,0,0,0,0] },
  { n: "LAERSKOOL BRACKENFELL", s: [0,0,0,0,0,0,1,1,0,0,0] },
  { n: "LAGUNA ESTATE LANGEBAAN", s: [0,1,0,0,1,1,0,0,0,0,0] },
  { n: "LARECOLTE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "LARENBOSCH", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "LEEUWEN MANSIONS", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "LONGACRES HOME OWNERS LANGEBAAN", s: [1,1,1,0,1,0,0,0,0,0,0] },
  { n: "M GROBLER", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "M&G INVESTMENTS", s: [1,0,1,0,0,1,0,0,1,0,0] },
  { n: "MCG INDUSTRIES", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "MEDIA HIVE STUDIO", s: [1,0,1,0,0,1,1,0,0,0,1] },
  { n: "MELCKSLOOT VILLAGE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "MIDDESTAD MALL", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "MILLENNIUM MALL", s: [1,1,0,1,1,0,0,0,0,0,0] },
  { n: "MILLIES", s: [0,0,0,0,0,1,0,0,1,0,0] },
  { n: "MOOSEVALLEY", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "MORNINGSTAR FARM", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "MOTUS - TOYOTA CAPE GATE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "NG KERK HELDERBERG", s: [1,1,1,0,0,1,0,0,0,0,0] },
  { n: "NICO VORSTER", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "NIVICA", s: [0,0,0,0,1,1,0,0,0,0,0] },
  { n: "NUWELAND KRIEKET GRONDE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "OAKDALE CLUB", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "ONCOLOGY CG", s: [1,1,0,0,0,0,0,1,0,0,0] },
  { n: "ONCOLOGY DURBAN", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "ONCOLOGY GRG", s: [1,1,0,0,0,0,0,1,0,0,0] },
  { n: "ONCOLOGY KRUGERSDORP", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "ONCOLOGY PAN", s: [1,1,0,0,0,0,0,1,0,0,0] },
  { n: "ONCOLOGY POLOKWANE", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "ONCOLOGY SSW", s: [1,1,0,0,0,1,0,1,0,0,0] },
  { n: "ONCOLOGY UMHLANGA", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "OTTERY PARK", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "PAARDEVLEI MEDICAL CENTRE", s: [1,1,1,1,0,1,0,0,1,0,0] },
  { n: "PALERMO", s: [0,0,0,0,1,1,0,0,0,0,0] },
  { n: "PALLET WAREHOUSE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "PANORAMA VETERINARY CLINIC", s: [1,0,1,0,0,1,0,1,0,0,1] },
  { n: "PARADISE BEACH RESORT", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "PAREL VALLEI SKOOL", s: [0,0,0,1,0,1,0,0,0,0,0] },
  { n: "PARKER FOODS", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "PEMBROKE", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "PENY LANE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "PETER ALLEN TIMBER", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "PG FOODS", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "PG SLABBERT", s: [0,0,1,0,0,1,0,0,1,0,0] },
  { n: "PINMORE", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "PISTORIUS", s: [0,0,1,0,0,0,0,0,1,0,0] },
  { n: "PLASLANTIC", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "PROTEA HOTEL TYGERVALLEY", s: [1,0,0,1,0,0,0,1,0,0,0] },
  { n: "PROTEA PLACE", s: [1,1,0,0,0,0,0,1,1,0,0] },
  { n: "PUREGOOD FOODS", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "RETAILABILITY (118 STORES)", s: [1,0,0,0,0,0,0,1,0,0,0] },
  { n: "RUST & VREDE & GUARDIAN PEAK", s: [1,0,0,0,0,1,0,0,0,0,0] },
  { n: "SALDANHA BAY MUNICIPALITY", s: [1,0,1,0,0,0,0,0,0,0,0] },
  { n: "SHOPRITE BELLVILLE", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "SHOPRITE KRAAIFONTEIN", s: [1,0,0,0,0,1,0,0,0,0,0] },
  { n: "SHOPRITE PAROW", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "SHOPRITE VOORTREKKER", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "SHOPRITE WOODSTOCK", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "SPAR BOSTON", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "SPAR WELGELEGEN", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "SPIER ARTS", s: [0,0,0,0,0,1,0,0,1,0,0] },
  { n: "SPORTSFAN", s: [1,0,0,0,0,0,0,0,1,0,0] },
  { n: "ST HELENA CENTRE", s: [1,1,1,1,1,0,0,0,1,0,0] },
  { n: "ST HELENA OK & LIQ", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "STELLENBERG HOëRSKOOL", s: [0,0,0,0,0,1,1,1,0,0,0] },
  { n: "STELLENBOSCH HILLS", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "SUBARU SSW", s: [1,1,0,0,0,0,0,0,0,0,0] },
  { n: "SUNCLARE", s: [1,1,0,1,0,1,0,0,0,0,0] },
  { n: "TAFELBERG FURNISHERS ROODEPOORT", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "TAFELBERG FURNISHERS SUNNINGDALE", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "TAHITI", s: [0,1,0,0,1,0,0,0,0,0,0] },
  { n: "TCI", s: [1,0,1,0,0,0,0,0,0,0,0] },
  { n: "TEREBINTH", s: [0,0,0,0,0,0,0,0,1,0,0] },
  { n: "THE CLIFFS", s: [0,0,0,0,0,1,0,0,1,0,0] },
  { n: "TOM LIEBENBERG", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "TRIBAL FOODS", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "UITOMS BOERDERY", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "UTILITY CONSULT OFFICE/MODISE", s: [1,1,1,0,0,0,0,0,1,0,0] },
  { n: "VAL DE VIE RESIDENT", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "W DU TOIT", s: [0,0,1,0,0,0,0,0,0,0,0] },
  { n: "WATERCLUB", s: [0,0,0,0,0,1,0,0,0,0,0] },
  { n: "WATERKANT STRAAT - VREDENBURG", s: [0,0,0,0,1,0,0,0,0,0,0] },
  { n: "WEBB ATTORNEYS", s: [1,0,0,0,0,0,0,0,1,0,0] },
  { n: "WOODLANDS SPA - KRUGERSDORP", s: [1,0,0,0,0,0,0,0,0,0,0] },
  { n: "ZEMCOR", s: [0,0,0,0,0,1,0,0,0,0,0] },
];

// ── Derived Analytics ────────────────────────────────────────────────────
function useClientData() {
  return useMemo(() => {
    const clients = RAW.map(c => {
      const serviceCount = c.s.reduce((a, b) => a + b, 0);
      const activeServices = SVC.filter((_, i) => c.s[i] === 1).map(sk => sk.key);
      const tier = serviceCount >= 4 ? "anchor" : serviceCount >= 2 ? "growth" : serviceCount === 1 ? "single" : "inactive";
      return { name: c.n, s: c.s, serviceCount, activeServices, tier };
    }).filter(c => c.serviceCount > 0);

    const totalActive = clients.length;
    const totalServiceInstances = clients.reduce((a, c) => a + c.serviceCount, 0);
    const avgServices = (totalServiceInstances / totalActive).toFixed(1);

    const servicePenetration = SVC.map((sk, i) => ({
      ...sk,
      count: clients.filter(c => c.s[i] === 1).length,
      pct: ((clients.filter(c => c.s[i] === 1).length / totalActive) * 100).toFixed(1),
    })).sort((a, b) => b.count - a.count);

    const activeServiceLines = servicePenetration.filter(s => s.count > 0).length;

    const tierBreakdown = {
      anchor: clients.filter(c => c.tier === "anchor"),
      growth: clients.filter(c => c.tier === "growth"),
      single: clients.filter(c => c.tier === "single"),
    };

    const solarUpsell = clients.filter(c =>
      (c.activeServices.includes("metering") || c.activeServices.includes("recovery")) &&
      !c.activeServices.includes("solar")
    );

    const prepaidUpsell = clients.filter(c =>
      c.activeServices.includes("solar") && !c.activeServices.includes("prepaid")
    );

    const loggingOnly = clients.filter(c =>
      c.serviceCount === 1 && c.activeServices.includes("logging")
    );

    const multiSite = [
      { group: "Oncology Group", prefix: "ONCOLOGY", clients: clients.filter(c => c.name.startsWith("ONCOLOGY")) },
      { group: "Shoprite", prefix: "SHOPRITE", clients: clients.filter(c => c.name.startsWith("SHOPRITE")) },
      { group: "City Capital", prefix: "CITY CAPITAL", clients: clients.filter(c => c.name.startsWith("CITY CAPITAL")) },
      { group: "Bidvest", prefix: "BIDVEST", clients: clients.filter(c => c.name.startsWith("BIDVEST")) },
      { group: "Eikendal", prefix: "EIKENDAL", clients: clients.filter(c => c.name.startsWith("EIKENDAL")) },
      { group: "Tafelberg Furnishers", prefix: "TAFELBERG", clients: clients.filter(c => c.name.startsWith("TAFELBERG")) },
      { group: "Spar", prefix: "SPAR", clients: clients.filter(c => c.name.startsWith("SPAR")) },
    ].filter(g => g.clients.length >= 2);

    const retailability = clients.find(c => c.name.includes("RETAILABILITY"));

    return {
      clients, totalActive, totalServiceInstances, avgServices,
      servicePenetration, activeServiceLines, tierBreakdown,
      crossSell: { solarUpsell, prepaidUpsell, loggingOnly },
      multiSite, retailability,
    };
  }, []);
}

// ── Shared Components ────────────────────────────────────────────────────
const green = "#34D399";
const dimBorder = "#1A2A20";

function MetricCard({ label, value, sub, accent: a }) {
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: "18px 20px",
      flex: "1 1 0", minWidth: 140,
    }}>
      <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: t.fontMono, fontSize: 28, fontWeight: 700, color: a || green, lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.text2, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: t.fontMono, fontSize: 16, fontWeight: 600, color: t.text1, margin: 0, letterSpacing: -0.3 }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontFamily: t.fontBody, fontSize: 13, color: t.text2, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function InsightBox({ accent: a, title, children }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${t.surface} 0%, ${t.bg} 100%)`,
      border: `1px solid ${t.border}`, borderRadius: 8, padding: 24,
      borderLeft: `3px solid ${a || green}`, marginTop: 24,
    }}>
      {title && <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 600, color: a || green, marginBottom: 8 }}>{title}</div>}
      <div style={{ fontFamily: t.fontBody, fontSize: 14, color: t.text1, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ── Views ────────────────────────────────────────────────────────────────
function OverviewView({ data }) {
  const { totalActive, totalServiceInstances, avgServices, tierBreakdown, activeServiceLines, multiSite, retailability } = data;
  const text3 = "#3F3F46";

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        <MetricCard label="Active Clients" value={totalActive} sub="Western Cape portfolio" />
        <MetricCard label="Service Instances" value={totalServiceInstances} sub={`across ${activeServiceLines} active service lines`} accent="#60A5FA" />
        <MetricCard label="Avg Services/Client" value={avgServices} sub="depth of engagement" accent="#FBBF24" />
        <MetricCard label="Anchor Clients" value={tierBreakdown.anchor.length} sub="4+ services (highest stickiness)" accent="#A78BFA" />
      </div>

      <SectionHeader title="Client Depth Distribution" subtitle="Portfolio segmented by service engagement depth — a proxy for stickiness and revenue concentration" />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        {[
          { tier: "anchor", label: "Anchor Tier", desc: "4+ services", color: "#A78BFA", clients: tierBreakdown.anchor },
          { tier: "growth", label: "Growth Tier", desc: "2\u20133 services", color: "#FBBF24", clients: tierBreakdown.growth },
          { tier: "single", label: "Acquisition Tier", desc: "1 service", color: "#60A5FA", clients: tierBreakdown.single },
        ].map(tr => (
          <div key={tr.tier} style={{
            flex: "1 1 0", minWidth: 220, background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 8, padding: 20, borderTop: `3px solid ${tr.color}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 600, color: t.text1 }}>{tr.label}</div>
                <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.text2 }}>{tr.desc}</div>
              </div>
              <div style={{ fontFamily: t.fontMono, fontSize: 24, fontWeight: 700, color: tr.color }}>
                {tr.clients.length}
              </div>
            </div>
            <div style={{ height: 6, background: text3, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
              <div style={{
                height: "100%", background: tr.color, borderRadius: 3,
                width: `${(tr.clients.length / totalActive * 100)}%`, transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.text2, lineHeight: 1.6 }}>
              {tr.clients.sort((a, b) => b.serviceCount - a.serviceCount).slice(0, 5).map(c => c.name).join(" \u00B7 ")}
              {tr.clients.length > 5 && ` \u00B7 +${tr.clients.length - 5} more`}
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Multi-Site Client Groups" subtitle="Clients with multiple locations — proving the portfolio-within-portfolio model" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 8 }}>
        {multiSite.map(g => (
          <div key={g.group} style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6, padding: "14px 16px",
          }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 600, color: t.text1, marginBottom: 4 }}>{g.group}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 20, fontWeight: 700, color: green }}>{g.clients.length} <span style={{ fontSize: 11, color: t.text2, fontWeight: 400 }}>sites</span></div>
            <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.text2, marginTop: 4 }}>
              {g.clients.map(c => c.name.replace(g.prefix, "").replace(/^[\s\-–]+/, "").trim() || g.prefix).join(", ").substring(0, 80)}
            </div>
          </div>
        ))}
        {retailability && (
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6, padding: "14px 16px",
            borderLeft: `3px solid #FBBF24`,
          }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 600, color: t.text1, marginBottom: 4 }}>Retailability</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 20, fontWeight: 700, color: "#FBBF24" }}>118 <span style={{ fontSize: 11, color: t.text2, fontWeight: 400 }}>stores</span></div>
            <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.text2, marginTop: 4 }}>
              Metering + Tariff Savings across national retail chain
            </div>
          </div>
        )}
      </div>

      <InsightBox title="INVESTOR SIGNAL">
        <strong style={{ color: "#60A5FA" }}>{tierBreakdown.single.length} single-service clients</strong> represent a quantified organic growth pipeline.
        Converting even 30% to a second service adds material revenue without new client acquisition cost.
        The <strong style={{ color: "#A78BFA" }}>{tierBreakdown.anchor.length} anchor clients</strong> at 4+ services validate the integrated model
        thesis — these demonstrate that the full-stack offering has genuine pull. Multi-site groups like
        the <strong style={{ color: green }}>Oncology network (8 sites)</strong> and <strong style={{ color: "#FBBF24" }}>Retailability (118 stores)</strong> prove
        scalability within a single client relationship. Churn risk is inversely proportional to service depth.
      </InsightBox>
    </div>
  );
}

function PenetrationView({ data }) {
  const { servicePenetration, totalActive } = data;
  const maxCount = Math.max(...servicePenetration.map(s => s.count));
  const activeSvcs = servicePenetration.filter(s => s.count > 0);
  const inactiveSvcs = servicePenetration.filter(s => s.count === 0);
  const text3 = "#3F3F46";

  return (
    <div>
      <SectionHeader
        title="Service Line Penetration"
        subtitle={`Percentage of ${totalActive} active clients using each service`}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {activeSvcs.map(s => (
          <div key={s.key} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6,
          }}>
            <div style={{
              fontFamily: t.fontMono, fontSize: 12, color: t.text2, width: 120, flexShrink: 0,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {s.short}
            </div>
            <div style={{ flex: 1, height: 20, background: text3, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: s.accent, borderRadius: 4, opacity: 0.8,
                width: `${(s.count / maxCount) * 100}%`, transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 600, color: s.accent, width: 36, textAlign: "right" }}>
              {s.count}
            </div>
            <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2, width: 42, textAlign: "right" }}>
              {s.pct}%
            </div>
          </div>
        ))}
        {inactiveSvcs.length > 0 && (
          <div style={{ fontFamily: t.fontMono, fontSize: 11, color: text3, padding: "8px 16px" }}>
            Inactive: {inactiveSvcs.map(s => s.short).join(", ")} (0 clients — consider retiring or reactivating)
          </div>
        )}
      </div>

      <SectionHeader title="Service Architecture" subtitle="How service lines map to UCSA's strategic pillars" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {[
          {
            pillar: "Energy Generation", color: "#FBBF24",
            services: ["Solar (48 clients)", "Generator (11 clients)"],
            narrative: "Core revenue engine. 48 solar clients form the foundation of the PPA model. Generator overlaps (11 clients) indicate sites with high energy criticality — prime candidates for battery storage upsell.",
          },
          {
            pillar: "Metering & Billing", color: "#A78BFA",
            services: ["Smart Metering (76)", "Prepaid (22)"],
            narrative: "Billing infrastructure across 88 unique sites (76 metering + 22 prepaid, 10 overlap). This is the UCSA moat — meter-level data enables PPA billing, tariff optimization, and the Netvendor commission revenue stream.",
          },
          {
            pillar: "Data & Monitoring", color: "#2DD4BF",
            services: ["Logging (74)", "Automation (20)"],
            narrative: "74 logging + 20 automation clients provide the data foundation for the AI ops layer. Every logging client without solar is a warm lead with existing monitoring infrastructure already installed.",
          },
          {
            pillar: "Cost Optimisation", color: "#60A5FA",
            services: ["Recovery (39)", "Tariff (24)", "Munic Acct (8)"],
            narrative: "Recovery is the original wedge product — it proves ROI quickly and builds trust for solar/PPA conversations. Tariff optimization (24 clients) is pure margin enhancement. Municipal account management opens doors to body corporates.",
          },
        ].map(p => (
          <div key={p.pillar} style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 18,
            borderTop: `3px solid ${p.color}`,
          }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 13, fontWeight: 600, color: p.color, marginBottom: 6 }}>{p.pillar}</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2, marginBottom: 10 }}>
              {p.services.join(" \u00B7 ")}
            </div>
            <div style={{ fontFamily: t.fontBody, fontSize: 12.5, color: t.text1, lineHeight: 1.6 }}>{p.narrative}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrossSellView({ data }) {
  const { crossSell } = data;

  const opportunities = [
    {
      title: "Metering/Recovery \u2192 Solar PPA",
      color: "#FBBF24",
      count: crossSell.solarUpsell.length,
      logic: "These clients already have UCSA metering or recovery infrastructure installed. Adding solar PPA is a natural upsell \u2014 the billing relationship exists, consumption data is available, and trust has been established. Includes the entire Oncology group (8 sites with metering + recovery, none with solar) as a single high-value conversion target.",
      revenue: "Avg 30kWp per site \u00D7 R1.20/kWh PPA rate \u2192 ~R54K/year per conversion",
      clients: crossSell.solarUpsell.sort((a, b) => b.serviceCount - a.serviceCount).slice(0, 10),
    },
    {
      title: "Solar \u2192 Prepaid Integration",
      color: "#A78BFA",
      count: crossSell.prepaidUpsell.length,
      logic: "Solar clients without prepaid billing represent incomplete EaaS deployments. Adding Netvendor prepaid metering unlocks the commission revenue stream and deepens client lock-in through billing infrastructure ownership. Particularly relevant for multi-tenant sites where individual unit billing drives the model.",
      revenue: "Netvendor commission at ~6% of electricity spend \u2192 avg R80\u2013120K/year per multi-tenant site",
      clients: crossSell.prepaidUpsell.sort((a, b) => b.serviceCount - a.serviceCount).slice(0, 10),
    },
    {
      title: "Logging-Only \u2192 Full Assessment",
      color: "#2DD4BF",
      count: crossSell.loggingOnly.length,
      logic: "42 clients have monitoring hardware installed but no energy services. They're already in the UCSA ecosystem with consumption data flowing. This data enables zero-cost site assessments \u2014 run the AI sizing tool on existing consumption data and generate a tailored PPA proposal automatically. No cold outreach required.",
      revenue: "Conversion to recovery + solar package \u2192 R80\u2013160K/year per site",
      clients: crossSell.loggingOnly.slice(0, 10),
    },
  ];

  const totalPipeline = opportunities.reduce((a, o) => a + o.count, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        <MetricCard label="Internal Pipeline" value={totalPipeline} sub="clients with quantified upsell paths" accent="#34D399" />
        <MetricCard label="Solar Upsell" value={crossSell.solarUpsell.length} sub="metering/recovery \u2192 PPA" accent="#FBBF24" />
        <MetricCard label="Prepaid Upsell" value={crossSell.prepaidUpsell.length} sub="solar clients \u2192 Netvendor" accent="#A78BFA" />
        <MetricCard label="Logging Warm Leads" value={crossSell.loggingOnly.length} sub="monitoring \u2192 full EaaS" accent="#2DD4BF" />
      </div>

      <SectionHeader title="Cross-Sell Pathways" subtitle="Each pathway represents a quantified revenue opportunity within the existing client base \u2014 no new acquisition required" />

      {opportunities.map(opp => (
        <div key={opp.title} style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 22,
          marginBottom: 14, borderLeft: `3px solid ${opp.color}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 600, color: opp.color }}>{opp.title}</div>
            <div style={{
              fontFamily: t.fontMono, fontSize: 12, color: t.bg, background: opp.color, padding: "3px 10px",
              borderRadius: 4, fontWeight: 700,
            }}>
              {opp.count} clients
            </div>
          </div>
          <div style={{ fontFamily: t.fontBody, fontSize: 13, color: t.text1, lineHeight: 1.6, marginBottom: 10 }}>
            {opp.logic}
          </div>
          <div style={{
            fontFamily: t.fontMono, fontSize: 11, color: green, background: dimBorder, padding: "8px 12px",
            borderRadius: 4, marginBottom: 14, border: `1px solid ${t.border}`,
          }}>
            {opp.revenue}
          </div>
          <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.text2 }}>
            <span style={{ color: t.text2, fontFamily: t.fontMono, fontSize: 12, marginRight: 8 }}>TOP TARGETS:</span>
            {opp.clients.map(c => c.name).join(" \u00B7 ")}
          </div>
        </div>
      ))}

      <InsightBox title="INVESTOR TAKEAWAY" accent={green}>
        The existing 164-client base contains <strong style={{ color: "#FBBF24" }}>{totalPipeline} quantified upsell paths</strong> that
        can be activated through the AI-powered expansion engine. At conservative 25% conversion over 18 months, this represents
        meaningful incremental revenue with near-zero acquisition cost — the client relationship, site data, and billing infrastructure
        already exist. This is the "land and expand" motion that de-risks the top line. The Oncology group alone (8 sites, all with
        metering + recovery, none with solar) represents a single conversation that could add ~R430K/year in PPA revenue.
      </InsightBox>
    </div>
  );
}

function RegistryView({ data }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { clients } = data;
  const text3 = "#3F3F46";

  const filtered = clients.filter(c => {
    const matchesTier = filter === "all" || c.tier === filter;
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  }).sort((a, b) => b.serviceCount - a.serviceCount);

  const tierColors = { anchor: "#A78BFA", growth: "#FBBF24", single: "#60A5FA" };
  const tierLabels = { anchor: "ANCHOR", growth: "GROWTH", single: "SINGLE" };
  const activeSVC = SVC.filter((_, i) => clients.some(c => c.s[i] === 1));

  return (
    <div>
      <SectionHeader title="Client Registry" subtitle={`Full portfolio with service mapping and tier classification \u2014 ${clients.length} active clients`} />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {["all", "anchor", "growth", "single"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontFamily: t.fontMono, fontSize: 11, padding: "6px 14px", borderRadius: 4, cursor: "pointer",
            background: filter === f ? (f === "all" ? t.accentLime : tierColors[f] || t.accentLime) : t.surface,
            color: filter === f ? t.bg : t.text2, border: `1px solid ${filter === f ? "transparent" : t.border}`,
            fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8,
          }}>
            {f === "all" ? `All (${clients.length})` : `${tierLabels[f]} (${data.tierBreakdown[f].length})`}
          </button>
        ))}
        <input
          type="text" placeholder="Search clients..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            fontFamily: t.fontMono, fontSize: 12, padding: "6px 12px", borderRadius: 4, marginLeft: "auto",
            background: t.surface, color: t.text1, border: `1px solid ${t.border}`, outline: "none", width: 200,
          }}
        />
        <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.text2 }}>{filtered.length} shown</div>
      </div>

      <div style={{
        maxHeight: 520, overflowY: "auto", overflowX: "auto", borderRadius: 8, border: `1px solid ${t.border}`,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: t.fontBody, fontSize: 12 }}>
          <thead>
            <tr style={{ position: "sticky", top: 0, background: t.surfaceHigh, zIndex: 2 }}>
              <th style={{ padding: "10px 14px", textAlign: "left", color: t.text2, fontFamily: t.fontMono, fontSize: 12, letterSpacing: 1, borderBottom: `1px solid ${t.border}`, position: "sticky", left: 0, background: t.surfaceHigh, zIndex: 3 }}>CLIENT</th>
              <th style={{ padding: "10px 8px", textAlign: "center", color: t.text2, fontFamily: t.fontMono, fontSize: 12, letterSpacing: 1, borderBottom: `1px solid ${t.border}`, width: 50 }}>TIER</th>
              <th style={{ padding: "10px 8px", textAlign: "center", color: t.text2, fontFamily: t.fontMono, fontSize: 12, letterSpacing: 1, borderBottom: `1px solid ${t.border}`, width: 30 }}>#</th>
              {activeSVC.map(sk => (
                <th key={sk.key} style={{
                  padding: "10px 4px", textAlign: "center", color: t.text2, fontFamily: t.fontMono, fontSize: 9,
                  letterSpacing: 0.5, borderBottom: `1px solid ${t.border}`, width: 38,
                  writingMode: "vertical-rl", transform: "rotate(180deg)", height: 80,
                }}>
                  {sk.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <tr key={c.name} style={{
                background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                borderBottom: `1px solid ${t.border}`,
              }}>
                <td style={{
                  padding: "7px 14px", color: t.text1, fontSize: 11.5, fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220,
                  position: "sticky", left: 0, background: idx % 2 === 0 ? t.bg : t.surface, zIndex: 1,
                }}>
                  {c.name}
                </td>
                <td style={{ padding: "7px 8px", textAlign: "center" }}>
                  <span style={{
                    fontFamily: t.fontMono, fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 3,
                    background: `${tierColors[c.tier]}22`, color: tierColors[c.tier], letterSpacing: 0.5,
                  }}>
                    {tierLabels[c.tier]}
                  </span>
                </td>
                <td style={{ padding: "7px 8px", textAlign: "center", fontFamily: t.fontMono, fontSize: 12, fontWeight: 600, color: t.text1 }}>
                  {c.serviceCount}
                </td>
                {activeSVC.map(sk => {
                  const svcIdx = SVC.findIndex(s => s.key === sk.key);
                  return (
                    <td key={sk.key} style={{ padding: "7px 4px", textAlign: "center" }}>
                      {c.s[svcIdx] === 1 ? (
                        <div style={{
                          width: 14, height: 14, borderRadius: 3, background: `${sk.accent}33`,
                          border: `1.5px solid ${sk.accent}`, margin: "0 auto",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: 1, background: sk.accent }} />
                        </div>
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: text3, opacity: 0.2, margin: "0 auto" }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────
export default function ClientPortfolio() {
  const [view, setView] = useState("overview");
  const data = useClientData();

  const views = [
    { id: "overview", label: "Overview" },
    { id: "penetration", label: "Service Lines" },
    { id: "crosssell", label: "Cross-Sell" },
    { id: "registry", label: "Registry" },
  ];

  return (
    <div className="fade-in">
      {/* Sub-navigation tabs */}
      <div style={{
        padding: "0 28px", borderBottom: `1px solid ${t.border}`,
        background: t.surface,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0 }}>
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              fontFamily: t.fontMono, fontSize: 11, fontWeight: view === v.id ? 600 : 400,
              padding: "12px 20px", cursor: "pointer", background: "transparent",
              color: view === v.id ? t.accentLime : t.text2,
              borderBottom: view === v.id ? `2px solid ${t.accentLime}` : "2px solid transparent",
              border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
              transition: "all 0.2s ease", letterSpacing: 0.5,
            }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 28px", maxWidth: 1100, margin: "0 auto" }}>
        {view === "overview" && <OverviewView data={data} />}
        {view === "penetration" && <PenetrationView data={data} />}
        {view === "crosssell" && <CrossSellView data={data} />}
        {view === "registry" && <RegistryView data={data} />}
      </div>
    </div>
  );
}
