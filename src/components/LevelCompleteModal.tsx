import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { GameStats, Language } from '../types';

interface LevelCompleteModalProps {
  stats: GameStats;
  language: Language;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  stats,
  language,
  onNextLevel,
  onReplayLevel,
  onHome,
}) => {
  const isAr = language === 'ar';

  // Fire confetti
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // Calculate stars (3 stars = zero escapes, 2 stars = 1 escape, 1 star = 2+ escapes)
  const stars = stats.chickensEscaped === 0 ? 3 : stats.chickensEscaped === 1 ? 2 : 1;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <h2 className="text-3xl font-black text-emerald-400 mb-1">
          {isAr ? 'اكتمل المستوى!' : 'Level Complete!'}
        </h2>
        <p className="text-slate-400 text-xs mb-6">
          {isAr
            ? `أحسنت! نجحت في إنهاء المستوى #${stats.level}`
            : `Great job! You passed level #${stats.level}`}
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-10 h-10 transition-transform duration-500 ${
                starIndex <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700 fill-slate-800 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 grid grid-cols-2 gap-3 text-left mb-6">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'النقاط الإجمالية' : 'Total Score'}
            </div>
            <div className="text-xl font-extrabold text-amber-400 font-mono">
              {stats.score}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'الدجاجات الممسوكة' : 'Caught'}
            </div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              {stats.chickensCaught}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'دقة الصيد' : 'Accuracy'}
            </div>
            <div className="text-xl font-extrabold text-sky-400 font-mono">
              {stats.accuracy}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'أعلى كومبو' : 'Max Combo'}
            </div>
            <div className="text-xl font-extrabold text-orange-400 font-mono">
              {stats.maxCombo}x
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
              <span>{isAr ? 'القائمة' : 'Main Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
