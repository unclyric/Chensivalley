/* ============================================
   沉思谷物鱼 - React Fishing Minigame UI
   Meditation Valley Fish
   ============================================ */

import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../services/GameState';

export const FishingMinigameUI: React.FC = () => {
  const { fishingGame, updateFishingBar, endFishing, closePanel, showNotification, addGold } = useGameStore();
  const barRef = useRef<HTMLDivElement>(null);
  const mouseDown = useRef(false);
  const barPosition = useRef(50);
  const animFrameRef = useRef<number>(0);

  const fg = fishingGame;
  if (!fg.active) return null;

  const updateBar = useCallback(() => {
    if (!fg.active) return;

    // Update bar position (慢速，让钓鱼更容易)
    if (mouseDown.current) {
      barPosition.current = Math.max(0, barPosition.current - 1.0);
    } else {
      barPosition.current = Math.min(100, barPosition.current + 0.5);
    }

    updateFishingBar(barPosition.current);

    // Check win
    if (fg.progress >= fg.maxProgress) {
      const result = endFishing(true);
      if (result && fg.fish) {
        const value = Math.round(fg.fish.baseValue * (result.size / fg.fish.maxSize) * (result.quality / 100) * (result.perfect ? 1.5 : 1));
        addGold(value);
        showNotification(
          `🎣 钓到了 ${fg.fish.name}！${result.perfect ? ' ✨完美✨' : ''}\n尺寸: ${result.size}cm | 品质: ${result.quality}% | +${value}G`
        );
        // Check quest progress for fishing objectives
        const store = useGameStore.getState();
        store.checkQuestProgress('catch_fish', fg.fish.id, 1);
      }
      closePanel();
      return;
    }

    animFrameRef.current = requestAnimationFrame(updateBar);
  }, [fg.active, fg.progress, fg.maxProgress, fg.fish, updateFishingBar, endFishing, closePanel, showNotification, addGold]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updateBar);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateBar]);

  // Keyboard controls
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        mouseDown.current = true;
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        mouseDown.current = false;
      }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  if (!fg.fish) return null;

  const fishName = fg.fish.name;
  const progress = Math.round((fg.progress / fg.maxProgress) * 100);
  const fishColor = fg.fish.color || '#ffa040';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col items-center gap-4">
        {/* Title */}
        <div className="font-pixel text-sm text-white text-center">
          🎣 {fishName}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-4 bg-gray-800 border-2 border-game-border">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: progress >= 100 ? '#4aff4a' : '#2aaf2a',
            }}
          />
        </div>
        <div className="font-pixel text-[10px] text-white">{progress}%</div>

        {/* Fishing area */}
        <div
          ref={barRef}
          className="relative w-12 h-56 bg-blue-900/80 border-2 border-game-accent"
          onMouseDown={() => { mouseDown.current = true; }}
          onMouseUp={() => { mouseDown.current = false; }}
          onMouseLeave={() => { mouseDown.current = false; }}
          onTouchStart={() => { mouseDown.current = true; }}
          onTouchEnd={() => { mouseDown.current = false; }}
        >
          {/* Fish */}
          <div
            className="absolute left-0 right-0 flex justify-center transition-all duration-75"
            style={{
              top: `${fg.fishPosition}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <div
              className="w-8 h-5 rounded-full"
              style={{ backgroundColor: fishColor }}
            />
          </div>

          {/* Green capture bar */}
          <div
            className="absolute left-0 right-0 transition-all duration-75"
            style={{
              top: `${fg.barPosition - fg.barSize / 2}%`,
              height: `${fg.barSize}%`,
              backgroundColor: fg.perfect ? 'rgba(74, 255, 74, 0.7)' : 'rgba(255, 170, 0, 0.7)',
              borderTop: '2px solid white',
              borderBottom: '2px solid white',
            }}
          />
        </div>

        {/* Instructions */}
        <div className="font-pixel text-[8px] text-gray-400 text-center leading-relaxed">
          按住空格键或鼠标：绿色框上升<br />
          松开：绿色框下降<br />
          将鱼保持在绿色区域内！
        </div>

        {/* Cancel */}
        <button
          onClick={() => {
            endFishing(false);
            showNotification('放弃了钓鱼...');
            closePanel();
          }}
          className="pixel-btn text-[9px]"
        >
          ✕ 放弃
        </button>
      </div>
    </div>
  );
};
