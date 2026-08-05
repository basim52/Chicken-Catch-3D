export type GameState = 'menu' | 'playing' | 'paused' | 'level_complete' | 'game_over';

export type GameMode = 'campaign' | 'endless';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Language = 'ar' | 'en';

export type ChickenType =
  | 'NORMAL'
  | 'GOLDEN'
  | 'NINJA'
  | 'ROOSTER'
  | 'BOMB'
  | 'DUCK'
  | 'PIGEON'
  | 'PHEASANT'
  | 'TURKEY'
  | 'EAGLE'
  | 'RABBIT'
  | 'FOX'
  | 'DEER'
  | 'FALCON';

export interface ChickenSpec {
  type: ChickenType;
  nameEn: string;
  nameAr: string;
  points: number;
  baseSpeed: number;
  clicksRequired: number;
  colorHex: number;
  scale: number;
  zigzag: boolean;
  isDanger: boolean;
  category?: 'bird' | 'animal' | 'legendary';
}

export interface ChickenData {
  id: string;
  type: ChickenType;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  speed: number;
  maxClicks: number;
  currentClicks: number;
  caught: boolean;
  escaped: boolean;
  waddlePhase: number;
  zigzagFrequency: number;
  zigzagAmplitude: number;
  spawnTime: number;
}

export interface LevelConfig {
  levelNumber: number;
  stageNumber: number; // 1, 2, 3, 4
  stageTitleAr: string;
  stageTitleEn: string;
  stageIcon: string;
  targetScore: number;
  chickenCount: number;
  allowedEscapes: number;
  spawnInterval: number; // in seconds
  typesAllowed: ChickenType[];
  speedMultiplier: number;
}

export interface PowerUpState {
  freeze: { active: boolean; cooldown: number; durationRemaining: number };
  cornDecoy: { active: boolean; cooldown: number; durationRemaining: number; pos: { x: number; y: number; z: number } | null };
  megaNet: { active: boolean; cooldown: number; durationRemaining: number };
}

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  chickensCaught: number;
  chickensEscaped: number;
  goldenCaught: number;
  roostersCaught: number;
  comboCount: number;
  maxCombo: number;
  accuracy: number; // percentage
  totalClicks: number;
  successfulClicks: number;
}

export interface FloatingText {
  id: string;
  text: string;
  color: string;
  position: { x: number; y: number; z: number };
  life: number; // 0 to 1
}

export type CameraViewMode = 'default' | 'top_down' | 'close';
