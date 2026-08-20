import React from 'react';
import { ArrowRight, Droplets, Sparkles, Mountain, Clock } from 'lucide-react';
import { TeaProduct } from '../types';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenSommelier: () => void;
  featuredProduct: TeaProduct;
  onSelectProduct: (product: TeaProduct) => void;
  language: 'en' | 'zh';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOpenSommelier,
  featuredProduct,
  onSelectProduct,
  language,
}) => {
  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#fcf9f8] pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#d2c4bb]/30">
      {/* Subtle Background Geometry */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f2ede4]/40 -z-10 pointer-events-none"></div>
      <div className="absolute top-20 left-12 w-px h-64 bg-[#c5a059]/20 -z-10 hidden lg:block"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#322214]">
                {language === 'en' ? 'Artisanal Single-Estate Reserve' : '單一莊園 · 慢萃冷滴茶席'}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1c1b1b] leading-[1.15] tracking-tight">
                {language === 'en' ? (
                  <>
                    The Power of the Pause. <br />
                    <span className="italic font-normal text-[#4d6453]">Quiet Luxury Tea Rituals.</span>
                  </>
                ) : (
                  <>
                    留白的藝術。 <br />
                    <span className="italic font-normal text-[#4d6453]">回歸純粹的慢萃茶飲體驗。</span>
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-[#4e453e] font-light max-w-xl leading-relaxed pt-2">
                {language === 'en'
                  ? 'Hand-harvested from misty mountain estates, slowly coaxed through 16-hour ice extraction and copper pot simmering. Experience tea elevated to modern high fashion.'
                  : '採擷自海拔一千六百公尺雲霧茶園，十六小時低溫冰滴緩慢凝萃。融合百年製茶工藝與當代極簡美學，讓每一口啜飲皆為心靈的靜謐留白。'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-all duration-300 px-8 py-3.5 rounded-sm text-[12px] font-semibold tracking-[0.15em] uppercase inline-flex items-center gap-2 cursor-pointer shadow-quiet group"
              >
                {language === 'en' ? 'Explore Collection' : '探索當季茶品'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-sommelier-quiz-btn"
                onClick={onOpenSommelier}
                className="border border-[#322214] text-[#322214] hover:bg-[#322214] hover:text-[#fcf9f8] transition-all duration-300 px-8 py-3.5 rounded-sm text-[12px] font-semibold tracking-[0.15em] uppercase cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                <span>{language === 'en' ? 'AI Tea Sommelier' : 'AI 侍茶師尋味'}</span>
              </button>
            </div>

            {/* Craftsmanship Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#d2c4bb]/40 max-w-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#4d6453]">
                  <Mountain className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Origin</span>
                </div>
                <p className="text-xl sm:text-2xl font-serif text-[#1c1b1b]">1,600m</p>
                <p className="text-[11px] text-[#80756d]">Alpine Cloud Estates</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#c5a059]">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Extraction</span>
                </div>
                <p className="text-xl sm:text-2xl font-serif text-[#1c1b1b]">16 Hours</p>
                <p className="text-[11px] text-[#80756d]">Kyusu Slow Ice Drip</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#322214]">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Purity</span>
                </div>
                <p className="text-xl sm:text-2xl font-serif text-[#1c1b1b]">100%</p>
                <p className="text-[11px] text-[#80756d]">Zero Additives</p>
              </div>
            </div>
          </div>

          {/* Right Featured Editorial Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative group cursor-pointer" onClick={() => onSelectProduct(featuredProduct)}>
              {/* Gold Framing Hairline */}
              <div className="absolute -inset-3 border border-[#c5a059]/40 pointer-events-none -z-0"></div>

              {/* Main Image with sharp 0px radius print aesthetic */}
              <div className="relative overflow-hidden bg-[#f0eded] aspect-[4/5] shadow-quiet">
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                {/* Overlaid Editorial Note */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <span className="inline-block px-2.5 py-1 bg-[#c5a059] text-[#1c1b1b] text-[10px] font-bold tracking-widest uppercase">
                    {featuredProduct.accentNote || 'Curator’s Choice'}
                  </span>
                  <h2 className="text-2xl font-serif leading-tight">
                    {featuredProduct.nameZh}
                  </h2>
                  <p className="text-xs text-stone-200 line-clamp-1 font-light">
                    {featuredProduct.subtitle}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
                    <span className="font-mono text-[#c5a059]">NT$ {featuredProduct.price}</span>
                    <span className="uppercase tracking-wider text-[10px] underline underline-offset-4 group-hover:text-[#c5a059] transition-colors">
                      {language === 'en' ? 'Craft This Ritual' : '訂製品飲 →'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
