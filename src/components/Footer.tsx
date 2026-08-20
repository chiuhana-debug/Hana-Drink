import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, ArrowRight, Instagram, Facebook, MapPin, Phone, Clock, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenReservation: () => void;
  onOpenSommelier: () => void;
  language: 'en' | 'zh';
}

export const Footer: React.FC<FooterProps> = ({
  onOpenReservation,
  onOpenSommelier,
  language,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#322214] text-[#fcf9f8] pt-16 pb-12 border-t border-[#4a3728]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 space-y-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-sm pt-2">
              {language === 'en'
                ? 'Hana Drink resides at the intersection of a high-end tea house and a modern luxury fashion house. Single-estate cold drips and slow botanical alchemy.'
                : 'Hana Drink 融合高訂時裝屋的極簡線條與百年茶道儀軌。堅持單一莊園原葉、十六小時低溫冰滴，為現代生活賦予純粹的留白力量。'}
            </p>

            <div className="pt-2 flex items-center gap-4 text-stone-300">
              <a href="#" className="hover:text-[#c5a059] transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#c5a059] transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <span className="text-xs font-mono text-[#c5a059]">#HanaDrink #QuietLuxuryTea</span>
            </div>
          </div>

          {/* Boutique Locations */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              {language === 'en' ? 'Flagship Lounges' : '直營旗艦茶席'}
            </h4>
            
            <div className="space-y-3 text-xs text-stone-300 font-light">
              <div className="space-y-0.5">
                <p className="font-semibold text-white">Taipei Da'an Flagship (台北大安)</p>
                <p className="flex items-center gap-1.5 text-stone-400">
                  <MapPin className="w-3 h-3 text-[#c5a059]" /> No. 88, Sec. 1, Da'an Rd, Taipei
                </p>
                <p className="flex items-center gap-1.5 text-stone-400">
                  <Clock className="w-3 h-3 text-[#c5a059]" /> 11:00 – 21:30 Daily
                </p>
              </div>

              <div className="space-y-0.5 pt-2">
                <p className="font-semibold text-white">Kyoto Gion Salon (京都祇園)</p>
                <p className="text-stone-400">Higashiyama-ku, Kyoto</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              {language === 'en' ? 'Navigation' : '導覽探索'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-300 font-light">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  {language === 'en' ? 'Spring Harvest 2025' : '2025 春茶限定'}
                </button>
              </li>
              <li>
                <button onClick={onOpenSommelier} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  {language === 'en' ? 'Digital Tea Sommelier' : '線上侍茶師測驗'}
                </button>
              </li>
              <li>
                <button onClick={onOpenReservation} className="hover:text-[#c5a059] transition-colors cursor-pointer">
                  {language === 'en' ? 'Private Tasting Room' : '預約專屬茶席'}
                </button>
              </li>
              <li>
                <span className="text-stone-500">{language === 'en' ? 'Estate Direct Sourcing' : '雲霧產地履歷'}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Washi Dispatch */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              {language === 'en' ? 'The Private Dispatch' : '訂閱茶席特刊'}
            </h4>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {language === 'en'
                ? 'Receive private release allocations of micro-lot high mountain teas and seasonal lounge invitations.'
                : '第一時間獲取微量批次高山冷萃配額，以及季節茶席私密品鑑邀請。'}
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#4d6453]/30 border border-[#4d6453] text-xs text-white rounded-sm">
                ✓ {language === 'en' ? 'Welcome to the Hana Circle.' : '已成功訂閱，期待與您相遇。'}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center border-b border-stone-400 focus-within:border-[#c5a059] pb-1 transition-colors">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'en' ? 'Your email address...' : '請輸入電子信箱...'}
                    className="bg-transparent text-xs text-white placeholder-stone-400 w-full focus:outline-none font-light"
                  />
                  <button
                    type="submit"
                    className="text-stone-300 hover:text-[#c5a059] p-1 cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Fine Hairline & Copyright */}
        <div className="pt-8 border-t border-stone-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} HANA DRINK. All rights reserved. Crafted with Quiet Luxury.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-200 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-stone-200 cursor-pointer">Estate Traceability</span>
            <span className="hover:text-stone-200 cursor-pointer">Terms of Ritual</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
