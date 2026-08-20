import React from 'react';
import { Logo } from './Logo';
import { ShoppingBag, Search, Compass, Calendar, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSommelier: () => void;
  onOpenReservation: () => void;
  onSelectCategory: (category: any) => void;
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
  language: 'en' | 'zh';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSommelier,
  onOpenReservation,
  onScrollToSection,
  language,
  onToggleLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f8]/90 backdrop-blur-md border-b border-[#d2c4bb]/30 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#322214] text-[#fcf9f8] text-[11px] font-medium tracking-[0.15em] uppercase py-1.5 px-4 text-center">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
          {language === 'en' 
            ? 'Spring 2025 Reserve Harvest Available • Free Express Delivery on Orders over NT$800'
            : '2025 初春首摘限定茶品上市 • 單筆滿 NT$800 享冷鏈免運直送'}
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
        {/* Left Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold tracking-[0.1em] uppercase text-[#1c1b1b]">
          <button
            id="nav-collection-btn"
            onClick={() => onScrollToSection('menu-section')}
            className="hover:text-[#4d6453] transition-colors py-1 relative group cursor-pointer"
          >
            {language === 'en' ? 'Collection' : '茶品系列'}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            id="nav-philosophy-btn"
            onClick={() => onScrollToSection('philosophy-section')}
            className="hover:text-[#4d6453] transition-colors py-1 relative group cursor-pointer"
          >
            {language === 'en' ? 'Philosophy' : '茶席哲學'}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            id="nav-lounge-btn"
            onClick={onOpenReservation}
            className="hover:text-[#4d6453] transition-colors py-1 relative group cursor-pointer inline-flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
            {language === 'en' ? 'Tasting Lounge' : '茶室預約'}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            id="nav-sommelier-btn"
            onClick={onOpenSommelier}
            className="hover:text-[#4d6453] transition-colors py-1 relative group cursor-pointer inline-flex items-center gap-1.5 text-[#322214]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-semibold">{language === 'en' ? 'AI Sommelier' : 'AI 智能侍茶'}</span>
            <span className="text-[9px] bg-[#c5a059] text-[#1c1b1b] font-bold px-1.5 py-0.2 rounded-xs">AI</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Center Brand Logo */}
        <div className="flex-1 md:flex-initial flex justify-center items-center">
          <button 
            id="nav-brand-logo-btn"
            onClick={() => onScrollToSection('hero-section')} 
            className="cursor-pointer focus:outline-none"
            aria-label="Hana Drink Home"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Language Toggle */}
          <button
            id="nav-language-toggle-btn"
            onClick={onToggleLanguage}
            className="text-[12px] font-semibold tracking-widest uppercase text-[#4e453e] hover:text-[#1c1b1b] transition-colors px-2 py-1 border border-[#d2c4bb] rounded-sm cursor-pointer"
          >
            {language === 'en' ? '繁中' : 'EN'}
          </button>

          {/* Sommelier Mobile Trigger */}
          <button
            id="nav-mobile-sommelier-btn"
            onClick={onOpenSommelier}
            className="md:hidden text-[#1c1b1b] hover:text-[#4d6453] p-1.5 cursor-pointer"
            aria-label="Tea Sommelier"
          >
            <Sparkles className="w-5 h-5 text-[#c5a059]" />
          </button>

          {/* Cart Bag Trigger */}
          <button
            id="nav-cart-drawer-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-4 py-2.5 rounded-sm cursor-pointer text-[12px] font-semibold tracking-[0.1em] uppercase shadow-sm"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
            <span className="hidden sm:inline">{language === 'en' ? 'Bag' : '訂單袋'}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#cc2b2b] text-white text-[10px] font-bold flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
