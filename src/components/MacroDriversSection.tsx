"use client";

import React, { useState } from "react";
import { FeatureImportanceItem } from "@/types/goldy";
import { Cpu, DollarSign, Flame, Layers } from "lucide-react";

interface MacroDriversSectionProps {
  features: FeatureImportanceItem[];
}

export const MacroDriversSection: React.FC<MacroDriversSectionProps> = ({ features }) => {
  const [mdiHorizon, setMdiHorizon] = useState<"1d" | "7d" | "30d">("1d");

  return (
    <section className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Feature Importance Column (7 cols) */}
      <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white tracking-tight">
                  Peringkat Fitur Berpengaruh (Feature Importance)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Bobot matematis *Mean Decrease in Impurity* (MDI) Random Forest
              </p>
            </div>

            {/* Switcher MDI */}
            <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setMdiHorizon("1d")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  mdiHorizon === "1d" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                1D
              </button>
              <button
                onClick={() => setMdiHorizon("7d")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  mdiHorizon === "7d" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setMdiHorizon("30d")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  mdiHorizon === "30d" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                30D
              </button>
            </div>
          </div>

          {/* List of Features */}
          <div className="space-y-3.5">
            {features.slice(0, 6).map((item, idx) => {
              const val =
                mdiHorizon === "1d"
                  ? item.importance_1d
                  : mdiHorizon === "7d"
                  ? item.importance_7d
                  : item.importance_30d;

              return (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="font-semibold text-slate-300 group-hover:text-amber-300 transition-colors">
                      {idx + 1}. {item.feature}
                    </span>
                    <span className="text-amber-400 font-bold">{val.toFixed(1)}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-500"
                      style={{ width: `${Math.min(100, val * 2.8)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic font-mono">
          🔍 Analisis: Pada H+1, momentum teknikal (SMA & Volatilitas) mendominasi, sedangkan pada H+30, rasio makro (Gold-Silver & S&P500) mengambil alih kendali tren harga.
        </div>
      </div>

      {/* Intermarket Principle Column (5 cols) */}
      <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Pilar Analisis Intermarket Perak
              </h3>
              <p className="text-xs text-slate-400">Hubungan ekonomi makro komparatif</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Card 1: Gold Anchor */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  Au
                </span>
                <span className="text-xs font-bold text-white">Emas (*Gold*) & Rasio GSR (+0.89)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Emas bertindak sebagai kompas moneter *safe-haven*. Kenaikan harga emas hampir selalu menarik harga perak naik dengan efek *multiplier* volatilitas yang lebih tinggi.
              </p>
            </div>

            {/* Card 2: DXY Pressure */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">Indeks Dolar AS / DXY (-0.42)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hubungan terbalik: Penguatan dolar AS dan kenaikan imbal hasil obligasi AS (US10Y) menekan harga komoditas logam karena biaya peluang memegang aset nir-bunga meningkat.
              </p>
            </div>

            {/* Card 3: Industrial Factor */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-white">Minyak Mentah & S&P 500 (+0.65)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Lebih dari 50% permintaan perak dunia diserap oleh industri (panel surya & EV). Sinyal ekspansi industri dari harga energi mendorong permintaan fisik perak murni.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
          🏛️ Landasan Teori Skripsi: *John J. Murphy's Intermarket Technical Analysis*.
        </div>
      </div>
    </section>
  );
};

