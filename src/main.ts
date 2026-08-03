// src/main.ts

import { Application } from 'pixi.js';
import { Popup } from './components/popup/Popup';
import { SlotMachine } from './components/slot/SlotMachine';
import { SpinButton } from './components/button/SpinButton';
import { StateMachine } from './utils/StateMachine';
import { ReelConfigFactory } from './models/ReelConfig';
import { SlotMachineConfigFactory } from './models/SlotMachineConfig';
import { SlotStateType, type SlotMachineConfig, type SpinResult } from './models/types';
import { DEFAULT_CONFIG } from './utils/constants';
import type { PanelConfig, SpinButtonConfig } from './components';

// ============================================
// CONFIGURAÇÃO PIXI
// ============================================

const app = new Application();

await app.init({
  width: 1024,
  height: 768,
  backgroundColor: 0x8b4789,
});

document.body.appendChild(app.canvas);

console.log('✅ PIXI.js v8 inicializado corretamente');
console.log(`App size: ${app.canvas.width} x ${app.canvas.height}`);

// ============================================
// CRIAR REELS (USANDO DEFAULT_CONFIG)
// ============================================

const reels = Array(DEFAULT_CONFIG.REEL_COUNT)
  .fill(null)
  .map(() => ReelConfigFactory.createDefault());

console.log('✅ Reels criados:', {
  count: reels.length,
  reel_count: DEFAULT_CONFIG.REEL_COUNT,
});

// ============================================
// CRIAR SLOT MACHINE CONFIG
// ============================================

const slotMachineConfig: SlotMachineConfig = SlotMachineConfigFactory.create(
  DEFAULT_CONFIG.REEL_COUNT,
  reels,
  DEFAULT_CONFIG.SPIN_DURATION,
  DEFAULT_CONFIG.ACCELERATION_DURATION,
  DEFAULT_CONFIG.DECELERATION_DURATION,
  DEFAULT_CONFIG.MAX_VELOCITY
);

console.log('✅ SlotMachineConfig criada:', slotMachineConfig);

// ============================================
// CRIAR POPUP
// ============================================

const popup = new Popup(app.canvas.width, app.canvas.height);
app.stage.addChild(popup);

console.log('✅ Popup criado');

// ============================================
// CONFIGURAR PAINEL (USANDO DEFAULT_CONFIG)
// ============================================

const panelConfig: PanelConfig = {
  width: DEFAULT_CONFIG.POPUP_WIDTH,       // ✅ DINÂMICO COM MÍNIMO 600px!
  height: DEFAULT_CONFIG.POPUP_HEIGHT,     // ✅ DINÂMICO!
  backgroundColor: 0xdaa520,
  borderColor: 0x8b4513,
  borderWidth: 3,
  cornerRadius: 10,
};

console.log('📊 Panel Config:', {
  width: panelConfig.width,
  height: panelConfig.height,
  reel_count: DEFAULT_CONFIG.REEL_COUNT,
});

const panelContent = popup.addPanel(panelConfig);

console.log('✅ Popup.addPanel() chamado');

// ============================================
// CRIAR SLOT MACHINE
// ============================================

// ✅ CRÍTICO: Passar as dimensões do PAINEL, não do CONTAINER!
const slotMachine = new SlotMachine(
  slotMachineConfig,
  panelConfig.width,    // ✅ Usar dimensão do painel (600px)!
  panelConfig.height    // ✅ Usar dimensão do painel (610px)!
);
panelContent.addChild(slotMachine);

console.log('✅ SlotMachine criada e centralizada');

// ============================================
// CRIAR BOTÃO SPIN
// ============================================

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

const spinButton = new SpinButton(spinButtonConfig);
spinButton.x = (panelConfig.width - spinButtonConfig.width) / 2;
spinButton.y = panelConfig.height - 80;
panelContent.addChild(spinButton);

console.log('✅ SpinButton criado');

// ============================================
// CRIAR STATE MACHINE
// ============================================

const stateMachine = new StateMachine();

console.log('✅ State Machine criado');

// ============================================
// REGISTRAR LISTENERS DE ESTADO
// ============================================

stateMachine.on(SlotStateType.SPINNING, () => {
  console.log('🎬 Estado: SPINNING — iniciando animação');
  spinButton.setEnabled(false);
});

stateMachine.on(SlotStateType.SETTLING, () => {
  console.log('🎬 Estado: SETTLING — rolos parando');
});

stateMachine.on(SlotStateType.RESULT, () => {
  console.log('🎬 Estado: RESULT — resultado alcançado');
});

stateMachine.on(SlotStateType.IDLE, () => {
  console.log('🎬 Estado: IDLE — pronto para novo spin');
  spinButton.setEnabled(true);
});

// ============================================
// LÓGICA DO BOTÃO SPIN
// ============================================

spinButton.setOnClick(async () => {
  if (!stateMachine.is(SlotStateType.IDLE)) {
    console.warn('⚠️ Não pode girar agora');
    return;
  }

  stateMachine.transition(SlotStateType.SPINNING);

  const targetResult: SpinResult = {
    symbols: slotMachineConfig.reels.map((reelConfig) => {
      const randomIndex = Math.floor(Math.random() * reelConfig.symbols.length);
      return reelConfig.symbols[randomIndex];
    }),
  };

  console.log('🎲 Resultado alvo:', targetResult);

  await slotMachine.spin(targetResult);

  stateMachine.transition(SlotStateType.SETTLING);

  await new Promise((resolve) => setTimeout(resolve, 500));

  stateMachine.transition(SlotStateType.RESULT);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  stateMachine.transition(SlotStateType.IDLE);
});

// ============================================
// REGISTRAR CALLBACK DE RESULTADO
// ============================================

slotMachine.setOnResult((result) => {
  console.log('🎉 Resultado final:', result);
});

console.log('✅ Aplicação pronta!');