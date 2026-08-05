import React, { useState } from 'react';
import { Play, Flame, Trophy, Globe, ShieldAlert, Sparkles, Crosshair, Volume2, Info, ChevronRight, Layers, Target, Award, Lock, ShoppingBag } from 'lucide-react';
import { GameMode, Difficulty, Language } from '../types';
import { ProgressionData } from '../utils/progression';
import { AchievementsModal } from './AchievementsModal';
import { ShopModal } from './ShopModal';
import { InteractiveMascot } from './InteractiveMascot';
import { soundManager } from '../audio/soundManager';

interface StartMenuProps {
  highScore: number;
  progression: ProgressionData;
  language: Language;
  onStart: (mode: GameMode, diff: Difficulty, startLevel?: number) => void;
  onToggleLanguage: () => void;
  onUpdateProgression?: (updated: ProgressionData) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  highScore,
  progression,
  language,
  onStart,
  onToggleLanguage,
  onUpdateProgression,
}) => {
  const isAr = language === 'ar';
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>('medium');
  const [activeStage, setActiveStage] = useState<number>(1); // 1, 2, 3, 4
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [showLevelPicker, setShowLevelPicker] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);

  const maxUnlocked = progression.maxUnlockedLevel;

  const stages = [
    {
      id: 1,
      titleAr: 'مزرعة الطيور الداجنة',
      titleEn: 'Farmyard Birds',
      icon: '🐔',
      range: '1 - 25',
      typesAr: 'دجاج، دجاج ذهبي، ديك عملاق، بط بري',
      typesEn: 'Chickens, Golden, Rooster, Mallard Duck',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
    },
    {
      id: 2,
      titleAr: 'غابة الطيور البرية',
      titleEn: 'Wild Forest Birds',
      icon: '🦆',
      range: '26 - 50',
      typesAr: 'بط بري، حمام، دراج ملون، عقاب',
      typesEn: 'Duck, Pigeon, Pheasant, Eagle',
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/40 text-teal-300',
    },
    {
      id: 3,
      titleAr: 'محمية الطرائد البرية',
      titleEn: 'Wild Safari Animals',
      icon: '🦊',
      range: '51 - 75',
      typesAr: 'أرنب بري، ثعلب أحمر، غزال بري',
      typesEn: 'Rabbit, Red Fox, Forest Stag Deer',
      color: 'from-orange-500/20 to-amber-600/10 border-orange-500/40 text-orange-300',
    },
    {
      id: 4,
      titleAr: 'الصيد الأسطوري الشامل',
      titleEn: 'Legendary Masters Hunt',
      icon: '🦅',
      range: '76 - 100',
      typesAr: 'صقر أسطوري، غزال، ثعلب، عقاب ذهبي',
      typesEn: 'Golden Falcon, Deer, Fox, Eagle',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-300',
    },
  ];

  const handleStageSelect = (stageId: number) => {
    setActiveStage(stageId);
    const firstLevelOfStage = (stageId - 1) * 25 + 1;
    // Auto-select first playable unlocked level in this stage, or maxUnlocked
    if (firstLevelOfStage <= maxUnlocked) {
      setSelectedLevel(firstLevelOfStage);
    } else {
      setSelectedLevel(maxUnlocked);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl select-none overflow-y-auto pt-[env(safe-area-inset-top,1rem)] pb-[env(safe-area-inset-bottom,1rem)]">
      <div className="max-w-md w-full bg-slate-900/95 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl text-white my-auto max-h-[94dvh] flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-400 font-bold text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="font-mono text-xs">
              {isAr ? 'القياسي:' : 'Best:'} {highScore}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              onClick={() => setShowShop(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/40 transition-all active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'المتجر 🛒' : 'Shop'}</span>
            </button>

            <button
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-[11px] border border-amber-500/40 transition-all active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'الإنجازات' : 'Badges'}</span>
            </button>

            <button
              onClick={() => soundManager.playDajajVoice()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] transition-transform active:scale-95 shadow-md border border-amber-400/40"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'ضجااااج!' : 'Dajaaaj!'}</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="text-center my-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-[10px] uppercase mb-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{isAr ? `أعلى مستوى مفتوح: #${maxUnlocked}` : `Unlocked Levels: #${maxUnlocked}`}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-md">
            {isAr ? 'صيد الطيور والحيوانات 3D' : '3D Safari & Bird Hunt'}
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed px-1">
            {isAr
              ? '100 مرحلة صيد احترافية (25 مرحلة لكل مجموعة) مع حفظ المستويات والإنجازات!'
              : '100 3D levels with level progression and persistent achievements!'}
          </p>
        </div>

        {/* Interactive "Dajaaaj!" Chicken Mascot Landing Hero */}
        <InteractiveMascot isAr={isAr} />

        {/* Difficulty Selector */}
        <div className="my-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 text-center">
            {isAr ? 'مستوى الصعوبة:' : 'Difficulty:'}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiff(d)}
                className={`py-1.5 px-2 rounded-xl font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center ${
                  selectedDiff === d
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md border border-amber-300'
                    : 'bg-slate-800/90 text-slate-300 border border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                {d === 'easy' ? (isAr ? 'سهل' : 'Easy') : d === 'medium' ? (isAr ? 'متوسط' : 'Medium') : (isAr ? 'صعب' : 'Hard')}
              </button>
            ))}
          </div>
        </div>

        {/* 100 Levels Stage Selection Tabs (4 Sets of 25) */}
        <div className="my-1.5 bg-slate-950/70 p-2 rounded-2xl border border-amber-500/25">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'اختر المرحلة (4 مجموعات / 100 مستوى):' : 'Select Stage (4 Sets / 100 Levels):'}</span>
            </span>
            <button
              onClick={() => setShowLevelPicker(!showLevelPicker)}
              className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <span>{showLevelPicker ? (isAr ? 'إخفاء الشبكة' : 'Hide Grid') : (isAr ? 'شبكة المستويات' : 'Level Grid')}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {stages.map((st) => {
              const isActive = activeStage === st.id;
              const stageStartLevel = (st.id - 1) * 25 + 1;
              const isStageUnlocked = maxUnlocked >= stageStartLevel;

              return (
                <button
                  key={st.id}
                  onClick={() => handleStageSelect(st.id)}
                  className={`p-2 rounded-xl text-right transition-all flex items-start gap-2 border ${
                    isActive
                      ? `bg-gradient-to-r ${st.color} border-amber-400 scale-[1.02] shadow-md`
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80'
                  } ${!isStageUnlocked ? 'opacity-70' : ''}`}
                >
                  <span className="text-xl leading-none mt-0.5">{st.icon}</span>
                  <div className="overflow-hidden flex-1">
                    <div className="font-extrabold text-xs text-amber-200 truncate flex items-center justify-between gap-1">
                      <span>{isAr ? st.titleAr : st.titleEn}</span>
                      {!isStageUnlocked && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-400">
                      {isAr ? `المراحل ${st.range}` : `Levels ${st.range}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Grid Selector for Active Stage (25 Levels) */}
          {showLevelPicker && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 mb-1.5 px-0.5 flex justify-between items-center">
                <span>{isAr ? `المستويات (25 مستوى في هذه المجموعة):` : `Levels for Stage ${activeStage}:`}</span>
                <span className="text-amber-400 font-mono font-bold">{isAr ? `المستوى المحدد: #${selectedLevel}` : `Selected: #${selectedLevel}`}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto custom-scrollbar p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                {Array.from({ length: 25 }, (_, i) => {
                  const levelNum = (activeStage - 1) * 25 + (i + 1);
                  const isUnlocked = levelNum <= maxUnlocked;
                  const isSelected = selectedLevel === levelNum;

                  return (
                    <button
                      key={levelNum}
                      disabled={!isUnlocked}
                      onClick={() => setSelectedLevel(levelNum)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all flex items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md ring-2 ring-amber-300'
                          : isUnlocked
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                          : 'bg-slate-950/80 text-slate-600 border border-slate-900 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span>#{levelNum}</span>
                      {!isUnlocked && <Lock className="w-2.5 h-2.5 text-slate-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 my-2">
          <button
            onClick={() => onStart('campaign', selectedDiff, selectedLevel)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition-transform active:scale-95 border border-amber-300 min-h-[50px]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isAr ? `بدء الصيد (المستوى #${selectedLevel})` : `Start Hunt (Level #${selectedLevel})`}</span>
          </button>

          <button
            onClick={() => onStart('endless', selectedDiff, 1)}
            className="w-full py-2.5 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-md transition-transform active:scale-95 min-h-[44px]"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{isAr ? 'نمط البقاء اللانهائي' : 'Endless Survival Mode'}</span>
          </button>
        </div>

        {/* Target Guide Legend */}
        <div className="mt-1 pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'دليل الطرائد والحيوانات' : 'Hunt Targets Guide'}</span>
            </span>
            <span className="text-amber-400 text-xs">{showGuide ? '▲' : '▼'}</span>
          </button>

          {showGuide && (
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] max-h-36 overflow-y-auto custom-scrollbar p-1">
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-orange-500/20">
                <div className="font-bold text-slate-200">🐔 {isAr ? 'دجاجة عادية' : 'Chicken'}</div>
                <div className="text-slate-400">+10 pts</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-amber-500/30">
                <div className="font-bold text-amber-300">✨ {isAr ? 'دجاجة ذهبية' : 'Golden Chicken'}</div>
                <div className="text-slate-400">+30 pts</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-teal-500/30">
                <div className="font-bold text-teal-300">🦆 {isAr ? 'بطة برية' : 'Mallard Duck'}</div>
                <div className="text-slate-400">+25 pts</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-sky-500/30">
                <div className="font-bold text-sky-300">🕊️ {isAr ? 'حمام بري' : 'Wild Pigeon'}</div>
                <div className="text-slate-400">+35 pts (سريع)</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-rose-500/30">
                <div className="font-bold text-rose-300">🪶 {isAr ? 'طائر الدراج' : 'Pheasant'}</div>
                <div className="text-slate-400">+45 pts</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-amber-600/30">
                <div className="font-bold text-amber-400">🦃 {isAr ? 'ديك رومي' : 'Wild Turkey'}</div>
                <div className="text-slate-400">+50 pts (ضربتان)</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-emerald-500/30">
                <div className="font-bold text-emerald-300">🐰 {isAr ? 'أرنب بري' : 'Bunny Rabbit'}</div>
                <div className="text-slate-400">+30 pts (متعرج)</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-orange-500/30">
                <div className="font-bold text-orange-400">🦊 {isAr ? 'ثعلب أحمر' : 'Red Fox'}</div>
                <div className="text-slate-400">+55 pts (سريع)</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-amber-700/30">
                <div className="font-bold text-amber-200">🦌 {isAr ? 'غزال بري' : 'Stag Deer'}</div>
                <div className="text-slate-400">+75 pts (3 ضربات)</div>
              </div>
              <div className="bg-slate-800/60 p-1.5 rounded-xl border border-purple-500/30">
                <div className="font-bold text-purple-300">🦅 {isAr ? 'صقر أسطوري' : 'Golden Falcon'}</div>
                <div className="text-amber-300 font-bold">+100 pts (ملك الصيد)</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          progression={progression}
          language={language}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Hunter's Arsenal Shop Modal */}
      {showShop && (
        <ShopModal
          progression={progression}
          language={language}
          onClose={() => setShowShop(false)}
          onUpdateProgression={onUpdateProgression}
        />
      )}
    </div>
  );
};
