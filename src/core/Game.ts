// src/core/Game.ts

import { Application } from 'pixi.js';
import { Popup, SlotMachine, SpinButton, type PanelConfig, type SpinButtonConfig } from '../components';
import { StateMachine } from '../states';
import { ReelConfigFactory, SlotMachineConfigFactory, SlotStateType, type SlotMachineConfig, type SpinResult } from '../models';
import { Logger, DEFAULT_CONFIG } from '../utils';  // ✅ NOVO: Import

/**
 * Game — Orquestrador principal do jogo
 */
export class Game {
  private app: Application;
  private popup: Popup | null = null;
  private slotMachine: SlotMachine | null = null;
  private spinButton: SpinButton | null = null;
  private stateMachine: StateMachine | null = null;
  private panelContent: any | null = null;
  private logger = Logger.createModuleLogger('Game');  // ✅ NOVO: Logger

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Inicializa o jogo
   */
  async start(): Promise<void> {
    this.logger.info('🎮 Game iniciando...');  // ✅ NOVO: Logger

    this.setupPopup();
    this.setupSlotMachine();
    this.setupSpinButton();
    this.setupStateMachine();
    this.connectEventListeners();

    this.logger.info('✅ Game iniciado com sucesso!');  // ✅ NOVO: Logger
  }

  /**
   * Setup do popup e painel
   */
  private setupPopup(): void {
    this.logger.info('📊 Setup Popup...');  // ✅ NOVO: Logger

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

    this.logger.debug('Panel Config:', {  // ✅ NOVO: Logger com dados
      width: panelConfig.width,
      height: panelConfig.height,
      reel_count: DEFAULT_CONFIG.REEL_COUNT,
    });

    this.panelContent = this.popup.addPanel(panelConfig);

    this.logger.info('✅ Popup.addPanel() chamado');  // ✅ NOVO: Logger
  }

  /**
   * Setup do slot machine
   */
  private setupSlotMachine(): void {
    this.logger.info('🎰 Setup SlotMachine...');  // ✅ NOVO: Logger

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

    this.panelContent.addChild(this.slotMachine);

    this.logger.info('✅ SlotMachine criada e adicionada ao painel');  // ✅ NOVO: Logger
  }

  /**
   * Setup do botão spin
   */
  private setupSpinButton(): void {
    this.logger.info('🔘 Setup SpinButton...');  // ✅ NOVO: Logger

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

    this.panelContent.addChild(this.spinButton);

    this.logger.info('✅ SpinButton criado e adicionado ao painel');  // ✅ NOVO: Logger
  }

  /**
   * Setup da state machine
   */
  private setupStateMachine(): void {
    this.logger.info('🔄 Setup StateMachine...');  // ✅ NOVO: Logger
    this.stateMachine = new StateMachine();
    this.logger.info('✅ StateMachine criada');  // ✅ NOVO: Logger
  }

  /**
   * Conecta event listeners
   */
  private connectEventListeners(): void {
    this.logger.info('🎧 Conectando event listeners...');  // ✅ NOVO: Logger

    this.stateMachine!.on(SlotStateType.SPINNING, () => {
      this.logger.info('🎬 Estado: SPINNING');  // ✅ NOVO: Logger
      this.spinButton!.setEnabled(false);
    });

    this.stateMachine!.on(SlotStateType.SETTLING, () => {
      this.logger.info('🎬 Estado: SETTLING');  // ✅ NOVO: Logger
    });

    this.stateMachine!.on(SlotStateType.RESULT, () => {
      this.logger.info('🎬 Estado: RESULT');  // ✅ NOVO: Logger
    });

    this.stateMachine!.on(SlotStateType.IDLE, () => {
      this.logger.info('🎬 Estado: IDLE');  // ✅ NOVO: Logger
      this.spinButton!.setEnabled(true);
    });

    this.spinButton!.setOnClick(async () => {
      await this.handleSpin();
    });

    this.slotMachine!.setOnResult((result) => {
      this.logger.info('🎉 Resultado final:', result);  // ✅ NOVO: Logger
    });

    this.logger.info('✅ Event listeners conectados');  // ✅ NOVO: Logger
  }

  /**
   * Manipula o spin
   */
  private async handleSpin(): Promise<void> {
    if (!this.stateMachine!.is(SlotStateType.IDLE)) {
      this.logger.warn('⚠️ Não pode girar agora');  // ✅ NOVO: Logger (WARN)
      return;
    }

    this.stateMachine!.transition(SlotStateType.SPINNING);

    const targetResult: SpinResult = {
      symbols: this.slotMachine!.getReels().map((reel) => {
        const randomIndex = Math.floor(Math.random() * reel.getConfig().symbols.length);
        return reel.getConfig().symbols[randomIndex];
      }),
    };

    this.logger.debug('🎲 Resultado alvo:', targetResult);  // ✅ NOVO: Logger (DEBUG)

    await this.slotMachine!.spin(targetResult);

    this.stateMachine!.transition(SlotStateType.SETTLING);
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.stateMachine!.transition(SlotStateType.RESULT);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.stateMachine!.transition(SlotStateType.IDLE);
  }
}
