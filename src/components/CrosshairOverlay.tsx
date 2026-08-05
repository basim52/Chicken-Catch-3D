import React, { useState, useEffect } from 'react';

interface CrosshairOverlayProps {
  cameraView: string;
}

export const CrosshairOverlay: React.FC<CrosshairOverlayProps> = ({ cameraView }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isFiring, setIsFiring] = useState<boolean>(false);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerDown = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsFiring(true);
      setTimeout(() => setIsFiring(false), 150);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  if (cameraView === 'top_down') return null;

  // Default position: screen center if no mouse/touch movement yet
  const x = pos ? pos.x : window.innerWidth / 2;
  const y = pos ? pos.y : window.innerHeight / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none">
      {/* Tactical Hunter Scope Crosshair Reticle */}
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out ${
          isFiring ? 'scale-125 opacity-100' : 'scale-100 opacity-90'
        }`}
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        {/* Outer Circular Target Scope Ring */}
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-colors ${
            isFiring
              ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
              : 'border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
          } flex items-center justify-center`}
        >
          {/* Top, Bottom, Left, Right Scope Sight Notch Lines */}
          <div className="absolute top-0 w-0.5 h-3 bg-amber-400" />
          <div className="absolute bottom-0 w-0.5 h-3 bg-amber-400" />
          <div className="absolute left-0 h-0.5 w-3 bg-amber-400" />
          <div className="absolute right-0 h-0.5 w-3 bg-amber-400" />

          {/* Inner Precision Ring */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-amber-300/40 border-dashed animate-spin-slow flex items-center justify-center">
            {/* Center Glowing Laser Red Dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isFiring ? 'bg-red-500 scale-150 animate-ping' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
              }`}
            />
          </div>

          {/* Corner Framing Brackets for Hunter FPS Feel */}
          <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />

          {/* Ranged Target Indicator Badge */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-amber-500/40 text-[9px] font-mono font-bold text-amber-300 whitespace-nowrap shadow-md">
            🎯 {isFiring ? 'FIRE!' : 'TARGET SIGHT'}
          </div>
        </div>
      </div>
    </div>
  );
};
