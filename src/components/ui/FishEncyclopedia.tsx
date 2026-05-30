/* ============================================
   沉思谷物鱼 - Fish Encyclopedia
   Meditation Valley Fish
   ============================================ */

import React, { useState, useMemo } from 'react';
import { useGameStore } from '../../services/GameState';
import { FishRarity, FishingLocation } from '../../utils/types';
import { getRarityColor, getRarityName, getSeasonName } from '../../utils/helpers';
import { LOCATION_NAMES } from '../../utils/constants';

export const FishEncyclopedia: React.FC = () => {
  const { fishData, closePanel } = useGameStore();
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null);
  const [filterRarity, setFilterRarity] = useState<FishRarity | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<FishingLocation | 'all'>('all');
  const [searchText, setSearchText] = useState('');

  const allFish = Object.values(fishData);
  const discoveredCount = allFish.filter(f => f.isDiscovered).length;
  const totalCount = allFish.length;

  const filteredFish = useMemo(() => {
    return allFish.filter(f => {
      if (filterRarity !== 'all' && f.rarity !== filterRarity) return false;
      if (filterLocation !== 'all' && !f.locations.includes(filterLocation)) return false;
      if (searchText && !f.name.includes(searchText) && !f.nameEn.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [allFish, filterRarity, filterLocation, searchText]);

  const selectedFish = selectedFishId ? fishData[selectedFishId] : null;

  const rarityFilters: { key: FishRarity | 'all'; label: string; color: string }[] = [
    { key: 'all', label: '全部', color: '#e8d5c4' },
    { key: FishRarity.Common, label: '普通', color: getRarityColor(FishRarity.Common) },
    { key: FishRarity.Uncommon, label: '少见', color: getRarityColor(FishRarity.Uncommon) },
    { key: FishRarity.Rare, label: '稀有', color: getRarityColor(FishRarity.Rare) },
    { key: FishRarity.Epic, label: '史诗', color: getRarityColor(FishRarity.Epic) },
    { key: FishRarity.Legendary, label: '传说', color: getRarityColor(FishRarity.Legendary) },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[750px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">📖 鱼类图鉴</h2>
          <span className="font-pixel text-xs text-game-text">
            已发现: {discoveredCount}/{totalCount}
          </span>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {rarityFilters.map(rf => (
            <button
              key={rf.key}
              onClick={() => setFilterRarity(rf.key)}
              className="font-pixel text-[8px] px-2 py-1 border transition-colors"
              style={{
                borderColor: filterRarity === rf.key ? rf.color : '#5a3d5c',
                color: filterRarity === rf.key ? rf.color : '#e8d5c4',
                backgroundColor: filterRarity === rf.key ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              {rf.label}
            </button>
          ))}
          <select
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value as FishingLocation | 'all')}
            className="font-pixel text-[8px] px-2 py-1 bg-game-bg border border-game-border text-game-text"
          >
            <option value="all">所有地点</option>
            {Object.entries(LOCATION_NAMES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="搜索鱼名..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="pixel-input text-[9px] flex-1 min-w-[120px]"
          />
        </div>

        {/* Content */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Fish list */}
          <div className="flex-1 grid grid-cols-5 gap-1 overflow-y-auto content-start" style={{ maxHeight: '450px' }}>
            {filteredFish.map(fish => (
              <div
                key={fish.id}
                onClick={() => setSelectedFishId(fish.id)}
                className={`p-2 border cursor-pointer text-center transition-all
                  ${selectedFishId === fish.id ? 'border-game-accent bg-game-accent/20' : 'border-game-border bg-game-panel/50 hover:border-game-text'}
                  ${!fish.isDiscovered ? 'opacity-50' : ''}
                `}
              >
                {fish.isDiscovered ? (
                  <>
                    <div className="w-8 h-8 mx-auto rounded" style={{ backgroundColor: fish.color, opacity: 0.8 }} />
                    <div className="font-pixel text-[7px] text-game-text mt-1 truncate">{fish.name}</div>
                    <div className="font-pixel text-[6px]" style={{ color: getRarityColor(fish.rarity) }}>
                      {getRarityName(fish.rarity)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl">❓</div>
                    <div className="font-pixel text-[7px] text-game-border mt-1">???</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selectedFish && (
            <div className="w-56 bg-game-bg border border-game-border p-4 overflow-y-auto">
              {selectedFish.isDiscovered ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded mb-3" style={{ backgroundColor: selectedFish.color, opacity: 0.8 }} />
                  <h3 className="font-pixel text-sm text-center mb-1" style={{ color: getRarityColor(selectedFish.rarity) }}>
                    {selectedFish.name}
                  </h3>
                  <p className="font-pixel text-[9px] text-game-border text-center mb-3">{selectedFish.nameEn}</p>

                  <div className="font-pixel text-[9px] text-game-text space-y-2">
                    <div>
                      <span className="text-game-border">稀有度：</span>
                      <span style={{ color: getRarityColor(selectedFish.rarity) }}>{getRarityName(selectedFish.rarity)}</span>
                    </div>
                    <div>
                      <span className="text-game-border">价值：</span>
                      <span className="text-game-gold">{selectedFish.baseValue} G</span>
                    </div>
                    <div>
                      <span className="text-game-border">尺寸：</span>
                      <span>{selectedFish.minSize}-{selectedFish.maxSize} cm</span>
                    </div>
                    <div>
                      <span className="text-game-border">难度：</span>
                      <span>{'⭐'.repeat(selectedFish.strength)}</span>
                    </div>
                    <div>
                      <span className="text-game-border">季节：</span>
                      <span>{selectedFish.seasons.map(s => getSeasonName(s)).join(' ')}</span>
                    </div>
                    <div>
                      <span className="text-game-border">地点：</span>
                      <span>{selectedFish.locations.map(l => LOCATION_NAMES[l]).join(' ')}</span>
                    </div>
                    <div>
                      <span className="text-game-border">时间：</span>
                      <span>{selectedFish.timeOfDay.join(' ')}</span>
                    </div>
                    <p className="text-game-border leading-relaxed pt-2 border-t border-game-border">
                      {selectedFish.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-game-border font-pixel text-xs pt-8">
                  <div className="text-4xl mb-4">❓</div>
                  <p>尚未发现</p>
                  <p className="mt-2">继续钓鱼来发现它吧！</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 bg-game-bg rounded h-4 border border-game-border">
          <div
            className="h-full bg-game-accent transition-all duration-500"
            style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
          />
        </div>
        <div className="font-pixel text-[8px] text-game-border text-center mt-1">
          {discoveredCount}/{totalCount} ({Math.round((discoveredCount / totalCount) * 100)}%)
        </div>
      </div>
    </div>
  );
};
