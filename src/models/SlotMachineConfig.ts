// src/models/SlotMachineConfig.ts

import type { SlotMachineConfig, ReelConfig } from './types';
import { ReelConfigFactory } from './ReelConfig';
import { DEFAULT_CONFIG } from '../utils/constants';  // ✅ ADICIONAR IMPORT

export class SlotMachineConfigFactory {
  static create(
    reelCount: number,
    reels: ReelConfig[],
    spinDuration: number,
    accelerationDuration: number,
    decelerationDuration: number,
    maxVelocity: number
  ): SlotMachineConfig {
    if (reelCount < 1) {
      throw new Error('SlotMachineConfig: reelCount must be >= 1');
    }

    if (reels.length !== reelCount) {
      throw new Error(
        `SlotMachineConfig: reels.length (${reels.length}) must match reelCount (${reelCount})`
      );
    }

    const totalDuration = accelerationDuration + decelerationDuration;
    if (spinDuration <= totalDuration) {
      throw new Error(
        `SlotMachineConfig: spinDuration (${spinDuration}s) must be > accelerationDuration (${accelerationDuration}s) + decelerationDuration (${decelerationDuration}s) = ${totalDuration}s`
      );
    }

    if (maxVelocity <= 0) {
      throw new Error('SlotMachineConfig: maxVelocity must be > 0');
    }

    return {
      reelCount,
      reels,
      spinDuration,
      accelerationDuration,
      decelerationDuration,
      maxVelocity,
    };
  }

  /**
   * Cria uma configuração padrão usando DEFAULT_CONFIG
   * ✅ DATA-DRIVEN: Modifique em constants.ts para alterar o comportamento
   */
  static createDefault(): SlotMachineConfig {
    const reels = Array(DEFAULT_CONFIG.REEL_COUNT)
      .fill(null)
      .map(() => ReelConfigFactory.createDefault());

    return this.create(
      DEFAULT_CONFIG.REEL_COUNT,
      reels,
      DEFAULT_CONFIG.SPIN_DURATION,
      DEFAULT_CONFIG.ACCELERATION_DURATION,
      DEFAULT_CONFIG.DECELERATION_DURATION,
      DEFAULT_CONFIG.MAX_VELOCITY
    );
  }
}