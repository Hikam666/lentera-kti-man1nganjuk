import React from 'react';
import {
  Home,
  FileText,
  Compass,
  Search,
  ClipboardCheck,
  Heart,
  GraduationCap,
  ExternalLink,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: Home },
    { id: 'analisis' as ActiveTab, label: 'Analisis Teks', icon: FileText },
    { id: 'simulator' as ActiveTab, label: 'Simulator Riset', icon: Compass },
    {
      id: 'ai-detector',
      label: 'Cek AI Detector',
      icon: Search,
      isExternal: true,
      href: 'https://scispace.com/ai-detector'
    },
    {
      id: 'duplichecker',
      label: 'Cek Plagiasi',
      icon: ClipboardCheck,
      isExternal: true,
      href: 'https://www.duplichecker.com/id'
    },
    { id: 'kbc' as ActiveTab, label: 'Review KBC', icon: Heart },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    onTabChange(tabId);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0F2657] via-[#1D4FB0] to-[#2E7BE0] text-white flex flex-col p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1.5">
                <span>Lentera</span>
                <span className="px-1.5 py-0.5 rounded bg-white text-[#1D4FB0] text-xs font-black shadow-sm">
                  KTI
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-medium leading-none mt-1">
                MAN 1 Nganjuk
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-white/85 text-xs sm:text-sm font-medium hover:bg-white/15 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-white/70 group-hover:text-white" />
                    <span>{item.label}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              );
            }

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#1D4FB0] shadow-md shadow-black/10'
                    : 'text-white/85 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#1D4FB0]' : 'text-white/70'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Owner badge footer */}
        <div className="pt-4 border-t border-white/20 mt-auto">
          <div className="p-3 rounded-xl bg-black/15 text-xs text-white/90 leading-relaxed backdrop-blur-xs">
            <span className="text-[11px] uppercase tracking-wider text-white/60 block font-bold mb-0.5">
              Pemilik Aplikasi:
            </span>
            <strong className="text-sm font-bold text-white block">
              Mustagfiroh
            </strong>
            <span className="text-xs text-white/80">Guru Bahasa Indonesia</span>
            <div className="mt-1 text-[11px] text-white/70">MAN 1 Nganjuk</div>
          </div>
        </div>
      </aside>
    </>
  );
};
