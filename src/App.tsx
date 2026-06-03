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
import { resumeAudio } from './utils/SoundFX';

const App: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const {
    gameStarted, currentPanel, notification,
    closePanel, clearNotification, player,
  } = useGameStore();

  // Scene transition state
  const [sceneTransition, setSceneTransition] = useState<FishingLocation | null>(null);
  const prevMap = useRef(player.currentMap);

  // Show location name on game start and map changes
  useEffect(() => {
    if (gameStarted) {
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

  // ── ALL keyboard shortcuts (single handler, capture phase) ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const s = useGameStore.getState();
      if (!s.gameStarted) return;
      if (s.currentPanel === 'fishing_game') return; // let minigame handle keys

      const panel = s.currentPanel;
      const code = e.code;

      // ── ESC ──
      if (code === 'Escape') {
        e.preventDefault();
        if (panel !== 'none') s.closePanel();
        else s.openPanel('settings');
      }
      // ── I: backpack ──
      else if (code === 'KeyI') {
        if (panel === 'none') s.openPanel('backpack');
        else if (panel === 'backpack') s.closePanel();
      }
      // ── M: map ──
      else if (code === 'KeyM') {
        if (panel === 'none') s.openPanel('map');
        else if (panel === 'map') s.closePanel();
      }
      // ── B: building ──
      else if (code === 'KeyB') {
        if (panel === 'none') s.openPanel('building');
        else if (panel === 'building') s.closePanel();
      }
      // ── J: quests ──
      else if (code === 'KeyJ') {
        if (panel === 'none') s.openPanel('quests');
        else if (panel === 'quests') s.closePanel();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!gameStarted) {
    return <MainMenu />;
  }

  return (
    <div className="w-full h-full relative bg-game-bg overflow-hidden" onClick={resumeAudio}>
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
