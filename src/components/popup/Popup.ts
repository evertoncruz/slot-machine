// src/components/popup/Popup.ts

import { Container } from 'pixi.js';
import { BaseComponent } from '../BaseComponent';
import { Overlay } from './Overlay';
import { Panel, type PanelConfig } from './Panel';

/**
 * Popup — combina Overlay + Panel
 */
export class Popup extends BaseComponent {
  private overlay: Overlay;
  private panel: Panel | null = null;
  private screenWidth: number;
  private screenHeight: number;

  constructor(screenWidth: number, screenHeight: number) {
    super();
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.overlay = new Overlay(screenWidth, screenHeight);
    this.initialize();
  }

  protected initialize(): void {
    console.log('Popup.initialize() chamado');

    // ✅ Adiciona APENAS o overlay
    this.addChild(this.overlay);
  }

  /**
   * Adiciona um painel ao popup
   * Retorna o container interno do painel para adicionar conteúdo
   */
  public addPanel(config: PanelConfig): Container {
    console.log('Popup.addPanel() chamado');

    // ✅ Cria o painel
    this.panel = new Panel(config);

    // ✅ Centraliza o painel na tela
    this.panel.centerOn(this.screenWidth, this.screenHeight);

    // ✅ Adiciona o painel ao popup (NÃO ao stage)
    this.addChild(this.panel);

    console.log('Popup criado');

    // Retorna o container interno do painel para adicionar conteúdo
    return this.panel.getContentContainer();
  }

  protected cleanup(): void {
    if (this.panel) {
      this.panel.destroy();
      this.panel = null;
    }
    this.overlay.destroy();
  }
}