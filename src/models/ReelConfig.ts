// src/models/ReelConfig.ts

import type { ReelConfig, Symbol } from './types';
import { DEFAULT_CONFIG } from '../utils/constants';  // ✅ ADICIONAR IMPORT

/**
 * Factory para criar uma ReelConfig com validação
 */
export class ReelConfigFactory {
  static create(
    symbols: Symbol[],
    symbolHeight: number,
    visibleSymbols: number
  ): ReelConfig {
    if (symbols.length === 0) {
      throw new Error('ReelConfig: symbols array cannot be empty');
    }
    if (symbolHeight <= 0) {
      throw new Error('ReelConfig: symbolHeight must be > 0');
    }
    if (visibleSymbols <= 0 || visibleSymbols > symbols.length) {
      throw new Error(
        `ReelConfig: visibleSymbols must be between 1 and ${symbols.length}`
      );
    }

    return {
      symbols,
      symbolHeight,
      visibleSymbols,
    };
  }

  /**
   * Cria uma configuração padrão usando DEFAULT_CONFIG
   * ✅ DATA-DRIVEN: Modifique em constants.ts
   */
  static createDefault(): ReelConfig {
    return this.create(
      DEFAULT_CONFIG.SYMBOLS,         // ✅ ALTERADO: De DEFAULT_CONFIG
      DEFAULT_CONFIG.SYMBOL_HEIGHT,   // ✅ ALTERADO: De DEFAULT_CONFIG
      DEFAULT_CONFIG.VISIBLE_SYMBOLS  // ✅ ALTERADO: De DEFAULT_CONFIG
    );
  }
}