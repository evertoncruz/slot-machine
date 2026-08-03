// src/states/StateMachine.ts

import { SlotStateType } from '../models/types';
import { SlotState } from './SlotState';

/**
 * Callback disparado ao entrar em um estado
 */
export type StateCallback = (state: SlotStateType) => void;

/**
 * Máquina de estados com observadores
 */
export class StateMachine {
  private state: SlotState;
  private callbacks: Map<SlotStateType, StateCallback[]> = new Map();

  constructor() {
    this.state = new SlotState();
    // Inicializa listeners vazios para cada estado
    Object.values(SlotStateType).forEach((stateType) => {
      this.callbacks.set(stateType, []);
    });
  }

  /**
   * Obtém o estado atual
   */
  getCurrent(): SlotStateType {
    return this.state.value;
  }

  /**
   * Verifica se está em um estado
   */
  is(state: SlotStateType): boolean {
    return this.state.is(state);
  }

  /**
   * Registra um callback para quando entrar em um estado
   */
  on(state: SlotStateType, callback: StateCallback): void {
    const listeners = this.callbacks.get(state);
    if (listeners) {
      listeners.push(callback);
    }
  }

  /**
   * Remove um callback
   */
  off(state: SlotStateType, callback: StateCallback): void {
    const listeners = this.callbacks.get(state);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Tenta transicionar e dispara callbacks
   */
  transition(nextState: SlotStateType): boolean {
    const success = this.state.transition(nextState);
    if (success) {
      this.dispatch(nextState);
    }
    return success;
  }

  /**
   * Dispara todos os callbacks para um estado
   */
  private dispatch(state: SlotStateType): void {
    const listeners = this.callbacks.get(state);
    if (listeners) {
      listeners.forEach((callback) => callback(state));
    }
  }

  /**
   * Reset (volta para IDLE)
   */
  reset(): void {
    this.state.reset();
    this.dispatch(SlotStateType.IDLE);
  }
}