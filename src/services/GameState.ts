/* ============================================
   沉思谷物鱼 - Central Game State (Zustand)
   Meditation Valley Fish
   ============================================ */

import { create } from 'zustand';
import {
  GameTime, WeatherState, PlayerData, UIPanel, FishingMinigameState,
  Season, Weather, RodType, BaitType, FishingLocation, InventoryItem,
  ItemCategory, Building, FishPond, QuestProgress, FishData, NPCData,
} from '../utils/types';
import {
  MAX_ENERGY, STARTING_GOLD, MAX_INVENTORY_SLOTS,
} from '../utils/constants';
import { ALL_FISH } from '../data/fish';
import { ALL_NPCS } from '../data/npcs';
import { ALL_QUESTS } from '../data/quests';
import { ITEM_DEFINITIONS } from '../data/items';

// ─── Game State Interface ────────────────────

export interface GameStateStore {
  // Game phase
  gameStarted: boolean;
  gamePaused: boolean;

  // Time
  time: GameTime;
  weather: WeatherState;

  // Player
  player: PlayerData;

  // UI
  currentPanel: UIPanel;
  dialogNPCId: string | null;
  dialogTexts: string[];
  dialogIndex: number;
  notification: string | null;

  // Data references
  fishData: Record<string, FishData>;
  npcData: Record<string, NPCData>;

  // Active quests
  activeQuests: QuestProgress[];

  // Fishing minigame
  fishingGame: FishingMinigameState;

  // Global flags
  flags: Record<string, boolean>;

  // Action effect for visual feedback
  actionEffect: { type: string; icon: string; time: number } | null;
  triggerActionEffect: (type: string, icon: string) => void;

  // Building version counter for re-rendering
  buildingsVersion: number;

  // ─── Actions ──────────────────────────────

  // Game flow
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;

  // Time
  advanceTime: (minutes: number) => void;
  setWeather: (weather: Weather) => void;
  advanceDay: () => void;

  // Player
  movePlayer: (x: number, y: number) => void;
  changeMap: (map: FishingLocation) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  useEnergy: (amount: number) => boolean;
  restoreEnergy: (amount: number) => void;
  setRod: (rod: RodType) => void;
  equipBait: (bait: BaitType) => void;

  // Inventory
  addItem: (item: InventoryItem) => boolean;
  removeItem: (itemId: string, quantity: number) => boolean;
  hasItem: (itemId: string, quantity?: number) => boolean;
  sellFish: (fishId: string) => number; // returns gold earned
  useItem: (itemId: string) => { success: boolean; message: string }; // use consumable

  // Encyclopedia
  discoverFish: (fishId: string) => void;
  isFishDiscovered: (fishId: string) => boolean;

  // Quest
  acceptQuest: (questId: string) => void;
  checkQuestProgress: (actionType: string, target: string, quantity?: number) => void;
  updateQuestProgress: (questId: string, objectiveIndex: number, progress: number) => void;
  completeQuest: (questId: string) => void;

  // Relationships
  changeRelationship: (npcId: string, amount: number) => void;
  getRelationship: (npcId: string) => number;

  // Buildings
  addBuilding: (building: Building) => void;
  upgradeBuilding: (buildingId: string) => void;
  removeBuilding: (buildingId: string) => void;

  // Fish Ponds
  addFishPond: (pond: FishPond) => void;
  feedPond: (pondId: string, amount: number) => void;
  harvestPond: (pondId: string) => InventoryItem[];
  addFishToPond: (pondId: string, fishId: string, count: number) => void;

  // Fishing
  startFishing: (fish: FishData) => void;
  updateFishingBar: (barPosition: number) => void;
  endFishing: (success: boolean) => { fish: FishData; size: number; quality: number; perfect: boolean } | null;

  // UI
  openPanel: (panel: UIPanel) => void;
  closePanel: () => void;
  startDialog: (npcId: string, texts: string[]) => void;
  advanceDialog: () => boolean; // returns false if dialog ended
  showNotification: (text: string) => void;
  clearNotification: () => void;
}

