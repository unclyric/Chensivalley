/* ============================================
   沉思谷物鱼 - Fishing Minigame Scene
   Meditation Valley Fish
   ============================================ */

import Phaser from 'phaser';
import { useGameStore } from '../services/GameState';

export class FishingScene extends Phaser.Scene {
  private barGraphics!: Phaser.GameObjects.Graphics;
  private fishIcon!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private infoText!: Phaser.GameObjects.Text;
  private isActive = false;
  private mouseDown = false;
  private barPosition = 50;
  private barSpeed = 1.0;

  constructor() {
    super({ key: 'FishingScene' });
  }

  create(): void {
    // Listen for store changes
    this.scene.bringToTop();

    // Input: mouse/touch hold to raise bar
    this.input.on('pointerdown', () => { this.mouseDown = true; });
    this.input.on('pointerup', () => { this.mouseDown = false; });

    // Draw fishing UI once
    this.drawFishingUI();
  }

  private drawFishingUI(): void {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Background overlay
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.5);
    bg.fillRect(0, 0, w, h);
    bg.setDepth(50);

    // Title area
    this.infoText = this.add.text(w / 2, 30, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(51);

    // Fishing bar container
    const barX = w / 2;
    const barY = h / 2;
    const barWidth = 40;
    const barHeight = 200;

    // Fishing area background
    const areaBg = this.add.graphics();
    areaBg.fillStyle(0x1a3a5c, 0.8);
    areaBg.fillRect(barX - barWidth / 2 - 10, barY - barHeight / 2 - 10, barWidth + 20, barHeight + 20);
    areaBg.lineStyle(3, 0x4a8fbf);
    areaBg.strokeRect(barX - barWidth / 2 - 10, barY - barHeight / 2 - 10, barWidth + 20, barHeight + 20);
    areaBg.setDepth(51);

    // Progress bar (top)
    this.progressBar = this.add.graphics();
    this.progressBar.setDepth(52);

    // Fish icon
    this.fishIcon = this.add.graphics();
    this.fishIcon.setDepth(53);

    // Green capture bar
    this.barGraphics = this.add.graphics();
    this.barGraphics.setDepth(53);

    // Instructions
    this.add.text(w / 2, h - 40, '按住鼠标/屏幕：绿色框上升\n松开：绿色框下降\n将鱼保持在绿色区域内！', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#a0c0d0',
      align: 'center',
    }).setOrigin(0.5).setDepth(51);
  }

  update(): void {
    const store = useGameStore.getState();
    const fg = store.fishingGame;

    if (!fg.active) {
      if (this.isActive) {
        this.clearGraphics();
      }
      this.isActive = false;
      return;
    }

    this.isActive = true;
    this.scene.setVisible(true);

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const barX = w / 2;
    const barY = h / 2;
    const barWidth = 40;
    const barHeight = 200;

    // Update bar position based on mouse input
    if (this.mouseDown) {
      this.barPosition = Math.max(0, this.barPosition - this.barSpeed);
    } else {
      this.barPosition = Math.min(100, this.barPosition + this.barSpeed * 0.8);
    }

    // Update store
    store.updateFishingBar(this.barPosition);

    // ─── Draw Progress Bar ────────────────────
    this.progressBar.clear();
    const progressWidth = 200;
    const progressX = w / 2 - progressWidth / 2;
    const progressY = 55;

    // Background
    this.progressBar.fillStyle(0x333333);
    this.progressBar.fillRect(progressX, progressY, progressWidth, 12);
    // Fill
    const progressColor = fg.progress >= fg.maxProgress ? 0x4aff4a : 0x2aaf2a;
    this.progressBar.fillStyle(progressColor);
    this.progressBar.fillRect(progressX, progressY, (fg.progress / fg.maxProgress) * progressWidth, 12);
    // Border
    this.progressBar.lineStyle(2, 0x5a3d5c);
    this.progressBar.strokeRect(progressX, progressY, progressWidth, 12);

    // Progress text
    this.progressBar.fillStyle(0xffffff);
    // (handled by infoText update below)

    // ─── Draw Fish Icon ───────────────────────
    this.fishIcon.clear();
    const fishY = barY - barHeight / 2 + (fg.fishPosition / 100) * barHeight;
    // Fish body
    this.fishIcon.fillStyle(fg.fish?.color ? parseInt(fg.fish.color.replace('#', ''), 16) : 0xffa040);
    this.fishIcon.fillEllipse(barX, fishY, 20, 12);
    // Fish tail
    this.fishIcon.fillStyle(0xffffff, 0.7);
    this.fishIcon.fillTriangle(
      barX - 10, fishY,
      barX - 16, fishY - 6,
      barX - 16, fishY + 6
    );
    // Fish eye
    this.fishIcon.fillStyle(0xffffff);
    this.fishIcon.fillCircle(barX + 5, fishY - 2, 3);
    this.fishIcon.fillStyle(0x000000);
    this.fishIcon.fillCircle(barX + 6, fishY - 2, 1.5);

    // ─── Draw Green Capture Bar ───────────────
    this.barGraphics.clear();
    const barCenterY = barY - barHeight / 2 + (fg.barPosition / 100) * barHeight;
    const halfBarH = (fg.barSize / 100) * barHeight / 2;

    // Bar background
    this.barGraphics.fillStyle(0x2a5a2a, 0.5);
    this.barGraphics.fillRect(barX - barWidth / 2, barY - barHeight / 2, barWidth, barHeight);

    // Green capture zone
    this.barGraphics.fillStyle(fg.perfect ? 0x4aff4a : 0xffaa00, 0.8);
    this.barGraphics.fillRect(barX - barWidth / 2, barCenterY - halfBarH, barWidth, halfBarH * 2);

    // Border on capture zone
    this.barGraphics.lineStyle(2, 0xffffff, 0.9);
    this.barGraphics.strokeRect(barX - barWidth / 2, barCenterY - halfBarH, barWidth, halfBarH * 2);

    // ─── Update Info Text ─────────────────────
    const fishName = fg.fish?.name || '???';
    const progress = Math.round((fg.progress / fg.maxProgress) * 100);
    this.infoText.setText(`${fishName} - ${progress}%`);

    // Check win/lose
    if (fg.progress >= fg.maxProgress) {
      const result = store.endFishing(true);
      if (result) {
        // Show catch result
        this.showCatchResult(result.fish.name, result.size, result.quality, result.perfect);
      }
      store.closePanel();
    }

    // Check if fish escaped (progress hit 0 - but we only check after some game time)
    if (fg.progress <= 0 && this.isActive) {
      store.endFishing(false);
      store.showNotification('🐟 鱼跑掉了……再接再厉！');
      store.closePanel();
    }
  }

  private showCatchResult(name: string, size: number, quality: number, perfect: boolean): void {
    const store = useGameStore.getState();

    // Calculate value
    const fish = store.fishingGame.fish;
    if (!fish) return;

    const value = fish.baseValue;
    const totalValue = Math.round(value * (size / fish.maxSize) * (quality / 100) * (perfect ? 1.5 : 1));

    // Show notification
    const perfectText = perfect ? ' ✨完美捕获✨' : '';
    store.showNotification(
      `🎣 钓到了 ${name}！${perfectText}\n尺寸: ${size}cm | 品质: ${quality}% | 价值: ${totalValue}G`
    );

    // Add gold
    store.addGold(totalValue);
  }

  private clearGraphics(): void {
    this.progressBar?.clear();
    this.fishIcon?.clear();
    this.barGraphics?.clear();
  }
}
