// src/models/types.ts

/**
 * Um símbolo individual (ex: maçã, cereja, etc.)
 * Pode ser um número (ID) ou string (nome)
 */
export type Symbol = string | number;

/**
 * Configuração de um rolo individual
 */
export interface ReelConfig {
  /** Símbolos disponíveis neste rolo */
  symbols: Symbol[];
  /** Altura de cada símbolo em pixels */
  symbolHeight: number;
  /** Número de símbolos visíveis simultaneamente */
  visibleSymbols: number;
}

/**
 * Configuração completa do slot machine
 */
export interface SlotMachineConfig {
  /** Número de rolos */
  reelCount: number;
  /** Configuração de cada rolo */
  reels: ReelConfig[];
  /** Duração total do spin em segundos */
  spinDuration: number;
  /** Duração da aceleração em segundos */
  accelerationDuration: number;
  /** Duração da desaceleração em segundos */
  decelerationDuration: number;
  /** Velocidade máxima em pixels/segundo */
  maxVelocity: number;
}

/**
 * Resultado de um spin: qual símbolo parou em cada rolo
 */
export interface SpinResult {
  /** Símbolos finais, um por rolo */
  symbols: Symbol[];
  /** Posição Y final de cada rolo (opcional, calculada internamente) */
  positions?: number[];
}

/**
 * Estados possíveis da máquina
 */
export enum SlotStateType {
  IDLE = 'idle',
  SPINNING = 'spinning',
  SETTLING = 'settling',
  RESULT = 'result',
}

/**
 * Evento disparado ao final do spin
 */
export interface SpinCompleteEvent {
  result: SpinResult;
  timestamp: number;
}