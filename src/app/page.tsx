"use client";

import React, { useState } from "react";
import goldyRawData from "@/data/goldy_market_data.json";
import { GoldyMarketData } from "@/types/goldy";
import { HeaderTicker } from "@/components/HeaderTicker";
import { HeroForecastCards } from "@/components/HeroForecastCards";
import { InteractiveChart } from "@/components/InteractiveChart";
import { MacroDriversSection } from "@/components/MacroDriversSection";
import { AcademicBenchmarkTable } from "@/components/AcademicBenchmarkTable";
import { ForwardSimulationTable } from "@/components/ForwardSimulationTable";
import { ThesisGallerySection } from "@/components/ThesisGallerySection";
import { AcademicConclusionsSection } from "@/components/AcademicConclusionsSection";
import { Footer } from "@/components/Footer";
import { Sparkles, BarChart2, ShieldCheck } from "lucide-react";

const marketData = goldyRawData as unknown as GoldyMarketData;

export default function Home() {
  const [activeHorizon, setActiveHorizon] = useState<"1d" | "7d" | "30d">("1d");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Real-time Header & Ticker */}
      <HeaderTicker meta={marketData.project_meta} market={marketData.market_summary} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Academic Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Tugas Akhir S1 Informatika / Sistem Informasi
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono">Status: Ready for Sempro & Vercel</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Prediksi Harga Perak Berbasis Algoritma Random Forest & Intermarket Makroekonomi
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Overfitting • 95% Volatility Spread</span>
          </div>
        </div>

        {/* 1. Hero 3 Forecast Cards (H+1, H+7, H+30) */}
        <HeroForecastCards
          cards={marketData.forecast_cards}
          activeHorizon={activeHorizon}
          onSelectHorizon={setActiveHorizon}
        />

        {/* 2. Interactive Charts (30-day Fan Chart + Historical Backtest with Multi-Horizon & Layer Toggles) */}
        <InteractiveChart
          forwardData={marketData.forward_projection}
          historicalByHorizon={marketData.historical_by_horizon}
          activeHorizon={activeHorizon}
          onSelectHorizon={setActiveHorizon}
        />

        {/* 3. Galeri Visualisasi Terpisah Bab 4 Skripsi (Gambar 9.1 - 9.8) */}
        <ThesisGallerySection figures={marketData.thesis_figures} />

        {/* 4. Macro Drivers & Feature Importance */}
        <MacroDriversSection features={marketData.feature_importances} />

        {/* 5. Academic Benchmark Comparison (RF vs Linear vs Decision Tree) */}
        <AcademicBenchmarkTable metrics={marketData.metrics_table} />

        {/* 6. Kesimpulan Penelitian & Validasi Akademis Bab 5 */}
        <AcademicConclusionsSection conclusions={marketData.academic_conclusions} />

        {/* 7. Forward 30-day Projections Data Table */}
        <ForwardSimulationTable
          projections={marketData.forward_projection}
          usdIdrRate={marketData.market_summary.usd_idr}
        />
      </main>

      {/* Footer & Academic Disclaimers */}
      <Footer meta={marketData.project_meta} />
    </div>
  );
}
