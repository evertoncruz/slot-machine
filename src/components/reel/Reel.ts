// src/components/reel/Reel.ts

import { BaseComponent } from '../BaseComponent';
import { ReelContainer } from './ReelContainer';
import type { Symbol, ReelConfig } from '../../models';
import type { Container } from 'pixi.js';

/**
 * Reel — rolo individual com animação
 */
export class Reel extends BaseComponent {
  private reelContainer: ReelContainer | null = null;
  private reelConfig: ReelConfig;
  private reelIndex: number = 0;

  constructor(reelConfig: ReelConfig, reelIndex: number) {
    super();  // ✅ super() PRIMEIRO

    // ✅ DEPOIS atribua as propriedades
    this.reelConfig = reelConfig;
    this.reelIndex = reelIndex;

    this.initialize();

    console.log(`🎰 Reel construtor: index=${this.reelIndex}`);
  }

  /**
   * Inicializa o reel
   */
  protected initialize(): void {
    console.log(`🎰 Reel.initialize() chamado para reel ${this.reelIndex}`);

    // ✅ Cria o container AQUI
    this.reelContainer = new ReelContainer(this.reelConfig);
    this.addChild(this.reelContainer);

    console.log(`🎰 ReelContainer adicionado ao Reel ${this.reelIndex}`);
  }



  /**
   * Obtém o índice do reel
   */
  public getIndex(): number {
    return this.reelIndex;
  }

  public getContainer(): Container {
    return this.reelContainer!.getContentContainer();
  }

  public getConfig(): ReelConfig {
    return this.reelConfig;
  }

  public getMiddleSymbol(): Symbol {
    const middleIndex = this.reelConfig.visibleSymbols - 1;
    const symbols = this.reelContainer!.getSymbols();

    // O símbolo do meio é o que está visível no centro
    // Baseado na posição Y do container
    const containerY = this.reelContainer!.getContentContainer().y;
    const currentIndex = Math.round(-containerY / this.reelConfig.symbolHeight);
    const visibleIndex = (currentIndex + middleIndex) % symbols.length;

    return this.reelConfig.symbols[visibleIndex];
  }

  public getReelContainer(): ReelContainer {
    if (!this.reelContainer) {
      throw new Error('ReelContainer não foi inicializado');
    }
    return this.reelContainer;
  }


  /**
   * Limpeza
   */
  protected cleanup(): void {
    if (this.reelContainer) {
      this.reelContainer.destroy();
      this.reelContainer = null;
    }
  }
}