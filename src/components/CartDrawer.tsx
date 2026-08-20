import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift, MapPin, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  language: 'en' | 'zh';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  language,
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [isGiftNote, setIsGiftNote] = useState(false);
  const [giftNoteMessage, setGiftNoteMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 800 ? 0 : 80) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderId(`HN-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderConfirmed(true);
    }, 1200);
  };

  const handleFinishOrder = () => {
    setOrderConfirmed(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1c1b1b]/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#fcf9f8] h-full shadow-drawer flex flex-col justify-between border-l border-[#d2c4bb]/40 animate-slideLeft"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-[#f2ede4] border-b border-[#d2c4bb]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#322214]" />
            <h2 className="text-lg font-serif text-[#1c1b1b]">
              {language === 'en' ? 'Your Tea Ritual Bag' : '您的茶品訂單袋'}
            </h2>
            <span className="text-xs bg-[#c5a059] text-[#1c1b1b] font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((cnt, item) => cnt + item.quantity, 0)}
            </span>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1.5 text-[#80756d] hover:text-[#1c1b1b] rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Order State */}
        {orderConfirmed ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 bg-[#4d6453]/15 text-[#4d6453] rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold">
                {language === 'en' ? 'Ritual Order Placed' : '訂單已確認成立'}
              </span>
              <h3 className="text-2xl font-serif text-[#1c1b1b]">
                {language === 'en' ? 'Crafting in Progress' : '茶師精心慢萃中'}
              </h3>
              <p className="text-xs text-[#80756d] font-mono">
                Order ID: <span className="font-bold text-[#322214]">{orderId}</span>
              </p>
            </div>

            <div className="p-4 bg-[#f2ede4] w-full text-left rounded-sm text-xs space-y-2 border border-[#d2c4bb]/40">
              <div className="flex justify-between text-[#80756d]">
                <span>{language === 'en' ? 'Service Method' : '取茶方式'}:</span>
                <span className="font-semibold text-[#1c1b1b]">
                  {orderType === 'pickup' ? 'Boutique Pickup (Da\'an Flagship)' : 'Temperature-Controlled Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-[#80756d]">
                <span>{language === 'en' ? 'Estimated Prep Time' : '預估製作時間'}:</span>
                <span className="font-semibold text-[#4d6453]">15 - 20 min</span>
              </div>
              <div className="flex justify-between text-[#80756d] pt-2 border-t border-[#d2c4bb]/30 font-semibold text-[#1c1b1b]">
                <span>{language === 'en' ? 'Total Charged' : '結帳總額'}:</span>
                <span className="font-mono text-[#c5a059]">NT$ {grandTotal}</span>
              </div>
            </div>

            <p className="text-xs text-[#4e453e] font-light leading-relaxed">
              {language === 'en'
                ? 'A digital receipt and live brewing progress link has been dispatched. We look forward to offering you a serene pause.'
                : '電子取餐明細已發送。我們將依循正統茶道萃取工法，為您呈現最純粹的高山茶香。'}
            </p>

            <button
              onClick={handleFinishOrder}
              className="w-full bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors py-3.5 rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer"
            >
              {language === 'en' ? 'Back to Collection' : '返回茶品首頁'}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <ShoppingBag className="w-12 h-12 text-[#d2c4bb]" />
                  <p className="text-base font-serif text-[#1c1b1b]">
                    {language === 'en' ? 'Your Bag is Empty' : '訂單袋目前尚無茶品'}
                  </p>
                  <p className="text-xs text-[#80756d] max-w-xs font-light">
                    {language === 'en'
                      ? 'Select from our single-origin cold brews or artisanal milk teas to begin.'
                      : '請由菜單挑選您喜愛的單品冷萃或鍋煮茶品。'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Fulfillment Mode Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#f2ede4] rounded-sm mb-4">
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-[#322214] text-[#fcf9f8] shadow-xs'
                          : 'text-[#4e453e] hover:text-[#1c1b1b]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{language === 'en' ? 'Da\'an Pickup' : '大安茶室自取'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-[#322214] text-[#fcf9f8] shadow-xs'
                          : 'text-[#4e453e] hover:text-[#1c1b1b]'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{language === 'en' ? 'Cold-Chain Delivery' : '冷鏈專車外送'}</span>
                    </button>
                  </div>

                  {/* Free Delivery Bar */}
                  {orderType === 'delivery' && (
                    <div className="bg-[#f0eded] p-3 rounded-sm text-xs space-y-1.5 border border-[#d2c4bb]/40">
                      <div className="flex justify-between text-[11px] font-semibold text-[#322214]">
                        <span>{subtotal >= 800 ? 'Free Delivery Unlocked' : `Add NT$ ${800 - subtotal} for Free Delivery`}</span>
                        <span className="font-mono">{Math.min(100, Math.round((subtotal / 800) * 100))}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#d2c4bb] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4d6453] transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / 800) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-4 divide-y divide-[#d2c4bb]/40">
                    {cart.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                        <div className="w-16 h-20 bg-[#f0eded] shrink-0 overflow-hidden rounded-xs">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-serif text-[#1c1b1b] leading-tight">
                              {language === 'en' ? item.product.name : item.product.nameZh}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#80756d] hover:text-[#ba1a1a] p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-[#4d6453] font-medium">
                            {item.customization.size}
                          </p>

                          <div className="text-[10px] text-[#80756d] space-y-0.5">
                            <p>• {item.customization.ice} / {item.customization.sweetness}</p>
                            {item.customization.milk !== 'Classic Pure Tea (No Milk)' && (
                              <p>• {item.customization.milk}</p>
                            )}
                            {item.customization.toppings.length > 0 && (
                              <p>• + {item.customization.toppings.join(', ')}</p>
                            )}
                            {item.customization.specialNotes && (
                              <p className="italic text-[#322214]">Note: "{item.customization.specialNotes}"</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity */}
                            <div className="flex items-center border border-[#d2c4bb] rounded-sm bg-white">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-[#4e453e] hover:text-[#1c1b1b] cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-[#1c1b1b]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="px-2 py-0.5 text-[#4e453e] hover:text-[#1c1b1b] cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-mono text-sm font-bold text-[#1c1b1b]">
                              NT$ {item.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gift Note Section */}
                  <div className="pt-4 border-t border-[#d2c4bb]/40">
                    <button
                      type="button"
                      onClick={() => setIsGiftNote(!isGiftNote)}
                      className="flex items-center gap-2 text-xs font-semibold text-[#322214] hover:text-[#4d6453] cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-[#c5a059]" />
                      <span>{language === 'en' ? 'Add Calligraphy Gift Card' : '附贈手寫茶席祝福卡'}</span>
                    </button>

                    {isGiftNote && (
                      <div className="mt-2 animate-fadeIn">
                        <textarea
                          rows={2}
                          value={giftNoteMessage}
                          onChange={(e) => setGiftNoteMessage(e.target.value)}
                          placeholder={language === 'en' ? 'Enter gift message to be hand-penned on washi card...' : '請輸入欲由侍茶師親筆題寫的和紙卡片內文...'}
                          className="w-full p-2 text-xs bg-white border border-[#d2c4bb] rounded-sm focus:border-[#c5a059] focus:outline-none"
                        ></textarea>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer with Calculations */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#f2ede4] border-t border-[#d2c4bb]/40 space-y-4">
                <div className="space-y-1.5 text-xs text-[#4e453e]">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Subtotal' : '商品小計'}</span>
                    <span className="font-mono text-[#1c1b1b]">NT$ {subtotal}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Cold-Chain Shipping' : '低溫冷鏈運費'}</span>
                      <span className="font-mono text-[#1c1b1b]">
                        {deliveryFee === 0 ? <span className="text-[#4d6453]">FREE</span> : `NT$ ${deliveryFee}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold text-[#1c1b1b] pt-2 border-t border-[#d2c4bb]/30">
                    <span className="font-serif">{language === 'en' ? 'Total' : '應付總額'}</span>
                    <span className="font-mono text-[#322214] font-bold">NT$ {grandTotal}</span>
                  </div>
                </div>

                <button
                  id="checkout-order-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors py-3.5 rounded-sm text-[12px] font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <span className="animate-pulse">{language === 'en' ? 'Securing Ritual...' : '建立訂單中...'}</span>
                  ) : (
                    <>
                      <span>{language === 'en' ? 'Proceed to Order' : '確認送出訂單'}</span>
                      <ArrowRight className="w-4 h-4 text-[#c5a059]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
