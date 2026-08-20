import React from 'react';
import { Plus, Eye, Sparkles, Droplets } from 'lucide-react';
import { TeaProduct } from '../types';

interface ProductCardProps {
  product: TeaProduct;
  onQuickView: (product: TeaProduct) => void;
  onCustomize: (product: TeaProduct) => void;
  onQuickAdd: (product: TeaProduct) => void;
  language: 'en' | 'zh';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onCustomize,
  onQuickAdd,
  language,
}) => {
  return (
    <div 
      id={`product-card-${product.id}`} 
      className="group relative flex flex-col justify-between transition-all duration-300"
    >
      {/* Photographic Print Image Box (0px radius, sharp) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f0eded]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isLimited && (
            <span className="px-2 py-0.5 bg-[#c5a059] text-[#1c1b1b] text-[10px] font-bold tracking-widest uppercase">
              {language === 'en' ? 'Limited Reserve' : '限量茶席'}
            </span>
          )}
          {product.isBestSeller && !product.isLimited && (
            <span className="px-2 py-0.5 bg-[#322214] text-[#fcf9f8] text-[10px] font-semibold tracking-widest uppercase">
              {language === 'en' ? 'Signature' : '經典招牌'}
            </span>
          )}
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#1c1b1b]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-[#fcf9f8] text-[#1c1b1b] hover:bg-[#c5a059] hover:text-[#1c1b1b] transition-colors p-3 rounded-sm shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
            title={language === 'en' ? 'Tasting Profile & Origin' : '品飲筆記與莊園簡介'}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'Profile' : '詳情'}</span>
          </button>

          <button
            id={`quick-add-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors p-3 rounded-sm shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
            title={language === 'en' ? 'Quick Add with Default Recipe' : '標準黃金配方直購'}
          >
            <Plus className="w-4 h-4 text-[#c5a059]" />
            <span className="hidden sm:inline">{language === 'en' ? 'Quick Add' : '快選'}</span>
          </button>
        </div>
      </div>

      {/* Ghost Container Content Info */}
      <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#4d6453]">
              {product.originEstate.split(',')[0]}
            </span>
            <span className="text-[11px] text-[#80756d]">
              {product.altitude}
            </span>
          </div>

          <h3 className="text-lg font-serif text-[#1c1b1b] group-hover:text-[#4d6453] transition-colors line-clamp-1">
            {language === 'en' ? product.name : product.nameZh}
          </h3>

          <p className="text-xs text-[#80756d] line-clamp-1 font-light">
            {language === 'en' ? product.nameZh : product.subtitle}
          </p>
        </div>

        {/* Tasting Notes Chips */}
        <div className="flex flex-wrap gap-1.5">
          {product.tastingNotes.slice(0, 3).map((note, idx) => (
            <span
              key={idx}
              className="text-[10px] text-[#4e453e] bg-[#f2ede4] px-2 py-0.5 rounded-xs"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price & Customize Trigger */}
        <div className="pt-2 border-t border-[#c5a059]/20 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold tracking-wider text-[#1c1b1b]">
            NT$ {product.price}
          </span>

          <button
            id={`customize-ritual-btn-${product.id}`}
            onClick={() => onCustomize(product)}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#322214] hover:text-[#4d6453] transition-colors inline-flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5"
          >
            {language === 'en' ? 'Customize Ritual' : '訂製風味'}
            <span className="text-xs text-[#c5a059]">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
