/* ============================================
   沉思谷物鱼 - Settings Panel
   Meditation Valley Fish
   ============================================ */

import React, { useState } from 'react';
import { useGameStore } from '../../services/GameState';

export const SettingsPanel: React.FC = () => {
  const { closePanel, openPanel } = useGameStore();
  const [volume, setVolume] = useState(70);
  const [timeScale, setTimeScale] = useState(1);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[450px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-pixel text-sm text-game-accent">⚙️ 设置</h2>
          <button onClick={closePanel} className="pixel-btn text-xs px-3 py-1">✕</button>
        </div>

        <div className="space-y-5">
          {/* Sound */}
          <div>
            <h3 className="font-pixel text-xs text-game-text mb-2">🔊 音量</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-game-bg appearance-none cursor-pointer"
              style={{ accentColor: '#7eb5a6' }}
            />
            <div className="flex justify-between font-pixel text-[8px] text-game-border">
              <span>0%</span>
              <span>{volume}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Time Scale */}
          <div>
            <h3 className="font-pixel text-xs text-game-text mb-2">⏱️ 时间流速</h3>
            <div className="flex gap-2">
              {[
                { value: 0.5, label: '慢速' },
                { value: 1, label: '正常' },
                { value: 2, label: '快速' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTimeScale(opt.value)}
                  className={`font-pixel text-[9px] px-3 py-1 border flex-1
                    ${timeScale === opt.value
                      ? 'border-game-accent bg-game-accent/20 text-game-accent'
                      : 'border-game-border text-game-text hover:border-game-text'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save/Load */}
          <div>
            <h3 className="font-pixel text-xs text-game-text mb-2">💾 存档管理</h3>
            <button
              onClick={() => { closePanel(); openPanel('save_load'); }}
              className="pixel-btn text-[9px] w-full"
            >
              打开存档管理
            </button>
          </div>

          {/* Controls */}
          <div>
            <h3 className="font-pixel text-xs text-game-text mb-2">🎮 快捷操作</h3>
            <div className="font-pixel text-[8px] text-game-text space-y-1 bg-game-bg p-3 border border-game-border">
              <p><span className="text-game-accent">E</span> - 钓鱼 / 对话</p>
              <p><span className="text-game-accent">I</span> - 背包</p>
              <p><span className="text-game-accent">M</span> - 地图</p>
              <p><span className="text-game-accent">J</span> - 任务</p>
              <p><span className="text-game-accent">Esc</span> - 设置</p>
              <p><span className="text-game-accent">方向键 / WASD</span> - 移动</p>
            </div>
          </div>

          {/* About */}
          <div className="pt-4 border-t border-game-border">
            <p className="font-pixel text-[8px] text-game-border text-center">
              沉思谷物鱼 v1.0.0<br />
              Meditation Valley Fish<br />
              Made with ❤️ + Phaser 3 + React
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
