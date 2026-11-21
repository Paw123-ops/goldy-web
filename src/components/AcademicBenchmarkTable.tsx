"use client";

import React from "react";
import { MetricItem } from "@/types/goldy";
import { GraduationCap, CheckCircle2, HelpCircle, Star, Sparkles } from "lucide-react";

interface AcademicBenchmarkTableProps {
  metrics: MetricItem[];
}

export const AcademicBenchmarkTable: React.FC<AcademicBenchmarkTableProps> = ({ metrics }) => {
  return (
    <section className="mb-10 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tabel Validasi Ilmiah & Komparasi Model
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Bukti empiris pengujian out-of-sample (2024–2026): Model Utama vs Baseline Benchmark
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Metodologi Bebas Data Leakage</span>
        </div>
      </div>

      {/* Table Responsive Container */}
      <div className="overflow-x-auto scrollbar-none rounded-2xl border border-slate-800/80 bg-slate-950/70 mb-6 shadow-inner">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/80">
            <tr>
              <th className="py-3.5 px-4">Horizon Waktu</th>
              <th className="py-3.5 px-4">Peran Model</th>
              <th className="py-3.5 px-4">Algoritma</th>
              <th className="py-3.5 px-4">Test MAE ($)</th>
              <th className="py-3.5 px-4">Test RMSE ($)</th>
              <th className="py-3.5 px-4">Test MAPE (%)</th>
              <th className="py-3.5 px-4">Test R²</th>
              <th className="py-3.5 px-4">Kesimpulan Akademik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {metrics.map((row, idx) => {
              const isPrimary = row.role.includes("Model Utama");

              return (
                <tr
                  key={idx}
                  className={`transition-all ${
                    isPrimary
                      ? "bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent font-bold text-white border-l-2 border-l-amber-400"
                      : "hover:bg-slate-900/50 text-slate-400"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        row.horizon_code === "1D"
                          ? "bg-blue-950/80 text-blue-300 border border-blue-800/50"
                          : row.horizon_code === "7D"
                          ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/50"
                          : "bg-purple-950/80 text-purple-300 border border-purple-800/50"
                      }`}
                    >
                      {row.horizon}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {isPrimary ? (
                      <span className="text-amber-300 font-black flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {row.role}
                      </span>
                    ) : (
                      <span>{row.role}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={isPrimary ? "text-amber-400 font-black" : "text-slate-300 font-medium"}>
                      {row.model}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">${row.mae.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">${row.rmse.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-black ${
                        row.mape < 5
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-[0_0_8px_rgba(52,211,153,0.15)]"
                          : row.mape < 10
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                          : "bg-purple-950/80 text-purple-300 border border-purple-800/60"
                      }`}
                    >
                      {row.mape.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-100">{row.r2.toFixed(4)}</td>
                  <td className="py-3.5 px-4 text-[11px]">
                    <span className={isPrimary ? "text-emerald-300 font-bold" : "text-slate-500"}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Defense Guide Box for Lecturer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs shadow-inner">
        <div className="flex items-center gap-2 font-bold text-amber-300 mb-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Panduan Jawaban Ilmiah untuk Sidang / Seminar Proposal:</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans">
          <strong className="text-white">Pertanyaan Penguji:</strong> &quot;Mengapa Anda tetap menguji Linear Regression dan Decision Tree padahal judul skripsi spesifik membahas Random Forest?&quot;
          <br />
          <strong className="text-amber-300">Jawaban Mahasiswa:</strong> &quot;Dalam kaidah metodologi sains data, kinerja model utama (**Random Forest**) tidak dapat diklaim unggul secara objektif tanpa adanya model kontrol (*Baseline Benchmark*). Linear Regression dihadirkan sebagai representasi model linier parametrik standar, sedangkan Decision Tree dihadirkan sebagai pohon tunggal non-ensemble. Dengan komparasi ini, terbukti secara empiris bahwa arsitektur ensemble Random Forest berhasil memangkas tingkat kesalahan secara signifikan di seluruh horizon waktu.&quot;
        </p>
      </div>
    </section>
  );
};
