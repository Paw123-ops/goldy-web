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
import { LineChart as LineChartIcon, ShieldAlert, BarChart3, Info } from "lucide-react";

interface InteractiveChartProps {
  forwardData: ForwardProjectionItem[];
  historicalData: HistoricalChartItem[];
  activeHorizon: "1d" | "7d" | "30d";
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  forwardData,
  historicalData,
  activeHorizon,
}) => {
  const [activeTab, setActiveTab] = useState<"forward" | "historical">("forward");

  // Format data for Forward Projection Area Spread
  const forwardChartData = forwardData.map((item) => ({
    ...item,
    // Base lower bound
    band_bottom: item.lower_bound_95,
    // Delta spread for stacked area
    band_range: Number((item.upper_bound_95 - item.lower_bound_95).toFixed(2)),
  }));

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
              : "Transparansi Evaluasi Model: Harga Aktual vs Random Forest vs Baseline Linier pada Data Uji"}
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
            <span>Proyeksi Masa Depan (30 Hari + 95% Band)</span>
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
            <span>Validasi Data Uji (2024–2026)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="py-6">
        <div className="h-[400px] w-full">
          {activeTab === "forward" ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forwardChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
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
                {/* 95% Confidence Band */}
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
                {/* Central Prediction Line */}
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
              <ComposedChart data={historicalData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
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
                            {data.date}
                          </div>
                          <div className="text-white">
                            Harga Aktual: <span className="font-bold">${data.actual.toFixed(2)}</span>
                          </div>
                          <div className="text-emerald-400">
                            Model Utama (Random Forest): <span className="font-bold">${data.rf_pred.toFixed(2)}</span>
                          </div>
                          <div className="text-sky-400">
                            Baseline (Linear Regression): <span className="font-bold">${data.linear_pred.toFixed(2)}</span>
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
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                  name="Harga Aktual COMEX ($ USD)"
                />
                <Line
                  type="monotone"
                  dataKey="rf_pred"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  name="Model Utama: Random Forest Tuned (MAPE 2.01%)"
                />
                <Line
                  type="monotone"
                  dataKey="linear_pred"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Baseline: Linear Regression"
                />
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
              Pengujian dilakukan secara ketat pada **Himpunan Data Uji (*Out-of-Sample*) 2024–2026** yang bebas dari kebocoran informasi (*zero data leakage*). 
              Random Forest membuktikan kemampuan generalisasi yang sangat stabil mengikuti pergerakan pasar riil.
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
