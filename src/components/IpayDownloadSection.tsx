import React from 'react';
import contentData from '../data/contentData.json';
import { Download, Smartphone, QrCode, CheckCircle, ShieldCheck, Zap, ArrowRight, ExternalLink } from 'lucide-react';

interface IpayDownloadSectionProps {
  onBackToMenu: () => void;
}

export const IpayDownloadSection: React.FC<IpayDownloadSectionProps> = ({ onBackToMenu }) => {
  const { ipay } = contentData;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#004990] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          Ngân hàng số VietinBank iPay Mobile
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {ipay.title}
        </h1>
        <p className="text-sm text-slate-600">
          {ipay.headline}
        </p>
      </div>

      {/* Main Download Cards (iOS & Android) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-[#004990] transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50/50 rounded-bl-full pointer-events-none -mr-4 -mt-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {ipay.ios.platform}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {ipay.ios.storeName}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                {ipay.ios.badge}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Quét mã QR dưới đây bằng camera iPhone hoặc bấm nút để mở thẳng App Store:
            </p>

            {/* QR Code container */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
              <img
                src={ipay.ios.qrUrl}
                alt="QR Code Tải iPay iOS"
                className="w-44 h-44 object-contain rounded-lg shadow-2xs bg-white p-2"
                loading="lazy"
              />
              <span className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-slate-400" />
                Mở Camera iPhone để quét
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href={ipay.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải trên Apple App Store</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
            </a>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-[#004990] transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50/50 rounded-bl-full pointer-events-none -mr-4 -mt-4" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {ipay.android.platform}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {ipay.android.storeName}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {ipay.android.badge}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Quét mã QR dưới đây bằng camera điện thoại hoặc bấm nút mở Google Play:
            </p>

            {/* QR Code container */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
              <img
                src={ipay.android.qrUrl}
                alt="QR Code Tải iPay Android"
                className="w-44 h-44 object-contain rounded-lg shadow-2xs bg-white p-2"
                loading="lazy"
              />
              <span className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-slate-400" />
                Quét bằng Zalo / Camera Android
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href={ipay.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#004990] hover:bg-[#003870] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải trên Google Play Store</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
        <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#DA251C]" />
          <span>Tại sao Quý khách nên cài đặt VietinBank iPay ngay hôm nay?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ipay.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onBackToMenu}
          className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
        >
          Quay lại menu chính
        </button>
      </div>
    </div>
  );
};
