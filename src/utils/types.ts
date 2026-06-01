/* ============================================
   沉思谷物鱼 - Core Type Definitions
   Meditation Valley Fish
   ============================================ */

// ─── Enums ───────────────────────────────────

export enum Season {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter',
}

export enum Weather {
  Sunny = 'sunny',
  Cloudy = 'cloudy',
  Rainy = 'rainy',
  Stormy = 'stormy',
}

export enum TimeOfDay {
  Dawn = 'dawn',       // 5:00-7:00
  Morning = 'morning',  // 7:00-12:00
  Afternoon = 'afternoon', // 12:00-17:00
  Evening = 'evening',  // 17:00-20:00
  Night = 'night',      // 20:00-5:00
}

export enum FishRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum FishingLocation {
  MeditationLake = 'meditation_lake',
  NanmingRiver = 'nanming_river',
  WestLake = 'west_lake',
  YangyeMarsh = 'yangye_marsh',
}

export enum RodType {
  Wooden = 'wooden',
  Copper = 'copper',
  Iron = 'iron',
  Silver = 'silver',
  Gold = 'gold',
}

export enum BaitType {
  None = 'none',
  Worm = 'worm',
  Shrimp = 'shrimp',
  Artificial = 'artificial',
  Special = 'special',
}

export enum PondSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum QuestType {
  Main = 'main',
  Side = 'side',
  Daily = 'daily',
}

export enum BuildingType {
  FishPond = 'fish_pond',
  Warehouse = 'warehouse',
  Dock = 'dock',
  Decoration = 'decoration',
}

export enum ItemCategory {
  Fish = 'fish',
  Tool = 'tool',
  Bait = 'bait',
  Material = 'material',
  Decoration = 'decoration',
  Food = 'food',
  Special = 'special',
  Seed = 'seed',
}

export enum NPCName {
  OldFisherman = 'old_fisherman',
  TravelingMerchant = 'traveling_merchant',
  Ichthyologist = 'ichthyologist',
  LighthouseKeeper = 'lighthouse_keeper',
  WanderingPainter = 'wandering_painter',
  TeaHouseOwner = 'tea_house_owner',
  YoungAngler = 'young_angler',
  RetiredSailor = 'retired_sailor',
  Botanist = 'botanist',
  MysteriousHermit = 'mysterious_hermit',
}

// ─── Core Data Structures ────────────────────

export interface GameTime {
  year: number;
  season: Season;
  day: number;
  hour: number;
  minute: number;
}

