/* ============================================
   沉思谷物鱼 - Items & Shop Data
   Meditation Valley Fish
   ============================================ */

import { ShopItem, ItemCategory, RodType, BaitType } from '../utils/types';

export const ALL_SHOP_ITEMS: ShopItem[] = [
  // ─── 鱼竿 ──────────────────────────────────
  {
    id: 'rod_copper',
    name: '铜制鱼竿',
    description: '铜质配件让鱼竿更坚固耐用，抛竿距离和上钩率都有所提升。',
    category: ItemCategory.Tool,
    price: 500,
    requirement: { type: 'fish_caught', value: '5' },
    stock: 1,
    restockInterval: 0,
  },
  {
    id: 'rod_iron',
    name: '铁制鱼竿',
    description: '铁质鱼竿能抛得更远，钓到更好的鱼。',
    category: ItemCategory.Tool,
    price: 1500,
    requirement: { type: 'fish_caught', value: '15' },
    stock: 1,
    restockInterval: 0,
  },
  {
    id: 'rod_silver',
    name: '银制鱼竿',
    description: '银光闪闪，鱼儿更容易被吸引。稀有鱼出现概率显著提升。',
    category: ItemCategory.Tool,
    price: 4000,
    requirement: { type: 'fish_caught', value: '30' },
    stock: 1,
    restockInterval: 0,
  },
  {
    id: 'rod_gold',
    name: '黄金鱼竿',
    description: '传说级别的鱼竿，只有最厉害的渔夫才能驾驭。',
    category: ItemCategory.Tool,
    price: 10000,
    requirement: { type: 'fish_caught', value: '45' },
    stock: 1,
    restockInterval: 0,
  },

  // ─── 鱼饵 ──────────────────────────────────
  {
    id: 'bait_worm',
    name: '蚯蚓',
    description: '最常见的鱼饵，鱼都爱吃。略微提升上钩率和稀有鱼概率。',
    category: ItemCategory.Bait,
    price: 10,
    stock: 99,
    restockInterval: 1,
  },
  {
    id: 'bait_shrimp',
    name: '虾饵',
    description: '用虾做饵，能吸引更大的鱼。中等提升上钩率和稀有鱼概率。',
    category: ItemCategory.Bait,
    price: 30,
    stock: 50,
    restockInterval: 1,
  },
  {
    id: 'bait_artificial',
    name: '人造饵',
    description: '精心制作的假饵，骗过聪明的鱼。显著提升上钩率和稀有鱼概率。',
    category: ItemCategory.Bait,
    price: 80,
    stock: 30,
    restockInterval: 3,
  },
  {
    id: 'bait_special',
    name: '特制鱼饵',
    description: '秘方配制的鱼饵，传说能引来神鱼。大幅提升稀有鱼概率。',
    category: ItemCategory.Bait,
    price: 200,
    stock: 10,
    restockInterval: 7,
  },

  // ─── 鱼塘材料 ──────────────────────────────
  {
    id: 'material_wood',
    name: '木材',
    description: '建造和升级鱼塘的基础材料。',
    category: ItemCategory.Material,
    price: 20,
    stock: 99,
    restockInterval: 1,
  },
  {
    id: 'material_stone',
    name: '石材',
    description: '建造和升级鱼塘的坚固材料。',
    category: ItemCategory.Material,
    price: 30,
    stock: 99,
    restockInterval: 1,
  },
  {
    id: 'material_iron_ingot',
    name: '铁锭',
    description: '用于升级中高级鱼塘的金属材料。',
    category: ItemCategory.Material,
    price: 150,
    stock: 20,
    restockInterval: 3,
  },
  {
    id: 'material_gold_ingot',
    name: '金锭',
    description: '用于升级高级鱼塘的珍贵材料。',
    category: ItemCategory.Material,
    price: 500,
    stock: 5,
    restockInterval: 7,
  },

  // ─── 装饰物 ────────────────────────────────
  {
    id: 'deco_lantern',
    name: '石灯笼',
    description: '日式石灯笼，放在湖边很美。',
    category: ItemCategory.Decoration,
    price: 200,
    stock: 5,
    restockInterval: 3,
  },
  {
    id: 'deco_bench',
    name: '木长椅',
    description: '可以坐在上面看湖景。',
    category: ItemCategory.Decoration,
    price: 150,
    stock: 5,
    restockInterval: 3,
  },
  {
    id: 'deco_flower_pot',
    name: '花盆',
    description: '一盆漂亮的花，装饰你的渔场。',
    category: ItemCategory.Decoration,
    price: 100,
    stock: 10,
    restockInterval: 1,
  },
  {
    id: 'deco_fish_statue',
    name: '鱼雕像',
    description: '一座精美的鱼形石雕。',
    category: ItemCategory.Decoration,
    price: 500,
    stock: 2,
    restockInterval: 7,
  },
  {
    id: 'deco_bridge',
    name: '小木桥',
    description: '装饰性的小木桥，可以架在鱼塘之间。',
    category: ItemCategory.Decoration,
    price: 300,
    stock: 3,
    restockInterval: 5,
  },

  // ─── 消耗品 ────────────────────────────────
  {
    id: 'food_bento',
    name: '便当',
    description: '恢复30点体力。',
    category: ItemCategory.Food,
    price: 80,
    stock: 10,
    restockInterval: 1,
  },
  {
    id: 'food_tea',
    name: '沉思茶',
    description: '淇爹的特制茶，恢复50点体力并提升钓鱼专注力。',
    category: ItemCategory.Food,
    price: 150,
    stock: 5,
    restockInterval: 1,
  },
  {
    id: 'food_fish_rice',
    name: '鱼香饭',
    description: '用新鲜鱼肉做的饭，恢复80点体力。',
    category: ItemCategory.Food,
    price: 200,
    stock: 3,
    restockInterval: 1,
  },

  // ─── 特殊物品 ──────────────────────────────
  {
    id: 'special_lucky_charm',
    name: '幸运符',
    description: '增加5%的稀有鱼遇见概率，持续一整天。',
    category: ItemCategory.Special,
    price: 300,
    stock: 3,
    restockInterval: 7,
  },
  {
    id: 'special_weather_charm',
    name: '天气符',
    description: '使用后改变当天的天气（随机）。',
    category: ItemCategory.Special,
    price: 500,
    stock: 1,
    restockInterval: 14,
  },
  {
    id: 'special_time_charm',
    name: '时光符',
    description: '让时间快进2小时。',
    category: ItemCategory.Special,
    price: 200,
    stock: 5,
    restockInterval: 3,
  },
  {
    id: 'special_ghost_painting',
    name: '鬼画符',
    description: '没用处，纯卖。智爸进货时也不知道为什么会买这个。',
    category: ItemCategory.Special,
    price: 100,
    stock: 99,
    restockInterval: 1,
  },
  // ─── 炸弹学家道具 ──────────────────────────
  {
    id: 'special_firecracker',
    name: '小鞭炮',
    description: '吉格斯特制小鞭炮，可以吓跑附近的鸟，增加稀有鱼出现的概率。',
    category: ItemCategory.Special,
    price: 50,
    stock: 20,
    restockInterval: 1,
  },
  {
    id: 'special_smoke_bomb',
    name: '烟雾弹',
    description: '投掷后产生烟雾，可以快速跳过2小时游戏时间。',
    category: ItemCategory.Special,
    price: 120,
    stock: 10,
    restockInterval: 3,
  },
  {
    id: 'special_dynamite',
    name: '小炸药',
    description: '吉格斯的小型炸药包，炸开水面可以直接获得3条随机鱼。（后期使用）',
    category: ItemCategory.Special,
    price: 300,
    stock: 5,
    restockInterval: 7,
  },
];

