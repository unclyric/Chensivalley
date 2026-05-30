/* ============================================
   沉思谷物鱼 - Game Constants
   Meditation Valley Fish
   ============================================ */

import { Season, Weather, RodType, BaitType, PondSize, FishingLocation } from './types';

// ─── Time Constants ──────────────────────────

export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_SEASON = 30; // 30 days per season for full experience
export const SEASONS_PER_YEAR = 4;
export const REAL_SECONDS_PER_GAME_MINUTE = 1; // 1 real second = 1 game minute
export const DAWN_HOUR = 5;
export const MORNING_HOUR = 7;
export const AFTERNOON_HOUR = 12;
export const EVENING_HOUR = 17;
export const NIGHT_HOUR = 20;

// ─── Season Names ────────────────────────────

export const SEASON_NAMES: Record<Season, string> = {
  [Season.Spring]: '春',
  [Season.Summer]: '夏',
  [Season.Autumn]: '秋',
  [Season.Winter]: '冬',
};

// ─── Weather Names ───────────────────────────

export const WEATHER_NAMES: Record<Weather, string> = {
  [Weather.Sunny]: '晴天',
  [Weather.Cloudy]: '多云',
  [Weather.Rainy]: '雨天',
  [Weather.Stormy]: '暴风雨',
};

export const WEATHER_ICONS: Record<Weather, string> = {
  [Weather.Sunny]: '☀️',
  [Weather.Cloudy]: '☁️',
  [Weather.Rainy]: '🌧️',
  [Weather.Stormy]: '⛈️',
};

// ─── Rod Stats ───────────────────────────────

export const ROD_STATS: Record<RodType, {
  name: string;
  castDistance: number;
  biteRate: number;     // multiplier
  rareChance: number;   // bonus percentage
  price: number;
  description: string;
}> = {
  [RodType.Wooden]: {
    name: '木制鱼竿',
    castDistance: 3,
    biteRate: 1.0,
    rareChance: 0,
    price: 0,
    description: '一把简单的木制鱼竿，适合初学者。',
  },
  [RodType.Copper]: {
    name: '铜制鱼竿',
    castDistance: 4,
    biteRate: 1.2,
    rareChance: 5,
    price: 500,
    description: '铜质配件让鱼竿更坚固耐用。',
  },
  [RodType.Iron]: {
    name: '铁制鱼竿',
    castDistance: 5,
    biteRate: 1.4,
    rareChance: 10,
    price: 1500,
    description: '铁质鱼竿能抛得更远，钓到更好的鱼。',
  },
  [RodType.Silver]: {
    name: '银制鱼竿',
    castDistance: 6,
    biteRate: 1.6,
    rareChance: 15,
    price: 4000,
    description: '银光闪闪，鱼儿更容易被吸引。',
  },
  [RodType.Gold]: {
    name: '黄金鱼竿',
    castDistance: 8,
    biteRate: 2.0,
    rareChance: 25,
    price: 10000,
    description: '传说级别的鱼竿，只有最厉害的渔夫才能驾驭。',
  },
};

// ─── Bait Stats ──────────────────────────────

export const BAIT_STATS: Record<BaitType, {
  name: string;
  biteRateBonus: number;
  rareChanceBonus: number;
  price: number;
  description: string;
}> = {
  [BaitType.None]: {
    name: '无鱼饵',
    biteRateBonus: 0,
    rareChanceBonus: 0,
    price: 0,
    description: '不使用鱼饵。',
  },
  [BaitType.Worm]: {
    name: '蚯蚓',
    biteRateBonus: 0.2,
    rareChanceBonus: 2,
    price: 10,
    description: '最常见的鱼饵，鱼都爱吃。',
  },
  [BaitType.Shrimp]: {
    name: '虾饵',
    biteRateBonus: 0.3,
    rareChanceBonus: 5,
    price: 30,
    description: '用虾做饵，能吸引更大的鱼。',
  },
  [BaitType.Artificial]: {
    name: '人造饵',
    biteRateBonus: 0.4,
    rareChanceBonus: 8,
    price: 80,
    description: '精心制作的假饵，骗过聪明的鱼。',
  },
  [BaitType.Special]: {
    name: '特制鱼饵',
    biteRateBonus: 0.5,
    rareChanceBonus: 15,
    price: 200,
    description: '秘方配制的鱼饵，传说能引来神鱼。',
  },
};

// ─── Pond Stats ──────────────────────────────

