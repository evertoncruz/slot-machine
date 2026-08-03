// src/index.ts

// Exporta todos os tipos e factories
export * from './models';
export { SlotState } from './utils/SlotState';
export { StateMachine } from './utils/StateMachine';
export type { StateCallback } from './utils/StateMachine';
export { DEFAULT_CONFIG, SYMBOL_COLORS } from './utils/constants';
export * from './utils/helpes';

// Componentes (serão implementados depois)
// export { Popup } from './components/popup/Popup';
// export { SlotMachine } from './components/slot/SlotMachine';