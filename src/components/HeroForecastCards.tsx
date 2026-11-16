"use client";

import React from "react";
import { ForecastCard } from "@/types/goldy";
import { Calendar, ShieldAlert, Award, ArrowUpRight, ArrowDownRight, Compass } from "lucide-react";

interface HeroForecastCardsProps {
  cards: {
    "1d": ForecastCard;
    "7d": ForecastCard;
    "30d": ForecastCard;
  };
  activeHorizon: "1d" | "7d" | "30d";
  onSelectHorizon: (horizon: "1d" | "7d" | "30d") => void;
}

export const HeroForecastCards: React.FC<HeroForecastCardsProps> = ({
  cards,
  activeHorizon,
  onSelectHorizon,
}) => {
  const horizons: Array<"1d" | "7d" | "30d"> = ["1d", "7d", "30d"];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Executive Multi-Horizon Forecast Hub
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Pilih horizon waktu untuk mengaktifkan grafik proyeksi dan koridor risiko 95%
          </p>
        </div>

        {/* Horizon Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-stretch sm:self-auto justify-center">
          {horizons.map((key) => {
            const isActive = activeHorizon === key;
            return (
              <button
                key={key}
                onClick={() => onSelectHorizon(key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {key === "1d" ? "1 HARI (t+1)" : key === "7d" ? "7 HARI (t+7)" : "30 HARI (t+30)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {horizons.map((key) => {
          const card = cards[key];
          const isActive = activeHorizon === key;
          const isUp = card.delta >= 0;

          return (
            <div
              key={key}
              onClick={() => onSelectHorizon(key)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative overflow-hidden border ${
                isActive
                  ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-500/80 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/30 scale-[1.02]"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  Active Focus
                </div>
              )}

              {/* Horizon Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive ? "bg-amber-400/20 text-amber-300 border border-amber-400/40" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {key.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">{card.horizon_label}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{card.target_date_label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Highlight */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 font-medium mb-1">Estimasi Harga Perak COMEX:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    ${card.predicted_price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">USD/oz</span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  ≈ Rp {card.predicted_idr.toLocaleString("id-ID")} / gram
                </div>
              </div>

              {/* Delta & Direction */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                <div className="text-xs text-slate-400">Ekspektasi Perubahan:</div>
                <div
                  className={`flex items-center gap-1 font-mono font-bold text-sm ${
                    isUp ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>
                    {isUp ? "+" : ""}
                    ${Math.abs(card.delta).toFixed(2)} ({isUp ? "+" : ""}
                    {card.delta_pct}%)
                  </span>
                </div>
              </div>

              {/* 95% Confidence Corridor (Risk Management) */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Koridor Risiko Keyakinan 95%:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Batas Bawah (Support):</span>
                    <span className="text-rose-300 font-bold">${card.lower_bound_95.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Batas Atas (Resistance):</span>
                    <span className="text-emerald-300 font-bold">${card.upper_bound_95.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Model Verification Metrics */}
              <div className="space-y-1.5 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Akurasi Out-of-Sample:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {card.confidence_level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Test Set MAPE:</span>
                  <span className="font-mono font-semibold text-amber-300">{card.mape.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Koefisien Determinasi (R²):</span>
                  <span className="font-mono font-semibold text-emerald-400">{card.r2.toFixed(4)}</span>
                </div>
              </div>

              {/* Recommendation pill */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 italic">
                💡 <span className="text-slate-300 font-medium">{card.recommendation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

