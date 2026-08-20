export type CategoryType = 
  | 'all'
  | 'single-origin'
  | 'botanical-infusion'
  | 'artisanal-milk-tea'
  | 'ceremonial-matcha'
  | 'seasonal-reserve';

export interface FlavorProfile {
  floral: number;     // 1 - 5
  roasted: number;    // 1 - 5
  fruity: number;     // 1 - 5
  umami: number;      // 1 - 5
  sweetness: number;  // 1 - 5
}

export interface TeaProduct {
  id: string;
  name: string;
  nameZh: string;
  subtitle: string;
  category: CategoryType;
  price: number;
  description: string;
  originEstate: string;
  harvestSeason: string;
  altitude: string;
  roastLevel: 'Light' | 'Medium' | 'Deep Roasted' | 'Non-Roasted';
  caffeineLevel: 'Zero' | 'Low' | 'Medium' | 'High';
  calories: number;
  flavorProfile: FlavorProfile;
  tastingNotes: string[];
  ingredients: string[];
  brewingMethod: string;
  imageUrl: string;
  isLimited?: boolean;
  isBestSeller?: boolean;
  accentNote?: string;
}

export type IceOption = 
  | 'Slow Cold Drip (0°C)'
  | 'Light Ice (20%)'
  | 'No Ice / Chilled'
  | 'Warm (65°C)'
  | 'Hot Infusion (85°C)';

export type SweetnessOption = 
  | '0% Pure Tea (No Sugar)'
  | '30% Micro Cane Sugar'
  | '50% Organic Wild Honey'
  | '70% Mellow Sweet'
  | '100% Traditional Full';

export type MilkOption = 
  | 'Classic Pure Tea (No Milk)'
  | 'Estate Fresh Milk'
  | 'Hokkaido 3.6 Rich Milk (+NT$20)'
  | 'Artisanal Oat Milk (+NT$25)'
  | 'Coconut Velvet Milk (+NT$25)';

export type ToppingOption = 
  | 'Handcrafted Osmanthus Jelly (+NT$20)'
  | 'Roasted Barley Boba (+NT$15)'
  | 'Sea Salt Mascarpone Cheese Foam (+NT$25)'
  | 'Silver Needle White Tea Jelly (+NT$20)'
  | 'Organic Yuzu Konjac (+NT$20)';

export type CupSize = 
  | 'Ritual Medium (450ml)'
  | 'Grand Large (600ml / +NT$15)'
  | 'Amber Glass Bottle Edition (500ml / +NT$35)';

export interface CustomizationState {
  ice: IceOption;
  sweetness: SweetnessOption;
  milk: MilkOption;
  toppings: string[];
  size: CupSize;
  specialNotes?: string;
}

export interface CartItem {
  id: string;
  product: TeaProduct;
  customization: CustomizationState;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: number;
}

export interface ReservationDetails {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  tier: 'Signature Tea Flight' | 'Grand Sommelier Pairing' | 'Ceremonial Matcha & Wagashi';
  notes?: string;
}
