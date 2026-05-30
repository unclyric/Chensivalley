/* ============================================
   沉思谷物鱼 - Shop Panel
   Meditation Valley Fish
   ============================================ */

import React, { useState } from 'react';
import { useGameStore } from '../../services/GameState';
import { ALL_SHOP_ITEMS, ITEM_DEFINITIONS } from '../../data/items';
import { ItemCategory } from '../../utils/types';
import { formatGold } from '../../utils/helpers';
import { ROD_STATS } from '../../utils/constants';

export const ShopPanel: React.FC = () => {
  const { player, closePanel, spendGold, addGold, sellFish } = useGameStore();
  const [selectedTab, setSelectedTab] = useState<ItemCategory>(ItemCategory.Tool);
  const [cartMsg, setCartMsg] = useState('');

  const tabs: { key: ItemCategory; label: string; icon: string }[] = [
    { key: ItemCategory.Tool, label: '鱼竿', icon: '🎣' },
    { key: ItemCategory.Bait, label: '鱼饵', icon: '🪱' },
    { key: ItemCategory.Material, label: '材料', icon: '🪵' },
    { key: ItemCategory.Decoration, label: '装饰', icon: '🏮' },
    { key: ItemCategory.Food, label: '食物', icon: '🍱' },
    { key: ItemCategory.Special, label: '特殊', icon: '✨' },
  ];

  const filteredItems = ALL_SHOP_ITEMS.filter(item => item.category === selectedTab);

  const handleBuy = (item: typeof ALL_SHOP_ITEMS[0]) => {
    if (player.gold < item.price) {
      setCartMsg('金币不足！');
      return;
    }
    if (spendGold(item.price)) {
      useGameStore.getState().addItem({
        id: Date.now().toString(36),
        itemId: item.id,
        category: item.category,
        quantity: 1,
      });
      setCartMsg(`购买了 ${item.name}！`);
      setTimeout(() => setCartMsg(''), 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[650px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-gold">🏪 智爸的杂货铺</h2>
          <span className="font-pixel text-xs text-game-gold">💰 {formatGold(player.gold)}</span>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`font-pixel text-[9px] px-3 py-1 border transition-colors
                ${selectedTab === tab.key
                  ? 'bg-game-gold/30 border-game-gold text-game-gold'
                  : 'bg-game-panel border-game-border text-game-text hover:border-game-text'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Cart message */}
        {cartMsg && (
          <div className="font-pixel text-[9px] text-game-accent text-center mb-2 animate-slide-in">
            {cartMsg}
          </div>
        )}

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1" style={{ maxHeight: '400px' }}>
          {filteredItems.map(item => {
            const def = ITEM_DEFINITIONS[item.id];
            const canAfford = player.gold >= item.price;

            return (
              <div key={item.id} className="border border-game-border bg-game-bg p-3 flex gap-3">
                <div className="text-3xl flex-shrink-0 w-12 text-center">
                  {def?.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-pixel text-[10px] text-game-text">{item.name}</h3>
                  <p className="font-pixel text-[8px] text-game-border mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`font-pixel text-xs ${canAfford ? 'text-game-gold' : 'text-game-heart'}`}>
                      {formatGold(item.price)}
                    </span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`font-pixel text-[8px] px-3 py-1 border transition-colors
                        ${canAfford
                          ? 'border-game-gold text-game-gold hover:bg-game-gold/20 cursor-pointer'
                          : 'border-game-border text-game-border cursor-not-allowed opacity-50'
                        }`}
                    >
                      购买
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trade-in: Sell fish */}
        <div className="mt-3 pt-3 border-t border-game-border">
          <div className="font-pixel text-[9px] text-game-text mb-2">
            💱 快速卖鱼（选中背包中的鱼进行出售）
          </div>
          <button
            onClick={() => {
              closePanel();
              useGameStore.getState().openPanel('backpack');
            }}
            className="pixel-btn text-[9px]"
          >
            📦 打开背包卖鱼
          </button>
        </div>
      </div>
    </div>
  );
};
