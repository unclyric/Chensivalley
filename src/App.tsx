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

  // Keyboard shortcuts (ESC/B/J handled here; WASD/E handled by Phaser)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if target is an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const store = useGameStore.getState();
      if (!store.gameStarted) return;

      // ESC: toggle settings / close any panel
      if (e.key === 'Escape') {
        e.preventDefault(); // prevent browser ESC behavior
        if (store.currentPanel === 'fishing_game') return; // don't close fishing minigame
        if (store.currentPanel !== 'none') {
          store.closePanel();
        } else {
          store.openPanel('settings');
        }
      }
      // B: building menu
      if (e.key === 'b' || e.key === 'B') {
        if (store.currentPanel === 'none') store.openPanel('building');
        else if (store.currentPanel === 'building') store.closePanel();
      }
      // J: quest journal
      if (e.key === 'j' || e.key === 'J') {
        if (store.currentPanel === 'none') store.openPanel('quests');
        else if (store.currentPanel === 'quests') store.closePanel();
      }
      // N: BGM toggle (handled by Phaser, but also here as fallback)
      // I: inventory
      if (e.key === 'i' || e.key === 'I') {
        if (store.currentPanel === 'none') store.openPanel('backpack');
        else if (store.currentPanel === 'backpack') store.closePanel();
      }
      // M: map
      if (e.key === 'm' || e.key === 'M') {
        if (store.currentPanel === 'none') store.openPanel('map');
        else if (store.currentPanel === 'map') store.closePanel();
      }
    };
    // Use capture phase to get keys before Phaser
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
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
