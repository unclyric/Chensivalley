/* ============================================
   沉思谷物鱼 - Save / Load Panel
   Meditation Valley Fish
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../services/GameState';
import { SaveSystem } from '../../systems/SaveSystem';
import { formatDate, formatTime } from '../../utils/helpers';
import { GameSave } from '../../utils/types';

export const SaveLoadPanel: React.FC = () => {
  const store = useGameStore();
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadSaveList();
  }, []);

  const loadSaveList = () => {
    setSaves(SaveSystem.getAllSaves());
  };

  const handleSave = (slot: number) => {
    const current = useGameStore.getState();
    const saveData: GameSave = {
      version: '1.0.0',
      timestamp: Date.now(),
      player: { ...current.player },
      time: { ...current.time },
      weather: { ...current.weather },
      discoveredFish: current.player.fishCaught,
      fishEncyclopedia: current.fishData,
      npcs: Object.fromEntries(
        Object.entries(current.npcData).map(([id]) => [
          id,
          {
            friendship: current.player.relationships[id] || 0,
            met: (current.player.relationships[id] || 0) > 0,
            questsCompleted: [],
          },
        ])
      ),
      activeQuests: current.activeQuests,
      flags: current.flags,
    };

    SaveSystem.saveGame(saveData);
    setMsg(`存档保存成功！`);
    loadSaveList();
    setTimeout(() => setMsg(''), 2000);
  };

  const handleLoad = (save: GameSave) => {
    const current = useGameStore.getState();

    // Apply save data
    current.player = { ...save.player };
    current.time = { ...save.time };
    current.weather = { ...save.weather };
    current.activeQuests = save.activeQuests;
    current.flags = save.flags;

    // Restore fish data
    Object.entries(save.fishEncyclopedia).forEach(([id, fish]) => {
      if (current.fishData[id]) {
        current.fishData[id] = { ...current.fishData[id], isDiscovered: fish.isDiscovered };
      }
    });

    // Restore NPC relationships
    Object.entries(save.npcs).forEach(([id, data]) => {
      current.player.relationships[id] = data.friendship;
    });

    setMsg('存档读取成功！');
    setTimeout(() => {
      store.closePanel();
      store.showNotification('欢迎回来！存档已成功读取。');
    }, 500);
  };

  const handleDelete = (save: GameSave) => {
    SaveSystem.deleteSave(save.timestamp);
    setMsg('存档已删除');
    loadSaveList();
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[550px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">💾 存档管理</h2>
          <button onClick={() => store.closePanel()} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        {msg && (
          <div className="font-pixel text-[9px] text-game-accent text-center mb-2 animate-slide-in">{msg}</div>
        )}

        {/* Auto-save slot */}
        <div className="mb-4">
          <button
            onClick={() => handleSave(0)}
            className="pixel-btn accent w-full text-sm mb-2"
          >
            💾 保存当前进度
          </button>
          <p className="font-pixel text-[8px] text-game-border text-center">
            游戏每5分钟自动保存一次
          </p>
        </div>

        {/* Save slots */}
        <div className="overflow-y-auto flex-1 space-y-2" style={{ maxHeight: '350px' }}>
          <h3 className="font-pixel text-[10px] text-game-text mb-2">存档列表</h3>
          {saves.length === 0 ? (
            <div className="font-pixel text-xs text-game-border text-center py-8">
              还没有存档记录
            </div>
          ) : (
            saves.map((save, i) => (
              <div key={i} className="border border-game-border bg-game-bg p-3 flex justify-between items-center">
                <div>
                  <div className="font-pixel text-[10px] text-game-text">
                    存档 {i + 1}
                  </div>
                  <div className="font-pixel text-[8px] text-game-border mt-1">
                    📅 {formatDate(save.time)} | 🕐 {formatTime(save.time)}
                  </div>
                  <div className="font-pixel text-[8px] text-game-border">
                    💰 {save.player.gold} G | 🐟 {save.player.totalFishCaught}条鱼
                  </div>
                  <div className="font-pixel text-[7px] text-game-border">
                    {new Date(save.timestamp).toLocaleString('zh-CN')}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleLoad(save)}
                    className="pixel-btn accent text-[8px] px-2 py-1"
                  >
                    读取
                  </button>
                  <button
                    onClick={() => handleDelete(save)}
                    className="pixel-btn text-[8px] px-2 py-1 border-game-heart text-game-heart"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
