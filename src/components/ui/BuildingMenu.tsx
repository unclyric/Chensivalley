/* ============================================
   沉思谷物鱼 - Building Menu
   Meditation Valley Fish
   ============================================ */

import React, { useState } from 'react';
import { useGameStore } from '../../services/GameState';
import { BuildingType, PondSize } from '../../utils/types';
import { POND_STATS, formatGold } from '../../utils';
import { generateId } from '../../utils/helpers';

export const BuildingMenu: React.FC = () => {
  const { player, closePanel, spendGold, addBuilding, addFishPond, checkQuestProgress } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<'pond' | 'building' | 'deco'>('pond');
  const [msg, setMsg] = useState('');

  const handleBuildPond = (size: PondSize) => {
    const stats = POND_STATS[size];
    if (player.gold < stats.buildCost) {
      setMsg('金币不足！');
      return;
    }
    if (!spendGold(stats.buildCost)) return;

    const buildId = generateId();
    const building = {
      id: buildId,
      type: BuildingType.FishPond,
      position: { x: 0, y: 0 },
      map: player.currentMap,
      level: 1,
      maxLevel: 3,
      built: true,
    };
    addBuilding(building);

    const pond = {
      id: generateId(),
      size,
      fish: [],
      capacity: stats.capacity,
      food: 100,
      maxFood: 100,
      lastFedDay: 0,
      autoHarvest: false,
      buildingId: buildId,
    };
    addFishPond(pond);

    // Trigger quest progress for building
    checkQuestProgress('build_structure', 'fish_pond_small', 1);
    checkQuestProgress('build_structure', 'fish_pond', 1);

    setMsg(`建造了${stats.name}！花费 ${stats.buildCost} G`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleBuildOther = (type: BuildingType) => {
    const costs: Record<string, number> = {
      warehouse: 800,
      dock: 500,
      decoration: 200,
    };
    const cost = costs[type] || 500;
    if (!spendGold(cost)) {
      setMsg('金币不足！');
      return;
    }
    addBuilding({
      id: generateId(),
      type,
      position: { x: 0, y: 0 },
      map: player.currentMap,
      level: 1,
      maxLevel: 3,
      built: true,
    });
    setMsg(`建造成功！花费 ${cost} G`);
    setTimeout(() => setMsg(''), 3000);
  };

  const categories = [
    { key: 'pond' as const, label: '🏞️ 鱼塘', },
    { key: 'building' as const, label: '🏠 建筑', },
    { key: 'deco' as const, label: '🎀 装饰', },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[550px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">🔨 建造菜单</h2>
          <span className="font-pixel text-xs text-game-gold">💰 {formatGold(player.gold)}</span>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-3">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`font-pixel text-[9px] px-3 py-1 border ${
                selectedCategory === cat.key
                  ? 'bg-game-accent/30 border-game-accent text-game-accent'
                  : 'bg-game-panel border-game-border text-game-text hover:border-game-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {msg && (
          <div className="font-pixel text-[9px] text-game-accent text-center mb-2 animate-slide-in">{msg}</div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1 space-y-2" style={{ maxHeight: '400px' }}>
          {selectedCategory === 'pond' && (
            <>
              <h3 className="font-pixel text-[10px] text-game-text mb-2">建造鱼塘</h3>
              {Object.entries(POND_STATS).map(([size, stats]) => (
                <div key={size} className="border border-game-border bg-game-bg p-3 flex gap-3">
                  <div className="text-3xl">{{ small: '🪣', medium: '🪣', large: '🏊' }[size]}</div>
                  <div className="flex-1">
                    <h4 className="font-pixel text-[10px] text-game-text">{stats.name}</h4>
                    <p className="font-pixel text-[8px] text-game-border mt-1">{stats.description}</p>
                    <p className="font-pixel text-[8px] text-game-text mt-1">
                      容量: {stats.capacity}种鱼 | 所需材料: {stats.materials.map(m => `${m.itemId} x${m.quantity}`).join(', ')}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-pixel text-xs text-game-gold">{formatGold(stats.buildCost)}</span>
                      <button
                        onClick={() => handleBuildPond(size as PondSize)}
                        className="pixel-btn text-[8px] px-3 py-1"
                      >
                        建造
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {selectedCategory === 'building' && (
            <>
              <h3 className="font-pixel text-[10px] text-game-text mb-2">建造建筑</h3>
              <div className="border border-game-border bg-game-bg p-3 flex gap-3">
                <div className="text-3xl">🏠</div>
                <div className="flex-1">
                  <h4 className="font-pixel text-[10px] text-game-text">仓库</h4>
                  <p className="font-pixel text-[8px] text-game-border mt-1">扩大背包容量，存储更多物品。</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-pixel text-xs text-game-gold">{formatGold(800)}</span>
                    <button onClick={() => handleBuildOther(BuildingType.Warehouse)} className="pixel-btn text-[8px] px-3 py-1">建造</button>
                  </div>
                </div>
              </div>
              <div className="border border-game-border bg-game-bg p-3 flex gap-3">
                <div className="text-3xl">⚓</div>
                <div className="flex-1">
                  <h4 className="font-pixel text-[10px] text-game-text">码头</h4>
                  <p className="font-pixel text-[8px] text-game-border mt-1">提升钓鱼效率，解锁更远的垂钓点。</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-pixel text-xs text-game-gold">{formatGold(500)}</span>
                    <button onClick={() => handleBuildOther(BuildingType.Dock)} className="pixel-btn text-[8px] px-3 py-1">建造</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedCategory === 'deco' && (
            <>
              <h3 className="font-pixel text-[10px] text-game-text mb-2">装饰物</h3>
              {[
                { name: '石灯笼', icon: '🏮', cost: 200, desc: '日式石灯笼，为渔场增添禅意。' },
                { name: '木长椅', icon: '🪑', cost: 150, desc: '走累了可以坐下来欣赏湖景。' },
                { name: '花盆', icon: '🪴', cost: 100, desc: '一盆漂亮的花。' },
                { name: '鱼雕像', icon: '🗿', cost: 500, desc: '精美的鱼形石雕。' },
              ].map(deco => (
                <div key={deco.name} className="border border-game-border bg-game-bg p-3 flex gap-3">
                  <div className="text-3xl">{deco.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-pixel text-[10px] text-game-text">{deco.name}</h4>
                    <p className="font-pixel text-[8px] text-game-border mt-1">{deco.desc}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-pixel text-xs text-game-gold">{formatGold(deco.cost)}</span>
                      <button onClick={() => handleBuildOther(BuildingType.Decoration)} className="pixel-btn text-[8px] px-3 py-1">放置</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Your buildings */}
        <div className="mt-3 pt-3 border-t border-game-border">
          <h3 className="font-pixel text-[10px] text-game-text mb-1">你的建筑 ({player.buildings.length})</h3>
          <div className="flex flex-wrap gap-1">
            {player.buildings.map(b => (
              <span key={b.id} className="font-pixel text-[8px] px-2 py-1 bg-game-bg border border-game-border text-game-text">
                {{ fish_pond: '🏞️鱼塘', warehouse: '🏠仓库', dock: '⚓码头', decoration: '🎀装饰' }[b.type]}
                Lv.{b.level}
              </span>
            ))}
            {player.buildings.length === 0 && (
              <span className="font-pixel text-[9px] text-game-border">还没有建筑</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
