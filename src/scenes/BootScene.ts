/* ============================================
   沉思谷物鱼 - Boot Scene (Safe Texture Gen)
   Meditation Valley Fish
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

  // ─── TILES ─────────────────────────────────

  private createTileTextures(): void {
    const S = TILE_SIZE * 2; // 32px

    // Water - rich layered blues with ripple highlights
    const wG = this.make.graphics({ x: 0, y: 0 });
    wG.fillStyle(0x0d3b5e); wG.fillRect(0, 0, S, S);
    wG.fillStyle(0x1a5276); wG.fillRect(0, 1, S, S - 2);
    wG.fillStyle(0x2471a3, 0.6); wG.fillRect(1, 2, S - 2, S - 4);
    wG.fillStyle(0x2980b9, 0.35); wG.fillRect(2, 3, S - 4, S - 6);
    // Ripple lines
    wG.fillStyle(0x85c1e9, 0.18);
    wG.fillRect(3, 8, 10, 1); wG.fillRect(16, 14, 8, 1);
    wG.fillRect(6, 20, 12, 1); wG.fillRect(18, 26, 6, 1);
    wG.fillStyle(0xaed6f1, 0.12);
    wG.fillRect(8, 10, 6, 1); wG.fillRect(20, 18, 4, 1);
    wG.fillRect(4, 24, 8, 1); wG.fillRect(14, 30, 5, 1);
    // Bottom deep water band
    wG.fillStyle(0x0a2a4a, 0.4); wG.fillRect(0, S - 4, S, 4);
    // Shimmer dots (more + varied)
    wG.fillStyle(0xffffff, 0.1);
    wG.fillRect(10, 12, 2, 1); wG.fillRect(22, 20, 2, 1);
    wG.fillRect(5, 28, 1, 2); wG.fillRect(16, 6, 1, 1);
    wG.fillRect(26, 16, 1, 1); wG.fillRect(8, 24, 2, 1);
    // Faint inverted reflection
    wG.fillStyle(0x1a5a1a, 0.04); wG.fillRect(6, 2, 8, 6);
    wG.generateTexture('tile_water', S, S); wG.destroy();

    // Water edge - sand meeting water
    const weG = this.make.graphics({ x: 0, y: 0 });
    // Sand
    weG.fillStyle(0xe8d5b0); weG.fillRect(0, 0, S, S);
    weG.fillStyle(0xf0d9b5, 0.6); weG.fillRect(0, 0, S, S - 4);
    // Pebbles on sand
    weG.fillStyle(0xd4b896, 0.5); weG.fillRect(6, 4, 3, 2); weG.fillRect(18, 6, 2, 2);
    weG.fillStyle(0xc4a882, 0.4); weG.fillRect(12, 3, 2, 1); weG.fillRect(24, 5, 3, 1);
    // Water lapping at edge
    weG.fillStyle(0x1a5276); weG.fillRect(0, S - 8, S, 2);
    weG.fillStyle(0x2471a3, 0.7); weG.fillRect(0, S - 6, S, 3);
    weG.fillStyle(0x3498db, 0.35); weG.fillRect(2, S - 3, S - 4, 3);
    // Foam line
    weG.fillStyle(0xffffff, 0.15); weG.fillRect(4, S - 9, 6, 1);
    weG.fillRect(16, S - 8, 8, 1);
    weG.generateTexture('tile_water_edge', S, S); weG.destroy();

    // Grass - rich green with texture patches
    const gG = this.make.graphics({ x: 0, y: 0 });
    gG.fillStyle(0x1a6e35); gG.fillRect(0, 0, S, S);
    gG.fillStyle(0x228b3a); gG.fillRect(0, 1, S, S - 2);
    gG.fillStyle(0x2d9d4e, 0.5); gG.fillRect(1, 1, S - 2, S - 3);
    // Grass blade clusters (more + varied)
    gG.fillStyle(0x35b058, 0.45);
    for (let i = 0; i < 20; i++) {
      const gx = (i * 13 + 5) % S, gy = (i * 7 + 2) % (S - 2);
      gG.fillRect(gx, gy, 2, 4); gG.fillRect(gx + 1, gy - 1, 1, 2);
    }
    // V-shaped blades
    gG.fillStyle(0x4eca6f, 0.25);
    for (let i = 0; i < 4; i++) {
      const gx = (i * 19 + 8) % S, gy = (i * 11 + 3) % (S - 4);
      gG.fillRect(gx, gy, 1, 3); gG.fillRect(gx + 2, gy, 1, 4);
    }
    // Tiny wildflower specks
    gG.fillStyle(0xf0f0f0, 0.3); gG.fillRect(8, 6, 1, 1); gG.fillRect(22, 10, 1, 1);
    gG.fillStyle(0xf4d03f, 0.25); gG.fillRect(16, 4, 1, 1);
    gG.fillStyle(0xe8a0bf, 0.2); gG.fillRect(10, 18, 1, 1); gG.fillRect(24, 8, 1, 1);
    // Darker patches
    gG.fillStyle(0x1a6e35, 0.4);
    gG.fillRect(4, 14, 5, 3); gG.fillRect(20, 22, 4, 3);
    // Light highlights
    gG.fillStyle(0x4eca6f, 0.2);
    gG.fillRect(8, 6, 3, 2); gG.fillRect(22, 10, 2, 2);
    // Bottom shadow
    gG.fillStyle(0x000000, 0.08); gG.fillRect(0, S - 2, S, 2);
    gG.generateTexture('tile_grass', S, S); gG.destroy();

    // Dirt path - warm earth tones
    const dG = this.make.graphics({ x: 0, y: 0 });
    dG.fillStyle(0x9b6b3d); dG.fillRect(0, 0, S, S);
    dG.fillStyle(0xb8845a, 0.5); dG.fillRect(1, 1, S - 2, S - 2);
    // Texture spots
    dG.fillStyle(0x8a5a2e, 0.4);
    for (let i = 0; i < 5; i++) dG.fillRect((i * 17 + 3) % S, (i * 9 + 2) % S, 3, 2);
    dG.fillStyle(0xc49a6c, 0.3);
    for (let i = 0; i < 4; i++) dG.fillRect((i * 11 + 6) % S, (i * 13 + 4) % S, 2, 2);
    // Small stones
    dG.fillStyle(0x808b96, 0.3); dG.fillRect(8, 10, 2, 2); dG.fillRect(22, 18, 3, 1);
    dG.generateTexture('tile_dirt', S, S); dG.destroy();

    // Stone tile
    const sG = this.make.graphics({ x: 0, y: 0 });
    sG.fillStyle(0x6a757e); sG.fillRect(0, 0, S, S);
    sG.fillStyle(0x808b96); sG.fillRect(1, 1, S - 2, S - 2);
    sG.fillStyle(0x9aa5b0, 0.4); sG.fillRect(3, 3, 8, 6);
    sG.fillStyle(0x5a6570, 0.4); sG.fillRect(14, 10, 6, 5);
    sG.fillStyle(0x909ba5, 0.3); sG.fillRect(10, 20, 5, 3);
    // Crack lines
    sG.lineStyle(1, 0x5a6570, 0.3);
    sG.lineBetween(8, 2, 12, 10); sG.lineBetween(12, 10, 10, 18);
    sG.generateTexture('tile_stone', S, S); sG.destroy();

    // Rock (1x1 decorative)
    const rG = this.make.graphics({ x: 0, y: 0 });
    rG.fillStyle(0x6a757e); rG.fillRoundedRect(4, 8, S - 8, S - 10, 5);
    rG.fillStyle(0x808b96, 0.5); rG.fillRoundedRect(5, 8, S - 12, S - 14, 4);
    rG.fillStyle(0x9aa5b0, 0.3); rG.fillRect(7, 9, 8, 3);
    rG.fillStyle(0x5a6570, 0.3); rG.fillRect(6, S - 4, 6, 3);
    rG.fillStyle(0x000000, 0.12); rG.fillEllipse(S / 2, S - 1, S - 6, 4);
    rG.generateTexture('env_rock', S, S); rG.destroy();

    // Lily pad (for water decoration)
    const lpG = this.make.graphics({ x: 0, y: 0 });
    lpG.fillStyle(0x2d7a2d); lpG.fillEllipse(S / 2, S / 2, S - 8, S - 12);
    lpG.fillStyle(0x4da64d, 0.5); lpG.fillEllipse(S / 2, S / 2 - 1, S - 12, S - 16);
    lpG.fillStyle(0x1a5a1a, 0.3); lpG.fillRect(S / 2 - 1, 8, 2, 2); // notch
    // Small flower on lily pad
    lpG.fillStyle(0xf0a0c0, 0.6); lpG.fillCircle(S / 2 + 3, S / 2 - 2, 3);
    lpG.fillStyle(0xf4d03f, 0.5); lpG.fillCircle(S / 2 + 3, S / 2 - 2, 1.5);
    lpG.generateTexture('env_lilypad', S, S); lpG.destroy();

    // Tree - 3D with thick trunk going into canopy, layered leaves, ground shadow
    const tG = this.make.graphics({ x: 0, y: 0 });
    // Ground shadow (elongated ellipse for 3D feel)
    tG.fillStyle(0x000000, 0.2); tG.fillEllipse(S / 2, S - 1, S - 8, 5);
    tG.fillStyle(0x000000, 0.08); tG.fillEllipse(S / 2, S, S - 4, 3);
    // Trunk - 3D with bark texture
    tG.fillStyle(0x4a2a10); tG.fillRect(S / 2 - 4, 10, 8, S - 10);
    tG.fillStyle(0x6a4a20); tG.fillRect(S / 2 - 2, 10, 5, S - 12);
    tG.fillStyle(0x3a1a08, 0.4); tG.fillRect(S / 2 - 3, 10, 1.5, S - 10);
    tG.fillRect(S / 2 + 2, 10, 1.5, S - 10);
    // Root flares at base
    tG.fillStyle(0x4a2a10); tG.fillRect(S / 2 - 5, S - 3, 4, 3);
    tG.fillRect(S / 2 + 1, S - 3, 4, 3);
    tG.fillStyle(0x6a4a20, 0.4); tG.fillRect(S / 2 - 4, S - 2, 3, 3);
    tG.fillRect(S / 2 + 1, S - 2, 3, 3);
    // Bark grain + knot
    for (let bx = -2; bx <= 2; bx++) { tG.fillStyle(bx===0?0x3a1a08:0x6a4a20,0.15); tG.fillRect(S/2+bx*1.5,11,0.6,S-14); }
    tG.fillStyle(0x3a1a08,0.25); tG.fillEllipse(S/2+1,15,2.5,2);
    tG.fillStyle(0x6a4a20,0.2); tG.fillEllipse(S/2+1,14.5,1.8,1.3);
    // Grass tufts at base (ground blend)
    tG.fillStyle(0x2d9d4e,0.5); tG.fillRect(S/2-5,S-2,2,2); tG.fillRect(S/2+3,S-2,2,2);
    tG.fillStyle(0x35b058,0.3); tG.fillRect(S/2-3,S-1,1.5,2); tG.fillRect(S/2+1,S-1,1.5,2);
    // Edge softening dots around canopy
    for (let i=0;i<8;i++) { const a=Math.random()*Math.PI*2,d=14+Math.random()*3; tG.fillStyle(0x4da64d,0.08); tG.fillCircle(S/2+Math.cos(a)*d,S/2+Math.sin(a)*d*0.7,1+Math.random()); }
    // Canopy shadow (dark green underside)
    tG.fillStyle(0x0d3d0d); tG.fillCircle(S / 2, 9, 13);
    tG.fillCircle(S / 2 - 8, 11, 8); tG.fillCircle(S / 2 + 8, 11, 8);
    tG.fillCircle(S / 2, 13, 10);
    // Mid-dark layer
    tG.fillStyle(0x1a5a1a); tG.fillCircle(S / 2, 7, 12);
    tG.fillCircle(S / 2 - 7, 9, 8); tG.fillCircle(S / 2 + 7, 9, 8);
    tG.fillCircle(S / 2, 11, 10);
    // Mid-green main body
    tG.fillStyle(0x2d7a2d); tG.fillCircle(S / 2, 5, 10);
    tG.fillCircle(S / 2 - 5, 7, 7); tG.fillCircle(S / 2 + 5, 7, 7);
    tG.fillCircle(S / 2, 9, 9);
    tG.fillCircle(S / 2 - 3, 10, 6); tG.fillCircle(S / 2 + 3, 10, 6);
    // Light green top layer (sunlit)
    tG.fillStyle(0x4da64d, 0.7); tG.fillCircle(S / 2, 3, 8);
    tG.fillCircle(S / 2 - 4, 5, 6); tG.fillCircle(S / 2 + 4, 5, 6);
    tG.fillCircle(S / 2, 7, 6);
    // Bright highlights (topmost leaves catching sun)
    tG.fillStyle(0x6ac06a, 0.5); tG.fillCircle(S / 2, 1, 5);
    tG.fillCircle(S / 2 - 3, 3, 4); tG.fillCircle(S / 2 + 3, 3, 4);
    tG.fillCircle(S / 2, 5, 3);
    // Individual leaf texture dots
    tG.fillStyle(0x80d880, 0.3);
    tG.fillCircle(S / 2, 0, 2); tG.fillCircle(S / 2 - 4, 2, 2);
    tG.fillCircle(S / 2 + 4, 2, 2); tG.fillCircle(S / 2 - 2, 3, 2);
    tG.generateTexture('tile_tree', S, S); tG.destroy();

    // Bush - rounded 3D with dark underside, layered midtones, light top
    const bG = this.make.graphics({ x: 0, y: 0 });
    // Ground shadow
    bG.fillStyle(0x000000, 0.15); bG.fillEllipse(S / 2, S - 1, S - 6, 5);
    // Dark bottom (self-shadow)
    bG.fillStyle(0x0d3d0d); bG.fillCircle(S / 2, S / 2 + 4, 9);
    bG.fillCircle(S / 2 - 5, S / 2 + 3, 7); bG.fillCircle(S / 2 + 5, S / 2 + 3, 7);
    // Dark green base layer
    bG.fillStyle(0x1e6e1e); bG.fillCircle(S / 2, S / 2 + 3, 9);
    bG.fillCircle(S / 2 - 5, S / 2 + 2, 7); bG.fillCircle(S / 2 + 5, S / 2 + 2, 7);
    // Mid green body
    bG.fillStyle(0x3d8a3d); bG.fillCircle(S / 2, S / 2 + 1, 8);
    bG.fillCircle(S / 2 - 4, S / 2, 6); bG.fillCircle(S / 2 + 4, S / 2, 6);
    // Light green upper layer
    bG.fillStyle(0x5aaa5a, 0.6); bG.fillCircle(S / 2, S / 2 - 1, 6);
    bG.fillCircle(S / 2 - 3, S / 2 - 1, 5); bG.fillCircle(S / 2 + 3, S / 2 - 1, 5);
    // Highlight
    bG.fillStyle(0x7ec87e, 0.4); bG.fillCircle(S / 2, S / 2 - 3, 3);
    bG.fillCircle(S / 2 - 2, S / 2 - 2, 2); bG.fillCircle(S / 2 + 2, S / 2 - 2, 2);
    bG.generateTexture('tile_bush', S, S); bG.destroy();

    // Flower - tall, 3D with shadow, multi-bloom, leaves on stem
    const fG = this.make.graphics({ x: 0, y: 0 });
    // Ground shadow
    fG.fillStyle(0x000000, 0.1); fG.fillEllipse(S / 2, S - 1, 5, 3);
    // Main stem with highlight
    fG.fillStyle(0x2a5a2a); fG.fillRect(S / 2 - 1, 8, 2, S - 6);
    fG.fillStyle(0x4a9a4a, 0.5); fG.fillRect(S / 2, 8, 1, S - 8);
    // Side leaf
    fG.fillStyle(0x3a7a3a); fG.fillEllipse(S / 2 - 5, 16, 8, 3);
    fG.fillStyle(0x5aaa5a, 0.4); fG.fillEllipse(S / 2 - 4, 15, 6, 2);
    // Second leaf
    fG.fillStyle(0x3a7a3a); fG.fillEllipse(S / 2 + 5, 20, 7, 2.5);
    // Petal shadows (dark edges)
    fG.fillStyle(0xb04060, 0.5);
    fG.fillCircle(S / 2 - 3, 6, 4); fG.fillCircle(S / 2 + 3, 6, 4);
    fG.fillCircle(S / 2, 3, 4); fG.fillCircle(S / 2, 9, 4);
    // Petals (vibrant)
    fG.fillStyle(0xd06080);
    fG.fillCircle(S / 2 - 3, 5, 4.5); fG.fillCircle(S / 2 + 3, 5, 4.5);
    fG.fillCircle(S / 2, 2, 4.5); fG.fillCircle(S / 2, 8, 4.5);
    fG.fillCircle(S / 2 - 3, 8, 4); fG.fillCircle(S / 2 + 3, 8, 4);
    // Inner petals (lighter)
    fG.fillStyle(0xf0a0c0);
    fG.fillCircle(S / 2 - 2, 4, 3.5); fG.fillCircle(S / 2 + 2, 4, 3.5);
    fG.fillCircle(S / 2, 3, 3.5); fG.fillCircle(S / 2, 7, 3.5);
    // Center (yellow)
    fG.fillStyle(0xf4d03f); fG.fillCircle(S / 2, 5, 2.5);
    fG.fillStyle(0xf0c830, 0.6); fG.fillCircle(S / 2, 5, 1.5);
    // Small bud on side
    fG.fillStyle(0xd06080); fG.fillCircle(S / 2 + 6, 12, 3);
    fG.fillStyle(0xf0a0c0, 0.5); fG.fillCircle(S / 2 + 6, 11, 2);
    fG.generateTexture('tile_flower', S, S); fG.destroy();

    // Dock - wooden planks with grain
    const dkG = this.make.graphics({ x: 0, y: 0 });
    dkG.fillStyle(0xb8956a); dkG.fillRect(0, 0, S, S);
    dkG.fillStyle(0xc4a87c, 0.5); dkG.fillRect(0, 1, S, S - 2);
    // Plank grain lines
    dkG.fillStyle(0x8b6914, 0.3);
    for (let x = 0; x < S; x += 4) dkG.fillRect(x, 1, 1, S - 2);
    dkG.fillStyle(0x9b7930, 0.25);
    for (let x = 2; x < S; x += 4) dkG.fillRect(x, 1, 2, S - 2);
    // Shadow at bottom
    dkG.fillStyle(0x000000, 0.12); dkG.fillRect(0, S - 3, S, 3);
    dkG.generateTexture('tile_dock', S, S); dkG.destroy();

    // Bridge - wooden with railings
    const brG = this.make.graphics({ x: 0, y: 0 });
    brG.fillStyle(0x8b6914); brG.fillRect(0, 8, S, 5);
    brG.fillStyle(0xa07820, 0.5); brG.fillRect(0, 8, S, 2);
    // Planks
    brG.fillStyle(0x6b5010, 0.4);
    for (let x = 0; x < S; x += 4) brG.fillRect(x, 8, 2, 5);
    // Railings
    brG.fillStyle(0x5d4e37); brG.fillRect(2, 3, 2, 10);
    brG.fillRect(S - 4, 3, 2, 10);
    brG.fillStyle(0x7a6545); brG.fillRect(0, 3, S, 2);
    // Shadows
    brG.fillStyle(0x000000, 0.15); brG.fillRect(0, 5, S, 1);
    brG.fillRect(0, 12, S, 1);
    brG.generateTexture('tile_bridge', S, S); brG.destroy();
  }

  private createPlayerTexture(): void {
    const sc = 2, total = 16 * sc, gfx = this.make.graphics({ x: 0, y: 0 });

    // Shadow
    gfx.fillStyle(0x000000, 0.1); gfx.fillEllipse(8 * sc, 15 * sc + 1, 9 * sc, 3);

    // ── Long flowing hair (behind body, reaches waist) ──
    gfx.fillStyle(0x2a1010); // dark brown base
    // Left side hair mass
    gfx.fillRect(2 * sc, 5 * sc, 3 * sc, 8 * sc);
    gfx.fillRect(2 * sc, 11 * sc, 2 * sc, 5 * sc);
    // Right side hair mass
    gfx.fillRect(11 * sc, 5 * sc, 3 * sc, 8 * sc);
    gfx.fillRect(12 * sc, 11 * sc, 2 * sc, 5 * sc);
    // Back hair flowing down
    gfx.fillRect(4 * sc, 10 * sc, 8 * sc, 4 * sc);
    // Hair ends (wavy tips)
    gfx.fillRect(3 * sc, 13 * sc, 2 * sc, 2 * sc);
    gfx.fillRect(11 * sc, 13 * sc, 2 * sc, 2 * sc);
    // Hair highlights
    gfx.fillStyle(0x5a3030, 0.4);
    gfx.fillRect(3 * sc, 6 * sc, 1 * sc, 5 * sc);
    gfx.fillRect(12 * sc, 6 * sc, 1 * sc, 5 * sc);
    gfx.fillStyle(0x4a2020, 0.3);
    gfx.fillRect(5 * sc, 10 * sc, 6 * sc, 2 * sc);

    // ── Body - blue dress ──
    gfx.fillStyle(0x2858a0); gfx.fillRect(4 * sc, 7 * sc, 8 * sc, 6 * sc);
    gfx.fillStyle(0x4078c0); gfx.fillRect(5 * sc, 7 * sc, 6 * sc, 3 * sc);
    // Dress fold
    gfx.fillStyle(0x1a4080, 0.4); gfx.fillRect(7 * sc, 8 * sc, 1, 4 * sc);
    gfx.fillStyle(0x6098e0, 0.25); gfx.fillRect(9 * sc, 7 * sc, 2 * sc, 2 * sc);
    // Belt
    gfx.fillStyle(0xd4a853); gfx.fillRect(4 * sc, 9.5 * sc, 8 * sc, 1 * sc);

    // ── SEPARATED LEGS ──
    // Left leg
    gfx.fillStyle(0x2858a0); gfx.fillRect(5 * sc, 12 * sc, 2.5 * sc, 2 * sc);
    // Right leg (gap at 7.5-8.5 sc)
    gfx.fillStyle(0x2858a0); gfx.fillRect(8.5 * sc, 12 * sc, 2.5 * sc, 2 * sc);
    // Leg gap shadow
    gfx.fillStyle(0x1a3060, 0.5); gfx.fillRect(7.5 * sc, 12 * sc, 1 * sc, 2 * sc);
    // Left boot
    gfx.fillStyle(0x5a3a2a); gfx.fillRect(4.5 * sc, 14 * sc, 3 * sc, 2 * sc);
    gfx.fillStyle(0xf8f4f0); gfx.fillRect(4.5 * sc, 13 * sc, 3 * sc, 1.5 * sc);
    // Right boot
    gfx.fillStyle(0x5a3a2a); gfx.fillRect(8.5 * sc, 14 * sc, 3 * sc, 2 * sc);
    gfx.fillStyle(0xf8f4f0); gfx.fillRect(8.5 * sc, 13 * sc, 3 * sc, 1.5 * sc);

    // ── Head ──
    gfx.fillStyle(0xfce4c8); gfx.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
    gfx.fillStyle(0xf0d0b0, 0.3); gfx.fillRect(6 * sc, 4 * sc, 4 * sc, 3 * sc);

    // ── Hair top and bangs (more feminine) ──
    gfx.fillStyle(0x2a1010);
    gfx.fillRect(4 * sc, 0, 8 * sc, 3 * sc);  // top hair
    gfx.fillRect(3 * sc, 1 * sc, 2 * sc, 4 * sc);  // left side
    gfx.fillRect(11 * sc, 1 * sc, 2 * sc, 4 * sc); // right side
    // Bangs fringe across forehead
    gfx.fillRect(4 * sc, 2 * sc, 8 * sc, 1);
    gfx.fillRect(3 * sc, 3 * sc, 4 * sc, 1);
    gfx.fillRect(9 * sc, 3 * sc, 4 * sc, 1);
    // Side strands framing face
    gfx.fillRect(3 * sc, 4 * sc, 2 * sc, 3 * sc);
    gfx.fillRect(11 * sc, 4 * sc, 2 * sc, 3 * sc);
    // Hair highlight
    gfx.fillStyle(0x5a3030, 0.35); gfx.fillRect(6 * sc, 0, 3 * sc, 2 * sc);

    // Blue ribbon (right side)
    gfx.fillStyle(0x5098e0); gfx.fillRect(10 * sc, -1, 4 * sc, 3 * sc);
    gfx.fillStyle(0x80c8ff, 0.5); gfx.fillRect(11 * sc, -1, 2 * sc, 2 * sc);

    // ── Large expressive eyes ──
    gfx.fillStyle(0xffffff); gfx.fillRect(6 * sc, 3.5 * sc, 2.5 * sc, 2.5 * sc);
    gfx.fillRect(9 * sc, 3.5 * sc, 2.5 * sc, 2.5 * sc);
    gfx.fillStyle(0x2a5080); gfx.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 2.5 * sc);
    gfx.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 2.5 * sc);
    gfx.fillStyle(0x000000); gfx.fillRect(7 * sc, 4 * sc, 1.5 * sc, 2 * sc);
    gfx.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
    gfx.fillStyle(0xffffff); gfx.fillRect(7 * sc, 3.5 * sc, 0.8 * sc, 0.8 * sc);
    gfx.fillRect(10 * sc, 3.5 * sc, 0.8 * sc, 0.8 * sc);
    // Eyelashes
    gfx.fillStyle(0x000000); gfx.fillRect(6 * sc, 3.5 * sc, 2.5 * sc, 0.5 * sc);
    gfx.fillRect(9 * sc, 3.5 * sc, 2.5 * sc, 0.5 * sc);
    // Blush + mouth
    gfx.fillStyle(0xf0a0a0, 0.3); gfx.fillRect(5 * sc, 5 * sc, 2 * sc, 1);
    gfx.fillRect(9 * sc, 5 * sc, 2 * sc, 1);
    gfx.fillStyle(0xd06070); gfx.fillRect(7.5 * sc, 5.5 * sc, 1.5 * sc, 0.5 * sc);

    // ── Arms ──
    gfx.fillStyle(0xfce4c8); gfx.fillRect(2.5 * sc, 8 * sc, 2 * sc, 3.5 * sc);
    gfx.fillRect(11.5 * sc, 8 * sc, 2 * sc, 3.5 * sc);
    gfx.fillStyle(0xf8d8b8); gfx.fillRect(2.5 * sc, 10.5 * sc, 2 * sc, 1.5 * sc);
    gfx.fillRect(11.5 * sc, 10.5 * sc, 2 * sc, 1.5 * sc);

    // ── Fishing rod ──
    gfx.fillStyle(0x6a4a1a); gfx.fillRect(12.5 * sc, 1 * sc, 2 * sc, 14 * sc);
    gfx.fillStyle(0x8a6a3a, 0.4); gfx.fillRect(12.5 * sc, 1 * sc, 1, 12 * sc);
    gfx.fillStyle(0xe8e8e8); gfx.fillRect(12.5 * sc, 0, 2 * sc, 2 * sc);
    gfx.lineStyle(0.6, 0xe8e8e8, 0.7); gfx.lineBetween(13.5 * sc, 16 * sc, 16 * sc, 16 * sc);

    gfx.generateTexture('player', total, total); gfx.destroy();
  }

  // ─── NPCs (high detail, unique features) ─────

  private createNPCTextures(): void {
    const sc = 2, T = 16 * sc;

    const drawNPCs = [
      // 0: 华泽 - wise old fisherman, grey flowing beard, straw hat, brown robe
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        g.fillStyle(0x5a4a3a); g.fillRect(3 * sc, 7 * sc, 10 * sc, 6 * sc);
        g.fillStyle(0x7a6a5a, 0.5); g.fillRect(4 * sc, 7 * sc, 8 * sc, 3 * sc);
        g.fillStyle(0x4a3a2a, 0.3); g.fillRect(6 * sc, 8 * sc, 1, 5 * sc);
        g.fillRect(9 * sc, 8 * sc, 1, 5 * sc);
        g.fillStyle(0x8a7a6a, 0.3); g.fillRect(5 * sc, 8 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0xd4b896); g.fillRect(2 * sc, 0, 12 * sc, 4 * sc);
        g.fillStyle(0xc4a070, 0.4); g.fillRect(3 * sc, 1 * sc, 10 * sc, 2 * sc);
        g.fillStyle(0x8b6914, 0.3); g.fillRect(5 * sc, 0, 6 * sc, 1);
        // Face
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 3 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xf0d0b0, 0.3); g.fillRect(5 * sc, 5 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0xc0c0c0); g.fillRect(2 * sc, 2 * sc, 3 * sc, 3 * sc);
        g.fillRect(11 * sc, 2 * sc, 3 * sc, 3 * sc);
        g.fillStyle(0xd8d8d8); g.fillRect(6 * sc, 7 * sc, 4 * sc, 4 * sc);
        g.fillStyle(0xe8e8e8, 0.5); g.fillRect(7 * sc, 7 * sc, 2 * sc, 2 * sc);
        // Detailed eyes - dark with wisdom sparkle
        g.fillStyle(0xffffff); g.fillRect(6 * sc, 4.5 * sc, 2.5 * sc, 2 * sc);
        g.fillRect(9 * sc, 4.5 * sc, 2.5 * sc, 2 * sc);
        g.fillStyle(0x4a3020); g.fillRect(6.5 * sc, 4.5 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 4.5 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 5 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10 * sc, 5 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7 * sc, 4.5 * sc, 0.6 * sc, 0.6 * sc);
        g.fillRect(10 * sc, 4.5 * sc, 0.6 * sc, 0.6 * sc);
        // Grey eyebrows
        g.fillStyle(0xa0a0a0); g.fillRect(6 * sc, 4 * sc, 2.5 * sc, 0.5 * sc);
        g.fillRect(9 * sc, 4 * sc, 2.5 * sc, 0.5 * sc);
        // Smile lines
        g.fillStyle(0xd0a090, 0.3); g.fillRect(6 * sc, 6 * sc, 4 * sc, 0.5 * sc);
        // Straw sandals with weave
        g.fillStyle(0xc4a060); g.fillRect(5 * sc, 13 * sc, 3.5 * sc, 2 * sc);
        g.fillRect(8.5 * sc, 13 * sc, 3.5 * sc, 2 * sc);
        for (let sx = 5; sx < 9; sx++) g.fillStyle(0x8a6a3a, 0.3), g.fillRect(sx * sc, 13 * sc, 0.5 * sc, 2 * sc);
      },
      // 1: 智爸 - traveling merchant, warm red coat, hat, kind face
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        g.fillStyle(0xa03030); g.fillRect(4 * sc, 6 * sc, 8 * sc, 6 * sc);
        g.fillStyle(0xc04040, 0.5); g.fillRect(5 * sc, 6 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0xd4a853); g.fillRect(4 * sc, 10 * sc, 8 * sc, 1);
        g.fillStyle(0xd4a853); g.fillRect(8 * sc, 7 * sc, 1, 1);
        g.fillRect(8 * sc, 9 * sc, 1, 1);
        g.fillStyle(0x8a6a30); g.fillRect(2 * sc, 7 * sc, 3 * sc, 5 * sc);
        g.fillStyle(0x9b7930, 0.4); g.fillRect(2 * sc, 7 * sc, 3 * sc, 2 * sc);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xdcb088, 0.3); g.fillRect(5 * sc, 4 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0x5d3a1a); g.fillRect(2 * sc, 0, 12 * sc, 3 * sc);
        g.fillStyle(0x7a5030, 0.4); g.fillRect(4 * sc, 1 * sc, 8 * sc, 1);
        // Warm detailed eyes
        g.fillStyle(0xffffff); g.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0x5a3a1a); g.fillRect(7 * sc, 3.5 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 3.5 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7.5 * sc, 4 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10.5 * sc, 4 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7.5 * sc, 3.5 * sc, 0.5 * sc, 0.5 * sc);
        g.fillRect(10.5 * sc, 3.5 * sc, 0.5 * sc, 0.5 * sc);
        // Bushy eyebrows
        g.fillStyle(0x3a1a08); g.fillRect(6.5 * sc, 3 * sc, 2 * sc, 0.5 * sc);
        g.fillRect(9.5 * sc, 3 * sc, 2 * sc, 0.5 * sc);
        // Warm smile
        g.fillStyle(0xc08070, 0.4); g.fillRect(7 * sc, 5.5 * sc, 2.5 * sc, 0.5 * sc);
        g.fillStyle(0x3a2010); g.fillRect(6 * sc, 12 * sc, 3 * sc, 2 * sc);
        g.fillRect(9 * sc, 12 * sc, 3 * sc, 2 * sc);
      },
      // 2: 吉格斯 - Bomb expert, rugged coat, goggles, dynamite belt
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        // Brown leather coat
        g.fillStyle(0x5a4030); g.fillRect(3 * sc, 7 * sc, 10 * sc, 6 * sc);
        g.fillStyle(0x7a5a40, 0.5); g.fillRect(4 * sc, 7 * sc, 8 * sc, 3 * sc);
        g.fillStyle(0x3a2010, 0.3); g.fillRect(6 * sc, 8 * sc, 0.8, 5 * sc);
        g.fillRect(9 * sc, 8 * sc, 0.8, 5 * sc);
        // Dynamite belt
        g.fillStyle(0x6a3010); g.fillRect(4 * sc, 10 * sc, 8 * sc, 1.5 * sc);
        for (let bx = 4; bx < 12; bx += 2) {
          g.fillStyle(0xc04030); g.fillRect(bx * sc, 9 * sc, 1.5 * sc, 2.5 * sc);
          g.fillStyle(0xf0d040, 0.6); g.fillRect(bx * sc + 0.3 * sc, 8.5 * sc, 0.5 * sc, 0.8 * sc);
        }
        // Face + singed messy hair
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x4a2a1a); g.fillRect(4 * sc, 0, 8 * sc, 3 * sc);
        g.fillStyle(0x6a3a2a, 0.3); g.fillRect(3 * sc, 1 * sc, 2 * sc, 4 * sc);
        g.fillRect(11 * sc, 1 * sc, 2 * sc, 4 * sc);
        // Singed tips
        g.fillStyle(0x8a6a2a, 0.3); g.fillRect(3 * sc, 3 * sc, 2 * sc, 1);
        g.fillRect(11 * sc, 3 * sc, 2 * sc, 1);
        // Goggles on forehead
        g.fillStyle(0x555555); g.fillRect(5 * sc, 1 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0x85c1e9, 0.4); g.fillCircle(6.5 * sc, 2 * sc, 1.5 * sc);
        g.fillCircle(9.5 * sc, 2 * sc, 1.5 * sc);
        g.fillStyle(0x777777); g.fillRect(7.5 * sc, 1.5 * sc, 1 * sc, 0.5 * sc);
        // Eyes
        g.fillStyle(0xffffff); g.fillRect(6 * sc, 4 * sc, 2.5 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 4 * sc, 2.5 * sc, 2 * sc);
        g.fillStyle(0x3a2010); g.fillRect(6.5 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        g.fillRect(10.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        // Leather boots
        g.fillStyle(0x4a3020); g.fillRect(5.5 * sc, 13 * sc, 3 * sc, 2 * sc);
        g.fillRect(8.5 * sc, 13 * sc, 3 * sc, 2 * sc);
      },
      // 3: 老聂 - lighthouse keeper, navy uniform, cap, weather-beaten
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        g.fillStyle(0x1a3050); g.fillRect(4 * sc, 6 * sc, 8 * sc, 6 * sc);
        g.fillStyle(0x2a4a6a, 0.5); g.fillRect(5 * sc, 6 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0xd4a853); g.fillRect(7.5 * sc, 7 * sc, 1, 1);
        g.fillRect(7.5 * sc, 9 * sc, 1, 1);
        g.fillStyle(0xd4a853, 0.6); g.fillRect(4 * sc, 6 * sc, 2 * sc, 1);
        g.fillRect(10 * sc, 6 * sc, 2 * sc, 1);
        g.fillStyle(0xe0b080); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xd0a070, 0.4); g.fillRect(5 * sc, 4 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0x1a3040); g.fillRect(3 * sc, 0, 10 * sc, 3 * sc);
        g.fillStyle(0x2a4a6a, 0.4); g.fillRect(4 * sc, 1 * sc, 8 * sc, 1);
        g.fillStyle(0xd4a853, 0.7); g.fillRect(6 * sc, 1.5 * sc, 4 * sc, 0.5 * sc);
        // Stern eyes
        g.fillStyle(0xffffff); g.fillRect(6.5 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0x3a4a5a); g.fillRect(7 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        g.fillRect(10.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        // Thick eyebrows
        g.fillStyle(0x4a3a2a); g.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 0.5 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 0.5 * sc);
        g.fillStyle(0x909090, 0.2); g.fillRect(6 * sc, 6 * sc, 4 * sc, 1);
      },
      // 4: 佳佳 - Cute girl in pink dress, painter
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        // Pink dress with ruffles
        g.fillStyle(0xe890a0); g.fillRect(3 * sc, 7 * sc, 10 * sc, 6 * sc);
        g.fillStyle(0xf0a8b8, 0.5); g.fillRect(4 * sc, 7 * sc, 8 * sc, 3 * sc);
        g.fillStyle(0xf0c0c8, 0.3); g.fillRect(5 * sc, 7 * sc, 6 * sc, 2 * sc);
        // Dress waist ribbon
        g.fillStyle(0xf8f0f0); g.fillRect(4 * sc, 10 * sc, 8 * sc, 1.5 * sc);
        g.fillStyle(0xffffff, 0.4); g.fillRect(5 * sc, 10 * sc, 6 * sc, 0.5 * sc);
        // Skirt lace hem
        g.fillStyle(0xf0c0c8, 0.5);
        for (let lx = 3; lx < 13; lx += 2) g.fillRect(lx * sc, 12 * sc, 1.5 * sc, 1);
        // Face (cute round)
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xfff0e0, 0.3); g.fillRect(6 * sc, 3 * sc, 4 * sc, 3 * sc);
        // Brown twin-tails hair
        g.fillStyle(0x5d3a1a); g.fillRect(4 * sc, 0, 8 * sc, 3 * sc);
        g.fillRect(3 * sc, 1 * sc, 3 * sc, 5 * sc);  // left hair
        g.fillRect(10 * sc, 1 * sc, 3 * sc, 5 * sc); // right hair
        g.fillStyle(0x7a5030, 0.3); g.fillRect(5 * sc, 0, 6 * sc, 2 * sc);
        // Pink hair ribbon
        g.fillStyle(0xf080a0); g.fillRect(4 * sc, 3 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10.5 * sc, 3 * sc, 1.5 * sc, 2 * sc);
        // Big sparkly eyes
        g.fillStyle(0xffffff); g.fillRect(6 * sc, 3.5 * sc, 2.5 * sc, 2.5 * sc);
        g.fillRect(9 * sc, 3.5 * sc, 2.5 * sc, 2.5 * sc);
        g.fillStyle(0x805060); g.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 2.5 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 2.5 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0xffffff); g.fillRect(7 * sc, 3.5 * sc, 0.6 * sc, 0.6 * sc);
        g.fillRect(10 * sc, 3.5 * sc, 0.6 * sc, 0.6 * sc);
        // Eyelashes
        g.fillStyle(0x000000); g.fillRect(6 * sc, 3.5 * sc, 2.5 * sc, 0.3 * sc);
        g.fillRect(9 * sc, 3.5 * sc, 2.5 * sc, 0.3 * sc);
        // Rosy cheeks + smile
        g.fillStyle(0xf0a0a0, 0.35); g.fillCircle(5 * sc, 5 * sc, 1.5);
        g.fillCircle(10 * sc, 5 * sc, 1.5);
        g.fillStyle(0xe08090, 0.4); g.fillRect(7.5 * sc, 5.5 * sc, 1.5 * sc, 0.5 * sc);
        // Paint palette in hand
        g.fillStyle(0x8a6a4a); g.fillRect(0.5 * sc, 8 * sc, 3.5 * sc, 3 * sc);
        g.fillStyle(0xe04040, 0.6); g.fillRect(1 * sc, 8.5 * sc, 1, 1);
        g.fillStyle(0x4080e0, 0.6); g.fillRect(2.5 * sc, 8.5 * sc, 1, 1);
        g.fillStyle(0xf0d040, 0.6); g.fillRect(1.5 * sc, 9.5 * sc, 1, 1);
        g.fillStyle(0xe8a0bf, 0.5); g.fillRect(8 * sc, 10 * sc, 1.5, 1);
        // Pink shoes
        g.fillStyle(0xe88090); g.fillRect(5 * sc, 13 * sc, 3 * sc, 2 * sc);
        g.fillRect(8.5 * sc, 13 * sc, 3 * sc, 2 * sc);
      },
      // 5: 淇爹 - tea house owner, elegant purple qipao, tea cup
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        g.fillStyle(0x3a2040); g.fillRect(4 * sc, 6 * sc, 8 * sc, 6 * sc);
        g.fillStyle(0x5a3050, 0.5); g.fillRect(5 * sc, 6 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0xd4a853, 0.35); g.fillRect(5 * sc, 8 * sc, 6 * sc, 0.5 * sc);
        g.fillRect(5 * sc, 10 * sc, 6 * sc, 0.5 * sc);
        g.fillStyle(0xd4a853, 0.5); g.fillRect(7 * sc, 6 * sc, 2 * sc, 1);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x1a0808); g.fillRect(4 * sc, 1 * sc, 8 * sc, 2 * sc);
        g.fillStyle(0x2a1010, 0.4); g.fillRect(5 * sc, 1 * sc, 6 * sc, 1);
        g.fillStyle(0xe8a0bf, 0.7); g.fillRect(11 * sc, 2 * sc, 1.5 * sc, 1.5 * sc);
        // Elegant almond eyes
        g.fillStyle(0xffffff); g.fillRect(6.5 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0x2a1a2a); g.fillRect(7 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        g.fillRect(10.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        // Thin elegant brows
        g.fillStyle(0x1a0808); g.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 0.3 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 0.3 * sc);
        // Red lips
        g.fillStyle(0xc04050, 0.5); g.fillRect(8 * sc, 5.8 * sc, 1 * sc, 0.4 * sc);
        g.fillStyle(0xe8e0d0); g.fillRect(1 * sc, 9 * sc, 3 * sc, 3 * sc);
        g.fillStyle(0xd4c8a0, 0.4); g.fillRect(1.5 * sc, 9.5 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0xffffff, 0.2); g.fillRect(2 * sc, 8 * sc, 1, 1.5 * sc);
      },
      // 6: 小鱼 - young kid, orange cap, green shirt, small
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 7 * sc, 3);
        g.fillStyle(0x3a7a3a); g.fillRect(5 * sc, 6 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x5aaa5a, 0.4); g.fillRect(5 * sc, 6 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0xf0f0f0, 0.6); g.fillRect(7.5 * sc, 7 * sc, 1, 1);
        g.fillRect(7.5 * sc, 9 * sc, 1, 1);
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xfff0e0, 0.3); g.fillRect(6 * sc, 3 * sc, 4 * sc, 3 * sc);
        g.fillStyle(0xe8a040); g.fillRect(4 * sc, 0, 8 * sc, 3 * sc);
        g.fillStyle(0xf0c060, 0.3); g.fillRect(5 * sc, 1 * sc, 6 * sc, 1);
        // Big adorable eyes
        g.fillStyle(0xffffff); g.fillRect(6 * sc, 3.5 * sc, 2.5 * sc, 2.5 * sc);
        g.fillRect(9 * sc, 3.5 * sc, 2.5 * sc, 2.5 * sc);
        g.fillStyle(0x4a3020); g.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 2.5 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 2.5 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0xffffff); g.fillRect(7 * sc, 3.5 * sc, 0.8 * sc, 0.8 * sc);
        g.fillRect(10 * sc, 3.5 * sc, 0.8 * sc, 0.8 * sc);
        g.fillStyle(0xffffff); g.fillRect(6.5 * sc, 3.5 * sc, 0.4 * sc, 0.5 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 0.4 * sc, 0.5 * sc);
        // Big smile
        g.fillStyle(0xd06060, 0.5); g.fillRect(7 * sc, 6 * sc, 2.5 * sc, 0.8 * sc);
        // Rosy cheeks
        g.fillStyle(0xf0a0a0, 0.25); g.fillRect(5 * sc, 5 * sc, 2, 1);
        g.fillRect(9 * sc, 5 * sc, 2, 1);
        g.fillStyle(0x3060a0); g.fillRect(5 * sc, 11 * sc, 6 * sc, 2 * sc);
        g.fillStyle(0xe8e8e8); g.fillRect(6 * sc, 13 * sc, 2.5 * sc, 2 * sc);
        g.fillRect(9 * sc, 13 * sc, 2.5 * sc, 2 * sc);
      },
      // 7: 格雷福斯 - old sailor, striped shirt, white beard, pipe
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 9 * sc, 3);
        g.fillStyle(0x2a4a7a); g.fillRect(4 * sc, 6 * sc, 8 * sc, 6 * sc);
        g.fillStyle(0xf0f0f0); for (let py = 7; py < 11; py += 2) g.fillRect(4 * sc, py * sc, 8 * sc, 1);
        g.fillStyle(0x6a3010, 0.7); g.fillRect(6 * sc, 6 * sc, 1, 6 * sc);
        g.fillRect(9 * sc, 6 * sc, 1, 6 * sc);
        g.fillStyle(0xe8c39e); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0xd0a070, 0.3); g.fillRect(5 * sc, 4 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0xe8e8e8); g.fillRect(4 * sc, 1 * sc, 8 * sc, 2 * sc);
        g.fillStyle(0xf0f0f0); g.fillRect(5 * sc, 6 * sc, 6 * sc, 3 * sc);
        g.fillStyle(0xffffff, 0.5); g.fillRect(6 * sc, 6 * sc, 4 * sc, 1);
        g.fillStyle(0x6a3a1a); g.fillRect(11 * sc, 7 * sc, 3 * sc, 1);
        g.fillStyle(0x8a5a3a, 0.4); g.fillRect(12 * sc, 7 * sc, 2 * sc, 1);
        // Sea-blue eyes
        g.fillStyle(0xffffff); g.fillRect(6.5 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 4 * sc, 2 * sc, 2 * sc);
        g.fillStyle(0x3068b0); g.fillRect(7 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(10 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10.5 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        g.fillRect(10.5 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        // Bushy white brows
        g.fillStyle(0xd0d0d0); g.fillRect(6.5 * sc, 3.5 * sc, 2 * sc, 0.5 * sc);
        g.fillRect(9.5 * sc, 3.5 * sc, 2 * sc, 0.5 * sc);
        // Wrinkles
        g.fillStyle(0xc0a080, 0.2); g.fillRect(6 * sc, 5.5 * sc, 1, 0.5 * sc);
        g.fillRect(9 * sc, 5.5 * sc, 1, 0.5 * sc);
      },
      // 8: 维克兹 - Chemist, white lab coat, round glasses, colorful potion
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.1); g.fillEllipse(8 * sc, 15 * sc + 1, 8 * sc, 3);
        // White lab coat
        g.fillStyle(0xe0e0e0); g.fillRect(4 * sc, 6 * sc, 8 * sc, 6 * sc);
        g.fillStyle(0xf8f8f8, 0.4); g.fillRect(5 * sc, 6 * sc, 6 * sc, 3 * sc);
        // Pocket with pens
        g.fillStyle(0xcccccc, 0.4); g.fillRect(9 * sc, 7 * sc, 2.5 * sc, 2 * sc);
        g.fillStyle(0x3060c0); g.fillRect(10 * sc, 7 * sc, 0.4 * sc, 2 * sc);
        g.fillStyle(0xc03030); g.fillRect(10.8 * sc, 7 * sc, 0.4 * sc, 1.8 * sc);
        // Chemical stains on coat
        g.fillStyle(0x40c040, 0.2); g.fillRect(6 * sc, 9 * sc, 1.5, 1);
        g.fillStyle(0xc0a020, 0.2); g.fillRect(9 * sc, 10 * sc, 1.5, 1);
        // Face + tidy hair
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 2 * sc, 6 * sc, 5 * sc);
        g.fillStyle(0x4a3020); g.fillRect(4 * sc, 1 * sc, 8 * sc, 2 * sc);
        g.fillStyle(0x6a4a30, 0.3); g.fillRect(5 * sc, 1 * sc, 6 * sc, 1);
        // Round glasses with eyes
        g.fillStyle(0x444444); g.fillCircle(7.5 * sc, 4.5 * sc, 2 * sc);
        g.fillCircle(11 * sc, 4.5 * sc, 2 * sc);
        g.fillStyle(0x666666); g.fillRect(8.5 * sc, 4 * sc, 1 * sc, 1);
        g.fillStyle(0xffffff); g.fillCircle(7.5 * sc, 4.5 * sc, 1.7 * sc);
        g.fillCircle(11 * sc, 4.5 * sc, 1.7 * sc);
        g.fillStyle(0x3a5040); g.fillCircle(7.5 * sc, 4.5 * sc, 1.2 * sc);
        g.fillCircle(11 * sc, 4.5 * sc, 1.2 * sc);
        g.fillStyle(0x000000); g.fillCircle(7.8 * sc, 4.8 * sc, 0.8 * sc);
        g.fillCircle(11.3 * sc, 4.8 * sc, 0.8 * sc);
        g.fillStyle(0xffffff); g.fillCircle(7.5 * sc, 4.3 * sc, 0.4 * sc);
        g.fillCircle(11 * sc, 4.3 * sc, 0.4 * sc);
        // Colorful potion in hand
        g.fillStyle(0x85c1e9, 0.5); g.fillRoundedRect(1.5 * sc, 7 * sc, 3 * sc, 5 * sc, 2);
        g.fillStyle(0xc040e0, 0.6); g.fillRect(2 * sc, 8 * sc, 2 * sc, 3.5 * sc);
        g.fillStyle(0xf0d040, 0.3); g.fillRect(2.5 * sc, 8.5 * sc, 1 * sc, 1 * sc);
        g.fillStyle(0xe8e0d0, 0.4); g.fillRect(2 * sc, 7 * sc, 2 * sc, 1);
        // Bubbles from potion
        g.fillStyle(0xffffff, 0.3); g.fillCircle(2.5 * sc, 6.5 * sc, 0.8);
        g.fillCircle(3 * sc, 5.5 * sc, 0.6);
        // Black shoes
        g.fillStyle(0x2a2a2a); g.fillRect(5.5 * sc, 12 * sc, 3 * sc, 2 * sc);
        g.fillRect(8.5 * sc, 12 * sc, 3 * sc, 2 * sc);
      },
      // 9: 时光老头 - Blue-robed elder, white hair, white beard
      (g: Phaser.GameObjects.Graphics) => {
        g.fillStyle(0x000000, 0.15); g.fillEllipse(8 * sc, 15 * sc + 1, 10 * sc, 4);
        // Blue robe
        g.fillStyle(0x2848a0); g.fillRect(2 * sc, 5 * sc, 12 * sc, 8 * sc);
        g.fillStyle(0x4068c0, 0.4); g.fillRect(3 * sc, 5 * sc, 10 * sc, 4 * sc);
        g.fillStyle(0x1a3070, 0.3); g.fillRect(6 * sc, 6 * sc, 1, 7 * sc);
        g.fillRect(9 * sc, 6 * sc, 1, 7 * sc);
        // Gold trim on robe
        g.fillStyle(0xd4a853, 0.5); g.fillRect(3 * sc, 8 * sc, 10 * sc, 0.8 * sc);
        g.fillStyle(0xd4a853, 0.4); g.fillRect(7 * sc, 9 * sc, 2 * sc, 1);
        // White hair (full, flowing)
        g.fillStyle(0xe8e8e8); g.fillRect(3 * sc, 0, 10 * sc, 3 * sc);
        g.fillRect(2 * sc, 1 * sc, 3 * sc, 4 * sc);
        g.fillRect(11 * sc, 1 * sc, 3 * sc, 4 * sc);
        g.fillStyle(0xf8f8f8, 0.5); g.fillRect(5 * sc, 0, 6 * sc, 2 * sc);
        g.fillRect(3 * sc, 2 * sc, 2 * sc, 2 * sc);
        g.fillRect(11 * sc, 2 * sc, 2 * sc, 2 * sc);
        // White beard (long, flowing)
        g.fillStyle(0xf0f0f0); g.fillRect(5 * sc, 6 * sc, 6 * sc, 6 * sc);
        g.fillStyle(0xffffff, 0.5); g.fillRect(6 * sc, 6 * sc, 4 * sc, 3 * sc);
        // Beard strand lines
        for (let bs = 5; bs < 11; bs += 0.8) g.fillStyle(0xe0e0e0, 0.2), g.fillRect(bs * sc, 7 * sc, 0.4 * sc, 5 * sc);
        // Face
        g.fillStyle(0xfce4c8); g.fillRect(5 * sc, 3 * sc, 6 * sc, 4 * sc);
        g.fillStyle(0xf0d0b0, 0.3); g.fillRect(5 * sc, 4 * sc, 6 * sc, 3 * sc);
        // Wise eyes
        g.fillStyle(0xffffff); g.fillRect(6 * sc, 4 * sc, 2.5 * sc, 2 * sc);
        g.fillRect(9 * sc, 4 * sc, 2.5 * sc, 2 * sc);
        g.fillStyle(0x4060a0); g.fillRect(6.5 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillRect(9.5 * sc, 4 * sc, 1.5 * sc, 2 * sc);
        g.fillStyle(0x000000); g.fillRect(7 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillRect(10 * sc, 4.5 * sc, 1 * sc, 1.5 * sc);
        g.fillStyle(0xffffff); g.fillRect(7 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        g.fillRect(10 * sc, 4 * sc, 0.5 * sc, 0.5 * sc);
        // White eyebrows
        g.fillStyle(0xe0e0e0); g.fillRect(6 * sc, 3.5 * sc, 2.5 * sc, 0.5 * sc);
        g.fillRect(9 * sc, 3.5 * sc, 2.5 * sc, 0.5 * sc);
        // Wooden staff
        g.fillStyle(0x6a4a1a); g.fillRect(0.5 * sc, 2 * sc, 2 * sc, 13 * sc);
        g.fillStyle(0x8a6a3a, 0.3); g.fillRect(1 * sc, 2 * sc, 1, 11 * sc);
        // Sandals
        g.fillStyle(0x8a6a3a); g.fillRect(5 * sc, 13 * sc, 3 * sc, 2 * sc);
        g.fillRect(8.5 * sc, 13 * sc, 3 * sc, 2 * sc);
      },
    ];

    drawNPCs.forEach((fn, i) => {
      const gfx = this.make.graphics({ x: 0, y: 0 });
      fn(gfx);
      gfx.generateTexture(`npc_${i}`, T, T);
      gfx.destroy();
    });
  }

  // ─── FISH (detailed with fins and scales) ─────

  private createFishTextures(): void {
    const fishTypes = [
      { b: 0xc0c0c0, f: 0xa0a0a0, s: 18, y: 0xf0f0f0, fin: 0xd0d0d0 },
      { b: 0xe8a040, f: 0xf0c060, s: 22, y: 0xf0d0a0, fin: 0xf0b030 },
      { b: 0x7a9a5a, f: 0x5a8a4a, s: 20, y: 0xa0c080, fin: 0x6aaa50 },
      { b: 0xffd700, f: 0xffa000, s: 16, y: 0xfff0c0, fin: 0xffc000 },
      { b: 0xff7060, f: 0xff4040, s: 24, y: 0xffb0a0, fin: 0xff5050 },
      { b: 0x3060c0, f: 0x2050a0, s: 30, y: 0x80a0e0, fin: 0x2060d0 },
      { b: 0xf0c040, f: 0xd0a030, s: 34, y: 0xf0e0a0, fin: 0xe0b020 },
      { b: 0xe0e0ff, f: 0xc0c0f0, s: 32, y: 0xf8f8ff, fin: 0xd0d0f0 },
    ];

    fishTypes.forEach((f, i) => {
      const gfx = this.make.graphics({ x: 0, y: 0 });
      const W = f.s, H = f.s * 0.65;
      // Body
      gfx.fillStyle(f.b); gfx.fillEllipse(W / 2, H / 2, W, H);
      // Belly highlight
      gfx.fillStyle(f.y, 0.6); gfx.fillEllipse(W / 2, H / 2 + 2, W * 0.7, H * 0.45);
      // Scale pattern dots
      gfx.fillStyle(f.f, 0.3);
      for (let sx = 3; sx < W - 6; sx += 4) {
        for (let sy = 3; sy < H - 2; sy += 3) {
          gfx.fillCircle(sx + 2, sy + 2, 0.8);
        }
      }
      // Tail fin
      gfx.fillStyle(f.fin); gfx.fillTriangle(W - 2, H / 2, W + 7, H / 2 - 5, W + 7, H / 2 + 5);
      gfx.fillStyle(f.b, 0.4); gfx.fillTriangle(W - 1, H / 2, W + 4, H / 2 - 3, W + 4, H / 2 + 3);
      // Dorsal fin
      gfx.fillStyle(f.fin, 0.8); gfx.fillTriangle(W * 0.35, -1, W * 0.45, -8, W * 0.6, -1);
      // Eye
      gfx.fillStyle(0xffffff); gfx.fillCircle(W * 0.2, H * 0.38, 3);
      gfx.fillStyle(0x000000); gfx.fillCircle(W * 0.22, H * 0.38, 1.8);
      gfx.fillStyle(0xffffff, 0.8); gfx.fillCircle(W * 0.2, H * 0.35, 0.8);
      // Mouth line
      gfx.fillStyle(f.f, 0.5); gfx.fillRect(W * 0.06, H * 0.5, 2, 0.5);
      // Pectoral fin
      gfx.fillStyle(f.fin, 0.5); gfx.fillTriangle(W * 0.25, H * 0.7, W * 0.2, H * 0.85, W * 0.35, H * 0.8);
      gfx.generateTexture(`fish_${i}`, W + 10, H + 12);
      gfx.destroy();
    });
  }

  // ─── BUILDINGS (already detailed, keep existing) ─

  private createBuildingTextures(): void {
    const S = TILE_SIZE * 2; // 32px base unit

    // Fish Pond Small (3x2 tiles)
    const pS = this.make.graphics({ x: 0, y: 0 });
    pS.fillStyle(0x1a5276); pS.fillRoundedRect(2, 2, S * 3 - 4, S * 2 - 4, 6);
    pS.fillStyle(0x2980b9); pS.fillRoundedRect(3, 3, S * 3 - 6, S * 2 - 6, 5);
    pS.fillStyle(0x3498db, 0.4); pS.fillRect(4, 4, S * 3 - 8, 3);
    pS.fillStyle(0x85c1e9, 0.15); pS.fillRect(8, 6, 8, 1);
    pS.fillRect(20, S, 8, 1);
    pS.lineStyle(3, 0x8b6914); pS.strokeRoundedRect(1, 1, S * 3 - 2, S * 2 - 2, 7);
    pS.lineStyle(1.5, 0xc4a35a); pS.strokeRoundedRect(4, 4, S * 3 - 8, S * 2 - 8, 5);
    // Water lily
    pS.fillStyle(0x3a8a3a); pS.fillCircle(S * 1.5, S, 5);
    pS.fillStyle(0x5aaa5a, 0.5); pS.fillCircle(S * 1.5, S - 1, 3);
    pS.fillStyle(0xe8a0bf); pS.fillCircle(S * 1.5, S, 3);
    pS.fillStyle(0xf4d03f, 0.5); pS.fillCircle(S * 1.5, S, 1.5);
    pS.generateTexture('building_pond_small', S * 3, S * 2); pS.destroy();

    // Fish Pond Medium (4x2 tiles)
    const pM = this.make.graphics({ x: 0, y: 0 });
    pM.fillStyle(0x1a5276); pM.fillRoundedRect(2, 2, S * 4 - 4, S * 2 - 4, 6);
    pM.fillStyle(0x2980b9); pM.fillRoundedRect(3, 3, S * 4 - 6, S * 2 - 6, 5);
    pM.fillStyle(0x3498db, 0.4); pM.fillRect(4, 4, S * 4 - 8, 3);
    pM.fillStyle(0x85c1e9, 0.15); pM.fillRect(10, 6, 10, 1);
    pM.lineStyle(3, 0x8b6914); pM.strokeRoundedRect(1, 1, S * 4 - 2, S * 2 - 2, 7);
    pM.lineStyle(1.5, 0xc4a35a); pM.strokeRoundedRect(4, 4, S * 4 - 8, S * 2 - 8, 5);
    pM.fillStyle(0x3a8a3a); pM.fillCircle(S * 1.2, S, 5);
    pM.fillStyle(0xf4d03f); pM.fillCircle(S * 1.2, S, 3);
    pM.fillStyle(0x3a8a3a); pM.fillCircle(S * 2.8, S, 4);
    pM.fillStyle(0xe8a0bf); pM.fillCircle(S * 2.8, S, 2);
    pM.generateTexture('building_pond_medium', S * 4, S * 2); pM.destroy();

    // Fish Pond Large (5x3 tiles)
    const pL = this.make.graphics({ x: 0, y: 0 });
    pL.fillStyle(0x1a5276); pL.fillRoundedRect(2, 2, S * 5 - 4, S * 3 - 4, 7);
    pL.fillStyle(0x2980b9); pL.fillRoundedRect(3, 3, S * 5 - 6, S * 3 - 6, 6);
    pL.fillStyle(0x3498db, 0.4); pL.fillRect(4, 4, S * 5 - 8, 4);
    pL.fillStyle(0x85c1e9, 0.15); pL.fillRect(12, 7, 14, 1);
    pL.fillRect(6, 18, 12, 1);
    pL.lineStyle(4, 0x8b6914); pL.strokeRoundedRect(1, 1, S * 5 - 2, S * 3 - 2, 8);
    pL.lineStyle(2, 0xc4a35a); pL.strokeRoundedRect(4, 4, S * 5 - 8, S * 3 - 8, 6);
    pL.fillStyle(0x3a8a3a); pL.fillCircle(S, S * 1.5, 6); pL.fillCircle(S * 4, S * 1.5, 5);
    pL.fillStyle(0xe8a0bf); pL.fillCircle(S, S * 1.5, 4);
    pL.fillStyle(0xf4d03f); pL.fillCircle(S * 4, S * 1.5, 3);
    pL.generateTexture('building_pond_large', S * 5, S * 3); pL.destroy();

    // Warehouse
    const wG = this.make.graphics({ x: 0, y: 0 });
    wG.fillStyle(0x6a4a1a); wG.fillRect(2, 8, S * 2 - 4, S * 2 - 8);
    wG.fillStyle(0x8b6914, 0.5); wG.fillRect(2, 8, S * 2 - 4, S - 4);
    wG.fillStyle(0xc4a35a, 0.3); wG.fillRect(4, 8, S - 8, S * 2 - 10);
    wG.fillStyle(0xa04040); wG.fillTriangle(S, 0, 0, 8, S * 2, 8);
    wG.fillStyle(0xc05050, 0.3); wG.fillTriangle(S, 2, 2, 8, S * 2 - 2, 8);
    wG.fillStyle(0x5d4e37); wG.fillRect(S - 5, S, 10, S - 2);
    wG.fillStyle(0x3a2a1a, 0.4); wG.fillRect(S - 4, S, 8, S - 3);
    wG.fillStyle(0xd4a853); wG.fillRect(S - 2, S + 2, 2, 2);
    wG.fillStyle(0x000000, 0.15); wG.fillRect(0, S * 2 - 4, S * 2, 4);
    // Window
    wG.fillStyle(0x85c1e9, 0.4); wG.fillRect(6, 10, 5, 4);
    wG.generateTexture('building_warehouse', S * 2, S * 2); wG.destroy();

    // Dock
    const dG = this.make.graphics({ x: 0, y: 0 });
    dG.fillStyle(0xb8956a); dG.fillRect(0, 2, S * 2, S - 2);
    dG.fillStyle(0xc4a87c, 0.4); dG.fillRect(0, 2, S * 2, S - 4);
    dG.fillStyle(0x8b6914, 0.3);
    for (let x = 0; x < S * 2; x += 5) dG.fillRect(x, 2, 2, S - 3);
    dG.fillStyle(0x000000, 0.12); dG.fillRect(0, S - 2, S * 2, 3);
    dG.fillStyle(0x5d4e37); dG.fillRect(3, 0, 3, S); dG.fillRect(S * 2 - 6, 0, 3, S);
    dG.generateTexture('building_dock', S * 2, S); dG.destroy();

    // Decorations
    const decoS = TILE_SIZE;

    // Lantern
    const lG = this.make.graphics({ x: 0, y: 0 });
    lG.fillStyle(0x6a757e); lG.fillRect(6, decoS - 4, 4, 5);
    lG.fillStyle(0x808b96, 0.3); lG.fillRect(7, decoS - 3, 2, 3);
    lG.fillStyle(0x5a6570); lG.fillRect(7, 2, 2, decoS - 6);
    lG.fillStyle(0xf4d03f, 0.9); lG.fillRoundedRect(3, 0, 10, 9, 3);
    lG.fillStyle(0xf0d040, 0.5); lG.fillRect(4, 2, 8, 2);
    lG.fillStyle(0xffffff, 0.3); lG.fillRect(5, 1, 6, 1);
    lG.fillStyle(0xa04040); lG.fillRect(3, -2, 10, 3);
    lG.fillStyle(0xd4a853, 0.4); lG.fillRect(4, -2, 8, 1);
    lG.generateTexture('deco_lantern', decoS, decoS); lG.destroy();

    // Bench
    const bG = this.make.graphics({ x: 0, y: 0 });
    bG.fillStyle(0x7a5a3a); bG.fillRect(2, 6, decoS * 2 - 4, 4);
    bG.fillStyle(0x9b7930, 0.3); bG.fillRect(2, 6, decoS * 2 - 4, 2);
    bG.fillStyle(0x5d4e37); bG.fillRect(2, 4, decoS * 2 - 4, 2);
    bG.fillStyle(0x6e4c1e); bG.fillRect(4, 9, 3, 5);
    bG.fillRect(decoS * 2 - 7, 9, 3, 5);
    bG.fillStyle(0x4a3020, 0.3); bG.fillRect(4, 9, 3, 2);
    bG.fillRect(decoS * 2 - 7, 9, 3, 2);
    bG.fillStyle(0xc4a35a, 0.2); bG.fillRect(3, 7, decoS * 2 - 6, 1);
    bG.generateTexture('deco_bench', decoS * 2, decoS + 4); bG.destroy();

    // Flower Pot
    const fpG = this.make.graphics({ x: 0, y: 0 });
    fpG.fillStyle(0x8a5a30); fpG.fillRoundedRect(3, 8, decoS - 6, decoS - 8, 3);
    fpG.fillStyle(0xaf7d4b, 0.4); fpG.fillRoundedRect(4, 8, decoS - 8, decoS - 10, 2);
    fpG.fillStyle(0x3a7a3a); fpG.fillRect(7, 3, 2, 6);
    fpG.fillStyle(0x5aaa5a); fpG.fillCircle(8, 1, 6);
    fpG.fillStyle(0x7dcea0, 0.4); fpG.fillCircle(8, 0, 4);
    fpG.fillStyle(0xe8a0bf); fpG.fillCircle(10, -1, 4);
    fpG.fillStyle(0xf4d03f); fpG.fillCircle(5, -2, 3);
    fpG.fillStyle(0xf0a0a0); fpG.fillCircle(11, 0, 3);
    fpG.fillStyle(0xff8888, 0.5); fpG.fillCircle(10, -1, 2);
    fpG.generateTexture('deco_flower_pot', decoS, decoS); fpG.destroy();

    // Fish Statue
    const fsG = this.make.graphics({ x: 0, y: 0 });
    fsG.fillStyle(0x707880); fsG.fillRect(2, decoS - 4, decoS - 4, 4);
    fsG.fillStyle(0x9098a0, 0.3); fsG.fillRect(3, decoS - 3, decoS - 6, 3);
    fsG.fillStyle(0xb0c0d0); fsG.fillEllipse(decoS / 2, decoS / 2 - 2, decoS - 4, decoS - 9);
    fsG.fillStyle(0xd0d8e0, 0.5); fsG.fillEllipse(decoS / 2, decoS / 2 - 3, decoS - 8, decoS - 13);
    fsG.fillStyle(0x8090a0); fsG.fillTriangle(decoS - 2, decoS / 2 - 2, decoS + 3, decoS / 2 - 7, decoS + 3, decoS / 2 + 3);
    fsG.fillStyle(0xa0b0c0, 0.3); fsG.fillTriangle(decoS - 1, decoS / 2 - 2, decoS + 1, decoS / 2 - 5, decoS + 1, decoS / 2 + 1);
    fsG.fillStyle(0xffffff); fsG.fillCircle(4, decoS / 2 - 3, 2);
    fsG.fillStyle(0x000000); fsG.fillCircle(4, decoS / 2 - 3, 1.2);
    fsG.fillStyle(0xffffff, 0.7); fsG.fillCircle(3.5, decoS / 2 - 4, 0.6);
    // Scale detail
    fsG.fillStyle(0xc0d0e0, 0.3);
    for (let s = 0; s < 3; s++) fsG.fillCircle(7 + s * 2, decoS / 2 - 1, 0.8);
    fsG.generateTexture('deco_fish_statue', decoS, decoS); fsG.destroy();

    // ── New Environment Elements ──────────────
    const ES = TILE_SIZE; // 16px

    // Mushroom (red with white spots)
    const mG = this.make.graphics({ x: 0, y: 0 });
    mG.fillStyle(0x000000, 0.12); mG.fillEllipse(ES/2, ES-1, 10, 3);
    mG.fillStyle(0xf0e8d0); mG.fillRect(ES/2-2, 12, 4, ES-12);
    mG.fillStyle(0xc04040); mG.fillEllipse(ES/2, 10, 14, 9);
    mG.fillStyle(0xe06060, 0.4); mG.fillEllipse(ES/2, 9, 11, 6);
    mG.fillStyle(0xffffff, 0.7); mG.fillCircle(ES/2-3, 8, 2); mG.fillCircle(ES/2+3, 10, 1.5);
    mG.fillCircle(ES/2, 7, 1.5); mG.fillCircle(ES/2-1, 11, 1);
    mG.generateTexture('env_mushroom', ES, ES); mG.destroy();

    // Fence post
    const fG = this.make.graphics({ x: 0, y: 0 });
    fG.fillStyle(0x000000, 0.1); fG.fillEllipse(8, ES-1, 8, 3);
    fG.fillStyle(0x6a4a1a); fG.fillRect(5, 4, 6, ES-4);
    fG.fillStyle(0x8a6a3a, 0.4); fG.fillRect(6, 4, 4, ES-6);
    fG.fillStyle(0x5a3a10, 0.3); fG.fillRect(9, 6, 1, ES-8);
    fG.fillStyle(0x6a4a1a); fG.fillTriangle(5, 4, 11, 4, 8, 0);
    fG.generateTexture('env_fence', ES, ES); fG.destroy();
  }

  // ─── UI ICONS ───────────────────────────────

  private createUITextures(): void {
    const hG = this.make.graphics({ x: 0, y: 0 });
    hG.fillStyle(0xc04040); hG.fillCircle(4, 3, 4); hG.fillCircle(10, 3, 4);
    hG.fillStyle(0xe85d75, 0.5); hG.fillCircle(4, 2, 2); hG.fillCircle(10, 2, 2);
    hG.fillStyle(0xe85d75); hG.fillTriangle(0, 4, 14, 4, 7, 13);
    hG.fillStyle(0xf08090, 0.3); hG.fillTriangle(2, 5, 12, 5, 7, 11);
    hG.generateTexture('ui_heart', 14, 14); hG.destroy();

    const cG = this.make.graphics({ x: 0, y: 0 });
    cG.fillStyle(0xb08020); cG.fillCircle(7, 7, 7);
    cG.fillStyle(0xd4a853); cG.fillCircle(7, 7, 5.5);
    cG.fillStyle(0xe8c878, 0.3); cG.fillCircle(7, 6, 3);
    cG.fillStyle(0xd4a853); cG.fillRect(6, 3, 2, 8);
    cG.generateTexture('ui_coin', 14, 14); cG.destroy();

    const eG = this.make.graphics({ x: 0, y: 0 });
    eG.fillStyle(0xc0a020); eG.fillRect(4, 0, 7, 8);
    eG.fillRect(1, 4, 13, 5); eG.fillRect(0, 9, 15, 4);
    eG.fillStyle(0xf0d040, 0.4); eG.fillRect(5, 1, 5, 6);
    eG.fillStyle(0xf0d040, 0.3); eG.fillRect(2, 5, 11, 3);
    eG.generateTexture('ui_energy', 15, 13); eG.destroy();
  }
}
