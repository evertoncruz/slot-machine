// src/components/button/SpinButton.ts

import { Graphics, Text, TextStyle } from 'pixi.js';
import { BaseComponent } from '../BaseComponent';

/**
 * Configuração do botão
 */
export interface SpinButtonConfig {
  width: number;
  height: number;
  backgroundColor: number;
  hoverColor: number;
  borderColor: number;
  borderWidth: number;
  label: string;
  textColor: number;
  fontSize: number;
}

/**
 * Callback disparado ao clicar no botão
 */
export type SpinButtonCallback = () => void;

/**
 * SpinButton — botão "Girar"
 */
export class SpinButton extends BaseComponent {
  private graphics: Graphics;
  private text: Text;
  private config: SpinButtonConfig;
  private isHovered: boolean = false;
  private isEnabled: boolean = true;
  private onClick: SpinButtonCallback | null = null;

  constructor(config: SpinButtonConfig) {
    super();
    this.config = config;

    // ✅ Inicializa com valores padrão
    this.graphics = new Graphics();
    this.text = new Text({ text: config.label, style: new TextStyle({}) });

    this.initialize();
  }

  /**
   * Inicializa o botão
   */
  protected initialize(): void {
    // Cria o graphics para o fundo
    this.graphics = new Graphics();
    this.addChild(this.graphics);

    // Cria o texto
    const textStyle = new TextStyle({
      fontSize: this.config.fontSize,
      fill: this.config.textColor,
      fontWeight: 'bold',
    });
    this.text = new Text({ text: this.config.label, style: textStyle });
    this.addChild(this.text);

    // Renderiza o botão
    this.render();

    // Posiciona o texto no centro
    this.text.anchor.set(0.5);
    this.text.x = this.config.width / 2;
    this.text.y = this.config.height / 2;

    // Ativa interatividade
    this.interactive = true;
    this.cursor = 'pointer';

    // Listeners com arrow functions (herdam this automaticamente)
    this.on('pointerdown', () => this.handlePointerDown());
    this.on('pointerup', () => this.handlePointerUp());
    this.on('pointerover', () => this.handlePointerOver());
    this.on('pointerout', () => this.handlePointerOut());
  }

  /**
   * Renderiza o botão com a cor apropriada
   */
  private render(): void {
    if (!this.graphics) return;

    this.graphics.clear();

    // Escolhe a cor baseado no estado
    const color = this.isHovered
      ? this.config.hoverColor
      : this.config.backgroundColor;

    // Desenha o fundo
    this.graphics.rect(0, 0, this.config.width, this.config.height);
    this.graphics.fill(color);

    // Desenha a borda
    this.graphics.stroke({
      color: this.config.borderColor,
      width: this.config.borderWidth,
    });

    // Aplica opacidade se desabilitado
    this.graphics.alpha = this.isEnabled ? 1 : 0.5;
  }

  /**
   * Handler: mouse pressionado
   */
  private handlePointerDown(): void {
    if (!this.isEnabled) return;
    // Aqui você pode adicionar efeito visual de clique
  }

  /**
   * Handler: mouse solto
   */
  private handlePointerUp(): void {
    if (!this.isEnabled) return;
    // Dispara o callback
    if (this.onClick) {
      this.onClick();
    }
  }

  /**
   * Handler: mouse sobre o botão
   */
  private handlePointerOver(): void {
    if (!this.isEnabled) return;
    this.isHovered = true;
    this.render();
  }

    /**
     * Handler: mouse sai do botão
     */
    private handlePointerOut(): void {
        this.isHovered = false;
        this.render();
    }

    /**
     * Registra o callback de clique
     */
    public setOnClick(callback: SpinButtonCallback): void {
        this.onClick = callback;
    }

    /**
     * Habilita/desabilita o botão
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        this.render();
    }

    /**
     * Verifica se o botão está habilitado
     */
    public isButtonEnabled(): boolean {
        return this.isEnabled;
    }

  /**
   * Limpeza
   */
    protected cleanup(): void {
        // Remove listeners
        this.off('pointerdown');
        this.off('pointerup');
        this.off('pointerover');
        this.off('pointerout');

        // Destrói graphics e text (sem atribuir null)
        this.graphics.destroy();
        this.text.destroy();

        // Limpa callback
        this.onClick = null;
    }
}