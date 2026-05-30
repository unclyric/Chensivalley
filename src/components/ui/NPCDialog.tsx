/* ============================================
   沉思谷物鱼 - NPC Dialog Panel
   Meditation Valley Fish
   ============================================ */

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../services/GameState';

export const NPCDialog: React.FC = () => {
  const {
    dialogNPCId, dialogTexts, dialogIndex,
    advanceDialog, npcData, showNotification,
  } = useGameStore();

  const [isClosing, setIsClosing] = useState(false);

  const npc = dialogNPCId ? npcData[dialogNPCId] : null;
  const currentText = dialogTexts[dialogIndex] || '';
  const isLastMessage = dialogIndex >= dialogTexts.length - 1;

  // Allow advancing dialog with Space/Enter
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dialogIndex, dialogTexts.length]);

  const handleAdvance = () => {
    if (isClosing) return;

    if (isLastMessage) {
      // Closing dialog - show feedback
      setIsClosing(true);
      if (npc) {
        showNotification(`💬 与 ${npc.name} 的对话结束了`);
      }
      setTimeout(() => {
        advanceDialog(); // This will close the panel
        setIsClosing(false);
      }, 300);
    } else {
      advanceDialog();
    }
  };

  if (!npc) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center pb-4">
      <div
        className={`pixel-panel w-[600px] cursor-pointer transition-all duration-300
          ${isClosing ? 'opacity-0 translate-y-4' : 'animate-slide-in opacity-100'}`}
        onClick={handleAdvance}
      >
        {/* NPC Info */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 border-2 border-game-accent flex items-center justify-center text-lg"
            style={{ backgroundColor: '#3d2b3e' }}
          >
            🧑
          </div>
          <div>
            <div className="font-pixel text-sm text-game-accent">{npc.name}</div>
            <div className="font-pixel text-[9px] text-game-border">{npc.title}</div>
          </div>
          {/* Hearts */}
          <div className="ml-auto font-pixel text-[10px]">
            {(() => {
              const hearts = useGameStore.getState().player.relationships[dialogNPCId || ''] || 0;
              return '❤️'.repeat(Math.floor(hearts / 2)) + '🤍'.repeat(5 - Math.floor(hearts / 2));
            })()}
          </div>
        </div>

        {/* Dialog text */}
        <div className="font-pixel text-xs text-game-text leading-relaxed min-h-[40px]">
          {currentText}
        </div>

        {/* Continue hint */}
        <div className="font-pixel text-[8px] text-game-border text-right mt-3 animate-pulse">
          {isLastMessage ? '点击或按空格键结束对话 ▲' : '点击或按空格键继续 ▼'}
        </div>
      </div>
    </div>
  );
};
