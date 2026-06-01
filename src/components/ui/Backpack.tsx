/* ============================================
   沉思谷物鱼 - Backpack / Inventory Panel
   Meditation Valley Fish
   ============================================ */

import React, { useState } from 'react';
import { useGameStore } from '../../services/GameState';
import { ItemCategory } from '../../utils/types';
import { getRarityColor, getRarityName, formatGold } from '../../utils/helpers';
import { ITEM_DEFINITIONS } from '../../data/items';

export const Backpack: React.FC = () => {
  const { player, closePanel, sellFish, useItem, showNotification } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const categories: { key: ItemCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📦' },
    { key: ItemCategory.Fish, label: '鱼类', icon: '🐟' },
    { key: ItemCategory.Tool, label: '工具', icon: '🔧' },
    { key: ItemCategory.Bait, label: '鱼饵', icon: '🪱' },
    { key: ItemCategory.Material, label: '材料', icon: '🪵' },
    { key: ItemCategory.Food, label: '食物', icon: '🍱' },
    { key: ItemCategory.Special, label: '特殊', icon: '✨' },
  ];

  const filteredItems = player.inventory.filter(item =>
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const selectedItem = player.inventory.find(i => i.itemId === selectedItemId);
  const selectedFish = selectedItem?.category === ItemCategory.Fish
    ? useGameStore.getState().fishData[selectedItem.itemId]
    : null;

  const handleSellFish = (itemId: string) => {
    const value = sellFish(itemId);
    if (value > 0) {
      useGameStore.getState().showNotification(`卖出成功！获得 ${value} G`);
    }
  };

  const handleUseItem = (item: typeof filteredItems[0]) => {
    if (item.category === ItemCategory.Food) {
      const result = useItem(item.itemId);
      showNotification(result.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[700px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">🎒 背包</h2>
          <div className="flex gap-4 font-pixel text-xs text-game-text">
            <span>💰 {formatGold(player.gold)}</span>
            <span>📦 {player.inventory.length}/36</span>
            <span>⚡ {player.energy}/{player.maxEnergy}</span>
          </div>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`font-pixel text-[9px] px-2 py-1 border transition-colors
                ${selectedCategory === cat.key
                  ? 'bg-game-accent text-game-bg border-game-accent'
                  : 'bg-game-panel text-game-text border-game-border hover:border-game-accent'
                }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex-1 grid grid-cols-6 gap-1 overflow-y-auto content-start" style={{ maxHeight: '400px' }}>
            {filteredItems.map(item => {
              const def = ITEM_DEFINITIONS[item.itemId];
              const fish = item.category === ItemCategory.Fish
                ? useGameStore.getState().fishData[item.itemId]
                : null;
              const isSelected = selectedItemId === item.itemId;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.itemId)}
                  className={`p-2 border cursor-pointer text-center transition-all
                    ${isSelected ? 'border-game-accent bg-game-accent/20' : 'border-game-border bg-game-panel/50 hover:border-game-text'}
                  `}
                  style={{ imageRendering: 'pixelated' }}
                >
                  <div className="text-2xl">{def?.icon || '🐟'}</div>
                  <div className="font-pixel text-[7px] text-game-text truncate mt-1">
                    {fish?.name || def?.name || item.itemId}
                  </div>
                  {item.quantity > 1 && (
                    <div className="font-pixel text-[8px] text-game-gold">x{item.quantity}</div>
                  )}
                  {fish && (
                    <div className="font-pixel text-[6px]" style={{ color: getRarityColor(fish.rarity) }}>
                      {getRarityName(fish.rarity)}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="col-span-6 text-center font-pixel text-xs text-game-border py-8">
                这里空空如也……去钓些鱼吧！🐟
              </div>
            )}
          </div>

          {/* Item detail panel */}
          {selectedItem && (
            <div className="w-48 bg-game-bg border border-game-border p-3 flex flex-col">
              <div className="text-center text-4xl mb-2">
                {ITEM_DEFINITIONS[selectedItem.itemId]?.icon || '❓'}
              </div>
              <h3 className="font-pixel text-xs text-game-accent text-center mb-2">
                {selectedFish?.name || ITEM_DEFINITIONS[selectedItem.itemId]?.name || selectedItem.itemId}
              </h3>
              {selectedFish && (
                <div className="font-pixel text-[8px] text-game-text space-y-1">
                  <p style={{ color: getRarityColor(selectedFish.rarity) }}>
                    {getRarityName(selectedFish.rarity)}
                  </p>
                  <p>价值: {formatGold(selectedFish.baseValue)}</p>
                  <p>尺寸: {selectedFish.minSize}-{selectedFish.maxSize}cm</p>
                  <p className="text-game-border">{selectedFish.description}</p>
                </div>
              )}
              <div className="mt-auto pt-2 flex flex-col gap-1">
                {selectedItem.category === ItemCategory.Fish && (
                  <button
                    onClick={() => handleSellFish(selectedItem.itemId)}
                    className="pixel-btn gold text-[9px] w-full"
                  >
                    💰 卖出
                  </button>
                )}
                {selectedItem.category === ItemCategory.Food && (
                  <button
                    onClick={() => handleUseItem(selectedItem)}
                    className="pixel-btn accent text-[9px] w-full"
                  >
                    🍽️ 使用
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
