import React from 'react';
import { Skull, RotateCcw, Home, Trophy } from 'lucide-react';
import { GameStats, Language } from '../types';

interface GameOverModalProps {
  stats: GameStats;
  language: Language;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  language,
  onRetry,
  onHome,
}) => {
  const isAr = language === 'ar';
  const isNewHigh = stats.score > 0 && stats.score === stats.highScore;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 text-center text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex p-3 rounded-full bg-red-500/20 text-red-400 mb-3 border border-red-500/30">
          <Skull className="w-10 h-10 animate-pulse" />
        </div>

        <h2 className="text-3xl font-black text-red-500 mb-1">
          {isAr ? 'انتهت اللعبة!' : 'Game Over!'}
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          {isAr
            ? 'هربت الكثير من الدجاجات إلى القفص!'
            : 'Too many chickens escaped into the coop!'}
        </p>

        {isNewHigh && (
          <div className="mb-4 py-2 px-4 bg-amber-500/20 border border-amber-500/40 rounded-full inline-flex items-center gap-2 text-amber-300 font-extrabold text-xs animate-bounce">
            <Trophy className="w-4 h-4" />
            <span>{isAr ? 'نتيجة قياسية جديدة!' : 'NEW HIGH SCORE!'}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 grid grid-cols-2 gap-3 text-left mb-6">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'النقاط النهائية' : 'Final Score'}
            </div>
            <div className="text-xl font-extrabold text-amber-400 font-mono">
              {stats.score}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'الدجاج الممسوك' : 'Caught'}
            </div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              {stats.chickensCaught}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'الذهبية الممسوكة' : 'Golden Caught'}
            </div>
            <div className="text-xl font-extrabold text-amber-300 font-mono">
              {stats.goldenCaught}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              {isAr ? 'دقة اللمس' : 'Accuracy'}
            </div>
            <div className="text-xl font-extrabold text-sky-400 font-mono">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isAr ? 'محاولة أخرى' : 'Try Again'}</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? 'القائمة الرئيسية' : 'Main Menu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
