import React, { useEffect, useRef } from 'react';
import { ActiveTab } from '../types';
import contentData from '../data/contentData.json';
import gsap from 'gsap';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Gift, 
  PhoneCall, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Flame,
  Star
} from 'lucide-react';

interface HomeHubProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenConsultant: () => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({ onSelectTab, onOpenConsultant }) => {
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Subtle entrance animation using GSAP
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
    if (cardsContainerRef.current) {
      gsap.fromTo(
        cardsContainerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Kiosk Hero Welcome Banner */}
      <div 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-r from-[#004990] via-[#0054A6] to-[#003870] rounded-3xl p-6 sm:p-10 text-white shadow-lg"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#DA251C]" />
            <span>Kiosk Tự Phục Vụ Thông Minh – {contentData.brand.branchName || 'Chi nhánh Berlin'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Chào mừng Quý khách đến với <span className="text-amber-300">VietinBank {contentData.brand.branchName || 'Chi nhánh Berlin'}</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
            Trải nghiệm dịch vụ tiện ích số: giải đáp thao tác iPay, tính lãi tiền gửi, lập kế hoạch trả nợ vay, tra cứu điểm giao dịch hoặc thử sức mini game nhận voucher hấp dẫn trong lúc chờ đợi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('game')}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#DA251C] to-[#E31B23] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:opacity-95 active:scale-98 transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-amber-200" />
              <span>Chơi Game Nhận Voucher 2L Xăng</span>
            </button>
            <button
              onClick={onOpenConsultant}
              className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gặp Tư Vấn Viên Trần Hoàng Trung</span>
            </button>
          </div>
        </div>

        {/* Decorative background branding circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-[#DA251C]/10 pointer-events-none" />
      </div>

      {/* Grid of the 7 Interactive Modules */}
      <div 
        ref={cardsContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* 1. Giải đáp thắc mắc khách hàng */}
        <div 
          onClick={() => onSelectTab('faq')}
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-[#004990] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#004990] flex items-center justify-center group-hover:bg-[#004990] group-hover:text-white transition-colors">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                Tính năng 01
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004990] transition-colors mb-1.5">
                Giải đáp thắc mắc
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hướng dẫn chi tiết từng bước có hình ảnh: Quên mật khẩu iPay, đóng thẻ, xác thực CCCD gắn chip và sinh trắc học khuôn mặt.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004990]">
            <span>Xem hướng dẫn từng bước</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Tải App VietinBank iPay */}
        <div 
          onClick={() => onSelectTab('ipay')}
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-[#004990] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Tính năng 02
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                Tải App VietinBank iPay
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quét mã QR tải ngay ứng dụng cho iPhone (iOS) và Android. Ngân hàng số miễn phí chuyển khoản, mở tài khoản số đẹp trong 3 phút.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Quét mã QR tải App</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. Thử thách Game: Flappy Voucher */}
        <div 
          onClick={() => onSelectTab('game')}
          className="group bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-white rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-xs hover:border-[#DA251C] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#DA251C] text-white flex items-center justify-center shadow-xs">
                <Gamepad2 className="w-6 h-6 text-amber-200" />
              </div>
              <span className="text-[11px] font-bold text-[#DA251C] bg-red-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Voucher 2L xăng
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#DA251C] transition-colors mb-1.5">
                Thử thách Game mini
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Chờ vui – Chơi hay – Nhận quà liền tay": Vượt qua 20 chướng ngại vật để nhận ngay mã quà tặng voucher xăng tại quầy!
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-[#DA251C]">
            <span>Chơi ngay & nhận quà</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 4. Tính lãi tiền gửi */}
        <div 
          onClick={() => onSelectTab('savings')}
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-[#004990] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-[#004990] group-hover:text-white transition-colors">
                <PiggyBank className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                Tính năng 04
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004990] transition-colors mb-1.5">
                Tính lãi tiền gửi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Công cụ tính tiền lãi dự tính sản phẩm gửi tiết kiệm thông thường trả lãi sau theo chuẩn biểu lãi suất VietinBank.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004990]">
            <span>Tính lãi suất ngay</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 5. Lịch trả nợ khoản vay */}
        <div 
          onClick={() => onSelectTab('loan')}
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-[#004990] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#004990] flex items-center justify-center group-hover:bg-[#004990] group-hover:text-white transition-colors">
                <Calculator className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                Tính năng 05
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004990] transition-colors mb-1.5">
                Lịch trả nợ khoản vay
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Phương thức trả gốc đều, lãi tính trên dư nợ giảm dần. Lập bảng tính chi tiết từng kỳ trả nợ với ngày và số tiền thanh toán.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004990]">
            <span>Xem lịch trả nợ chi tiết</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 6. SẢN PHẨM DỊCH VỤ NỔI BẬT (Specially Highlighted Card as required in PDF 5) */}
        <div 
          onClick={() => onSelectTab('products')}
          className="group relative bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 rounded-3xl p-6 sm:p-7 border-2 border-[#DA251C]/40 shadow-sm hover:border-[#DA251C] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#004990] to-[#0066B3] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              {/* Highlight badge + star icon as specified */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full text-[11px] font-extrabold shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>NỔI BẬT</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004990] transition-colors mb-1.5">
                Sản phẩm dịch vụ nổi bật
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khám phá các sản phẩm, ưu đãi và tiện ích VietinBank đang được giới thiệu tại chi nhánh: mở tài khoản hộ kinh doanh, rút tiền POS không tiếp xúc, thu hộ KHDN và đấu giá tài sản bảo đảm.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-red-100 flex items-center justify-between">
            <button className="px-4 py-2 bg-gradient-to-r from-[#DA251C] to-[#E31B23] text-white text-xs font-bold rounded-xl shadow-xs group-hover:opacity-95 transition-all">
              Xem ngay
            </button>
            <span className="text-xs font-bold text-[#004990] flex items-center gap-1">
              Khám phá poster <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* 7. Điểm giao dịch */}
        <div 
          onClick={() => onSelectTab('branches')}
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-[#004990] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-[#004990] group-hover:text-white transition-colors shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004990] transition-colors">
                    Mạng lưới Điểm giao dịch & Chi nhánh
                  </h3>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    155 Chi nhánh
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  Tra cứu nhanh thông tin, số điện thoại hotline có thể gọi trực tiếp và nhúng link Google Maps mở chỉ đường tới Chi nhánh Bắc Ninh (8 phòng giao dịch), Bắc Đà Nẵng, Hội An, TP.HCM, Bình Dương...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="px-5 py-2.5 bg-[#004990] group-hover:bg-[#003870] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <span>Tra cứu mạng lưới</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
