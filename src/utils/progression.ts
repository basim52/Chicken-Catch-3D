export interface Achievement {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface ShopItem {
  id: string;
  category: 'weapon' | 'laser' | 'perk';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  icon: string;
  colorBadge: string;
  perkValue?: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  // WEAPONS
  {
    id: 'classic_rifle',
    category: 'weapon',
    titleAr: 'بندقية الصيد الكلاسيكية',
    titleEn: 'Classic Hunting Shotgun',
    descriptionAr: 'البندقية المزدوجة القياسية الخشبية، متوازنة وموثوقة للصيد',
    descriptionEn: 'Standard wooden double-barrel rifle, balanced and reliable.',
    price: 0,
    icon: '🔫',
    colorBadge: 'from-amber-700 to-amber-900 border-amber-600',
  },
  {
    id: 'sniper_rifle',
    category: 'weapon',
    titleAr: 'بندقية القناص التكتيكية Scoped',
    titleEn: 'Tactical Scoped Sniper',
    descriptionAr: 'مزودة بمنظار تكبير وتعمل بثبات عالي وتقليل اهتزاز المصوبة',
    descriptionEn: 'Equipped with optical scope and high aiming stability.',
    price: 350,
    icon: '🔭',
    colorBadge: 'from-slate-700 to-slate-900 border-sky-500',
  },
  {
    id: 'camo_rifle',
    category: 'weapon',
    titleAr: 'البندقية التكتيكية المموّهة',
    titleEn: 'Forest Camo Assault Rifle',
    descriptionAr: 'تمويه غابات الصيد الميداني مع ارتداد سريع وثبات عالٍ',
    descriptionEn: 'Military camouflage pattern with rapid recoil recovery.',
    price: 500,
    icon: '🌲',
    colorBadge: 'from-emerald-800 to-teal-900 border-emerald-500',
  },
  {
    id: 'golden_rifle',
    category: 'weapon',
    titleAr: 'بندقية النسر الذهبي 24K',
    titleEn: '24K Golden Eagle Rifle',
    descriptionAr: 'طلاء نقي من الذهب الخالص وتمنحك +15% نقاط مضاعفة على كل صيد!',
    descriptionEn: 'Pure 24K gold finish. Gives +15% bonus score multiplier!',
    price: 800,
    icon: '👑',
    colorBadge: 'from-amber-400 to-yellow-600 border-amber-300',
    perkValue: 1.15,
  },
  {
    id: 'plasma_blaster',
    category: 'weapon',
    titleAr: 'قاذف البلازما الفضائي الأسطوري',
    titleEn: 'Cyber Plasma Blaster',
    descriptionAr: 'سلاح مستقبلي يطلق شعاع طاقة مشع وتأثيرات بلازما مبهرة',
    descriptionEn: 'Futuristic sci-fi energy weapon with glowing plasma coils.',
    price: 1500,
    icon: '⚡',
    colorBadge: 'from-cyan-500 to-blue-700 border-cyan-400',
  },

  // LASERS / SIGHTS
  {
    id: 'red_laser',
    category: 'laser',
    titleAr: 'مؤشر الليزر الأحمر القياسي',
    titleEn: 'Standard Red Laser Sight',
    descriptionAr: 'مؤشر ليزر أحمر قياسي للمصوبة',
    descriptionEn: 'Standard high-vis red laser pointer.',
    price: 0,
    icon: '🔴',
    colorBadge: 'from-red-600 to-rose-800 border-red-500',
  },
  {
    id: 'green_laser',
    category: 'laser',
    titleAr: 'الليزر الأخضر الفوسفوري',
    titleEn: 'Neon Green Laser Sight',
    descriptionAr: 'شعاع فوسفوري شديد الوضوح في النهار وفي الليل',
    descriptionEn: 'Ultra-bright neon green targeting beam.',
    price: 150,
    icon: '🟢',
    colorBadge: 'from-emerald-500 to-green-700 border-emerald-400',
  },
  {
    id: 'cyan_plasma_laser',
    category: 'laser',
    titleAr: 'مؤشر البلازما السماوي',
    titleEn: 'Cyan Plasma Sight',
    descriptionAr: 'شعاع بلازما سماوي نبضي متوهج مريح للعين',
    descriptionEn: 'Pulsing cyan energy targeting beam.',
    price: 300,
    icon: '🔵',
    colorBadge: 'from-cyan-400 to-sky-600 border-cyan-300',
  },

  // PERKS / BUFFS
  {
    id: 'score_booster',
    category: 'perk',
    titleAr: 'مضاعف النقاط المحترف (+25%)',
    titleEn: 'Pro Score Booster (+25%)',
    descriptionAr: 'يمنحك 25% نقاطاً إضافية على كل صيد طوال اللعب!',
    descriptionEn: 'Permanently boosts earned points by +25% on every catch.',
    price: 600,
    icon: '🚀',
    colorBadge: 'from-purple-600 to-indigo-800 border-purple-400',
    perkValue: 1.25,
  },
  {
    id: 'golden_magnet',
    category: 'perk',
    titleAr: 'جاذب الطيور الذهبية والصقور',
    titleEn: 'Golden Bird & Falcon Magnet',
    descriptionAr: 'يزيد نسبة ظهور الدجاج الذهبي والصقر الأسطوري بمقدار 50%',
    descriptionEn: '+50% higher spawn rate for Golden Chickens and Royal Falcons.',
    price: 400,
    icon: '🧲',
    colorBadge: 'from-amber-500 to-orange-700 border-amber-400',
  },
];

export interface ProgressionData {
  maxUnlockedLevel: number;
  totalScore: number;
  highScore: number;
  achievements: Achievement[];
  unlockedItems: string[];
  equippedWeapon: string;
  equippedLaser: string;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_level',
    titleAr: 'الصياد المبتدئ',
    titleEn: 'Novice Hunter',
    descriptionAr: 'نجحت في إكمال المستوى الأول بنجاح',
    descriptionEn: 'Successfully complete level 1',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'stage_1',
    titleAr: 'سيد طيور المزرعة',
    titleEn: 'Farmyard Master',
    descriptionAr: 'إكمال المرحلة الأولى بالكامل (المستوى 25)',
    descriptionEn: 'Complete all Stage 1 levels (Level 25)',
    icon: '🐔',
    unlocked: false,
    progress: 0,
    target: 25,
  },
  {
    id: 'stage_2',
    titleAr: 'قناص الطيور البرية',
    titleEn: 'Wild Bird Sniper',
    descriptionAr: 'إكمال المرحلة الثانية بالكامل (المستوى 50)',
    descriptionEn: 'Complete all Stage 2 levels (Level 50)',
    icon: '🦆',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'stage_3',
    titleAr: 'خبير محمية الطرائد',
    titleEn: 'Safari Animal Expert',
    descriptionAr: 'إكمال المرحلة الثالثة بالكامل (المستوى 75)',
    descriptionEn: 'Complete all Stage 3 levels (Level 75)',
    icon: '🦊',
    unlocked: false,
    progress: 0,
    target: 75,
  },
  {
    id: 'stage_4',
    titleAr: 'أسطورة الصيد الكبرى',
    titleEn: 'Grand Hunting Legend',
    descriptionAr: 'إكمال جميع الـ 100 مستوى باحترافية!',
    descriptionEn: 'Complete all 100 hunting levels!',
    icon: '🦅',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: 'combo_10',
    titleAr: 'ملك الكومبو المتتالي',
    titleEn: '10x Combo Master',
    descriptionAr: 'تحقيق كومبو متتالي 10x بدون خطأ',
    descriptionEn: 'Achieve a 10x consecutive combo',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'golden_10',
    titleAr: 'جامع الذهب',
    titleEn: 'Gold Collector',
    descriptionAr: 'صيد 10 دجاجات ذهبية نادرة',
    descriptionEn: 'Catch 10 golden chickens',
    icon: '✨',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'sharpshooter',
    titleAr: 'رمية القناص (دقة 90%)',
    titleEn: 'Sharpshooter 90%',
    descriptionAr: 'إنهاء مستوى بدقة إصابة 90% أو أعلى',
    descriptionEn: 'Finish a level with 90%+ accuracy',
    icon: '🏹',
    unlocked: false,
    progress: 0,
    target: 90,
  },
  {
    id: 'score_2000',
    titleAr: 'جامع النقاط العالية',
    titleEn: '2000 Points Collector',
    descriptionAr: 'الوصول إلى مجموع 2,000 نقطة صيد',
    descriptionEn: 'Reach a score of 2,000 points',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    target: 2000,
  },
  {
    id: 'falcon_master',
    titleAr: 'صائد الصقر الأسطوري',
    titleEn: 'Golden Falcon Conqueror',
    descriptionAr: 'صيد الصقر الأسطوري الذهبي بنجاح',
    descriptionEn: 'Catch a Golden Royal Falcon',
    icon: '👑',
    unlocked: false,
    progress: 0,
    target: 1,
  },
];

