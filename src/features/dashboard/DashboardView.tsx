import React from 'react';
import {
  FileText,
  BookOpen,
  Compass,
  Target,
  PenTool,
  Maximize2,
  Heart,
  Pin,
  FileCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const statCards = [
    {
      label: 'Fitur Pembelajaran',
      num: '4',
      sub: 'Analisis, Simulator, Similaritas & KBC →',
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
      tab: 'analisis' as ActiveTab
    },
    {
      label: 'Bagian Sistematika',
      num: '7',
      sub: 'Lihat Analisis Teks →',
      icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-600',
      tab: 'analisis' as ActiveTab
    },
    {
      label: 'Langkah Simulator',
      num: '13',
      sub: 'Lihat Simulator Proposal →',
      icon: Compass,
      gradient: 'from-purple-500 to-indigo-700',
      tab: 'simulator' as ActiveTab
    },
    {
      label: 'Tema Riset Resmi',
      num: '3',
      sub: 'Lihat Panduan Tema →',
      icon: Target,
      gradient: 'from-amber-500 to-orange-600',
      tab: 'simulator' as ActiveTab
    },
    {
      label: 'Kriteria Efektivitas Bahasa',
      num: '3',
      sub: 'Lihat Analisis Kebahasaan →',
      icon: PenTool,
      gradient: 'from-rose-500 to-pink-600',
      tab: 'analisis' as ActiveTab
    },
    {
      label: 'Bab dengan Batas Kata',
      num: '6',
      sub: 'Lihat Ketentuan Kata →',
      icon: Maximize2,
      gradient: 'from-indigo-500 to-blue-700',
      tab: 'analisis' as ActiveTab
    },
    {
      label: 'Nilai Pokok KBC (Lampiran 7)',
      num: '5',
      sub: 'Lihat Review KBC →',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      tab: 'kbc' as ActiveTab
    },
    {
      label: 'Kriteria Insersi Latar Belakang',
      num: '5',
      sub: 'Lihat Review KBC →',
      icon: Pin,
      gradient: 'from-amber-600 to-yellow-600',
      tab: 'kbc' as ActiveTab
    },
    {
      label: 'Kriteria Insersi Pembahasan',
      num: '5',
      sub: 'Lihat Review KBC →',
      icon: FileCheck,
      gradient: 'from-emerald-600 to-green-700',
      tab: 'kbc' as ActiveTab
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <span>✨ Media Inovasi Pembelajaran Bahasa Indonesia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Lentera KTI
          </h1>
          <p className="mt-2 text-white/85 text-xs sm:text-sm leading-relaxed">
            Selamat datang di media telaah mandiri Karya Tulis Ilmiah (KTI) Kelas XI MAN 1 Nganjuk. Disusun mengacu pada <strong>Pedoman Penulisan KTI TA 2026/2027</strong> dan standar gaya sitasi <strong>APA Edisi Ke-7</strong>.
          </p>
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs text-white/90">
            <div>Pemilik Aplikasi: <strong>Mustagfiroh</strong> (MAN 1 Nganjuk)</div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:block" />
            <div>Tahun Ajaran: <strong>2026/2027</strong></div>
          </div>
        </div>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.tab)}
              className={`bg-gradient-to-br ${card.gradient} text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group min-h-[125px]`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                  {card.label}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  {card.num}
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium mt-2 flex items-center gap-1">
                  <span>{card.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Widgets: Batas Kata & Tema Riset */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Batas Kata */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <span className="text-brand-600">📊</span>
              <span>Batas Kata per Bagian Naskah</span>
            </h2>
            <span className="text-xs text-ink-soft bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              Pedoman Bab II–IV
            </span>
          </div>

          <div className="divide-y divide-dashed divide-slate-100 text-xs sm:text-sm mt-2">
            {[
              { label: 'Abstrak', limit: '300 kata', color: 'bg-blue-600' },
              { label: 'BAB I Pendahuluan', limit: '1.000 kata', color: 'bg-emerald-600' },
              { label: 'BAB II Kajian Teori & Tinjauan Pustaka', limit: '1.500 kata', color: 'bg-purple-600' },
              { label: 'BAB III Metode Riset', limit: '1.000 kata', color: 'bg-amber-600' },
              { label: 'BAB IV Hasil & Pembahasan', limit: '3.000 kata', color: 'bg-rose-600' },
              { label: 'BAB V Penutup', limit: '750 kata', color: 'bg-indigo-600' },
            ].map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-ink font-medium">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  {item.label}
                </span>
                <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100/60">
                  {item.limit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tema Riset & Efektivitas Bahasa */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <span className="text-amber-500">🎯</span>
                <span>Tiga Tema Riset Resmi Madrasah</span>
              </h2>
              <span className="text-xs text-ink-soft bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                Pilih di Simulator
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {[
                { title: '1. Integrasi Keislaman & Keilmuan (Ekoteologi)', color: 'text-brand-700 bg-brand-50 border-brand-100' },
                { title: '2. Sustainable Development Goals (SDGs)', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { title: '3. Transformasi Digital untuk Pembangunan Nasional', color: 'text-purple-700 bg-purple-50 border-purple-100' },
              ].map((t, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border text-xs sm:text-sm font-semibold ${t.color}`}>
                  {t.title}
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-ink mt-6 mb-3 flex items-center gap-2">
              <span className="text-indigo-600">✍️</span>
              <span>Kriteria Efektivitas Bahasa Ilmiah</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-ink-soft">
                ✓ Jelas, logis, &amp; objektif
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-ink-soft">
                ✓ Kalimat efektif (tanpa pleonasme)
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-ink-soft">
                ✓ Ejaan &amp; tanda baca EYD V
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-ink-soft">
                ✓ Sitasi format APA Edisi Ke-7
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nilai Pokok KBC */}
      <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <span className="text-rose-500">💛</span>
              <span>Lima Nilai Pokok Kurikulum Berbasis Cinta (KBC)</span>
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Lampiran 7 Pedoman KTI — Berfungsi sebagai bingkai nilai pada Latar Belakang dan Pembahasan
            </p>
          </div>
          <button
            onClick={() => onNavigate('kbc')}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 transition-colors"
          >
            <span>Review KBC</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {[
            { name: 'Cinta Allah SWT & Rasul-Nya', desc: 'Rahmah, asmaul husna, ibadah & sunnah atas dasar cinta.', color: 'border-blue-200 bg-blue-50/50 text-blue-900' },
            { name: 'Cinta Ilmu', desc: 'Semangat pembelajar sepanjang hayat & bijak berteknologi.', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
            { name: 'Cinta Lingkungan', desc: 'Kelestarian ekosistem & pencegahan kerusakan alam (fasad).', color: 'border-teal-200 bg-teal-50/50 text-teal-900' },
            { name: 'Cinta Diri & Sesama', desc: 'Self-compassion, kesehatan mental, ukhuwah & tasamuh.', color: 'border-rose-200 bg-rose-50/50 text-rose-900' },
            { name: 'Cinta Tanah Air', desc: 'Hubbul wathan minal iman, persatuan & kearifan lokal.', color: 'border-amber-200 bg-amber-50/50 text-amber-900' },
          ].map((val, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border ${val.color} text-xs flex flex-col justify-between`}>
              <strong className="font-bold text-xs sm:text-sm block mb-1">
                {val.name}
              </strong>
              <p className="text-[11px] opacity-80 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
