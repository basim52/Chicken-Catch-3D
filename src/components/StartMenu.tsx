import React from 'react';
import { Play, Flame, Trophy, Globe, ShieldAlert, Sparkles, Crosshair, Volume2, Gamepad2, Info } from 'lucide-react';
import { GameMode, Difficulty, Language } from '../types';
import { soundManager } from '../audio/soundManager';

interface StartMenuProps {
  highScore: number;
  language: Language;
  onStart: (mode: GameMode, diff: Difficulty) => void;
  onToggleLanguage: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  highScore,
  language,
  onStart,
  onToggleLanguage,
}) => {
  const isAr = language === 'ar';
  const [selectedDiff, setSelectedDiff] = React.useState<Difficulty>('medium');
  const [showGuide, setShowGuide] = React.useState<boolean>(false);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-lg select-none overflow-y-auto pt-[env(safe-area-inset-top,1rem)] pb-[env(safe-area-inset-bottom,1rem)]">
      <div className="max-w-md w-full bg-slate-900/95 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl text-white my-auto max-h-[92dvh] flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Top App Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-400 font-bold text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="font-mono text-xs">
              {isAr ? 'القياسي:' : 'Best:'} {highScore}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => soundManager.playDajajVoice()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] transition-transform active:scale-95 shadow-md border border-amber-400/40"
              title={isAr ? 'صوت ضجااااج!' : 'Dajaj Voice'}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'ضجااااج!' : 'Dajaaaj!'}</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Hero Header */}
        <div className="text-center my-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-[10px] sm:text-xs tracking-wider uppercase mb-1.5">
            <span className="animate-spin text-sm">🐔</span>
            <span>3D Mobile Game</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-md">
            {isAr ? 'صيد الدجاج 3D' : 'Chicken Catch 3D'}
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed px-2">
            {isAr
              ? 'امسك الدجاجات بأصابعك قبل وصولها للقفص! احذر الديك الغاضب.'
              : 'Tap the chickens before they reach the coop! Beware of Mad Roosters.'}
          </p>
        </div>

        {/* Difficulty Mobile Segmented Selector */}
        <div className="my-4 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
            {isAr ? 'اختر مستوى الصعوبة:' : 'Select Difficulty:'}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiff(d)}
                className={`py-2 px-2 rounded-xl font-extrabold text-xs transition-all active:scale-95 min-h-[40px] flex items-center justify-center ${
                  selectedDiff === d
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md scale-[1.02] border border-amber-300'
                    : 'bg-slate-800/90 text-slate-300 border border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                {d === 'easy'
                  ? isAr
                    ? 'سهل'
                    : 'Easy'
                  : d === 'medium'
                  ? isAr
                    ? 'متوسط'
                    : 'Medium'
                  : isAr
                  ? 'صعب'
                  : 'Hard'}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="space-y-2.5 my-2">
          <button
            onClick={() => onStart('campaign', selectedDiff)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition-transform active:scale-95 border border-amber-300 min-h-[52px]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isAr ? 'بدء اللعب (مراحل)' : 'Start Campaign'}</span>
          </button>

          <button
            onClick={() => onStart('endless', selectedDiff)}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-extrabold text-sm flex items-center justify-center gap-2 border border-slate-700 shadow-md transition-transform active:scale-95 min-h-[48px]"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{isAr ? 'نمط البقاء اللانهائي' : 'Endless Survival'}</span>
          </button>
        </div>

        {/* Toggleable Quick Guide / Legend */}
        <div className="mt-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors py-1 px-1"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'أنواع الدجاج والمكافآت' : 'Chicken Types & Points'}</span>
            </span>
            <span className="text-amber-400 text-xs">{showGuide ? '▲' : '▼'}</span>
          </button>

          {(showGuide || true) && (
            <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px]">
              <div className="bg-slate-800/60 p-2 rounded-xl border border-orange-500/20 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">{isAr ? 'عادية' : 'Normal'}</div>
                  <div className="text-slate-400 text-[9px]">+10 pts</div>
                </div>
              </div>

              <div className="bg-slate-800/60 p-2 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-amber-300">{isAr ? 'ذهبية' : 'Golden'}</div>
                  <div className="text-slate-400 text-[9px]">+30 pts (سريعة)</div>
                </div>
              </div>

              <div className="bg-slate-800/60 p-2 rounded-xl border border-purple-500/30 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-purple-300">{isAr ? 'نينجا' : 'Ninja'}</div>
                  <div className="text-slate-400 text-[9px]">+50 pts (متعرجة)</div>
                </div>
              </div>

              <div className="bg-slate-800/60 p-2 rounded-xl border border-red-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <div>
                  <div className="font-bold text-red-400">{isAr ? 'ديك غاضب' : 'Mad Rooster'}</div>
                  <div className="text-red-300 text-[9px]">-20 pts (تجنبه!)</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

