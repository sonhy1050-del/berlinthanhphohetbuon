import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { FaqTopic } from '../types';
import { 
  KeyRound, 
  CreditCard, 
  ScanFace, 
  Fingerprint, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  PhoneCall, 
  Play,
  RotateCcw,
  LogOut
} from 'lucide-react';

interface FaqSectionProps {
  onBackToMenu: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToMenu }) => {
  const { faq, brand } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'satisfied' | 'unsatisfied' | 'ended'>('idle');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const selectedTopic: FaqTopic | undefined = faq.topics.find(
    (t) => t.id === selectedTopicId
  );

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound':
        return <KeyRound className="w-6 h-6 text-[#004990]" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-[#004990]" />;
      case 'ScanFace':
        return <ScanFace className="w-6 h-6 text-[#004990]" />;
      case 'Fingerprint':
        return <Fingerprint className="w-6 h-6 text-[#004990]" />;
      default:
        return <HelpCircle className="w-6 h-6 text-[#004990]" />;
    }
  };

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setActiveStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleResetToTopicMenu = () => {
    setSelectedTopicId(null);
    setFeedbackStatus('idle');
    setActiveStepIndex(0);
  };

  const handleFeedback = (isSatisfied: boolean) => {
    if (isSatisfied) {
      setFeedbackStatus('satisfied');
      // After brief acknowledgment, return to topic menu as requested in PDF
      setTimeout(() => {
        handleResetToTopicMenu();
      }, 1200);
    } else {
      setFeedbackStatus('unsatisfied');
    }
  };

  const handleEndConversation = () => {
    setFeedbackStatus('ended');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Conversation Finished Modal */}
      {feedbackStatus === 'ended' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              VietinBank Xin Cảm Ơn
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {brand.feedbackMessages.conversationEnd}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setFeedbackStatus('idle');
                  onBackToMenu();
                }}
                className="px-6 py-2.5 bg-[#004990] text-white font-medium text-sm rounded-xl hover:bg-[#003870] transition-colors"
              >
                Về Trang Chủ Kiosk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Topic Selection Screen */}
      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#004990] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              Hỗ trợ trực tuyến tại quầy
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {faq.question}
            </h1>
            <p className="text-sm text-slate-600">
              {faq.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
            {faq.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#004990] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-[#004990] group-hover:text-white transition-colors flex items-center justify-center">
                      {getTopicIcon(topic.icon)}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-[#004990]">
                      Mục 0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#004990] transition-colors mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    Bao gồm {topic.steps.length} bước hướng dẫn trực quan có ảnh chụp màn hình và video minh họa chi tiết.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#004990]">
                  <span>Xem hướng dẫn chi tiết</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-center">
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại màn hình chính Kiosk
            </button>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step Guide Screen */
        <div className="space-y-6">
          {/* Top navigation within topic */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <button
              onClick={handleResetToTopicMenu}
              className="flex items-center gap-2 text-sm font-semibold text-[#004990] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Chọn câu hỏi khác
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Đang xem:</span>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                {selectedTopic.title}
              </span>
            </div>
          </div>

          {/* Guide Header */}
          <div className="bg-gradient-to-r from-[#004990] to-[#0066B3] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Quy trình hướng dẫn chuẩn VietinBank
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                {selectedTopic.title}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Thực hiện theo {selectedTopic.steps.length} bước dưới đây.
              </p>
            </div>
            
            {/* YouTube Video Link Button */}
            {selectedTopic.videoUrl && (
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all whitespace-nowrap self-start md:self-auto"
                title="Mở video YouTube"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Xem video hướng dẫn (YouTube)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            )}
          </div>

          {/* Step Thumbnails / Quick Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {selectedTopic.steps.map((st, idx) => (
              <button
                key={st.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  activeStepIndex === idx
                    ? 'bg-[#004990] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Bước {st.step}
              </button>
            ))}
          </div>

          {/* Steps Display List */}
          <div className="space-y-6">
            {selectedTopic.steps.map((step, idx) => (
              <div
                key={step.step}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                  activeStepIndex === idx
                    ? 'border-[#004990] shadow-sm ring-1 ring-[#004990]/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#004990] text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                        {step.text}
                      </p>
                    </div>

                    {/* Step Image illustration */}
                    {step.image && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 max-w-md">
                        <img
                          src={step.image}
                          alt={`Minh họa bước ${step.step}`}
                          className="w-full h-auto max-h-80 object-contain mx-auto block hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback container if image fails to load
                            const target = e.target as HTMLElement;
                            target.parentElement!.innerHTML = `
                              <div class="p-6 text-center text-slate-500 text-xs">
                                <span class="font-semibold block mb-1">Hình ảnh minh họa Bước ${step.step}</span>
                                <span>(Đang cập nhật kết nối ảnh thực tế)</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* End of Guide YouTube Link Section */}
          {selectedTopic.videoUrl && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-red-900">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h5 className="font-bold text-sm">Vẫn chưa rõ thao tác?</h5>
                  <p className="text-xs text-red-700">
                    Bấm để chuyển tới ứng dụng YouTube xem trọn bộ video trực quan từng thao tác.
                  </p>
                </div>
              </div>
              <a
                href={selectedTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
              >
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Feedback & Actions Box */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                {brand.feedbackMessages.prompt}
              </h4>
              <p className="text-xs text-slate-500">
                Phản hồi của Quý khách giúp VietinBank nâng cao chất lượng phục vụ
              </p>
            </div>

            {feedbackStatus === 'satisfied' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Tuyệt vời! Đang quay lại danh sách câu hỏi...</span>
              </div>
            )}

            {feedbackStatus === 'unsatisfied' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm leading-relaxed space-y-3 animate-in fade-in">
                <p className="font-medium">
                  {brand.feedbackMessages.unsatisfied}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:0973874232"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004990] text-white text-xs font-bold rounded-lg hover:bg-[#003870] transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Gọi ngay: 0973.874.232
                  </a>
                </div>
              </div>
            )}

            {/* Decision Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleFeedback(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã ổn (Quay lại menu chính)
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-xs active:scale-98 transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                Chưa ổn (Cần hỗ trợ trực tiếp)
              </button>
            </div>

            {/* Bottom standard navigation buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetToTopicMenu}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Quay lại menu chính
              </button>
              <button
                onClick={handleEndConversation}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
