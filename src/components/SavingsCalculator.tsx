import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { SavingsTerm } from '../types';
import { 
  PiggyBank, 
  Coins, 
  Calendar, 
  Percent, 
  AlertCircle, 
  ArrowLeft, 
  Play, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface SavingsCalculatorProps {
  onBackToMenu: () => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onBackToMenu }) => {
  const { savings } = contentData;

  // Form states
  const [amountStr, setAmountStr] = useState<string>('100000000');
  const [selectedTermMonth, setSelectedTermMonth] = useState<number>(savings.defaultTerm);
  const [customRate, setCustomRate] = useState<string>('5.0');
  const [errors, setErrors] = useState<{ amount?: string; term?: string; rate?: string }>({});

  // Format currency helpers
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const parseNumber = (str: string): number => {
    const clean = str.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  // When term changes, auto-fill standard VietinBank interest rate
  const handleTermChange = (month: number) => {
    setSelectedTermMonth(month);
    const matched = savings.terms.find((t: SavingsTerm) => t.month === month);
    if (matched) {
      setCustomRate(matched.rate.toString());
    }
  };

  // Quick preset amount buttons
  const quickAmounts = [
    { label: '50 triệu', value: 50000000 },
    { label: '100 triệu', value: 100000000 },
    { label: '200 triệu', value: 200000000 },
    { label: '500 triệu', value: 50000000 },
    { label: '1 tỷ', value: 1000000000 },
  ];

  // Calculation logic: Tiền gửi thông thường trả lãi sau
  // Công thức: Tiền lãi = (Số tiền gửi × Lãi suất (%/năm) × Số ngày thực tế gửi) / 365
  // Hoặc tính theo tháng: Số tiền gửi × (Lãi suất / 100) × (Số tháng / 12)
  const calculation = useMemo(() => {
    const principal = parseNumber(amountStr);
    const rateNum = parseFloat(customRate);

    const currentErrors: { amount?: string; term?: string; rate?: string } = {};
    if (!principal || principal < savings.minAmount) {
      currentErrors.amount = savings.validationRules.amount.error;
    }
    if (!selectedTermMonth) {
      currentErrors.term = savings.validationRules.term.error;
    }
    if (isNaN(rateNum) || rateNum < 0 || rateNum > savings.validationRules.interestRate.max) {
      currentErrors.rate = savings.validationRules.interestRate.error;
    }

    const hasErrors = Object.keys(currentErrors).length > 0;
    const interest = hasErrors
      ? 0
      : Math.round(principal * (rateNum / 100) * (selectedTermMonth / 12));
    const total = principal + interest;

    return {
      isValid: !hasErrors,
      principal,
      interest,
      total,
      rate: rateNum,
      errors: currentErrors,
    };
  }, [amountStr, selectedTermMonth, customRate, savings]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#004990] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          Tiết kiệm sinh lời an toàn cùng VietinBank
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {savings.title}
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          {savings.productName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Input Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Coins className="w-5 h-5 text-[#004990]" />
            <h3 className="font-bold text-base text-slate-900">
              Thông tin tiền gửi dự tính
            </h3>
          </div>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                Tổng tiền gửi (VND) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold text-[#004990]">
                {parseNumber(amountStr) > 0 && formatVND(parseNumber(amountStr))}
              </span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={amountStr ? new Intl.NumberFormat('vi-VN').format(parseNumber(amountStr)) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setAmountStr(raw);
                }}
                placeholder="Nhập số tiền gửi (ví dụ: 100.000.000)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white transition-all font-mono"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {calculation.errors.amount && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{calculation.errors.amount}</span>
              </div>
            )}

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
              {quickAmounts.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setAmountStr(q.value.toString())}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>Kỳ hạn gửi <span className="text-red-500">*</span></span>
              <span className="text-xs font-normal text-slate-500">Trả lãi cuối kỳ</span>
            </label>

            <select
              value={selectedTermMonth}
              onChange={(e) => handleTermChange(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white transition-all"
            >
              {savings.terms.map((term: SavingsTerm) => (
                <option key={term.month} value={term.month}>
                  {term.label}
                </option>
              ))}
            </select>

            {calculation.errors.term && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{calculation.errors.term}</span>
              </div>
            )}
          </div>

          {/* Input 3: Lãi suất */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                (Có thể tùy chỉnh theo gói ưu đãi)
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="15"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white transition-all font-mono"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>

            {calculation.errors.rate && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{calculation.errors.rate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Calculation Results & Video Tutorial */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-[#004990] via-[#0054A6] to-[#003870] rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Kết Quả Dự Tính
              </span>
              <Receipt className="w-5 h-5 text-blue-200" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-blue-100 font-medium block mb-1">
                  Tiền lãi dự tính nhận được:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                  {formatVND(calculation.interest)}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-xs text-blue-100 font-medium block mb-1">
                  Tổng tiền khi đáo hạn (Gốc + Lãi):
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight">
                  {formatVND(calculation.total)}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 text-xs space-y-2 border border-white/10">
              <div className="flex justify-between text-blue-100">
                <span>Số tiền gửi gốc:</span>
                <span className="font-semibold text-white">{formatVND(parseNumber(amountStr))}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Kỳ hạn gửi:</span>
                <span className="font-semibold text-white">{selectedTermMonth} tháng</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Lãi suất cam kết:</span>
                <span className="font-semibold text-amber-300">{customRate}%/năm</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Hình thức nhận lãi:</span>
                <span className="font-semibold text-white">Cuối kỳ</span>
              </div>
            </div>

            <p className="text-[11px] text-blue-200 leading-tight">
              * Kết quả tính mang tính chất tham khảo tại thời điểm hiện tại. Lãi suất thực tế được áp dụng chính xác theo biểu lãi suất VietinBank niêm yết tại ngày gửi.
            </p>
          </div>

          {/* TikTok / Video Tutorial Button */}
          {savings.guideVideoUrl && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Video hướng dẫn gửi tiết kiệm
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Xem clip bí quyết chọn kỳ hạn tối ưu lãi suất
                  </p>
                </div>
              </div>

              <a
                href={savings.guideVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                <span>Xem video hướng dẫn gửi tiết kiệm</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
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
