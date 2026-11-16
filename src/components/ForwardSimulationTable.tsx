"use client";

import React, { useState } from "react";
import { ForwardProjectionItem } from "@/types/goldy";
import { CalendarDays, Download, Filter } from "lucide-react";

interface ForwardSimulationTableProps {
  projections: ForwardProjectionItem[];
  usdIdrRate: number;
}

export const ForwardSimulationTable: React.FC<ForwardSimulationTableProps> = ({
  projections,
  usdIdrRate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = projections.filter(
    (item) =>
      item.display_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.day.toString().includes(searchTerm)
  );

  const handleExportCSV = () => {
    const headers = "Hari_ke,Tanggal,Prediksi_USD,Prediksi_IDR_Gram,Batas_Bawah_95_USD,Batas_Atas_95_USD\n";
    const rows = projections
      .map(
        (p) =>
          `${p.day},${p.date},${p.predicted_price},${Math.round(
            (p.predicted_price * usdIdrRate) / 31.1035
          )},${p.lower_bound_95},${p.upper_bound_95}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "proyeksi_30hari_perak_goldy.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mb-10 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Tabel Proyeksi Harga 30 Hari Bursa ke Depan
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Daftar estimasi nominal harian lengkap dengan koridor batas risiko 95%
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tanggal / hari ke-..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono w-full sm:w-48"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-800 z-10">
            <tr>
              <th className="py-2.5 px-4">Hari Ke-</th>
              <th className="py-2.5 px-4">Tanggal Kalender Bursa</th>
              <th className="py-2.5 px-4">Estimasi Harga (USD/oz)</th>
              <th className="py-2.5 px-4">Estimasi Harga (Rp/gram)</th>
              <th className="py-2.5 px-4 text-rose-400">Batas Bawah 95% (Support)</th>
              <th className="py-2.5 px-4 text-emerald-400">Batas Atas 95% (Resistance)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.map((item) => {
              const idrGram = Math.round((item.predicted_price * usdIdrRate) / 31.1035);

              return (
                <tr key={item.day} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2 px-4 font-bold text-amber-400">Hari ke-{item.day}</td>
                  <td className="py-2 px-4 text-white font-semibold">{item.display_date}</td>
                  <td className="py-2 px-4 font-extrabold text-amber-300">
                    ${item.predicted_price.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 text-slate-400">Rp {idrGram.toLocaleString("id-ID")}</td>
                  <td className="py-2 px-4 text-rose-300">${item.lower_bound_95.toFixed(2)}</td>
                  <td className="py-2 px-4 text-emerald-300">${item.upper_bound_95.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

