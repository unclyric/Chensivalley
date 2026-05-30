/* ============================================
   沉思谷物鱼 - Phaser Game Instance Manager
   Meditation Valley Fish
   ============================================ */

import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';
import { FishingScene } from '../scenes/FishingScene';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../utils/constants';

export class PhaserGameManager {
  private static instance: PhaserGameManager;
  private game: Phaser.Game | null = null;

  static getInstance(): PhaserGameManager {
    if (!PhaserGameManager.instance) {
      PhaserGameManager.instance = new PhaserGameManager();
    }
    return PhaserGameManager.instance;
  }

  createGame(parent: string): Phaser.Game {
    const width = MAP_WIDTH * TILE_SIZE * 2; // 2x pixel scale
    const height = MAP_HEIGHT * TILE_SIZE * 2;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent,
      width,
      height,
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      backgroundColor: '#2d1b2e',
      input: {
        keyboard: true,
      },
      dom: {
        createContainer: false,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [BootScene, GameScene, FishingScene],
    };

    this.game = new Phaser.Game(config);
    return this.game;
  }

  getGame(): Phaser.Game | null {
    return this.game;
  }

  getScene<T extends Phaser.Scene>(key: string): T | null {
    return this.game ? (this.game.scene.getScene(key) as T) ?? null : null;
  }

  destroy(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
