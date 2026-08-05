import React, { useState } from 'react';
import {
  Play,
  Flame,
  Trophy,
  ShoppingBag,
  Sparkles,
  Crosshair,
  Volume2,
  Globe,
  Award,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { Language } from '../types';
import { ProgressionData } from '../utils/progression';
import { soundManager } from '../audio/soundManager';
import { ShopModal } from './ShopModal';
import { AchievementsModal } from './AchievementsModal';

interface LandingPageProps {
  language: Language;
  progression: ProgressionData;
  onStartPlay: () => void;
  onOpenLevelPicker: () => void;
  onToggleLanguage: () => void;
  onUpdateProgression: (updated: ProgressionData) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  progression,
  onStartPlay,
  onOpenLevelPicker,
  onToggleLanguage,
  onUpdateProgression,
}) => {
  const isAr = language === 'ar';
  const [squawkCount, setSquawkCount] = useState<number>(0);
  const [isSquawking, setIsSquawking] = useState<boolean>(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);

  const handleMascotClick = () => {
    soundManager.playDajajVoice();
    setIsSquawking(true);
    setSquawkCount((prev) => prev + 1);

    const quotesAr = ['ضجااااااج! 🐔🔥', 'بق بق بقااااق! ⚡', 'لن تمسك بي! 🥷', 'ضجاااج ذهبي! ✨'];
    const quotesEn = ['DAJAAAAJ! 🐔🔥', 'Cluck Cluck! ⚡', 'Catch me if you can! 🥷', 'Golden Squawk! ✨'];

    const quotes = isAr ? quotesAr : quotesEn;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechBubble(randomQuote);

    setTimeout(() => {
      setIsSquawking(false);
    }, 400);

    setTimeout(() => {
      setSpeechBubble(null);
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col justify-between select-none"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Animated Gradient Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Floating Particles Background Accent */}
      <div className="fixed inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-amber-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🐔
            </div>
          </div>
          <div>
            <h1 className="font-black text-amber-400 text-sm sm:text-base leading-none">
              {isAr ? 'صائد الدجاج 3D' : 'Chicken Hunter 3D'}
            </h1>
            <p className="text-[10px] text-amber-200/70 font-semibold mt-0.5">
              {isAr ? 'اللعبة الأولى للصيد والتحدي' : 'The #1 3D Hunting Game'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* High Score Badge */}
          <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{(progression?.highScore || 0).toLocaleString()}</span>
          </div>

          {/* Language Switch */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-bold transition-all active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-lg mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-center">
        
        {/* Hero Title Badge */}
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wide shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? '🔥 إصدار الجوال الاحترافي 2026' : '🔥 Official Mobile Edition 2026'}</span>
          </span>
        </div>

        {/* Big Bold Headline */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 leading-tight">
            {isAr ? 'مغامرة صيد الدجاج ثلاثية الأبعاد!' : 'Ultimate 3D Chicken Hunting Adventure!'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm mx-auto">
            {isAr
              ? 'انطلق في 100 مستوى صيد مشوقة، واجمع البنادق الذهبية والقناصات، واصطد دجاج النينجا والصقور!'
              : 'Embark on 100 intense levels, unlock golden rifles and scopes, and hunt ninja chickens and falcons!'}
          </p>
        </div>

        {/* Interactive Mascot Landing Hero Container ("الدجاجة التي تنطق ضجااااج!") */}
        <div className="relative my-2 p-4 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl text-center overflow-hidden group">
          
          {/* Radial Ambient Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25),transparent_70%)] pointer-events-none" />

          {/* Speech Bubble floating overlay */}
          {speechBubble && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
              <div className="bg-slate-950 border-2 border-amber-400 text-amber-300 font-black px-4 py-1.5 rounded-full text-sm shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                <Flame className="w-4 h-4 text-orange-400 fill-current animate-bounce" />
                <span>{speechBubble}</span>
              </div>
            </div>
          )}

          {/* Mascot Header Hint */}
          <div className="flex items-center justify-between text-xs font-black text-amber-400 mb-2">
            <span className="flex items-center gap-1">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>{isAr ? 'انقر على الدجاجة لتنطق!' : 'Tap the chicken to squawk!'}</span>
            </span>
            <span className="bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[11px] font-mono">
              {isAr ? `صيحات: ${squawkCount}` : `Squawks: ${squawkCount}`}
            </span>
          </div>

          {/* Giant Mascot Visual */}
          <div
            onClick={handleMascotClick}
            className={`relative cursor-pointer transition-all duration-200 active:scale-90 flex flex-col items-center justify-center p-2 rounded-2xl ${
              isSquawking ? 'scale-110' : 'hover:scale-105'
            }`}
          >
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center my-1">
              {/* Glowing Aura Base */}
              <div className="absolute -bottom-2 w-32 h-8 bg-amber-500/30 rounded-full blur-md border border-amber-500/50 animate-pulse" />

              {/* Vector SVG Chicken Mascot */}
              <svg
                viewBox="0 0 200 200"
                className={`w-full h-full drop-shadow-[0_15px_25px_rgba(245,158,11,0.4)] transition-all duration-200 ${
                  isSquawking ? 'rotate-6 scale-110' : 'animate-bounce'
                }`}
                style={{ animationDuration: '2.2s' }}
              >
                {/* Wings */}
                <path
                  d="M 35 100 Q 15 80 25 130 Q 65 140 55 100 Z"
                  fill="#D97706"
                  className={isSquawking ? '-rotate-12 transform-origin-center' : ''}
                />
                <path
                  d="M 165 100 Q 185 80 175 130 Q 135 140 145 100 Z"
                  fill="#D97706"
                  className={isSquawking ? 'rotate-12 transform-origin-center' : ''}
                />

                {/* Main Body */}
                <ellipse cx="100" cy="115" rx="58" ry="50" fill="#F59E0B" />
                <ellipse cx="100" cy="118" rx="45" ry="40" fill="#FBBF24" />

                {/* Red Comb */}
                <path d="M 85 55 Q 85 28 98 40 Q 105 22 115 40 Q 125 28 125 55 Z" fill="#EF4444" />

                {/* Head */}
                <circle cx="100" cy="72" r="34" fill="#FBBF24" />

                {/* Eyes */}
                <circle cx="86" cy="68" r="8" fill="#FFFFFF" />
                <circle cx="86" cy="68" r="4" fill="#000000" />
                <circle cx="88" cy="65" r="2" fill="#FFFFFF" />

                <circle cx="114" cy="68" r="8" fill="#FFFFFF" />
                <circle cx="114" cy="68" r="4" fill="#000000" />
                <circle cx="116" cy="65" r="2" fill="#FFFFFF" />

                {/* Beak */}
                <path
                  d={isSquawking ? 'M 88 78 L 112 78 L 100 104 Z' : 'M 90 78 L 110 78 L 100 94 Z'}
                  fill="#F97316"
                />
                {isSquawking && <ellipse cx="100" cy="86" rx="6" ry="7" fill="#991B1B" />}

                {/* Wattle */}
                <path d="M 96 92 Q 94 108 100 106 Q 106 108 104 92 Z" fill="#EF4444" />

                {/* Feet */}
                <path d="M 78 162 L 78 182 L 68 186 M 78 182 L 78 186 M 78 182 L 88 186" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 122 162 L 122 182 L 112 186 M 122 182 L 122 186 M 122 182 L 132 186" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Giant Action Banner */}
            <div className="mt-2 w-full py-2 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-sm sm:text-base shadow-xl border-2 border-amber-300 flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <Volume2 className="w-5 h-5 animate-bounce" />
              <span>{isAr ? 'انقر هنا لسماع: ضجااااااج!' : 'Tap to Squawk: DAJAAAAJ!'}</span>
              <Flame className="w-5 h-5 text-yellow-200 fill-current" />
            </div>
          </div>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div className="space-y-2.5 mt-4">
          {/* Main Play / Start Hunt Button */}
          <button
            onClick={onStartPlay}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 border-2 border-amber-300 flex items-center justify-center gap-3 transition-all active:scale-95 group"
          >
            <Play className="w-6 h-6 fill-current text-slate-950 group-hover:scale-110 transition-transform" />
            <span>{isAr ? '🎯 ابدأ الصيد الآن (100 مستوى)' : '🎯 Start Hunt Now (100 Levels)'}</span>
            {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Secondary Action Buttons (Levels, Shop, Achievements) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onOpenLevelPicker}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 flex flex-col items-center justify-center text-center transition-all active:scale-95"
            >
              <Target className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold">{isAr ? 'المستويات' : 'Levels'}</span>
              <span className="text-[9px] text-amber-300 font-mono">1 - {progression.maxUnlockedLevel}</span>
            </button>

            <button
              onClick={() => setShowShop(true)}
              className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-teal-900/30 border border-emerald-500/40 text-emerald-200 flex flex-col items-center justify-center text-center transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold">{isAr ? 'متجر الأسلحة' : 'Armory Shop'}</span>
              <span className="text-[9px] text-emerald-300 font-mono">
                {(progression?.totalScore || 0).toLocaleString()} {isAr ? 'نقاط' : 'pts'}
              </span>
            </button>

            <button
              onClick={() => setShowAchievements(true)}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 flex flex-col items-center justify-center text-center transition-all active:scale-95"
            >
              <Award className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold">{isAr ? 'الأوسمة' : 'Trophies'}</span>
              <span className="text-[9px] text-amber-300 font-mono">
                {progression?.achievements ? progression.achievements.filter((a) => a.unlocked).length : 0}/10
              </span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Cards */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-200">{isAr ? '4 مراحل بيئية' : '4 Environments'}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? 'المزرعة، الغابة، الجبال، وعالم النينجا' : 'Farm, Forest, Mountains & Ninja Realm'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <Crosshair className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-200">{isAr ? 'ترسانة أسلحة 3D' : '3D Weaponry'}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? 'بنادق ذهبية، قناصات، وليزر سيان' : 'Golden rifles, scopes & plasma lasers'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-200">{isAr ? 'قدرات تكتيكية' : 'Tactical PowerUps'}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? 'شبكة العملاق، تجديد الوقت، وفخ الذرة' : 'Mega Net, Freeze Time & Corn Decoy'}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-200">{isAr ? '14 نوع طيور وحيوانات' : '14 Target Species'}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? 'دجاج، ديك، نينجا، صقور، أرانب وثعالب' : 'Chickens, Ninjas, Falcons & Foxes'}</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-3 px-4 border-t border-slate-900 text-center text-[10px] text-slate-500 font-medium">
        <span>
          {isAr
            ? '© 2026 لعبة صائد الدجاج ثلاثية الأبعاد الاحترافية للجوال'
            : '© 2026 Chicken Hunter 3D Mobile Edition'}
        </span>
      </footer>

      {/* Modals */}
      {showShop && (
        <ShopModal
          progression={progression}
          language={language}
          onClose={() => setShowShop(false)}
          onUpdateProgression={onUpdateProgression}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          progression={progression}
          language={language}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
};
