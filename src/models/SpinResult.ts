// src/models/SpinResult.ts

import type { SpinResult, Symbol, ReelConfig } from './types';

/**
 * Factory para criar um SpinResult com validação
 */
export class SpinResultFactory {
  /**
   * Cria um resultado validando que cada símbolo existe na config correspondente
   */
  static create(symbols: Symbol[], reelConfigs: ReelConfig[]): SpinResult {
    if (symbols.length !== reelConfigs.length) {
      throw new Error(
        `SpinResult: symbols count (${symbols.length}) must match reels count (${reelConfigs.length})`
      );
    }

    // Valida que cada símbolo existe na config do rolo correspondente
    symbols.forEach((symbol, index) => {
      if (!reelConfigs[index].symbols.includes(symbol)) {
        throw new Error(
          `SpinResult: symbol "${symbol}" not found in reel ${index}`
        );
      }
    });

    return { symbols };
  }

  /**
   * Cria um resultado aleatório para testes
   */
  static createRandom(reelConfigs: ReelConfig[]): SpinResult {
    const symbols = reelConfigs.map((config) => {
      const randomIndex = Math.floor(Math.random() * config.symbols.length);
      return config.symbols[randomIndex];
    });
    return this.create(symbols, reelConfigs);
  }
}