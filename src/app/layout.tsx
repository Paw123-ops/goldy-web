import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goldy | Prediksi Harga Perak Multi-Horizon Berbasis Random Forest",
  description:
    "Web Platform Intelijen Prediksi Harga Perak (COMEX SI=F) Multi-Horizon Berbasis Machine Learning Random Forest - Tugas Akhir Muhammad Nurwafi Muharom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
