"use client";

import React, { useState } from "react";
import { ForwardProjectionItem, HistoricalChartItem } from "@/types/goldy";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { LineChart as LineChartIcon, ShieldAlert, BarChart3, Info, Eye, Layers } from "lucide-react";

interface InteractiveChartProps {
  forwardData: ForwardProjectionItem[];
  historicalByHorizon: {
    "1d": HistoricalChartItem[];
    "7d": HistoricalChartItem[];
    "30d": HistoricalChartItem[];
  };
  activeHorizon: "1d" | "7d" | "30d";
  onSelectHorizon?: (horizon: "1d" | "7d" | "30d") => void;
  defaultTab?: "forward" | "historical";
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  forwardData,
  historicalByHorizon,
  activeHorizon,
  onSelectHorizon,
  defaultTab = "forward",
}) => {
  const [activeTab, setActiveTab] = useState<"forward" | "historical">(defaultTab);

  // Model toggles for historical chart
  const [showActual, setShowActual] = useState(true);
  const [showRF, setShowRF] = useState(true);
  const [showLR, setShowLR] = useState(true);
  const [showDT, setShowDT] = useState(true);
  const [showBand, setShowBand] = useState(true);

  // Selected horizon historical data
  const currentHistoricalData = historicalByHorizon[activeHorizon] || historicalByHorizon["1d"];

  // Horizon labels & metrics badge
  const horizonLabels: Record<string, { name: string; rfMetric: string; spreadMetric: string }> = {
    "1d": {
      name: "Horizon Harian (H+1)",
      rfMetric: "RMSE: $2.25 | MAPE: 1.98% | R²: 0.9869",
      spreadMetric: "Coverage: 91.5% | Puncak Resistance: $126.75",
    },
    "7d": {
      name: "Horizon Mingguan (H+7)",
      rfMetric: "RMSE: $5.08 | MAPE: 5.44% | R²: 0.9328",
      spreadMetric: "Coverage: 92.3% | Puncak Resistance: $149.63",
    },
    "30d": {
      name: "Horizon Bulanan (H+30)",
      rfMetric: "RMSE: $10.00 | MAPE: 11.14% | R²: 0.7308",
      spreadMetric: "Coverage: 89.4% | Puncak Resistance: $180.37",
    },
  };

  return (
    <section className="mb-10 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChartIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Visualisasi Kuantitatif Perak COMEX
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {activeTab === "forward"
              ? "Proyeksi 30 Hari Kalender Bursa dengan Koridor Risiko Keyakinan 95% (Fan Chart)"
              : `Pengujian Data Uji Bebas Overfitting (${horizonLabels[activeHorizon].name}): Model Utama vs Baseline & Koridor 95%`}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab("forward")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "forward"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Proyeksi Masa Depan (30 Hari)</span>
          </button>
          <button
            onClick={() => setActiveTab("historical")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "historical"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Evaluasi Model Terpisah (Data Uji 2024–2026)</span>
          </button>
        </div>
      </div>

      {/* Horizon & Filter Selector in Historical Tab */}
      {activeTab === "historical" && (
        <div className="pt-4 pb-2 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          {/* Horizon Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Pilih Horizon:
            </span>
            {(["1d", "7d", "30d"] as const).map((h) => (
              <button
                key={h}
                onClick={() => onSelectHorizon?.(h)}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                  activeHorizon === h
                    ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 font-extrabold"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {h.toUpperCase()} ({h === "1d" ? "1 Hari" : h === "7d" ? "7 Hari" : "30 Hari"})
              </button>
            ))}
          </div>

          {/* Model Layer Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" /> Layer:
            </span>
            <button
              onClick={() => setShowActual(!showActual)}
              className={`px-2.5 py-1 rounded border transition-all ${
                showActual
                  ? "bg-slate-100 text-slate-950 border-white font-bold"
                  : "bg-slate-950 text-slate-500 border-slate-800 line-through opacity-60"
              }`}
            >
              Aktual
            </button>
            <button
              onClick={() => setShowRF(!showRF)}
              className={`px-2.5 py-1 rounded border transition-all ${
                showRF
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold"
                  : "bg-slate-950 text-slate-500 border-slate-800 line-through opacity-60"
              }`}
            >
              RF Tuned
            </button>
            <button
              onClick={() => setShowLR(!showLR)}
              className={`px-2.5 py-1 rounded border transition-all ${
                showLR
                  ? "bg-blue-500/20 text-blue-300 border-blue-500 font-bold"
                  : "bg-slate-950 text-slate-500 border-slate-800 line-through opacity-60"
              }`}
            >
              Linear Reg
            </button>
            <button
              onClick={() => setShowDT(!showDT)}
              className={`px-2.5 py-1 rounded border transition-all ${
                showDT
                  ? "bg-orange-500/20 text-orange-300 border-orange-500 font-bold"
                  : "bg-slate-950 text-slate-500 border-slate-800 line-through opacity-60"
              }`}
            >
              Decision Tree
            </button>
            <button
              onClick={() => setShowBand(!showBand)}
              className={`px-2.5 py-1 rounded border transition-all ${
                showBand
                  ? "bg-amber-500/20 text-amber-300 border-amber-500 font-bold"
                  : "bg-slate-950 text-slate-500 border-slate-800 line-through opacity-60"
              }`}
            >
              Koridor 95%
            </button>
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      {activeTab === "historical" && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="text-emerald-400 font-semibold">
            ★ Model Utama: <span className="text-white">{horizonLabels[activeHorizon].rfMetric}</span>
          </div>
          <div className="text-amber-400 font-semibold">
            🛡 Koridor Risiko: <span className="text-slate-300">{horizonLabels[activeHorizon].spreadMetric}</span>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="py-6">
        <div className="h-[430px] w-full">
          {activeTab === "forward" ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forwardData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="corridorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="display_date"
                  stroke="#64748b"
                  fontSize={11}
                  tickMargin={8}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={["auto", "auto"]}
                  tickFormatter={(val) => `$${val}`}
                  fontFamily="monospace"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ForwardProjectionItem;
                      return (
                        <div className="rounded-xl bg-slate-950 border border-slate-700 p-3 shadow-2xl text-xs font-mono">
                          <div className="font-bold text-amber-400 mb-1 border-b border-slate-800 pb-1">
                            {data.display_date} (Hari ke-{data.day})
                          </div>
                          <div className="text-white font-semibold">
                            Estimasi Harga: <span className="text-amber-300 font-extrabold">${data.predicted_price.toFixed(2)}</span>
                          </div>
                          <div className="text-emerald-400">
                            Batas Atas (95% CI): ${data.upper_bound_95.toFixed(2)}
                          </div>
                          <div className="text-rose-400">
                            Batas Bawah (95% CI): ${data.lower_bound_95.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 italic">
                            Rentang Risiko: ${(data.upper_bound_95 - data.lower_bound_95).toFixed(2)} USD
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 15, fontSize: "12px", fontFamily: "sans-serif" }}
                />
                <Area
                  type="monotone"
                  dataKey="upper_bound_95"
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#corridorGradient)"
                  name="Koridor Risiko 95% (Batas Atas / Resistance)"
                />
                <Area
                  type="monotone"
                  dataKey="lower_bound_95"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="transparent"
                  name="Batas Bawah 95% (Support / Stop Loss)"
                />
                <Line
                  type="monotone"
                  dataKey="predicted_price"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#fbbf24" }}
                  activeDot={{ r: 6 }}
                  name="Prediksi Utama Random Forest"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentHistoricalData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="histCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="display_date"
                  stroke="#64748b"
                  fontSize={11}
                  tickMargin={8}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={["auto", "auto"]}
                  tickFormatter={(val) => `$${val}`}
                  fontFamily="monospace"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as HistoricalChartItem;
                      return (
                        <div className="rounded-xl bg-slate-950 border border-slate-700 p-3 shadow-2xl text-xs font-mono">
                          <div className="font-bold text-slate-300 mb-1 border-b border-slate-800 pb-1">
                            {data.date} ({data.display_date})
                          </div>
                          <div className="text-white">
                            Harga Aktual: <span className="font-bold">${data.actual?.toFixed(2)}</span>
                          </div>
                          <div className="text-emerald-400">
                            Model Utama (RF Tuned): <span className="font-bold">${data.rf_pred?.toFixed(2)}</span>
                          </div>
                          <div className="text-sky-400">
                            Baseline (Linear Reg): <span className="font-bold">${data.linear_pred?.toFixed(2)}</span>
                          </div>
                          {data.dt_pred && (
                            <div className="text-orange-400">
                              Baseline (Decision Tree): <span className="font-bold">${data.dt_pred?.toFixed(2)}</span>
                            </div>
                          )}
                          {data.upper_bound_95 && (
                            <div className="text-rose-400 border-t border-slate-800 pt-1 mt-1">
                              Batas Atas 95%: ${data.upper_bound_95?.toFixed(2)}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 15, fontSize: "12px", fontFamily: "sans-serif" }}
                />

                {/* 95% Corridor Band */}
                {showBand && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="upper_bound_95"
                      stroke="#dc2626"
                      strokeDasharray="4 4"
                      strokeWidth={1.2}
                      fillOpacity={1}
                      fill="url(#histCorridorGrad)"
                      name="Batas Atas / Resistance (Upper Spread > Puncak)"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower_bound_95"
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={1.0}
                      fill="transparent"
                      name="Batas Bawah 95% (Support)"
                    />
                  </>
                )}

                {/* Actual Price */}
                {showActual && (
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#ffffff"
                    strokeWidth={2.2}
                    dot={false}
                    name="Harga Aktual COMEX ($ USD)"
                  />
                )}

                {/* Random Forest Tuned */}
                {showRF && (
                  <Line
                    type="monotone"
                    dataKey="rf_pred"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                    name="Model Utama: Random Forest Tuned"
                  />
                )}

                {/* Linear Regression */}
                {showLR && (
                  <Line
                    type="monotone"
                    dataKey="linear_pred"
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Baseline: Linear Regression"
                  />
                )}

                {/* Decision Tree */}
                {showDT && (
                  <Line
                    type="monotone"
                    dataKey="dt_pred"
                    stroke="#fb923c"
                    strokeWidth={1.2}
                    strokeDasharray="2 2"
                    dot={false}
                    name="Baseline: Decision Tree (Pohon Tunggal)"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Kaidah Ilmiah Koridor Risiko: </span>
          {activeTab === "forward" ? (
            <span>
              Pita bayangan kuning merepresentasikan <strong className="text-amber-300">Interval Keyakinan 95%</strong> (&plusmn;1.96 &times; &sigma; residual). 
              Semakin jauh hari peramalan ke depan, koridor melebar secara wajar untuk mencerminkan akumulasi ketidakpastian pasar finansial global.
            </span>
          ) : (
            <span>
              Pengujian dilakukan secara ketat pada <strong className="text-emerald-300">Himpunan Data Uji (*Out-of-Sample*) 2024–2026</strong>. 
              Perhatikan bahwa pada reli puncak ekstrem perak (\$115.08 USD), <strong className="text-rose-400">garis merah batas atas koridor secara konsisten berada di atas harga riil</strong>, membuktikan model bebas overfitting dan teruji kuat di kondisi pasar ekstrem.
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
