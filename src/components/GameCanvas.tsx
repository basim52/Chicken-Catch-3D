import React, { useEffect, useRef } from 'react';
import { SceneManager } from '../three/SceneManager';
import { ChickenData, CameraViewMode } from '../types';

interface GameCanvasProps {
  chickens: ChickenData[];
  megaNetActive: boolean;
  cornDecoyPos: { x: number; y: number; z: number } | null;
  cameraView: CameraViewMode;
  equippedWeapon?: string;
  equippedLaser?: string;
  onChickenClick: (id: string) => { caught: boolean; type: string; points: number; pos: { x: number; y: number; z: number } } | null;
  onMissClick: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  chickens,
  megaNetActive,
  cornDecoyPos,
  cameraView,
  equippedWeapon = 'classic_rifle',
  equippedLaser = 'red_laser',
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

    if (equippedWeapon && equippedLaser) {
      manager.updateEquippedCosmetics(equippedWeapon, equippedLaser);
    }

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

  // Sync Equipped Weapon & Laser
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.updateEquippedCosmetics(equippedWeapon, equippedLaser);
    }
  }, [equippedWeapon, equippedLaser]);

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

  // Global window pointer & touch listener for continuous rifle tracking
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (sceneManagerRef.current) {
        sceneManagerRef.current.updatePointerPosition(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && sceneManagerRef.current) {
        sceneManagerRef.current.updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, []);

  // Click & Touch Raycasting Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sceneManagerRef.current) return;

    // Trigger Hunter Rifle Shot (recoil, gunshot blast sound, muzzle flash & smoke)
    sceneManagerRef.current.triggerRifleShoot();

    const clickedChickenId = sceneManagerRef.current.checkClick(e.clientX, e.clientY, megaNetActive);

    if (clickedChickenId) {
      const result = onChickenClick(clickedChickenId);
      if (result) {
        // Trigger feather explosion
        sceneManagerRef.current.spawnFeatherBurst(result.pos, result.type);
        
        // Spawn 3D Chicken Speech Bubble: "ضجااااااج!"
        sceneManagerRef.current.spawnSpeechBubble('💬 ضجااااااج!', '#D97706', result.pos);

        // Floating score label slightly above chicken
        const textLabel = result.points >= 0 ? `+${result.points}` : `${result.points}`;
        const colorHex = result.points > 20 ? '#FFD700' : result.points < 0 ? '#FF0000' : '#FFFFFF';
        sceneManagerRef.current.spawnFloatingText(textLabel, colorHex, {
          x: result.pos.x,
          y: result.pos.y + 0.6,
          z: result.pos.z,
        });
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
