"use client";

import React from "react";
import { ForecastCard } from "@/types/goldy";
import { Calendar, ShieldAlert, Award, ArrowUpRight, ArrowDownRight, Compass, Sparkles } from "lucide-react";

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
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md self-stretch sm:self-auto justify-center shadow-lg">
          {horizons.map((key) => {
            const isActive = activeHorizon === key;
            return (
              <button
                key={key}
                onClick={() => onSelectHorizon(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-extrabold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {key === "1d" ? "1 HARI (t+1)" : key === "7d" ? "7 HARI (t+7)" : "30 HARI (t+30)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid 3 Luxury Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {horizons.map((key) => {
          const card = cards[key];
          const isActive = activeHorizon === key;
          const isUp = card.delta >= 0;

          return (
            <div
              key={key}
              onClick={() => onSelectHorizon(key)}
              className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 relative overflow-hidden border ${
                isActive
                  ? "bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-[#0B0F19] border-amber-500/70 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.22)] ring-1 ring-amber-400/30 scale-[1.02]"
                  : "bg-slate-900/40 backdrop-blur-md border-slate-800/70 hover:border-slate-700/80 hover:bg-slate-900/70 hover:-translate-y-1 shadow-xl"
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-slate-950 text-[10px] font-black uppercase px-3.5 py-1 rounded-bl-xl tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  Active Focus
                </div>
              )}

              {/* Horizon Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                      isActive
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
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

              {/* Predicted Price Display */}
              <div className="mb-4 pt-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    ${card.predicted_price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">USD/oz</span>
                </div>
                <div className="text-xs font-mono font-bold text-amber-300/90">
                  ≈ Rp {card.predicted_idr.toLocaleString("id-ID")}/gram
                </div>
              </div>

              {/* Expected Delta & Signal */}
              <div className="flex items-center justify-between py-3 border-y border-slate-800/80 my-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Ekspektasi Delta:</span>
                  <span
                    className={`font-black flex items-center ${
                      isUp ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isUp ? "+" : ""}
                    ${card.delta.toFixed(2)} ({isUp ? "+" : ""}
                    {card.delta_pct.toFixed(2)}%)
                  </span>
                </div>
                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isUp
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                      : "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                  }`}
                >
                  {card.signal}
                </div>
              </div>

              {/* 95% Volatility Corridor Bounds */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono mb-4 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" /> Koridor Risiko 95%:
                  </span>
                  <span className="text-slate-500 font-sans text-[10px]">{card.confidence_level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-rose-400">
                    Bawah: <strong>${card.lower_bound_95.toFixed(2)}</strong>
                  </span>
                  <span className="text-slate-600">┈┈┈┈┈┈</span>
                  <span className="text-emerald-400">
                    Atas: <strong>${card.upper_bound_95.toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              {/* Academic Metrics Row */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <div className="text-[10px] text-slate-500 uppercase">Test MAPE</div>
                  <div className="font-black text-amber-400 text-sm">{card.mape.toFixed(2)}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <div className="text-[10px] text-slate-500 uppercase">Akurasi R²</div>
                  <div className="font-black text-emerald-400 text-sm">{card.r2.toFixed(4)}</div>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="mt-4 flex items-start gap-1.5 text-[11px] text-slate-400 font-sans leading-relaxed">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{card.recommendation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
