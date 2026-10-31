import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { LoanScheduleRow } from '../types';
import { 
  Calculator, 
  ArrowLeft, 
  Table, 
  X, 
  Download, 
  Info, 
  CheckCircle2, 
  Calendar,
  Layers,
  Building,
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface LoanScheduleCalculatorProps {
  onBackToMenu: () => void;
}

export const LoanScheduleCalculator: React.FC<LoanScheduleCalculatorProps> = ({ onBackToMenu }) => {
  const { loan } = contentData;

  // Form input states (No range sliders, direct numeric input as strictly requested)
  const [collateralStr, setCollateralStr] = useState<string>('2000000000');
  const [loanAmountStr, setLoanAmountStr] = useState<string>('1000000000');
  const [durationMonths, setDurationMonths] = useState<number>(36);
  const [interestRateYearStr, setInterestRateYearStr] = useState<string>('8.5');
  const [cycleId, setCycleId] = useState<string>('monthly'); // monthly, quarterly, semiannual, yearly
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-10-31');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundingUnit, setRoundingUnit] = useState<number>(1000); // 1 or 1000

  // Modal view for detailed amortization schedule
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Helper parsers
  const parseNumber = (str: string): number => {
    const clean = str.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  // Determine cycle parameters
  const currentCycle = loan.cycles.find((c) => c.id === cycleId) || loan.cycles[0];

  // Calculate schedule rows
  const scheduleData = useMemo(() => {
    const principal = parseNumber(loanAmountStr);
    const annualRate = parseFloat(interestRateYearStr) || 0;
    const months = durationMonths || 12;

    if (!principal || principal <= 0 || !months || months <= 0) {
      return {
        rows: [],
        firstPayment: 0,
        lastPayment: 0,
        totalPrincipal: 0,
        totalInterest: 0,
        totalPayment: 0,
        numberOfPeriods: 0,
      };
    }

    // Determine total periods
    let monthsPerPeriod = 1;
    if (cycleId === 'quarterly') monthsPerPeriod = 3;
    else if (cycleId === 'semiannual') monthsPerPeriod = 6;
    else if (cycleId === 'yearly') monthsPerPeriod = 12;

    const totalPeriods = Math.max(1, Math.ceil(months / monthsPerPeriod));
    const periodicRate = (annualRate / 100) / currentCycle.divisor;

    // Base principal per period
    let basePeriodPrincipal = Math.floor(principal / totalPeriods);
    if (roundingUnit === 1000) {
      basePeriodPrincipal = Math.floor(basePeriodPrincipal / 1000) * 1000;
    }

    const rows: LoanScheduleRow[] = [];
    let currentBalance = principal;
    let accumulatedPrincipal = 0;
    let totalInterest = 0;

    // Parse disbursement date
    const [startYear, startMonth, startDay] = disbursementDate.split('-').map(Number);
    let schedDate = new Date(startYear, startMonth - 1, startDay);

    for (let i = 1; i <= totalPeriods; i++) {
      // Calculate next payment date
      schedDate = new Date(schedDate.getFullYear(), schedDate.getMonth() + monthsPerPeriod, paymentDay);
      const formattedDate = `${String(schedDate.getDate()).padStart(2, '0')}/${String(schedDate.getMonth() + 1).padStart(2, '0')}/${schedDate.getFullYear()}`;

      // Calculate principal for this period (adjusting last period to absorb any rounding residue)
      let pPay = basePeriodPrincipal;
      if (i === totalPeriods) {
        pPay = principal - accumulatedPrincipal;
      }

      // Interest for current period = Dư nợ đầu kỳ * periodicRate
      let iPay = currentBalance * periodicRate;
      if (roundingUnit === 1000) {
        iPay = Math.round(iPay / 1000) * 1000;
      } else {
        iPay = Math.round(iPay);
      }

      const totalP = pPay + iPay;
      const endBal = Math.max(0, currentBalance - pPay);

      rows.push({
        period: i,
        paymentDate: formattedDate,
        startBalance: currentBalance,
        principal: pPay,
        interest: iPay,
        totalPayment: totalP,
        endBalance: endBal,
      });

      accumulatedPrincipal += pPay;
      totalInterest += iPay;
      currentBalance = endBal;
    }

    return {
      rows,
      firstPayment: rows[0]?.totalPayment || 0,
      lastPayment: rows[rows.length - 1]?.totalPayment || 0,
      totalPrincipal: principal,
      totalInterest,
      totalPayment: principal + totalInterest,
      numberOfPeriods: totalPeriods,
    };
  }, [loanAmountStr, durationMonths, interestRateYearStr, cycleId, disbursementDate, paymentDay, roundingUnit, currentCycle]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#004990] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          Nghiệp vụ tín dụng VietinBank
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {loan.title}
        </h1>
        <p className="text-sm text-slate-600">
          Phương thức: <span className="font-bold text-[#004990]">{loan.method}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step 1: Input Information (No sliders, strict numeric input) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#004990] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-slate-900">
              Bước 1: Nhập thông tin khoản vay
            </h3>
          </div>

          {/* Giá trị bất động sản */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <label>Giá trị tài sản bảo đảm (BĐS)</label>
              <span className="text-[#004990] font-mono">
                {parseNumber(collateralStr) > 0 && formatVND(parseNumber(collateralStr))}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={collateralStr ? formatNumber(parseNumber(collateralStr)) : ''}
                onChange={(e) => setCollateralStr(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Ví dụ: 2.000.000.000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white font-mono"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* Số tiền vay (dạng nhập số, không kéo thả) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <label>Số tiền vay <span className="text-red-500">*</span></label>
              <span className="text-[#004990] font-mono font-bold">
                {parseNumber(loanAmountStr) > 0 && formatVND(parseNumber(loanAmountStr))}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={loanAmountStr ? formatNumber(parseNumber(loanAmountStr)) : ''}
                onChange={(e) => setLoanAmountStr(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Ví dụ: 1.000.000.000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white font-mono"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Tỷ lệ vay/TSBĐ: {parseNumber(collateralStr) > 0 ? ((parseNumber(loanAmountStr) / parseNumber(collateralStr)) * 100).toFixed(1) : 0}%
            </span>
          </div>

          {/* Thời gian vay & Lãi suất */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="360"
                value={durationMonths}
                onChange={(e) => setDurationMonths(parseInt(e.target.value, 10) || 12)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white font-mono"
              />
              <span className="text-[11px] text-slate-400">
                Tương đương {(durationMonths / 12).toFixed(1)} năm
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Lãi suất theo năm (%/Năm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={interestRateYearStr}
                onChange={(e) => setInterestRateYearStr(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990] focus:bg-white font-mono"
              />
              <span className="text-[11px] text-slate-400">
                Lãi suất kỳ: {((parseFloat(interestRateYearStr) || 0) / currentCycle.divisor).toFixed(3)}%/{currentCycle.unit}
              </span>
            </div>
          </div>

          {/* Chu kỳ trả nợ & Ngày trả nợ định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Chu kỳ trả nợ
              </label>
              <select
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990]"
              >
                {loan.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Ngày trả nợ định kỳ
              </label>
              <select
                value={paymentDay}
                onChange={(e) => setPaymentDay(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990]"
              >
                {[5, 10, 15, 20, 25, 28].map((day) => (
                  <option key={day} value={day}>
                    Ngày {day} hàng tháng
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ngày giải ngân & Quy tắc làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Ngày giải ngân
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Quy tắc làm tròn số
              </label>
              <select
                value={roundingUnit}
                onChange={(e) => setRoundingUnit(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004990]"
              >
                <option value={1000}>Làm tròn đến 1.000 đồng</option>
                <option value={1}>Làm tròn đến đơn vị đồng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Step 2 Summary & Trigger Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#004990] via-[#0054A6] to-[#003870] rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Tóm Tắt Khoản Vay
              </span>
              <DollarSign className="w-5 h-5 text-amber-300" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-blue-200 block">Số tiền trả kỳ đầu (cao nhất):</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {formatVND(scheduleData.firstPayment)}
                </span>
              </div>

              <div>
                <span className="text-xs text-blue-200 block">Số tiền trả kỳ cuối (thấp nhất):</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
                  {formatVND(scheduleData.lastPayment)}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-blue-200 block">Tổng tiền gốc:</span>
                  <span className="font-bold text-white font-mono">{formatVND(scheduleData.totalPrincipal)}</span>
                </div>
                <div>
                  <span className="text-blue-200 block">Tổng tiền lãi:</span>
                  <span className="font-bold text-amber-300 font-mono">{formatVND(scheduleData.totalInterest)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-xs text-blue-200 block">Tổng số tiền phải trả (Gốc + Lãi):</span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {formatVND(scheduleData.totalPayment)}
                </span>
              </div>
            </div>

            {/* Step 2 Trigger: Button "Xem chi tiết" */}
            <div className="pt-2">
              <button
                onClick={() => setShowDetailModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-[#DA251C] to-[#E31B23] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Table className="w-4 h-4" />
                <span>Xem chi tiết bảng tính lịch trả nợ</span>
              </button>
            </div>
          </div>

          {/* Principle Note Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-[#004990]">
              <Info className="w-4 h-4" />
              <span>Đặc điểm phương thức dư nợ giảm dần:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Số tiền trả ban đầu cao, giảm dần đều qua từng kỳ.</li>
              <li>Tổng lãi phải trả thường thấp hơn so với phương thức trả góp đều.</li>
              <li>Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* STEP 2 MODAL: Bảng tính lịch trả nợ với dư nợ giảm dần */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-500">
                  Khoản vay: {formatVND(scheduleData.totalPrincipal)} | Thời hạn: {durationMonths} tháng | Lãi suất: {interestRateYearStr}%/năm
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                title="Đóng bảng chi tiết"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-x-auto flex-1 p-6 scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#004990] text-white">
                    <th className="py-3 px-3 rounded-l-lg text-center font-bold">Kỳ</th>
                    <th className="py-3 px-3 font-bold">Kỳ trả nợ</th>
                    <th className="py-3 px-3 text-right font-bold">Số gốc còn lại</th>
                    <th className="py-3 px-3 text-right font-bold">Gốc phải trả</th>
                    <th className="py-3 px-3 text-right font-bold">Lãi phải trả</th>
                    <th className="py-3 px-3 text-right rounded-r-lg font-bold">Tổng Gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {/* Period 0 row: Disbursement */}
                  <tr className="bg-slate-50/80 font-bold text-slate-700">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3">{disbursementDate.split('-').reverse().join('/')} (Giải ngân)</td>
                    <td className="py-2.5 px-3 text-right">{formatNumber(scheduleData.totalPrincipal)}</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {/* Amortization rows */}
                  {scheduleData.rows.map((row) => (
                    <tr key={row.period} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-500">{row.period}</td>
                      <td className="py-2 px-3 text-slate-800 font-medium">{row.paymentDate}</td>
                      <td className="py-2 px-3 text-right text-slate-700">{formatNumber(row.startBalance)}</td>
                      <td className="py-2 px-3 text-right text-slate-900 font-bold">{formatNumber(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-amber-700 font-medium">{formatNumber(row.interest)}</td>
                      <td className="py-2 px-3 text-right text-[#004990] font-bold">{formatNumber(row.totalPayment)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 font-mono">
                    <td className="py-3 px-3 text-center uppercase" colSpan={3}>
                      TỔNG CỘNG
                    </td>
                    <td className="py-3 px-3 text-right text-black font-extrabold">
                      {formatNumber(scheduleData.totalPrincipal)}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-800 font-extrabold">
                      {formatNumber(scheduleData.totalInterest)}
                    </td>
                    <td className="py-3 px-3 text-right text-[#DA251C] font-extrabold">
                      {formatNumber(scheduleData.totalPayment)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-3xl">
              <span className="text-xs text-slate-500">
                Lịch biểu bao gồm {scheduleData.numberOfPeriods} kỳ trả nợ theo chu kỳ {currentCycle.name.toLowerCase()}.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  In bảng tính
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2 bg-[#004990] text-white text-xs font-bold rounded-xl hover:bg-[#003870] transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
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