const STORAGE_KEYS = {
  UNLOCKED_LEVEL: 'chicken_catch_unlocked_level',
  TOTAL_SCORE: 'chicken_catch_total_score',
  HIGH_SCORE: 'chicken_catch_highscore',
  ACHIEVEMENTS: 'chicken_catch_achievements_v2',
  UNLOCKED_ITEMS: 'chicken_catch_unlocked_items_v1',
  EQUIPPED_WEAPON: 'chicken_catch_equipped_weapon',
  EQUIPPED_LASER: 'chicken_catch_equipped_laser',
};

export function loadProgression(): ProgressionData {
  try {
    const maxUnlockedLevel = parseInt(localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL) || '1', 10);
    const totalScore = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_SCORE) || '0', 10);
    const highScore = parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0', 10);

    const savedAchJson = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    let achievements = DEFAULT_ACHIEVEMENTS;

    if (savedAchJson) {
      const parsed: Record<string, { unlocked: boolean; progress: number }> = JSON.parse(savedAchJson);
      achievements = DEFAULT_ACHIEVEMENTS.map((ach) => {
        if (parsed[ach.id]) {
          return {
            ...ach,
            unlocked: parsed[ach.id].unlocked,
            progress: parsed[ach.id].progress,
          };
        }
        return ach;
      });
    }

    const savedUnlockedItems = localStorage.getItem(STORAGE_KEYS.UNLOCKED_ITEMS);
    let unlockedItems = ['classic_rifle', 'red_laser'];
    if (savedUnlockedItems) {
      try {
        unlockedItems = JSON.parse(savedUnlockedItems);
        if (!unlockedItems.includes('classic_rifle')) unlockedItems.push('classic_rifle');
        if (!unlockedItems.includes('red_laser')) unlockedItems.push('red_laser');
      } catch (e) {
        console.error(e);
      }
    }

    const equippedWeapon = localStorage.getItem(STORAGE_KEYS.EQUIPPED_WEAPON) || 'classic_rifle';
    const equippedLaser = localStorage.getItem(STORAGE_KEYS.EQUIPPED_LASER) || 'red_laser';

    return {
      maxUnlockedLevel: Math.max(1, Math.min(100, maxUnlockedLevel)),
      totalScore,
      highScore,
      achievements,
      unlockedItems,
      equippedWeapon,
      equippedLaser,
    };
  } catch (e) {
    console.error('Error loading progression', e);
    return {
      maxUnlockedLevel: 1,
      totalScore: 0,
      highScore: 0,
      achievements: DEFAULT_ACHIEVEMENTS,
      unlockedItems: ['classic_rifle', 'red_laser'],
      equippedWeapon: 'classic_rifle',
      equippedLaser: 'red_laser',
    };
  }
}

