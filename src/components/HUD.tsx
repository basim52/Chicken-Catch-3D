import React from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  Pause,
  Snowflake,
  Wheat,
  Target,
  Eye,
  Flame,
  Globe,
  Heart,
} from 'lucide-react';
import { GameStats, PowerUpState, CameraViewMode, Language } from '../types';
import { soundManager } from '../audio/soundManager';

interface HUDProps {
  stats: GameStats;
  powerUps: PowerUpState;
  maxEscapes: number;
  cameraView: CameraViewMode;
  language: Language;
  onActivatePowerUp: (type: 'freeze' | 'cornDecoy' | 'megaNet') => void;
  onPause: () => void;
  onToggleCamera: () => void;
  onToggleLanguage: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  powerUps,
  maxEscapes,
  cameraView,
  language,
  onActivatePowerUp,
  onPause,
  onToggleCamera,
  onToggleLanguage,
  isMuted,
  onToggleMute,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-4 z-10 select-none pt-[env(safe-area-inset-top,0.5rem)] pb-[env(safe-area-inset-bottom,0.5rem)]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Row 1: Left Stats Card & Right Escaped Lives Card */}
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          {/* Left Stats Card */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/85 backdrop-blur-md border border-amber-500/30 text-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl pointer-events-auto">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-bounce" />
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-200/80 font-bold">
                  {isAr ? 'النقاط' : 'Score'}
                </div>
                <div className="text-base sm:text-xl font-extrabold text-amber-400 font-mono leading-none">
                  {stats.score}
                </div>
              </div>
            </div>

            <div className="w-px h-6 sm:h-8 bg-slate-700" />

            <div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                {isAr ? 'المستوى' : 'Level'}
              </div>
              <div className="text-sm sm:text-lg font-bold text-emerald-400 font-mono leading-none">
                #{stats.level}
              </div>
            </div>

            {stats.comboCount > 1 && (
              <div className="flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-amber-500 to-red-500 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full animate-pulse shadow-md">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                {stats.comboCount}x
              </div>
            )}
          </div>

          {/* Right Escaped / Lives Hearts */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/85 backdrop-blur-md border border-red-500/30 text-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl pointer-events-auto">
            <div className="text-[10px] sm:text-xs font-bold text-slate-300 hidden min-[380px]:block">
              {isAr ? 'الهاربات:' : 'Escaped:'}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxEscapes }).map((_, idx) => {
                const isLost = idx < stats.chickensEscaped;
                return (
                  <Heart
                    key={idx}
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                      isLost
                        ? 'text-slate-600 fill-slate-800 scale-90'
                        : 'text-red-500 fill-red-500 animate-pulse'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Controls Action Buttons */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 pointer-events-auto w-full sm:w-auto">
          <button
            onClick={() => soundManager.playDajajVoice()}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-transform active:scale-95 shadow-lg border border-amber-400/50 min-h-[38px] sm:min-h-[42px]"
            title={isAr ? 'صوت دجاج!' : 'Dajaj Shout!'}
          >
            <span className="text-sm sm:text-base animate-bounce">🐔</span>
            <span className="text-[11px] sm:text-xs">{isAr ? 'ضجااااج!' : 'Dajaaaj!'}</span>
          </button>

          <button
            onClick={onToggleCamera}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md transition-transform active:scale-95 shadow-lg min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
            title={isAr ? 'تغيير الكاميرا' : 'Toggle Camera'}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
          </button>

          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md font-bold text-xs flex items-center gap-1 transition-transform active:scale-95 shadow-lg min-h-[38px] sm:min-h-[42px]"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-[11px] sm:text-xs">{isAr ? 'EN' : 'عربي'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md transition-transform active:scale-95 shadow-lg min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </button>

          <button
            onClick={onPause}
            className="p-2 sm:p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold backdrop-blur-md transition-transform active:scale-95 shadow-lg min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Power-Ups Dock */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 pointer-events-auto mb-1 sm:mb-2">
        {/* Powerup 1: Freeze */}
        <button
          onClick={() => onActivatePowerUp('freeze')}
          disabled={powerUps.freeze.cooldown > 0 || powerUps.freeze.active}
          className={`relative group flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-2xl min-w-[85px] sm:min-w-[110px] ${
            powerUps.freeze.active
              ? 'bg-sky-500/30 border-sky-400 ring-2 ring-sky-400 shadow-sky-500/50 scale-105'
              : powerUps.freeze.cooldown > 0
              ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
              : 'bg-slate-900/90 border-sky-500/40 hover:border-sky-400 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative">
            <Snowflake className="w-5 h-5 sm:w-7 sm:h-7 text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
            {powerUps.freeze.cooldown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[10px] sm:text-xs text-white bg-slate-950/80 rounded-full font-mono">
                {Math.ceil(powerUps.freeze.cooldown)}s
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-sky-200">
            {isAr ? 'تجميد الوقت' : 'Freeze Time'}
          </span>
        </button>

        {/* Powerup 2: Corn Decoy */}
        <button
          onClick={() => onActivatePowerUp('cornDecoy')}
          disabled={powerUps.cornDecoy.cooldown > 0 || powerUps.cornDecoy.active}
          className={`relative group flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-2xl min-w-[85px] sm:min-w-[110px] ${
            powerUps.cornDecoy.active
              ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400 shadow-amber-500/50 scale-105'
              : powerUps.cornDecoy.cooldown > 0
              ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
              : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative">
            <Wheat className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            {powerUps.cornDecoy.cooldown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[10px] sm:text-xs text-white bg-slate-950/80 rounded-full font-mono">
                {Math.ceil(powerUps.cornDecoy.cooldown)}s
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-200">
            {isAr ? 'فخ الذرة' : 'Corn Decoy'}
          </span>
        </button>

        {/* Powerup 3: Mega Net */}
        <button
          onClick={() => onActivatePowerUp('megaNet')}
          disabled={powerUps.megaNet.cooldown > 0 || powerUps.megaNet.active}
          className={`relative group flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-2xl min-w-[85px] sm:min-w-[110px] ${
            powerUps.megaNet.active
              ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400 shadow-emerald-500/50 scale-105'
              : powerUps.megaNet.cooldown > 0
              ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
              : 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative">
            <Target className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400 group-hover:rotate-90 transition-transform duration-300" />
            {powerUps.megaNet.cooldown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[10px] sm:text-xs text-white bg-slate-950/80 rounded-full font-mono">
                {Math.ceil(powerUps.megaNet.cooldown)}s
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200">
            {isAr ? 'شبكة فائقة' : 'Mega Net'}
          </span>
        </button>
      </div>
    </div>
  );
};
