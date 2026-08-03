// src/components/popup/Overlay.ts

import { Graphics } from 'pixi.js';
import { BaseComponent } from '../BaseComponent';

/**
 * Overlay — fundo escurecido atrás do popup
 */
export class Overlay extends BaseComponent {
  private graphics: Graphics;
  private screenWidth: number;
  private screenHeight: number;

  constructor(screenWidth: number, screenHeight: number) {
    super();
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.graphics = new Graphics();
    this.initialize();
  }

  protected initialize(): void {
    console.log('Overlay.initialize() chamado');

    // Desenha retângulo que cobre toda a tela
    this.graphics.rect(0, 0, this.screenWidth, this.screenHeight);
    this.graphics.fill(0x000000); // Preto
    this.graphics.alpha = 0.7; // 70% de transparência

    this.addChild(this.graphics);
  }

  protected cleanup(): void {
    this.graphics.destroy();
  }
}