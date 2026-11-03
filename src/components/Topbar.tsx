import React from 'react';
import { Menu, Bell, Calendar } from 'lucide-react';
import { ActiveTab } from '../types';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, onNavigate }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-md border-b border-surface-border px-5 py-3.5 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand indicator for mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <span className="font-bold text-sm text-[#1D4FB0]">Lentera KTI</span>
          <span className="text-[11px] text-ink-soft bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            MAN 1 Nganjuk
          </span>
        </div>

        {/* Academic year badge on desktop */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>TA 2026/2027 · Gaya Sitasi APA Edisi Ke-7</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <div className="relative cursor-pointer p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 transition-colors" title="Pedoman KTI Aktif">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#2A5FD9] to-[#1D4FB0] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm ring-2 ring-brand-100">
            M
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold text-ink leading-tight">
              Mustagfiroh
            </span>
            <span className="text-[11px] text-ink-soft leading-none mt-0.5">
              Pemilik Aplikasi · MAN 1 Nganjuk
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
