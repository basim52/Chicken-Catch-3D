import { useState, useCallback } from 'react';
import { useChickenGame } from './hooks/useChickenGame';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { StartMenu } from './components/StartMenu';
import { CrosshairOverlay } from './components/CrosshairOverlay';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { soundManager } from './audio/soundManager';

export default function App() {
  const {
    gameState,
    setGameState,
    language,
    setLanguage,
    cameraView,
    setCameraView,
    chickens,
    stats,
    powerUps,
    levelConfig,
    progression,
    updateProgressionData,
    newlyUnlocked,
    levelScoreBreakdown,
    startGame,
    nextLevel,
    activatePowerUp,
    catchChicken,
    registerMissClick,
  } = useChickenGame();

  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
  }, [isMuted]);

  const handleToggleCamera = useCallback(() => {
    setCameraView((prev) =>
      prev === 'default' ? 'top_down' : prev === 'top_down' ? 'close' : 'default'
    );
  }, [setCameraView]);

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, [setLanguage]);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="fixed inset-0 w-full h-[100dvh] bg-slate-950 overflow-hidden font-sans select-none touch-none"
    >
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas
        chickens={chickens}
        megaNetActive={powerUps.megaNet.active}
        cornDecoyPos={powerUps.cornDecoy.active ? powerUps.cornDecoy.pos : null}
        cameraView={cameraView}
        equippedWeapon={progression.equippedWeapon}
        equippedLaser={progression.equippedLaser}
        onChickenClick={catchChicken}
        onMissClick={registerMissClick}
      />

      {/* In-Game HUD overlay & Scope Reticle when playing */}
      {gameState === 'playing' && (
        <>
          <CrosshairOverlay cameraView={cameraView} />
          <HUD
            stats={stats}
            powerUps={powerUps}
            maxEscapes={levelConfig.allowedEscapes}
            cameraView={cameraView}
            language={language}
            onActivatePowerUp={activatePowerUp}
            onPause={() => setGameState('paused')}
            onToggleCamera={handleToggleCamera}
            onToggleLanguage={handleToggleLanguage}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </>
      )}

      {/* Start Menu */}
      {gameState === 'menu' && (
        <StartMenu
          highScore={stats.highScore}
          progression={progression}
          language={language}
          onStart={(mode, diff, startLevel) => startGame(mode, diff, startLevel || 1)}
          onToggleLanguage={handleToggleLanguage}
          onUpdateProgression={updateProgressionData}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          language={language}
          isMuted={isMuted}
          onResume={() => setGameState('playing')}
          onRestart={() => startGame('campaign', 'medium')}
          onHome={() => {
            soundManager.stopBgm();
            setGameState('menu');
          }}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Level Complete Modal */}
      {gameState === 'level_complete' && (
        <LevelCompleteModal
          stats={stats}
          language={language}
          scoreBreakdown={levelScoreBreakdown}
          newlyUnlocked={newlyUnlocked}
          maxUnlockedLevel={progression.maxUnlockedLevel}
          onNextLevel={nextLevel}
          onReplayLevel={() => startGame('campaign', 'medium')}
          onHome={() => {
            soundManager.stopBgm();
            setGameState('menu');
          }}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'game_over' && (
        <GameOverModal
          stats={stats}
          language={language}
          onRetry={() => startGame('campaign', 'medium')}
          onHome={() => {
            soundManager.stopBgm();
            setGameState('menu');
          }}
        />
      )}
    </div>
  );
}
