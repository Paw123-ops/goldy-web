"use client";

import React, { useState } from "react";
import { ThesisFigureItem } from "@/types/goldy";
import { Image as ImageIcon, Download, ExternalLink, Filter, Layers } from "lucide-react";

interface ThesisGallerySectionProps {
  figures: ThesisFigureItem[];
}

export const ThesisGallerySection: React.FC<ThesisGallerySectionProps> = ({ figures }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeModalFigure, setActiveModalFigure] = useState<ThesisFigureItem | null>(null);

  const categories = ["Semua", "Per-Horizon", "Per-Model", "Komparasi"];

  const filteredFigures =
    selectedCategory === "Semua"
      ? figures
      : figures.filter((f) => f.category === selectedCategory);

  return (
    <section className="mb-10 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Galeri Visualisasi Terpisah Pemodelan (Bab 4 Skripsi)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Setiap pemodelan dan horizon disajikan mandiri dalam resolusi tinggi (300 DPI) untuk naskah skripsi
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Figures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {filteredFigures.map((fig) => (
          <div
            key={fig.id}
            className="group rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Image Preview Container */}
              <div
                onClick={() => setActiveModalFigure(fig)}
                className="relative h-48 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center border-b border-slate-800/80 group-hover:opacity-95"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fig.image_url}
                  alt={fig.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                  <span className="text-[11px] font-mono text-amber-300 font-bold bg-slate-950/90 px-3 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Klik untuk Perbesar
                  </span>
                </div>
              </div>

              {/* Figure Meta */}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {fig.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {fig.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {fig.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {fig.description}
                </p>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="p-4 pt-0 border-t border-slate-800/40">
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded mb-3 truncate">
                {fig.metrics_highlight}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalFigure(fig)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview</span>
                </button>
                <a
                  href={fig.image_url}
                  download={fig.filename}
                  className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  title="Unduh PNG 300 DPI"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>300 DPI</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom Preview */}
      {activeModalFigure && (
        <div
          onClick={() => setActiveModalFigure(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold mr-2">
                  {activeModalFigure.number}
                </span>
                <span className="text-sm font-bold text-white">
                  {activeModalFigure.title}
                </span>
              </div>
              <button
                onClick={() => setActiveModalFigure(null)}
                className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1 rounded bg-slate-800"
              >
                Tutup (Esc)
              </button>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-950/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalFigure.image_url}
                alt={activeModalFigure.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg border border-slate-800"
              />
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-300 font-sans max-w-2xl">
                {activeModalFigure.description}
              </p>
              <a
                href={activeModalFigure.image_url}
                download={activeModalFigure.filename}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono shrink-0 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Unduh File PNG (300 DPI)
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
