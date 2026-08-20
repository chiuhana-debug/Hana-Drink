import React from 'react';
import { Mountain, Droplet, Sparkles, Feather } from 'lucide-react';

interface PhilosophySectionProps {
  language: 'en' | 'zh';
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ language }) => {
  const pillars = [
    {
      icon: Mountain,
      number: 'I',
      titleEn: 'Single-Estate Terroir',
      titleZh: '單一雲霧莊園直送',
      descEn: 'We partner directly with multi-generational high-mountain tea farmers in Alishan, Sun Moon Lake, and Uji. Every batch preserves its unique microclimate and unblended integrity.',
      descZh: '嚴選阿里山、日月潭與京都宇治等高海拔獨立茶園。絕不混茶，完整封存季候雲霧、地質礦物與茶師手炒的風土真味。',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: Droplet,
      number: 'II',
      titleEn: '16-Hour Slow Extraction',
      titleZh: '十六小時慢萃冷滴',
      descEn: 'Water meets leaf in microscopic slow drops at 2-4°C. This eliminates the release of aggressive tannins while maximizing natural theanine, resulting in a silk-smooth velvet finish.',
      descZh: '以特製九洲琉璃冰滴器皿，每兩秒一滴純淨冷泉水漫過茶葉。徹底阻絕澀味單寧酸釋出，純粹萃取天然茶胺酸與甘甜精華。',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: Sparkles,
      number: 'III',
      titleEn: 'The Power of the Pause',
      titleZh: '以茶為境 · 留白哲學',
      descEn: 'In a world of constant haste, Hana Drink is designed as an architectural pause. An intentional sensory ritual that invites calm, focus, and quiet modern luxury.',
      descZh: '在喧囂繁複的步調中，為生活安放一處靜謐的角落。結合東方茶道儀軌與現代極簡美學，讓每一次啜飲皆是一場身心的安歇。',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="philosophy-section" className="py-20 lg:py-28 bg-[#f2ede4] border-b border-[#d2c4bb]/40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#4d6453]">
            <Feather className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{language === 'en' ? 'The Hana Philosophy' : '品牌精神與製茶堅持'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1b1b] leading-tight">
            {language === 'en' ? 'Crafting the Modern Tea Ceremony' : '融合東方茶席與現代極簡風尚'}
          </h2>
          <p className="text-sm sm:text-base text-[#4e453e] font-light leading-relaxed">
            {language === 'en'
              ? 'We treat every tea leaf with reverence. From temperature-controlled copper pot simmering to zero-additive botanical infusion, we redefine beverage luxury.'
              : '我們將每一片茶葉視為大自然的藝術品。捨棄傳統手搖飲的化學香精與繁複糖漿，回歸頂級原葉低溫慢萃與鍋煮本質。'}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                id={`philosophy-pillar-${idx}`}
                className="group flex flex-col justify-between space-y-4 bg-[#fcf9f8] p-6 lg:p-8 rounded-sm border border-[#d2c4bb]/50 shadow-quiet transition-all duration-300 hover:border-[#c5a059]"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#e5e2e1] rounded-xs">
                  <img
                    src={pillar.image}
                    alt={pillar.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#322214] text-[#fcf9f8] text-xs font-serif flex items-center justify-center font-bold">
                    {pillar.number}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-[#4d6453]">
                    <Icon className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-[11px] font-semibold tracking-wider uppercase">Pillar {pillar.number}</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#1c1b1b]">
                    {language === 'en' ? pillar.titleEn : pillar.titleZh}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4e453e] font-light leading-relaxed">
                    {language === 'en' ? pillar.descEn : pillar.descZh}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
