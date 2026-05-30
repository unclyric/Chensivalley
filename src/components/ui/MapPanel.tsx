/* ============================================
   沉思谷物鱼 - Map Panel
   Meditation Valley Fish
   ============================================ */

import React from 'react';
import { useGameStore } from '../../services/GameState';
import { PhaserGameManager } from '../../services/PhaserGame';
import { FishingLocation } from '../../utils/types';
import { LOCATION_NAMES, LOCATION_DESCRIPTIONS, LOCATION_UNLOCK } from '../../utils/constants';

export const MapPanel: React.FC = () => {
  const { player, closePanel, changeMap, fishData } = useGameStore();

  const locations = [
    { key: FishingLocation.MeditationLake, icon: '🏞️', color: '#4a8fbf' },
    { key: FishingLocation.NanmingRiver, icon: '🏊', color: '#5a8f4a' },
    { key: FishingLocation.WestLake, icon: '🌅', color: '#d4a853' },
    { key: FishingLocation.YangyeMarsh, icon: '🌿', color: '#7eb5a6' },
  ];

  const isUnlocked = (location: FishingLocation): boolean => {
    const req = LOCATION_UNLOCK[location];
    if (req.level === 0) return true;
    if (player.totalFishCaught < req.fishCaught) return false;
    if (req.questRequired && !player.completedQuests.includes(req.questRequired)) return false;
    return true;
  };

  const fishCountInLocation = (location: FishingLocation): number => {
    return Object.values(fishData).filter(
      f => f.isDiscovered && f.locations.includes(location)
    ).length;
  };

  const totalFishInLocation = (location: FishingLocation): number => {
    return Object.values(fishData).filter(
      f => f.locations.includes(location)
    ).length;
  };

  const handleTravel = (location: FishingLocation) => {
    if (location === player.currentMap) {
      closePanel();
      return;
    }
    if (!isUnlocked(location)) return;

    // Use energy for travel
    if (location !== player.currentMap) {
      useGameStore.getState().useEnergy(5);
    }
    changeMap(location);

    // Also update Phaser game scene
    const manager = PhaserGameManager.getInstance();
    const gameScene = manager.getScene('GameScene');
    if (gameScene) {
      (gameScene as any).changeMap(location);
    }

    closePanel();
    useGameStore.getState().showNotification(`前往了 ${LOCATION_NAMES[location]}！`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">🗺️ 大辟谷地图</h2>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {/* Current location */}
        <div className="text-center mb-4 p-3 bg-game-bg border border-game-accent">
          <div className="font-pixel text-[10px] text-game-accent">📍 当前位置</div>
          <div className="font-pixel text-sm text-game-text mt-1">
            {LOCATION_NAMES[player.currentMap]}
          </div>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-2 gap-3">
          {locations.map(loc => {
            const unlocked = isUnlocked(loc.key);
            const isCurrent = loc.key === player.currentMap;
            const discovered = fishCountInLocation(loc.key);
            const total = totalFishInLocation(loc.key);

            return (
              <div
                key={loc.key}
                onClick={() => handleTravel(loc.key)}
                className={`p-3 border-2 cursor-pointer transition-all
                  ${isCurrent
                    ? 'border-game-accent bg-game-accent/20'
                    : unlocked
                      ? 'border-game-border bg-game-bg hover:border-game-text'
                      : 'border-gray-800 bg-gray-900/50 opacity-60 cursor-not-allowed'
                  }
                `}
                style={isCurrent ? { borderColor: loc.color } : {}}
              >
                <div className="text-3xl text-center mb-2">{loc.icon}</div>
                <div className="font-pixel text-xs text-center mb-1" style={{ color: unlocked ? '#e8d5c4' : '#666' }}>
                  {LOCATION_NAMES[loc.key]}
                </div>
                <div className="font-pixel text-[8px] text-center" style={{ color: loc.color }}>
                  {unlocked ? (
                    <span>🐟 {discovered}/{total} 种已发现</span>
                  ) : (
                    <span>🔒 需钓到 {LOCATION_UNLOCK[loc.key].fishCaught} 条鱼</span>
                  )}
                </div>
                {unlocked && !isCurrent && (
                  <button className="pixel-btn text-[8px] w-full mt-2">
                    前往
                  </button>
                )}
                {isCurrent && (
                  <div className="font-pixel text-[8px] text-game-accent text-center mt-2">
                    ← 当前位置
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Location descriptions */}
        <div className="mt-4 space-y-2">
          {locations.map(loc => {
            if (!isUnlocked(loc.key)) return null;
            return (
              <div key={loc.key} className="font-pixel text-[8px] text-game-border bg-game-bg p-2">
                <span className="text-game-text">{loc.icon} {LOCATION_NAMES[loc.key]}</span>
                ：{LOCATION_DESCRIPTIONS[loc.key]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
