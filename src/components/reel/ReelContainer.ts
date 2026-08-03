// src/components/reel/ReelContainer.ts

import { Container, Graphics } from 'pixi.js';
import { ReelSymbol } from './ReelSymbol';
import type { ReelConfig } from '../../models/types';

/**
 * Container com máscara para exibir apenas símbolos visíveis
 * ✅ IMPORTANTE: Cria loop infinito com muitos símbolos
 */
export class ReelContainer extends Container {
  private reelConfig: ReelConfig;
  private symbols: ReelSymbol[] = [];
  private maskGraphics: Graphics;
  private contentContainer: Container;
  private totalSymbols: number = 0;

  constructor(reelConfig: ReelConfig) {
    super();
    this.reelConfig = reelConfig;

    console.log(`🎯 ReelContainer construtor chamado`);

    // ✅ Cria container interno para os símbolos
    this.contentContainer = new Container();
    this.contentContainer.x = 0;
    this.contentContainer.y = 0;
    this.addChild(this.contentContainer);

    // ✅ Cria a máscara (Graphics)
    this.maskGraphics = new Graphics();
    const visibleHeight = reelConfig.symbolHeight * reelConfig.visibleSymbols;

    // ✅ Desenha o retângulo da máscara
    this.maskGraphics.rect(0, 0, 80, visibleHeight);
    this.maskGraphics.fill({ color: 0xffffff });

    // ✅ Adiciona a máscara ao stage
    this.addChild(this.maskGraphics);

    // ✅ Aplica a máscara ao container de conteúdo
    this.contentContainer.mask = this.maskGraphics;

    console.log(`🎯 Máscara criada: 80 x ${visibleHeight}`);

    this.initialize();
  }

  /**
   * Inicializa o container
   */
  protected initialize(): void {
    console.log(`🎯 ReelContainer.initialize() chamado`);
    this.createSymbols();
  }

  /**
   * Cria os símbolos com LOOP INFINITO
   * ✅ Cria MUITOS símbolos para loop contínuo suave
   */
  private createSymbols(): void {
    const symbolHeight = this.reelConfig.symbolHeight;
    const baseSymbols = this.reelConfig.symbols.length;

    // ✅ Cria múltiplas cópias para loop MUITO contínuo
    const loopCount = 20; // 20 repetições = loop MUITO suave
    this.totalSymbols = baseSymbols * loopCount;

    console.log(`🎯 Criando ${this.totalSymbols} símbolos (${loopCount}x repetição)`);

    for (let i = 0; i < this.totalSymbols; i++) {
      const symbol = this.reelConfig.symbols[i % baseSymbols];
      const reelSymbol = new ReelSymbol(symbol, symbolHeight);

      // ✅ Posiciona sequencialmente
      reelSymbol.y = i * symbolHeight;

      this.contentContainer.addChild(reelSymbol);
      this.symbols.push(reelSymbol);
    }

    console.log(`🎯 Total de símbolos criados: ${this.symbols.length}`);
  }

  /**
   * Obtém o container de conteúdo (para animação)
   */
  public getContentContainer(): Container {
    return this.contentContainer;
  }

  /**
   * Obtém um símbolo por índice
   */
  public getSymbol(index: number): ReelSymbol {
    return this.symbols[index];
  }

  /**
   * Obtém todos os símbolos
   */
  public getSymbols(): ReelSymbol[] {
    return this.symbols;
  }

  /**
   * Obtém a altura total visível
   */
  public getVisibleHeight(): number {
    return this.reelConfig.symbolHeight * this.reelConfig.visibleSymbols;
  }

  /**
   * Obtém a altura de um símbolo
   */
  public getSymbolHeight(): number {
    return this.reelConfig.symbolHeight;
  }

  /**
   * Obtém a configuração do reel
   */
  public getConfig(): ReelConfig {
    return this.reelConfig;
  }

  /**
   * Obtém o total de símbolos (para cálculos de loop)
   */
  public getTotalSymbols(): number {
    return this.totalSymbols;
  }

  /**
   * Obtém o número de símbolos base (sem repetição)
   */
  public getBaseSymbolCount(): number {
    return this.reelConfig.symbols.length;
  }

  /**
   * Limpeza
   */
  public destroy(options?: boolean | object): void {
    this.symbols.forEach((symbol) => symbol.destroy());
    this.symbols = [];
    this.contentContainer.destroy({ children: true });
    this.maskGraphics.destroy();
    super.destroy(options);
  }
}