// ─── Default State ───────────────────────────

const defaultTime: GameTime = {
  year: 1,
  season: Season.Spring,
  day: 1,
  hour: 7,
  minute: 0,
};

const defaultWeather: WeatherState = {
  current: Weather.Sunny,
  nextDay: Weather.Sunny,
  transitionProgress: 0,
};

const defaultPlayer: PlayerData = {
  name: '沉思鱼',
  gold: STARTING_GOLD,
  position: { x: 30, y: 12 }, // 出生在草地上，上方就是湖岸
  currentMap: FishingLocation.MeditationLake,
  energy: MAX_ENERGY,
  maxEnergy: MAX_ENERGY,
  rodType: RodType.Wooden,
  equippedBait: BaitType.None,
  inventory: [
    { id: '1', itemId: 'bait_worm', category: ItemCategory.Bait, quantity: 20 },
  ],
  fishCaught: [],
  completedQuests: [],
  relationships: {},
  buildings: [],
  fishPonds: [],
  totalFishCaught: 0,
  playTime: 0,
  discoveredRecipes: [],
  decorations: [],
};

const defaultFishingGame: FishingMinigameState = {
  active: false,
  fish: null,
  barPosition: 50,
  barSize: 20,
  fishPosition: 50,
  fishDirection: 1,
  fishSpeed: 1,
  progress: 0,
  maxProgress: 100,
  perfect: true,
};

// ─── Create Store ────────────────────────────

