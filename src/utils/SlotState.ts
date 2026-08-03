// src/states/SlotState.ts

import { SlotStateType } from "../models/types";


/**
 * Representa o estado atual da máquina
 */
export class SlotState {
  private current: SlotStateType = SlotStateType.IDLE;

  /**
   * Obtém o estado atual
   */
  get value(): SlotStateType {
    return this.current;
  }

  /**
   * Verifica se está em um estado específico
   */
  is(state: SlotStateType): boolean {
    return this.current === state;
  }

  /**
   * Tenta transicionar para um novo estado
   * Retorna true se bem-sucedida, false se inválida
   */
  transition(nextState: SlotStateType): boolean {
    // Define as transições válidas
    const validTransitions: Record<SlotStateType, SlotStateType[]> = {
      [SlotStateType.IDLE]: [SlotStateType.SPINNING],
      [SlotStateType.SPINNING]: [SlotStateType.SETTLING],
      [SlotStateType.SETTLING]: [SlotStateType.RESULT],
      [SlotStateType.RESULT]: [SlotStateType.IDLE],
    };

    const allowed = validTransitions[this.current];
    if (allowed.includes(nextState)) {
      this.current = nextState;
      return true;
    }

    return false;
  }

  /**
   * Força um estado (use com cuidado, apenas para reset)
   */
  reset(): void {
    this.current = SlotStateType.IDLE;
  }
}