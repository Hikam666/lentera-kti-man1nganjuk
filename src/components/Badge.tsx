import React from 'react';
import { Check, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = HelpCircle;

  if (
    status === 'Baik' ||
    status === 'Sangat Baik' ||
    status === 'Sangat Efektif' ||
    status === 'Efektif'
  ) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = Check;
  } else if (status === 'Cukup') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = AlertTriangle;
  } else if (
    status === 'Perlu Diperbaiki' ||
    status === 'Perlu Ditingkatkan' ||
    status === 'Belum Ada Insersi KBC'
  ) {
    style = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = AlertCircle;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>{status}</span>
    </span>
  );
};
