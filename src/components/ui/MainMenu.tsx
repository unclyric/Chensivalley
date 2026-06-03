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
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#1a0d1e' }}>
      {/* Pixel art background: grass at bottom, sky gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]"
        style={{ background: 'linear-gradient(to top, #1a6e35, #228b3a 40%, transparent)' }} />
      <div className="absolute bottom-[35%] left-0 right-0 h-[20%]"
        style={{ background: 'linear-gradient(to top, #2d9d4e, #52be80 60%, transparent)' }} />

      {/* Pixel water shimmer */}
      {bubbles.map((b, i) => (
        <div key={i} className="absolute rounded-full animate-float"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size,
            animationDelay: `${b.delay}s`, backgroundColor: '#3498db', opacity: 0.15 }} />
      ))}

      {/* Decorative pixel trees */}
      <div className="absolute bottom-[30%] left-[8%] text-6xl opacity-40" style={{ filter: 'drop-shadow(0 6px 3px rgba(0,0,0,0.4))' }}>🌲</div>
      <div className="absolute bottom-[32%] right-[6%] text-7xl opacity-35" style={{ filter: 'drop-shadow(0 6px 3px rgba(0,0,0,0.4))' }}>🌳</div>
      <div className="absolute bottom-[28%] left-[18%] text-5xl opacity-25">🌿</div>
      <div className="absolute bottom-[30%] right-[18%] text-4xl opacity-25">🪨</div>

      {/* Title — wooden sign style */}
      <div className="text-center mb-8 animate-slide-in z-10">
        {/* Pixel fish icon */}
        <div className="text-7xl mb-3" style={{ filter: 'drop-shadow(0 4px 0 #1a0d1e)' }}>🐟</div>

        {/* Wooden sign background */}
        <div className="relative inline-block px-10 py-4 border-4 mx-auto"
          style={{
            backgroundColor: '#8b6914',
            borderColor: '#5d4e37',
            borderStyle: 'solid',
            boxShadow: '0 6px 0 #3a2a1a, 0 8px 16px rgba(0,0,0,0.5), inset 0 2px 0 #c4a35a',
          }}>
          {/* Wood grain lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #000 3px, #000 4px)'
          }} />
          <h1 className="font-pixel text-4xl tracking-widest relative"
            style={{ color: '#f0d9b5', textShadow: '3px 3px 0 #3a2a1a, -1px -1px 0 #5d4e37' }}>
            沉思谷物鱼
          </h1>
        </div>

        {/* Subtitle on a hanging board */}
        <div className="mt-3 inline-block px-4 py-1 border-2"
          style={{ backgroundColor: '#5d4e37', borderColor: '#3a2a1a', boxShadow: '0 3px 0 #3a2a1a' }}>
          <p className="font-pixel text-[11px] tracking-wide" style={{ color: '#d4a853' }}>
            ✦ Meditation Valley Fish ✦
          </p>
        </div>

        <p className="font-pixel text-[11px] mt-4 max-w-md mx-auto leading-relaxed"
          style={{ color: '#7eb5a6', textShadow: '0 2px 0 #1a0d1e' }}>
          继承一座废弃湖畔渔场，通过钓鱼、养殖、探索和沉思，恢复整个大辟谷的生机。
        </p>
      </div>

      {/* Menu Options — wooden buttons */}
      <div className="flex flex-col gap-3 z-10">
        <button onClick={handleNewGame}
          className="font-pixel text-base px-10 py-3 border-3 tracking-wider transition-all hover:scale-105"
          style={{
            backgroundColor: '#7eb5a6', color: '#1a0d1e', borderColor: '#5a9a8a',
            boxShadow: '0 4px 0 #3d7a6a, 0 6px 12px rgba(0,0,0,0.4)',
          }}>
          🌅 新的旅程
        </button>

        {hasExistingSave && (
          <button onClick={handleLoadGame}
            className="font-pixel text-base px-10 py-3 border-3 tracking-wider transition-all hover:scale-105"
            style={{
              backgroundColor: '#d4a853', color: '#1a0d1e', borderColor: '#b08020',
              boxShadow: '0 4px 0 #8a6018, 0 6px 12px rgba(0,0,0,0.4)',
            }}>
            📂 继续旅程
          </button>
        )}

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="font-pixel text-sm px-8 py-2 border-2 tracking-wider transition-all hover:scale-105"
          style={{
            backgroundColor: '#3d2b3e', color: '#e8d5c4', borderColor: '#5a3d5c',
            boxShadow: '0 3px 0 #2d1b2e, 0 4px 8px rgba(0,0,0,0.3)',
          }}>
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
            <p>💬 <span className="text-game-accent">对话：</span>靠近NPC按 E / 点击NPC</p>
            <p>📦 <span className="text-game-accent">背包：</span>按 I 键</p>
            <p>🗺️ <span className="text-game-accent">地图：</span>按 M 键</p>
            <p>🏗️ <span className="text-game-accent">建造：</span>按 B 键</p>
            <p>📋 <span className="text-game-accent">任务：</span>按 J 键</p>
            <p>🔊 <span className="text-game-accent">音乐开关：</span>按 N 键</p>
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
