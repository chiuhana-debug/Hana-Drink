import React, { useState } from 'react';
import { X, Check, Droplets, Thermometer, Sparkles, Heart, Plus, Minus } from 'lucide-react';
import { 
  TeaProduct, 
  CustomizationState, 
  IceOption, 
  SweetnessOption, 
  MilkOption, 
  ToppingOption, 
  CupSize 
} from '../types';

interface CustomizerModalProps {
  product: TeaProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: TeaProduct, customization: CustomizationState, quantity: number) => void;
  language: 'en' | 'zh';
}

const ICE_OPTIONS: IceOption[] = [
  'Slow Cold Drip (0°C)',
  'Light Ice (20%)',
  'No Ice / Chilled',
  'Warm (65°C)',
  'Hot Infusion (85°C)',
];

const SWEETNESS_OPTIONS: SweetnessOption[] = [
  '0% Pure Tea (No Sugar)',
  '30% Micro Cane Sugar',
  '50% Organic Wild Honey',
  '70% Mellow Sweet',
  '100% Traditional Full',
];

const MILK_OPTIONS: MilkOption[] = [
  'Classic Pure Tea (No Milk)',
  'Estate Fresh Milk',
  'Hokkaido 3.6 Rich Milk (+NT$20)',
  'Artisanal Oat Milk (+NT$25)',
  'Coconut Velvet Milk (+NT$25)',
];

const TOPPING_OPTIONS: ToppingOption[] = [
  'Handcrafted Osmanthus Jelly (+NT$20)',
  'Roasted Barley Boba (+NT$15)',
  'Sea Salt Mascarpone Cheese Foam (+NT$25)',
  'Silver Needle White Tea Jelly (+NT$20)',
  'Organic Yuzu Konjac (+NT$20)',
];

