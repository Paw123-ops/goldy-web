"use client";

import React from "react";
import { MarketSummary, ProjectMeta } from "@/types/goldy";
import { TrendingUp, TrendingDown, ShieldCheck, Activity } from "lucide-react";

interface HeaderTickerProps {
  meta: ProjectMeta;
  market: MarketSummary;
}

export const HeaderTicker: React.FC<HeaderTickerProps> = ({ meta, market }) => {
  const isPositive = market.silver_change_pct >= 0;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-slate-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-slate-950 text-xl tracking-wider">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                GOLDY<span className="text-amber-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Random Forest Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Sistem Intelijen Prediksi Harga Perak Multi-Horizon (H+1, H+7, H+30)
            </p>
          </div>
        </div>

        {/* Status Indicators & Author Credit */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Test Set: 2024–2026 (Zero Leakage)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Model Tuned & Verified</span>
          </div>

          <div className="hidden lg:block text-right">
            <span className="text-slate-500">Author:</span>{" "}
            <span className="text-slate-200 font-semibold">{meta.author}</span>
          </div>
        </div>
      </div>

      {/* Ticker Bar (Global Intermarket Pulse) */}
      <div className="border-t border-slate-900 bg-slate-900/60 overflow-x-auto scrollbar-none py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs whitespace-nowrap font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="font-bold uppercase tracking-wider text-slate-300">Market Pulse:</span>
          </div>

          {/* Silver Price Highlight */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 font-bold">PERAK (SI=F):</span>
            <span className="text-white font-extrabold text-sm">${market.silver_usd.toFixed(2)}</span>
            <span
              className={`flex items-center gap-0.5 font-bold ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? "+" : ""}
              {market.silver_change_pct.toFixed(2)}%
            </span>
            <span className="text-slate-500 border-l border-slate-700 pl-2">
              ≈ Rp {market.silver_idr_per_gram.toLocaleString("id-ID")}/gram
            </span>
          </div>

          {/* Gold */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-amber-400 font-bold">GOLD (GC=F):</span>
            <span className="text-white">${market.gold_usd.toFixed(1)}</span>
          </div>

          {/* GSR */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-amber-300 font-bold">GSR (Gold/Silver):</span>
            <span className="text-white">{market.gold_silver_ratio.toFixed(2)}x</span>
          </div>

          {/* DXY */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-sky-400 font-bold">DXY Index:</span>
            <span className="text-white">{market.dxy_index.toFixed(2)}</span>
          </div>

          {/* Crude Oil */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-orange-400 font-bold">WTI Oil:</span>
            <span className="text-white">${market.crude_oil_usd.toFixed(2)}</span>
          </div>

          {/* US10Y */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-indigo-400 font-bold">US10Y Yield:</span>
            <span className="text-white">{market.us10y_yield.toFixed(2)}%</span>
          </div>

          {/* USD/IDR */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400 font-bold">USD/IDR:</span>
            <span className="text-white">Rp {market.usd_idr.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