export interface WeatherState {
  current: Weather;
  nextDay: Weather;
  transitionProgress: number; // 0-1
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerData {
  name: string;
  gold: number;
  position: Position;
  currentMap: FishingLocation;
  energy: number;
  maxEnergy: number;
  rodType: RodType;
  equippedBait: BaitType;
  inventory: InventoryItem[];
  fishCaught: string[]; // fish IDs
  completedQuests: string[];
  relationships: Record<string, number>; // NPC id -> heart level (0-10)
  buildings: Building[];
  fishPonds: FishPond[];
  totalFishCaught: number;
  playTime: number; // in-game minutes
  discoveredRecipes: string[];
  decorations: string[];
}

export interface InventoryItem {
  id: string;
  itemId: string;
  category: ItemCategory;
  quantity: number;
  quality?: number; // 0-100
  data?: Record<string, unknown>; // extra data like fish size
}

export interface FishData {
  id: string;
  name: string;
  nameEn: string;
  rarity: FishRarity;
  baseValue: number;
  seasons: Season[];
  locations: FishingLocation[];
  timeOfDay: TimeOfDay[];
  weather: Weather[];
  description: string;
  minSize: number;   // cm
  maxSize: number;   // cm
  strength: number;  // 1-10 fishing difficulty
  speed: number;     // 1-10 bar speed
  spriteIndex: number; // which sprite to use
  color: string;     // hex color for representation
  breedingRate: number; // reproduction rate in ponds
  growthDays: number;   // days to mature in pond
  isDiscovered: boolean;
}

export interface NPCData {
  id: string;
  name: string;
  title: string;
  birthday: { season: Season; day: number };
  lovedGifts: string[];
  likedGifts: string[];
  hatedGifts: string[];
  schedule: NPCSchedule;
  dialogues: NPCDialogueTree;
  portrait: string;
  description: string;
  spriteIndex: number;
}

export interface NPCSchedule {
  [key: string]: { // "spring_1" etc
    [hour: number]: {
      location: FishingLocation;
      position: Position;
      activity: string;
    };
  };
}

export interface NPCDialogueBase {
  default: string[];
  random: string[];            // randomly picked from on each interaction
  quest: string[];
  gift: string[];
  giftLoved: string[];
  giftLiked: string[];
  giftHated: string[];
  // Contextual dialogues
  morning?: string[];          // 5:00-12:00
  afternoon?: string[];        // 12:00-17:00
  evening?: string[];          // 17:00-20:00
  night?: string[];            // 20:00-5:00
  rainy?: string[];            // when raining
  stormy?: string[];           // when stormy
  sunny?: string[];            // when sunny
  spring?: string[];           // spring season
  summer?: string[];           // summer season
  autumn?: string[];           // autumn season
  winter?: string[];           // winter season
}

export interface NPCDialogueTree extends NPCDialogueBase {
  [heartLevel: string]: string[] | undefined; // "0"-"10" heart-level specific
}

export interface QuestData {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  prerequisites: string[]; // quest IDs
  objectives: QuestObjective[];
  rewards: QuestReward;
  npcGiver?: NPCName;
  isRepeatable: boolean;
  timeLimit?: number; // in-game days, 0 = no limit
}

export interface QuestObjective {
  type: 'catch_fish' | 'collect_item' | 'talk_to_npc' | 'reach_gold' | 'build_structure' | 'reach_relationship';
  target: string;
  quantity: number;
  progress: number;
}

export interface QuestReward {
  gold: number;
  items?: { itemId: string; quantity: number }[];
  relationshipBoost?: { npcId: string; amount: number };
  unlockFish?: string;
}

export interface Building {
  id: string;
  type: BuildingType;
  variant?: string;       // decoration subtype: lantern, bench, flower_pot, fish_statue
  position: Position;
  map: FishingLocation;
  level: number;
  maxLevel: number;
  built: boolean;
}

export interface FishPond {
  id: string;
  size: PondSize;
  fish: PondFish[];
  capacity: number;
  food: number;
  maxFood: number;
  lastFedDay: number;
  autoHarvest: boolean;
  buildingId: string;
}

export interface PondFish {
  fishId: string;
  count: number;
  growth: number; // 0-100%
  quality: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  requirement?: { type: string; value: string };
  stock: number;
  restockInterval: number; // days, 0 = never
}

export interface GameSave {
  version: string;
  timestamp: number;
  player: PlayerData;
  time: GameTime;
  weather: WeatherState;
  discoveredFish: string[]; // fish IDs discovered in encyclopedia
  fishEncyclopedia: Record<string, FishData>;
  npcs: Record<string, { friendship: number; met: boolean; questsCompleted: string[] }>;
  activeQuests: QuestProgress[];
  flags: Record<string, boolean>; // global game flags
}

export interface QuestProgress {
  questId: string;
  started: boolean;
  objectives: { index: number; progress: number }[];
  completed: boolean;
  daysRemaining: number;
}

// ─── Fishing Minigame ─────────────────────────

export interface FishingCatch {
  fish: FishData;
  size: number; // cm
  quality: number; // 0-100
  perfect: boolean;
}

export interface FishingMinigameState {
  active: boolean;
  fish: FishData | null;
  barPosition: number;    // 0-100, green bar center
  barSize: number;        // green bar size
  fishPosition: number;   // 0-100, fish position
  fishDirection: number;  // 1 or -1
  fishSpeed: number;
  progress: number;       // 0-100, catch progress
  maxProgress: number;
  perfect: boolean;
}

// ─── Map / Tile ──────────────────────────────

export interface MapData {
  id: FishingLocation;
  name: string;
  width: number;  // in tiles
  height: number; // in tiles
  tiles: number[][]; // tile indices
  collision: boolean[][];
  fishingSpots: FishingSpot[];
  npcSpawns: NPCSpawn[];
  buildingSlots: Position[];
  entryPoints: MapEntryPoint[];
}

export interface FishingSpot {
  position: Position;
  radius: number; // tile radius
  fishPool: string[]; // fish IDs available here
}

export interface NPCSpawn {
  npcId: string;
  position: Position;
}

export interface MapEntryPoint {
  position: Position;
  targetMap: FishingLocation;
  targetPosition: Position;
  label: string;
}

// ─── Event System ────────────────────────────

export type GameEvent =
  | { type: 'TIME_CHANGED'; time: GameTime }
  | { type: 'WEATHER_CHANGED'; weather: Weather }
  | { type: 'SEASON_CHANGED'; season: Season }
  | { type: 'FISH_CAUGHT'; fish: FishingCatch }
  | { type: 'GOLD_CHANGED'; amount: number; newTotal: number }
  | { type: 'QUEST_PROGRESS'; questId: string; objectiveIndex: number; progress: number }
  | { type: 'QUEST_COMPLETED'; questId: string }
  | { type: 'RELATIONSHIP_CHANGED'; npcId: string; hearts: number }
  | { type: 'ITEM_ADDED'; item: InventoryItem }
  | { type: 'ITEM_REMOVED'; itemId: string; quantity: number }
  | { type: 'BUILDING_PLACED'; building: Building }
  | { type: 'BUILDING_UPGRADED'; buildingId: string; newLevel: number }
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME'; save: GameSave };

// ─── UI State ────────────────────────────────

export type UIPanel =
  | 'none'
  | 'main_menu'
  | 'backpack'
  | 'encyclopedia'
  | 'shop'
  | 'quests'
  | 'building'
  | 'settings'
  | 'save_load'
  | 'npc_dialog'
  | 'fish_pond'
  | 'fishing_game'
  | 'map';

export interface UIState {
  currentPanel: UIPanel;
  dialogNPCId: string | null;
  dialogText: string;
  notification: string | null;
  notificationTimer: number;
  selectedItem: string | null;
}