const SIZE_OPTIONS: CupSize[] = [
  'Ritual Medium (450ml)',
  'Grand Large (600ml / +NT$15)',
  'Amber Glass Bottle Edition (500ml / +NT$35)',
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  language,
}) => {
  if (!isOpen || !product) return null;

  const [ice, setIce] = useState<IceOption>(
    product.brewingMethod.includes('Cold') || product.brewingMethod.includes('Ice') 
      ? 'Slow Cold Drip (0°C)' 
      : 'Light Ice (20%)'
  );
  const [sweetness, setSweetness] = useState<SweetnessOption>('30% Micro Cane Sugar');
  const [milk, setMilk] = useState<MilkOption>(
    product.category === 'artisanal-milk-tea' || product.category === 'ceremonial-matcha'
      ? 'Estate Fresh Milk'
      : 'Classic Pure Tea (No Milk)'
  );
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [size, setSize] = useState<CupSize>('Ritual Medium (450ml)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Calculate Unit Extra Cost
  const calculateExtraCost = () => {
    let extra = 0;
    if (milk.includes('+NT$20')) extra += 20;
    if (milk.includes('+NT$25')) extra += 25;

    selectedToppings.forEach((t) => {
      if (t.includes('+NT$20')) extra += 20;
      if (t.includes('+NT$15')) extra += 15;
      if (t.includes('+NT$25')) extra += 25;
    });

    if (size.includes('+NT$15')) extra += 15;
    if (size.includes('+NT$35')) extra += 35;

    return extra;
  };

  const unitPrice = product.price + calculateExtraCost();
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (topping: ToppingOption) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleConfirm = () => {
    const customState: CustomizationState = {
      ice,
      sweetness,
      milk,
      toppings: selectedToppings,
      size,
      specialNotes: specialNotes.trim() || undefined,
    };
    onAddToCart(product, customState, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1b1b]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        id="customizer-modal-content"
        className="relative bg-[#fcf9f8] w-full max-w-2xl overflow-hidden shadow-2xl rounded-sm border border-[#c5a059]/30 my-8"
      >
        {/* Header with image preview */}
        <div className="relative bg-[#f2ede4] p-6 border-b border-[#d2c4bb]/40 flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-white overflow-hidden shadow-sm shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#4d6453]">
                {product.originEstate}
              </span>
              <h2 className="text-xl font-serif text-[#1c1b1b] leading-tight">
                {language === 'en' ? product.name : product.nameZh}
              </h2>
              <p className="text-xs text-[#80756d] font-mono mt-0.5">
                {language === 'en' ? product.nameZh : product.subtitle}
              </p>
            </div>
          </div>

          <button
            id="close-customizer-modal-btn"
            onClick={onClose}
            className="text-[#80756d] hover:text-[#1c1b1b] p-1.5 rounded-sm hover:bg-[#eae7e7] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* 1. Size Selection */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
              1. {language === 'en' ? 'Select Vessel & Volume' : '選擇容量與器皿'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSize(opt)}
                  className={`p-2.5 text-left text-xs rounded-sm border transition-all cursor-pointer ${
                    size === opt
                      ? 'border-[#322214] bg-[#322214] text-[#fcf9f8] font-medium'
                      : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#80756d]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Temperature & Ice */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
              2. {language === 'en' ? 'Extraction Temperature & Ice' : '萃取溫度與冰量'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ICE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIce(opt)}
                  className={`p-2 text-left text-xs rounded-sm border transition-all cursor-pointer ${
                    ice === opt
                      ? 'border-[#4d6453] bg-[#4d6453] text-[#ffffff] font-medium'
                      : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#4d6453]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sweetness */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
              3. {language === 'en' ? 'Natural Sweetness Level' : '甘甜度 (天然蔗糖 / 蜂蜜)'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SWEETNESS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSweetness(opt)}
                  className={`p-2 text-left text-xs rounded-sm border transition-all cursor-pointer ${
                    sweetness === opt
                      ? 'border-[#322214] bg-[#322214] text-[#fcf9f8] font-medium'
                      : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#80756d]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Milk / Base Selection */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
              4. {language === 'en' ? 'Milk & Infusion Base' : '乳品與基底搭配'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MILK_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMilk(opt)}
                  className={`p-2.5 text-left text-xs rounded-sm border transition-all cursor-pointer ${
                    milk === opt
                      ? 'border-[#4d6453] bg-[#4d6453] text-[#ffffff] font-medium'
                      : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#4d6453]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Artisanal Botanical Toppings */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
              5. {language === 'en' ? 'Handcrafted Add-ons & Jellies (Optional)' : '手工草本加料 (可複選)'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPPING_OPTIONS.map((opt) => {
                const isSelected = selectedToppings.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleTopping(opt)}
                    className={`p-2.5 text-left text-xs rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#322214] font-medium'
                        : 'border-[#d2c4bb] bg-[#fcf9f8] text-[#4e453e] hover:border-[#80756d]'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Special Tea Master Note */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
              6. {language === 'en' ? 'Special Instructions / Calligraphy Note' : '茶席備註 / 題字卡片要求'}
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder={language === 'en' ? 'e.g. Extra hot, separate ice, gift bag requested...' : '例如：加強保溫、茶水與冰塊分裝、附贈禮品手提袋...'}
              className="w-full bg-transparent border-b border-[#322214] pb-1.5 text-xs text-[#1c1b1b] placeholder-[#80756d] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* Footer with Quantity and Total CTA */}
        <div className="p-6 bg-[#f2ede4] border-t border-[#d2c4bb]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#80756d]">
              {language === 'en' ? 'Quantity' : '數量'}
            </span>
            <div className="flex items-center border border-[#d2c4bb] rounded-sm bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 text-[#4e453e] hover:text-[#1c1b1b] cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-mono font-bold text-[#1c1b1b]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-[#4e453e] hover:text-[#1c1b1b] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <button
            id="confirm-add-to-bag-btn"
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-8 py-3.5 rounded-sm text-[12px] font-semibold tracking-[0.15em] uppercase flex items-center justify-between sm:justify-center gap-6 cursor-pointer shadow-md"
          >
            <span>{language === 'en' ? 'Add To Bag' : '加入訂單袋'}</span>
            <span className="font-mono text-[#c5a059] font-bold">NT$ {totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
