/* ============================================
   沉思谷物鱼 - Quest Panel
   Meditation Valley Fish
   ============================================ */

import React, { useState } from 'react';
import { useGameStore } from '../../services/GameState';
import { ALL_QUESTS } from '../../data/quests';
import { QuestType } from '../../utils/types';

export const QuestPanel: React.FC = () => {
  const { player, activeQuests, closePanel, acceptQuest } = useGameStore();
  const [selectedTab, setSelectedTab] = useState<QuestType | 'active'>('active');

  const tabs: { key: QuestType | 'active'; label: string }[] = [
    { key: 'active', label: '进行中' },
    { key: QuestType.Main, label: '主线' },
    { key: QuestType.Side, label: '支线' },
    { key: QuestType.Daily, label: '每日' },
  ];

  const activeQuestData = ALL_QUESTS.filter(q =>
    activeQuests.some(aq => aq.questId === q.id && !aq.completed)
  );

  const availableQuests = ALL_QUESTS.filter(q => {
    if (selectedTab === 'active') return false;
    if (q.type !== selectedTab) return false;
    if (player.completedQuests.includes(q.id) && !q.isRepeatable) return false;
    if (activeQuests.some(aq => aq.questId === q.id)) return false;
    // Check prerequisites
    return q.prerequisites.every(p => player.completedQuests.includes(p));
  });

  const displayQuests = selectedTab === 'active' ? activeQuestData : availableQuests;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="pixel-panel w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-pixel text-sm text-game-accent">📋 任务日志</h2>
          <span className="font-pixel text-xs text-game-text">
            已完成: {player.completedQuests.length}
          </span>
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
                  ? 'bg-game-accent/30 border-game-accent text-game-accent'
                  : 'bg-game-panel border-game-border text-game-text hover:border-game-text'
                }`}
            >
              {tab.label}
              {tab.key === 'active' && activeQuestData.length > 0 && ` (${activeQuestData.length})`}
            </button>
          ))}
        </div>

        {/* Quest list */}
        <div className="overflow-y-auto flex-1 space-y-2" style={{ maxHeight: '450px' }}>
          {displayQuests.map(quest => {
            const typeColors: Record<QuestType, string> = {
              [QuestType.Main]: '#d4a853',
              [QuestType.Side]: '#7eb5a6',
              [QuestType.Daily]: '#4a8fbf',
            };

            const progress = activeQuests.find(aq => aq.questId === quest.id);
            const isActive = !!progress;

            return (
              <div key={quest.id} className="border border-game-border bg-game-bg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className="font-pixel text-[8px] px-2 py-0.5 mr-2"
                      style={{ backgroundColor: typeColors[quest.type], color: '#fff' }}
                    >
                      quest.type === QuestType.Main ? '主线' : quest.type === QuestType.Side ? '支线' : '每日'
                    </span>
                    <span className="font-pixel text-[11px] text-game-text">{quest.name}</span>
                  </div>
                  {!isActive && (
                    <button
                      onClick={() => acceptQuest(quest.id)}
                      className="pixel-btn text-[8px] px-2 py-1"
                    >
                      接受
                    </button>
                  )}
                </div>

                <p className="font-pixel text-[9px] text-game-border mt-2">{quest.description}</p>

                {/* Objectives */}
                <div className="mt-2 space-y-1">
                  {quest.objectives.map((obj, i) => {
                    const prog = progress?.objectives.find(o => o.index === i);
                    const current = prog?.progress || 0;
                    const pct = Math.min(100, (current / obj.quantity) * 100);

                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-pixel text-[8px] text-game-text w-20">
                          {{ catch_fish: '🎣 钓鱼', collect_item: '📦 收集', talk_to_npc: '💬 对话',
                            reach_gold: '💰 金币', build_structure: '🏗️ 建造', reach_relationship: '💝 好感' }[obj.type]}
                        </span>
                        <div className="flex-1 h-3 bg-game-panel border border-game-border">
                          <div className="h-full bg-game-accent transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-pixel text-[8px] text-game-text w-12 text-right">
                          {current}/{obj.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Rewards */}
                <div className="mt-2 font-pixel text-[9px] text-game-gold">
                  🎁 奖励: {quest.rewards.gold > 0 && `${quest.rewards.gold} G`}
                  {quest.rewards.items?.map(i => ` ${i.itemId} x${i.quantity}`)}
                </div>
              </div>
            );
          })}

          {displayQuests.length === 0 && (
            <div className="text-center font-pixel text-xs text-game-border py-8">
              {selectedTab === 'active' ? '暂无进行中的任务。' : '暂无可接受的任务。'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
