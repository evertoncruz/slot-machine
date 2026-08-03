// src/components/slot/WinLine.ts

import { Graphics } from 'pixi.js';
import { BaseComponent } from '../BaseComponent';

/**
 * WinLine — linha horizontal que marca o resultado vencedor
 * ✅ Passa pelo MEIO dos rolos
 */
export class WinLine extends BaseComponent {
  private lineGraphics: Graphics | null = null;
  private lineWidth: number = 0;
  private lineHeight: number = 0;
  private lineColor: number = 0xffff00; // Amarelo
  private lineAlpha: number = 0.8;

  constructor(
    lineWidth: number = 300,
    lineHeight: number = 4,
    lineColor: number = 0xffff00,
    lineAlpha: number = 0.8
  ) {
    super();
    this.lineWidth = lineWidth;
    this.lineHeight = lineHeight;
    this.lineColor = lineColor;
    this.lineAlpha = lineAlpha;
    this.initialize();
  }

  protected initialize(): void {
    console.log('📍 WinLine.initialize() chamado');
    this.createLine();
  }

  /**
   * Cria a linha visual
   */
  private createLine(): void {
    this.lineGraphics = new Graphics();

    // ✅ Desenha retângulo horizontal
    this.lineGraphics.rect(0, 0, this.lineWidth, this.lineHeight);
    this.lineGraphics.fill({ color: this.lineColor, alpha: this.lineAlpha });

    // ✅ Adiciona borda para melhor visibilidade
    this.lineGraphics.stroke({ color: 0xffffff, width: 1, alpha: 0.5 });

    // ✅ Centraliza verticalmente (metade da altura)
    this.lineGraphics.y = -this.lineHeight / 2;

    this.addChild(this.lineGraphics);

    console.log('📍 WinLine criada:', {
      width: this.lineWidth,
      height: this.lineHeight,
      color: `0x${this.lineColor.toString(16).padStart(6, '0')}`,
      alpha: this.lineAlpha,
    });
  }

  /**
   * Atualiza a largura da linha
   */
  public setWidth(width: number): void {
    this.lineWidth = width;
    if (this.lineGraphics) {
      this.lineGraphics.clear();
      this.lineGraphics.rect(0, 0, this.lineWidth, this.lineHeight);
      this.lineGraphics.fill({ color: this.lineColor, alpha: this.lineAlpha });
      this.lineGraphics.stroke({ color: 0xffffff, width: 1, alpha: 0.5 });
    }
  }

  /**
   * Atualiza a cor da linha
   */
  public setColor(color: number, alpha: number = 0.8): void {
    this.lineColor = color;
    this.lineAlpha = alpha;
    if (this.lineGraphics) {
      this.lineGraphics.clear();
      this.lineGraphics.rect(0, 0, this.lineWidth, this.lineHeight);
      this.lineGraphics.fill({ color: this.lineColor, alpha: this.lineAlpha });
      this.lineGraphics.stroke({ color: 0xffffff, width: 1, alpha: 0.5 });
    }
  }

  /**
   * Mostra/esconde a linha
   */
  public setVisible(visible: boolean): void {
    if (this.lineGraphics) {
      this.lineGraphics.visible = visible;
    }
  }

  /**
   * Limpeza
   */
  protected cleanup(): void {
    if (this.lineGraphics) {
      this.lineGraphics.destroy();
      this.lineGraphics = null;
    }
  }
}