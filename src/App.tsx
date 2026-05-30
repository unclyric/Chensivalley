/* ============================================
   沉思谷物鱼 - App Root Component
   Meditation Valley Fish
   ============================================ */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from './services/GameState';
import { PhaserGameManager } from './services/PhaserGame';
import { MainMenu } from './components/ui/MainMenu';
import { Backpack } from './components/ui/Backpack';
import { FishEncyclopedia } from './components/ui/FishEncyclopedia';
import { ShopPanel } from './components/ui/Shop';
import { QuestPanel } from './components/ui/QuestPanel';
import { BuildingMenu } from './components/ui/BuildingMenu';
import { NPCDialog } from './components/ui/NPCDialog';
import { FishPondPanel } from './components/ui/FishPondPanel';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { SaveLoadPanel } from './components/ui/SaveLoadPanel';
import { Notification } from './components/ui/Notification';
import { FishingMinigameUI } from './components/ui/FishingMinigameUI';
import { MapPanel } from './components/ui/MapPanel';
import { SceneTransition } from './components/ui/SceneTransition';
import { FishingLocation } from './utils/types';

const App: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const {
    gameStarted, currentPanel, notification,
    closePanel, clearNotification, player,
  } = useGameStore();

  // Scene transition state
  const [sceneTransition, setSceneTransition] = useState<FishingLocation | null>(null);
  const prevMap = useRef(player.currentMap);

  // Watch for map changes to show transition
  useEffect(() => {
    if (gameStarted && player.currentMap !== prevMap.current) {
      setSceneTransition(player.currentMap);
      prevMap.current = player.currentMap;
    }
  }, [player.currentMap, gameStarted]);

  const handleTransitionComplete = useCallback(() => {
    setSceneTransition(null);
  }, []);

  // Initialize Phaser game
  useEffect(() => {
    if (gameStarted && gameContainerRef.current) {
      const manager = PhaserGameManager.getInstance();
      const existingGame = manager.getGame();
      if (!existingGame) {
        manager.createGame('game-container');
      }
    }

    return () => {
      // Clean up
      const manager = PhaserGameManager.getInstance();
      if (!gameStarted) {
        manager.destroy();
      }
    };
  }, [gameStarted]);

  // Keyboard shortcuts (only for keys NOT handled by Phaser GameScene)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if target is an input/textarea
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      const store = useGameStore.getState();
      if (e.key === 'Escape') {
        if (store.currentPanel !== 'none' && store.currentPanel !== 'fishing_game') {
          store.closePanel();
        } else if (store.currentPanel === 'none') {
          store.openPanel('settings');
        }
      }
      if (e.key === 'j' || e.key === 'J') {
        if (store.currentPanel === 'none') store.openPanel('quests');
        else if (store.currentPanel === 'quests') store.closePanel();
      }
      if (e.key === 'b' || e.key === 'B') {
        if (store.currentPanel === 'none') store.openPanel('building');
        else if (store.currentPanel === 'building') store.closePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!gameStarted) {
    return <MainMenu />;
  }

  return (
    <div className="w-full h-full relative bg-game-bg overflow-hidden">
      {/* Phaser Game Container */}
      <div id="game-container" ref={gameContainerRef} />

      {/* React UI Overlay */}
      <div id="ui-overlay">
        {/* Panels */}
        {currentPanel === 'backpack' && <Backpack />}
        {currentPanel === 'encyclopedia' && <FishEncyclopedia />}
        {currentPanel === 'shop' && <ShopPanel />}
        {currentPanel === 'quests' && <QuestPanel />}
        {currentPanel === 'building' && <BuildingMenu />}
        {currentPanel === 'npc_dialog' && <NPCDialog />}
        {currentPanel === 'fish_pond' && <FishPondPanel />}
        {currentPanel === 'settings' && <SettingsPanel />}
        {currentPanel === 'save_load' && <SaveLoadPanel />}
        {currentPanel === 'map' && <MapPanel />}
        {currentPanel === 'fishing_game' && <FishingMinigameUI />}

        {/* Notification Toast */}
        {notification && (
          <Notification message={notification} onDismiss={clearNotification} />
        )}

        {/* Scene Transition Overlay */}
        {sceneTransition && (
          <SceneTransition
            location={sceneTransition}
            onComplete={handleTransitionComplete}
          />
        )}
      </div>
    </div>
  );
};

export default App;
