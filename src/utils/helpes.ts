// src/utils/helpers.ts

import type { Symbol as SlotSymbol, ReelConfig } from '../models';

/**
 * Encontra o índice de um símbolo em um rolo
 */
export function findSymbolIndex(
  symbol: SlotSymbol,
  reelConfig: ReelConfig
): number {
  return reelConfig.symbols.indexOf(symbol);
}

/**
 * Calcula a posição Y final para um símbolo em um rolo
 * (útil para saber onde parar a animação)
 */
export function calculateSymbolPosition(
  symbolIndex: number,
  symbolHeight: number
): number {
  return symbolIndex * symbolHeight;
}

/**
 * Calcula quantos pixels o rolo precisa se mover
 * para parar em um símbolo específico
 */
export function calculateReelDistance(
  currentPosition: number,
  targetSymbolIndex: number,
  symbolHeight: number
): number {
  const targetPosition = calculateSymbolPosition(
    targetSymbolIndex,
    symbolHeight
  );
  // Se currentPosition > targetPosition, precisa dar uma volta
  if (currentPosition > targetPosition) {
    const totalSymbols = Math.ceil(currentPosition / symbolHeight) + 1;
    return totalSymbols * symbolHeight - currentPosition + targetPosition;
  }
  return targetPosition - currentPosition;
}

/**
 * Easing: aceleração (ease-in)
 */
export function easeIn(t: number): number {
  return t * t;
}

/**
 * Easing: desaceleração (ease-out)
 */
export function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}