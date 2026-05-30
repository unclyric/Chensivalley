/* ============================================
   沉思谷物鱼 - Helper Functions
   Meditation Valley Fish
   ============================================ */

import { Season, Weather, TimeOfDay, FishRarity, GameTime } from './types';
import { DAYS_PER_SEASON, HOURS_PER_DAY } from './constants';

// ─── Random ──────────────────────────────────

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

export function chance(percent: number): boolean {
  return Math.random() * 100 < percent;
}

// ─── Time ────────────────────────────────────

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return TimeOfDay.Dawn;
  if (hour >= 7 && hour < 12) return TimeOfDay.Morning;
  if (hour >= 12 && hour < 17) return TimeOfDay.Afternoon;
  if (hour >= 17 && hour < 20) return TimeOfDay.Evening;
  return TimeOfDay.Night;
}

export function formatTime(time: GameTime): string {
  const h = time.hour.toString().padStart(2, '0');
  const m = time.minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDate(time: GameTime): string {
  const seasonNames: Record<Season, string> = {
    [Season.Spring]: '春',
    [Season.Summer]: '夏',
    [Season.Autumn]: '秋',
    [Season.Winter]: '冬',
  };
  return `第${time.year}年 ${seasonNames[time.season]} ${time.day}日`;
}

export function getSeasonName(season: Season): string {
  const names: Record<Season, string> = {
    [Season.Spring]: '春天',
    [Season.Summer]: '夏天',
    [Season.Autumn]: '秋天',
    [Season.Winter]: '冬天',
  };
  return names[season];
}

export function getWeatherName(weather: Weather): string {
  const names: Record<Weather, string> = {
    [Weather.Sunny]: '晴天',
    [Weather.Cloudy]: '多云',
    [Weather.Rainy]: '雨天',
    [Weather.Stormy]: '暴风雨',
  };
  return names[weather];
}

export function getRarityName(rarity: FishRarity): string {
  const names: Record<FishRarity, string> = {
    [FishRarity.Common]: '普通',
    [FishRarity.Uncommon]: '少见',
    [FishRarity.Rare]: '稀有',
    [FishRarity.Epic]: '史诗',
    [FishRarity.Legendary]: '传说',
  };
  return names[rarity];
}

export function getRarityColor(rarity: FishRarity): string {
  const colors: Record<FishRarity, string> = {
    [FishRarity.Common]: '#a0a0a0',
    [FishRarity.Uncommon]: '#4a9f4a',
    [FishRarity.Rare]: '#4a8fbf',
    [FishRarity.Epic]: '#a04abf',
    [FishRarity.Legendary]: '#d4a853',
  };
  return colors[rarity];
}

// ─── Formatting ──────────────────────────────

export function formatGold(amount: number): string {
  return `${amount.toLocaleString()} G`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── IDs ─────────────────────────────────────

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ─── Array Helpers ───────────────────────────

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ─── Weather Calculation ─────────────────────

export function calculateNextWeather(current: Weather, season: Season): Weather {
  // Weather probabilities vary by season
  const probabilities: Record<Season, Record<Weather, number>> = {
    [Season.Spring]: {
      [Weather.Sunny]: 0.4,
      [Weather.Cloudy]: 0.3,
      [Weather.Rainy]: 0.25,
      [Weather.Stormy]: 0.05,
    },
    [Season.Summer]: {
      [Weather.Sunny]: 0.5,
      [Weather.Cloudy]: 0.3,
      [Weather.Rainy]: 0.15,
      [Weather.Stormy]: 0.05,
    },
    [Season.Autumn]: {
      [Weather.Sunny]: 0.35,
      [Weather.Cloudy]: 0.35,
      [Weather.Rainy]: 0.2,
      [Weather.Stormy]: 0.1,
    },
    [Season.Winter]: {
      [Weather.Sunny]: 0.3,
      [Weather.Cloudy]: 0.4,
      [Weather.Rainy]: 0.2,
      [Weather.Stormy]: 0.1,
    },
  };

  const probs = probabilities[season];
  const r = Math.random();
  let cumulative = 0;

  for (const [weather, prob] of Object.entries(probs)) {
    cumulative += prob;
    if (r <= cumulative) return weather as Weather;
  }

  return Weather.Sunny;
}

// ─── Fish Value Calculation ──────────────────

export function calculateFishValue(
  baseValue: number,
  size: number,
  maxSize: number,
  quality: number,
  rarity: FishRarity,
  weather: Weather,
  perfect: boolean
): number {
  let value = baseValue;

  // Size bonus: bigger fish = more value
  const sizeRatio = size / maxSize;
  value *= (0.8 + sizeRatio * 0.4);

  // Quality bonus
  value *= (0.5 + (quality / 100) * 0.5);

  // Rarity multiplier
  const rarityMultiplier: Record<FishRarity, number> = {
    [FishRarity.Common]: 1,
    [FishRarity.Uncommon]: 1.5,
    [FishRarity.Rare]: 2.5,
    [FishRarity.Epic]: 4,
    [FishRarity.Legendary]: 8,
  };
  value *= rarityMultiplier[rarity];

  // Weather bonus: rainy weather = better prices
  if (weather === Weather.Rainy) value *= 1.2;
  if (weather === Weather.Stormy) value *= 1.5;

  // Perfect catch bonus
  if (perfect) value *= 1.5;

  return Math.round(value);
}

// ─── Fish Availability ───────────────────────

export function isFishAvailable(
  fishSeasons: Season[],
  fishTimeOfDay: TimeOfDay[],
  fishWeather: Weather[],
  currentSeason: Season,
  currentHour: number,
  currentWeather: Weather
): boolean {
  const seasonMatch = fishSeasons.includes(currentSeason);
  const timeMatch = fishTimeOfDay.includes(getTimeOfDay(currentHour));
  const weatherMatch = fishWeather.length === 0 || fishWeather.includes(currentWeather);
  return seasonMatch && timeMatch && weatherMatch;
}
