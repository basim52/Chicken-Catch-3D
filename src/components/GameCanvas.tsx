import React, { useEffect, useRef } from 'react';
import { SceneManager } from '../three/SceneManager';
import { ChickenData, CameraViewMode } from '../types';

interface GameCanvasProps {
  chickens: ChickenData[];
  megaNetActive: boolean;
  cornDecoyPos: { x: number; y: number; z: number } | null;
  cameraView: CameraViewMode;
  onChickenClick: (id: string) => { caught: boolean; type: string; points: number; pos: { x: number; y: number; z: number } } | null;
  onMissClick: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  chickens,
  megaNetActive,
  cornDecoyPos,
  cameraView,
  onChickenClick,
  onMissClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager(containerRef.current);
    sceneManagerRef.current = manager;

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // Sync Camera View
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.updateCameraPosition(cameraView);
    }
  }, [cameraView]);

  // Animation render loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (sceneManagerRef.current) {
        sceneManagerRef.current.update(chickens, delta, cornDecoyPos);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [chickens, cornDecoyPos]);

  // Click & Touch Raycasting Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sceneManagerRef.current) return;

    const clickedChickenId = sceneManagerRef.current.checkClick(e.clientX, e.clientY, megaNetActive);

    if (clickedChickenId) {
      const result = onChickenClick(clickedChickenId);
      if (result) {
        // Trigger feather explosion & floating score text
        sceneManagerRef.current.spawnFeatherBurst(result.pos, result.type);
        const textLabel = result.points >= 0 ? `+${result.points}` : `${result.points}`;
        const colorHex = result.points > 20 ? '#FFD700' : result.points < 0 ? '#FF0000' : '#FFFFFF';
        sceneManagerRef.current.spawnFloatingText(textLabel, colorHex, result.pos);
      }
    } else {
      onMissClick();
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="w-full h-full relative cursor-crosshair overflow-hidden touch-none select-none"
    />
  );
};
