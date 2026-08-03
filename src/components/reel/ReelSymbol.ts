// src/components/reel/ReelSymbol.ts

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { Symbol } from '../../models';

/**
 * Um símbolo individual do reel
 */
export class ReelSymbol extends Container {
  private graphics: Graphics;
  private text: Text;
  private symbol: Symbol;
  private symbolHeight: number;

  constructor(
    symbol: Symbol,
    symbolHeight: number,
    backgroundColor: number = 0x4a4a6a,
    textColor: number = 0xffffff
  ) {
    super();

    this.symbol = symbol;
    this.symbolHeight = symbolHeight;

    // ✅ Cria o fundo (retângulo simples)
    this.graphics = new Graphics();
    this.graphics.rect(0, 0, 80, symbolHeight);
    this.graphics.fill(backgroundColor);
    this.graphics.stroke({ color: 0xffffff, width: 2 });
    this.addChild(this.graphics);

    // ✅ Cria o texto
    const textStyle = new TextStyle({
      fontSize: 40,
      fill: textColor,
      fontWeight: 'bold',
      align: 'center',
    });
    this.text = new Text({ text: String(symbol), style: textStyle });
    this.text.anchor.set(0.5);
    this.text.x = 40;
    this.text.y = symbolHeight / 2;
    this.addChild(this.text);

    console.log(`✅ ReelSymbol criado: ${symbol} em y=${this.y}`);
  }

  /**
   * Atualiza o símbolo (para wrap-around)
   */
  public setSymbol(symbol: Symbol): void {
    this.symbol = symbol;
    this.text.text = String(symbol);
  }

  /**
   * Obtém o símbolo atual
   */
  public getSymbol(): Symbol {
    return this.symbol;
  }

  /**
   * Limpeza
   */
  public destroy(options?: boolean | object): void {
    this.graphics.destroy();
    this.text.destroy();
    super.destroy(options);
  }
}