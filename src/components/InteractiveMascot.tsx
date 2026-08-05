import React, { useState } from 'react';
import { Volume2, Sparkles, Flame } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface InteractiveMascotProps {
  isAr: boolean;
}

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({ isAr }) => {
  const [squawkCount, setSquawkCount] = useState<number>(0);
  const [isSquawking, setIsSquawking] = useState<boolean>(false);
  const [floatingBubbles, setFloatingBubbles] = useState<
    { id: number; text: string; x: number; y: number }[]
  >([]);

  const handleSquawk = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    soundManager.playDajajVoice();
    setIsSquawking(true);
    setSquawkCount((prev) => prev + 1);

    // Get click position for floating speech bubble
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((e as React.MouseEvent).clientX || rect.left + rect.width / 2) - rect.left;
    const y = ((e as React.MouseEvent).clientY || rect.top + rect.height / 2) - rect.top;

    const newBubble = {
      id: Date.now() + Math.random(),
      text: isAr ? 'ضجااااااج! 🐔🔥' : 'DAJAAAAJ! 🐔🔥',
      x: Math.max(10, Math.min(rect.width - 90, x - 40)),
      y: Math.max(0, y - 40),
    };

    setFloatingBubbles((prev) => [...prev.slice(-4), newBubble]);

    setTimeout(() => {
      setIsSquawking(false);
    }, 400);

    setTimeout(() => {
      setFloatingBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 1200);
  };

  return (
    <div className="relative my-2.5 p-3 rounded-2xl bg-gradient-to-b from-amber-500/15 via-slate-900/90 to-slate-950 border border-amber-500/35 shadow-xl text-center select-none overflow-hidden group">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />

      {/* Floating Speech Bubbles Container */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {floatingBubbles.map((bubble) => (
          <div
            key={bubble.id}
            style={{ left: `${bubble.x}px`, top: `${bubble.y}px` }}
            className="absolute font-black text-amber-300 bg-slate-950/95 border-2 border-amber-400 px-3 py-1 rounded-full text-xs shadow-2xl animate-in fade-in zoom-in slide-out-to-top-8 duration-1000 flex items-center gap-1 text-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{bubble.text}</span>
          </div>
        ))}
      </div>

      {/* Top Badge */}
      <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400 font-extrabold px-1">
        <span className="flex items-center gap-1 text-amber-400">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          <span>{isAr ? 'اضغط الدجاجة لتنطق!' : 'Tap chicken to squawk!'}</span>
        </span>
        {squawkCount > 0 && (
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
            {isAr ? `صيحات: ${squawkCount}` : `Squawks: ${squawkCount}`}
          </span>
        )}
      </div>

      {/* Interactive Mascot Mascot Viewport */}
      <div
        onClick={handleSquawk}
        className={`relative cursor-pointer transition-transform duration-150 active:scale-90 flex flex-col items-center justify-center p-2 rounded-2xl ${
          isSquawking ? 'scale-110' : 'hover:scale-105'
        }`}
      >
        {/* Animated Mascot Graphic */}
        <div className="relative w-28 h-28 sm:w-32 sm:w-32 flex items-center justify-center my-1">
          {/* Egg / Podium Base */}
          <div className="absolute -bottom-1 w-24 h-6 bg-amber-500/20 rounded-full blur-sm border border-amber-500/30 animate-pulse" />

          {/* SVG Mascot Chicken */}
          <svg
            viewBox="0 0 200 200"
            className={`w-full h-full drop-shadow-[0_10px_15px_rgba(245,158,11,0.3)] transition-all duration-200 ${
              isSquawking ? 'rotate-6 scale-110' : 'animate-bounce'
            }`}
            style={{ animationDuration: '2.5s' }}
          >
            {/* Feathers Aura / Wings */}
            <path
              d="M 40 100 Q 20 80 30 130 Q 70 140 60 100 Z"
              fill="#D97706"
              className={isSquawking ? '-rotate-12 transform-origin-center' : ''}
            />
            <path
              d="M 160 100 Q 180 80 170 130 Q 130 140 140 100 Z"
              fill="#D97706"
              className={isSquawking ? 'rotate-12 transform-origin-center' : ''}
            />

            {/* Main Body */}
            <ellipse cx="100" cy="115" rx="55" ry="48" fill="#F59E0B" />
            <ellipse cx="100" cy="118" rx="42" ry="38" fill="#FBBF24" />

            {/* Red Comb */}
            <path d="M 85 55 Q 85 30 98 42 Q 105 25 115 42 Q 125 30 125 55 Z" fill="#EF4444" />

            {/* Head */}
            <circle cx="100" cy="72" r="32" fill="#FBBF24" />

            {/* Eyes */}
            <circle cx="88" cy="68" r="7" fill="#FFFFFF" />
            <circle cx="88" cy="68" r="3.5" fill="#000000" />
            <circle cx="90" cy="66" r="1.5" fill="#FFFFFF" />

            <circle cx="112" cy="68" r="7" fill="#FFFFFF" />
            <circle cx="112" cy="68" r="3.5" fill="#000000" />
            <circle cx="114" cy="66" r="1.5" fill="#FFFFFF" />

            {/* Beak */}
            <path
              d={isSquawking ? 'M 90 78 L 110 78 L 100 100 Z' : 'M 92 78 L 108 78 L 100 92 Z'}
              fill="#F97316"
            />
            {/* Mouth Inside when squawking */}
            {isSquawking && <ellipse cx="100" cy="85" rx="5" ry="6" fill="#991B1B" />}

            {/* Wattle (Red neck piece) */}
            <path d="M 96 90 Q 94 105 100 104 Q 106 105 104 90 Z" fill="#EF4444" />

            {/* Feet */}
            <path d="M 80 160 L 80 178 L 70 182 M 80 178 L 80 182 M 80 178 L 90 182" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
            <path d="M 120 160 L 120 178 L 110 182 M 120 178 L 120 182 M 120 178 L 130 182" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Main "Dajaaaj" Button Banner */}
        <div className="mt-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-xs shadow-lg border border-amber-300 transition-transform active:scale-95">
          <Volume2 className="w-4 h-4 animate-bounce" />
          <span className="text-sm tracking-wide">{isAr ? 'اضغط هنا لسماع: ضجااااااج!' : 'Tap me: DAJAAAAJ!'}</span>
          <Flame className="w-4 h-4 text-yellow-200 fill-current" />
        </div>
      </div>
    </div>
  );
};
