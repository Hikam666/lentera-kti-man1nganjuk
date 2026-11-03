import React from 'react';
import { Badge } from './Badge';
import { ReviewCardProps } from '../types';
import { CheckCircle2, AlertOctagon, Link2, Feather } from 'lucide-react';

export const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  subtitle,
  strengths,
  revisi,
  keselarasanStatus,
  keselarasanNote,
  bahasaStatus,
  bahasaItems,
  metrics
}) => {
  return (
    <div className="mt-8 pt-6 border-t-2 border-slate-200">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="text-xs sm:text-sm text-ink-soft mt-1 mb-6 leading-relaxed">
        {subtitle}
      </p>

      {/* 1. Kekuatan */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Kekuatan Naskah</span>
        </h3>
        <ul className="space-y-2">
          {strengths.map((str, i) => (
            <li
              key={i}
              className="text-xs sm:text-sm px-3.5 py-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 leading-relaxed"
            >
              {str}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Saran Perbaikan / Revisi */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-2.5">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>Saran Perbaikan / Catatan Revisi</span>
        </h3>
        <ul className="space-y-2">
          {revisi.map((rev, i) => (
            <li
              key={i}
              className="text-xs sm:text-sm px-3.5 py-2.5 bg-rose-50 text-rose-900 rounded-lg border border-rose-100 leading-relaxed"
            >
              {rev}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Keselarasan Antarbagian */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Link2 className="w-4 h-4 text-brand-600" />
            <span>Kesesuaian Antarunsur / Antarbagian</span>
          </h3>
          <Badge status={keselarasanStatus} />
        </div>
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
          {keselarasanNote}
        </p>
      </div>

      {/* 4. Efektivitas Bahasa */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Feather className="w-4 h-4 text-indigo-600" />
            <span>Efektivitas Penggunaan Bahasa (EYD &amp; Kalimat Efektif)</span>
          </h3>
          <Badge status={bahasaStatus} />
        </div>

        <ul className="space-y-2.5">
          {bahasaItems.map((item, idx) => (
            <li
              key={idx}
              className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${
                item.pass
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${
                  item.pass ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {item.pass ? '✓' : '✕'}
              </span>
              <div>
                <strong className="block font-semibold">{item.label}</strong>
                <p className="mt-0.5 text-xs text-ink/80 leading-relaxed">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>

        {metrics && metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200">
            {metrics.map((m, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-md text-ink-soft shadow-sm"
              >
                {m.label}: <strong className="text-ink font-semibold">{m.val}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
