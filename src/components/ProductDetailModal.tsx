import React from 'react';
import { X, Mountain, Calendar, Sparkles, Droplets, Flame, Coffee, Compass } from 'lucide-react';
import { TeaProduct } from '../types';

interface ProductDetailModalProps {
  product: TeaProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (product: TeaProduct) => void;
  language: 'en' | 'zh';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onCustomize,
  language,
}) => {
  if (!isOpen || !product) return null;

  const flavorAttributes = [
    { key: 'floral', labelEn: 'Floral Aroma (花香)', labelZh: '幽雅花香', val: product.flavorProfile.floral },
    { key: 'roasted', labelEn: 'Roasting & Wood (火候)', labelZh: '炭火焙香', val: product.flavorProfile.roasted },
    { key: 'fruity', labelEn: 'Fruity & Honey (果蜜)', labelZh: '蜜韻果香', val: product.flavorProfile.fruity },
    { key: 'umami', labelEn: 'Umami & Depth (茶韻)', labelZh: '甘美茶韻', val: product.flavorProfile.umami },
    { key: 'sweetness', labelEn: 'Natural Sweetness (回甘)', labelZh: '生津回甘', val: product.flavorProfile.sweetness },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1b1b]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        id="product-detail-modal-content"
        className="relative bg-[#fcf9f8] w-full max-w-3xl overflow-hidden shadow-2xl rounded-sm border border-[#c5a059]/30 my-8"
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-[#1c1b1b] bg-[#fcf9f8]/80 hover:bg-[#fcf9f8] p-2 rounded-full shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Image Section */}
          <div className="md:col-span-5 relative bg-[#f0eded] min-h-[300px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b]/70 via-transparent to-transparent md:hidden"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white md:hidden">
              <p className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
                {product.originEstate}
              </p>
              <h2 className="text-2xl font-serif">{product.nameZh}</h2>
            </div>
          </div>

          {/* Right Detailed Heritage & Flavor Section */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="space-y-1.5 hidden md:block">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#4d6453]">
                <Mountain className="w-3.5 h-3.5" />
                <span>{product.originEstate}</span>
                <span className="text-[#80756d]">• {product.altitude}</span>
              </div>
              <h2 className="text-2xl font-serif text-[#1c1b1b]">
                {language === 'en' ? product.name : product.nameZh}
              </h2>
              <p className="text-xs text-[#80756d] font-mono">
                {language === 'en' ? product.nameZh : product.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#4e453e] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Tea Attributes Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#f2ede4] rounded-sm text-xs">
              <div>
                <span className="text-[10px] text-[#80756d] uppercase block">Harvest</span>
                <span className="font-medium text-[#1c1b1b]">{product.harvestSeason}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#80756d] uppercase block">Roast</span>
                <span className="font-medium text-[#1c1b1b]">{product.roastLevel}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#80756d] uppercase block">Caffeine</span>
                <span className="font-medium text-[#1c1b1b]">{product.caffeineLevel}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#80756d] uppercase block">Energy</span>
                <span className="font-medium text-[#1c1b1b]">{product.calories} kcal</span>
              </div>
            </div>

            {/* Flavor Spectrum Bars */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#322214]">
                {language === 'en' ? 'Sensory Aroma Spectrum' : '風味維度圖鑑'}
              </h4>
              <div className="space-y-2">
                {flavorAttributes.map((attr) => (
                  <div key={attr.key} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#4e453e]">
                      <span>{language === 'en' ? attr.labelEn : attr.labelZh}</span>
                      <span className="font-mono text-[#c5a059]">{attr.val} / 5</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#eae7e7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4d6453] rounded-full transition-all duration-500"
                        style={{ width: `${(attr.val / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasting Notes */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#322214]">
                {language === 'en' ? 'Tasting Notes' : '品飲風味標籤'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#c5a059]/15 text-[#322214] px-3 py-1 rounded-full font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Brewing Method */}
            <div className="text-xs text-[#80756d] space-y-1 border-t border-[#d2c4bb]/40 pt-4">
              <span className="font-semibold text-[#1c1b1b] block uppercase tracking-wider text-[10px]">
                {language === 'en' ? 'Brewing Ritual' : '侍茶萃取工法'}
              </span>
              <p className="font-light">{product.brewingMethod}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-[#d2c4bb]/40">
              <div className="font-mono text-xl font-bold text-[#1c1b1b]">
                NT$ {product.price}
              </div>

              <button
                id="modal-customize-btn"
                onClick={() => {
                  onClose();
                  onCustomize(product);
                }}
                className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-6 py-3 rounded-sm text-[12px] font-semibold tracking-[0.12em] uppercase cursor-pointer"
              >
                {language === 'en' ? 'Customize This Brew' : '前往客製點單 →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
