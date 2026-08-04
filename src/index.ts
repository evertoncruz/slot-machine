// src/index.ts

// Exporta todos os tipos e factories
export * from './models';
export { SlotState } from './states/SlotState';
export { StateMachine } from './states/StateMachine';
export type { StateCallback } from './states/StateMachine';
export { DEFAULT_CONFIG, SYMBOL_COLORS } from './utils/constants';
export * from './utils/helpes';

// Componentes (serão implementados depois)
// export { Popup } from './components/popup/Popup';
// export { SlotMachine } from './components/slot/SlotMachine';
