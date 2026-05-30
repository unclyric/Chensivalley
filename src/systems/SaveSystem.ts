/* ============================================
   沉思谷物鱼 - Save / Load System
   Meditation Valley Fish
   ============================================ */

import { GameSave } from '../utils/types';
import { SAVE_KEY } from '../utils/constants';

export class SaveSystem {
  /**
   * Save game data to localStorage
   */
  static saveGame(data: GameSave): boolean {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(SAVE_KEY, json);
      // Also save with timestamp for multiple slots
      const key = `${SAVE_KEY}_${data.timestamp}`;
      localStorage.setItem(key, json);
      // Track save slots
      const slots = this.getSaveSlots();
      if (!slots.includes(data.timestamp)) {
        slots.push(data.timestamp);
        localStorage.setItem(`${SAVE_KEY}_slots`, JSON.stringify(slots));
      }
      return true;
    } catch (e) {
      console.error('Failed to save game:', e);
      return false;
    }
  }

  /**
   * Load the most recent game save
   */
  static loadGame(): GameSave | null {
    try {
      const json = localStorage.getItem(SAVE_KEY);
      if (!json) return null;
      const data = JSON.parse(json) as GameSave;
      this.validateSave(data);
      return data;
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  }

  /**
   * Get all save slots
   */
  static getAllSaves(): GameSave[] {
    try {
      const slots = this.getSaveSlots();
      const saves: GameSave[] = [];
      for (const ts of slots) {
        const json = localStorage.getItem(`${SAVE_KEY}_${ts}`);
        if (json) {
          try {
            const data = JSON.parse(json) as GameSave;
            this.validateSave(data);
            saves.push(data);
          } catch {
            // Skip corrupted saves
          }
        }
      }
      return saves.sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  }

  /**
   * Delete a save by timestamp
   */
  static deleteSave(timestamp: number): void {
    localStorage.removeItem(`${SAVE_KEY}_${timestamp}`);
    const slots = this.getSaveSlots().filter(ts => ts !== timestamp);
    localStorage.setItem(`${SAVE_KEY}_slots`, JSON.stringify(slots));
    // Also clear main save if it matches
    const main = localStorage.getItem(SAVE_KEY);
    if (main) {
      try {
        const data = JSON.parse(main);
        if (data.timestamp === timestamp) {
          localStorage.removeItem(SAVE_KEY);
        }
      } catch { /* ignore */ }
    }
  }

  /**
   * Check if a save exists
   */
  static hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  /**
   * Export save as JSON string (for sharing/backup)
   */
  static exportSave(): string | null {
    const save = this.loadGame();
    return save ? JSON.stringify(save, null, 2) : null;
  }

  /**
   * Import save from JSON string
   */
  static importSave(json: string): boolean {
    try {
      const data = JSON.parse(json) as GameSave;
      this.validateSave(data);
      return this.saveGame(data);
    } catch {
      return false;
    }
  }

  /**
   * Clear all saves
   */
  static clearAll(): void {
    const slots = this.getSaveSlots();
    for (const ts of slots) {
      localStorage.removeItem(`${SAVE_KEY}_${ts}`);
    }
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(`${SAVE_KEY}_slots`);
  }

  // ─── Internal helpers ──────────────────────

  private static getSaveSlots(): number[] {
    try {
      const json = localStorage.getItem(`${SAVE_KEY}_slots`);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  private static validateSave(data: GameSave): void {
    if (!data.version) throw new Error('Invalid save: missing version');
    if (!data.player) throw new Error('Invalid save: missing player data');
    if (!data.time) throw new Error('Invalid save: missing time data');
  }
}

/**
 * Auto-save manager: periodically saves the game
 */
export class AutoSaveManager {
  private interval: number | null = null;
  private intervalMs: number;

  constructor(intervalMinutes: number = 5) {
    this.intervalMs = intervalMinutes * 60 * 1000;
  }

  start(): void {
    if (this.interval !== null) return;
    this.interval = window.setInterval(() => {
      this.performAutoSave();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async performAutoSave(): Promise<void> {
    // Dynamic import to avoid circular dependency
    const { useGameStore } = await import('../services/GameState');
    const state = useGameStore.getState();
    if (!state.gameStarted) return;

    const saveData: GameSave = {
      version: '1.0.0',
      timestamp: Date.now(),
      player: { ...state.player },
      time: { ...state.time },
      weather: { ...state.weather },
      discoveredFish: state.player.fishCaught,
      fishEncyclopedia: state.fishData,
      npcs: Object.fromEntries(
        Object.entries(state.npcData).map(([id]) => [
          id,
          {
            friendship: state.player.relationships[id] || 0,
            met: (state.player.relationships[id] || 0) > 0,
            questsCompleted: [],
          },
        ])
      ),
      activeQuests: state.activeQuests,
      flags: state.flags,
    };

    SaveSystem.saveGame(saveData);
    console.log('[AutoSave] Game saved at', new Date().toLocaleTimeString());
  }
}
