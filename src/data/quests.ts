/* ============================================
   沉思谷物鱼 - Quest Data
   Meditation Valley Fish
   ============================================ */

import { QuestData, QuestType, NPCName, Season } from '../utils/types';

export const ALL_QUESTS: QuestData[] = [
  // ═══ 主线任务 ═══════════════════════════════
  {
    id: 'main_arrival',
    name: '初到大辟谷',
    description: '你来到了大辟谷，华泽在湖边等你。去和他打个招呼吧。',
    type: QuestType.Main,
    prerequisites: [],
    objectives: [{ type: 'talk_to_npc', target: 'old_fisherman', quantity: 1, progress: 0 }],
    rewards: { gold: 100, items: [{ itemId: 'bait_worm', quantity: 10 }] },
    npcGiver: NPCName.OldFisherman,
    isRepeatable: false,
  },
  {
    id: 'main_first_catch',
    name: '第一次钓鱼',
    description: '华泽给了你一根木制鱼竿。去大辟谷钓你的第一条鱼吧！',
    type: QuestType.Main,
    prerequisites: ['main_arrival'],
    objectives: [{ type: 'catch_fish', target: 'any', quantity: 3, progress: 0 }],
    rewards: { gold: 200, items: [{ itemId: 'bait_shrimp', quantity: 5 }] },
    npcGiver: NPCName.OldFisherman,
    isRepeatable: false,
  },
  {
    id: 'main_meet_merchant',
    name: '遇见旅行商人',
    description: '华泽建议你去见见旅行商人智爸，他有些好东西可以帮你。',
    type: QuestType.Main,
    prerequisites: ['main_first_catch'],
    objectives: [{ type: 'talk_to_npc', target: 'traveling_merchant', quantity: 1, progress: 0 }],
    rewards: { gold: 150 },
    npcGiver: NPCName.OldFisherman,
    isRepeatable: false,
  },
  {
    id: 'main_explore_river',
    name: '探索南明河',
    description: '你有了足够的经验，可以去南明河探索新的钓鱼地点了。钓5条南明河的鱼。',
    type: QuestType.Main,
    prerequisites: ['main_meet_merchant'],
    objectives: [{ type: 'catch_fish', target: 'any_nanming', quantity: 5, progress: 0 }],
    rewards: { gold: 500, items: [{ itemId: 'rod_copper', quantity: 1 }] },
    npcGiver: NPCName.OldFisherman,
    isRepeatable: false,
  },
  {
    id: 'main_build_pond',
    name: '建造鱼塘',
    description: '你已经钓了不少鱼，是时候建一个鱼塘来养鱼了。建造一个小鱼塘。',
    type: QuestType.Main,
    prerequisites: ['main_explore_river'],
    objectives: [{ type: 'build_structure', target: 'fish_pond_small', quantity: 1, progress: 0 }],
    rewards: { gold: 300, items: [{ itemId: 'wood', quantity: 30 }, { itemId: 'stone', quantity: 20 }] },
    npcGiver: NPCName.TravelingMerchant,
    isRepeatable: false,
  },
  {
    id: 'main_meet_scientist',
    name: '鱼类学家',
    description: '鳞教授听说了你的钓鱼技术，想见见你。去和她聊聊吧。',
    type: QuestType.Main,
    prerequisites: ['main_build_pond'],
    objectives: [{ type: 'talk_to_npc', target: 'ichthyologist', quantity: 1, progress: 0 }],
    rewards: { gold: 200, items: [{ itemId: 'special_lucky_charm', quantity: 1 }] },
    npcGiver: NPCName.Ichthyologist,
    isRepeatable: false,
  },
  {
    id: 'main_west_lake',
    name: '西湖探秘',
    description: '是时候前往西湖了。那里有更稀有的大鱼等着你。钓到5条西湖的鱼。',
    type: QuestType.Main,
    prerequisites: ['main_meet_scientist'],
    objectives: [{ type: 'catch_fish', target: 'any_west_lake', quantity: 5, progress: 0 }],
    rewards: { gold: 1000, items: [{ itemId: 'rod_iron', quantity: 1 }] },
    npcGiver: NPCName.OldFisherman,
    isRepeatable: false,
  },
  {
    id: 'hidden_marsh_discovery',
    name: '发现羊叶泽',
    description: '神秘隐者玄虚知道了你的事迹，在羊叶泽入口等你。只有真正的沉思者才能进入。',
    type: QuestType.Main,
    prerequisites: ['main_west_lake'],
    objectives: [
      { type: 'talk_to_npc', target: 'mysterious_hermit', quantity: 1, progress: 0 },
      { type: 'reach_relationship', target: 'old_fisherman', quantity: 5, progress: 0 },
    ],
    rewards: { gold: 2000, unlockFish: 'yangye_leaf_fish' },
    npcGiver: NPCName.MysteriousHermit,
    isRepeatable: false,
  },
  {
    id: 'main_legendary_hunt',
    name: '传说中的鱼',
    description: '你已经可以去羊叶泽了。在那里钓到一条传说中的鱼吧！',
    type: QuestType.Main,
    prerequisites: ['hidden_marsh_discovery'],
    objectives: [{ type: 'catch_fish', target: 'any_legendary', quantity: 1, progress: 0 }],
    rewards: { gold: 5000, items: [{ itemId: 'rod_gold', quantity: 1 }] },
    npcGiver: NPCName.MysteriousHermit,
    isRepeatable: false,
  },
  {
    id: 'main_master_angler',
    name: '垂钓大师',
    description: '集齐所有鱼类图鉴，成为大辟谷最伟大的渔夫。',
    type: QuestType.Main,
    prerequisites: ['main_legendary_hunt'],
    objectives: [{ type: 'catch_fish', target: 'all_fish', quantity: 50, progress: 0 }],
    rewards: { gold: 10000, items: [{ itemId: 'special_lucky_charm', quantity: 5 }] },
    npcGiver: NPCName.OldFisherman,
    isRepeatable: false,
  },

  // ═══ 支线任务 ═══════════════════════════════
  {
    id: 'side_tea_fish',
    name: '淇爹的茶点鱼',
    description: '淇爹想尝试用新鲜鱼肉做茶点。帮她钓3条不同种类的鱼。',
    type: QuestType.Side,
    prerequisites: [],
    objectives: [{ type: 'catch_fish', target: 'any', quantity: 3, progress: 0 }],
    rewards: { gold: 200, items: [{ itemId: 'tea', quantity: 3 }], relationshipBoost: { npcId: 'tea_house_owner', amount: 1 } },
    npcGiver: NPCName.TeaHouseOwner,
    isRepeatable: false,
  },
  {
    id: 'side_lighthouse_oil',
    name: '灯塔的灯油',
    description: '老聂需要特殊的灯油。去南明河深处找到发光水母（一种特殊物品）。',
    type: QuestType.Side,
    prerequisites: [],
    objectives: [{ type: 'collect_item', target: 'glow_jelly', quantity: 3, progress: 0 }],
    rewards: { gold: 400, relationshipBoost: { npcId: 'lighthouse_keeper', amount: 2 } },
    npcGiver: NPCName.LighthouseKeeper,
    isRepeatable: false,
  },
  {
    id: 'side_painters_dream',
    name: '画家的梦想',
    description: '佳佳想要画出大辟谷最美的鱼。带一条罕见的鱼给她看看。',
    type: QuestType.Side,
    prerequisites: [],
    objectives: [{ type: 'catch_fish', target: 'zen_koi', quantity: 1, progress: 0 }],
    rewards: { gold: 500, items: [{ itemId: 'lantern', quantity: 2 }], relationshipBoost: { npcId: 'wandering_painter', amount: 2 } },
    npcGiver: NPCName.WanderingPainter,
    isRepeatable: false,
  },
  {
    id: 'side_kids_dream',
    name: '小鱼的愿望',
    description: '小鱼想给妈妈一个惊喜，帮他钓一条虹鳟。',
    type: QuestType.Side,
    prerequisites: [],
    objectives: [{ type: 'catch_fish', target: 'rainbow_trout', quantity: 1, progress: 0 }],
    rewards: { gold: 150, relationshipBoost: { npcId: 'young_angler', amount: 3 }, items: [{ itemId: 'bait_artificial', quantity: 3 }] },
    npcGiver: NPCName.YoungAngler,
    isRepeatable: false,
  },
  {
    id: 'side_sailors_compass',
    name: '失落的海图',
    description: '格雷福斯在西湖丢了他的老罗盘。在西湖钓鱼时可能会钓到它。',
    type: QuestType.Side,
    prerequisites: [],
    objectives: [{ type: 'collect_item', target: 'old_compass', quantity: 1, progress: 0 }],
    rewards: { gold: 600, relationshipBoost: { npcId: 'retired_sailor', amount: 3 }, items: [{ itemId: 'special_weather_charm', quantity: 1 }] },
    npcGiver: NPCName.RetiredSailor,
    isRepeatable: false,
  },
  {
    id: 'side_botany_aid',
    name: '水生植物研究',
    description: '维克兹需要西湖深处的一种特殊水草。帮他在西湖钓鱼时留意。',
    type: QuestType.Side,
    prerequisites: [],
    objectives: [{ type: 'collect_item', target: 'deep_water_weed', quantity: 5, progress: 0 }],
    rewards: { gold: 350, relationshipBoost: { npcId: 'botanist', amount: 2 }, items: [{ itemId: 'bait_special', quantity: 5 }] },
    npcGiver: NPCName.Botanist,
    isRepeatable: false,
  },
  {
    id: 'side_hermit_secret',
    name: '隐者的秘密',
    description: '玄虚说湖底沉有古老的宝物。帮他找到它。',
    type: QuestType.Side,
    prerequisites: ['hidden_marsh_discovery'],
    objectives: [{ type: 'collect_item', target: 'ancient_artifact', quantity: 1, progress: 0 }],
    rewards: { gold: 3000, relationshipBoost: { npcId: 'mysterious_hermit', amount: 3 }, items: [{ itemId: 'special_lucky_charm', quantity: 3 }] },
    npcGiver: NPCName.MysteriousHermit,
    isRepeatable: false,
  },

  // ═══ 每日任务 ═══════════════════════════════
  {
    id: 'daily_catch_3',
    name: '每日垂钓',
    description: '今天钓到3条任意品种的鱼。',
    type: QuestType.Daily,
    prerequisites: [],
    objectives: [{ type: 'catch_fish', target: 'any', quantity: 3, progress: 0 }],
    rewards: { gold: 100 },
    isRepeatable: true,
    timeLimit: 1,
  },
  {
    id: 'daily_sell_fish',
    name: '每日渔获',
    description: '卖出价值至少200金币的鱼。',
    type: QuestType.Daily,
    prerequisites: [],
    objectives: [{ type: 'reach_gold', target: '200', quantity: 1, progress: 0 }],
    rewards: { gold: 50 },
    isRepeatable: true,
    timeLimit: 1,
  },
  {
    id: 'daily_feed_pond',
    name: '喂养鱼塘',
    description: '给你的鱼塘投喂一次。',
    type: QuestType.Daily,
    prerequisites: [],
    objectives: [{ type: 'build_structure', target: 'feed_pond', quantity: 1, progress: 0 }],
    rewards: { gold: 80, items: [{ itemId: 'bait_worm', quantity: 5 }] },
    isRepeatable: true,
    timeLimit: 1,
  },
];

export function getQuestById(id: string): QuestData | undefined {
  return ALL_QUESTS.find(q => q.id === id);
}

export function getQuestsByType(type: QuestType): QuestData[] {
  return ALL_QUESTS.filter(q => q.type === type);
}

export function getAvailableQuests(completedQuests: string[], relationships: Record<string, number>): QuestData[] {
  return ALL_QUESTS.filter(q => {
    // Already completed non-repeatable quests
    if (!q.isRepeatable && completedQuests.includes(q.id)) return false;
    // Check prerequisites
    if (q.prerequisites.length > 0) {
      const allPrereqsMet = q.prerequisites.every(p => completedQuests.includes(p));
      if (!allPrereqsMet) return false;
    }
    return true;
  });
}
