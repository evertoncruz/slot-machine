// src/core/Game.ts

import { Application } from 'pixi.js';
import { Popup } from '../components/popup/Popup';
import { SlotMachine } from '../components/slot/SlotMachine';
import { SpinButton } from '../components/button/SpinButton';
import { StateMachine } from '../states/StateMachine';
import { ReelConfigFactory } from '../models/ReelConfig';
import { SlotMachineConfigFactory } from '../models/SlotMachineConfig';
import { SlotStateType, type SlotMachineConfig, type SpinResult } from '../models/types';
import { DEFAULT_CONFIG } from '../utils/constants';
import type { PanelConfig, SpinButtonConfig } from '../components';

/**
 * Game — Orquestrador principal do jogo
 * ✅ Responsabilidade ÚNICA: Orquestrar componentes
 * ✅ NÃO é um service (não tem lógica de negócio)
 * ✅ NÃO é um component (não renderiza)
 */
export class Game {
  private app: Application;
  private popup: Popup | null = null;
  private slotMachine: SlotMachine | null = null;
  private spinButton: SpinButton | null = null;
  private stateMachine: StateMachine | null = null;

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Inicializa o jogo
   */
  async start(): Promise<void> {
    console.log('🎮 Game iniciando...');

    this.setupPopup();
    this.setupSlotMachine();
    this.setupSpinButton();
    this.setupStateMachine();
    this.connectEventListeners();

    console.log('✅ Game iniciado com sucesso!');
  }

  /**
   * Setup do popup
   */
  private setupPopup(): void {
    console.log('📊 Setup Popup...');

    this.popup = new Popup(this.app.canvas.width, this.app.canvas.height);
    this.app.stage.addChild(this.popup);

    const panelConfig: PanelConfig = {
      width: DEFAULT_CONFIG.POPUP_WIDTH,
      height: DEFAULT_CONFIG.POPUP_HEIGHT,
      backgroundColor: 0xdaa520,
      borderColor: 0x8b4513,
      borderWidth: 3,
      cornerRadius: 10,
    };

    this.popup.addPanel(panelConfig);
  }

  /**
   * Setup do slot machine
   */
  private setupSlotMachine(): void {
    console.log('🎰 Setup SlotMachine...');

    const reels = Array(DEFAULT_CONFIG.REEL_COUNT)
      .fill(null)
      .map(() => ReelConfigFactory.createDefault());

    const slotMachineConfig: SlotMachineConfig = SlotMachineConfigFactory.create(
      DEFAULT_CONFIG.REEL_COUNT,
      reels,
      DEFAULT_CONFIG.SPIN_DURATION,
      DEFAULT_CONFIG.ACCELERATION_DURATION,
      DEFAULT_CONFIG.DECELERATION_DURATION,
      DEFAULT_CONFIG.MAX_VELOCITY
    );

    this.slotMachine = new SlotMachine(
      slotMachineConfig,
      DEFAULT_CONFIG.POPUP_WIDTH,
      DEFAULT_CONFIG.POPUP_HEIGHT
    );

    const panelContent = this.popup!.addPanel({
      width: DEFAULT_CONFIG.POPUP_WIDTH,
      height: DEFAULT_CONFIG.POPUP_HEIGHT,
      backgroundColor: 0xdaa520,
      borderColor: 0x8b4513,
      borderWidth: 3,
      cornerRadius: 10,
    });

    panelContent.addChild(this.slotMachine);
  }

  /**
   * Setup do botão spin
   */
  private setupSpinButton(): void {
    console.log('🔘 Setup SpinButton...');

    const spinButtonConfig: SpinButtonConfig = {
      width: 120,
      height: 50,
      backgroundColor: 0x00aa00,
      borderColor: 0x006600,
      borderWidth: 2,
      fontSize: 18,
      textColor: 0xffffff,
      hoverColor: 0x00dd00,
      label: 'GIRAR',
    };

    this.spinButton = new SpinButton(spinButtonConfig);
    this.spinButton.x = (DEFAULT_CONFIG.POPUP_WIDTH - spinButtonConfig.width) / 2;
    this.spinButton.y = DEFAULT_CONFIG.POPUP_HEIGHT - 80;

    const panelContent = this.popup!.addPanel({
      width: DEFAULT_CONFIG.POPUP_WIDTH,
      height: DEFAULT_CONFIG.POPUP_HEIGHT,
      backgroundColor: 0xdaa520,
      borderColor: 0x8b4513,
      borderWidth: 3,
      cornerRadius: 10,
    });

    panelContent.addChild(this.spinButton);
  }

  /**
   * Setup da state machine
   */
  private setupStateMachine(): void {
    console.log('🔄 Setup StateMachine...');
    this.stateMachine = new StateMachine();
  }

  /**
   * Conecta event listeners
   */
  private connectEventListeners(): void {
    console.log('🎧 Conectando event listeners...');

    // State machine listeners
    this.stateMachine!.on(SlotStateType.SPINNING, () => {
      console.log('🎬 Estado: SPINNING');
      this.spinButton!.setEnabled(false);
    });

    this.stateMachine!.on(SlotStateType.SETTLING, () => {
      console.log('🎬 Estado: SETTLING');
    });

    this.stateMachine!.on(SlotStateType.RESULT, () => {
      console.log('🎬 Estado: RESULT');
    });

    this.stateMachine!.on(SlotStateType.IDLE, () => {
      console.log('🎬 Estado: IDLE');
      this.spinButton!.setEnabled(true);
    });

    // Spin button listener
    this.spinButton!.setOnClick(async () => {
      await this.handleSpin();
    });

    // Slot machine result listener
    this.slotMachine!.setOnResult((result) => {
      console.log('🎉 Resultado final:', result);
    });
  }

  /**
   * Manipula o spin
   */
  private async handleSpin(): Promise<void> {
    if (!this.stateMachine!.is(SlotStateType.IDLE)) {
      console.warn('⚠️ Não pode girar agora');
      return;
    }

    this.stateMachine!.transition(SlotStateType.SPINNING);

    const targetResult: SpinResult = {
      symbols: this.slotMachine!.getReels().map((reel) => {
        const randomIndex = Math.floor(Math.random() * reel.getConfig().symbols.length);
        return reel.getConfig().symbols[randomIndex];
      }),
    };

    console.log('🎲 Resultado alvo:', targetResult);

    await this.slotMachine!.spin(targetResult);

    this.stateMachine!.transition(SlotStateType.SETTLING);
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.stateMachine!.transition(SlotStateType.RESULT);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.stateMachine!.transition(SlotStateType.IDLE);
  }
}
