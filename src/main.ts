// src/main.ts

import { Application } from 'pixi.js';
import { Game } from './core/Game';

// ============================================
// INICIALIZAR PIXI
// ============================================

const app = new Application();

await app.init({
  width: 1024,
  height: 768,
  backgroundColor: 0x8b4789,
});

document.body.appendChild(app.canvas);

console.log('✅ PIXI.js v8 inicializado');
console.log(`App size: ${app.canvas.width} x ${app.canvas.height}`);

// ============================================
// INICIALIZAR JOGO
// ============================================

const game = new Game(app);
await game.start();

console.log('✅ Aplicação pronta!');
