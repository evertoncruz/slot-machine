// src/components/popup/Panel.ts

import { Container, Graphics } from 'pixi.js';
import { BaseComponent } from '../BaseComponent';

/**
 * Configuração do painel
 */
export interface PanelConfig {
  width: number;
  height: number;
  backgroundColor: number;
  borderColor: number;
  borderWidth: number;
  cornerRadius?: number;
}

/**
 * Painel — moldura central do popup
 */
export class Panel extends BaseComponent {
  private graphics: Graphics;
  private contentContainer: Container;
  private config: PanelConfig;

  constructor(config: PanelConfig) {
    super();
    this.config = config;
    this.graphics = new Graphics();
    this.contentContainer = new Container();
    this.initialize();
  }

  protected initialize(): void {
    this.addChild(this.graphics);
    this.addChild(this.contentContainer);
    this.render();
  }

  private render(): void {
    this.graphics.clear();
    this.graphics.rect(0, 0, this.config.width, this.config.height);
    this.graphics.fill(this.config.backgroundColor);
    this.graphics.stroke({
      color: this.config.borderColor,
      width: this.config.borderWidth,
    });
  }

  public getContentContainer(): Container {
    return this.contentContainer;
  }

  public centerOn(screenWidth: number, screenHeight: number): void {
    this.x = (screenWidth - this.config.width) / 2;
    this.y = (screenHeight - this.config.height) / 2;
  }

  protected cleanup(): void {
    this.graphics.destroy();
    this.contentContainer.destroy({ children: true });
  }
}
