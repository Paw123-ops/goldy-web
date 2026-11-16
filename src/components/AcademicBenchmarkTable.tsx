"use client";

import React from "react";
import { MetricItem } from "@/types/goldy";
import { GraduationCap, CheckCircle2, HelpCircle } from "lucide-react";

interface AcademicBenchmarkTableProps {
  metrics: MetricItem[];
}

export const AcademicBenchmarkTable: React.FC<AcademicBenchmarkTableProps> = ({ metrics }) => {
  return (
    <section className="mb-10 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Tabel Validasi Ilmiah & Komparasi Model (Bab 4 Skripsi)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Bukti empiris pengujian out-of-sample (2024–2026): Model Utama vs Baseline Benchmark
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Metodologi Bebas Data Leakage</span>
        </div>
      </div>

      {/* Table Responsive Container */}
      <div className="overflow-x-auto scrollbar-none rounded-xl border border-slate-800 bg-slate-950/60 mb-6">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Horizon Waktu</th>
              <th className="py-3 px-4">Peran Model</th>
              <th className="py-3 px-4">Algoritma</th>
              <th className="py-3 px-4">Test MAE ($)</th>
              <th className="py-3 px-4">Test RMSE ($)</th>
              <th className="py-3 px-4">Test MAPE (%)</th>
              <th className="py-3 px-4">Test R²</th>
              <th className="py-3 px-4">Kesimpulan Akademik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {metrics.map((row, idx) => {
              const isPrimary = row.role.includes("Model Utama");

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isPrimary
                      ? "bg-amber-500/10 hover:bg-amber-500/15 font-semibold text-white"
                      : "hover:bg-slate-900/60 text-slate-400"
                  }`}
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.horizon_code === "1D"
                          ? "bg-blue-950 text-blue-300 border border-blue-800/50"
                          : row.horizon_code === "7D"
                          ? "bg-indigo-950 text-indigo-300 border border-indigo-800/50"
                          : "bg-purple-950 text-purple-300 border border-purple-800/50"
                      }`}
                    >
                      {row.horizon}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {isPrimary ? (
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        ★ {row.role}
                      </span>
                    ) : (
                      <span>{row.role}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={isPrimary ? "text-amber-400 font-extrabold" : "text-slate-300"}>
                      {row.model}
                    </span>
                  </td>
                  <td className="py-3 px-4">${row.mae.toFixed(2)}</td>
                  <td className="py-3 px-4">${row.rmse.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        row.mape < 5
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                          : row.mape < 10
                          ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                          : "bg-purple-950/80 text-purple-300 border border-purple-800"
                      }`}
                    >
                      {row.mape.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-200">{row.r2.toFixed(4)}</td>
                  <td className="py-3 px-4 text-[11px]">
                    <span className={isPrimary ? "text-emerald-300 font-semibold" : "text-slate-500"}>
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
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
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

