"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { LiveMlPredictorSection } from "@/components/LiveMlPredictorSection";
import { InvestmentSimulatorSection } from "@/components/InvestmentSimulatorSection";
import { ExecutiveReportModal } from "@/components/ExecutiveReportModal";
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
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Award,
  Cpu,
  Wallet,
  FileText,
} from "lucide-react";

const marketData = goldyRawData as unknown as GoldyMarketData;

type TabKey = "forecast" | "predict" | "investment" | "sensitivity" | "backtest" | "gallery" | "macro" | "conclusions" | "all";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("forecast");
  const [activeHorizon, setActiveHorizon] = useState<"1d" | "7d" | "30d">("1d");
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Enable mouse wheel horizontal scrolling WITHOUT holding Shift!
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.6, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Smooth scroll helper for Left & Right buttons
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll active tab into view when changed
  useEffect(() => {
    if (tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeTab]);

  // Section slides definition for presentation-like slide transitions
  const sectionSlides: { key: TabKey; label: string; number: number }[] = [
    { key: "forecast", label: "Peramalan Pasar (Forward 30D)", number: 1 },
    { key: "predict", label: "Kalkulator ML Live", number: 2 },
    { key: "investment", label: "Simulasi Portofolio & ROI", number: 3 },
    { key: "sensitivity", label: "Lab Sensitivitas What-If", number: 4 },
    { key: "backtest", label: "Evaluasi & Backtest Data Uji", number: 5 },
    { key: "gallery", label: "Galeri Visualisasi", number: 6 },
    { key: "macro", label: "Faktor Makro & Feature Weights", number: 7 },
    { key: "conclusions", label: "Kesimpulan & Panduan Sidang", number: 8 },
  ];

  const currentSlideIdx = sectionSlides.findIndex((s) => s.key === activeTab);
  const prevSlide = currentSlideIdx > 0 ? sectionSlides[currentSlideIdx - 1] : null;
  const nextSlide = currentSlideIdx < sectionSlides.length - 1 ? sectionSlides[currentSlideIdx + 1] : null;

  const navigateToSlide = (key: TabKey) => {
    setActiveTab(key);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      key: "forecast",
      label: "Peramalan Pasar",
      icon: <TrendingUp className="w-4 h-4" />,
      badge: "Forward 30D",
    },
    {
      key: "predict",
      label: "Kalkulator ML Live",
      icon: <Cpu className="w-4 h-4" />,
      badge: "API /api/predict",
    },
    {
      key: "investment",
      label: "Simulasi Portofolio",
      icon: <Wallet className="w-4 h-4" />,
      badge: "ROI & Risiko",
    },
    {
      key: "sensitivity",
      label: "Lab Sensitivitas",
      icon: <Sliders className="w-4 h-4" />,
      badge: "What-If XAI",
    },
    {
      key: "backtest",
      label: "Evaluasi & Backtest",
      icon: <BarChart3 className="w-4 h-4" />,
      badge: "Data Uji 2024–2026",
    },
    {
      key: "gallery",
      label: "Galeri Visualisasi",
      icon: <ImageIcon className="w-4 h-4" />,
      badge: "8 Visualisasi",
    },
    {
      key: "macro",
      label: "Faktor Makro & EDA",
      icon: <Globe className="w-4 h-4" />,
      badge: "Feature Weights",
    },
    {
      key: "conclusions",
      label: "Kesimpulan & Sidang",
      icon: <GraduationCap className="w-4 h-4" />,
      badge: "Temuan Ilmiah",
    },
    {
      key: "all",
      label: "Tampilan Lengkap",
      icon: <LayoutGrid className="w-4 h-4" />,
      badge: "Semua Bagian",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Luxury Ambient Lighting Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-[500px] h-[400px] bg-sky-500/[0.06] rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-10 w-[600px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Real-time Header & Ticker */}
      <HeaderTicker
        meta={marketData.project_meta}
        market={marketData.market_summary}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Luxury Academic Banner */}
        <div className="mb-7 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-slate-900/60 border border-amber-500/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/15 to-transparent text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Tugas Akhir S1 Informatika / Sistem Informasi
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">Platform Goldy v1.0</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Teruji Bebas Overfitting
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Prediksi Harga Perak Berbasis Algoritma Random Forest & Intermarket Makroekonomi
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
              title="Unduh / Cetak Laporan Eksekutif Resmi (PDF)"
            >
              <FileText className="w-4 h-4" />
              <span>Unduh Dokumen Riset (PDF)</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Koridor Risiko 95% Volatility-Adaptive</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LUXURY FLOATING TAB NAVIGATION DOCK WITH SMOOTH SLIDE CONTROLS */}
        {/* ========================================================================= */}
        <div className="mb-8 sticky top-20 z-40 bg-slate-950/90 backdrop-blur-2xl p-2 rounded-2xl border border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-1.5">
          {/* Scroll Left Button (Slide Tabs) */}
          <button
            onClick={() => scrollTabs("left")}
            title="Geser tab ke kiri"
            aria-label="Geser tab ke kiri"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800/80 hover:border-amber-500/30 transition shrink-0 cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Tabs Container (Direct Mouse Wheel Supported Without Shift!) */}
          <div
            ref={tabsRef}
            className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-2 scroll-smooth py-0.5"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  data-tab={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.35)] font-black scale-[1.02]"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/90 border border-transparent hover:border-slate-800"
                  }`}
                >
                  <span className={isActive ? "text-slate-950" : "text-amber-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-slate-950/25 text-slate-950 font-black"
                        : "bg-slate-900 text-slate-400 border border-slate-800/60"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button (Slide Tabs) */}
          <button
            onClick={() => scrollTabs("right")}
            title="Geser tab ke kanan"
            aria-label="Geser tab ke kanan"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800/80 hover:border-amber-500/30 transition shrink-0 cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PERAMALAN PASAR & SIMULASI FORWARD (30 HARI) */}
        {/* ========================================================================= */}
        {(activeTab === "forecast" || activeTab === "all") && (
          <div className="space-y-4 animate-slide-section">
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
        {/* TAB 2: KALKULATOR PREDIKSI REAL-TIME (LIVE ML ENGINE) */}
        {/* ========================================================================= */}
        {(activeTab === "predict" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 2: KALKULATOR INFERENSI RANDOM FOREST (LIVE ML ENGINE)</span>
              </div>
            )}

            {/* 2.1 Live ML Predictor with POST /api/predict */}
            <LiveMlPredictorSection market={marketData.market_summary} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SIMULASI PORTOFOLIO & KALKULATOR PROFIT INVESTASI */}
        {/* ========================================================================= */}
        {(activeTab === "investment" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 3: SIMULASI PORTOFOLIO & KALKULATOR PROFIT INVESTASI</span>
              </div>
            )}

            {/* 3.1 Investment & ROI Simulator Section */}
            <InvestmentSimulatorSection
              market={marketData.market_summary}
              forecastCards={marketData.forecast_cards}
              forwardProjections={marketData.forward_projection}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LABORATORIUM SIMULASI SENSITIVITAS FITUR (WHAT-IF XAI) */}
        {/* ========================================================================= */}
        {(activeTab === "sensitivity" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 4: LABORATORIUM SIMULASI SENSITIVITAS FITUR (XAI WHAT-IF)</span>
              </div>
            )}

            {/* 4.1 Interactive Sensitivity Playground (Explainable AI Sliders) */}
            <SensitivityPlaygroundSection
              market={marketData.market_summary}
              baseSilverPrice={marketData.market_summary.silver_usd}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: EVALUASI MODEL & BACKTEST PADA DATA UJI (2024–2026) */}
        {/* ========================================================================= */}
        {(activeTab === "backtest" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 5: EVALUASI MODEL & BACKTEST PADA DATA UJI (2024–2026)</span>
              </div>
            )}

            {/* 5.1 Interactive Chart - Mode Evaluasi Data Uji dengan Multi-Horizon & Layer Toggles */}
            <InteractiveChart
              forwardData={marketData.forward_projection}
              historicalByHorizon={marketData.historical_by_horizon}
              activeHorizon={activeHorizon}
              onSelectHorizon={setActiveHorizon}
              defaultTab="historical"
            />

            {/* 5.2 Academic Benchmark Comparison (RF vs Linear vs Decision Tree) */}
            <AcademicBenchmarkTable metrics={marketData.metrics_table} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: GALERI VISUALISASI TERPISAH PEMODELAN */}
        {/* ========================================================================= */}
        {(activeTab === "gallery" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 6: GALERI VISUALISASI TERPISAH PEMODELAN</span>
              </div>
            )}

            {/* 6.1 Galeri 8 Visualisasi Terpisah Pemodelan */}
            <ThesisGallerySection figures={marketData.thesis_figures} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: FAKTOR MAKROEKONOMI & FEATURE IMPORTANCE */}
        {/* ========================================================================= */}
        {(activeTab === "macro" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 7: FAKTOR MAKROEKONOMI & FEATURE IMPORTANCE</span>
              </div>
            )}

            {/* 7.1 Macro Drivers & Feature Importance */}
            <MacroDriversSection features={marketData.feature_importances} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: KESIMPULAN PENELITIAN & PANDUAN SIDANG */}
        {/* ========================================================================= */}
        {(activeTab === "conclusions" || activeTab === "all") && (
          <div className="space-y-6 animate-slide-section">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-4 pt-8 border-t border-slate-800 text-amber-400 font-mono text-sm font-bold">
                <ChevronRight className="w-4 h-4" />
                <span>BAGIAN 8: KESIMPULAN PENELITIAN & PANDUAN SIDANG SKRIPSI</span>
              </div>
            )}

            {/* 8.1 Kesimpulan Penelitian & Validasi Akademis */}
            <AcademicConclusionsSection
              conclusions={marketData.academic_conclusions}
              onOpenReport={() => setIsReportOpen(true)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRESENTATION SECTION SLIDE CONTROLLER (BOTTOM DOCK) */}
        {/* ========================================================================= */}
        {activeTab !== "all" && currentSlideIdx !== -1 && (
          <div className="mt-12 p-4 sm:p-5 rounded-3xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            {/* Prev Slide Button */}
            {prevSlide ? (
              <button
                onClick={() => navigateToSlide(prevSlide.key)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Slide Sebelumnya: {prevSlide.label}</span>
              </button>
            ) : (
              <div className="hidden sm:block w-40" />
            )}

            {/* Slide Indicators Dots */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <span className="text-xs text-slate-400 font-mono">
                Slide {currentSlideIdx + 1} dari {sectionSlides.length}
              </span>
              <div className="flex items-center gap-1.5">
                {sectionSlides.map((sec, idx) => (
                  <button
                    key={sec.key}
                    onClick={() => navigateToSlide(sec.key)}
                    title={sec.label}
                    aria-label={sec.label}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIdx
                        ? "w-7 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Next Slide Button */}
            {nextSlide ? (
              <button
                onClick={() => navigateToSlide(nextSlide.key)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <span>Lanjut ke Slide {nextSlide.number}: {nextSlide.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigateToSlide("all")}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30 transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <span>Buka Tampilan Lengkap</span>
                <LayoutGrid className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </main>

      {/* Executive Print-Ready PDF Modal */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        data={marketData}
      />

      {/* Footer & Academic Disclaimers */}
      <Footer meta={marketData.project_meta} />
    </div>
  );
}
