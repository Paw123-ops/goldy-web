"use client";

import React, { useState } from "react";
import { MarketSummary } from "@/types/goldy";
import {
  Cpu,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Layers,
  Code2,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
  Database,
  Terminal,
} from "lucide-react";

interface LiveMlPredictorSectionProps {
  market: MarketSummary;
}

interface PredictionItem {
  horizon_code: string;
  horizon_label: string;
  target_date_label: string;
  predicted_price_usd: number;
  predicted_price_idr: number;
  delta_usd: number;
  delta_pct: number;
  risk_corridor_95: {
    lower_bound_usd: number;
    upper_bound_usd: number;
    spread_usd: number;
  };
  signal: string;
  metrics: {
    mape_test: number;
    r2_score: number;
    confidence_interval: string;
  };
  feature_contributions: Array<{
    feature: string;
    delta_usd: number;
    status: string;
  }>;
}

interface ApiResponse {
  status: string;
  http_code: number;
  timestamp: string;
  latency_ms: number;
  model_meta: {
    algorithm: string;
    engine: string;
    trees: number;
    validation_mape: number;
    validation_r2: number;
    developer: string;
    thesis_title: string;
  };
  inputs_received: {
    silver_usd: number;
    gold_usd: number;
    dxy_index: number;
    crude_oil_usd: number;
    us10y_yield: number;
    sp500_index: number;
    vix_index: number;
    usd_idr: number;
  };
  predictions: Record<string, PredictionItem>;
}

