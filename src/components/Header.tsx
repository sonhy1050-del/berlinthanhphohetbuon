import React from 'react';
import { ActiveTab } from '../types';
import contentData from '../data/contentData.json';
import { Phone, Home, Sparkles, HelpCircle, Smartphone, Gamepad2, PiggyBank, Calculator, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenConsultant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenConsultant,
}) => {
  const { brand } = contentData;

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Trang chủ', icon: Home },
    { id: 'faq' as ActiveTab, label: 'Giải đáp', icon: HelpCircle },
    { id: 'ipay' as ActiveTab, label: 'Tải iPay', icon: Smartphone },
    { id: 'game' as ActiveTab, label: 'Mini Game', icon: Gamepad2 },
    { id: 'savings' as ActiveTab, label: 'Tính lãi gửi', icon: PiggyBank },
    { id: 'loan' as ActiveTab, label: 'Lịch trả nợ', icon: Calculator },
    { id: 'products' as ActiveTab, label: 'SP Nổi bật', icon: Sparkles },
    { id: 'branches' as ActiveTab, label: 'Điểm GD', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Logo & Brand */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          role="button"
          tabIndex={0}
        >
          <img
            src={brand.logoUrl}
            alt="Logo VietinBank"
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
            onError={(e) => {
              // Graceful fallback if image network fails
              const target = e.target as HTMLElement;
              target.style.display = 'none';
            }}
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#004990]">
              VietinBank
            </span>
            <span className="text-[11px] font-bold text-[#DA251C] uppercase tracking-wider">
              {brand.branchName || 'Chi nhánh Berlin'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single line, whitespace-nowrap) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#004990] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#004990] hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action / Hotline */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenConsultant}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#DA251C] to-[#E31B23] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all whitespace-nowrap"
            title="Liên hệ Chuyên viên tư vấn Trần Hoàng Trung"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Tư vấn viên:</span>
            <span>0973.874.232</span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal quick-tab bar */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-100 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#004990] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
