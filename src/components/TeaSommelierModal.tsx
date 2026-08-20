import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Droplets } from 'lucide-react';
import { TeaProduct, CustomizationState } from '../types';

interface TeaSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: TeaProduct[];
  onSelectProduct: (product: TeaProduct) => void;
  onQuickAdd: (product: TeaProduct) => void;
  language: 'en' | 'zh';
}

export const TeaSommelierModal: React.FC<TeaSommelierModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onQuickAdd,
  language,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('afternoon');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('floral');
  const [selectedCaffeine, setSelectedCaffeine] = useState<string>('medium');

  if (!isOpen) return null;

  const occasions = [
    { id: 'morning', titleEn: 'Morning Awakening', titleZh: '晨間初醒 · 澄澈思緒', desc: 'Crisp, invigorating, and clean aromatics.' },
    { id: 'midday', titleEn: 'Midday Energy', titleZh: '正午提神 · 醇厚回甘', desc: 'Rich body, roasted notes, and deep minerals.' },
    { id: 'afternoon', titleEn: 'Afternoon Zen Pause', titleZh: '午後留白 · 雅緻花香', desc: 'Gentle floral perfumes and soothing lingering sweet finish.' },
    { id: 'evening', titleEn: 'Evening Unwind', titleZh: '夜幕靜心 · 無負擔放鬆', desc: 'Zero or low caffeine, gentle comforting warmth.' },
  ];

  const flavorChoices = [
    { id: 'floral', titleEn: 'Ethereal Floral', titleZh: '幽雅花香', icon: '🌸', desc: 'Jasmine, Osmanthus, Gardenia' },
    { id: 'roasted', titleEn: 'Deep Charcoal Wood', titleZh: '深層炭焙', icon: '🪵', desc: 'Longan charcoal, roasted barley, dark cocoa' },
    { id: 'fruity', titleEn: 'Juicy Honey & Fruit', titleZh: '蜜韻果香', icon: '🍑', desc: 'White peach, muscatel grape, wild honey' },
    { id: 'creamy', titleEn: 'Velvety Cream & Umami', titleZh: '絲絨醇奶', icon: '🥛', desc: 'Estate fresh milk, sea salt mascarpone' },
  ];

  const caffeineOptions = [
    { id: 'high', titleEn: 'Ceremonial Energy', titleZh: '清醒專注 (高茶多酚)' },
    { id: 'medium', titleEn: 'Balanced Mellow', titleZh: '溫和適中 (常規茶感)' },
    { id: 'zero', titleEn: 'Zero Caffeine', titleZh: '純淨無咖啡因 (夜間適飲)' },
  ];

  // Match recommendation algorithm
  const getRecommendedTea = (): TeaProduct => {
    if (selectedCaffeine === 'zero') {
      return products.find((p) => p.caffeineLevel === 'Zero') || products[0];
    }
    if (selectedFlavor === 'creamy') {
      return products.find((p) => p.category === 'ceremonial-matcha' || p.category === 'artisanal-milk-tea') || products[1];
    }
    if (selectedFlavor === 'roasted') {
      return products.find((p) => p.roastLevel === 'Deep Roasted') || products[2];
    }
    if (selectedFlavor === 'fruity') {
      return products.find((p) => p.id === 'hana-white-peach-oolong' || p.id === 'hana-oriental-beauty') || products[2];
    }
    return products.find((p) => p.flavorProfile.floral >= 4) || products[0];
  };

  const recommendation = getRecommendedTea();

  const handleReset = () => {
    setStep(1);
    setSelectedOccasion('afternoon');
    setSelectedFlavor('floral');
    setSelectedCaffeine('medium');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1b1b]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        id="sommelier-modal-content"
        className="relative bg-[#fcf9f8] w-full max-w-2xl overflow-hidden shadow-2xl rounded-sm border border-[#c5a059]/30 my-8"
      >
        {/* Header */}
        <div className="bg-[#f2ede4] p-6 border-b border-[#d2c4bb]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#c5a059]" />
            <div>
              <h2 className="text-lg font-serif text-[#1c1b1b]">
                {language === 'en' ? 'Digital Tea Sommelier' : 'Hana 專屬侍茶師問診'}
              </h2>
              <p className="text-xs text-[#80756d]">
                {language === 'en' ? 'Discover your tailor-made tea ritual in 3 steps.' : '探索當下最契合您身心狀態的茶品。'}
              </p>
            </div>
          </div>

          <button
            id="close-sommelier-modal-btn"
            onClick={onClose}
            className="p-1.5 text-[#80756d] hover:text-[#1c1b1b] rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex border-b border-[#d2c4bb]/30 bg-[#fcf9f8]">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 transition-all ${
                step >= i ? 'bg-[#4d6453]' : 'bg-[#e5e2e1]'
              }`}
            ></div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Occasion */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold">
                Step 1 of 3
              </span>
              <h3 className="text-xl font-serif text-[#1c1b1b]">
                {language === 'en' ? 'What is your current moment or mood?' : '此時此刻，您需要什麼樣的身心狀態？'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`p-4 text-left rounded-sm border transition-all cursor-pointer ${
                      selectedOccasion === occ.id
                        ? 'border-[#322214] bg-[#f2ede4] text-[#1c1b1b] ring-1 ring-[#322214]'
                        : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#80756d]'
                    }`}
                  >
                    <p className="font-semibold text-sm text-[#1c1b1b]">
                      {language === 'en' ? occ.titleEn : occ.titleZh}
                    </p>
                    <p className="text-xs text-[#80756d] mt-1 font-light">{occ.desc}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-6 py-3 rounded-sm text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Next' : '下一步'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Flavor Spectrum */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold">
                Step 2 of 3
              </span>
              <h3 className="text-xl font-serif text-[#1c1b1b]">
                {language === 'en' ? 'Which flavor notes resonate with your palate?' : '您偏好哪種香氣基調？'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {flavorChoices.map((fc) => (
                  <button
                    key={fc.id}
                    onClick={() => setSelectedFlavor(fc.id)}
                    className={`p-4 text-left rounded-sm border transition-all cursor-pointer ${
                      selectedFlavor === fc.id
                        ? 'border-[#4d6453] bg-[#f2ede4] text-[#1c1b1b] ring-1 ring-[#4d6453]'
                        : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#80756d]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{fc.icon}</span>
                      <p className="font-semibold text-sm text-[#1c1b1b]">
                        {language === 'en' ? fc.titleEn : fc.titleZh}
                      </p>
                    </div>
                    <p className="text-xs text-[#80756d] mt-1 font-light">{fc.desc}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#80756d] hover:text-[#1c1b1b] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  {language === 'en' ? 'Back' : '上一步'}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-6 py-3 rounded-sm text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Next' : '下一步'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Caffeine Level */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold">
                Step 3 of 3
              </span>
              <h3 className="text-xl font-serif text-[#1c1b1b]">
                {language === 'en' ? 'Select your preferred caffeine strength:' : '您的咖啡因攝取考量：'}
              </h3>

              <div className="space-y-2.5 pt-2">
                {caffeineOptions.map((caf) => (
                  <button
                    key={caf.id}
                    onClick={() => setSelectedCaffeine(caf.id)}
                    className={`w-full p-3.5 text-left rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      selectedCaffeine === caf.id
                        ? 'border-[#322214] bg-[#322214] text-[#fcf9f8]'
                        : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#80756d]'
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {language === 'en' ? caf.titleEn : caf.titleZh}
                    </span>
                    {selectedCaffeine === caf.id && (
                      <Check className="w-4 h-4 text-[#c5a059]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#80756d] hover:text-[#1c1b1b] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  {language === 'en' ? 'Back' : '上一步'}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-[#4d6453] text-[#ffffff] hover:bg-[#364c3c] transition-colors px-6 py-3 rounded-sm text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{language === 'en' ? 'Reveal My Brew' : '揭曉契合茶款'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Matched Result */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#4d6453] font-bold">
                  {language === 'en' ? 'Tailored Recommendation' : '侍茶師推薦款'}
                </span>
                <h3 className="text-2xl font-serif text-[#1c1b1b]">
                  {language === 'en' ? recommendation.name : recommendation.nameZh}
                </h3>
                <p className="text-xs text-[#80756d]">
                  {recommendation.originEstate} • {recommendation.altitude}
                </p>
              </div>

              {/* Product Preview Card */}
              <div className="p-4 bg-[#f2ede4] rounded-sm border border-[#d2c4bb]/40 text-left flex gap-4 items-center max-w-lg mx-auto">
                <div className="w-20 h-24 bg-white shrink-0 overflow-hidden rounded-xs">
                  <img
                    src={recommendation.imageUrl}
                    alt={recommendation.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] bg-[#c5a059] text-[#1c1b1b] font-bold px-2 py-0.5 rounded-xs uppercase">
                    {recommendation.accentNote || 'Perfect Match'}
                  </span>
                  <p className="text-xs text-[#4e453e] line-clamp-2 font-light">
                    {recommendation.description}
                  </p>
                  <p className="font-mono text-sm font-bold text-[#1c1b1b]">
                    NT$ {recommendation.price}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onSelectProduct(recommendation);
                  }}
                  className="w-full sm:w-auto bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-6 py-3 rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer"
                >
                  {language === 'en' ? 'View Details & Customize' : '深入品鑑與客製'}
                </button>

                <button
                  onClick={() => {
                    onQuickAdd(recommendation);
                    onClose();
                  }}
                  className="w-full sm:w-auto bg-[#4d6453] text-[#ffffff] hover:bg-[#364c3c] transition-colors px-6 py-3 rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer"
                >
                  {language === 'en' ? 'Direct Quick Add' : '立即加入訂單袋'}
                </button>

                <button
                  onClick={handleReset}
                  className="text-xs text-[#80756d] hover:text-[#1c1b1b] inline-flex items-center gap-1 cursor-pointer py-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'en' ? 'Retake Quiz' : '重新測驗'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
