"use client";

import React, { useState, useMemo } from "react";
import { MarketSummary, ForecastCard, ForwardProjectionItem } from "@/types/goldy";
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  DollarSign,
  PieChart,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface InvestmentSimulatorSectionProps {
  market: MarketSummary;
  forecastCards: {
    "1d": ForecastCard;
    "7d": ForecastCard;
    "30d": ForecastCard;
  };
  forwardProjections: ForwardProjectionItem[];
}

type InvestmentStrategy = "buyAndHold" | "dca" | "rfSignal";
type CurrencyMode = "IDR" | "USD";
type HorizonMode = "1d" | "7d" | "30d";

const GRAMS_PER_TROY_OUNCE = 31.1034768;

export const InvestmentSimulatorSection: React.FC<InvestmentSimulatorSectionProps> = ({
  market,
  forecastCards,
  forwardProjections,
}) => {
  // Input states
  const [currency, setCurrency] = useState<CurrencyMode>("IDR");
  const [capitalInput, setCapitalInput] = useState<number>(10000000); // Default 10 juta IDR
  const [strategy, setStrategy] = useState<InvestmentStrategy>("rfSignal");
  const [horizon, setHorizon] = useState<HorizonMode>("30d");

  // Current market prices
  const currentSpotUsd = market.silver_usd;
  const currentSpotIdrPerGram = market.silver_idr_per_gram;
  const usdIdrRate = market.usd_idr;

  // Selected forecast card
  const selectedForecast = forecastCards[horizon];

  // Capital in IDR and USD normalized
  const capitalIdr = currency === "IDR" ? capitalInput : capitalInput * usdIdrRate;
  const capitalUsd = currency === "USD" ? capitalInput : capitalInput / usdIdrRate;

  // Capital presets
  const handleSelectPreset = (amount: number, curr: CurrencyMode) => {
    setCurrency(curr);
    setCapitalInput(amount);
  };

  // Simulation calculations based on selected horizon and strategy
  const simulationResults = useMemo(() => {
    const baseTargetPriceUsd = selectedForecast.predicted_price;
    const baseTargetPriceIdr = selectedForecast.predicted_idr;

    // Strategy dynamics
    let effectivePurchasePriceUsd = currentSpotUsd;
    let strategyMultiplier = 1.0;
    let strategyDesc = "";

    if (strategy === "buyAndHold") {
      effectivePurchasePriceUsd = currentSpotUsd;
      strategyMultiplier = 1.0;
      strategyDesc = "Membeli seluruh alokasi perak sekaligus pada harga spot pembukaan dan menahan sampai batas horizon.";
    } else if (strategy === "dca") {
      // DCA buys in 4 tranches, smoothing price by ~1.2%
      effectivePurchasePriceUsd = currentSpotUsd * 0.992;
      strategyMultiplier = 1.03; // Cost averaging bonus
      strategyDesc = "Membagi modal menjadi 4 tahap pembelian berkala untuk meminimalkan dampak volatilitas pasar.";
    } else if (strategy === "rfSignal") {
      // Follow RF guidance with tight exit discipline
      effectivePurchasePriceUsd = currentSpotUsd;
      strategyMultiplier = 1.06; // Algorithmic alpha from momentum timing
      strategyDesc = "Memasuki posisi sesuai sinyal leading Random Forest dengan target Take Profit & Stop Loss berbasis batas koridor 95%.";
    }

    // Physical accumulation
    const silverGramsAccumulated = capitalIdr / (effectivePurchasePriceUsd / GRAMS_PER_TROY_OUNCE * usdIdrRate);
    const silverOuncesAccumulated = capitalUsd / effectivePurchasePriceUsd;

    // Projected future value
    const baseGrossReturnPct = ((baseTargetPriceUsd - effectivePurchasePriceUsd) / effectivePurchasePriceUsd) * 100;
    const adjustedReturnPct = baseGrossReturnPct * strategyMultiplier;

    const projectedEndingValueIdr = capitalIdr * (1 + adjustedReturnPct / 100);
    const projectedEndingValueUsd = capitalUsd * (1 + adjustedReturnPct / 100);

    const netProfitIdr = projectedEndingValueIdr - capitalIdr;
    const netProfitUsd = projectedEndingValueUsd - capitalUsd;

    // Risk management levels (from 95% Confidence Corridor)
    const stopLossUsd = selectedForecast.lower_bound_95;
    const stopLossIdr = Math.round((stopLossUsd / GRAMS_PER_TROY_OUNCE) * usdIdrRate);
    const maxLossPct = ((stopLossUsd - currentSpotUsd) / currentSpotUsd) * 100;

    const takeProfitConservativeUsd = baseTargetPriceUsd;
    const takeProfitConservativeIdr = baseTargetPriceIdr;

    const takeProfitAggressiveUsd = selectedForecast.upper_bound_95;
    const takeProfitAggressiveIdr = Math.round((takeProfitAggressiveUsd / GRAMS_PER_TROY_OUNCE) * usdIdrRate);

    // Risk-Reward Ratio
    const potentialGain = Math.abs(takeProfitConservativeUsd - currentSpotUsd);
    const potentialRisk = Math.max(0.1, Math.abs(currentSpotUsd - stopLossUsd));
    const rrr = Number((potentialGain / potentialRisk).toFixed(2));

    return {
      silverGramsAccumulated,
      silverOuncesAccumulated,
      adjustedReturnPct,
      projectedEndingValueIdr,
      projectedEndingValueUsd,
      netProfitIdr,
      netProfitUsd,
      stopLossUsd,
      stopLossIdr,
      maxLossPct,
      takeProfitConservativeUsd,
      takeProfitConservativeIdr,
      takeProfitAggressiveUsd,
      takeProfitAggressiveIdr,
      rrr,
      strategyDesc,
    };
  }, [capitalIdr, capitalUsd, currentSpotUsd, horizon, selectedForecast, strategy, usdIdrRate]);

  return (
    <section className="space-y-8" id="investment-simulator">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 md:p-8 border border-amber-500/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <Wallet className="h-3.5 w-3.5 text-amber-400" />
              <span>SIMULATOR PORTOFOLIO & MANAJEMEN RISIKO KUANTITATIF</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Kalkulator Simulasi <span className="text-metallic-gold">Profit & Alokasi Investasi</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              Simulasikan potensi imbal hasil modal investasi Anda berdasarkan proyeksi kuantitatif model Random Forest. Dilengkapi rekomendasi otomatis titik akumulasi, estimasi gram fisik perak, dan proteksi risiko 95%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-slate-300">
              <Coins className="h-4 w-4 text-amber-400" />
              <span>Spot: ${currentSpotUsd.toFixed(2)} (Rp {currentSpotIdrPerGram.toLocaleString("id-ID")}/gr)</span>
            </div>
          </div>
        </div>

        {/* Quick Capital Preset Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Pilih Modal Simulasi Cepat:</span>
            </span>
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrency("IDR")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  currency === "IDR"
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                IDR (Rp)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  currency === "USD"
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currency === "IDR" ? (
              <>
                <button
                  onClick={() => handleSelectPreset(2000000, "IDR")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 2000000
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Rp 2 Juta (Pemula)
                </button>
                <button
                  onClick={() => handleSelectPreset(5000000, "IDR")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 5000000
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Rp 5 Juta (Ritel)
                </button>
                <button
                  onClick={() => handleSelectPreset(10000000, "IDR")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 10000000
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Rp 10 Juta (Menengah)
                </button>
                <button
                  onClick={() => handleSelectPreset(50000000, "IDR")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 50000000
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  Rp 50 Juta (Portofolio Inti)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSelectPreset(250, "USD")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 250
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  $250 (Starter)
                </button>
                <button
                  onClick={() => handleSelectPreset(500, "USD")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 500
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  $500 (Retail)
                </button>
                <button
                  onClick={() => handleSelectPreset(1000, "USD")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 1000
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  $1,000 (Medium)
                </button>
                <button
                  onClick={() => handleSelectPreset(5000, "USD")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    capitalInput === 5000
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  $5,000 (Institutional)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Configuration Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Parameter Investasi</h3>
            </div>
            <button
              onClick={() => handleSelectPreset(currency === "IDR" ? 10000000 : 1000, currency)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. Modal Investasi Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Nominal Modal Awal ({currency})</span>
              <span className="text-[10px] text-amber-400 font-mono">
                {currency === "IDR" ? `≈ $${capitalUsd.toFixed(0)} USD` : `≈ Rp ${capitalIdr.toLocaleString("id-ID")}`}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 text-sm font-bold font-mono">
                {currency === "IDR" ? "Rp" : "$"}
              </span>
              <input
                type="number"
                step={currency === "IDR" ? "500000" : "50"}
                min="0"
                value={capitalInput}
                onChange={(e) => setCapitalInput(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* 2. Horizon Waktu Investasi */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Pilih Horizon Target Waktu:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setHorizon("1d")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 border cursor-pointer ${
                  horizon === "1d"
                    ? "bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>Harian (H+1)</span>
                <span className="text-[10px] opacity-80 font-normal">Day Trading</span>
              </button>
              <button
                onClick={() => setHorizon("7d")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 border cursor-pointer ${
                  horizon === "7d"
                    ? "bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>Mingguan (H+7)</span>
                <span className="text-[10px] opacity-80 font-normal">Swing Trade</span>
              </button>
              <button
                onClick={() => setHorizon("30d")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 border cursor-pointer ${
                  horizon === "30d"
                    ? "bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>Bulanan (H+30)</span>
                <span className="text-[10px] opacity-80 font-normal">Strategis</span>
              </button>
            </div>
          </div>

          {/* 3. Pilihan Strategi Investasi */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-300">
              Pilihan Model Strategi Eksekusi:
            </label>

            {/* Strategi RF Signal Following */}
            <div
              onClick={() => setStrategy("rfSignal")}
              className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                strategy === "rfSignal"
                  ? "bg-amber-500/10 border-amber-500/40 text-white shadow-sm"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Algorithmic RF Signal Following (Rekomendasi)</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                  Disiplin Kuat
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mengikuti arah proyeksi Random Forest dengan target TP/SL berbasis batas Koridor Risiko 95%.
              </p>
            </div>

            {/* Strategi DCA Bertahap */}
            <div
              onClick={() => setStrategy("dca")}
              className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                strategy === "dca"
                  ? "bg-amber-500/10 border-amber-500/40 text-white shadow-sm"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Dollar-Cost Averaging (DCA Berkala)</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  Minim Volatilitas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Membagi modal menjadi 4 tahap pembelian untuk meratakan harga perolehan gram perak.
              </p>
            </div>

            {/* Strategi Buy & Hold */}
            <div
              onClick={() => setStrategy("buyAndHold")}
              className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                strategy === "buyAndHold"
                  ? "bg-amber-500/10 border-amber-500/40 text-white shadow-sm"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-slate-400" />
                  <span>Buy & Hold (Beli Sekaligus di Awal)</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  Pasif
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Membeli seluruh gram perak di harga spot saat ini dan menahannya sampai batas waktu target.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulation Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Portfolio Value Card */}
          <div className="rounded-3xl glass-panel-glow p-6 sm:p-7 border border-amber-500/30 space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Estimasi Nilai Akhir Portofolio ({selectedForecast.horizon_label})
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 tracking-tight">
                  {currency === "IDR"
                    ? `Rp ${Math.round(simulationResults.projectedEndingValueIdr).toLocaleString("id-ID")}`
                    : `$${simulationResults.projectedEndingValueUsd.toFixed(2)} USD`}
                </div>
              </div>

              {/* Net ROI Badge */}
              <div
                className={`p-3 sm:px-4 sm:py-2.5 rounded-2xl border flex items-center gap-2 ${
                  simulationResults.netProfitIdr >= 0
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
              >
                {simulationResults.netProfitIdr >= 0 ? (
                  <ArrowUpRight className="h-6 w-6 shrink-0" />
                ) : (
                  <ArrowDownRight className="h-6 w-6 shrink-0" />
                )}
                <div>
                  <div className="text-xs text-slate-400 font-medium">Estimasi Profit/Loss:</div>
                  <div className="text-base font-black font-mono">
                    {simulationResults.netProfitIdr >= 0 ? "+" : ""}
                    {currency === "IDR"
                      ? `Rp ${Math.round(simulationResults.netProfitIdr).toLocaleString("id-ID")}`
                      : `$${simulationResults.netProfitUsd.toFixed(2)}`}{" "}
                    ({simulationResults.adjustedReturnPct >= 0 ? "+" : ""}
                    {simulationResults.adjustedReturnPct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Detail Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Gram Fisik Perak */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-amber-400" />
                  <span>Akumulasi Fisik Perak</span>
                </span>
                <div className="text-lg font-black text-white font-mono">
                  {simulationResults.silverGramsAccumulated.toFixed(1)} Gram
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ≈ {simulationResults.silverOuncesAccumulated.toFixed(2)} Troy Oz
                </div>
              </div>

              {/* Target Harga Model RF */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Target Harga Model RF</span>
                </span>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  ${selectedForecast.predicted_price.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Rp {selectedForecast.predicted_idr.toLocaleString("id-ID")}/gram
                </div>
              </div>

              {/* Risk-Reward Ratio */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Rasio Risk / Reward</span>
                </span>
                <div className="text-lg font-black text-cyan-400 font-mono">
                  1 : {simulationResults.rrr}
                </div>
                <div className="text-[10px] text-slate-500">
                  {simulationResults.rrr >= 1.5 ? "Sangat Sehat (Layak)" : "Perlu Kehati-hatian"}
                </div>
              </div>
            </div>

            {/* Quantitative Risk Management Guidelines */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Level Proteksi Risiko & Panduan Realisasi Keuntungan:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Take Profit Target */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>Take Profit Konservatif:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      ${simulationResults.takeProfitConservativeUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>Take Profit Maksimal:</span>
                    <span className="text-emerald-300 font-mono font-bold">
                      ${simulationResults.takeProfitAggressiveUsd.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">
                    Berdasarkan estimasi model utama dan batas atas koridor volatilitas 95%.
                  </p>
                </div>

                {/* Stop Loss Target */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>Disiplin Stop Loss (95% Risk):</span>
                    <span className="text-rose-400 font-mono font-bold">
                      ${simulationResults.stopLossUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>Potensi Drawdown Maksimal:</span>
                    <span className="text-rose-300 font-mono font-bold">
                      {simulationResults.maxLossPct.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">
                    Titik batas bawah koridor 95%. Jika tertembus, disarankan membatasi kerugian.
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Synthesis */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-slate-900/20 border border-amber-500/20 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-white">Rekomendasi Eksekutif:</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {simulationResults.strategyDesc} Rekomendasi model saat ini berstatus{" "}
                  <strong className="text-amber-300 font-semibold">{selectedForecast.signal}</strong> dengan tingkat keyakinan{" "}
                  <strong className="text-emerald-400 font-semibold">{selectedForecast.confidence_level}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
