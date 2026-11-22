"use client";

import React, { useEffect } from "react";
import { GoldyMarketData } from "@/types/goldy";
import {
  Printer,
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Coins,
  Award,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GoldyMarketData;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const { project_meta, market_summary, forecast_cards, metrics_table } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Top Floating Control Bar */}
      <div className="fixed top-4 z-50 flex items-center gap-3 bg-slate-900/95 border border-slate-700 p-2 rounded-2xl shadow-2xl no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan Sebagai PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Tutup (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Printable Document Sheet (A4 Styled Paper) */}
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:rounded-none">
        <div className="p-8 sm:p-12 space-y-8 font-sans">
          {/* Header & Letterhead */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-slate-950 text-amber-500 flex items-center justify-center font-black text-lg">
                  G
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-serif uppercase">
                    GOLDY PLATFORM INTELLIGENCE
                  </h1>
                  <p className="text-[11px] text-slate-600 font-mono tracking-wider uppercase font-semibold">
                    Karya Ilmiah Tugas Akhir S1 Informatika / Sistem Informasi
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-600 space-y-0.5">
              <div>Nomor Dokumen: <strong className="text-slate-900">GLD-RES-2026-001</strong></div>
              <div>Tanggal Cetak: <strong className="text-slate-900">22 November 2026</strong></div>
              <div>Klasifikasi: <strong className="text-emerald-700">Publikasi Akademik Resmi</strong></div>
            </div>
          </div>

          {/* Research Identification Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Identitas Riset & Peneliti</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Judul Penelitian:</span>
                <strong className="text-slate-900 leading-snug">
                  {project_meta.thesis_title}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Peneliti (Author):</span>
                <strong className="text-slate-900 text-sm">{project_meta.author}</strong>
                <span className="text-slate-600 block text-[11px]">{project_meta.academic_degree}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Algoritma Utama:</span>
                <strong className="text-slate-900 font-mono">Random Forest Regressor (Tuned n=200)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Status Validasi Waktu:</span>
                <strong className="text-emerald-700 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Purged Walk-Forward (Zero Data Leakage)
                </strong>
              </div>
            </div>
          </div>

          {/* Section 1: Market Baseline Snapshot */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 pb-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>1. Ringkasan Kondisi Pasar Terkini (Baseline Data)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Perak Spot (SI=F):</span>
                <strong className="text-base text-slate-950 font-mono font-bold">
                  ${market_summary.silver_usd.toFixed(2)}
                </strong>
                <span className="text-[10px] text-slate-600 block">≈ Rp {market_summary.silver_idr_per_gram.toLocaleString("id-ID")}/gr</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Emas COMEX (GC=F):</span>
                <strong className="text-base text-slate-950 font-mono font-bold">
                  ${market_summary.gold_usd.toFixed(1)}
                </strong>
                <span className="text-[10px] text-slate-600 block">Rasio: {market_summary.gold_silver_ratio.toFixed(1)}x</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Dollar Index (DXY):</span>
                <strong className="text-base text-slate-950 font-mono font-bold">
                  {market_summary.dxy_index.toFixed(2)}
                </strong>
                <span className="text-[10px] text-slate-600 block">Kekuatan USD</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Kurs USD / IDR:</span>
                <strong className="text-base text-slate-950 font-mono font-bold">
                  Rp {market_summary.usd_idr.toLocaleString("id-ID")}
                </strong>
                <span className="text-[10px] text-slate-600 block">Acuan Konversi</span>
              </div>
            </div>
          </div>

          {/* Section 2: Multi-Horizon Predictions Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 pb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>2. Hasil Proyeksi Multi-Horizon Random Forest & Koridor Risiko 95%</span>
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-mono font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Horizon</th>
                    <th className="p-3">Estimasi Harga</th>
                    <th className="p-3">Estimasi Rupiah</th>
                    <th className="p-3">Delta (%)</th>
                    <th className="p-3">Koridor Risiko 95%</th>
                    <th className="p-3">Akurasi (MAPE)</th>
                    <th className="p-3">Sinyal Pasar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {Object.entries(forecast_cards).map(([key, card]) => (
                    <tr key={key} className={key === "1d" ? "bg-amber-50/40" : ""}>
                      <td className="p-3 font-bold font-mono">
                        {card.horizon_label}
                        <span className="block text-[10px] text-slate-500 font-normal">{card.target_date_label}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-950 text-sm">
                        ${card.predicted_price.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        Rp {card.predicted_idr.toLocaleString("id-ID")}/gr
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700">
                        {card.delta_pct >= 0 ? "+" : ""}{card.delta_pct.toFixed(2)}%
                      </td>
                      <td className="p-3 font-mono text-slate-600 text-[11px]">
                        ${card.lower_bound_95.toFixed(2)} – ${card.upper_bound_95.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-800">
                        {card.mape.toFixed(2)}% (R² {card.r2.toFixed(3)})
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                          {card.signal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Model Benchmark Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-200 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Pembuktian Keunggulan Komparatif (Benchmark vs Baseline)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Berdasarkan evaluasi empiris out-of-sample data uji 2024–2026, algoritma **Random Forest Tuned** terbukti mengungguli seluruh model pembanding:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/50">
                <span className="font-bold text-emerald-900 block">Random Forest (Model Utama):</span>
                <span className="text-[11px] text-slate-700 block mt-1 font-mono">
                  • H+1 MAPE: <strong>1.98%</strong> (R² 0.9869)<br />
                  • H+7 MAPE: <strong>3.42%</strong> (R² 0.9612)<br />
                  • Status: <strong>Paling Akurat</strong>
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-800 block">Linear Regression (Baseline):</span>
                <span className="text-[11px] text-slate-600 block mt-1 font-mono">
                  • H+1 MAPE: 2.45% (R² 0.9780)<br />
                  • H+7 MAPE: 4.88% (R² 0.9230)<br />
                  • Status: Underfitting pada volatilitas
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-800 block">Decision Tree:</span>
                <span className="text-[11px] text-slate-600 block mt-1 font-mono">
                  • H+1 MAPE: 3.12% (R² 0.9520)<br />
                  • H+7 MAPE: 5.64% (R² 0.8910)<br />
                  • Status: Rentan varians tinggi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
