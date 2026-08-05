import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Home, Award, Zap, Target } from 'lucide-react';
import { GameStats, Language } from '../types';
import { Achievement } from '../utils/progression';

interface LevelCompleteModalProps {
  stats: GameStats;
  language: Language;
  scoreBreakdown?: {
    baseScore: number;
    accuracyBonus: number;
    perfectBonus: number;
    totalEarned: number;
  };
  newlyUnlocked?: Achievement[];
  maxUnlockedLevel?: number;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  stats,
  language,
  scoreBreakdown,
  newlyUnlocked = [],
  maxUnlockedLevel = 1,
  onNextLevel,
  onReplayLevel,
  onHome,
}) => {
  const isAr = language === 'ar';

  // Fire confetti
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, []);

  // Calculate stars (3 stars = zero escapes, 2 stars = 1 escape, 1 star = 2+ escapes)
  const stars = stats.chickensEscaped === 0 ? 3 : stats.chickensEscaped === 1 ? 2 : 1;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-2 border border-emerald-500/30">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <h2 className="text-3xl font-black text-emerald-400 mb-1">
          {isAr ? 'اكتمل المستوى بنجاح!' : 'Level Completed!'}
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          {isAr
            ? `أحسنت! نجحت في إنهاء المستوى #${stats.level} وتمرير المرحلة`
            : `Great job! You completed level #${stats.level}`}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-5">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-10 h-10 transition-transform duration-500 ${
                starIndex <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]'
                  : 'text-slate-700 fill-slate-800 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Unlocked Achievements Banner if any */}
        {newlyUnlocked.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-300 animate-pulse">
            <div className="flex items-center justify-center gap-2 font-black text-sm mb-1">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{isAr ? 'إنجاز جديد مالي ومكتسب!' : 'New Achievement Unlocked!'}</span>
            </div>
            {newlyUnlocked.map((ach) => (
              <div key={ach.id} className="text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5 mt-1">
                <span className="text-base">{ach.icon}</span>
                <span>{isAr ? ach.titleAr : ach.titleEn}</span>
              </div>
            ))}
          </div>
        )}

        {/* Level Progression Indicator */}
        <div className="mb-4 py-2 px-4 bg-slate-800/70 border border-slate-700 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-400">{isAr ? 'أعلى مستوى مفتوح:' : 'Highest Level Unlocked:'}</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            {isAr ? `المستوى ${maxUnlockedLevel}` : `Level ${maxUnlockedLevel}`} / 100
          </span>
        </div>

        {/* Points & Bonuses Calculation Breakdown */}
        {scoreBreakdown && (
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800 mb-4 text-xs space-y-1.5 text-right">
            <div className="text-[11px] font-bold text-amber-400 border-b border-slate-800 pb-1 mb-2 flex justify-between items-center">
              <span>{isAr ? 'حساب النقاط والمكافآت' : 'Points Calculation'}</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{isAr ? 'نقاط الصيد الأساسية:' : 'Base Catch Points:'}</span>
              <span className="font-mono font-bold">{scoreBreakdown.baseScore}</span>
            </div>
            <div className="flex justify-between text-sky-300">
              <span>{isAr ? 'مكافأة الدقة (+ accuracy):' : 'Accuracy Bonus:'}</span>
              <span className="font-mono font-bold">+{scoreBreakdown.accuracyBonus}</span>
            </div>
            {scoreBreakdown.perfectBonus > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>{isAr ? 'مكافأة المستوى المثالي (0 هروب):' : 'Perfect Level Bonus:'}</span>
                <span className="font-mono font-bold">+{scoreBreakdown.perfectBonus}</span>
              </div>
            )}
            <div className="flex justify-between text-amber-400 font-extrabold text-sm border-t border-slate-800 pt-1.5 mt-1">
              <span>{isAr ? 'مجموع نقاط المستوى:' : 'Total Level Points:'}</span>
              <span className="font-mono">{scoreBreakdown.totalEarned}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 grid grid-cols-2 gap-2 text-right mb-5">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'الدجاجات الممسوكة' : 'Caught'}
            </div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono">
              {stats.chickensCaught}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'دقة الصيد' : 'Accuracy'}
            </div>
            <div className="text-lg font-extrabold text-sky-400 font-mono">
              {stats.accuracy}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'أعلى كومبو' : 'Max Combo'}
            </div>
            <div className="text-lg font-extrabold text-orange-400 font-mono">
              {stats.maxCombo}x
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'الدجاجات الذهبية' : 'Golden Caught'}
            </div>
            <div className="text-lg font-extrabold text-amber-300 font-mono">
              {stats.goldenCaught}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>{isAr ? 'المستوى التالي' : 'Next Level'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplayLevel}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة' : 'Replay'}</span>
            </button>

            <button
              onClick={onHome}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>{isAr ? 'القائمة الرئيسية' : 'Main Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
