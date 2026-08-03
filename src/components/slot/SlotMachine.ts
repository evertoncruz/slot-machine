// src/components/slot/SlotMachine.ts

import { BaseComponent } from '../BaseComponent';
import { Reel } from '../reel/Reel';
import { ReelAnimator } from '../reel/ReelAnimator';
import { WinLine } from './WinLine';  // ✅ ADICIONAR IMPORT
import { DEFAULT_CONFIG } from '../../utils/constants';
import type { SlotMachineConfig, SpinResult } from '../../models/types';

export type SlotMachineResultCallback = (result: SpinResult) => void;

/**
 * SlotMachine — orquestrador de rolos com animações
 * ✅ Inclui WinLine (linha de resultado)
 */
export class SlotMachine extends BaseComponent {
  private config: SlotMachineConfig;
  private reels: Reel[] = [];
  private animators: ReelAnimator[] = [];
  private winLine: WinLine | null = null;  // ✅ ADICIONAR
  private onResult: SlotMachineResultCallback | null = null;
  private isSpinning: boolean = false;
  private containerWidth: number = 0;
  private containerHeight: number = 0;

  constructor(
    config: SlotMachineConfig,
    containerWidth: number = DEFAULT_CONFIG.CONTAINER_WIDTH,
    containerHeight: number = DEFAULT_CONFIG.CONTAINER_HEIGHT
  ) {
    super();
    this.config = config;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.initialize();
  }

  protected initialize(): void {
    console.log('🎰 SlotMachine.initialize() chamado');
    this.createReels();
    this.createWinLine();  // ✅ ADICIONAR
    this.centerReels();
  }

  private createReels(): void {
    console.log('🎰 Iniciando createReels()');

    let xPosition = 0;

    for (let i = 0; i < this.config.reelCount; i++) {
      const reelConfig = this.config.reels[i];

      console.log(`🎰 Criando Reel ${i} com config:`, reelConfig);

      const reel = new Reel(reelConfig, i);
      const animator = new ReelAnimator(reel);

      reel.x = xPosition;
      reel.y = 0;

      this.addChild(reel);
      this.reels.push(reel);
      this.animators.push(animator);

      console.log(`✅ Reel ${i} criado em x=${xPosition}, y=0`);

      const reelWidth = 80;
      const spacing = DEFAULT_CONFIG.REEL_SPACING;
      xPosition += reelWidth + spacing;
    }

    console.log('✅ SlotMachine: todos os rolos criados', {
      reelCount: this.reels.length,
      totalWidth: xPosition,
    });
  }

  /**
   * ✅ NOVO: Cria a WinLine (linha de resultado)
   */
  private createWinLine(): void {
    const reelWidth = 80;
    const spacing = DEFAULT_CONFIG.REEL_SPACING;
    const totalReelsWidth = this.config.reelCount * reelWidth + 
                            (this.config.reelCount - 1) * spacing;

    // ✅ WinLine tem a mesma largura dos rolos
    this.winLine = new WinLine(
      totalReelsWidth,  // Largura = largura total dos rolos
      4,                // Altura = 4px
      0xffff00,         // Cor = Amarelo
      0.8               // Alpha = 80%
    );

    // ✅ Posiciona no MEIO dos rolos (altura do símbolo do meio)
    const symbolHeight = this.config.reels[0].symbolHeight;
    const visibleSymbols = this.config.reels[0].visibleSymbols;
    const middleIndex = Math.floor(visibleSymbols / 2);
    const winLineY = middleIndex * symbolHeight + symbolHeight / 2;

    this.winLine.y = winLineY;
    this.addChild(this.winLine);

    console.log('📍 WinLine criada:', {
      width: totalReelsWidth,
      y: winLineY,
      middleIndex,
      symbolHeight,
      visibleSymbols,
    });
  }

  /**
   * ✅ CENTRALIZA os rolos dentro do container
   */
  private centerReels(): void {
    const reelWidth = 80;
    const spacing = DEFAULT_CONFIG.REEL_SPACING;

    const totalReelsWidth = this.config.reelCount * reelWidth +
                            (this.config.reelCount - 1) * spacing;

    const symbolHeight = this.config.reels[0].symbolHeight;
    const visibleSymbols = this.config.reels[0].visibleSymbols;
    const totalReelsHeight = symbolHeight * visibleSymbols;

    const offsetX = (this.containerWidth - totalReelsWidth) / 2;
    this.x = offsetX;

    const offsetY = (this.containerHeight - totalReelsHeight) / 2;
    this.y = offsetY;

    console.log('🎯 SlotMachine CENTRALIZADO:', {
      containerWidth: this.containerWidth,
      containerHeight: this.containerHeight,
      totalReelsWidth,
      totalReelsHeight,
      offsetX,
      offsetY,
      position: { x: this.x, y: this.y },
    });
  }

  public getReel(index: number): Reel {
    if (index < 0 || index >= this.reels.length) {
      throw new Error(`SlotMachine: reel index ${index} fora do intervalo`);
    }
    return this.reels[index];
  }

  public getReels(): Reel[] {
    return this.reels;
  }

  public getCurrentResult(): SpinResult {
    const symbols = this.reels.map((reel) => reel.getMiddleSymbol());
    return { symbols };
  }

  public setOnResult(callback: SlotMachineResultCallback): void {
    this.onResult = callback;
  }

  private dispatchResult(result: SpinResult): void {
    if (this.onResult) {
      this.onResult(result);
    }
  }

  public async spin(targetResult: SpinResult): Promise<void> {
    if (this.isSpinning) {
      console.warn('🎰 Já está girando!');
      return;
    }

    this.isSpinning = true;

    console.log('🎬 SlotMachine.spin() iniciando com resultado:', targetResult);

    const baseDuration = DEFAULT_CONFIG.SPIN_DURATION;
    const delayBetweenReels = 0.1;

    const spinPromises = this.reels.map((reel, index) => {
      const animator = this.animators[index];
      const targetSymbol = targetResult.symbols[index];
      const delay = index * delayBetweenReels;
      const duration = baseDuration + index * 0.2;

      return animator.spin(targetSymbol, duration, delay);
    });

    await Promise.all(spinPromises);

    console.log('🎬 Todas as animações de spin terminaram');

    const stopDelayBetweenReels = DEFAULT_CONFIG.STOP_DELAY_BETWEEN_REELS;
    const stopDuration = DEFAULT_CONFIG.STOP_DURATION;

    for (let i = 0; i < this.reels.length; i++) {
      const animator = this.animators[i];
      const delay = i * stopDelayBetweenReels;

      await new Promise((resolve) => setTimeout(resolve, delay * 1000));

      console.log(`🎬 Parando reel ${i} com animação suave`);

      await animator.stopWithAnimation(stopDuration);
    }

    console.log('🎬 Todos os rolos pararam sequencialmente');

    const finalResult = this.getCurrentResult();
    this.dispatchResult(finalResult);

    this.isSpinning = false;
  }

  public isSpinningNow(): boolean {
    return this.isSpinning;
  }

  public stopSpin(): void {
    this.animators.forEach((animator) => animator.stop());
    this.isSpinning = false;
  }

  public resetReels(): void {
    this.animators.forEach((animator) => animator.reset());
  }

  protected cleanup(): void {
    this.animators.forEach((animator) => animator.reset());
    this.reels.forEach((reel) => reel.destroy());
    this.reels = [];
    this.animators = [];
    if (this.winLine) {
      this.winLine.destroy();
      this.winLine = null;
    }
    this.onResult = null;
  }
}