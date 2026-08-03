// src/utils/constants.ts

/**
 * Configurações padrão da aplicação
 * ✅ DATA-DRIVEN: Modifique aqui para alterar o comportamento
 */
export const DEFAULT_CONFIG = {
  // ============================================
  // CONFIGURAÇÃO DE ROLOS
  // ============================================
  REEL_COUNT: 3,
  SYMBOLS: ['🍎', '🍒', '🍋', '🍊', '🍓', '🍌', '🍉', '⭐', '💎', '👑'],
  SYMBOL_HEIGHT: 80,
  VISIBLE_SYMBOLS: 3, 

  // ============================================
  // CONFIGURAÇÃO DE ANIMAÇÃO (SPIN)
  // ============================================
  SPIN_DURATION: 3,
  ACCELERATION_DURATION: 0.5,
  DECELERATION_DURATION: 1,
  MAX_VELOCITY: 800,

  // ============================================
  // CONFIGURAÇÃO DE PARADA SEQUENCIAL (STOP)
  // ============================================
  TRANSITION_DELAY: 300,
  STOP_DELAY_BETWEEN_REELS: 0.3,
  STOP_DURATION: 0.5,

  // ============================================
  // CONFIGURAÇÃO DE LAYOUT
  // ============================================
  // ✅ DINÂMICO: Largura = (rolo × 80) + (espaço × (rolos - 1)) + margem
  get CONTAINER_WIDTH(): number {
    const reelWidth = 80;
    const spacing = 30;
    const totalWidth = this.REEL_COUNT * reelWidth + (this.REEL_COUNT - 1) * spacing;
    return totalWidth + 100; // +100 para margem
  },

  // ✅ DINÂMICO: Altura = (símbolo × visível) + margem
  get CONTAINER_HEIGHT(): number {
    const contentHeight = this.SYMBOL_HEIGHT * this.VISIBLE_SYMBOLS;
    const margin = 50;
    return contentHeight + margin;
  },

  REEL_SPACING: 30,

  // ============================================
  // CONFIGURAÇÃO VISUAL (UI)
  // ============================================
  // ✅ DINÂMICO: Largura = (rolo × 80) + (espaço × (rolos - 1)) + margem
  // ✅ COM MÍNIMO DE 600px
  get POPUP_WIDTH(): number {
    const reelWidth = 80;
    const spacing = 30;
    const totalWidth = this.REEL_COUNT * reelWidth + (this.REEL_COUNT - 1) * spacing;
    const calculatedWidth = totalWidth + 150; // +150 para margem
    const minWidth = 600; // ✅ Mínimo de 600px
    return Math.max(calculatedWidth, minWidth);
  },

  // ✅ DINÂMICO: Altura baseada em VISIBLE_SYMBOLS
  get POPUP_HEIGHT(): number {
    const contentHeight = this.SYMBOL_HEIGHT * this.VISIBLE_SYMBOLS;
    const margin = 50;
    const minHeight = 400;
    return Math.max(contentHeight + margin, minHeight);
  },

  OVERLAY_ALPHA: 0.5,
  OVERLAY_COLOR: 0x000000,
};

/**
 * Cores para símbolos
 */
export const SYMBOL_COLORS: Record<string, number> = {
  '🍎': 0xff0000,  // Vermelho
  '🍒': 0xff0066,  // Rosa
  '🍋': 0xffff00,  // Amarelo
  '🍊': 0xff9900,  // Laranja
  '🍓': 0xff3366,  // Vermelho escuro
  '🍌': 0xffdd00,  // Amarelo claro
  '🍉': 0x00cc00,  // Verde
  '⭐': 0xffff00,  // Amarelo (star)
  '💎': 0x00ffff,  // Ciano (diamond)
  '👑': 0xffdd00,  // Amarelo (crown)
};