export const useGameStore = create<GameStateStore>((set, get) => ({
  // Initial state
  gameStarted: false,
  gamePaused: false,
  time: { ...defaultTime },
  weather: { ...defaultWeather },
  player: { ...defaultPlayer },
  currentPanel: 'main_menu',
  dialogNPCId: null,
  dialogTexts: [],
  dialogIndex: 0,
  notification: null,
  fishData: Object.fromEntries(ALL_FISH.map(f => [f.id, { ...f }])),
  npcData: Object.fromEntries(ALL_NPCS.map(n => [n.id, { ...n }])),
  activeQuests: [],
  fishingGame: { ...defaultFishingGame },
  flags: {},
  actionEffect: null,
  buildingsVersion: 0,

  // ─── Game Flow ─────────────────────────────
  startGame: () => set({
    gameStarted: true,
    currentPanel: 'none',
    time: { ...defaultTime },
    weather: { ...defaultWeather },
    player: {
      ...defaultPlayer,
      inventory: [
        { id: '1', itemId: 'bait_worm', category: ItemCategory.Bait, quantity: 20 },
      ],
    },
    activeQuests: [],
    fishingGame: { ...defaultFishingGame },
  }),

  pauseGame: () => set({ gamePaused: true }),
  resumeGame: () => set({ gamePaused: false }),

  // ─── Time ──────────────────────────────────
  advanceTime: (minutes: number) => {
    const state = get();
    if (state.gamePaused) return;

    let { year, season, day, hour, minute } = state.time;
    minute += minutes;
    let advancedDay = false;

    while (minute >= 60) {
      minute -= 60;
      hour += 1;
      if (hour >= 24) {
        hour -= 24;
        day += 1;
        advancedDay = true;
        if (day > 30) {
          day = 1;
          const seasonOrder = [Season.Spring, Season.Summer, Season.Autumn, Season.Winter];
          const idx = seasonOrder.indexOf(season);
          if (idx === 3) {
            season = Season.Spring;
            year += 1;
          } else {
            season = seasonOrder[idx + 1];
          }
        }
      }
    }

    const newTime: GameTime = { year, season, day, hour, minute };
    set({
      time: newTime,
      player: { ...state.player, playTime: state.player.playTime + minutes },
    });

    if (advancedDay) {
      get().advanceDay();
    }
  },

  advanceDay: () => {
    const state = get();
    const newWeather = state.weather.nextDay;
    // Calculate next day's weather
    const probs = getSeasonWeatherProbs(state.time.season);
    const r = Math.random();
    let cumulative = 0;
    let nextDayWeather = Weather.Sunny;
    for (const [w, prob] of Object.entries(probs)) {
      cumulative += prob;
      if (r <= cumulative) { nextDayWeather = w as Weather; break; }
    }
    set({
      weather: {
        current: newWeather,
        nextDay: nextDayWeather,
        transitionProgress: 0,
      },
      player: {
        ...state.player,
        energy: Math.min(state.player.maxEnergy, state.player.energy + 50), // Restore some energy overnight
      },
    });
  },

  setWeather: (weather: Weather) => set(state => ({
    weather: { ...state.weather, current: weather },
  })),

  // ─── Player ────────────────────────────────
  movePlayer: (x: number, y: number) => set(state => ({
    player: { ...state.player, position: { x, y } },
  })),

  changeMap: (map: FishingLocation) => set(state => ({
    player: { ...state.player, currentMap: map },
  })),

  addGold: (amount: number) => {
    set(state => ({
      player: { ...state.player, gold: state.player.gold + amount },
    }));
    // Trigger quest progress for gold threshold
    get().checkQuestProgress('reach_gold', 'any', amount);
  },

  spendGold: (amount: number) => {
    const state = get();
    if (state.player.gold >= amount) {
      set({ player: { ...state.player, gold: state.player.gold - amount } });
      return true;
    }
    return false;
  },

  useEnergy: (amount: number) => {
    const state = get();
    if (state.player.energy >= amount) {
      set({ player: { ...state.player, energy: state.player.energy - amount } });
      return true;
    }
    return false;
  },

  restoreEnergy: (amount: number) => set(state => ({
    player: {
      ...state.player,
      energy: Math.min(state.player.maxEnergy, state.player.energy + amount),
    },
  })),

  setRod: (rod: RodType) => set(state => ({
    player: { ...state.player, rodType: rod },
  })),

  equipBait: (bait: BaitType) => set(state => ({
    player: { ...state.player, equippedBait: bait },
  })),

  // ─── Inventory ─────────────────────────────
  addItem: (item: InventoryItem) => {
    const state = get();
    const inv = [...state.player.inventory];

    // Try to stack with existing item
    const existing = inv.find(i => i.itemId === item.itemId && i.category === item.category);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      if (inv.length >= MAX_INVENTORY_SLOTS) return false;
      inv.push({ ...item, id: item.id || Date.now().toString(36) });
    }

    set({ player: { ...state.player, inventory: inv } });
    return true;
  },

  removeItem: (itemId: string, quantity: number) => {
    const state = get();
    const inv = [...state.player.inventory];
    const idx = inv.findIndex(i => i.itemId === itemId);
    if (idx === -1) return false;

    if (inv[idx].quantity <= quantity) {
      inv.splice(idx, 1);
    } else {
      inv[idx] = { ...inv[idx], quantity: inv[idx].quantity - quantity };
    }

    set({ player: { ...state.player, inventory: inv } });
    return true;
  },

  hasItem: (itemId: string, quantity = 1) => {
    const state = get();
    const item = state.player.inventory.find(i => i.itemId === itemId);
    return item ? item.quantity >= quantity : false;
  },

  sellFish: (fishId: string) => {
    const state = get();
    const fish = state.fishData[fishId];
    if (!fish) return 0;

    // Remove from inventory
    const inv = [...state.player.inventory];
    const idx = inv.findIndex(i => i.itemId === fishId && i.category === ItemCategory.Fish);
    if (idx === -1) return 0;
    if (inv[idx].quantity <= 1) inv.splice(idx, 1);
    else inv[idx] = { ...inv[idx], quantity: inv[idx].quantity - 1 };

    const value = fish.baseValue;
    set({
      player: {
        ...state.player,
        gold: state.player.gold + value,
        inventory: inv,
      },
    });
    return value;
  },

  // ─── Use Item (stamina recovery) ──────────
  useItem: (itemId: string) => {
    const state = get();
    const def = ITEM_DEFINITIONS[itemId];
    if (!def || def.category !== ItemCategory.Food) {
      return { success: false, message: '这个物品不能使用' };
    }
    // Check if player has the item
    const invItem = state.player.inventory.find(i => i.itemId === itemId);
    if (!invItem || invItem.quantity <= 0) {
      return { success: false, message: '背包中没有这个物品' };
    }
    // Restore energy based on item (handle both short and shop-prefixed IDs)
    const energyRestore: Record<string, number> = {
      bento: 30, food_bento: 30,
      tea: 50, food_tea: 50,
      fish_rice: 80, food_fish_rice: 80,
    };
    const restore = energyRestore[itemId] || 20;
    const currentEnergy = state.player.energy;
    if (currentEnergy >= state.player.maxEnergy) {
      return { success: false, message: '体力已经满了！' };
    }

    // Remove item from inventory
    get().removeItem(itemId, 1);
    // Restore energy (uses built-in cap)
    get().restoreEnergy(restore);
    // Show visual effect
    get().triggerActionEffect('use_item', def.icon);
    return { success: true, message: `使用了${def.name}，恢复了${restore}点体力！` };
  },

  // ─── Encyclopedia ──────────────────────────
  discoverFish: (fishId: string) => set(state => ({
    fishData: {
      ...state.fishData,
      [fishId]: { ...state.fishData[fishId], isDiscovered: true },
    },
  })),

  isFishDiscovered: (fishId: string) => {
    return get().fishData[fishId]?.isDiscovered ?? false;
  },

  // ─── Quests ────────────────────────────────
  acceptQuest: (questId: string) => {
    const state = get();
    if (state.activeQuests.find(q => q.questId === questId)) return;

    // Find quest data and initialize objectives
    const questData = ALL_QUESTS.find(q => q.id === questId);
    if (!questData) return;

    const objectives = questData.objectives.map((obj, i) => ({
      index: i,
      progress: 0,
    }));

    set({
      activeQuests: [...state.activeQuests, {
        questId,
        started: true,
        objectives,
        completed: false,
        daysRemaining: questData.timeLimit || 0,
      }],
    });

    // Auto-track "talk to NPC" if the quest giver is talking right now
    if (questData.npcGiver) {
      // Don't auto-complete talk objective; player needs to talk again
    }
  },

  // Check and update quest progress after game actions
  checkQuestProgress: (actionType: string, target: string, quantity: number = 1) => {
    const state = get();
    let totalGoldReward = 0;
    const rewardItems: { itemId: string; quantity: number }[] = [];
    const relationshipBoosts: { npcId: string; amount: number }[] = [];
    const completedQuestIds: string[] = [];

    const newQuests = state.activeQuests.map(aq => {
      if (aq.completed) return aq;
      const questData = ALL_QUESTS.find(q => q.id === aq.questId);
      if (!questData) return aq;

      let allComplete = true;
      const newObjectives = aq.objectives.map((obj, i) => {
        const objDef = questData.objectives[i];
        if (!objDef) return obj;

        let newProgress = obj.progress;

        if (objDef.type === 'catch_fish' && actionType === 'catch_fish') {
          const targetMatch =
            objDef.target === 'any' ||
            objDef.target === target ||
            (objDef.target === 'any_legendary' && ['dragon_scale_fish','phantom_light_fish','yangye_leaf_fish','old_man_fish','marsh_king'].includes(target)) ||
            (objDef.target === 'any_nanming' && state.fishData[target]?.locations?.includes(FishingLocation.NanmingRiver)) ||
            (objDef.target === 'any_west_lake' && state.fishData[target]?.locations?.includes(FishingLocation.WestLake)) ||
            (objDef.target === 'all_fish' && state.player.fishCaught.includes(target));
          if (targetMatch) {
            newProgress = Math.min(objDef.quantity, obj.progress + quantity);
          }
        }
        if (objDef.type === 'talk_to_npc' && actionType === 'talk_to_npc' && objDef.target === target) {
          newProgress = Math.min(objDef.quantity, obj.progress + quantity);
        }
        if (objDef.type === 'collect_item' && actionType === 'collect_item' && objDef.target === target) {
          newProgress = Math.min(objDef.quantity, obj.progress + quantity);
        }
        if (objDef.type === 'build_structure' && actionType === 'build_structure') {
          const targetMatch =
            objDef.target === 'any_building' ||
            objDef.target === target ||
            (objDef.target === 'fish_pond_small' && (target === 'fish_pond' || target === 'fish_pond_small')) ||
            (objDef.target === 'feed_pond' && target === 'feed_pond');
          if (targetMatch) {
            newProgress = Math.min(objDef.quantity, obj.progress + quantity);
          }
        }
        if (objDef.type === 'reach_gold' && actionType === 'reach_gold') {
          const targetGold = parseInt(objDef.target) || 0;
          newProgress = state.player.gold >= targetGold ? objDef.quantity : 0;
        }
        if (objDef.type === 'reach_relationship' && actionType === 'reach_relationship') {
          if (objDef.target === target) {
            newProgress = Math.min(objDef.quantity, obj.progress + quantity);
          }
        }

        if (newProgress < objDef.quantity) allComplete = false;
        return { ...obj, progress: newProgress };
      });

      if (allComplete && newObjectives.length > 0 && !aq.completed) {
        completedQuestIds.push(aq.questId);
        if (questData.rewards.gold > 0) totalGoldReward += questData.rewards.gold;
        if (questData.rewards.items) rewardItems.push(...questData.rewards.items);
        if (questData.rewards.relationshipBoost) relationshipBoosts.push(questData.rewards.relationshipBoost);
        return { ...aq, objectives: newObjectives, completed: true };
      }

      return { ...aq, objectives: newObjectives };
    });

    if (completedQuestIds.length > 0 || newQuests.some((q, i) => q.objectives !== state.activeQuests[i]?.objectives)) {
      // Build new player state immutably
      let newGold = state.player.gold + totalGoldReward;
      const newRelationships = { ...state.player.relationships };
      relationshipBoosts.forEach(b => {
        newRelationships[b.npcId] = Math.min(10, (newRelationships[b.npcId] || 0) + b.amount);
      });
      const newCompleted = [...new Set([...state.player.completedQuests, ...completedQuestIds])];
      const newInventory = [...state.player.inventory];
      rewardItems.forEach(item => {
        const existing = newInventory.find(i => i.itemId === item.itemId);
        if (existing) existing.quantity += item.quantity;
        else newInventory.push({
          id: Date.now().toString(36) + Math.random().toString(36),
          itemId: item.itemId,
          category: ItemCategory.Special,
          quantity: item.quantity,
        });
      });

      set({
        activeQuests: newQuests,
        player: {
          ...state.player,
          gold: newGold,
          completedQuests: newCompleted,
          relationships: newRelationships,
          inventory: newInventory,
        },
      });

      // Show notifications after state update
      completedQuestIds.forEach(qid => {
        const qData = ALL_QUESTS.find(q => q.id === qid);
        if (qData) {
          setTimeout(() => {
            get().showNotification(`✅ 任务完成：${qData.name}！\n获得 ${qData.rewards.gold || 0} G`);
          }, 100);
        }
      });
    }
  },

  updateQuestProgress: (questId: string, objectiveIndex: number, progress: number) => set(state => ({
    activeQuests: state.activeQuests.map(q =>
      q.questId === questId
        ? {
            ...q,
            objectives: q.objectives.map((o, i) =>
              i === objectiveIndex ? { ...o, progress } : o
            ),
          }
        : q
    ),
  })),

  completeQuest: (questId: string) => set(state => ({
    player: { ...state.player, completedQuests: [...state.player.completedQuests, questId] },
    activeQuests: state.activeQuests.map(q =>
      q.questId === questId ? { ...q, completed: true } : q
    ),
  })),

  // ─── Relationships ─────────────────────────
  changeRelationship: (npcId: string, amount: number) => {
    set(state => {
    const current = state.player.relationships[npcId] || 0;
    const newVal = Math.max(0, Math.min(10, current + amount));
    return {
      player: {
        ...state.player,
        relationships: { ...state.player.relationships, [npcId]: newVal },
      },
    };
    });
    // Trigger quest progress for relationship
    const newHearts = Math.floor(get().player.relationships[npcId] || 0);
    get().checkQuestProgress('reach_relationship', npcId, newHearts);
  },

  getRelationship: (npcId: string) => {
    return get().player.relationships[npcId] || 0;
  },

  // ─── Buildings ─────────────────────────────
  addBuilding: (building: Building) => {
    set(state => ({
      player: {
        ...state.player,
        buildings: [...state.player.buildings, building],
      },
      buildingsVersion: state.buildingsVersion + 1,
    }));
    // Trigger quest progress for building
    get().checkQuestProgress('build_structure', building.type, 1);
    get().checkQuestProgress('build_structure', 'any_building', 1);
  },

  upgradeBuilding: (buildingId: string) => set(state => ({
    player: {
      ...state.player,
      buildings: state.player.buildings.map(b =>
        b.id === buildingId ? { ...b, level: b.level + 1 } : b
      ),
    },
  })),

  removeBuilding: (buildingId: string) => set(state => ({
    player: {
      ...state.player,
      buildings: state.player.buildings.filter(b => b.id !== buildingId),
    },
  })),

  // ─── Fish Ponds ────────────────────────────
  addFishPond: (pond: FishPond) => set(state => ({
    player: {
      ...state.player,
      fishPonds: [...state.player.fishPonds, pond],
    },
  })),

  feedPond: (pondId: string, amount: number) => set(state => ({
    player: {
      ...state.player,
      fishPonds: state.player.fishPonds.map(p =>
        p.id === pondId ? { ...p, food: Math.min(p.maxFood, p.food + amount), lastFedDay: state.time.day } : p
      ),
    },
  })),

  harvestPond: (pondId: string) => {
    const state = get();
    const pond = state.player.fishPonds.find(p => p.id === pondId);
    if (!pond) return [];

    const harvest: InventoryItem[] = [];
    pond.fish.forEach(pf => {
      const fishData = state.fishData[pf.fishId];
      if (fishData && pf.growth >= 100) {
        const count = Math.floor(pf.count * (0.3 + Math.random() * 0.3)); // Harvest 30-60%
        if (count > 0) {
          harvest.push({
            id: Date.now().toString(36) + Math.random().toString(36),
            itemId: pf.fishId,
            category: ItemCategory.Fish,
            quantity: count,
            quality: pf.quality,
          });
          pf.count -= count;
          pf.growth = 0;
        }
      }
    });

    set({ player: { ...state.player, fishPonds: [...state.player.fishPonds] } });
    return harvest;
  },

  addFishToPond: (pondId: string, fishId: string, count: number) => set(state => {
    const ponds = state.player.fishPonds.map(p => {
      if (p.id !== pondId) return p;
      const existing = p.fish.find(f => f.fishId === fishId);
      if (existing) {
        existing.count += count;
      } else if (p.fish.length < p.capacity) {
        p.fish.push({ fishId, count, growth: 0, quality: 50 });
      }
      return { ...p, fish: [...p.fish] };
    });
    return { player: { ...state.player, fishPonds: ponds } };
  }),

  // ─── Fishing Minigame ──────────────────────
  startFishing: (fish: FishData) => set({
    fishingGame: {
      active: true,
      fish,
      barPosition: 50,
      barSize: Math.max(16, 28 - fish.strength), // 更大的捕捉框
      fishPosition: 30 + Math.random() * 40,
      fishDirection: Math.random() > 0.5 ? 1 : -1,
      fishSpeed: fish.speed * 0.25, // 鱼移动更慢
      progress: 0,
      maxProgress: 100,
      perfect: true,
    },
  }),

  updateFishingBar: (barPosition: number) => set(state => {
    if (!state.fishingGame.active || !state.fishingGame.fish) return state;

    const fg = { ...state.fishingGame };
    fg.barPosition = Math.max(0, Math.min(100, barPosition));

    // Move fish
    fg.fishPosition += fg.fishDirection * fg.fishSpeed;
    if (fg.fishPosition >= 95) fg.fishDirection = -1;
    if (fg.fishPosition <= 5) fg.fishDirection = 1;

    // Check if fish is in bar
    const barTop = fg.barPosition - fg.barSize / 2;
    const barBottom = fg.barPosition + fg.barSize / 2;
    const fishInBar = fg.fishPosition >= barTop && fg.fishPosition <= barBottom;

    if (fishInBar) {
      fg.progress = Math.min(fg.maxProgress, fg.progress + 2); // 更快填满进度条
    } else {
      fg.progress = Math.max(0, fg.progress - 0.3); // 脱靶惩罚更轻
      fg.perfect = false;
    }

    return { fishingGame: fg };
  }),

  endFishing: (success: boolean) => {
    const state = get();
    const fg = state.fishingGame;
    if (!fg.fish) return null;

    set({ fishingGame: { ...defaultFishingGame } });

    if (success) {
      const fish = fg.fish;
      const size = fish.minSize + Math.random() * (fish.maxSize - fish.minSize);
      const quality = fg.perfect ? 80 + Math.random() * 20 : 40 + Math.random() * 40;

      // Update player stats
      const newFishCaught = state.player.fishCaught.includes(fish.id)
        ? state.player.fishCaught
        : [...state.player.fishCaught, fish.id];

      set({
        player: {
          ...state.player,
          fishCaught: newFishCaught,
          totalFishCaught: state.player.totalFishCaught + 1,
        },
        fishData: {
          ...state.fishData,
          [fish.id]: { ...state.fishData[fish.id], isDiscovered: true },
        },
      });

      // Add to inventory
      get().addItem({
        id: Date.now().toString(36) + Math.random().toString(36),
        itemId: fish.id,
        category: ItemCategory.Fish,
        quantity: 1,
        quality: Math.round(quality),
      });

      return { fish, size: Math.round(size), quality: Math.round(quality), perfect: fg.perfect };
    }

    return null;
  },

  // ─── UI ────────────────────────────────────
  openPanel: (panel: UIPanel) => set({ currentPanel: panel }),
  closePanel: () => set({ currentPanel: 'none' }),

  startDialog: (npcId: string, texts: string[]) => set({
    currentPanel: 'npc_dialog',
    dialogNPCId: npcId,
    dialogTexts: texts,
    dialogIndex: 0,
  }),

  advanceDialog: () => {
    const state = get();
    const nextIndex = state.dialogIndex + 1;
    if (nextIndex >= state.dialogTexts.length) {
      set({ currentPanel: 'none', dialogNPCId: null, dialogTexts: [], dialogIndex: 0 });
      return false;
    }
    set({ dialogIndex: nextIndex });
    return true;
  },

  showNotification: (text: string) => set({ notification: text }),
  clearNotification: () => set({ notification: null }),

  triggerActionEffect: (type: string, icon: string) => set({
    actionEffect: { type, icon, time: Date.now() },
  }),
}));

// ─── Helper ──────────────────────────────────

function getSeasonWeatherProbs(season: Season): Record<string, number> {
  const probs: Record<Season, Record<string, number>> = {
    [Season.Spring]: { sunny: 0.4, cloudy: 0.3, rainy: 0.25, stormy: 0.05 },
    [Season.Summer]: { sunny: 0.5, cloudy: 0.3, rainy: 0.15, stormy: 0.05 },
    [Season.Autumn]: { sunny: 0.35, cloudy: 0.35, rainy: 0.2, stormy: 0.1 },
    [Season.Winter]: { sunny: 0.3, cloudy: 0.4, rainy: 0.2, stormy: 0.1 },
  };
  return probs[season];
}
