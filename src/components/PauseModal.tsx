import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';

interface PauseModalProps {
  language: Language;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  language,
  isMuted,
  onResume,
  onRestart,
  onHome,
  onToggleMute,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="max-w-sm w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-black text-amber-400 mb-6">
          {isAr ? 'اللعبة متوقفة' : 'Game Paused'}
        </h2>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isAr ? 'متابعة اللعب' : 'Resume Game'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>{isAr ? 'تشغيل الصوت' : 'Unmute Sound'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'كتم الصوت' : 'Mute Sound'}</span>
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إعادة المرحلة' : 'Restart Level'}</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>{isAr ? 'القائمة الرئيسية' : 'Main Menu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
