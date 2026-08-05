import React, { useState } from 'react';
import { ShoppingBag, X, Check, Lock, Sparkles, Zap, Award, Crosshair, Shield } from 'lucide-react';
import { Language } from '../types';
import { ProgressionData, SHOP_ITEMS, ShopItem, buyShopItem, equipShopItem } from '../utils/progression';
import { soundManager } from '../audio/soundManager';

interface ShopModalProps {
  progression: ProgressionData;
  language: Language;
  onUpdateProgression: (updated: ProgressionData) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  progression,
  language,
  onUpdateProgression,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [activeCategory, setActiveCategory] = useState<'weapon' | 'laser' | 'perk'>('weapon');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const filteredItems = SHOP_ITEMS.filter((i) => i.category === activeCategory);

  const handleBuy = (item: ShopItem) => {
    const res = buyShopItem(progression, item.id);
    if (res.success) {
      soundManager.playCatch(); // Buy sound
      setFeedbackMsg({ text: res.messageAr, isError: false });
      onUpdateProgression(res.updatedData);
    } else {
      soundManager.playMiss();
      setFeedbackMsg({ text: res.messageAr, isError: true });
    }

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  const handleEquip = (itemId: string) => {
    const updated = equipShopItem(progression, itemId);
    soundManager.playCatch();
    onUpdateProgression(updated);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white flex flex-col max-h-[92dvh] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-2xl border border-amber-500/40 shadow-inner">
              <ShoppingBag className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                {isAr ? 'متجر الأسلحة والعدسات' : 'Weapon & Tactical Store'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'اشترِ بنادق قنص، مؤشرات ليزر، ومضاعفات النقاط بالنقاط المكتسبة' : 'Upgrade your arsenal with points!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Points Balance Bar */}
        <div className="my-3 p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">{isAr ? 'رصيدك الحالي من النقاط:' : 'Your Total Points:'}</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-black text-amber-300 text-lg bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
            <span>{progression.totalScore.toLocaleString()}</span>
            <span className="text-xs font-sans text-amber-400">{isAr ? 'نقطة' : 'pts'}</span>
          </div>
        </div>

        {/* Feedback Message Notification */}
        {feedbackMsg && (
          <div
            className={`mb-3 p-2.5 rounded-xl text-xs font-black text-center animate-in fade-in slide-in-from-top-2 border ${
              feedbackMsg.isError
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-3">
          <button
            onClick={() => setActiveCategory('weapon')}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeCategory === 'weapon'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md border border-amber-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="text-base">🔫</span>
            <span>{isAr ? 'البنادق' : 'Rifles'}</span>
          </button>

          <button
            onClick={() => setActiveCategory('laser')}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeCategory === 'laser'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md border border-amber-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>{isAr ? 'الليزر والعدسات' : 'Laser Sights'}</span>
          </button>

          <button
            onClick={() => setActiveCategory('perk')}
            className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeCategory === 'perk'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md border border-amber-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isAr ? 'التعزيزات والقدرات' : 'Perks & Buffs'}</span>
          </button>
        </div>

        {/* Items Grid */}
        <div className="space-y-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {filteredItems.map((item) => {
            const isUnlocked = progression.unlockedItems.includes(item.id);
            const isEquipped =
              (item.category === 'weapon' && progression.equippedWeapon === item.id) ||
              (item.category === 'laser' && progression.equippedLaser === item.id);
            const canAfford = progression.totalScore >= item.price;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  isEquipped
                    ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-slate-900 border-amber-400 shadow-lg ring-1 ring-amber-400/50'
                    : isUnlocked
                    ? 'bg-slate-800/90 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400'
                }`}
              >
                {/* Icon Badge */}
                <div className={`p-3 rounded-2xl text-2xl border bg-gradient-to-br ${item.colorBadge} shadow-inner shrink-0`}>
                  {item.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-slate-100 truncate">
                      {isAr ? item.titleAr : item.titleEn}
                    </h3>
                    {isEquipped && (
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/25 border border-amber-400/50 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3 text-amber-400" />
                        <span>{isAr ? 'مُجهز الآن' : 'Equipped'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    {isAr ? item.descriptionAr : item.descriptionEn}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {!isUnlocked ? (
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{item.price > 0 ? `${item.price.toLocaleString()} ${isAr ? 'نقطة' : 'pts'}` : (isAr ? 'مجاني' : 'Free')}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        {isAr ? 'مملكوك لك' : 'Purchased'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0">
                  {!isUnlocked ? (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`py-2 px-3.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border border-amber-300 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>{isAr ? 'شراء' : 'Buy'}</span>
                    </button>
                  ) : isEquipped ? (
                    <div className="py-2 px-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold text-center">
                      ✓
                    </div>
                  ) : item.category === 'perk' ? (
                    <div className="py-1.5 px-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-extrabold">
                      {isAr ? 'نشط دائماً' : 'Active'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEquip(item.id)}
                      className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs transition-all active:scale-95"
                    >
                      {isAr ? 'تجهيز' : 'Equip'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
        >
          {isAr ? 'العودة' : 'Back'}
        </button>

      </div>
    </div>
  );
};