export const POND_STATS: Record<PondSize, {
  name: string;
  capacity: number;
  buildCost: number;
  upgradeCost: number;
  materials: { itemId: string; quantity: number }[];
  description: string;
}> = {
  [PondSize.Small]: {
    name: '小鱼塘',
    capacity: 3,
    buildCost: 500,
    upgradeCost: 300,
    materials: [{ itemId: 'wood', quantity: 20 }, { itemId: 'stone', quantity: 10 }],
    description: '小型鱼塘，最多养3种鱼。',
  },
  [PondSize.Medium]: {
    name: '中鱼塘',
    capacity: 6,
    buildCost: 1500,
    upgradeCost: 1000,
    materials: [{ itemId: 'wood', quantity: 50 }, { itemId: 'stone', quantity: 30 }, { itemId: 'iron_ingot', quantity: 5 }],
    description: '中型鱼塘，最多养6种鱼。',
  },
  [PondSize.Large]: {
    name: '大鱼塘',
    capacity: 10,
    buildCost: 5000,
    upgradeCost: 3000,
    materials: [{ itemId: 'wood', quantity: 100 }, { itemId: 'stone', quantity: 60 }, { itemId: 'iron_ingot', quantity: 15 }, { itemId: 'gold_ingot', quantity: 3 }],
    description: '大型鱼塘，最多养10种鱼。',
  },
};

// ─── Location Names ──────────────────────────

export const LOCATION_NAMES: Record<FishingLocation, string> = {
  [FishingLocation.MeditationLake]: '大辟谷',
  [FishingLocation.NanmingRiver]: '南明河',
  [FishingLocation.WestLake]: '西湖',
  [FishingLocation.YangyeMarsh]: '羊叶泽',
};

export const LOCATION_DESCRIPTIONS: Record<FishingLocation, string> = {
  [FishingLocation.MeditationLake]: '一片宁静的湖泊，传说在此垂钓能让心灵沉淀。适合新手练习的好地方。',
  [FishingLocation.NanmingRiver]: '河水清澈见底，两岸柳树成荫。这里能钓到一些不错的淡水鱼。',
  [FishingLocation.WestLake]: '风景如画的西湖，深水区藏着不少珍稀鱼种。需要一定的技巧才能在这里钓鱼。',
  [FishingLocation.YangyeMarsh]: '隐藏在密林深处的沼泽地，据说这里栖息着传说中的神鱼。只有最勇敢的渔夫才敢来此。',
};

// ─── Location Unlock Requirements ────────────

export const LOCATION_UNLOCK: Record<FishingLocation, {
  level: number;
  fishCaught: number;
  questRequired?: string;
}> = {
  [FishingLocation.MeditationLake]: { level: 0, fishCaught: 0 },
  [FishingLocation.NanmingRiver]: { level: 0, fishCaught: 3 },
  [FishingLocation.WestLake]: { level: 0, fishCaught: 8 },
  [FishingLocation.YangyeMarsh]: { level: 0, fishCaught: 20, questRequired: 'hidden_marsh_discovery' },
};

// ─── Player Constants ────────────────────────

export const MAX_ENERGY = 200;
export const MAX_INVENTORY_SLOTS = 36;
export const STARTING_GOLD = 500;
export const PLAYER_SPEED = 120; // pixels per second
export const PLAYER_SPRITE_SIZE = 16;

// ─── Map Dimensions ──────────────────────────

export const TILE_SIZE = 16;
export const MAP_WIDTH = 60;  // tiles
export const MAP_HEIGHT = 40; // tiles

// ─── Save Constants ──────────────────────────

export const SAVE_KEY = 'meditation_valley_fish_save';
export const SAVE_VERSION = '1.0.0';
export const AUTO_SAVE_INTERVAL = 5; // real minutes

// ─── Color Palette ───────────────────────────

export const PALETTE = {
  // Water tones
  waterDeep: 0x1a5276,
  waterMedium: 0x2980b9,
  waterShallow: 0x3498db,
  waterSurface: 0x85c1e9,

  // Ground tones
  grassLight: 0x7dcea0,
  grassMedium: 0x52be80,
  grassDark: 0x1e8449,
  dirt: 0xaf7d4b,
  sand: 0xf0d9b5,
  stone: 0x808b96,
  path: 0xc4a87c,

  // Tree/Plant tones
  treeTrunk: 0x6e4c1e,
  treeLeaves: 0x2d7a2d,
  treeLeavesLight: 0x4da64d,
  bushGreen: 0x3d7a3d,
  flowerPink: 0xe8a0bf,
  flowerYellow: 0xf4d03f,
  reedBrown: 0xb8956a,

  // Building tones
  woodDark: 0x5d4e37,
  woodMedium: 0x8b6914,
  woodLight: 0xc4a35a,
  roofRed: 0xa04040,
  roofBlue: 0x4a6fa5,
  wallWhite: 0xf5f0e1,

  // Character tones
  skinLight: 0xfce4c8,
  skinMedium: 0xe8c39e,
  hairBrown: 0x5d3a1a,
  hairBlack: 0x2c1810,
  hairGrey: 0x9e9e9e,
  clothesBlue: 0x4a7cbf,
  clothesGreen: 0x4a8f4a,
  clothesRed: 0xbf4a4a,

  // UI tones
  uiDark: 0x2d1b2e,
  uiMedium: 0x3d2b3e,
  uiBorder: 0x5a3d5c,
  uiText: 0xe8d5c4,
  uiAccent: 0x7eb5a6,
  uiGold: 0xd4a853,
  uiHeart: 0xe85d75,
};