export function saveProgressionData(data: ProgressionData) {
  try {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, data.maxUnlockedLevel.toString());
    localStorage.setItem(STORAGE_KEYS.TOTAL_SCORE, data.totalScore.toString());
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, data.highScore.toString());

    const achMap: Record<string, { unlocked: boolean; progress: number }> = {};
    data.achievements.forEach((ach) => {
      achMap[ach.id] = { unlocked: ach.unlocked, progress: ach.progress };
    });
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achMap));

    localStorage.setItem(STORAGE_KEYS.UNLOCKED_ITEMS, JSON.stringify(data.unlockedItems));
    localStorage.setItem(STORAGE_KEYS.EQUIPPED_WEAPON, data.equippedWeapon);
    localStorage.setItem(STORAGE_KEYS.EQUIPPED_LASER, data.equippedLaser);
  } catch (e) {
    console.error('Error saving progression', e);
  }
}

export function buyShopItem(
  currentData: ProgressionData,
  itemId: string
): { success: boolean; updatedData: ProgressionData; messageAr: string } {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, updatedData: currentData, messageAr: 'عنصر غير موجود' };
  }

  if (currentData.unlockedItems.includes(itemId)) {
    return { success: false, updatedData: currentData, messageAr: 'تم شراء هذا العنصر سابقاً' };
  }

  if (currentData.totalScore < item.price) {
    return {
      success: false,
      updatedData: currentData,
      messageAr: `نقاطك غير كافية! تحتاج إلى ${item.price} نقطة لشراء ${item.titleAr}`,
    };
  }

  const newTotalScore = currentData.totalScore - item.price;
  const newUnlockedItems = [...currentData.unlockedItems, itemId];

  let newEquippedWeapon = currentData.equippedWeapon;
  let newEquippedLaser = currentData.equippedLaser;

  if (item.category === 'weapon') newEquippedWeapon = itemId;
  if (item.category === 'laser') newEquippedLaser = itemId;

  const updatedData: ProgressionData = {
    ...currentData,
    totalScore: newTotalScore,
    unlockedItems: newUnlockedItems,
    equippedWeapon: newEquippedWeapon,
    equippedLaser: newEquippedLaser,
  };

  saveProgressionData(updatedData);

  return {
    success: true,
    updatedData,
    messageAr: `تم شراء ${item.titleAr} بنجاح وتجهيزه!`,
  };
}

