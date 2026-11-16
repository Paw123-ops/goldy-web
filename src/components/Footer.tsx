"use client";

import React from "react";
import { ProjectMeta } from "@/types/goldy";
import { AlertTriangle, BookOpen, GitBranch } from "lucide-react";

interface FooterProps {
  meta: ProjectMeta;
}

export const Footer: React.FC<FooterProps> = ({ meta }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Thesis Context */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white">
              GOLDY<span className="text-amber-400">.AI</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Vercel Edge Ready
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans">
            Platform web peramalan harga komoditas perak berjangka (*COMEX Silver SI=F*) terpadu dengan 9 indikator makroekonomi global berbasis arsitektur *Random Forest Multi-Horizon*.
          </p>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Judul Skripsi: &quot;{meta.thesis_title}&quot;</span>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="md:col-span-3 space-y-2 font-mono">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Identitas Peneliti</h4>
          <div className="text-slate-300 font-semibold">{meta.author}</div>
          <div className="text-slate-500 text-[11px]">{meta.academic_degree}</div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span>Deployment: Vercel Cloud Platform</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="md:col-span-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Disclaimer Akademik & Finansial:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Platform ini dibangun sebagai implementasi karya ilmiah Tugas Akhir program sarjana. Seluruh kalkulasi dan proyeksi merupakan estimasi statistik *Machine Learning* untuk keperluan edukasi dan analisis riset, bukan anjuran mutlak untuk transaksi finansial.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
        <div>© 2026 Goldy Web Platform — Hak Cipta Riset Aa Wafi. Dilindungi Undang-Undang.</div>
        <div className="flex items-center gap-4">
          <span>Engine: Scikit-Learn Random Forest</span>
          <span>•</span>
          <span>Next.js 16 (App Router)</span>
          <span>•</span>
          <span>Hosted on Vercel</span>
        </div>
      </div>
    </footer>
  );
};

