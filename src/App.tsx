import React, { useState, useEffect, useMemo } from 'react';
import { TEA_PRODUCTS } from './data/teaProducts';
import { TeaProduct, CategoryType, CustomizationState, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CustomizerModal } from './components/CustomizerModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AiSommelierModal } from './components/AiSommelierModal';
import { TastingLoungeSection } from './components/TastingLoungeSection';
import { PhilosophySection } from './components/PhilosophySection';
import { Footer } from './components/Footer';
import { Sparkles, Check, MessageSquare, Bot } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlavorTag, setSelectedFlavorTag] = useState<string | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState<TeaProduct | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<TeaProduct | null>(null);

  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State with Local Storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hana_drink_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hana_drink_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return TEA_PRODUCTS.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchNameZh = product.nameZh.includes(q);
        const matchOrigin = product.originEstate.toLowerCase().includes(q);
        const matchSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchNotes = product.tastingNotes.some((n) => n.toLowerCase().includes(q));
        if (!matchName && !matchNameZh && !matchOrigin && !matchSubtitle && !matchNotes) {
          return false;
        }
      }

      // Flavor tag filter
      if (selectedFlavorTag) {
        if (selectedFlavorTag === 'floral' && product.flavorProfile.floral < 4) return false;
        if (selectedFlavorTag === 'roasted' && product.flavorProfile.roasted < 4) return false;
        if (selectedFlavorTag === 'fruity' && product.flavorProfile.fruity < 4) return false;
        if (selectedFlavorTag === 'umami' && product.flavorProfile.umami < 4) return false;
        if (selectedFlavorTag === 'caffeine-free' && product.caffeineLevel !== 'Zero') return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedFlavorTag]);

  // Cart Handlers
  const handleAddToCart = (product: TeaProduct, customization: CustomizationState, quantity: number) => {
    let unitExtra = 0;
    if (customization.milk.includes('+NT$20')) unitExtra += 20;
    if (customization.milk.includes('+NT$25')) unitExtra += 25;
    customization.toppings.forEach((t) => {
      if (t.includes('+NT$20')) unitExtra += 20;
      if (t.includes('+NT$15')) unitExtra += 15;
      if (t.includes('+NT$25')) unitExtra += 25;
    });
    if (customization.size.includes('+NT$15')) unitExtra += 15;
    if (customization.size.includes('+NT$35')) unitExtra += 35;

    const unitPrice = product.price + unitExtra;
    const totalPrice = unitPrice * quantity;

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      product,
      customization,
      quantity,
      unitPrice,
      totalPrice,
      addedAt: Date.now(),
    };

    setCart((prev) => [newItem, ...prev]);
    showToast(language === 'en' ? `Added ${product.name} to Bag` : `已將 ${product.nameZh} 加入訂單袋`);
  };

  const handleQuickAdd = (product: TeaProduct) => {
    const defaultCustomization: CustomizationState = {
      ice: product.brewingMethod.includes('Cold') ? 'Slow Cold Drip (0°C)' : 'Light Ice (20%)',
      sweetness: '30% Micro Cane Sugar',
      milk: product.category === 'artisanal-milk-tea' || product.category === 'ceremonial-matcha' ? 'Estate Fresh Milk' : 'Classic Pure Tea (No Milk)',
      toppings: [],
      size: 'Ritual Medium (450ml)',
    };
    handleAddToCart(product, defaultCustomization, 1);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col selection:bg-[#4d6453] selection:text-[#ffffff]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#322214] text-[#fcf9f8] px-5 py-3 rounded-sm shadow-2xl text-xs font-semibold tracking-wider uppercase flex items-center gap-2.5 animate-fadeIn border border-[#c5a059]/40">
          <Check className="w-4 h-4 text-[#c5a059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cartCount={cart.reduce((cnt, item) => cnt + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onSelectCategory={setActiveCategory}
        activeSection="menu-section"
        onScrollToSection={scrollToSection}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreClick={() => scrollToSection('menu-section')}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        featuredProduct={TEA_PRODUCTS[0]}
        onSelectProduct={(prod) => {
          setDetailProduct(prod);
          setIsDetailOpen(true);
        }}
        language={language}
      />

      {/* Main Tea Menu & Curated Collection Section */}
      <main id="menu-section" className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-20 flex-1 w-full space-y-10">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4d6453]">
              {language === 'en' ? 'Curated Tea Harvest' : '旬味茶選 · 嚴選產地'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1c1b1b]">
              {language === 'en' ? 'Seasonal Tea Rituals' : '當季現萃茶品目錄'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#80756d] font-light max-w-md">
            {language === 'en'
              ? 'Each tea is harvested in small micro-lots and extracted slowly to preserve delicate floral volatile oils.'
              : '每款茶飲皆嚴格把控水溫、時間與萃取壓力，讓您品嚐到如香水般層次分明的前中後調。'}
          </p>
        </div>

        {/* Filter Bar */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFlavorTag={selectedFlavorTag}
          onSelectFlavorTag={setSelectedFlavorTag}
          language={language}
        />

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-lg font-serif text-[#1c1b1b]">
              {language === 'en' ? 'No tea creations found matching your filter.' : '未找到符合此篩選條件的茶款。'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setSelectedFlavorTag(null);
              }}
              className="text-xs font-semibold text-[#4d6453] uppercase tracking-widest underline underline-offset-4 cursor-pointer"
            >
              {language === 'en' ? 'Reset All Filters' : '重設所有篩選條件'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => {
                  setDetailProduct(p);
                  setIsDetailOpen(true);
                }}
                onCustomize={(p) => {
                  setCustomizerProduct(p);
                  setIsCustomizerOpen(true);
                }}
                onQuickAdd={handleQuickAdd}
                language={language}
              />
            ))}
          </div>
        )}
      </main>

      {/* Editorial Philosophy Section */}
      <PhilosophySection language={language} />

      {/* Footer */}
      <Footer
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        language={language}
      />

      {/* Modals and Drawers */}
      <CustomizerModal
        product={customizerProduct}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setCustomizerProduct(null);
        }}
        onAddToCart={handleAddToCart}
        language={language}
      />

      <ProductDetailModal
        product={detailProduct}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailProduct(null);
        }}
        onCustomize={(p) => {
          setIsDetailOpen(false);
          setCustomizerProduct(p);
          setIsCustomizerOpen(true);
        }}
        language={language}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        language={language}
      />

      {/* Floating AI Sommelier Agent Button */}
      <button
        id="floating-ai-sommelier-btn"
        onClick={() => setIsSommelierOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] border border-[#c5a059]/60 shadow-2xl px-4 py-3 rounded-full flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer group"
        aria-label="Open AI Tea Sommelier"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c5a059]"></span>
        </span>
        <Sparkles className="w-4 h-4 text-[#c5a059] group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold tracking-wider uppercase pr-1">
          {language === 'en' ? 'AI Sommelier' : 'AI 侍茶師尋味'}
        </span>
      </button>

      <AiSommelierModal
        isOpen={isSommelierOpen}
        onClose={() => setIsSommelierOpen(false)}
        products={TEA_PRODUCTS}
        onSelectProduct={(p) => {
          setDetailProduct(p);
          setIsDetailOpen(true);
        }}
        onCustomize={(p) => {
          setCustomizerProduct(p);
          setIsCustomizerOpen(true);
        }}
        onQuickAdd={handleQuickAdd}
        language={language}
      />

      <TastingLoungeSection
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        language={language}
      />
    </div>
  );
}
