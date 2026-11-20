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
import { SensitivityPlaygroundSection } from "@/components/SensitivityPlaygroundSection";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  Globe,
  GraduationCap,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  Sliders,
} from "lucide-react";

const marketData = goldyRawData as unknown as GoldyMarketData;

type TabKey = "forecast" | "sensitivity" | "backtest" | "gallery" | "macro" | "conclusions" | "all";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("forecast");
  const [activeHorizon, setActiveHorizon] = useState<"1d" | "7d" | "30d">("1d");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      key: "forecast",
      label: "Peramalan Pasar",
      icon: <TrendingUp className="w-4 h-4" />,
      badge: "Forward 30D",
    },
    {
      key: "sensitivity",
      label: "Lab Sensitivitas",
      icon: <Sliders className="w-4 h-4" />,
      badge: "What-If Simulator",
    },
    {
      key: "backtest",
      label: "Evaluasi & Backtest",
      icon: <BarChart3 className="w-4 h-4" />,
      badge: "Test Set 2024–2026",
    },
    {
      key: "gallery",
      label: "Galeri Visualisasi",
      icon: <ImageIcon className="w-4 h-4" />,
      badge: "8 Gambar Bab 4",
    },
    {
      key: "macro",
      label: "Faktor Makro & EDA",
      icon: <Globe className="w-4 h-4" />,
      badge: "Feature Importance",
    },
    {
      key: "conclusions",
      label: "Kesimpulan & Sidang",
      icon: <GraduationCap className="w-4 h-4" />,
      badge: "Bab 5 Skripsi",
    },
    {
      key: "all",
      label: "Tampilan Lengkap",
      icon: <LayoutGrid className="w-4 h-4" />,
      badge: "Semua Section",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Real-time Header & Ticker */}
      <HeaderTicker meta={marketData.project_meta} market={marketData.market_summary} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Academic Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                <span className="text-xs text-slate-400 font-mono">Platform Goldy v1.0</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Prediksi Harga Perak Berbasis Algoritma Random Forest & Intermarket Makroekonomi
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Overfitting • Koridor Risiko 95%</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS SECTION BAR */}
        {/* ========================================================================= */}
        <div className="mb-8 sticky top-3 z-30 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex items-center overflow-x-auto scrollbar-none gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
                  }`}
                >
                  <span className={isActive ? "text-slate-950" : "text-amber-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-slate-950/30 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PERAMALAN PASAR & SIMULASI FORWARD (30 HARI) */}
        {/* ========================================================================= */}
        {(activeTab === "forecast" || activeTab === "all") && (
          <div className="space-y-2 animate-fadeIn">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-4 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 1: PERAMALAN PASAR & SIMULASI FORWARD (30 HARI)</span>
              </div>
            )}

            {/* 1.1 Hero 3 Forecast Cards (H+1, H+7, H+30) */}
            <HeroForecastCards
              cards={marketData.forecast_cards}
              activeHorizon={activeHorizon}
              onSelectHorizon={setActiveHorizon}
            />

            {/* 1.2 Interactive Chart - Mode Proyeksi Masa Depan (30 Hari) */}
            <InteractiveChart
              forwardData={marketData.forward_projection}
              historicalByHorizon={marketData.historical_by_horizon}
              activeHorizon={activeHorizon}
              onSelectHorizon={setActiveHorizon}
              defaultTab="forward"
            />

            {/* 1.3 Forward 30-day Projections Data Table */}
            <ForwardSimulationTable
              projections={marketData.forward_projection}
              usdIdrRate={marketData.market_summary.usd_idr}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LABORATORIUM SIMULASI SENSITIVITAS FITUR (WHAT-IF XAI) */}
        {/* ========================================================================= */}
        {(activeTab === "sensitivity" || activeTab === "all") && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 2: LABORATORIUM SIMULASI SENSITIVITAS FITUR (XAI WHAT-IF)</span>
              </div>
            )}

            {/* 2.1 Interactive Sensitivity Playground (Explainable AI Sliders) */}
            <SensitivityPlaygroundSection
              market={marketData.market_summary}
              baseSilverPrice={marketData.market_summary.silver_usd}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EVALUASI MODEL & BACKTEST PADA DATA UJI (2024–2026) */}
        {/* ========================================================================= */}
        {(activeTab === "backtest" || activeTab === "all") && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 3: EVALUASI MODEL & BACKTEST PADA DATA UJI (2024–2026)</span>
              </div>
            )}

            {/* 3.1 Interactive Chart - Mode Evaluasi Data Uji dengan Multi-Horizon & Layer Toggles */}
            <InteractiveChart
              forwardData={marketData.forward_projection}
              historicalByHorizon={marketData.historical_by_horizon}
              activeHorizon={activeHorizon}
              onSelectHorizon={setActiveHorizon}
              defaultTab="historical"
            />

            {/* 3.2 Academic Benchmark Comparison (RF vs Linear vs Decision Tree) */}
            <AcademicBenchmarkTable metrics={marketData.metrics_table} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GALERI VISUALISASI TERPISAH PEMODELAN (BAB 4 SKRIPSI) */}
        {/* ========================================================================= */}
        {(activeTab === "gallery" || activeTab === "all") && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 4: GALERI VISUALISASI TERPISAH PEMODELAN (BAB 4 SKRIPSI)</span>
              </div>
            )}

            {/* 4.1 Galeri 8 Visualisasi Terpisah Bab 4 Skripsi (Gambar 9.1 - 9.8) */}
            <ThesisGallerySection figures={marketData.thesis_figures} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FAKTOR MAKROEKONOMI & FEATURE IMPORTANCE */}
        {/* ========================================================================= */}
        {(activeTab === "macro" || activeTab === "all") && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 5: FAKTOR MAKROEKONOMI & FEATURE IMPORTANCE</span>
              </div>
            )}

            {/* 5.1 Macro Drivers & Feature Importance */}
            <MacroDriversSection features={marketData.feature_importances} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: KESIMPULAN PENELITIAN & PANDUAN SIDANG (BAB 5) */}
        {/* ========================================================================= */}
        {(activeTab === "conclusions" || activeTab === "all") && (
          <div className="space-y-6 animate-fadeIn">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 6: KESIMPULAN PENELITIAN & PANDUAN SIDANG SKRIPSI</span>
              </div>
            )}

            {/* 6.1 Kesimpulan Penelitian & Validasi Akademis Bab 5 */}
            <AcademicConclusionsSection conclusions={marketData.academic_conclusions} />
          </div>
        )}
      </main>

      {/* Footer & Academic Disclaimers */}
      <Footer meta={marketData.project_meta} />
    </div>
  );
}
