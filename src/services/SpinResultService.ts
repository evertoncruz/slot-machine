// src/services/SpinResultService.ts

import type { SpinResult, ReelConfig } from '../models/types';

/**
 * Simula um serviço backend que retorna resultados determinísticos
 * ✅ DATA-DRIVEN: Resultados vêm do "backend"
 */
export class SpinResultService {
  /**
   * Simula uma chamada ao backend para obter um resultado
   * Em produção, seria uma chamada HTTP real
   */
  static async getSpinResult(reelConfigs: ReelConfig[]): Promise<SpinResult> {
    // Simula latência de rede (500ms)
    await this.delay(500);

    // ✅ Chama o backend (simulado)
    return this.fetchFromBackend(reelConfigs);
  }

  /**
   * Simula uma chamada HTTP ao backend
   * Em produção: fetch('https://api.seu-servidor.com/spin')
   */
  private static async fetchFromBackend(
    reelConfigs: ReelConfig[]
  ): Promise<SpinResult> {
    // ✅ Simula resposta do backend
    const backendResponse = {
      symbols: this.generateDeterministicResult(reelConfigs),
      timestamp: Date.now(),
    };

    console.log('📡 Resposta do Backend:', backendResponse);

    return {
      symbols: backendResponse.symbols,
    };
  }

  /**
   * Gera um resultado DETERMINÍSTICO (não aleatório)
   * ✅ Cada rolo tem um símbolo DIFERENTE baseado em sua posição
   */
  private static generateDeterministicResult(
    reelConfigs: ReelConfig[]
  ): (string | number)[] {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const second = new Date().getSeconds();

    // ✅ Combina hora + minuto + segundo para criar seed único
    const seed = hour * 3600 + minute * 60 + second;

    return reelConfigs.map((config, reelIndex) => {
      // ✅ ALTERADO: Cada rolo usa um índice DIFERENTE
      // Combina seed com índice do rolo para variar
      const index = (seed + reelIndex) % config.symbols.length;
      console.log(`📊 Reel ${reelIndex}: seed=${seed}, index=${index}, symbol=${config.symbols[index]}`);
      return config.symbols[index];
    });
  }

  /**
   * Simula um resultado específico (para testes)
   */
  static async getSpecificResult(symbols: (string | number)[]): Promise<SpinResult> {
    await this.delay(500);
    console.log('📡 Resultado Específico do Backend:', symbols);
    return { symbols };
  }

  /**
   * Simula resultado com prêmio (todos os símbolos iguais)
   */
  static async getWinningResult(reelConfigs: ReelConfig[]): Promise<SpinResult> {
    await this.delay(500);
    const winningSymbol = reelConfigs[0].symbols[0];
    const symbols = reelConfigs.map(() => winningSymbol);
    console.log('🎉 Resultado Vencedor do Backend:', symbols);
    return { symbols };
  }

  /**
   * Simula resultado aleatório (para comparação)
   */
  static async getRandomResult(reelConfigs: ReelConfig[]): Promise<SpinResult> {
    await this.delay(500);
    const symbols = reelConfigs.map((config) => {
      const randomIndex = Math.floor(Math.random() * config.symbols.length);
      return config.symbols[randomIndex];
    });
    console.log('🎲 Resultado Aleatório do Backend:', symbols);
    return { symbols };
  }

  /**
   * Helper: Simula delay de rede
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}