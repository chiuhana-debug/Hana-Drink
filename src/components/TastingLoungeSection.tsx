import React, { useState } from 'react';
import { Calendar, Users, Clock, Sparkles, CheckCircle2, MapPin } from 'lucide-react';
import { ReservationDetails } from '../types';

interface TastingLoungeSectionProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'zh';
}

export const TastingLoungeSection: React.FC<TastingLoungeSectionProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [formData, setFormData] = useState<ReservationDetails>({
    name: '',
    phone: '',
    email: '',
    date: '2026-08-25',
    time: '14:30',
    guests: 2,
    tier: 'Signature Tea Flight',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingCode(`HANA-RSV-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1b1b]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        id="tasting-lounge-modal"
        className="relative bg-[#fcf9f8] w-full max-w-2xl overflow-hidden shadow-2xl rounded-sm border border-[#c5a059]/30 my-8"
      >
        {/* Header */}
        <div className="bg-[#322214] text-[#fcf9f8] p-6 sm:p-8 space-y-2 relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Private Tea Salon Reservation' : '大安旗艦店 · 專屬茶席預約'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif">
            {language === 'en' ? 'The Hana Tasting Lounge' : '沉浸式侍茶品鑑預約'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg">
            {language === 'en'
              ? 'An intimate 90-minute tea ritual guided by our master sommelier with seasonal Japanese wagashi pairings.'
              : '由資深侍茶師親自司茶，九十分鐘引領品飲三款單一莊園冷萃與鍋煮茗茶，佐以每日限量手作和菓子。'}
          </p>

          <button
            id="close-lounge-modal-btn"
            onClick={onClose}
            className="absolute top-6 right-6 text-stone-300 hover:text-white p-1.5 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-[#4d6453]/15 text-[#4d6453] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold">
                  {language === 'en' ? 'Reservation Confirmed' : '預約已確認'}
                </span>
                <h3 className="text-2xl font-serif text-[#1c1b1b]">
                  {language === 'en' ? 'We Await Your Presence' : '靜候您的蒞臨'}
                </h3>
                <p className="text-xs text-[#80756d] font-mono">
                  Reservation Reference: <span className="font-bold text-[#322214]">{bookingCode}</span>
                </p>
              </div>

              <div className="bg-[#f2ede4] p-4 text-xs rounded-sm text-left max-w-md mx-auto space-y-2 border border-[#d2c4bb]/40">
                <div className="flex justify-between">
                  <span className="text-[#80756d]">{language === 'en' ? 'Guest Name' : '貴賓姓名'}:</span>
                  <span className="font-semibold text-[#1c1b1b]">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756d]">{language === 'en' ? 'Date & Time' : '預約時段'}:</span>
                  <span className="font-semibold text-[#1c1b1b]">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756d]">{language === 'en' ? 'Party Size' : '預約人數'}:</span>
                  <span className="font-semibold text-[#1c1b1b]">{formData.guests} {language === 'en' ? 'Guests' : '位'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756d]">{language === 'en' ? 'Tasting Flight' : '品飲套裝'}:</span>
                  <span className="font-semibold text-[#4d6453]">{formData.tier}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#d2c4bb]/30">
                  <span className="text-[#80756d]">{language === 'en' ? 'Location' : '門市地點'}:</span>
                  <span className="font-semibold text-[#1c1b1b]">No. 88, Sec. 1, Da'an Rd, Taipei</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-8 py-3 rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer"
              >
                {language === 'en' ? 'Done' : '完成'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tasting Flight Tier Selection */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
                  {language === 'en' ? '1. Select Tasting Flight Tier' : '1. 選擇品飲套裝'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'Signature Tea Flight', labelEn: 'Signature Flight', labelZh: '經典三款冷萃', price: 'NT$ 680' },
                    { id: 'Grand Sommelier Pairing', labelEn: 'Grand Pairing', labelZh: '莊園尊榮品鑑', price: 'NT$ 1,080' },
                    { id: 'Ceremonial Matcha & Wagashi', labelEn: 'Ceremonial Matcha', labelZh: '手打極上抹茶席', price: 'NT$ 880' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: t.id as any })}
                      className={`p-3 text-left rounded-sm border transition-all cursor-pointer ${
                        formData.tier === t.id
                          ? 'border-[#322214] bg-[#f2ede4] ring-1 ring-[#322214]'
                          : 'border-[#d2c4bb] bg-[#fcf9f8] hover:border-[#80756d]'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#1c1b1b]">{language === 'en' ? t.labelEn : t.labelZh}</p>
                      <p className="text-[11px] font-mono text-[#c5a059] font-bold mt-0.5">{t.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                    {language === 'en' ? 'Date' : '日期'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                    {language === 'en' ? 'Time Slot' : '時段'}
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                  >
                    <option value="11:30">11:30 - 13:00</option>
                    <option value="14:30">14:30 - 16:00</option>
                    <option value="16:30">16:30 - 18:00</option>
                    <option value="19:00">19:00 - 20:30</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#c5a059]" />
                    {language === 'en' ? 'Guests' : '人數'}
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? (language === 'en' ? 'Guest' : '位') : (language === 'en' ? 'Guests' : '位')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
                    {language === 'en' ? 'Guest Name' : '貴賓尊姓大名'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Chen"
                    className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
                    {language === 'en' ? 'Phone Number' : '聯絡電話'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+886 912 345 678"
                    className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
                  {language === 'en' ? 'Email Address' : '電子信箱'}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="eleanor@example.com"
                  className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-semibold text-[#322214] block">
                  {language === 'en' ? 'Dietary Notes or Special Occasions' : '飲食禁忌或慶祝備註'}
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={language === 'en' ? 'e.g. Vegetarian wagashi, anniversary celebration...' : '例如：全素和菓子、結婚週年慶祝...'}
                  className="w-full bg-[#fcf9f8] border border-[#d2c4bb] p-2 text-xs rounded-sm focus:border-[#c5a059] focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#d2c4bb]/40">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#80756d] hover:text-[#1c1b1b] uppercase font-semibold cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : '取消'}
                </button>

                <button
                  id="confirm-reservation-btn"
                  type="submit"
                  className="bg-[#322214] text-[#fcf9f8] hover:bg-[#4a3728] transition-colors px-8 py-3.5 rounded-sm text-xs font-semibold tracking-widest uppercase cursor-pointer shadow-md"
                >
                  {language === 'en' ? 'Confirm Reservation' : '送出茶席預約'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
