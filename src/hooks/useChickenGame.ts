import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  GameMode,
  Difficulty,
  ChickenData,
  ChickenType,
  LevelConfig,
  PowerUpState,
  GameStats,
  Language,
  CameraViewMode,
} from '../types';
import { CHICKEN_SPECS } from '../three/Chicken3D';
import { soundManager } from '../audio/soundManager';

const COOP_TARGET = { x: 5, y: 0.5, z: -4 };
const CORN_DECOY_TARGET = { x: 0, y: 0.5, z: 1 };

export function useChickenGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [language, setLanguage] = useState<Language>('ar');
  const [cameraView, setCameraView] = useState<CameraViewMode>('default');

  const [chickens, setChickens] = useState<ChickenData[]>([]);
  const chickensRef = useRef<ChickenData[]>([]);
  chickensRef.current = chickens;

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: parseInt(localStorage.getItem('chicken_catch_highscore') || '0', 10),
    level: 1,
    chickensCaught: 0,
    chickensEscaped: 0,
    goldenCaught: 0,
    roostersCaught: 0,
    comboCount: 0,
    maxCombo: 0,
    accuracy: 100,
    totalClicks: 0,
    successfulClicks: 0,
  });

  const [powerUps, setPowerUps] = useState<PowerUpState>({
    freeze: { active: false, cooldown: 0, durationRemaining: 0 },
    cornDecoy: { active: false, cooldown: 0, durationRemaining: 0, pos: null },
    megaNet: { active: false, cooldown: 0, durationRemaining: 0 },
  });

  const lastSpawnTimeRef = useRef<number>(0);
  const totalSpawnedInLevelRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  // Generate configuration based on level & difficulty
  const getLevelConfig = useCallback((level: number, diff: Difficulty): LevelConfig => {
    const speedMult = diff === 'easy' ? 0.8 : diff === 'hard' ? 1.3 : 1.0;
    const baseCount = 3 + level * 2;
    const allowedEscapes = diff === 'easy' ? 5 : diff === 'hard' ? 2 : 3;

    let types: ChickenType[] = ['NORMAL'];
    if (level >= 2) types.push('GOLDEN');
    if (level >= 3) types.push('NINJA');
    if (level >= 4) types.push('ROOSTER');
    if (level >= 5) types.push('BOMB');

    return {
      levelNumber: level,
      targetScore: level * 100,
      chickenCount: Math.min(baseCount, 25),
      allowedEscapes,
      spawnInterval: Math.max(0.6, 2.2 - level * 0.15),
      typesAllowed: types,
      speedMultiplier: speedMult,
    };
  }, []);

  const [levelConfig, setLevelConfig] = useState<LevelConfig>(getLevelConfig(1, 'medium'));

  // Start a new game
  const startGame = useCallback((mode: GameMode = 'campaign', diff: Difficulty = 'medium') => {
    setGameMode(mode);
    setDifficulty(diff);
    const initialConfig = getLevelConfig(1, diff);
    setLevelConfig(initialConfig);

    setStats({
      score: 0,
      highScore: parseInt(localStorage.getItem('chicken_catch_highscore') || '0', 10),
      level: 1,
      chickensCaught: 0,
      chickensEscaped: 0,
      goldenCaught: 0,
      roostersCaught: 0,
      comboCount: 0,
      maxCombo: 0,
      accuracy: 100,
      totalClicks: 0,
      successfulClicks: 0,
    });

    setPowerUps({
      freeze: { active: false, cooldown: 0, durationRemaining: 0 },
      cornDecoy: { active: false, cooldown: 0, durationRemaining: 0, pos: null },
      megaNet: { active: false, cooldown: 0, durationRemaining: 0 },
    });

    setChickens([]);
    totalSpawnedInLevelRef.current = 0;
    lastSpawnTimeRef.current = performance.now();
    setGameState('playing');
    soundManager.startBgm();
  }, [getLevelConfig]);

  // Next level transition
  const nextLevel = useCallback(() => {
    const newLevelNum = stats.level + 1;
    const newConfig = getLevelConfig(newLevelNum, difficulty);
    setLevelConfig(newConfig);

    setStats((prev) => ({ ...prev, level: newLevelNum, chickensCaught: 0, chickensEscaped: 0 }));
    setChickens([]);
    totalSpawnedInLevelRef.current = 0;
    lastSpawnTimeRef.current = performance.now();
    setGameState('playing');
    soundManager.playVictory();
  }, [stats.level, difficulty, getLevelConfig]);

  // Spawn chicken helper
  const spawnChicken = useCallback(() => {
    const types = levelConfig.typesAllowed;
    const typeWeights = types.map((t) => {
      if (t === 'NORMAL') return 50;
      if (t === 'GOLDEN') return 20;
      if (t === 'NINJA') return 15;
      if (t === 'ROOSTER') return 10;
      if (t === 'BOMB') return 12;
      return 10;
    });

    const totalWeight = typeWeights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    let selectedType: ChickenType = 'NORMAL';

    for (let i = 0; i < types.length; i++) {
      if (rand < typeWeights[i]) {
        selectedType = types[i];
        break;
      }
      rand -= typeWeights[i];
    }

    const spec = CHICKEN_SPECS[selectedType];

    // Spawn at perimeter
    const spawnAngle = Math.random() * Math.PI - Math.PI / 2; // Semi-circle
    const spawnDistance = 8 + Math.random() * 3;
    const startX = Math.sin(spawnAngle) * spawnDistance - 2;
    const startZ = Math.cos(spawnAngle) * spawnDistance + 4;

    const newChicken: ChickenData = {
      id: `chicken_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: selectedType,
      position: { x: startX, y: 0.5, z: startZ },
      target: { ...COOP_TARGET },
      speed: spec.baseSpeed * levelConfig.speedMultiplier * (0.85 + Math.random() * 0.3),
      maxClicks: spec.clicksRequired,
      currentClicks: 0,
      caught: false,
      escaped: false,
      waddlePhase: Math.random() * Math.PI * 2,
      zigzagFrequency: 3 + Math.random() * 2,
      zigzagAmplitude: spec.zigzag ? 0.8 + Math.random() * 0.5 : 0,
      spawnTime: performance.now(),
    };

    setChickens((prev) => [...prev, newChicken]);
    totalSpawnedInLevelRef.current += 1;
    soundManager.playCluck();
  }, [levelConfig]);

  // Trigger Powerup
  const activatePowerUp = useCallback((type: 'freeze' | 'cornDecoy' | 'megaNet') => {
    setPowerUps((prev) => {
      if (prev[type].cooldown > 0 || prev[type].active) return prev;

      soundManager.playPowerup(type);

      if (type === 'freeze') {
        return {
          ...prev,
          freeze: { active: true, cooldown: 15, durationRemaining: 5 },
        };
      } else if (type === 'cornDecoy') {
        return {
          ...prev,
          cornDecoy: {
            active: true,
            cooldown: 18,
            durationRemaining: 6,
            pos: { ...CORN_DECOY_TARGET },
          },
        };
      } else {
        return {
          ...prev,
          megaNet: { active: true, cooldown: 12, durationRemaining: 6 },
        };
      }
    });
  }, []);

  // Handle catching chicken click
  const catchChicken = useCallback((chickenId: string): { caught: boolean; type: ChickenType; points: number; pos: { x: number; y: number; z: number } } | null => {
    let result: { caught: boolean; type: ChickenType; points: number; pos: { x: number; y: number; z: number } } | null = null;

    setChickens((prev) =>
      prev.map((c) => {
        if (c.id !== chickenId || c.caught || c.escaped) return c;

        const newClicks = c.currentClicks + 1;
        const isFullyCaught = newClicks >= c.maxClicks;
        const spec = CHICKEN_SPECS[c.type];

        if (isFullyCaught) {
          result = {
            caught: true,
            type: c.type,
            points: spec.points,
            pos: { ...c.position },
          };
          return { ...c, currentClicks: newClicks, caught: true };
        } else {
          soundManager.playCluck(1.4); // higher pitch hit sound
          return { ...c, currentClicks: newClicks };
        }
      })
    );

    // Update stats
    if (result) {
      const res = result as { caught: boolean; type: ChickenType; points: number; pos: { x: number; y: number; z: number } };
      const now = performance.now();
      const timeSinceLastClick = now - lastClickTimeRef.current;
      lastClickTimeRef.current = now;

      setStats((prevStats) => {
        const isCombo = timeSinceLastClick < 1200;
        const newCombo = isCombo ? prevStats.comboCount + 1 : 1;
        const comboMult = Math.min(Math.floor(newCombo / 3) + 1, 4);
        const earnedPoints = res.points > 0 ? res.points * comboMult : res.points;
        const newScore = Math.max(0, prevStats.score + earnedPoints);
        const newHighScore = Math.max(prevStats.highScore, newScore);

        if (newHighScore > prevStats.highScore) {
          localStorage.setItem('chicken_catch_highscore', newHighScore.toString());
        }

        // Sound effects
        soundManager.playDajajVoice(); // Voice shouting Dajaaaj!
        if (res.type === 'GOLDEN') soundManager.playGoldenCatch();
        else if (res.type === 'ROOSTER') soundManager.playRoosterCrow();
        else if (res.type === 'BOMB') soundManager.playBombHit();
        else soundManager.playCatch();

        return {
          ...prevStats,
          score: newScore,
          highScore: newHighScore,
          chickensCaught: prevStats.chickensCaught + 1,
          goldenCaught: prevStats.goldenCaught + (res.type === 'GOLDEN' ? 1 : 0),
          roostersCaught: prevStats.roostersCaught + (res.type === 'ROOSTER' ? 1 : 0),
          comboCount: newCombo,
          maxCombo: Math.max(prevStats.maxCombo, newCombo),
          successfulClicks: prevStats.successfulClicks + 1,
          totalClicks: prevStats.totalClicks + 1,
          accuracy: Math.round(((prevStats.successfulClicks + 1) / (prevStats.totalClicks + 1)) * 100),
        };
      });
    }

    return result;
  }, []);

  const registerMissClick = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      comboCount: 0,
      totalClicks: prev.totalClicks + 1,
      accuracy: Math.round((prev.successfulClicks / (prev.totalClicks + 1)) * 100),
    }));
  }, []);

  // Main game loop update timer (movement, escaping, powerup timers, level completion)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. PowerUp Durations & Cooldowns update
      setPowerUps((prev) => {
        const updatePower = (p: { active: boolean; cooldown: number; durationRemaining: number; pos?: { x: number; y: number; z: number } | null }) => {
          let newActive = p.active;
          let newDuration = p.durationRemaining;
          let newCooldown = p.cooldown;

          if (p.active) {
            newDuration -= delta;
            if (newDuration <= 0) {
              newActive = false;
              newDuration = 0;
            }
          }

          if (p.cooldown > 0) {
            newCooldown = Math.max(0, p.cooldown - delta);
          }

          return { ...p, active: newActive, durationRemaining: newDuration, cooldown: newCooldown };
        };

        return {
          freeze: updatePower(prev.freeze),
          cornDecoy: updatePower(prev.cornDecoy),
          megaNet: updatePower(prev.megaNet),
        };
      });

      // 2. Chicken Spawning
      const canSpawnMore = gameMode === 'endless' || totalSpawnedInLevelRef.current < levelConfig.chickenCount;

      if (canSpawnMore && currentTime - lastSpawnTimeRef.current > levelConfig.spawnInterval * 1000) {
        spawnChicken();
        lastSpawnTimeRef.current = currentTime;
      }

      // 3. Move Chickens
      setChickens((prevChickens) => {
        let newlyEscaped = 0;

        const updated = prevChickens.map((c) => {
          if (c.caught || c.escaped) return c;

          // Target decision: Corn decoy if active, else Coop cage
          const currentTarget = powerUps.cornDecoy.active && powerUps.cornDecoy.pos
            ? powerUps.cornDecoy.pos
            : COOP_TARGET;

          // Direction vector toward target
          const dx = currentTarget.x - c.position.x;
          const dz = currentTarget.z - c.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // Speed modifier if Freeze powerup active
          const speedMultiplier = powerUps.freeze.active ? 0.3 : 1.0;
          const effectiveSpeed = c.speed * speedMultiplier;

          // Waddling phase
          const newWaddle = c.waddlePhase + delta * 8 * speedMultiplier;

          // Movement step
          let moveX = (dx / (dist || 1)) * effectiveSpeed * delta;
          let moveZ = (dz / (dist || 1)) * effectiveSpeed * delta;

          // Zigzag offset for Ninja / Bomb chickens
          if (c.zigzagAmplitude > 0) {
            const perpX = -dz / (dist || 1);
            const perpZ = dx / (dist || 1);
            const zigzagOffset = Math.sin((currentTime / 1000) * c.zigzagFrequency) * c.zigzagAmplitude * delta;
            moveX += perpX * zigzagOffset;
            moveZ += perpZ * zigzagOffset;
          }

          const newX = c.position.x + moveX;
          const newZ = c.position.z + moveZ;

          // Check if reached target coop
          if (dist < 0.6 && currentTarget === COOP_TARGET) {
            newlyEscaped += 1;
            soundManager.playEscape();
            return {
              ...c,
              position: { x: newX, y: 0.5, z: newZ },
              escaped: true,
              waddlePhase: newWaddle,
            };
          }

          return {
            ...c,
            position: { x: newX, y: 0.5, z: newZ },
            target: currentTarget,
            waddlePhase: newWaddle,
          };
        });

        // If chickens escaped, update stats
        if (newlyEscaped > 0) {
          setStats((prevStats) => {
            const totalEscaped = prevStats.chickensEscaped + newlyEscaped;
            
            // Check Game Over
            if (gameMode === 'campaign' && totalEscaped >= levelConfig.allowedEscapes) {
              setGameState('game_over');
              soundManager.playGameOver();
            }

            return {
              ...prevStats,
              chickensEscaped: totalEscaped,
              comboCount: 0,
            };
          });
        }

        return updated;
      });

      // 4. Check Level Completion
      if (gameMode === 'campaign') {
        const allSpawned = totalSpawnedInLevelRef.current >= levelConfig.chickenCount;
        const allFinished = chickensRef.current.every((c) => c.caught || c.escaped);

        if (allSpawned && allFinished && chickensRef.current.length > 0) {
          if (stats.chickensEscaped < levelConfig.allowedEscapes) {
            setGameState('level_complete');
          }
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, gameMode, levelConfig, spawnChicken, powerUps.freeze.active, powerUps.cornDecoy.active, powerUps.cornDecoy.pos, stats.chickensEscaped]);

  return {
    gameState,
    setGameState,
    gameMode,
    difficulty,
    language,
    setLanguage,
    cameraView,
    setCameraView,
    chickens,
    stats,
    powerUps,
    levelConfig,
    startGame,
    nextLevel,
    activatePowerUp,
    catchChicken,
    registerMissClick,
  };
}
