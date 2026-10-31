/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from './types';
import contentData from './data/contentData.json';
import { Header } from './components/Header';
import { HomeHub } from './components/HomeHub';
import { FaqSection } from './components/FaqSection';
import { IpayDownloadSection } from './components/IpayDownloadSection';
import { FlappyVoucherGame } from './components/FlappyVoucherGame';
import { SavingsCalculator } from './components/SavingsCalculator';
import { LoanScheduleCalculator } from './components/LoanScheduleCalculator';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchLocatorSection } from './components/BranchLocatorSection';
import { ConsultantModal } from './components/ConsultantModal';
import { Phone, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState<boolean>(false);

  const handleBackToMenu = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#004990] selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenConsultant={() => setIsConsultantModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'home' && (
          <HomeHub
            onSelectTab={handleSelectTab}
            onOpenConsultant={() => setIsConsultantModalOpen(true)}
          />
        )}

        {activeTab === 'faq' && (
          <FaqSection onBackToMenu={handleBackToMenu} />
        )}

        {activeTab === 'ipay' && (
          <IpayDownloadSection onBackToMenu={handleBackToMenu} />
        )}

        {activeTab === 'game' && (
          <FlappyVoucherGame onBackToMenu={handleBackToMenu} />
        )}

        {activeTab === 'savings' && (
          <SavingsCalculator onBackToMenu={handleBackToMenu} />
        )}

        {activeTab === 'loan' && (
          <LoanScheduleCalculator onBackToMenu={handleBackToMenu} />
        )}

        {activeTab === 'products' && (
          <FeaturedProductsSection onBackToMenu={handleBackToMenu} />
        )}

        {activeTab === 'branches' && (
          <BranchLocatorSection onBackToMenu={handleBackToMenu} />
        )}
      </main>

      {/* Direct Consultant Modal */}
      <ConsultantModal
        isOpen={isConsultantModalOpen}
        onClose={() => setIsConsultantModalOpen(false)}
      />

      {/* Bottom Footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img
              src={contentData.brand.logoUrl}
              alt="VietinBank"
              className="h-6 w-auto object-contain opacity-80"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
            <span>
              © {new Date().getFullYear()} {contentData.brand.fullName}.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="font-semibold text-[#004990]">
              Hotline: 1900 558 868
            </span>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setIsConsultantModalOpen(true)}
              className="font-medium text-slate-700 hover:text-[#004990] transition-colors"
            >
              Chuyên viên tư vấn: Trần Hoàng Trung (0973.874.232)
            </button>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 italic">
              {contentData.brand.slogan}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
