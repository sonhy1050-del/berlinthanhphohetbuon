import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { ProductItem } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  PhoneCall, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  Layers, 
  Heart,
  Share2
} from 'lucide-react';

interface FeaturedProductsSectionProps {
  onBackToMenu: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ onBackToMenu }) => {
  const { products, brand } = contentData;

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [interestModalItem, setInterestModalItem] = useState<ProductItem | null>(null);

  // Filter items based on active category chip
  const filteredItems: ProductItem[] = products.items.filter((item) => {
    if (activeCategory === 'Tất cả') return true;
    return item.category === activeCategory;
  });

  const currentCarouselItem = filteredItems[carouselIndex] || filteredItems[0];

  const handleNextCarousel = () => {
    if (filteredItems.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCarousel = () => {
    if (filteredItems.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Interest Confirmation Modal */}
      {interestModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              {products.interestResponse.title}
            </h3>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#004990] block mb-1">
                Sản phẩm quan tâm:
              </span>
              <p className="font-bold text-sm text-slate-900">
                {interestModalItem.title}
              </p>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {products.interestResponse.message}
            </p>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold mb-6 flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{products.interestResponse.contactNote}</span>
            </div>

            <div className="flex gap-3 justify-center">
              <a
                href="tel:0973874232"
                className="flex-1 py-3 bg-[#004990] text-white font-bold text-sm rounded-xl hover:bg-[#003870] transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi tư vấn ngay</span>
              </a>
              <button
                onClick={() => setInterestModalItem(null)}
                className="px-5 py-3 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-50 to-blue-50 border border-red-200/50 rounded-full text-xs font-bold text-[#DA251C]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Danh mục khuyến mại & giải pháp tài chính</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {products.title}
        </h1>
        <p className="text-sm text-slate-600">
          {products.cardDescription}
        </p>
      </div>

      {/* Filter Chips & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
        {/* Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {products.categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCarouselIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#004990] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Toggle: Carousel vs Grid */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'carousel' ? 'bg-white text-[#004990] shadow-xs' : 'text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dạng Carousel</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'grid' ? 'bg-white text-[#004990] shadow-xs' : 'text-slate-500'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Dạng Lưới</span>
          </button>
        </div>
      </div>

      {/* CAROUSEL VIEW MODE */}
      {viewMode === 'carousel' && currentCarouselItem && (
        <div className="space-y-4">
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden max-w-2xl mx-auto flex flex-col">
            {/* Poster Image Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-100 overflow-hidden group">
              <img
                src={currentCarouselItem.posterUrl}
                alt={currentCarouselItem.title}
                className="w-full h-full object-contain p-4 group-hover:scale-102 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <span className="absolute top-4 left-4 bg-[#DA251C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                {currentCarouselItem.badge}
              </span>
            </div>

            {/* Poster Details & CTA */}
            <div className="p-6 sm:p-8 space-y-4 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#004990] uppercase tracking-wider block mb-1">
                  {currentCarouselItem.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {currentCarouselItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentCarouselItem.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setInterestModalItem(currentCarouselItem)}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-[#004990] to-[#0066B3] hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Tôi quan tâm</span>
                </button>
                <a
                  href="tel:0973874232"
                  className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-[#DA251C]" />
                  <span>0973.874.232</span>
                </a>
              </div>
            </div>

            {/* Carousel navigation overlay controls */}
            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={handlePrevCarousel}
                  className="absolute left-3 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md text-slate-700 hover:bg-white hover:text-[#004990] flex items-center justify-center transition-all"
                  title="Trước"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextCarousel}
                  className="absolute right-3 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md text-slate-700 hover:bg-white hover:text-[#004990] flex items-center justify-center transition-all"
                  title="Tiếp theo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {filteredItems.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {filteredItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    carouselIndex === idx ? 'w-8 bg-[#004990]' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#004990] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-[#DA251C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#004990] uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setInterestModalItem(item)}
                    className="flex-1 py-2.5 px-4 bg-[#004990] hover:bg-[#003870] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Tôi quan tâm</span>
                  </button>
                  <a
                    href="tel:0973874232"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                    title="Gọi tư vấn viên"
                  >
                    <PhoneCall className="w-4 h-4 text-[#DA251C]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
