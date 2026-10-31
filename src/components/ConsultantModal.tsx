import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, PhoneCall, X, UserCheck, ShieldCheck, Clock, MessageSquare } from 'lucide-react';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantModal: React.FC<ConsultantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { consultant, hotline } = contentData.brand;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#004990] flex items-center justify-center mx-auto shadow-2xs">
            <UserCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#DA251C] bg-red-50 px-2.5 py-0.5 rounded-full">
              Hỗ trợ trực tiếp tại quầy
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              {consultant.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {consultant.title} - Ngân hàng VietinBank
            </p>
          </div>

          {/* Direct Phone Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-600 block mb-1">Số điện thoại liên hệ trực tiếp:</span>
            <div className="text-2xl font-black font-mono text-[#004990] tracking-wider mb-3">
              {consultant.phone}
            </div>
            <a
              href={`tel:${consultant.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#004990] hover:bg-[#003870] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gọi ngay Chuyên viên tư vấn</span>
            </a>
          </div>

          {/* VietinBank 24/7 Hotline Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tổng đài CSKH VietinBank 24/7:</span>
            </div>
            <a href="tel:1900558868" className="font-bold text-[#DA251C] hover:underline">
              {hotline}
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
