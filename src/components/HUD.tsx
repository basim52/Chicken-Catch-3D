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
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Stats Card */}
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-white px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-200/80 font-bold">
                {isAr ? 'النقاط' : 'Score'}
              </div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">
                {stats.score}
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-700 mx-1" />

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              {isAr ? 'المستوى' : 'Level'}
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              #{stats.level}
            </div>
          </div>

          {stats.comboCount > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-red-500 text-white font-black text-xs px-2.5 py-1 rounded-full animate-pulse shadow-md ml-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {stats.comboCount}x {isAr ? 'كومبو' : 'Combo'}
            </div>
          )}
        </div>

        {/* Right Escaped / Lives Hearts */}
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-red-500/30 text-white px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto">
          <div className="text-xs font-bold text-slate-300">
            {isAr ? 'الهاربات:' : 'Escaped:'}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: maxEscapes }).map((_, idx) => {
              const isLost = idx < stats.chickensEscaped;
              return (
                <Heart
                  key={idx}
                  className={`w-5 h-5 transition-all duration-300 ${
                    isLost
                      ? 'text-slate-600 fill-slate-800 scale-90'
                      : 'text-red-500 fill-red-500 animate-pulse'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Controls Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => soundManager.playDajajVoice()}
            className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-lg border border-orange-400/50"
            title={isAr ? 'صوت دجاج!' : 'Dajaj Shout!'}
          >
            <span className="text-base animate-bounce">🐔</span>
            <span>{isAr ? 'ضجااااج!' : 'Dajaaaj!'}</span>
          </button>

          <button
            onClick={onToggleCamera}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md transition-transform active:scale-95 shadow-lg"
            title={isAr ? 'تغيير الكاميرا' : 'Toggle Camera'}
          >
            <Eye className="w-5 h-5 text-sky-400" />
          </button>

          <button
            onClick={onToggleLanguage}
            className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-lg"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md transition-transform active:scale-95 shadow-lg"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>

          <button
            onClick={onPause}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold backdrop-blur-md transition-transform active:scale-95 shadow-lg"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Power-Ups Dock */}
      <div className="flex justify-center items-center gap-4 pointer-events-auto mb-2">
        {/* Powerup 1: Freeze */}
        <button
          onClick={() => onActivatePowerUp('freeze')}
          disabled={powerUps.freeze.cooldown > 0 || powerUps.freeze.active}
          className={`relative group flex flex-col items-center gap-1 p-3 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-2xl ${
            powerUps.freeze.active
              ? 'bg-sky-500/30 border-sky-400 ring-2 ring-sky-400 shadow-sky-500/50 scale-105'
              : powerUps.freeze.cooldown > 0
              ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
              : 'bg-slate-900/90 border-sky-500/40 hover:border-sky-400 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative">
            <Snowflake className="w-7 h-7 text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
            {powerUps.freeze.cooldown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-white bg-slate-950/80 rounded-full font-mono">
                {Math.ceil(powerUps.freeze.cooldown)}s
              </div>
            )}
          </div>
          <span className="text-[11px] font-bold text-sky-200">
            {isAr ? 'تجميد الوقت' : 'Freeze Time'}
          </span>
        </button>

        {/* Powerup 2: Corn Decoy */}
        <button
          onClick={() => onActivatePowerUp('cornDecoy')}
          disabled={powerUps.cornDecoy.cooldown > 0 || powerUps.cornDecoy.active}
          className={`relative group flex flex-col items-center gap-1 p-3 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-2xl ${
            powerUps.cornDecoy.active
              ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400 shadow-amber-500/50 scale-105'
              : powerUps.cornDecoy.cooldown > 0
              ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
              : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative">
            <Wheat className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            {powerUps.cornDecoy.cooldown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-white bg-slate-950/80 rounded-full font-mono">
                {Math.ceil(powerUps.cornDecoy.cooldown)}s
              </div>
            )}
          </div>
          <span className="text-[11px] font-bold text-amber-200">
            {isAr ? 'فخ الذرة' : 'Corn Decoy'}
          </span>
        </button>

        {/* Powerup 3: Mega Net */}
        <button
          onClick={() => onActivatePowerUp('megaNet')}
          disabled={powerUps.megaNet.cooldown > 0 || powerUps.megaNet.active}
          className={`relative group flex flex-col items-center gap-1 p-3 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-2xl ${
            powerUps.megaNet.active
              ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400 shadow-emerald-500/50 scale-105'
              : powerUps.megaNet.cooldown > 0
              ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
              : 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative">
            <Target className="w-7 h-7 text-emerald-400 group-hover:rotate-90 transition-transform duration-300" />
            {powerUps.megaNet.cooldown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-white bg-slate-950/80 rounded-full font-mono">
                {Math.ceil(powerUps.megaNet.cooldown)}s
              </div>
            )}
          </div>
          <span className="text-[11px] font-bold text-emerald-200">
            {isAr ? 'شبكة فائقة' : 'Mega Net'}
          </span>
        </button>
      </div>
    </div>
  );
};
