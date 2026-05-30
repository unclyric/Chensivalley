/* ============================================
   沉思谷物鱼 - NPC Data (10 NPCs)
   Meditation Valley Fish
   ============================================ */

import { NPCData, Season, FishingLocation } from '../utils/types';

export const ALL_NPCS: NPCData[] = [
  // ─── 1. 湖边老人 ───────────────────────────
  {
    id: 'old_fisherman',
    name: '华泽',
    title: '湖边老人',
    birthday: { season: Season.Autumn, day: 10 },
    lovedGifts: ['bamboo_tea', 'zen_koi', 'aged_wood'],
    likedGifts: ['common_fish', 'herb_bundle', 'tea_leaves'],
    hatedGifts: ['plastic_lure', 'trash_item'],
    schedule: {
      spring_1: {
        6: { location: FishingLocation.MeditationLake, position: { x: 15, y: 8 }, activity: '湖边晨练' },
        9: { location: FishingLocation.MeditationLake, position: { x: 18, y: 12 }, activity: '钓鱼' },
        12: { location: FishingLocation.MeditationLake, position: { x: 22, y: 20 }, activity: '午休' },
        14: { location: FishingLocation.MeditationLake, position: { x: 18, y: 12 }, activity: '钓鱼' },
        18: { location: FishingLocation.MeditationLake, position: { x: 10, y: 25 }, activity: '看日落' },
        20: { location: FishingLocation.MeditationLake, position: { x: 25, y: 15 }, activity: '回家' },
      },
    },
    dialogues: {
      default: [
        '年轻人，钓鱼不只是为了鱼，更是为了那份宁静。',
        '我在这个湖边已经六十年了，每一天都是新的。',
        '你知道吗？鱼也会思考。它们在水里看着我们。',
        '静下心来，你会发现世界比你想象的更美好。',
      ],
      '0': ['你是新来的？这片湖欢迎每一个真诚的人。', '我叫华泽，大家都这么叫我。你叫什么名字？'],
      '2': ['你开始找到钓鱼的节奏了。不错。', '我年轻的时候也像你这样，对一切都充满好奇。'],
      '4': ['你已经钓到了不少鱼吧？我能从你的眼神中看出来。', '送你个小礼物——这是我年轻时用的鱼饵配方。'],
      '6': ['我们是忘年交了。能遇到一个真正懂鱼的人不容易。', '这片湖还有不少秘密，等你自己去发现。'],
      '8': ['你就像我年轻时的影子。坚持下去，你会成为伟大的渔夫。', '也许有一天，我该把湖的故事都告诉你。'],
      '10': ['你已经是大辟谷最出色的渔夫了。我为你骄傲。', '记住，真正的钓鱼大师不是在钓鱼，而是在钓心。'],
      quest: ['你愿意帮我个忙吗？我最近在研究一种古老的钓鱼技法……'],
      gift: ['这是给我的吗？谢谢你的心意。'],
      giftLoved: ['这真是太好了！你是怎么知道我喜欢这个的？简直感动得要流泪了。'],
      giftLiked: ['谢谢你，这个礼物很实用。'],
      giftHated: ['……我不需要这个。但你的心意我收到了。'],
    },
    portrait: 'old_fisherman_portrait',
    description: '大辟谷畔最老的居民，据说已经在这里生活了六十年。他懂得关于钓鱼的一切。',
    spriteIndex: 0,
  },

  // ─── 2. 智爸 - 主角的父亲 ──────────────────
