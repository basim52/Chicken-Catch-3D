import React from 'react';
import { Play, Flame, Trophy, Globe, ShieldAlert, Sparkles, Crosshair, Volume2 } from 'lucide-react';
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

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md select-none overflow-y-auto">
      <div className="max-w-xl w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white my-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-400 font-bold text-xs">
            <Trophy className="w-4 h-4" />
            <span>
              {isAr ? 'أعلى نتيجة:' : 'High Score:'} {highScore}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => soundManager.playDajajVoice()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isAr ? 'صوت ضجااااج!' : 'Dajaaaj Sound!'}</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs tracking-wider uppercase mb-2">
            3D WebGL Action Game
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-md">
            {isAr ? 'صيد الدجاج 3D' : 'Chicken Catch 3D'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isAr
              ? 'امسك الدجاجات قبل وصولها إلى القفص! احذر الديك الغاضب واستخدم الأدوات الفائقة.'
              : 'Catch the chickens before they reach the coop! Avoid Mad Roosters and use power-ups.'}
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
            {isAr ? 'اختر مستوى الصعوبة:' : 'Select Difficulty:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiff(d)}
                className={`py-2.5 px-3 rounded-xl font-extrabold text-xs uppercase tracking-wide border transition-all ${
                  selectedDiff === d
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {d === 'easy'
                  ? isAr
                    ? 'سهل'
                    : 'Easy'
                  : d === 'medium'
                  ? isAr
                    ? 'متوسط'
                    : 'Normal'
                  : isAr
                  ? 'صعب'
                  : 'Hard'}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => onStart('campaign', selectedDiff)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{isAr ? 'بدء اللعب (مراحل)' : 'Start Campaign'}</span>
          </button>

          <button
            onClick={() => onStart('endless', selectedDiff)}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-base flex items-center justify-center gap-3 border border-slate-700 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            <Flame className="w-5 h-5 text-orange-400" />
            <span>{isAr ? 'نمط البقاء اللانهائي' : 'Endless Survival'}</span>
          </button>
        </div>

        {/* Chicken Types Legend */}
        <div className="border-t border-slate-800 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            {isAr ? 'أنواع الدجاج والمكافآت:' : 'Chicken Types & Points:'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-orange-500/20 flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex-shrink-0" />
              <div>
                <div className="font-bold text-slate-200">{isAr ? 'برتقالية' : 'Normal'}</div>
                <div className="text-slate-400 text-[10px]">+10 pts</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-amber-300">{isAr ? 'ذهبية' : 'Golden'}</div>
                <div className="text-slate-400 text-[10px]">+30 pts (سريعة)</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-purple-500/30 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-purple-300">{isAr ? 'نينجا' : 'Ninja'}</div>
                <div className="text-slate-400 text-[10px]">+50 pts (متعرجة)</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-sky-500/30 flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-sky-300 flex-shrink-0" />
              <div>
                <div className="font-bold text-sky-200">{isAr ? 'ديك عملاق' : 'Rooster'}</div>
                <div className="text-slate-400 text-[10px]">+40 pts (نقرتين)</div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-red-500/30 flex items-center gap-2 col-span-2 sm:col-span-1">
              <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 animate-bounce" />
              <div>
                <div className="font-bold text-red-400">{isAr ? 'ديك غاضب' : 'Mad Rooster'}</div>
                <div className="text-red-300 text-[10px]">-20 pts (تجنبه!)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
