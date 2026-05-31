/* ============================================
   沉思谷物鱼 - Boot Scene (Safe Texture Gen)
   ============================================ */

import Phaser from 'phaser';
import { TILE_SIZE, PALETTE } from '../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload(): void {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.add.text(w / 2, h / 2, '加载中...', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px', color: '#e8d5c4',
    }).setOrigin(0.5);

    // Load background music
    this.load.audio('bgm', '/bgm.mp3');
  }

  create(): void {
    this.generateTextures();
    this.scene.start('GameScene');
  }

  private generateTextures(): void {
    this.createTileTextures();
    this.createPlayerTexture();
    this.createNPCTextures();
    this.createFishTextures();
    this.createBuildingTextures();
    this.createUITextures();
  }

  // ─── TILES (safe fillStyle only) ──────────

  private createTileTextures(): void {
    const S = TILE_SIZE * 2;

    // Water - 3-layer blue
    const wG = this.make.graphics({ x: 0, y: 0 });
    wG.fillStyle(0x1a5276); wG.fillRect(0, 0, S, S);
    wG.fillStyle(0x2980b9, 0.6); wG.fillRect(0, 2, S, S - 4);
    wG.fillStyle(0x3498db, 0.3); wG.fillRect(2, 4, S - 4, S - 8);
    wG.fillStyle(0x85c1e9, 0.15); wG.fillRect(4, S / 2, 6, 1);
    wG.fillStyle(0x85c1e9, 0.1); wG.fillRect(S - 10, S / 3, 6, 1);
    wG.generateTexture('tile_water', S, S); wG.destroy();

    // Water edge
    const weG = this.make.graphics({ x: 0, y: 0 });
    weG.fillStyle(0xf0d9b5); weG.fillRect(0, 0, S, S);
    weG.fillStyle(0x2980b9, 0.8); weG.fillRect(0, S - 6, S, 6);
    weG.fillStyle(0x3498db, 0.4); weG.fillRect(2, S - 3, S - 4, 3);
    weG.generateTexture('tile_water_edge', S, S); weG.destroy();

    // Grass - layered greens
    const gG = this.make.graphics({ x: 0, y: 0 });
    gG.fillStyle(0x1e8449); gG.fillRect(0, 0, S, S);
    gG.fillStyle(0x52be80); gG.fillRect(0, 1, S, S - 2);
    gG.fillStyle(0x7dcea0, 0.5);
    for (let i = 0; i < 10; i++) {
      gG.fillRect((i * 7 + 3) % S, (i * 5) % S, 2, 3);
    }
    gG.fillStyle(0x000000, 0.06); gG.fillRect(0, S - 2, S, 2);
    gG.generateTexture('tile_grass', S, S); gG.destroy();

    // Dirt
    const dG = this.make.graphics({ x: 0, y: 0 });
    dG.fillStyle(0xaf7d4b); dG.fillRect(0, 0, S, S);
    dG.fillStyle(0xc49a6c, 0.5);
    for (let i = 0; i < 6; i++) dG.fillRect((i * 11 + 2) % S, (i * 7) % S, 3, 2);
    dG.generateTexture('tile_dirt', S, S); dG.destroy();

    // Stone
    const sG = this.make.graphics({ x: 0, y: 0 });
    sG.fillStyle(0x808b96); sG.fillRect(0, 0, S, S);
    sG.fillStyle(0x9aa5b0); sG.fillRect(3, 3, 7, 5);
    sG.fillStyle(0x6a757e); sG.fillRect(12, 10, 5, 4);
    sG.generateTexture('tile_stone', S, S); sG.destroy();

    // Tree with shadow
    const tG = this.make.graphics({ x: 0, y: 0 });
    tG.fillStyle(0x000000, 0.12); tG.fillEllipse(S / 2, S - 2, S - 4, 6);
    tG.fillStyle(0x6e4c1e); tG.fillRect(S / 2 - 3, 8, 6, S - 8);
    tG.fillStyle(0x2d7a2d); tG.fillCircle(S / 2, 6, 9);
    tG.fillCircle(S / 2 - 4, 7, 7);
    tG.fillCircle(S / 2 + 4, 7, 7);
    tG.fillStyle(0x4da64d, 0.6); tG.fillCircle(S / 2, 4, 6);
    tG.generateTexture('tile_tree', S, S); tG.destroy();

    // Bush
    const bG = this.make.graphics({ x: 0, y: 0 });
    bG.fillStyle(0x000000, 0.1); bG.fillEllipse(S / 2, S - 1, S - 2, 4);
    bG.fillStyle(0x3d7a3d); bG.fillCircle(S / 2, S / 2 + 2, 8);
    bG.fillCircle(S / 2 - 4, S / 2 + 1, 6);
    bG.fillCircle(S / 2 + 4, S / 2 + 1, 6);
    bG.fillStyle(0x5a9a5a, 0.5); bG.fillCircle(S / 2, S / 2, 4);
    bG.generateTexture('tile_bush', S, S); bG.destroy();

    // Flower
    const fG = this.make.graphics({ x: 0, y: 0 });
    fG.fillStyle(0x52be80); fG.fillRect(S / 2 - 1, 8, 2, S - 8);
    fG.fillStyle(0xe8a0bf); fG.fillCircle(S / 2, 5, 5);
    fG.fillStyle(0xf4d03f); fG.fillCircle(S / 2, 5, 2);
    fG.generateTexture('tile_flower', S, S); fG.destroy();

    // Dock
    const dkG = this.make.graphics({ x: 0, y: 0 });
    dkG.fillStyle(0xc4a35a); dkG.fillRect(0, 0, S, S);
    dkG.fillStyle(0x8b6914, 0.4);
    for (let x = 0; x < S; x += 4) dkG.fillRect(x, 1, 2, S - 2);
    dkG.fillStyle(0x000000, 0.1); dkG.fillRect(0, S - 2, S, 2);
    dkG.generateTexture('tile_dock', S, S); dkG.destroy();

    // Bridge
    const brG = this.make.graphics({ x: 0, y: 0 });
    brG.fillStyle(0x8b6914); brG.fillRect(0, 6, S, 4);
    for (let x = 0; x < S; x += 4) brG.fillRect(x, 6, 2, 4);
    brG.fillStyle(0x000000, 0.1); brG.fillRect(0, 5, S, 1);
    brG.fillRect(0, 10, S, 1);
    brG.generateTexture('tile_bridge', S, S); brG.destroy();
  }

  // ─── PLAYER (blue dress, feminine) ─────────

  private createPlayerTexture(): void {
    const sc = 2, total = 16 * sc, gfx = this.make.graphics({ x: 0, y: 0 });

    // Long hair behind
    gfx.fillStyle(0x4a2a2a);
    gfx.fillRect(2 * sc, 5 * sc, 3 * sc, 7 * sc);
    gfx.fillRect(11 * sc, 5 * sc, 3 * sc, 7 * sc);
    gfx.fillRect(3 * sc, 10 * sc, 2 * sc, 6 * sc);
    gfx.fillRect(11 * sc, 10 * sc, 2 * sc, 6 * sc);

    // Blue dress
    gfx.fillStyle(0x3068a0); gfx.fillRect(3 * sc, 7 * sc, 10 * sc, 5 * sc);
    gfx.fillStyle(0x5090c0); gfx.fillRect(4 * sc, 7 * sc, 8 * sc, 3 * sc);
    gfx.fillStyle(0x5090c0); gfx.fillRect(3 * sc, 11 * sc, 10 * sc, 4 * sc);
    gfx.fillStyle(0x70b0e0); gfx.fillRect(5 * sc, 7 * sc, 3 * sc, 2 * sc);
    gfx.fillStyle(0xd4a853); gfx.fillRect(4 * sc, 10 * sc, 8 * sc, 1 * sc);

    // Head
    gfx.fillStyle(0xfce4c8); gfx.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);

    // Hair bangs + ribbon
    gfx.fillStyle(0x4a2a2a);
    gfx.fillRect(5 * sc, 1 * sc, 6 * sc, 2 * sc);
    gfx.fillRect(4 * sc, 2 * sc, 2 * sc, 3 * sc);
    gfx.fillRect(10 * sc, 2 * sc, 2 * sc, 3 * sc);
    gfx.fillStyle(0x80c0f0); gfx.fillRect(10 * sc, 0, 3 * sc, 2 * sc); // blue ribbon

    // Eyes + blush
    gfx.fillStyle(0xffffff); gfx.fillRect(6 * sc, 3 * sc, 3 * sc, 3 * sc);
    gfx.fillRect(9 * sc, 3 * sc, 3 * sc, 3 * sc);
    gfx.fillStyle(0x2a4060); gfx.fillRect(7 * sc, 3 * sc, 2 * sc, 3 * sc);
    gfx.fillRect(10 * sc, 3 * sc, 2 * sc, 3 * sc);
    gfx.fillStyle(0xffffff); gfx.fillRect(7 * sc, 3 * sc, 1 * sc, 1 * sc);
    gfx.fillRect(10 * sc, 3 * sc, 1 * sc, 1 * sc);
    gfx.fillStyle(0x000000); gfx.fillRect(6 * sc, 3 * sc, 3 * sc, 1 * sc);
    gfx.fillRect(9 * sc, 3 * sc, 3 * sc, 1 * sc);
    gfx.fillStyle(0xf0a0a0, 0.4); gfx.fillRect(5 * sc, 5 * sc, 2 * sc, 1 * sc);
    gfx.fillRect(9 * sc, 5 * sc, 2 * sc, 1 * sc);
    gfx.fillStyle(0x6a3040); gfx.fillRect(7 * sc, 5 * sc, 2 * sc, 1 * sc);

    // Arms
    gfx.fillStyle(0xfce4c8); gfx.fillRect(2 * sc, 8 * sc, 3 * sc, 4 * sc);
    gfx.fillRect(11 * sc, 8 * sc, 3 * sc, 4 * sc);

    // Boots
    gfx.fillStyle(0x6a4a3a); gfx.fillRect(5 * sc, 14 * sc, 4 * sc, 2 * sc);
    gfx.fillRect(9 * sc, 14 * sc, 4 * sc, 2 * sc);
    gfx.fillStyle(0xf8f4f0); gfx.fillRect(5 * sc, 13 * sc, 4 * sc, 2 * sc);
    gfx.fillRect(9 * sc, 13 * sc, 4 * sc, 2 * sc);

    // Rod
    gfx.fillStyle(0x8b6914); gfx.fillRect(13 * sc, 2 * sc, 2 * sc, 13 * sc);
    gfx.lineStyle(1, 0xe8e8e8); gfx.lineBetween(14 * sc, 15 * sc, 16 * sc, 16 * sc);

    gfx.generateTexture('player', total, total); gfx.destroy();
  }

  // ─── NPCs (all detailed, unique) ───────────

  private createNPCTextures(): void {
    const sc = 2, T = 16 * sc;

    const drawNPCs = [
      // 0: 华泽 (wise, grey hair, brown robe)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x6a5a4a); g.fillRect(3 * sc, 7 * sc, 10 * sc, 5 * sc);
        g.fillStyle(0x8a7a6a); g.fillRect(4 * sc, 7 * sc, 8 * sc, 2 * sc);
        g.fillStyle(0xb0b0b0); g.fillRect(3 * sc, 0, 10 * sc, 4 * sc);
        g.fillRect(2 * sc, 2 * sc, 3 * sc, 3 * sc); g.fillRect(11 * sc, 2 * sc, 3 * sc, 3 * sc);
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 3 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x000000); g.fillRect(6 * sc, 5 * sc, 2 * sc, 1 * sc);
        g.fillRect(9 * sc, 5 * sc, 2 * sc, 1 * sc);
        g.fillStyle(0xd0d0d0); g.fillRect(5 * sc, 7 * sc, 6 * sc, 3 * sc);
      },
      // 1: 智爸 (merchant, hat, red coat)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0xbf3030); g.fillRect(4 * sc, 6 * sc, 8 * sc, 5 * sc);
        g.fillStyle(0x8a6a30); g.fillRect(2 * sc, 7 * sc, 3 * sc, 5 * sc);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x5d3a1a); g.fillRect(2 * sc, 0, 12 * sc, 3 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 1 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1 * sc, 2 * sc);
      },
      // 2: 鳞教授 (white coat, glasses, bun)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0xf0f0f0); g.fillRect(3 * sc, 6 * sc, 10 * sc, 5 * sc);
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x3a2a1a); g.fillRect(5 * sc, 1 * sc, 6 * sc, 2 * sc);
        g.fillRect(11 * sc, 2 * sc, 2 * sc, 3 * sc);
        g.fillStyle(0x333333); g.fillRect(6 * sc, 3 * sc, 3 * sc, 2 * sc);
        g.fillRect(9 * sc, 3 * sc, 3 * sc, 2 * sc);
      },
      // 3: 老聂 (navy coat, cap)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x2a4a6a); g.fillRect(4 * sc, 6 * sc, 8 * sc, 5 * sc);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x1a3040); g.fillRect(4 * sc, 0, 8 * sc, 3 * sc);
        g.fillStyle(0xd4a853); g.fillRect(5 * sc, 2 * sc, 6 * sc, 1 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillRect(9 * sc, 4 * sc, 1 * sc, 1 * sc);
      },
      // 4: 佳佳 (female painter, beret, green smock)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x5a8a5a); g.fillRect(4 * sc, 6 * sc, 8 * sc, 5 * sc);
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xc04040); g.fillCircle(8 * sc, 2 * sc, 5 * sc);
        g.fillStyle(0x5d3a1a); g.fillRect(4 * sc, 3 * sc, 4 * sc, 3 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0xffffff); g.fillRect(7 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillRect(10 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillStyle(0xf0a0a0, 0.3); g.fillRect(6 * sc, 5 * sc, 1 * sc, 1 * sc);
        g.fillRect(9 * sc, 5 * sc, 1 * sc, 1 * sc);
        // paint palette
        g.fillStyle(0x8a6a4a); g.fillRect(1 * sc, 8 * sc, 3 * sc, 4 * sc);
      },
      // 5: 淇爹 (male, tea house, qipao-style)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x4a3050); g.fillRect(4 * sc, 6 * sc, 8 * sc, 5 * sc);
        g.fillStyle(0x6a4a70); g.fillRect(5 * sc, 7 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x2a1a10); g.fillRect(5 * sc, 1 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillRect(9 * sc, 4 * sc, 1 * sc, 1 * sc);
        // subtle mustache
        g.fillStyle(0x3a2a1a, 0.5); g.fillRect(7 * sc, 6 * sc, 2 * sc, 1 * sc);
      },
      // 6: 小鱼 (kid, cap, green)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x4a8f4a); g.fillRect(5 * sc, 6 * sc, 6 * sc, 4 * sc);
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xe8a040); g.fillRect(4 * sc, 0, 8 * sc, 3 * sc);
        g.fillStyle(0x000000); g.fillRect(6 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillRect(9 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0xffffff); g.fillRect(6 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillRect(9 * sc, 4 * sc, 1 * sc, 1 * sc);
      },
      // 7: 格雷福斯 (ex-sailor, striped shirt, white beard)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x3a5a8a); g.fillRect(4 * sc, 6 * sc, 8 * sc, 5 * sc);
        g.fillStyle(0xf0f0f0);
        for (let py = 7; py < 11; py += 2) g.fillRect(4 * sc, py * sc, 8 * sc, 1 * sc);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xe8e8e8); g.fillRect(4 * sc, 1 * sc, 8 * sc, 2 * sc);
        g.fillStyle(0xe8e8e8); g.fillRect(5 * sc, 6 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillRect(9 * sc, 4 * sc, 1 * sc, 1 * sc);
      },
      // 8: 维克兹 (botanist, green, glasses)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x4a8a4a); g.fillRect(4 * sc, 6 * sc, 8 * sc, 5 * sc);
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x5d3a1a); g.fillRect(5 * sc, 1 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0x444444); g.fillRect(6 * sc, 3 * sc, 3 * sc, 2 * sc);
        g.fillRect(9 * sc, 3 * sc, 3 * sc, 2 * sc);
        g.fillStyle(0x80d080); g.fillRect(7 * sc, 8 * sc, 2 * sc, 2 * sc);
      },
      // 9: 玄虚 (hooded, purple, mystic)
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x3a3050); g.fillRect(2 * sc, 5 * sc, 12 * sc, 7 * sc);
        g.fillStyle(0x3a3050); g.fillTriangle(8 * sc, 0, 2 * sc, 5 * sc, 14 * sc, 5 * sc);
        g.fillStyle(0xfce4c8); g.fillRect(6 * sc, 3 * sc, 4 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(6 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillRect(9 * sc, 4 * sc, 1 * sc, 1 * sc);
        g.fillStyle(0xa0f0a0, 0.8); g.fillRect(7 * sc, 8 * sc, 2 * sc, 2 * sc);
      },
    ];

    drawNPCs.forEach((fn, i) => {
      const gfx = this.make.graphics({ x: 0, y: 0 });
      fn(gfx);
      gfx.fillStyle(0x4a3020);
      gfx.fillRect(6 * sc, 12 * sc, 3 * sc, 2 * sc);
      gfx.fillRect(9 * sc, 12 * sc, 3 * sc, 2 * sc);
      gfx.generateTexture(`npc_${i}`, T, T);
      gfx.destroy();
    });
  }

  // ─── FISH ───────────────────────────────────

  private createFishTextures(): void {
    const fishTypes = [
      { b: 0xc0c0c0, f: 0xa0a0a0, s: 18, y: 0xf0f0f0 },
      { b: 0xe8a040, f: 0xf0c060, s: 22, y: 0xf0d0a0 },
      { b: 0x7a9a5a, f: 0x5a8a4a, s: 20, y: 0xa0c080 },
      { b: 0xffd700, f: 0xffa000, s: 16, y: 0xfff0c0 },
      { b: 0xff7060, f: 0xff4040, s: 24, y: 0xffb0a0 },
      { b: 0x3060c0, f: 0x2050a0, s: 30, y: 0x80a0e0 },
      { b: 0xf0c040, f: 0xd0a030, s: 34, y: 0xf0e0a0 },
      { b: 0xe0e0ff, f: 0xc0c0f0, s: 32, y: 0xf8f8ff },
    ];

    fishTypes.forEach((f, i) => {
      const gfx = this.make.graphics({ x: 0, y: 0 });
      const W = f.s, H = f.s * 0.65;
      gfx.fillStyle(f.b); gfx.fillEllipse(W / 2, H / 2, W, H);
      gfx.fillStyle(f.y, 0.6); gfx.fillEllipse(W / 2, H / 2 + 1, W * 0.7, H * 0.5);
      gfx.fillStyle(f.f); gfx.fillTriangle(W - 2, H / 2, W + 6, H / 2 - 5, W + 6, H / 2 + 5);
      gfx.fillStyle(0xffffff); gfx.fillCircle(W * 0.22, H * 0.4, 3);
      gfx.fillStyle(0x000000); gfx.fillCircle(W * 0.24, H * 0.4, 1.5);
      gfx.fillStyle(f.f, 0.8); gfx.fillTriangle(W * 0.5, 0, W * 0.35, -4, W * 0.6, -4);
      gfx.generateTexture(`fish_${i}`, W + 8, H + 8);
      gfx.destroy();
    });
  }

  // ─── BUILDINGS ──────────────────────────────

  private createBuildingTextures(): void {
    const S = TILE_SIZE * 2;
    const pG = this.make.graphics({ x: 0, y: 0 });
    pG.fillStyle(0x2980b9, 0.6); pG.fillRoundedRect(4, 4, S * 3 - 8, S * 2 - 8, 4);
    pG.lineStyle(3, 0x8b6914); pG.strokeRoundedRect(3, 3, S * 3 - 6, S * 2 - 6, 5);
    pG.fillStyle(0x85c1e9, 0.3); pG.fillRect(8, 6, S * 3 - 16, 3);
    pG.generateTexture('building_pond_small', S * 3, S * 2); pG.destroy();

    const wG = this.make.graphics({ x: 0, y: 0 });
    wG.fillStyle(0x8b6914); wG.fillRect(2, 4, S * 2 - 4, S * 2 - 4);
    wG.fillStyle(0xc4a35a, 0.5); wG.fillRect(4, 4, S - 6, S * 2 - 8);
    wG.fillStyle(0xa04040); wG.fillTriangle(S, 0, 0, 4, S * 2, 4);
    wG.fillStyle(0x5d4e37); wG.fillRect(S - 3, S, 6, S);
    wG.fillStyle(0x000000, 0.15); wG.fillRect(0, S * 2 - 3, S * 2, 4);
    wG.generateTexture('building_warehouse', S * 2, S * 2); wG.destroy();

    const dG = this.make.graphics({ x: 0, y: 0 });
    dG.fillStyle(0xc4a35a); dG.fillRect(0, 0, S * 2, S);
    dG.fillStyle(0x8b6914, 0.4);
    for (let x = 0; x < S * 2; x += 4) dG.fillRect(x, 1, 2, S - 2);
    dG.fillStyle(0x000000, 0.1); dG.fillRect(0, S - 2, S * 2, 2);
    dG.generateTexture('building_dock', S * 2, S); dG.destroy();
  }

  // ─── UI ICONS ───────────────────────────────

  private createUITextures(): void {
    const hG = this.make.graphics({ x: 0, y: 0 });
    hG.fillStyle(0xe85d75); hG.fillCircle(4, 3, 4); hG.fillCircle(10, 3, 4);
    hG.fillTriangle(0, 4, 14, 4, 7, 12);
    hG.generateTexture('ui_heart', 14, 13); hG.destroy();

    const cG = this.make.graphics({ x: 0, y: 0 });
    cG.fillStyle(0xd4a853); cG.fillCircle(7, 7, 7);
    cG.fillStyle(0xc09830); cG.fillCircle(7, 7, 5);
    cG.fillStyle(0xd4a853); cG.fillRect(6, 3, 2, 8);
    cG.generateTexture('ui_coin', 14, 14); cG.destroy();

    const eG = this.make.graphics({ x: 0, y: 0 });
    eG.fillStyle(0xf0d040); eG.fillRect(5, 0, 5, 8);
    eG.fillRect(2, 4, 11, 5); eG.fillRect(0, 9, 15, 4);
    eG.generateTexture('ui_energy', 15, 13); eG.destroy();
  }
}
