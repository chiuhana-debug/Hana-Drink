import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Send, RotateCcw, Bot, User, ArrowRight, 
  Plus, Check, Flame, Award, SlidersHorizontal, MessageSquareText, 
  Compass, Loader2, HeartHandshake, Coffee
} from 'lucide-react';
import { TeaProduct, CustomizationState } from '../types';
import { getClientSommelierRecommendation } from '../data/sommelierFallback';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedProductIds?: string[];
  suggestedCustomization?: {
    ice?: string;
    sweetness?: string;
    milk?: string;
    topping?: string;
  };
  timestamp: number;
}

interface AiSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: TeaProduct[];
  onSelectProduct: (product: TeaProduct) => void;
  onCustomize: (product: TeaProduct, initialCustomization?: Partial<CustomizationState>) => void;
  onQuickAdd: (product: TeaProduct) => void;
  language: 'en' | 'zh';
}

export const AiSommelierModal: React.FC<AiSommelierModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onCustomize,
  onQuickAdd,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedToastId, setAddedToastId] = useState<string | null>(null);

  // Quick Taste Prompt Suggestions
  const promptSuggestions = language === 'en' ? [
    { title: '🌸 Refreshing & Floral Cold Drip', prompt: 'I want a refreshing cold drip tea with elegant floral and mint notes.' },
    { title: '🥛 Rich Creamy Milk Tea', prompt: 'Recommend a deep, full-bodied artisanal milk tea with smooth creaminess.' },
    { title: '🌙 Zero Caffeine & Relaxing', prompt: 'Looking for a caffeine-free, warm soothing tea for evening relaxation.' },
    { title: '🍵 Ceremonial Uji Matcha', prompt: 'I love stone-ground matcha with rich umami and gentle sweetness.' },
    { title: '🍑 Charcoal Baked & Fruity', prompt: 'I want something with deep charcoal roast aroma balanced with juicy fruitiness.' },
    { title: '🏆 First Time Signature Choice', prompt: 'It is my first time visiting Hana Drink. What is the top signature recommendation?' },
  ] : [
    { title: '🌸 清新花香冷萃', prompt: '我想喝清爽、帶有幽雅花香與微涼薄荷尾韻的冷滴茶。' },
    { title: '🥛 濃郁厚乳茶感', prompt: '請推薦茶感醇厚、奶香絲滑濃郁的手作厚乳茶。' },
    { title: '🌙 晚間舒心無咖啡因', prompt: '想找一杯適合夜間放鬆、完全無咖啡因的溫潤茶品。' },
    { title: '🍵 極上初摘手打抹茶', prompt: '想喝日本京都和束町初摘、帶有濃郁海苔旨味的現刷抹茶歐蕾。' },
    { title: '🍑 炭焙焙火伴果香', prompt: '喜歡厚實的龍眼木炭焙香氣，但又希望有甜潤果香層次。' },
    { title: '🏆 首次品飲招牌推薦', prompt: '這是我第一次來 Hana，請為我推薦最能代表花飲茶舍工藝的招牌茶款。' },
  ];

  // Initial Welcome Message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: language === 'en' 
        ? 'Welcome to Hana Drink. I am your personal AI Tea Sommelier. Tell me about your current mood, flavor preferences (e.g., ethereal floral, charcoal roasted, silky milk tea, zero caffeine), or what you are pairing with, and I will tailor the perfect single-origin ritual for you.'
        : '您好，歡迎蒞臨 HANA 花飲茶舍。我是您的專屬 AI 侍茶師。\n\n請告訴我您此刻的心境、想品嚐的香氣風味（如：幽雅花香、深層炭焙、濃郁厚乳茶、夜間無咖啡因），或是想搭配的心情與時刻，我將為您量身調配最契合的莊園茶飲。',
      recommendedProductIds: ['hana-ruby-18', 'hana-uji-matcha'],
      timestamp: Date.now(),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [isOpen, messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/sommelier/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendation');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || (language === 'en' ? 'Here is my curated recommendation for your ritual.' : '已為您精心挑選契合的茶飲。'),
        recommendedProductIds: data.recommendedProductIds || [],
        suggestedCustomization: data.suggestedCustomization,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('AI API endpoint not reached or static environment, switching to smart local sommelier:', err);
      const fallbackData = getClientSommelierRecommendation(text, language);
      const fallbackMsg: Message = {
        id: `ai-rec-${Date.now()}`,
        role: 'assistant',
        content: fallbackData.reply,
        recommendedProductIds: fallbackData.recommendedProductIds,
        suggestedCustomization: fallbackData.suggestedCustomization,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: language === 'en' 
          ? 'I have cleared our conversation. How can I assist your tea selection today?'
          : '對話紀錄已重置。請問此刻有什麼樣的風味或身心狀態想讓我為您尋味？',
        timestamp: Date.now(),
      }
    ]);
  };

  const handleQuickAddFeedback = (product: TeaProduct) => {
    onQuickAdd(product);
    setAddedToastId(product.id);
    setTimeout(() => {
      setAddedToastId(null);
    }, 2000);
  };

  // Find tea products from IDs
  const getProductsByIds = (ids?: string[]) => {
    if (!ids || ids.length === 0) return [];
    return ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as TeaProduct[];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1b1b]/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        id="ai-sommelier-modal-content"
        className="relative bg-[#fcf9f8] w-full max-w-3xl h-[90vh] max-h-[780px] flex flex-col shadow-2xl rounded-sm border border-[#c5a059]/40 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-[#f2ede4] px-5 py-4 border-b border-[#d2c4bb]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#322214] flex items-center justify-center text-[#c5a059] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-semibold text-[#1c1b1b]">
                  {language === 'en' ? 'Hana AI Tea Sommelier' : 'Hana 智能侍茶師 · 專屬尋味'}
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#4d6453] text-[#ffffff] px-2 py-0.5 rounded-xs tracking-wider">
                  AI Agent Live
                </span>
              </div>
              <p className="text-xs text-[#80756d]">
                {language === 'en' 
                  ? 'Intelligent flavor pairing & personalized tea ritual consultations.' 
                  : '依據您的口感偏好、時刻與心境，調配專屬現萃茶方。'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="reset-sommelier-chat-btn"
              onClick={handleResetChat}
              title={language === 'en' ? 'Reset Conversation' : '重新對話'}
              className="p-2 text-[#80756d] hover:text-[#1c1b1b] hover:bg-[#e8e2d8] rounded-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="close-ai-sommelier-modal-btn"
              onClick={onClose}
              className="p-2 text-[#80756d] hover:text-[#1c1b1b] hover:bg-[#e8e2d8] rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#fcf9f8]/80">
          {/* Quick Prompt Pill Carousel */}
          <div className="space-y-2 pb-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#80756d]">
              {language === 'en' ? 'Quick Taste Inquiries' : '靈感提問 · 點擊尋味'}
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {promptSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="shrink-0 text-xs px-3.5 py-1.5 rounded-xs border border-[#d2c4bb] bg-[#ffffff] hover:border-[#4d6453] hover:bg-[#f2ede4] text-[#4e453e] hover:text-[#1c1b1b] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const recProducts = getProductsByIds(msg.recommendedProductIds);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xs bg-[#322214] text-[#c5a059] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[80%] space-y-3`}>
                    {/* Text Bubble */}
                    <div
                      className={`p-4 rounded-sm text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                        isUser
                          ? 'bg-[#322214] text-[#fcf9f8] rounded-tr-none'
                          : 'bg-[#f2ede4] text-[#1c1b1b] border border-[#d2c4bb]/60 rounded-tl-none'
                      }`}
                    >
                      {msg.content}

                      {/* Suggested Recipe Note if provided */}
                      {!isUser && msg.suggestedCustomization && (
                        <div className="mt-3 pt-3 border-t border-[#d2c4bb]/50 text-xs font-mono text-[#4d6453] space-y-1">
                          <p className="font-sans font-semibold text-[#322214]">
                            {language === 'en' ? '✨ Sommelier Recipe Pairing:' : '✨ 侍茶師推薦客製黃金比例：'}
                          </p>
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            {msg.suggestedCustomization.ice && (
                              <span className="bg-[#ffffff] px-2 py-0.5 rounded-xs border border-[#d2c4bb]">
                                🧊 {msg.suggestedCustomization.ice}
                              </span>
                            )}
                            {msg.suggestedCustomization.sweetness && (
                              <span className="bg-[#ffffff] px-2 py-0.5 rounded-xs border border-[#d2c4bb]">
                                🍯 {msg.suggestedCustomization.sweetness}
                              </span>
                            )}
                            {msg.suggestedCustomization.milk && (
                              <span className="bg-[#ffffff] px-2 py-0.5 rounded-xs border border-[#d2c4bb]">
                                🥛 {msg.suggestedCustomization.milk}
                              </span>
                            )}
                            {msg.suggestedCustomization.topping && (
                              <span className="bg-[#ffffff] px-2 py-0.5 rounded-xs border border-[#d2c4bb]">
                                🌸 {msg.suggestedCustomization.topping}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Recommended Drink Cards */}
                    {!isUser && recProducts.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {recProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-[#ffffff] rounded-sm border border-[#d2c4bb] p-3.5 space-y-3 shadow-sm hover:border-[#c5a059] transition-all"
                          >
                            <div className="flex gap-3">
                              <div className="w-16 h-20 bg-[#f2ede4] overflow-hidden rounded-xs shrink-0 relative">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {product.accentNote && (
                                  <span className="absolute top-1 left-1 bg-[#322214] text-[#c5a059] text-[8px] font-bold px-1 py-0.5 rounded-xs">
                                    {product.accentNote}
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <span className="text-[9px] uppercase tracking-wider text-[#4d6453] font-semibold">
                                  {product.originEstate}
                                </span>
                                <h4 className="text-xs font-serif font-bold text-[#1c1b1b] truncate">
                                  {language === 'en' ? product.name : product.nameZh}
                                </h4>
                                <p className="text-[10px] text-[#80756d] line-clamp-1 font-light">
                                  {product.tastingNotes.join(' · ')}
                                </p>
                                <p className="font-mono text-xs font-bold text-[#322214]">
                                  NT$ {product.price}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-1 border-t border-[#f2ede4]">
                              <button
                                onClick={() => {
                                  onClose();
                                  onSelectProduct(product);
                                }}
                                className="flex-1 bg-[#f2ede4] hover:bg-[#e5dfd3] text-[#322214] text-[10px] font-semibold py-1.5 px-2 rounded-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                              >
                                {language === 'en' ? 'Details' : '查看細節'}
                              </button>

                              <button
                                onClick={() => {
                                  onClose();
                                  onCustomize(product);
                                }}
                                className="flex-1 bg-[#322214] hover:bg-[#4a3728] text-[#fcf9f8] text-[10px] font-semibold py-1.5 px-2 rounded-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                              >
                                {language === 'en' ? 'Customize' : '客製訂購'}
                              </button>

                              <button
                                onClick={() => handleQuickAddFeedback(product)}
                                title={language === 'en' ? 'Quick Add to Bag' : '快速加購'}
                                className="p-1.5 bg-[#4d6453] hover:bg-[#394d3e] text-[#ffffff] rounded-xs transition-colors cursor-pointer"
                              >
                                {addedToastId === product.id ? (
                                  <Check className="w-3.5 h-3.5 text-[#c5a059]" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xs bg-[#f2ede4] border border-[#d2c4bb] text-[#322214] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fadeIn">
                <div className="w-8 h-8 rounded-xs bg-[#322214] text-[#c5a059] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#f2ede4] text-[#1c1b1b] border border-[#d2c4bb]/60 rounded-sm rounded-tl-none p-4 shadow-xs flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-[#4d6453] animate-spin" />
                  <span className="text-xs text-[#80756d] font-mono">
                    {language === 'en' 
                      ? 'Sommelier is analyzing flavor notes & brewing parameters...' 
                      : '侍茶師正在調配香氣光譜與專屬茶方...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#f2ede4] border-t border-[#d2c4bb]/50 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[#ffffff] rounded-xs border border-[#d2c4bb] px-3.5 py-1.5 focus-within:border-[#322214] focus-within:ring-1 focus-within:ring-[#322214] transition-all"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Ask Sommelier: e.g. "I want a fragrant cold drip with zero bitterness..."'
                  : '詢問侍茶師：例如「想喝有深焙炭火香、微甜且加鮮奶的茶飲...」'
              }
              className="flex-1 bg-transparent py-2 text-xs sm:text-sm text-[#1c1b1b] placeholder:text-[#80756d] focus:outline-none"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2 rounded-xs bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-[#c5a059]" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-[#80756d] px-1 pt-2 font-mono">
            <span>Powered by Gemini 3.7 AI Tea Knowledge Base</span>
            <span>Hana Da'an Flagship Estate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
