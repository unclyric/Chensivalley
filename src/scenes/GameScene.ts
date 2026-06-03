/* ============================================
   沉思谷物鱼 - Main Game Scene
   Meditation Valley Fish
   ============================================ */

import Phaser from 'phaser';
import { useGameStore } from '../services/GameState';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, PALETTE, PLAYER_SPEED } from '../utils/constants';
import { FishingLocation, Season, Weather, TimeOfDay, BuildingType } from '../utils/types';
import { getTimeOfDay, formatTime, formatDate } from '../utils/helpers';
import { getAvailableFish } from '../data/fish';
import { playFishCaught, playTalk } from '../utils/SoundFX';

// Map generation constants
const WATER_LEVEL = 16; // tiles from top where water starts
const SHORE_WIDTH = 6;

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private actionKey!: Phaser.Input.Keyboard.Key;
  private mapKey!: Phaser.Input.Keyboard.Key;
  private inventoryKey!: Phaser.Input.Keyboard.Key;

  private mapTiles: Phaser.GameObjects.Image[][] = [];
  private collisionLayer: boolean[][] = [];
  private npcSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private npcShadows: Map<string, Phaser.GameObjects.Ellipse> = new Map();
  private buildingSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private fishingSpotMarkers: Phaser.GameObjects.Graphics[] = [];
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private walkDustTimer = 0;
  private waterColliders!: Phaser.Physics.Arcade.StaticGroup;

  private hudTexts!: {
    time: Phaser.GameObjects.Text;
    date: Phaser.GameObjects.Text;
    season: Phaser.GameObjects.Text;
    gold: Phaser.GameObjects.Text;
    location: Phaser.GameObjects.Text;
    weather: Phaser.GameObjects.Text;
  };

  private timeAccumulator = 0;
  private currentMap: FishingLocation = FishingLocation.MeditationLake;
  private edgeHintShown = false;
  private bgm!: Phaser.Sound.BaseSound;
  private bgmMuted = false;
  private handItemText!: Phaser.GameObjects.Text;
  private lastActionTime = 0;
  private lastBuildingsVersion = -1;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const store = useGameStore.getState();
    this.currentMap = store.player.currentMap;

    // Setup keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Action key (E for fish/talk)
    this.actionKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);


    // ── Background Music ──────────────────────
    this.sound.volume = 0.25;
    this.bgm = this.sound.add('bgm', { loop: true });
    this.bgm.play();

    // N key toggles mute
    const muteKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    muteKey.on('down', () => {
      this.bgmMuted = !this.bgmMuted;
      this.sound.mute = this.bgmMuted;
      if (this.bgmMuted) {
        useGameStore.getState().showNotification('🔇 背景音乐已关闭');
      } else {
        useGameStore.getState().showNotification('🔊 背景音乐已开启');
      }
    });

    // Generate map
    this.generateMap(this.currentMap);

    // Create player
    this.player = this.physics.add.sprite(
      store.player.position.x * TILE_SIZE * 2,
      store.player.position.y * TILE_SIZE * 2,
      'player'
    );
    this.player.setScale(2.2);
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);

    // Player drop shadow
    this.playerShadow = this.add.ellipse(0, 0, 8, 3, 0x000000, 0.2);
    this.playerShadow.setDepth(1);
    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE * 2, MAP_HEIGHT * TILE_SIZE * 2);

    // ── Water collision (physics) ────────────
    this.waterColliders = this.physics.add.staticGroup();
    this.buildWaterColliders();
    this.physics.add.collider(this.player, this.waterColliders);

    // Create HUD
    this.createHUD();

    // ── Hand item display ────────────────────
    this.handItemText = this.add.text(0, 0, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(15).setAlpha(0);

    // Spawn NPCs
    this.spawnNPCs();

    // Mark fishing spots
    this.markFishingSpots();

    // ── Simple Animations ─────────────────────
    this.addAnimations();

    // ── Render existing buildings ────────────
    this.renderBuildings();

    // Random notification
    this.time.delayedCall(2000, () => {
      store.showNotification('欢迎来到大辟谷！WASD移动 | E钓鱼/对话 | I背包 | M地图 | B建造 | N音乐 | ESC设置');
    });

    // Aggressive canvas focus for keyboard input
    const canvas = this.game.canvas;
    canvas.setAttribute('tabindex', '0');
    canvas.style.outline = 'none';
    canvas.focus();
    // Focus on any interaction
    this.input.on('pointerdown', () => canvas.focus());
    this.input.on('pointermove', () => { if (!canvas.contains(document.activeElement)) canvas.focus(); });
    // Also focus on keydown anywhere in document
    document.addEventListener('keydown', () => {
      if (store.gameStarted && store.currentPanel === 'none') {
        canvas.focus();
      }
    });

    // E key for fishing/talking
    this.actionKey.on('down', () => {
      this.tryFish();
      this.tryTalkToNPC();
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        const s = useGameStore.getState();
        if (s.currentPanel === 'none') s.openPanel('backpack');
      }
    });
  }

  // ─── Map Generation ─────────────────────────

  private generateMap(location: FishingLocation): void {
    // Clear existing
    this.mapTiles.flat().forEach(t => t.destroy());
    this.mapTiles = [];
    this.collisionLayer = [];

    // Initialize collision grid
    for (let y = 0; y < MAP_HEIGHT; y++) {
      this.collisionLayer[y] = [];
      this.mapTiles[y] = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        this.collisionLayer[y][x] = false;
      }
    }

    // Generate terrain based on location
    switch (location) {
      case FishingLocation.MeditationLake:
        this.generateLakeMap();
        break;
      case FishingLocation.NanmingRiver:
        this.generateRiverMap();
        break;
      case FishingLocation.WestLake:
        this.generateWestLakeMap();
        break;
      case FishingLocation.YangyeMarsh:
        this.generateMarshMap();
        break;
    }

    // Render tiles
    const S = TILE_SIZE * 2; // 2x scale for pixel art
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tileType = this.getTileType(x, y);
        if (tileType) {
          const tile = this.add.image(x * S + S / 2, y * S + S / 2, tileType);
          tile.setDisplaySize(S, S);
          tile.setDepth(0);
          this.mapTiles[y][x] = tile;
        }
      }
    }

    // Render trees, bushes, flowers
    this.renderEnvironment();
  }

  private generateLakeMap(): void {
    // Large lake in the center with shores around
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (y >= WATER_LEVEL && y < MAP_HEIGHT - 5 &&
            x >= SHORE_WIDTH && x < MAP_WIDTH - SHORE_WIDTH) {
          // Water
          this.collisionLayer[y][x] = true; // can't walk on water
        } else if (y >= WATER_LEVEL - 2 && y < MAP_HEIGHT - 3 &&
                   x >= SHORE_WIDTH - 2 && x < MAP_WIDTH - SHORE_WIDTH + 2) {
          // Shore/sand
          this.collisionLayer[y][x] = false;
        } else {
          // Grass
          this.collisionLayer[y][x] = false;
        }
      }
    }

    // Add trees, bushes, flowers on grass borders
    const trees = [];
    const bushes = [];
    const flowers = [];
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      for (let y = 1; y < WATER_LEVEL - 1; y++) {
        if (this.collisionLayer[y]?.[x] === false &&
            !(x >= 28 && x <= 40 && y >= 8 && y <= 14)) { // avoid player spawn area
          const r = Math.random();
          if (r < 0.06) trees.push({ x, y });
          else if (r < 0.15) flowers.push({ x, y });
        }
      }
      // Bottom grass
      for (let y = MAP_HEIGHT - 4; y < MAP_HEIGHT - 1; y++) {
        if (this.collisionLayer[y]?.[x] === false) {
          const r = Math.random();
          if (r < 0.04) trees.push({ x, y });
          else if (r < 0.1) bushes.push({ x, y });
          else if (r < 0.18) flowers.push({ x, y });
        }
      }
    }
    // Rocks on shore/grass edges, lily pads on water
    const rocks: {x:number,y:number}[] = [];
    const lilies: {x:number,y:number}[] = [];
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      for (let y = WATER_LEVEL - 2; y < WATER_LEVEL; y++) {
        if (this.collisionLayer[y]?.[x] === false && !this.collisionLayer[y+1]?.[x]) {
          if (Math.random() < 0.15) rocks.push({ x, y });
        }
      }
      for (let y = WATER_LEVEL; y < MAP_HEIGHT - 5; y++) {
        if (this.collisionLayer[y]?.[x] === true && this.collisionLayer[y-1]?.[x] === false) {
          if (Math.random() < 0.2) lilies.push({ x, y: y + 1 });
        }
      }
    }
    this.placeDecorations(trees);
    this.placeBushes(bushes);
    this.placeFlowers(flowers);
    this.placeRocks(rocks);
    this.placeLilies(lilies);
    // Fences along water edge (barrier) + mushrooms
    const mushrooms: {x:number,y:number}[] = [];
    const fences: {x:number,y:number}[] = [];
    for (let x = 2; x < MAP_WIDTH - 2; x++) {
      for (let y = WATER_LEVEL - 1; y <= WATER_LEVEL; y++) {
        // Place fence on walkable tile adjacent to water
        if (this.collisionLayer[y]?.[x] === false && this.collisionLayer[y+1]?.[x] === true) {
          if (x % 4 === 0) fences.push({ x, y });
        }
      }
    }
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      for (let y = 1; y < WATER_LEVEL - 1; y++) {
        if (this.collisionLayer[y]?.[x] === false && Math.random() < 0.015) mushrooms.push({x,y});
      }
      // Fences along the top grass edge
      if (x % 12 === 0 && this.collisionLayer[WATER_LEVEL-3]?.[x] === false) fences.push({x, y: WATER_LEVEL-3});
    }
    this.mushroomPositions = mushrooms;
    this.fencePositions = fences;
  }

  private generateRiverMap(): void {
    // River flowing from top-left to bottom-right
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const riverCenter = MAP_WIDTH * 0.3 + y * 0.4;
        const distFromRiver = Math.abs(x - riverCenter);

        if (distFromRiver < 3) {
          this.collisionLayer[y][x] = true; // water
        } else if (distFromRiver < 5) {
          this.collisionLayer[y][x] = false; // shore
        } else {
          this.collisionLayer[y][x] = false; // grass
        }
      }
    }

    // Decorate edges with trees, bushes, flowers
    const trees: {x:number,y:number}[] = [];
    const bushes: {x:number,y:number}[] = [];
    const flowers: {x:number,y:number}[] = [];
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      for (let y = 1; y < MAP_HEIGHT - 1; y++) {
        if (this.collisionLayer[y]?.[x] === false) {
          const distFromRiver = Math.abs(x - (MAP_WIDTH * 0.3 + y * 0.4));
          // Only place on grass away from river shore
          if (distFromRiver > 6) {
            const r = Math.random();
            if (r < 0.04) trees.push({ x, y });
            else if (r < 0.08) bushes.push({ x, y });
            else if (r < 0.14) flowers.push({ x, y });
          }
        }
      }
    }
    this.placeDecorations(trees);
    this.placeBushes(bushes);
    this.placeFlowers(flowers);
  }

  private generateWestLakeMap(): void {
    // Larger, more open lake with islands
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (y >= WATER_LEVEL - 2 && y < MAP_HEIGHT - 3 &&
            x >= 3 && x < MAP_WIDTH - 3) {
          // Check for islands
          const isIsland1 = (x >= 20 && x <= 25 && y >= 22 && y <= 28);
          const isIsland2 = (x >= 38 && x <= 42 && y >= 12 && y <= 17);
          if (isIsland1 || isIsland2) {
            this.collisionLayer[y][x] = false;
          } else {
            this.collisionLayer[y][x] = true; // deep water
          }
        } else {
          this.collisionLayer[y][x] = false;
        }
      }
    }

    // Lighthouse area (top-right corner)
    for (let y = 0; y < 8; y++) {
      for (let x = MAP_WIDTH - 10; x < MAP_WIDTH; x++) {
        this.collisionLayer[y][x] = false;
      }
    }

    // Trees on shore edges and islands
    const trees: {x:number,y:number}[] = [];
    const bushes: {x:number,y:number}[] = [];
    const flowers: {x:number,y:number}[] = [];
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      for (let y = 1; y < MAP_HEIGHT - 1; y++) {
        if (this.collisionLayer[y]?.[x] === false) {
          const r = Math.random();
          // Denser on islands, sparse on shore
          if (r < 0.03) trees.push({ x, y });
          else if (r < 0.08) bushes.push({ x, y });
          else if (r < 0.15) flowers.push({ x, y });
        }
      }
    }
    this.placeDecorations(trees);
    this.placeBushes(bushes);
    this.placeFlowers(flowers);
  }

  private generateMarshMap(): void {
    // Swampy terrain with scattered water patches
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const noise = Math.sin(x * 0.5) * Math.cos(y * 0.3) * 5;
        if (y > 10 && y < MAP_HEIGHT - 5 &&
            Math.abs(x - MAP_WIDTH / 2 + noise) < 8 + Math.random() * 3) {
          this.collisionLayer[y][x] = true; // deep marsh water
        } else {
          this.collisionLayer[y][x] = false; // marshy ground
        }
      }
    }

    // Scattered marsh vegetation
    const trees: {x:number,y:number}[] = [];
    const bushes: {x:number,y:number}[] = [];
    const flowers: {x:number,y:number}[] = [];
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      for (let y = 1; y < MAP_HEIGHT - 1; y++) {
        if (this.collisionLayer[y]?.[x] === false) {
          const r = Math.random();
          if (r < 0.02) trees.push({ x, y });
          else if (r < 0.06) bushes.push({ x, y });
          else if (r < 0.10) flowers.push({ x, y });
        }
      }
    }
    this.placeDecorations(trees);
    this.placeBushes(bushes);
    this.placeFlowers(flowers);
  }

  private getTileType(x: number, y: number): string | null {
    const isWater = this.collisionLayer[y]?.[x];

    // Check neighbors for water edge
    const isNearWater = !isWater && (
      (y > 0 && this.collisionLayer[y - 1]?.[x]) ||
      (y < MAP_HEIGHT - 1 && this.collisionLayer[y + 1]?.[x]) ||
      (x > 0 && this.collisionLayer[y]?.[x - 1]) ||
      (x < MAP_WIDTH - 1 && this.collisionLayer[y]?.[x + 1])
    );

    if (isWater) return 'tile_water';
    if (isNearWater) return 'tile_water_edge';
    if (this.hasDecoration(x, y)) return null; // decorations handled separately
    return 'tile_grass';
  }

  private decorationPositions: { x: number; y: number }[] = [];
  private bushPositions: { x: number; y: number }[] = [];
  private flowerPositions: { x: number; y: number }[] = [];
  private rockPositions: { x: number; y: number }[] = [];
  private lilyPositions: { x: number; y: number }[] = [];
  private mushroomPositions: { x: number; y: number }[] = [];
  private fencePositions: { x: number; y: number }[] = [];
  private decoSprites: Phaser.GameObjects.Image[] = [];

  private placeDecorations(positions: { x: number; y: number }[]): void {
    this.decorationPositions = positions;
  }
  private placeBushes(positions: { x: number; y: number }[]): void {
    this.bushPositions = positions;
  }
  private placeFlowers(positions: { x: number; y: number }[]): void {
    this.flowerPositions = positions;
  }
  private placeRocks(positions: { x: number; y: number }[]): void {
    this.rockPositions = positions;
  }
  private placeLilies(positions: { x: number; y: number }[]): void {
    this.lilyPositions = positions;
  }

  private hasDecoration(x: number, y: number): boolean {
    return this.decorationPositions.some(d => d.x === x && d.y === y)
      || this.bushPositions.some(d => d.x === x && d.y === y)
      || this.flowerPositions.some(d => d.x === x && d.y === y)
      || this.rockPositions.some(d => d.x === x && d.y === y);
  }

  private renderEnvironment(): void {
    this.decoSprites.forEach(s => s.destroy());
    this.decoSprites = [];
    const S = TILE_SIZE * 2;

    // Trees
    this.decorationPositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'tile_tree');
      sprite.setScale(0.85 + Math.random() * 0.3);
      sprite.setDepth(2);
      this.decoSprites.push(sprite);
    });
    // Bushes
    this.bushPositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'tile_bush');
      sprite.setScale(0.8 + Math.random() * 0.4);
      sprite.setDepth(2);
      this.decoSprites.push(sprite);
    });
    // Flowers
    this.flowerPositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'tile_flower');
      sprite.setScale(0.8 + Math.random() * 0.3);
      sprite.setDepth(4);
      this.decoSprites.push(sprite);
    });
    // Rocks (depth 3 - behind player but above ground)
    this.rockPositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'env_rock');
      sprite.setScale(0.7 + Math.random() * 0.5);
      sprite.setDepth(3);
      this.decoSprites.push(sprite);
    });
    // Lily pads (depth 1)
    this.lilyPositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'env_lilypad');
      sprite.setScale(0.6 + Math.random() * 0.5); sprite.setDepth(1); sprite.setAlpha(0.7);
      this.decoSprites.push(sprite);
    });
    // Mushrooms (depth 4)
    this.mushroomPositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'env_mushroom');
      sprite.setScale(0.8 + Math.random() * 0.3); sprite.setDepth(4);
      this.decoSprites.push(sprite);
    });
    // Fences (depth 3)
    this.fencePositions.forEach(pos => {
      const sprite = this.add.image(pos.x * S + S / 2, pos.y * S + S / 2, 'env_fence');
      sprite.setScale(0.9 + Math.random() * 0.2); sprite.setDepth(3);
      this.decoSprites.push(sprite);
    });
  }

  // ─── Player Movement ────────────────────────

  update(time: number, delta: number): void {
    const store = useGameStore.getState();

    // Only process game update if no panel is open
    if (store.currentPanel !== 'none' && store.currentPanel !== 'npc_dialog') {
      this.player.setVelocity(0, 0);
      return;
    }

    // Movement
    const speed = PLAYER_SPEED * 2; // scaled for 2x tiles
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;

    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;

    // ── Player facing direction ──────────────
    const isMoving = vx !== 0 || vy !== 0;
    if (vx < 0) {
      this.player.setFlipX(true);  // face left
    } else if (vx > 0) {
      this.player.setFlipX(false); // face right
    }
    // (keep last direction when only moving vertically)

    // ── Walking bounce animation ──────────────
    const BASE_SCALE = 2.2;
    const isCurrentlyWalking = this.player.getData('walking') === true;
    if (isMoving && !isCurrentlyWalking) {
      this.tweens.killTweensOf(this.player);
      this.player.setScale(BASE_SCALE);
      this.tweens.add({
        targets: this.player,
        scaleY: BASE_SCALE * 0.92,
        duration: 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      this.player.setData('walking', true);
    } else if (!isMoving && (isCurrentlyWalking || this.player.getData('walking') === undefined)) {
      this.tweens.killTweensOf(this.player);
      this.player.setScale(BASE_SCALE);
      this.tweens.add({
        targets: this.player,
        scaleY: BASE_SCALE * 0.97,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      this.player.setData('walking', false);
    }

    // Set velocity (water blocked by physics colliders)
    this.player.setVelocity(vx, vy);

    // ── Shadow sync ───────────────────────────
    this.playerShadow.setPosition(this.player.x, this.player.y + 16);
    this.npcShadows.forEach((shadow, npcId) => {
      const sprite = this.npcSprites.get(npcId);
      if (sprite) shadow.setPosition(sprite.x, sprite.y + 14);
    });

    // ── Walk dust particles ──────────────────
    if (isMoving) {
      this.walkDustTimer += delta;
      if (this.walkDustTimer > 250) {
        this.walkDustTimer = 0;
        const dx = (Math.random() - 0.5) * 6;
        const dy = (Math.random() - 0.5) * 4;
        const dust = this.add.circle(this.player.x + dx, this.player.y + 14 + dy, 2, 0xc4a87c, 0.4);
        dust.setDepth(1);
        this.tweens.add({ targets: dust, alpha: 0, scale: 1.5, duration: 400, onComplete: () => dust.destroy() });
      }
    }

    // ── NPC proximity glow ───────────────────
    const pTileX = Math.floor(this.player.x / (TILE_SIZE * 2));
    const pTileY = Math.floor(this.player.y / (TILE_SIZE * 2));
    this.npcSprites.forEach((sprite, npcId) => {
      const nTileX = Math.floor(sprite.x / (TILE_SIZE * 2));
      const nTileY = Math.floor(sprite.y / (TILE_SIZE * 2));
      const dist = Math.abs(pTileX - nTileX) + Math.abs(pTileY - nTileY);
      const targetAlpha = dist <= 2 ? 1 : 0.8;
      if (Math.abs(sprite.alpha - targetAlpha) > 0.01) {
        sprite.setAlpha(sprite.alpha + (targetAlpha - sprite.alpha) * 0.1);
      }
    });

    // Update store position
    const newTileX = pTileX;
    const newTileY = pTileY;
    const currentStorePos = useGameStore.getState().player.position;
    if (newTileX !== currentStorePos.x || newTileY !== currentStorePos.y) {
      store.movePlayer(newTileX, newTileY);
    }

    // Edge-of-map transition: walk to border to travel between areas
    const edgeThreshold = 2;
    if (newTileX <= edgeThreshold || newTileX >= MAP_WIDTH - edgeThreshold - 1 ||
        newTileY <= edgeThreshold || newTileY >= MAP_HEIGHT - edgeThreshold - 1) {
      if (!this.edgeHintShown) {
        this.edgeHintShown = true;
        if (store.currentPanel === 'none') {
          store.showNotification('📍 走到地图边缘了！按 M 打开地图前往其他区域');
        }
        this.time.delayedCall(3000, () => { this.edgeHintShown = false; });
      }
    }

    // Time progression
    this.timeAccumulator += delta;
    while (this.timeAccumulator >= 1000) { // 1 real second = 1 game minute
      this.timeAccumulator -= 1000;
      store.advanceTime(1);
    }

    // ── Action effect watcher ────────────────
    const effect = useGameStore.getState().actionEffect;
    if (effect && effect.time > this.lastActionTime) {
      this.lastActionTime = effect.time;
      this.showActionEffect(effect.icon);
    }

    // ── Buildings re-render watcher ──────────
    const bv = useGameStore.getState().buildingsVersion;
    if (bv !== this.lastBuildingsVersion) {
      this.lastBuildingsVersion = bv;
      this.renderBuildings();
    }

    // ── Y-sort: trees render behind player when above, in front when below ──
    this.decoSprites.forEach(sprite => {
      if (!sprite || !sprite.active) return;
      const key = sprite.texture.key;
      if (key === 'tile_tree' || key === 'tile_bush') {
        sprite.setDepth(sprite.y > this.player.y + 4 ? 11 : 2);
      }
    });

    // Update HUD
    this.updateHUD();
  }

  private isTileWalkable(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) return false;
    return !this.collisionLayer[tileY]?.[tileX];
  }

  // ─── HUD ────────────────────────────────────

  private createHUD(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#e8d5c4',
      stroke: '#000000',
      strokeThickness: 3,
    };

    this.hudTexts = {
      time: this.add.text(14, 14, '', { ...style, fontSize: '15px' }).setDepth(100).setScrollFactor(0),
      date: this.add.text(14, 36, '', { ...style, fontSize: '13px' }).setDepth(100).setScrollFactor(0),
      season: this.add.text(14, 56, '', { ...style, fontSize: '18px' }).setDepth(100).setScrollFactor(0),
      gold: this.add.text(this.cameras.main.width - 14, 14, '', { ...style, color: '#d4a853', fontSize: '18px' })
        .setOrigin(1, 0).setDepth(100).setScrollFactor(0),
      location: this.add.text(this.cameras.main.width / 2, 14, '', { ...style, fontSize: '20px' })
        .setOrigin(0.5, 0).setDepth(100).setScrollFactor(0),
      weather: this.add.text(this.cameras.main.width - 14, 40, '', { ...style, fontSize: '13px' })
        .setOrigin(1, 0).setDepth(100).setScrollFactor(0),
    };

    // Map travel button (bottom right - bigger)
    const mapBtn = this.add.text(this.cameras.main.width - 14, this.cameras.main.height - 14, '🗺️ 地图 [M]', {
      ...style,
      fontSize: '15px',
      backgroundColor: '#3d2b3e',
      padding: { x: 10, y: 6 },
    })
      .setOrigin(1, 1)
      .setDepth(100)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    mapBtn.on('pointerdown', () => {
      const s = useGameStore.getState();
      if (s.currentPanel === 'none') s.openPanel('map');
    });
  }

  private updateHUD(): void {
    const store = useGameStore.getState();
    const t = store.time;
    const w = store.weather;

    this.hudTexts.time.setText(`🕐 ${formatTime(t)}`);
    this.hudTexts.date.setText(`📅 ${formatDate(t)}`);
    this.hudTexts.season.setText(this.getSeasonEmoji(t.season) + ' ' + this.getWeatherEmoji(w.current));
    this.hudTexts.gold.setText(`💰 ${store.player.gold} G`);
    this.hudTexts.weather.setText(`⚡ ${store.player.energy}/${store.player.maxEnergy}`);
  }

  private getSeasonEmoji(season: Season): string {
    const map: Record<Season, string> = {
      [Season.Spring]: '🌸', [Season.Summer]: '☀️',
      [Season.Autumn]: '🍂', [Season.Winter]: '❄️',
    };
    return map[season];
  }

  private getWeatherEmoji(weather: Weather): string {
    const map: Record<Weather, string> = {
      [Weather.Sunny]: '☀️', [Weather.Cloudy]: '☁️',
      [Weather.Rainy]: '🌧️', [Weather.Stormy]: '⛈️',
    };
    return map[weather];
  }

  // ─── NPCs ───────────────────────────────────

  private spawnNPCs(): void {
    // Place NPCs at scripted positions based on current time/map
    const npcPositions = [
      { id: 'old_fisherman', x: 18, y: 8 },
      { id: 'traveling_merchant', x: 35, y: 10 },
      { id: 'ichthyologist', x: 12, y: 10 },
      { id: 'lighthouse_keeper', x: 42, y: 10 },
      { id: 'wandering_painter', x: 20, y: 5 },
      { id: 'tea_house_owner', x: 28, y: 15 },
      { id: 'young_angler', x: 14, y: 14 },
      { id: 'retired_sailor', x: 48, y: 14 },
      { id: 'botanist', x: 8, y: 6 },
      { id: 'mysterious_hermit', x: 52, y: 20 },
    ];

    npcPositions.forEach((npc) => {
      const npcData = useGameStore.getState().npcData[npc.id];
      const texIdx = npcData?.spriteIndex ?? 0;
      // Ensure NPC spawns on walkable land (not water)
      let nx = npc.x;
      let ny = npc.y;
      if (this.collisionLayer[ny]?.[nx]) {
        // Find nearest walkable tile
        for (let r = 1; r < 8; r++) {
          let found = false;
          for (let dy = -r; dy <= r && !found; dy++) {
            for (let dx = -r; dx <= r && !found; dx++) {
              const cx = nx + dx;
              const cy = ny + dy;
              if (cx >= 0 && cx < MAP_WIDTH && cy >= 0 && cy < MAP_HEIGHT && !this.collisionLayer[cy]?.[cx]) {
                nx = cx; ny = cy; found = true;
              }
            }
          }
          if (found) break;
        }
      }

      const sprite = this.add.sprite(
        nx * TILE_SIZE * 2,
        ny * TILE_SIZE * 2,
        `npc_${texIdx}`
      );
      sprite.setScale(2.2);
      sprite.setDepth(5);
      sprite.setInteractive({ useHandCursor: true });
      sprite.on('pointerdown', () => this.interactWithNPC(npc.id));

      // NPC drop shadow
      const shadow = this.add.ellipse(0, 0, 7, 3, 0x000000, 0.18);
      shadow.setDepth(1);
      this.npcShadows.set(npc.id, shadow);

      // Add name label
      if (npcData) {
        const labelYOffset = -30; // higher above NPC head
        const label = this.add.text(nx * TILE_SIZE * 2, ny * TILE_SIZE * 2 + labelYOffset, npcData.name, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '14px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        }).setOrigin(0.5, 1).setDepth(6);
      }

      this.npcSprites.set(npc.id, sprite);
    });
  }

  private interactWithNPC(npcId: string): void {
    const store = useGameStore.getState();
    const npcData = store.npcData[npcId];
    if (!npcData) return;

    // 智爸 opens the shop directly
    if (npcId === 'traveling_merchant') {
      store.showNotification('🏪 爸爸的小摊——想买什么自己拿！也可以把鱼卖给爸爸。');
      store.openPanel('shop');
      store.checkQuestProgress('talk_to_npc', npcId, 1);
      if (Math.random() < 0.3) store.changeRelationship(npcId, 0.05);
      return;
    }

    const hearts = store.getRelationship(npcId);
    const heartLevel = Math.floor(hearts);
    const key = heartLevel.toString();
    const d = npcData.dialogues;
    const t = store.time;
    const w = store.weather;

    // ── Build a varied dialogue set ──────────
    const selected: string[] = [];

    // 1. Pick 2-3 random lines from the "random" pool
    if (d.random && d.random.length > 0) {
      const count = Math.min(3, d.random.length);
      const picked = this.pickRandom(d.random, count);
      selected.push(...picked);
    }

    // 2. Pick 1-2 contextual lines based on time of day
    const tod = getTimeOfDay(t.hour);
    const timeKey = tod === 'dawn' || tod === 'morning' ? 'morning'
      : tod === 'afternoon' ? 'afternoon'
      : tod === 'evening' ? 'evening'
      : 'night';
    const timeDialogues = d[timeKey as keyof typeof d] as string[] | undefined;
    if (timeDialogues && timeDialogues.length > 0) {
      selected.push(this.pickRandom(timeDialogues, 1)[0]);
    }

    // 3. Pick 1 contextual line based on weather
    const weatherKey = w.current === 'rainy' ? 'rainy'
      : w.current === 'stormy' ? 'stormy'
      : w.current === 'sunny' ? 'sunny'
      : null;
    if (weatherKey) {
      const weatherDialogues = d[weatherKey as keyof typeof d] as string[] | undefined;
      if (weatherDialogues && weatherDialogues.length > 0) {
        selected.push(this.pickRandom(weatherDialogues, 1)[0]);
      }
    }

    // 4. Pick 1 contextual line based on season
    const seasonKey = t.season as string;
    const seasonDialogues = d[seasonKey as keyof typeof d] as string[] | undefined;
    if (seasonDialogues && seasonDialogues.length > 0) {
      selected.push(this.pickRandom(seasonDialogues, 1)[0]);
    }

    // 5. Pick 1-2 lines from the heart-level specific pool
    const heartDialogues = d[key] || d.default;
    if (heartDialogues && heartDialogues.length > 0) {
      const count = Math.min(2, heartDialogues.length);
      const picked = this.pickRandom(heartDialogues, count);
      selected.push(...picked);
    }

    // 6. Fallback to default if nothing was selected
    if (selected.length === 0) {
      selected.push(...(d.default || ['……（沉默）']));
    }

    // 7. Shuffle for variety
    this.shuffleArray(selected);

    // ── Add relationship info header ──────────
    const heartDisplay = '❤️'.repeat(Math.floor(hearts / 2)) + '🤍'.repeat(5 - Math.floor(hearts / 2));
    const dialogues = [`${npcData.name} - ${npcData.title}`, `好感度: ${heartDisplay}`, ...selected];

    // ── Talk sound ──────────────────────────
    playTalk();

    // ── NPC reaction: "!" popup ──────────────
    const npcSprite = this.npcSprites.get(npcId);
    if (npcSprite) {
      const reactText = this.add.text(npcSprite.x, npcSprite.y - 24, '💬', {
        fontSize: '16px',
      }).setOrigin(0.5).setDepth(20);
      this.tweens.add({
        targets: reactText,
        y: npcSprite.y - 40,
        alpha: 0,
        duration: 800,
        ease: 'Quad.easeOut',
        onComplete: () => reactText.destroy(),
      });
    }

    // Track quest progress for "talk to NPC" objectives
    store.checkQuestProgress('talk_to_npc', npcId, 1);

    // Small relationship boost for talking
    if (Math.random() < 0.3) {
      store.changeRelationship(npcId, 0.05);
    }

    store.startDialog(npcId, dialogues);
  }

  /** Pick n random unique items from an array */
  private pickRandom<T>(arr: T[], n: number): T[] {
    if (n >= arr.length) return [...arr];
    const copy = [...arr];
    const result: T[] = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }

  /** Fisher-Yates shuffle in place */
  private shuffleArray<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // ─── Fishing ────────────────────────────────

  private tryFish(): void {
    const store = useGameStore.getState();
    if (store.currentPanel !== 'none') return;

    // Check if player is near water
    const tileX = Math.floor(this.player.x / (TILE_SIZE * 2));
    const tileY = Math.floor(this.player.y / (TILE_SIZE * 2));

    // Check adjacent tiles for water
    let nearWater = false;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = tileX + dx;
        const ny = tileY + dy;
        if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
          if (this.collisionLayer[ny]?.[nx]) {
            nearWater = true;
            break;
          }
        }
      }
      if (nearWater) break;
    }

    if (!nearWater) {
      store.showNotification('你需要走到水边才能钓鱼！');
      return;
    }

    // Check energy
    if (store.player.energy < 10) {
      store.showNotification('体力不足，无法钓鱼。休息一下吧。');
      return;
    }

    // Get available fish for current conditions
    const availableFish = getAvailableFish(
      store.player.currentMap,
      store.time.season,
      store.time.hour,
      store.weather.current,
      0
    );

    if (availableFish.length === 0) {
      store.showNotification('现在这里似乎没有鱼……换个时间再来吧。');
      return;
    }

    // Pick a random fish weighted by rarity
    const fish = this.pickRandomFish(availableFish, store.player.rodType, store.player.equippedBait);
    if (!fish) return;

    // Use energy
    store.useEnergy(10);

    // ── Water splash at player feet ──────────
    const splashX = this.player.x;
    const splashY = this.player.y + 12;
    for (let i = 0; i < 4; i++) {
      const drop = this.add.circle(
        splashX + (Math.random() - 0.5) * 10,
        splashY + (Math.random() - 0.5) * 6,
        1.5 + Math.random() * 2,
        0x85c1e9,
        0.6
      );
      drop.setDepth(8);
      this.tweens.add({
        targets: drop,
        y: drop.y - 8 - Math.random() * 6,
        x: drop.x + (Math.random() - 0.5) * 12,
        alpha: 0,
        scale: 1.5,
        duration: 300 + Math.random() * 200,
        onComplete: () => drop.destroy(),
      });
    }

    // Show fishing notification + visual rod effect
    store.showNotification(`🐟 有鱼上钩了！`);
    store.triggerActionEffect('fish', '🎣');
    playFishCaught();

    // Delay then start fishing minigame
    this.time.delayedCall(1000, () => {
      store.startFishing(fish);
      store.openPanel('fishing_game');
    });
  }

  private pickRandomFish(available: typeof import('../data/fish').ALL_FISH, rodType: string, baitType: string) {
    // Weight by rarity
    const rarityWeights: Record<string, number> = {
      common: 60,
      uncommon: 25,
      rare: 10,
      epic: 4,
      legendary: 1,
    };

    // Adjust for rod and bait
    const rodBonus: Record<string, number> = {
      wooden: 0, copper: 5, iron: 10, silver: 15, gold: 25,
    };
    const baitBonus: Record<string, number> = {
      none: 0, worm: 2, shrimp: 5, artificial: 8, special: 15,
    };

    const rareBonus = (rodBonus[rodType] || 0) + (baitBonus[baitType] || 0);

    const weighted = available.map(fish => ({
      fish,
      weight: (rarityWeights[fish.rarity] || 10) + (fish.rarity !== 'common' ? rareBonus : 0),
    }));

    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    let r = Math.random() * totalWeight;
    for (const w of weighted) {
      r -= w.weight;
      if (r <= 0) return w.fish;
    }
    return weighted[weighted.length - 1]?.fish;
  }

  // ─── NPC Interaction ────────────────────────

  private tryTalkToNPC(): void {
    const tileX = Math.floor(this.player.x / (TILE_SIZE * 2));
    const tileY = Math.floor(this.player.y / (TILE_SIZE * 2));

    // Check nearby NPCs
    this.npcSprites.forEach((sprite, npcId) => {
      const npcTileX = Math.floor(sprite.x / (TILE_SIZE * 2));
      const npcTileY = Math.floor(sprite.y / (TILE_SIZE * 2));
      const dist = Math.abs(tileX - npcTileX) + Math.abs(tileY - npcTileY);
      if (dist <= 2) {
        this.interactWithNPC(npcId);
      }
    });
  }

  // ─── Fishing Spot Markers ───────────────────

  private markFishingSpots(): void {
    // Show ripple effects at water edges to indicate fishing spots
    const store = useGameStore.getState();
    const spots = this.findFishingSpots();

    spots.forEach((pos, i) => {
      const marker = this.add.graphics();
      marker.setDepth(1);

      this.tweens.add({
        targets: marker,
        alpha: { from: 0.6, to: 0.2 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        delay: i * 200,
      });

      marker.fillStyle(0xffffff, 0.3);
      marker.fillCircle(pos.x * TILE_SIZE * 2, pos.y * TILE_SIZE * 2, 8);
      this.fishingSpotMarkers.push(marker);
    });
  }

  private findFishingSpots(): { x: number; y: number }[] {
    const spots: { x: number; y: number }[] = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (this.collisionLayer[y]?.[x]) {
          // Water tile next to walkable tile = fishing spot
          const hasWalkableNeighbor = (
            (y > 0 && !this.collisionLayer[y - 1]?.[x]) ||
            (y < MAP_HEIGHT - 1 && !this.collisionLayer[y + 1]?.[x]) ||
            (x > 0 && !this.collisionLayer[y]?.[x - 1]) ||
            (x < MAP_WIDTH - 1 && !this.collisionLayer[y]?.[x + 1])
          );
          if (hasWalkableNeighbor) {
            spots.push({ x, y });
          }
        }
      }
    }
    // Return subset for performance
    const step = Math.max(1, Math.floor(spots.length / 20));
    return spots.filter((_, i) => i % step === 0);
  }

  // ─── Animations ────────────────────────────

  private showActionEffect(icon: string): void {
    // Show item icon above player, float up and fade
    this.handItemText.setText(icon);
    this.handItemText.setPosition(this.player.x, this.player.y - 20);
    this.handItemText.setAlpha(1);
    this.handItemText.setScale(1);

    // Float up and fade out
    this.tweens.add({
      targets: this.handItemText,
      y: this.handItemText.y - 30,
      alpha: 0,
      scale: 1.5,
      duration: 1200,
      ease: 'Quad.easeOut',
    });
  }

  private addAnimations(): void {
    // 1. Player idle breathing starts in update loop

    // 2. NPC gentle bob animations
    this.npcSprites.forEach((sprite) => {
      this.tweens.add({
        targets: sprite,
        y: sprite.y - 3,
        duration: 1800 + Math.random() * 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 1000,
      });
    });

    // 3. Water shimmer on tiles (subtle alpha pulse)
    const waterTiles = this.mapTiles.flat().filter(t => t && t.texture.key === 'tile_water');
    waterTiles.forEach((tile, i) => {
      if (!tile) return;
      this.tweens.add({
        targets: tile,
        alpha: { from: 1, to: 0.85 },
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 30,
      });
    });

    // 4. Tree sway (subtle rotation)
    const treeTiles = this.mapTiles.flat().filter(t => t && t.texture.key === 'tile_tree');
    treeTiles.forEach((tree, i) => {
      if (!tree) return;
      this.tweens.add({
        targets: tree,
        angle: { from: -0.5, to: 0.5 },
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 400,
      });
    });
  }

  // ─── Building Rendering ────────────────────

  private renderBuildings(): void {
    // Clear existing building sprites
    this.buildingSprites.forEach(s => s.destroy());
    this.buildingSprites.clear();

    const store = useGameStore.getState();
    const S = TILE_SIZE * 2;

    store.player.buildings.forEach(b => {
      if (!b.built) return;
      // Only show buildings on the current map
      if (b.map !== this.currentMap) return;
      let textureKey = '';

      if (b.type === BuildingType.FishPond) {
        textureKey = b.variant === 'large' ? 'building_pond_large'
          : b.variant === 'medium' ? 'building_pond_medium'
          : 'building_pond_small';
      } else if (b.type === BuildingType.Warehouse) {
        textureKey = 'building_warehouse';
      } else if (b.type === BuildingType.Dock) {
        textureKey = 'building_dock';
      } else if (b.type === BuildingType.Decoration) {
        textureKey = `deco_${b.variant || 'lantern'}`;
      }

      if (!textureKey || !this.textures.exists(textureKey)) return;

      const sprite = this.add.image(
        b.position.x * S + S / 2,
        b.position.y * S + S / 2,
        textureKey
      );
      sprite.setDepth(3); // above ground, below player
      sprite.setAlpha(0.9);

      this.buildingSprites.set(b.id, sprite);
    });
  }

  // ─── Public API ─────────────────────────────

  teleportPlayer(tileX: number, tileY: number): void {
    this.player.setPosition(tileX * TILE_SIZE * 2, tileY * TILE_SIZE * 2);
  }

  changeMap(location: FishingLocation): void {
    this.currentMap = location;
    this.mapTiles.flat().forEach(t => t.destroy());
    this.mapTiles = [];
    this.decoSprites.forEach(s => s.destroy());
    this.decoSprites = [];
    this.fishingSpotMarkers.forEach(m => m.destroy());
    this.fishingSpotMarkers = [];
    this.buildingSprites.forEach(s => s.destroy());
    this.buildingSprites.clear();
    this.generateMap(location);
    this.markFishingSpots();
    // Rebuild water colliders for new map
    this.buildWaterColliders();
    // Re-render buildings
    this.renderBuildings();
    useGameStore.getState().changeMap(location);
  }

  private buildWaterColliders(): void {
    this.waterColliders.clear(true, true);
    const S = TILE_SIZE * 2;
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (this.collisionLayer[y]?.[x] === true) {
          const hasLand = (y>0&&!this.collisionLayer[y-1]?.[x])||(y<MAP_HEIGHT-1&&!this.collisionLayer[y+1]?.[x])||(x>0&&!this.collisionLayer[y]?.[x-1])||(x<MAP_WIDTH-1&&!this.collisionLayer[y]?.[x+1]);
          if (hasLand) {
            const b = this.waterColliders.create(x*S+S/2, y*S+S/2);
            b.setSize(S, S).setVisible(false).refreshBody();
          }
        }
      }
    }
  }
}
