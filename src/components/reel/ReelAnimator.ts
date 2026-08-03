// src/components/reel/ReelAnimator.ts

import gsap from 'gsap';
import { Reel } from './Reel';
import type { Symbol } from '../../models/types';

export type AnimationCompleteCallback = (symbol: Symbol) => void;

/**
 * Gerencia animação de um reel com loop infinito
 */
export class ReelAnimator {
  private reel: Reel;
  private isAnimating: boolean = false;
  private timeline: gsap.core.Timeline | null = null;

  constructor(reel: Reel) {
    this.reel = reel;
  }

  /**
   * Anima o reel até parar no símbolo alvo
   */
  public async spin(
    targetSymbol: Symbol,
    duration: number = 2,
    delay: number = 0,
    onComplete?: AnimationCompleteCallback
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.isAnimating) {
        console.warn('Reel já está animando');
        resolve();
        return;
      }

      this.isAnimating = true;

      const container = this.reel.getContainer();
      const reelContainer = this.reel.getReelContainer();
      const symbolHeight = this.reel.getConfig().symbolHeight;
      const symbols = this.reel.getConfig().symbols;
      const totalSymbols = reelContainer.getTotalSymbols();
      const baseSymbolCount = reelContainer.getBaseSymbolCount();
      const visibleSymbols = this.reel.getConfig().visibleSymbols;

      // ✅ Reset para y=0 antes de animar
      gsap.set(container, { y: 0 });

      // Encontra o índice do símbolo alvo
      const targetIndex = symbols.indexOf(targetSymbol);
      if (targetIndex === -1) {
        console.error(`Símbolo ${targetSymbol} não encontrado`);
        this.isAnimating = false;
        resolve();
        return;
      }

      // ✅ Cálculo com LOOP INFINITO:
      // - Usa TODOS os símbolos para rotação suave
      // - Depois posiciona o símbolo no MEIO da tela
      const rotationDistance = totalSymbols * symbolHeight;

      // ✅ IMPORTANTE: Posição do símbolo no MEIO
      // Se visibleSymbols = 3, o meio é o índice 1 (segundo símbolo)
      // Precisamos que o símbolo alvo fique nessa posição
      const middleIndex = Math.floor(visibleSymbols / 2);

      // ✅ Offset para colocar o símbolo no meio
      // Se targetIndex = 0, offset = -0 (primeira posição)
      // Se targetIndex = 1, offset = -80 (segunda posição = meio)
      // Se targetIndex = 2, offset = -160 (terceira posição)
      const offsetFromMiddle = (targetIndex - middleIndex) * symbolHeight;

      // ✅ Posição final: rotação + offset para o meio
      const finalY = -(rotationDistance + offsetFromMiddle);

      console.log(`🎬 Animando reel com LOOP INFINITO:`, {
        targetSymbol,
        targetIndex,
        middleIndex,
        offsetFromMiddle,
        duration,
        delay,
        totalSymbols,
        baseSymbolCount,
        visibleSymbols,
        rotationDistance,
        finalY,
        symbolHeight,
      });

      // Cria timeline GSAP
      this.timeline = gsap.timeline({
        delay,
        onComplete: () => {
          this.isAnimating = false;

          // ✅ Reset inteligente
          // Calcula a posição equivalente dentro do primeiro ciclo
          const cycleLength = baseSymbolCount * symbolHeight;
          const resetY = finalY % cycleLength;

          // Move para a posição equivalente (sem animação)
          gsap.set(container, { y: resetY });

          console.log(`✅ Reel parou em: ${targetSymbol} (finalY=${finalY}, resetY=${resetY})`);
          if (onComplete) {
            onComplete(targetSymbol);
          }
          resolve();
        },
      });

      // Fase 1: Aceleração (0-30% do tempo)
      const accelerationDuration = duration * 0.3;
      const accelerationDistance = rotationDistance * 0.3;

      this.timeline.to(
        container,
        {
          y: -accelerationDistance,
          duration: accelerationDuration,
          ease: 'power1.in',
        },
        0
      );

      // Fase 2: Velocidade constante (30-70% do tempo)
      const constantDuration = duration * 0.4;
      const constantDistance = rotationDistance * 0.4;

      this.timeline.to(
        container,
        {
          y: -(accelerationDistance + constantDistance),
          duration: constantDuration,
          ease: 'none',
        }
      );

      // Fase 3: Desaceleração + parada exata (70-100% do tempo)
      const decelerationDuration = duration * 0.3;

      this.timeline.to(
        container,
        {
          y: finalY,
          duration: decelerationDuration,
          ease: 'power2.out',
        }
      );
    });
  }

  /**
   * Para a animação imediatamente
   */
  public stop(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    this.isAnimating = false;
  }

  /**
   * Verifica se está animando
   */
  public isAnimatingNow(): boolean {
    return this.isAnimating;
  }

/**
 * Para o reel com animação suave (desaceleração gradual)
 * ✅ Cria efeito de "amortecimento" ao parar
 */
public async stopWithAnimation(duration: number = 0.8): Promise<void> {
  return new Promise((resolve) => {
    const container = this.reel.getContainer();
    const currentY = container.y;

    console.log(`🎬 Parando reel com animação suave:`, {
      currentY,
      duration,
      ease: 'cubic.out',
    });

    // ✅ Anima com easing suave para efeito de parada natural
    // cubic.out = desaceleração suave e natural
    gsap.to(container, {
      y: currentY,
      duration,
      ease: 'cubic.out', // Desaceleração suave
      onComplete: () => {
        console.log(`✅ Reel parou suavemente em y=${currentY}`);
        resolve();
      },
    });
  });
}

  /**
   * Reset (volta para posição inicial)
   */
  public reset(): void {
    this.stop();
    const container = this.reel.getContainer();
    gsap.set(container, { y: 0 });
  }
}