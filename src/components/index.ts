// src/components/index.ts

export { BaseComponent } from './BaseComponent';

// Popup
export { Overlay } from './popup/Overlay';
export { Panel, type PanelConfig } from './popup/Panel';
export { Popup } from './popup/Popup';

// Button
export {
  SpinButton,
  type SpinButtonConfig,
  type SpinButtonCallback,
} from './button/SpinButton';

// Reel
export { ReelSymbol } from './reel/ReelSymbol';
export { ReelContainer } from './reel/ReelContainer';
export { Reel } from './reel/Reel';

// SlotMachine
export { SlotMachine, type SlotMachineResultCallback } from './slot/SlotMachine';