/* ============================================
   沉思谷物鱼 - Fish Pond Management Panel
   Meditation Valley Fish
   ============================================ */

import React, { useState } from 'react';
import { useGameStore } from '../../services/GameState';
import { POND_STATS } from '../../utils/constants';

export const FishPondPanel: React.FC = () => {
  const { player, closePanel, feedPond, harvestPond, addItem, addFishToPond, removeItem } = useGameStore();
  const [selectedPondId, setSelectedPondId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const selectedPond = player.fishPonds.find(p => p.id === selectedPondId);

  const handleFeed = (pondId: string) => {
    // Check if player has bait to feed
    const baitItem = player.inventory.find(i => i.itemId === 'bait_worm');
    if (!baitItem || baitItem.quantity < 5) {
      setMsg('需要至少5个蚯蚓来投喂！');
      setTimeout(() => setMsg(''), 2000);
      return;
    }
    removeItem('bait_worm', 5);
    feedPond(pondId, 50);
    setMsg('投喂成功！鱼塘食物 +50');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleHarvest = (pondId: string) => {
    const harvested = harvestPond(pondId);
    harvested.forEach(item => addItem(item));
    setMsg(`收获了 ${harvested.reduce((sum, i) => sum + i.quantity, 0)} 条鱼！`);
    setTimeout(() => setMsg(''), 2000);
  };

  const handleAddFish = (pondId: string) => {
    // Find fish in inventory to add to pond
    const fishInInventory = player.inventory.filter(i => i.category === 'fish');
    if (fishInInventory.length === 0) {
      setMsg('背包里没有可以放入的鱼！');
      setTimeout(() => setMsg(''), 2000);
      return;
    }
    const fish = fishInInventory[0];
    addFishToPond(pondId, fish.itemId, 1);
    removeItem(fish.itemId, 1);
    setMsg('将鱼放入了鱼塘！');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">🏞️ 鱼塘管理</h2>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {msg && (
          <div className="font-pixel text-[9px] text-game-accent text-center mb-2 animate-slide-in">{msg}</div>
        )}

        {player.fishPonds.length === 0 ? (
          <div className="text-center font-pixel text-xs text-game-border py-8">
            🏞️ 还没有鱼塘。去建造菜单建一个吧！
          </div>
        ) : (
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Ponds list */}
            <div className="w-48 space-y-2 overflow-y-auto">
              {player.fishPonds.map(pond => {
                const stats = POND_STATS[pond.size];
                const building = player.buildings.find(b => b.id === pond.buildingId);
                return (
                  <div
                    key={pond.id}
                    onClick={() => setSelectedPondId(pond.id)}
                    className={`p-3 border cursor-pointer transition-all
                      ${selectedPondId === pond.id ? 'border-game-accent bg-game-accent/20' : 'border-game-border bg-game-bg hover:border-game-text'}
                    `}
                  >
                    <div className="font-pixel text-[10px] text-game-text">{stats.name}</div>
                    <div className="font-pixel text-[8px] text-game-border mt-1">
                      🐟 {pond.fish.length}/{pond.capacity}种
                    </div>
                    <div className="font-pixel text-[8px] text-game-border">
                      🍞 {pond.food}/{pond.maxFood}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected pond detail */}
            {selectedPond && (
              <div className="flex-1 border border-game-border bg-game-bg p-4">
                <h3 className="font-pixel text-sm text-game-text mb-3">
                  {POND_STATS[selectedPond.size].name}
                </h3>

                {/* Fish in pond */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-pixel text-[10px] text-game-accent">塘中鱼类</h4>
                  {selectedPond.fish.map(pf => {
                    const fishData = useGameStore.getState().fishData[pf.fishId];
                    return (
                      <div key={pf.fishId} className="flex justify-between items-center bg-game-panel p-2">
                        <span className="font-pixel text-[9px] text-game-text">
                          {fishData?.name || pf.fishId}
                        </span>
                        <div className="flex gap-2 font-pixel text-[8px] text-game-border">
                          <span>数量: {pf.count}</span>
                          <span>成长: {Math.round(pf.growth)}%</span>
                        </div>
                      </div>
                    );
                  })}
                  {selectedPond.fish.length === 0 && (
                    <div className="font-pixel text-[9px] text-game-border">塘中无鱼</div>
                  )}
                </div>

                {/* Food status */}
                <div className="mb-4">
                  <h4 className="font-pixel text-[10px] text-game-accent mb-1">食物</h4>
                  <div className="h-4 bg-game-panel border border-game-border">
                    <div
                      className="h-full bg-amber-700 transition-all"
                      style={{ width: `${(selectedPond.food / selectedPond.maxFood) * 100}%` }}
                    />
                  </div>
                  <div className="font-pixel text-[8px] text-game-border mt-1">
                    {selectedPond.food}/{selectedPond.maxFood}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => handleFeed(selectedPond.id)} className="pixel-btn text-[9px]">
                    🍞 投喂
                  </button>
                  <button onClick={() => handleHarvest(selectedPond.id)} className="pixel-btn gold text-[9px]">
                    🎣 收获
                  </button>
                  <button onClick={() => handleAddFish(selectedPond.id)} className="pixel-btn text-[9px]">
                    ➕ 放鱼
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
