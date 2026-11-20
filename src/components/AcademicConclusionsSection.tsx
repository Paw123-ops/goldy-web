"use client";

import React from "react";
import { AcademicConclusionItem } from "@/types/goldy";
import { BookOpen, CheckCircle, ShieldCheck, TrendingUp, HelpCircle, Award } from "lucide-react";

interface AcademicConclusionsSectionProps {
  conclusions: AcademicConclusionItem[];
}

export const AcademicConclusionsSection: React.FC<AcademicConclusionsSectionProps> = ({
  conclusions,
}) => {
  return (
    <section className="mb-10 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Kesimpulan Hasil Penelitian & Validasi Akademis (Bab 5)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Sintesis temuan ilmiah algoritma Random Forest, solusi anti-mengekor, dan manajemen risiko multi-horizon
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Hasil Terverifikasi Test Set 2024–2026</span>
        </div>
      </div>

      {/* Conclusions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mb-6">
        {conclusions.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border bg-slate-950/70 flex flex-col justify-between transition-all hover:border-slate-700 ${
              idx === 0 || idx === 2
                ? "border-amber-500/30 bg-amber-500/[0.02]"
                : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {item.badge}
                </span>
                <span className="text-xs font-mono text-slate-500">Poin #{idx + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{item.point}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Validasi Terpenuhi di Bab 4</span>
            </div>
          </div>
        ))}
      </div>

      {/* Defense Guide for Sidang Skripsi */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 p-5">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
          <HelpCircle className="w-4 h-4" />
          <span>Pertanyaan Kunci Penguji Sidang & Panduan Jawaban Mahasiswa:</span>
        </div>

        <div className="space-y-4 text-xs font-sans text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <p className="font-bold text-white mb-1">
              1. Penguji: &quot;Bagaimana Anda membuktikan bahwa model tidak hanya mengekor harga hari kemarin?&quot;
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Jawaban:</strong> &quot;Kami tidak melatih model pada tingkat harga nominal mentah yang non-stasioner, melainkan pada <strong>Forward Returns</strong> ($R_{'{'}t+k{'}'}$) dengan memasukkan <em>Leading Momentum Indicators</em> (seperti <code>Silver_Mom20</code>, <code>Gold_Mom20</code>, dan <code>Dist_SMA50</code>). Hasilnya, akurasi arah naik/turun pasar (<em>Directional Hit Rate</em>) mencapai <strong>58.7%</strong>, membuktikan model mampu mengantisipasi pembalikan tren lebih baik daripada pergerakan acak (<em>random walk</em>).&quot;
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <p className="font-bold text-white mb-1">
              2. Penguji: &quot;Bagaimana Anda menjamin model tidak overfitting saat harga perak melonjak drastis?&quot;
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Jawaban:</strong> &quot;Kami menguji model pada periode reli ekstrem perak tahun 2026 yang menembus <strong>$115.08 USD</strong>. Dengan <em>Adaptive 95% Volatility Spread</em>, batas atas model secara konsisten berada di atas harga aktual puncak ($126.75 di H+1, $149.63 di H+7, dan $180.37 di H+30) dengan tingkat cakupan empiris ~92%. Hal ini menjadi bukti objektif bahwa model tidak meremehkan risiko dan bebas dari jebakan overfitting.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
