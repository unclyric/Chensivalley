/* ============================================
   沉思谷物鱼 - Main Menu
   Meditation Valley Fish
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../services/GameState';
import { SaveSystem } from '../../systems/SaveSystem';

export const MainMenu: React.FC = () => {
  const { startGame } = useGameStore();
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [bubbles, setBubbles] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Check for existing save
    setHasExistingSave(SaveSystem.hasSave());

    // Generate floating bubbles
    const newBubbles = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: 80 + Math.random() * 20,
      size: 4 + Math.random() * 12,
      delay: Math.random() * 3,
    }));
    setBubbles(newBubbles);
  }, []);

  const handleNewGame = () => {
    startGame();
  };

  const handleLoadGame = () => {
    const save = SaveSystem.loadGame();
    if (save) {
      const store = useGameStore.getState();
      // Load save data into store
      store.startGame();
      // Apply saved data
      const s = useGameStore.getState();
      Object.assign(s.player, save.player);
      Object.assign(s.time, save.time);
      Object.assign(s.weather, save.weather);
      s.openPanel('none');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-game-water/20 to-game-bg relative overflow-hidden">
      {/* Animated background bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-game-water/20 animate-float"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* Title */}
      <div className="text-center mb-8 animate-slide-in z-10">
        <div className="text-6xl mb-4">🎣</div>
        <h1 className="font-pixel text-3xl text-game-text mb-2 tracking-wider"
          style={{ textShadow: '0 4px 0 #1a0d1e, 0 0 20px #7eb5a6' }}>
          沉思谷物鱼
        </h1>
        <p className="font-pixel text-xs text-game-accent mt-2">
          Meditation Valley Fish
        </p>
        <p className="font-pixel text-[10px] text-game-border mt-4 max-w-md">
          继承一座废弃湖畔渔场，通过钓鱼、养殖、探索和沉思，恢复整个大辟谷的生机。
        </p>
      </div>

      {/* Menu Options */}
      <div className="flex flex-col gap-3 z-10">
        <button onClick={handleNewGame} className="pixel-btn accent min-w-[250px] text-sm">
          🌅 新的旅程
        </button>

        {hasExistingSave && (
          <button onClick={handleLoadGame} className="pixel-btn gold min-w-[250px] text-sm">
            📂 继续旅程
          </button>
        )}

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="pixel-btn min-w-[250px] text-sm"
        >
          📖 游戏说明
        </button>
      </div>

      {/* Instructions Panel */}
      {showInstructions && (
        <div className="pixel-panel mt-6 max-w-md z-10 animate-slide-in">
          <h3 className="font-pixel text-sm text-game-accent mb-3">📖 游戏说明</h3>
          <div className="font-pixel text-[9px] text-game-text space-y-2 leading-relaxed">
            <p>🎮 <span className="text-game-accent">移动：</span>方向键 或 WASD</p>
            <p>🎣 <span className="text-game-accent">钓鱼：</span>走到水边按 E</p>
            <p>💬 <span className="text-game-accent">对话：</span>靠近NPC按 E</p>
            <p>📦 <span className="text-game-accent">背包：</span>按 I 键</p>
            <p>🗺️ <span className="text-game-accent">地图：</span>按 M 键</p>
            <p>📋 <span className="text-game-accent">任务：</span>按 J 键</p>
            <p>⚙️ <span className="text-game-accent">设置：</span>按 Esc</p>
            <hr className="border-game-border my-2" />
            <p>⏰ 时间自动流逝（1秒=1分钟）</p>
            <p>☀️ 四季更替，天气变化影响鱼种</p>
            <p>💝 与NPC互动提升好感度</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-game-border font-pixel text-[8px] z-10">
        v1.0.0 | Made with ❤️ + Phaser 3 + React + TypeScript
      </div>
    </div>
  );
};
