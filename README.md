# 沉思谷物鱼 (Meditation Valley Fish)

> 一款受 Stardew Valley 启发的像素风休闲经营游戏。继承废弃湖畔渔场，通过钓鱼、养殖、探索和沉思，恢复整个沉思谷。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🎮 操作指南

| 按键 | 功能 |
|------|------|
| 方向键 / WASD | 移动角色 |
| E | 钓鱼 / 与NPC对话 |
| I | 打开背包 |
| M | 打开地图 |
| J | 打开任务日志 |
| Esc | 打开设置菜单 |
| 空格/鼠标按住 | 钓鱼时控制绿色捕捉框 |

## 🗺️ 游戏区域

- 🏞️ **沉思湖** - 新手区域（鲫鱼、鲤鱼、草鱼等）
- 🌊 **南明河** - 中级区域（银鱼、虹鳟、黑鲈等）
- 🌅 **西湖** - 高级区域（金枪鱼、剑鱼、月光鱼等）
- 🌿 **羊叶泽** - 隐藏区域（龙纹鱼、幻光鱼、羊叶鱼等）

## 🏗️ 项目架构

```
src/
├── assets/          # 静态资源
├── components/ui/   # React UI 组件
│   ├── MainMenu.tsx           # 主菜单
│   ├── Backpack.tsx           # 背包/物品栏
│   ├── FishEncyclopedia.tsx   # 鱼类图鉴
│   ├── Shop.tsx               # 商店
│   ├── QuestPanel.tsx         # 任务面板
│   ├── BuildingMenu.tsx       # 建造菜单
│   ├── NPCDialog.tsx          # NPC对话
│   ├── FishPondPanel.tsx      # 鱼塘管理
│   ├── SettingsPanel.tsx      # 设置
│   ├── SaveLoadPanel.tsx      # 存档管理
│   ├── MapPanel.tsx           # 地图面板
│   ├── FishingMinigameUI.tsx  # 钓鱼小游戏
│   └── Notification.tsx       # 通知提示
├── scenes/          # Phaser 游戏场景
│   ├── BootScene.ts           # 启动场景（生成纹理）
│   ├── GameScene.ts           # 主游戏场景
│   └── FishingScene.ts        # 钓鱼场景
├── entities/        # 游戏实体
├── systems/         # 游戏系统
│   └── SaveSystem.ts          # 存档系统
├── data/            # 游戏数据
│   ├── fish.ts                # 54种鱼类数据
│   ├── npcs.ts                # 10名NPC数据
│   ├── items.ts               # 物品/商店数据
│   └── quests.ts              # 任务数据
├── services/        # 核心服务
│   ├── GameState.ts           # Zustand 状态管理
│   └── PhaserGame.ts          # Phaser 实例管理
└── utils/           # 工具函数
    ├── types.ts               # TypeScript 类型定义
    ├── constants.ts           # 游戏常量
    ├── helpers.ts             # 辅助函数
    └── index.ts               # 统一导出
```

## 🔧 技术栈

- **前端**: React 18 + TypeScript
- **游戏引擎**: Phaser 3
- **构建工具**: Vite
- **样式**: TailwindCSS
- **状态管理**: Zustand
- **存档**: LocalStorage

## 📋 开发路线图

### ✅ 第一阶段（已完成）
- [x] 玩家移动
- [x] 地图加载（4个区域）
- [x] 时间系统（四季、24小时）
- [x] 钓鱼系统（小游戏）
- [x] 背包系统
- [x] 存档系统
- [x] 图鉴系统（54种鱼）

### 🔜 第二阶段
- [ ] 音效系统和BGM
- [ ] 更多NPC剧情
- [ ] 节日活动系统
- [ ] 成就系统
- [ ] 鱼塘自动化

### 🔜 第三阶段
- [ ] Supabase 云端存档
- [ ] 多人联机
- [ ] 移动端适配
- [ ] Steam 发布准备
