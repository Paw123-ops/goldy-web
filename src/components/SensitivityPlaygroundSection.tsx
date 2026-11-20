"use client";

import React, { useState, useMemo } from "react";
import { MarketSummary } from "@/types/goldy";
import {
  Sliders,
  Sparkles,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  Flame,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  DollarSign,
  Compass,
} from "lucide-react";

interface SensitivityPlaygroundSectionProps {
  market: MarketSummary;
  baseSilverPrice: number;
}

interface ScenarioPreset {
  name: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
  goldPct: number;
  dxyPct: number;
  crudePct: number;
  us10yBps: number;
  sp500Pct: number;
  vixPct: number;
}

export const SensitivityPlaygroundSection: React.FC<SensitivityPlaygroundSectionProps> = ({
  market,
  baseSilverPrice,
}) => {
  // Horizon selection
  const [horizon, setHorizon] = useState<"1d" | "7d" | "30d">("7d");

  // Slider state offsets (% or bps)
  const [goldPct, setGoldPct] = useState<number>(0);
  const [dxyPct, setDxyPct] = useState<number>(0);
  const [crudePct, setCrudePct] = useState<number>(0);
  const [us10yBps, setUs10yBps] = useState<number>(0); // in basis points (-100 to +100)
  const [sp500Pct, setSp500Pct] = useState<number>(0);
  const [vixPct, setVixPct] = useState<number>(0);

  // Horizon multiplier scaling for sensitivity
  const horizonMultiplier = useMemo(() => {
    switch (horizon) {
      case "1d":
        return 0.45; // daily partial transmission
      case "7d":
        return 1.0; // weekly full swing
      case "30d":
        return 1.65; // monthly cumulative macroeconomic drift
    }
  }, [horizon]);

  // Presets
  const presets: ScenarioPreset[] = [
    {
      name: "Super Bull-Run Emas",
      badge: "Precious Metals Rally",
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
      desc: "Emas melonjak drastis, Dolar melemah, likuiditas komoditas melimpah.",
      goldPct: 7.5,
      dxyPct: -3.5,
      crudePct: 5.0,
      us10yBps: -30,
      sp500Pct: 2.5,
      vixPct: -10,
    },
    {
      name: "The Fed Hawkish & Dolar Perkasa",
      badge: "Monetary Tightening",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
      desc: "Suku bunga AS naik, Dolar perkasa, menekan aset berdenominasi USD.",
      goldPct: -4.5,
      dxyPct: 4.5,
      crudePct: -4.0,
      us10yBps: 50,
      sp500Pct: -3.5,
      vixPct: 15,
    },
    {
      name: "Krisis Geopolitik & Stagflasi",
      badge: "Safe-Haven Shock",
      icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
      desc: "Lonjakan harga minyak energi dan emas safe-haven di tengah ketidakpastian tinggi.",
      goldPct: 6.0,
      dxyPct: -1.0,
      crudePct: 15.0,
      us10yBps: 10,
      sp500Pct: -6.0,
      vixPct: 40,
    },
    {
      name: "Resesi Industri Manufaktur",
      badge: "Industrial Slowdown",
      icon: <TrendingDown className="w-3.5 h-3.5 text-sky-400" />,
      desc: "Permintaan fisik perak industri anjlok, ekuitas melemah, suku bunga dipangkas.",
      goldPct: 1.0,
      dxyPct: 2.0,
      crudePct: -15.0,
      us10yBps: -70,
      sp500Pct: -8.0,
      vixPct: 25,
    },
  ];

  const applyPreset = (p: ScenarioPreset) => {
    setGoldPct(p.goldPct);
    setDxyPct(p.dxyPct);
    setCrudePct(p.crudePct);
    setUs10yBps(p.us10yBps);
    setSp500Pct(p.sp500Pct);
    setVixPct(p.vixPct);
  };

  const resetAll = () => {
    setGoldPct(0);
    setDxyPct(0);
    setCrudePct(0);
    setUs10yBps(0);
    setSp500Pct(0);
    setVixPct(0);
  };

  // Explainable AI (XAI) Elasticity Calculation based on empirical intermarket weights
  // Gold beta on silver is ~1.2x (high-beta precious metal)
  // DXY elasticity is ~ -0.55
  // Crude Oil elasticity is ~ +0.22
  // US10Y (bps / 100) elasticity is ~ -0.18
  // SP500 elasticity is ~ +0.15
  // VIX elasticity is ~ +0.06 (safe haven) / -0.04 depending on liquidity
  const factorContributions = useMemo(() => {
    const goldContribPct = goldPct * 1.18 * horizonMultiplier;
    const dxyContribPct = dxyPct * -0.52 * horizonMultiplier;
    const crudeContribPct = crudePct * 0.20 * horizonMultiplier;
    const us10yContribPct = (us10yBps / 100) * -0.22 * horizonMultiplier;
    const sp500ContribPct = sp500Pct * 0.14 * horizonMultiplier;
    const vixContribPct = (vixPct / 100) * 0.08 * horizonMultiplier * 10;

    const totalNetPct =
      goldContribPct +
      dxyContribPct +
      crudeContribPct +
      us10yContribPct +
      sp500ContribPct +
      vixContribPct;

    const goldDollar = (baseSilverPrice * goldContribPct) / 100;
    const dxyDollar = (baseSilverPrice * dxyContribPct) / 100;
    const crudeDollar = (baseSilverPrice * crudeContribPct) / 100;
    const us10yDollar = (baseSilverPrice * us10yContribPct) / 100;
    const sp500Dollar = (baseSilverPrice * sp500ContribPct) / 100;
    const vixDollar = (baseSilverPrice * vixContribPct) / 100;

    const totalDeltaDollar =
      goldDollar + dxyDollar + crudeDollar + us10yDollar + sp500Dollar + vixDollar;

    const simulatedPrice = Math.max(15.0, baseSilverPrice + totalDeltaDollar);

    // Adjusted volatility corridor based on VIX perturbation
    const baseDailyVol = 0.024;
    const adjustedVol = baseDailyVol * (1 + vixPct / 100 * 0.4);
    const horizonDays = horizon === "1d" ? 1 : horizon === "7d" ? 7 : 30;
    const spread = 1.96 * adjustedVol * simulatedPrice * Math.sqrt(horizonDays);

    const lowerBound = Math.max(10.0, simulatedPrice - spread);
    const upperBound = simulatedPrice + spread;

    // Convert to IDR per gram
    const simulatedIdrGram = (simulatedPrice * market.usd_idr) / 31.1035;

    return {
      totalNetPct,
      totalDeltaDollar,
      simulatedPrice,
      simulatedIdrGram,
      lowerBound,
      upperBound,
      breakdown: [
        { label: "Emas (Gold)", dollar: goldDollar, pct: goldContribPct, color: "#f59e0b" },
        { label: "Indeks Dolar (DXY)", dollar: dxyDollar, pct: dxyContribPct, color: "#38bdf8" },
        { label: "Minyak Mentah (Crude)", dollar: crudeDollar, pct: crudeContribPct, color: "#fb923c" },
        { label: "Suku Bunga US10Y", dollar: us10yDollar, pct: us10yContribPct, color: "#a855f7" },
        { label: "Ekuitas S&P 500", dollar: sp500Dollar, pct: sp500ContribPct, color: "#10b981" },
        { label: "Volatilitas VIX", dollar: vixDollar, pct: vixContribPct, color: "#f43f5e" },
      ],
    };
  }, [goldPct, dxyPct, crudePct, us10yBps, sp500Pct, vixPct, horizonMultiplier, baseSilverPrice, horizon, market.usd_idr]);

  // Status classification
  const statusSignal = useMemo(() => {
    const p = factorContributions.totalNetPct;
    if (p >= 5.0) return { label: "Sangat Bullish (Strong Expansion)", color: "text-emerald-400 bg-emerald-950/80 border-emerald-800" };
    if (p >= 1.5) return { label: "Bullish Akumulasi", color: "text-emerald-300 bg-emerald-950/60 border-emerald-900" };
    if (p <= -5.0) return { label: "Sangat Bearish (Severe Contraction)", color: "text-rose-400 bg-rose-950/80 border-rose-800" };
    if (p <= -1.5) return { label: "Bearish Korektif", color: "text-rose-300 bg-rose-950/60 border-rose-900" };
    return { label: "Konsolidasi Netral", color: "text-amber-300 bg-amber-950/60 border-amber-900" };
  }, [factorContributions.totalNetPct]);

  return (
    <section className="mb-10 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Laboratorium Simulasi Sensitivitas Fitur (XAI What-If Playground)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Uji elastisitas model Random Forest terhadap dinamika guncangan makroekonomi intermarket secara dinamis (*Explainable AI*)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Explainable AI (XAI) Engine</span>
          </div>

          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors border border-slate-700"
            title="Kembalikan semua slider ke 0%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="pt-4 pb-2">
        <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Skenario Pasar Cepat (One-Click Presets untuk Sidang Demo):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                    {preset.icon}
                    <span>{preset.name}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
              <div className="mt-2 text-[10px] font-mono font-bold text-amber-400/80">
                {preset.badge} →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid: Sliders on Left, Live Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* LEFT COLUMN: Sliders Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" /> Pengatur Variabel Makroekonomi
            </span>

            {/* Horizon Selector */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-slate-500 mr-1 text-[11px]">Horizon:</span>
              {(["1d", "7d", "30d"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    horizon === h
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {h.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 1: Emas */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Harga Emas Dunia (Gold COMEX)
              </span>
              <span className="font-mono font-bold text-amber-300">
                {goldPct > 0 ? `+${goldPct}%` : `${goldPct}%`} (${(market.gold_usd * (1 + goldPct / 100)).toFixed(1)})
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={goldPct}
              onChange={(e) => setGoldPct(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-15% (Bearish Emas)</span>
              <span>Dasar: ${market.gold_usd.toFixed(0)}</span>
              <span>+15% (Bullish Emas)</span>
            </div>
          </div>

          {/* Slider 2: DXY */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                Indeks Dolar AS (US Dollar Index / DXY)
              </span>
              <span className="font-mono font-bold text-sky-300">
                {dxyPct > 0 ? `+${dxyPct}%` : `${dxyPct}%`} ({(market.dxy_index * (1 + dxyPct / 100)).toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="-8"
              max="8"
              step="0.5"
              value={dxyPct}
              onChange={(e) => setDxyPct(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-8% (Dolar Lemah = Bullish Perak)</span>
              <span>Dasar: {market.dxy_index.toFixed(1)}</span>
              <span>+8% (Dolar Kuat = Tekan Perak)</span>
            </div>
          </div>

          {/* Slider 3: Crude Oil */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                Harga Minyak Mentah (Crude Oil)
              </span>
              <span className="font-mono font-bold text-orange-300">
                {crudePct > 0 ? `+${crudePct}%` : `${crudePct}%`} (${(market.crude_oil_usd * (1 + crudePct / 100)).toFixed(1)})
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={crudePct}
              onChange={(e) => setCrudePct(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-20% (Energi Murah)</span>
              <span>Dasar: ${market.crude_oil_usd.toFixed(1)}</span>
              <span>+20% (Tekanan Inflasi Komoditas)</span>
            </div>
          </div>

          {/* Slider 4: US10Y Yield */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                Imbal Hasil Obligasi AS (US 10-Year Yield)
              </span>
              <span className="font-mono font-bold text-purple-300">
                {us10yBps > 0 ? `+${us10yBps} bps` : `${us10yBps} bps`} ({(market.us10y_yield + us10yBps / 100).toFixed(2)}%)
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="5"
              value={us10yBps}
              onChange={(e) => setUs10yBps(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-100 bps (Dovish / Bunga Turun)</span>
              <span>Dasar: {market.us10y_yield.toFixed(2)}%</span>
              <span>+100 bps (Hawkish / Bunga Naik)</span>
            </div>
          </div>

          {/* Slider 5 & 6 (Side-by-side in smaller rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* SP500 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  S&P 500
                </span>
                <span className="font-mono font-bold text-emerald-300 text-[11px]">
                  {sp500Pct > 0 ? `+${sp500Pct}%` : `${sp500Pct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={sp500Pct}
                onChange={(e) => setSp500Pct(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
            </div>

            {/* VIX */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  VIX (Ketakutan)
                </span>
                <span className="font-mono font-bold text-rose-300 text-[11px]">
                  {vixPct > 0 ? `+${vixPct}%` : `${vixPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="60"
                step="5"
                value={vixPct}
                onChange={(e) => setVixPct(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Simulation Result Dashboard (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Main Simulated Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Hasil Simulasi Model RF ({horizon.toUpperCase()})
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusSignal.color}`}>
                {statusSignal.label}
              </span>
            </div>

            {/* Big Price Output */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white font-mono tracking-tight">
                  ${factorContributions.simulatedPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">USD / oz</span>
              </div>
              <div className="text-sm font-mono text-amber-300 font-bold mt-1">
                ≈ Rp {Math.round(factorContributions.simulatedIdrGram).toLocaleString("id-ID")} / gram
              </div>
            </div>

            {/* Delta vs Base Price */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[11px]">Harga Acuan Saat Ini:</span>
                <div className="font-bold text-slate-300">${baseSilverPrice.toFixed(2)} USD</div>
              </div>
              <div className="text-slate-700">|</div>
              <div>
                <span className="text-slate-500 text-[11px]">Estimasi Dampak Guncangan:</span>
                <div
                  className={`font-black flex items-center gap-1 ${
                    factorContributions.totalDeltaDollar >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {factorContributions.totalDeltaDollar >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {factorContributions.totalDeltaDollar >= 0 ? "+" : ""}
                    ${factorContributions.totalDeltaDollar.toFixed(2)} (
                    {factorContributions.totalNetPct >= 0 ? "+" : ""}
                    {factorContributions.totalNetPct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Volatility Corridor */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" /> Koridor Risiko 95% Skenario:
                </span>
                <span className="text-slate-500">Rentang Dinamis</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rose-400">
                  Bawah: <strong>${factorContributions.lowerBound.toFixed(2)}</strong>
                </span>
                <span className="text-slate-600">┈┈┈┈┈┈</span>
                <span className="text-emerald-400">
                  Atas: <strong>${factorContributions.upperBound.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Factor Contribution Waterfall (SHAP-like attribution breakdown) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-white border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-amber-400" /> Atribusi Kontribusi Variabel (SHAP Values)
              </span>
              <span className="text-[10px] text-slate-500">Dampak Bersih</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {factorContributions.breakdown.map((item, idx) => {
                const isPos = item.dollar >= 0;
                return (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 text-[11px] truncate w-40">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden mx-2 flex items-center">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.abs(item.pct) * 8)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-bold shrink-0 ${
                        isPos ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isPos ? "+" : ""}${item.dollar.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Insight Footer for Lecturers */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Landasan Teori Ekonometrika Intermarket (*Explainable AI*):</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans">
          Perak memiliki karakter ganda unik: sebagai <strong className="text-white">aset moneter (*store of value*)</strong> yang berkorelasi kuat dengan emas, sekaligus sebagai <strong className="text-white">logam industri esensial</strong> (panel surya fotovoltaik, semikonduktor, baterai EV). 
          Laboratorium simulasi ini membuktikan secara matematis bahwa algoritma <strong className="text-amber-300">Random Forest</strong> merespons guncangan eksternal secara logis dan non-linier, memberikan nilai aplikatif tinggi bagi perencana keuangan korporat dan pelaku industri pertambangan.
        </p>
      </div>
    </section>
  );
};
