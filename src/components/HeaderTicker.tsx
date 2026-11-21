"use client";

import React from "react";
import { MarketSummary, ProjectMeta } from "@/types/goldy";
import { TrendingUp, TrendingDown, ShieldCheck, Activity, Coins, Sparkles } from "lucide-react";

interface HeaderTickerProps {
  meta: ProjectMeta;
  market: MarketSummary;
}

export const HeaderTicker: React.FC<HeaderTickerProps> = ({ meta, market }) => {
  const isPositive = market.silver_change_pct >= 0;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg font-black text-slate-950 text-xl tracking-wider border border-amber-300/40">
              <Coins className="w-6 h-6 text-slate-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-white flex items-center gap-1">
                GOLDY<span className="text-amber-400 font-extrabold">.AI</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-amber-400/15 to-amber-500/10 text-amber-300 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Random Forest Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Sistem Intelijen Prediksi Harga Perak Multi-Horizon (H+1, H+7, H+30)
            </p>
          </div>
        </div>

        {/* Status Indicators & Author Credit */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <span>Data Uji: 2024–2026 (Zero Leakage)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Model Verified (Bab 4)</span>
          </div>

          <div className="hidden lg:block text-right pl-2 border-l border-slate-800">
            <span className="text-[11px] text-slate-500">Peneliti:</span>{" "}
            <span className="text-slate-200 font-bold">{meta.author}</span>
          </div>
        </div>
      </div>

      {/* Ticker Bar (Global Intermarket Pulse with Metallic Luxury Styling) */}
      <div className="border-t border-slate-900/90 bg-gradient-to-r from-slate-950 via-[#0B0F19] to-slate-950 overflow-x-auto scrollbar-none py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-5 text-xs whitespace-nowrap font-mono">
          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="font-extrabold uppercase tracking-wider text-slate-300">Live Market Pulse:</span>
          </div>

          {/* Silver Price Highlight (Metallic Silver Card with Glowing Border) */}
          <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 border border-slate-700/60 shadow-[0_0_15px_rgba(203,213,225,0.08)] shrink-0">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 shadow-[0_0_6px_#fff]"></span>
              PERAK SPOT (SI=F):
            </span>
            <span className="text-white font-black text-sm tracking-tight font-mono">
              ${market.silver_usd.toFixed(2)}
            </span>
            <span
              className={`flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded text-[11px] ${
                isPositive
                  ? "text-emerald-300 bg-emerald-950/60 border border-emerald-800/40"
                  : "text-rose-300 bg-rose-950/60 border border-rose-800/40"
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}
              {market.silver_change_pct.toFixed(2)}%
            </span>
            <span className="text-slate-400 border-l border-slate-700/80 pl-2 font-semibold">
              ≈ Rp {market.silver_idr_per_gram.toLocaleString("id-ID")}/gram
            </span>
          </div>

          {/* Gold Highlight */}
          <div className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-slate-800/50 shrink-0">
            <span className="text-amber-400 font-bold">GOLD:</span>
            <span className="text-white font-semibold">${market.gold_usd.toFixed(1)}</span>
          </div>

          {/* GSR */}
          <div className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-slate-800/50 shrink-0">
            <span className="text-amber-300 font-bold">GSR (Rasio Emas/Perak):</span>
            <span className="text-white font-semibold">{market.gold_silver_ratio.toFixed(2)}x</span>
          </div>

          {/* DXY */}
          <div className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-slate-800/50 shrink-0">
            <span className="text-sky-400 font-bold">DXY Dolar AS:</span>
            <span className="text-white font-semibold">{market.dxy_index.toFixed(2)}</span>
          </div>

          {/* US10Y */}
          <div className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-slate-800/50 shrink-0">
            <span className="text-purple-400 font-bold">US10Y Yield:</span>
            <span className="text-white font-semibold">{market.us10y_yield.toFixed(2)}%</span>
          </div>

          {/* Crude Oil */}
          <div className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-slate-800/50 shrink-0">
            <span className="text-orange-400 font-bold">Crude Oil:</span>
            <span className="text-white font-semibold">${market.crude_oil_usd.toFixed(1)}</span>
          </div>

          {/* USD/IDR */}
          <div className="flex items-center gap-1.5 text-slate-300 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-slate-800/50 shrink-0">
            <span className="text-emerald-400 font-bold">Kurs USD/IDR:</span>
            <span className="text-white font-semibold">Rp {market.usd_idr.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