export function equipShopItem(currentData: ProgressionData, itemId: string): ProgressionData {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item || !currentData.unlockedItems.includes(itemId)) return currentData;

  let newEquippedWeapon = currentData.equippedWeapon;
  let newEquippedLaser = currentData.equippedLaser;

  if (item.category === 'weapon') newEquippedWeapon = itemId;
  if (item.category === 'laser') newEquippedLaser = itemId;

  const updatedData: ProgressionData = {
    ...currentData,
    equippedWeapon: newEquippedWeapon,
    equippedLaser: newEquippedLaser,
  };

  saveProgressionData(updatedData);
  return updatedData;
}

export function evaluateAchievements(
  currentData: ProgressionData,
  completedLevelNum: number,
  levelScore: number,
  accuracy: number,
  maxCombo: number,
  goldenCaughtCount: number,
  falconCaught: boolean
): { updatedData: ProgressionData; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];

  const newUnlockedLevel = Math.max(currentData.maxUnlockedLevel, Math.min(100, completedLevelNum + 1));
  const newTotalScore = currentData.totalScore + levelScore;
  const newHighScore = Math.max(currentData.highScore, levelScore);

  const updatedAchievements = currentData.achievements.map((ach) => {
    let currentProgress = ach.progress;
    let isUnlocked = ach.unlocked;

    if (ach.id === 'first_level') {
      currentProgress = Math.max(currentProgress, completedLevelNum >= 1 ? 1 : 0);
    } else if (ach.id === 'stage_1') {
      currentProgress = Math.min(25, Math.max(currentProgress, completedLevelNum));
    } else if (ach.id === 'stage_2') {
      currentProgress = Math.min(50, Math.max(currentProgress, completedLevelNum));
    } else if (ach.id === 'stage_3') {
      currentProgress = Math.min(75, Math.max(currentProgress, completedLevelNum));
    } else if (ach.id === 'stage_4') {
      currentProgress = Math.min(100, Math.max(currentProgress, completedLevelNum));
    } else if (ach.id === 'combo_10') {
      currentProgress = Math.max(currentProgress, maxCombo);
    } else if (ach.id === 'golden_10') {
      currentProgress = Math.min(10, currentProgress + goldenCaughtCount);
    } else if (ach.id === 'sharpshooter') {
      currentProgress = Math.max(currentProgress, accuracy);
    } else if (ach.id === 'score_2000') {
      currentProgress = Math.max(currentProgress, newTotalScore);
    } else if (ach.id === 'falcon_master') {
      if (falconCaught) currentProgress = 1;
    }

    const shouldUnlock = !isUnlocked && currentProgress >= ach.target;
    if (shouldUnlock) {
      isUnlocked = true;
      newlyUnlocked.push({ ...ach, unlocked: true, progress: currentProgress });
    }

    return {
      ...ach,
      unlocked: isUnlocked,
      progress: currentProgress,
    };
  });

  const updatedData: ProgressionData = {
    maxUnlockedLevel: newUnlockedLevel,
    totalScore: newTotalScore,
    highScore: newHighScore,
    achievements: updatedAchievements,
  };

  saveProgressionData(updatedData);

  return { updatedData, newlyUnlocked };
}
