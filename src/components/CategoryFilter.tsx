import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CategoryType } from '../types';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFlavorTag: string | null;
  onSelectFlavorTag: (tag: string | null) => void;
  language: 'en' | 'zh';
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedFlavorTag,
  onSelectFlavorTag,
  language,
}) => {
  const categories: { id: CategoryType; labelEn: string; labelZh: string }[] = [
    { id: 'all', labelEn: 'All Creations', labelZh: '全部茶品' },
    { id: 'single-origin', labelEn: 'Single Origin Reserve', labelZh: '單品冷萃' },
    { id: 'botanical-infusion', labelEn: 'Botanical Infusions', labelZh: '花果草本' },
    { id: 'artisanal-milk-tea', labelEn: 'Artisanal Milk Tea', labelZh: '鍋煮醇奶' },
    { id: 'ceremonial-matcha', labelEn: 'Ceremonial Matcha', labelZh: '宇治抹茶' },
    { id: 'seasonal-reserve', labelEn: 'Seasonal Limited', labelZh: '季節限定' },
  ];

  const flavorTags = [
    { id: 'floral', labelEn: 'Floral Notes (花香)', labelZh: '幽雅花香' },
    { id: 'roasted', labelEn: 'Charcoal Roasted (炭焙)', labelZh: '炭火焙香' },
    { id: 'fruity', labelEn: 'Fruity & Honey (果韻)', labelZh: '蜜韻果香' },
    { id: 'umami', labelEn: 'Rich Umami (茶韻)', labelZh: '甘美茶韻' },
    { id: 'caffeine-free', labelEn: 'Caffeine-Free (無咖啡因)', labelZh: '無咖啡因' },
  ];

  return (
    <div id="category-filter-section" className="space-y-6 pt-4 pb-6 border-b border-[#d2c4bb]/30">
      {/* Search Input & Info Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 whitespace-nowrap cursor-pointer rounded-full border ${
                  isActive
                    ? 'bg-[#4d6453] text-[#ffffff] border-[#4d6453] shadow-sm'
                    : 'bg-transparent text-[#4e453e] border-[#d2c4bb] hover:border-[#4d6453] hover:text-[#1c1b1b]'
                }`}
              >
                {language === 'en' ? cat.labelEn : cat.labelZh}
              </button>
            );
          })}
        </div>

        {/* Minimal Stationery Bottom-Border Search Field */}
        <div className="relative min-w-[260px]">
          <div className="flex items-center border-b border-[#322214] pb-1.5 focus-within:border-[#c5a059] transition-colors">
            <Search className="w-4 h-4 text-[#80756d] mr-2" />
            <input
              id="tea-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={language === 'en' ? 'Search by tea leaf or estate...' : '搜尋茶款、產地或風味...'}
              className="bg-transparent text-sm text-[#1c1b1b] placeholder-[#80756d] focus:outline-none w-full font-light"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[#80756d] hover:text-[#1c1b1b] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Flavor Profile Tags */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-[#80756d] pt-1">
        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium text-[#1c1b1b]">
          <SlidersHorizontal className="w-3 h-3 text-[#c5a059]" />
          {language === 'en' ? 'Tasting Profile:' : '風味微調:'}
        </span>

        {flavorTags.map((tag) => {
          const isSelected = selectedFlavorTag === tag.id;
          return (
            <button
              key={tag.id}
              id={`flavor-tag-${tag.id}`}
              onClick={() => onSelectFlavorTag(isSelected ? null : tag.id)}
              className={`px-3 py-1 text-[11px] rounded-full transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#c5a059] text-[#1c1b1b] border-[#c5a059] font-medium shadow-xs'
                  : 'bg-[#fcf9f8] text-[#4e453e] border-[#d2c4bb]/60 hover:border-[#80756d]'
              }`}
            >
              {language === 'en' ? tag.labelEn : tag.labelZh}
            </button>
          );
        })}

        {selectedFlavorTag && (
          <button
            onClick={() => onSelectFlavorTag(null)}
            className="text-[11px] underline text-[#80756d] hover:text-[#1c1b1b] ml-1 cursor-pointer"
          >
            {language === 'en' ? 'Clear Filter' : '重設篩選'}
          </button>
        )}
      </div>
    </div>
  );
};