// ─── Item definitions for inventory ──────────

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  maxStack: number;
  sellPrice: number;
  icon: string;
}

export const ITEM_DEFINITIONS: Record<string, ItemDefinition> = {
  // Fishing rods
  wooden_rod: { id: 'wooden_rod', name: '木制鱼竿', description: '基础鱼竿', category: ItemCategory.Tool, maxStack: 1, sellPrice: 25, icon: '🎣' },
  copper_rod: { id: 'copper_rod', name: '铜制鱼竿', description: '铜制鱼竿', category: ItemCategory.Tool, maxStack: 1, sellPrice: 100, icon: '🎣' },
  iron_rod: { id: 'iron_rod', name: '铁制鱼竿', description: '铁制鱼竿', category: ItemCategory.Tool, maxStack: 1, sellPrice: 300, icon: '🎣' },
  silver_rod: { id: 'silver_rod', name: '银制鱼竿', description: '银制鱼竿', category: ItemCategory.Tool, maxStack: 1, sellPrice: 800, icon: '🎣' },
  gold_rod: { id: 'gold_rod', name: '黄金鱼竿', description: '黄金鱼竿', category: ItemCategory.Tool, maxStack: 1, sellPrice: 2000, icon: '🎣' },

  // Bait
  bait_worm: { id: 'bait_worm', name: '蚯蚓', description: '基础鱼饵', category: ItemCategory.Bait, maxStack: 99, sellPrice: 2, icon: '🪱' },
  bait_shrimp: { id: 'bait_shrimp', name: '虾饵', description: '中型鱼饵', category: ItemCategory.Bait, maxStack: 99, sellPrice: 6, icon: '🦐' },
  bait_artificial: { id: 'bait_artificial', name: '人造饵', description: '高级鱼饵', category: ItemCategory.Bait, maxStack: 50, sellPrice: 16, icon: '🎯' },
  bait_special: { id: 'bait_special', name: '特制鱼饵', description: '顶级鱼饵', category: ItemCategory.Bait, maxStack: 20, sellPrice: 40, icon: '✨' },

  // Materials
  wood: { id: 'wood', name: '木材', description: '建筑材料', category: ItemCategory.Material, maxStack: 999, sellPrice: 5, icon: '🪵' },
  stone: { id: 'stone', name: '石材', description: '建筑材料', category: ItemCategory.Material, maxStack: 999, sellPrice: 8, icon: '🪨' },
  iron_ingot: { id: 'iron_ingot', name: '铁锭', description: '金属材料', category: ItemCategory.Material, maxStack: 99, sellPrice: 50, icon: '🔩' },
  gold_ingot: { id: 'gold_ingot', name: '金锭', description: '珍贵材料', category: ItemCategory.Material, maxStack: 99, sellPrice: 200, icon: '🪙' },

  // Decorations
  lantern: { id: 'lantern', name: '石灯笼', description: '装饰物', category: ItemCategory.Decoration, maxStack: 10, sellPrice: 40, icon: '🏮' },
  bench: { id: 'bench', name: '木长椅', description: '装饰物', category: ItemCategory.Decoration, maxStack: 10, sellPrice: 30, icon: '🪑' },
  flower_pot: { id: 'flower_pot', name: '花盆', description: '装饰物', category: ItemCategory.Decoration, maxStack: 10, sellPrice: 20, icon: '🪴' },
  fish_statue: { id: 'fish_statue', name: '鱼雕像', description: '装饰物', category: ItemCategory.Decoration, maxStack: 5, sellPrice: 100, icon: '🗿' },

  // Food (short IDs from quests)
  bento: { id: 'bento', name: '便当', description: '恢复30体力', category: ItemCategory.Food, maxStack: 20, sellPrice: 16, icon: '🍱' },
  tea: { id: 'tea', name: '沉思茶', description: '恢复50体力', category: ItemCategory.Food, maxStack: 20, sellPrice: 30, icon: '🍵' },
  fish_rice: { id: 'fish_rice', name: '鱼香饭', description: '恢复80体力', category: ItemCategory.Food, maxStack: 10, sellPrice: 40, icon: '🍚' },
  // Food (shop IDs with food_ prefix)
  food_bento: { id: 'food_bento', name: '便当', description: '恢复30体力', category: ItemCategory.Food, maxStack: 20, sellPrice: 16, icon: '🍱' },
  food_tea: { id: 'food_tea', name: '沉思茶', description: '恢复50体力', category: ItemCategory.Food, maxStack: 20, sellPrice: 30, icon: '🍵' },
  food_fish_rice: { id: 'food_fish_rice', name: '鱼香饭', description: '恢复80体力', category: ItemCategory.Food, maxStack: 10, sellPrice: 40, icon: '🍚' },

  // Special
  lucky_charm: { id: 'lucky_charm', name: '幸运符', description: '+5%稀有鱼概率', category: ItemCategory.Special, maxStack: 5, sellPrice: 60, icon: '🍀' },
  weather_charm: { id: 'weather_charm', name: '天气符', description: '改变天气', category: ItemCategory.Special, maxStack: 3, sellPrice: 100, icon: '🌤️' },
  time_charm: { id: 'time_charm', name: '时光符', description: '快进时间', category: ItemCategory.Special, maxStack: 5, sellPrice: 40, icon: '⏰' },
  special_ghost_painting: { id: 'special_ghost_painting', name: '鬼画符', description: '没用处，纯卖', category: ItemCategory.Special, maxStack: 99, sellPrice: 5, icon: '👻' },
  special_firecracker: { id: 'special_firecracker', name: '小鞭炮', description: '吓跑鸟类，增加稀有鱼概率', category: ItemCategory.Special, maxStack: 20, sellPrice: 10, icon: '🧨' },
  special_smoke_bomb: { id: 'special_smoke_bomb', name: '烟雾弹', description: '快进2小时', category: ItemCategory.Special, maxStack: 10, sellPrice: 24, icon: '💨' },
  special_dynamite: { id: 'special_dynamite', name: '小炸药', description: '炸鱼用（后期）', category: ItemCategory.Special, maxStack: 5, sellPrice: 60, icon: '💣' },
};
