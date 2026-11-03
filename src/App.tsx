import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './features/dashboard/DashboardView';
import { AnalisisView } from './features/analisis/AnalisisView';
import { SimulatorView } from './features/simulator/SimulatorView';
import { SimilaritasView } from './features/similaritas/SimilaritasView';
import { KbcView } from './features/kbc/KbcView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex bg-surface-bg text-ink">
      {/* Sidebar (Desktop sticky, Mobile drawer) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleNavigate}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {activeTab === 'analisis' && <AnalisisView />}
          {activeTab === 'simulator' && <SimulatorView />}
          {activeTab === 'similaritas' && <SimilaritasView />}
          {activeTab === 'kbc' && <KbcView />}
        </main>

        {/* Global Footer */}
        <footer className="py-6 px-4 border-t border-surface-border text-center text-xs text-ink-soft bg-white/50 backdrop-blur-xs">
          <p>
            Media Inovasi Pembelajaran Bahasa Indonesia · Materi Karya Tulis Ilmiah (KTI) Kelas XI —{' '}
            <strong className="text-ink">MAN 1 Nganjuk</strong>.
          </p>
          <p className="mt-1">
            Disusun mengacu pada Pedoman Penulisan KTI (Paper) TA 2026/2027 &amp; Gaya Sitasi APA Edisi Ke-7.
          </p>
          <p className="mt-1 font-semibold text-brand-700">
            Pemilik: Mustagfiroh, MAN 1 Nganjuk.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
