import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { BranchOffice } from '../types';
import { 
  MapPin, 
  Phone, 
  ExternalLink, 
  Clock, 
  Building2, 
  Navigation, 
  ArrowLeft,
  Search,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface BranchLocatorSectionProps {
  onBackToMenu: () => void;
}

export const BranchLocatorSection: React.FC<BranchLocatorSectionProps> = ({ onBackToMenu }) => {
  const { branches } = contentData;
  const [selectedRegionId, setSelectedRegionId] = useState<string>('bac-ninh');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Selected region offices
  const offices: BranchOffice[] = (branches.branchOffices as Record<string, BranchOffice[]>)[selectedRegionId] || [];

  // Filter by search
  const filteredOffices = offices.filter((office) => {
    const text = `${office.name} ${office.address} ${office.hotline}`.toLowerCase();
    return text.includes(searchKeyword.toLowerCase());
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#004990] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          Mạng lưới 155 Chi nhánh VietinBank
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {branches.title}
        </h1>
        <p className="text-sm text-slate-600">
          {branches.description}
        </p>
      </div>

      {/* Operating Hours Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#004990] text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#004990]">
              Thời gian giao dịch tại quầy
            </h4>
            <div className="text-xs text-slate-700 mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>
                <strong className="text-slate-900">{branches.operatingHours.weekdays.title}:</strong> {branches.operatingHours.weekdays.morning} | {branches.operatingHours.weekdays.afternoon}
              </span>
              <span className="text-red-600 font-medium">
                {branches.operatingHours.weekend.title}: {branches.operatingHours.weekend.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Region Selector Tabs & Search Input */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {branches.regions.map((reg) => {
              const isActive = selectedRegionId === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegionId(reg.id);
                    setSearchKeyword('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#004990] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {reg.name}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên PGD, đường..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990]"
            />
          </div>
        </div>
      </div>

      {/* Offices List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffices.map((office, idx) => (
          <div
            key={office.id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:border-[#004990] hover:shadow-md transition-all flex flex-col justify-between ${
              office.isHeadquarters ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
            }`}
          >
            {/* Office Image (with fallback) */}
            <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
              <img
                src={office.imageUrl}
                alt={office.name}
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  // Elegant branded fallback container
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-[#004990] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Điểm 0{idx + 1}
                </span>
                {office.isHeadquarters && (
                  <span className="bg-[#DA251C] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    Trụ sở Chi nhánh
                  </span>
                )}
              </div>
            </div>

            {/* Office Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {office.name}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#DA251C] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </div>

                {/* Hotline */}
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold pt-1">
                  <Phone className="w-4 h-4 text-[#004990] shrink-0" />
                  <span>Hotline PGD: </span>
                  <a
                    href={`tel:${office.hotline}`}
                    className="text-[#004990] font-mono hover:underline font-bold"
                  >
                    {office.hotline}
                  </a>
                </div>
              </div>

              {/* Action Buttons: Direct Call & Google Maps Navigation */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${office.hotline}`}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  title="Bấm gọi ngay số điện thoại"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gọi ngay</span>
                </a>

                <a
                  href={office.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#004990] hover:bg-[#003870] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Mở chỉ đường trên Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Chỉ đường Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-base mb-1">Không tìm thấy điểm giao dịch</h4>
          <p className="text-xs text-slate-500">Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn khu vực khác.</p>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại menu chính
        </button>
      </div>
    </div>
  );
};
