// src/components/BaseComponent.ts

import { Container } from 'pixi.js';

/**
 * Classe base para todos os componentes visuais
 */
export abstract class BaseComponent extends Container {
  /**
   * Inicializa o componente
   * Sobrescreva este método em subclasses
   */
  protected abstract initialize(): void;

  /**
   * Destruir o componente e liberar recursos
   */
  public destroy(options?: boolean | object): void {
    this.cleanup();
    super.destroy(options);
  }

  /**
   * Método para limpeza específica (override em subclasses)
   */
  protected cleanup(): void {
    // Será sobrescrito em subclasses se necessário
  }

  // ✅ NÃO chama initialize() no construtor
  // Cada subclasse é responsável por chamar initialize() quando apropriado
}