export const LiveMlPredictorSection: React.FC<LiveMlPredictorSectionProps> = ({
  market,
}) => {
  // Input fields initialized to current market values
  const [silverUsd, setSilverUsd] = useState<number>(Number(market.silver_usd.toFixed(2)));
  const [goldUsd, setGoldUsd] = useState<number>(Number(market.gold_usd.toFixed(1)));
  const [dxyIndex, setDxyIndex] = useState<number>(Number(market.dxy_index.toFixed(2)));
  const [crudeOilUsd, setCrudeOilUsd] = useState<number>(Number(market.crude_oil_usd.toFixed(2)));
  const [us10yYield, setUs10yYield] = useState<number>(Number(market.us10y_yield.toFixed(3)));
  const [sp500Index, setSp500Index] = useState<number>(Number(market.sp500_index.toFixed(0)));
  const [vixIndex, setVixIndex] = useState<number>(Number(market.vix_index.toFixed(2)));
  const [usdIdr, setUsdIdr] = useState<number>(market.usd_idr);

  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [lastExecutedTime, setLastExecutedTime] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [showJsonRaw, setShowJsonRaw] = useState<boolean>(false);
  const [activeTabHorizon, setActiveTabHorizon] = useState<"all" | "1d" | "7d" | "30d">("all");

  // Presets
  const applyPreset = (presetType: "baseline" | "bullish" | "bearish" | "oilCrisis") => {
    if (presetType === "baseline") {
      setSilverUsd(Number(market.silver_usd.toFixed(2)));
      setGoldUsd(Number(market.gold_usd.toFixed(1)));
      setDxyIndex(Number(market.dxy_index.toFixed(2)));
      setCrudeOilUsd(Number(market.crude_oil_usd.toFixed(2)));
      setUs10yYield(Number(market.us10y_yield.toFixed(3)));
      setSp500Index(Number(market.sp500_index.toFixed(0)));
      setVixIndex(Number(market.vix_index.toFixed(2)));
      setUsdIdr(market.usd_idr);
    } else if (presetType === "bullish") {
      setSilverUsd(Number((market.silver_usd * 1.02).toFixed(2)));
      setGoldUsd(Number((market.gold_usd * 1.05).toFixed(1))); // Emas naik +5%
      setDxyIndex(Number((market.dxy_index * 0.97).toFixed(2))); // Dollar turun -3%
      setCrudeOilUsd(Number((market.crude_oil_usd * 1.03).toFixed(2)));
      setUs10yYield(Number((market.us10y_yield - 0.25).toFixed(3))); // Yield turun
      setSp500Index(Number((market.sp500_index * 1.02).toFixed(0)));
      setVixIndex(14.5);
      setUsdIdr(17900);
    } else if (presetType === "bearish") {
      setSilverUsd(Number((market.silver_usd * 0.98).toFixed(2)));
      setGoldUsd(Number((market.gold_usd * 0.96).toFixed(1))); // Emas turun -4%
      setDxyIndex(Number((market.dxy_index * 1.03).toFixed(2))); // Dollar melonjak +3%
      setCrudeOilUsd(Number((market.crude_oil_usd * 0.95).toFixed(2)));
      setUs10yYield(Number((market.us10y_yield + 0.35).toFixed(3))); // Yield naik tajam
      setSp500Index(Number((market.sp500_index * 0.97).toFixed(0)));
      setVixIndex(22.0);
      setUsdIdr(18150);
    } else if (presetType === "oilCrisis") {
      setSilverUsd(Number((market.silver_usd * 1.01).toFixed(2)));
      setGoldUsd(Number((market.gold_usd * 1.03).toFixed(1)));
      setDxyIndex(Number(market.dxy_index.toFixed(2)));
      setCrudeOilUsd(Number((market.crude_oil_usd * 1.25).toFixed(2))); // Minyak meledak +25%
      setUs10yYield(Number(market.us10y_yield.toFixed(3)));
      setSp500Index(Number((market.sp500_index * 0.95).toFixed(0)));
      setVixIndex(28.5); // Panic high
      setUsdIdr(18200);
    }
  };

  // Trigger POST /api/predict
  const handleExecutePrediction = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          silver_usd: silverUsd,
          gold_usd: goldUsd,
          dxy_index: dxyIndex,
          crude_oil_usd: crudeOilUsd,
          us10y_yield: us10yYield,
          sp500_index: sp500Index,
          vix_index: vixIndex,
          usd_idr: usdIdr,
          horizon: "all",
        }),
      });

      const data: ApiResponse = await response.json();
      const end = performance.now();
      const calculatedLatency = Math.round(end - start);

      setApiResult(data);
      setLatency(calculatedLatency);
      setLastExecutedTime(new Date().toLocaleTimeString("id-ID"));
    } catch (err) {
      console.error("Gagal menjalankan inferensi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-8" id="live-ml-predictor">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-6 md:p-8 border border-amber-500/20">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
              <Cpu className="h-3.5 w-3.5 animate-pulse text-amber-400" />
              <span>LIVE MACHINE LEARNING INFERENCE ENGINE • NEXT.JS API</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Kalkulator Inferensi <span className="text-metallic-gold">Random Forest</span> Real-Time
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              Buktikan kecerdasan model secara langsung. Masukkan parameter harga emas, indeks dollar, dan indikator makro hari ini. Web akan mengeksekusi endpoint backend serverless{" "}
              <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded text-xs font-mono">POST /api/predict</code>{" "}
              untuk menghitung estimasi harga perak multi-horizon secara instan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              <span>Model: Tuned RF (200 Trees)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              <span>Endpoint: /api/predict</span>
            </div>
          </div>
        </div>

        {/* Preset Skenario Cepat */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Pilih Template Skenario Pasar Cepat:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => applyPreset("baseline")}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600 transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              <span>Kondisi Riil Terkini</span>
            </button>
            <button
              onClick={() => applyPreset("bullish")}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 transition flex items-center justify-center gap-1.5"
            >
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span>Emas Naik & Dollar Turun</span>
            </button>
            <button
              onClick={() => applyPreset("bearish")}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition flex items-center justify-center gap-1.5"
            >
              <TrendingDown className="h-3 w-3 text-rose-400" />
              <span>Dollar Kuat & Yield Tinggi</span>
            </button>
            <button
              onClick={() => applyPreset("oilCrisis")}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 transition flex items-center justify-center gap-1.5"
            >
              <Activity className="h-3 w-3 text-amber-400" />
              <span>Lonjakan Minyak +25%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Output Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Parameter Inputs Form */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Input Parameter Pasar</h3>
            </div>
            <button
              onClick={() => applyPreset("baseline")}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Perak Spot */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Harga Perak Spot Saat Ini (USD)</span>
                <span className="text-[10px] text-amber-400 font-normal">Titik Acuan</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={silverUsd}
                  onChange={(e) => setSilverUsd(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* 2. Emas */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Emas COMEX ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.1"
                  value={goldUsd}
                  onChange={(e) => setGoldUsd(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <p className="text-[10px] text-slate-400">Bobot RF: 48.2%</p>
            </div>

            {/* 3. DXY */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Indeks Dollar (DXY)
              </label>
              <input
                type="number"
                step="0.01"
                value={dxyIndex}
                onChange={(e) => setDxyIndex(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[10px] text-slate-400">Bobot RF: 24.1%</p>
            </div>

            {/* 4. Minyak Mentah */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Minyak WTI ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={crudeOilUsd}
                  onChange={(e) => setCrudeOilUsd(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <p className="text-[10px] text-slate-400">Bobot RF: 11.5%</p>
            </div>

            {/* 5. US 10-Year Yield */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                US10Y Yield (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={us10yYield}
                  onChange={(e) => setUs10yYield(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
              </div>
              <p className="text-[10px] text-slate-400">Bobot RF: 7.8%</p>
            </div>

            {/* 6. VIX Volatility */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                VIX Volatility Index
              </label>
              <input
                type="number"
                step="0.1"
                value={vixIndex}
                onChange={(e) => setVixIndex(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[10px] text-slate-400">Sentimen Panik</p>
            </div>

            {/* 7. Kurs Dollar IDR */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Kurs USD / IDR (Rp)
              </label>
              <input
                type="number"
                step="50"
                value={usdIdr}
                onChange={(e) => setUsdIdr(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[10px] text-slate-400">Konversi ke IDR/gram</p>
            </div>
          </div>

          {/* Action Button: Execute Prediction */}
          <div className="pt-2">
            <button
              onClick={handleExecutePrediction}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Mengeksekusi Inferensi Machine Learning...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Jalankan Inferensi (POST /api/predict)</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 px-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next.js Serverless Route Ready</span>
              </span>
              {latency && (
                <span className="text-amber-400 font-mono">Latency: {latency} ms</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {apiResult ? (
            <div className="space-y-6">
              {/* Output Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Hasil Inferensi Berhasil Diterima</h4>
                    <p className="text-xs text-slate-400">
                      Waktu Eksekusi: {lastExecutedTime} • Latency API: {latency} ms
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
                  <span>HTTP 200 OK</span>
                </div>
              </div>

              {/* 3 Horizon Results Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(apiResult.predictions).map(([key, item]) => {
                  const isUp = item.delta_usd >= 0;
                  return (
                    <div
                      key={key}
                      className="rounded-xl glass-panel-glow p-4 border border-amber-500/20 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          {key === "1d" ? "H+1 Harian" : key === "7d" ? "H+7 Mingguan" : "H+30 Bulanan"}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isUp
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                          <span>{isUp ? "+" : ""}{item.delta_pct}%</span>
                        </span>
                      </div>

                      <div>
                        <div className="text-2xl font-black text-white font-mono tracking-tight">
                          ${item.predicted_price_usd.toFixed(2)}
                        </div>
                        <div className="text-xs text-amber-300/80 font-medium mt-0.5">
                          ≈ Rp {item.predicted_price_idr.toLocaleString("id-ID")} / gram
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Sinyal:</span>
                          <span className="text-white font-medium">{item.signal}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Koridor 95%:</span>
                          <span className="text-slate-300 font-mono">
                            ${item.risk_corridor_95.lower_bound_usd} - ${item.risk_corridor_95.upper_bound_usd}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Akurasi Tes (MAPE):</span>
                          <span className="text-emerald-400 font-mono font-semibold">{item.metrics.mape_test}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feature Impact Explanations */}
              <div className="rounded-xl glass-panel p-5 border border-slate-800 space-y-3">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  <span>Dekomposisi Transmisi Variabel Makro (Horizon H+7):</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {apiResult.predictions["7d"]?.feature_contributions.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
                    >
                      <span className="text-[11px] text-slate-400 truncate">{c.feature.split("(")[0]}</span>
                      <span
                        className={`text-xs font-mono font-bold mt-1 ${
                          c.delta_usd >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {c.delta_usd >= 0 ? "+" : ""}${c.delta_usd}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw JSON Inspector (Proof for Examiners & Friends!) */}
              <div className="rounded-xl glass-panel border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setShowJsonRaw(!showJsonRaw)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Inspektur Bukti Data: Response JSON Asli dari Backend (/api/predict)
                    </span>
                  </div>
                  {showJsonRaw ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {showJsonRaw && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-80 p-3 rounded-lg bg-black/60 border border-slate-900 leading-relaxed">
                      {JSON.stringify(apiResult, null, 2)}
                    </pre>
                    <p className="text-[10px] text-slate-400 mt-2">
                      💡 Tunjukkan bagian JSON ini ke teman atau dosen penguji Anda sebagai bukti bahwa kalkulasi dilakukan langsung melalui API serverless backend.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State before first run */
            <div className="rounded-2xl glass-panel p-10 border border-dashed border-slate-800 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Cpu className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-base font-bold text-white">Mesin Inferensi Siap Dijalankan</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Silakan sesuaikan parameter pada form di sebelah kiri atau pilih salah satu template pasar, lalu klik tombol{" "}
                  <strong className="text-amber-400 font-medium">"Jalankan Inferensi"</strong> untuk memanggil API backend.
                </p>
              </div>
              <button
                onClick={handleExecutePrediction}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Mulai Uji Inferensi Sekarang</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
