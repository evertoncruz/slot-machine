// src/utils/logger.ts

/**
 * Níveis de log
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Cores para console (ANSI)
 */
const COLORS = {
  RESET: '\x1b[0m',
  DEBUG: '\x1b[36m',    // Ciano
  INFO: '\x1b[32m',     // Verde
  WARN: '\x1b[33m',     // Amarelo
  ERROR: '\x1b[31m',    // Vermelho
  GRAY: '\x1b[90m',     // Cinza
};

/**
 * Interface para log entry
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
}

/**
 * Logger centralizado
 * ✅ Responsabilidade ÚNICA: Gerenciar logs
 * ✅ Reutilizável em toda a aplicação
 */
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Máximo de logs em memória
  private minLevel: LogLevel = LogLevel.DEBUG;

  private constructor() {}

  /**
   * Singleton: Retorna instância única
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Define o nível mínimo de log
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Verifica se deve logar baseado no nível
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const minIndex = levels.indexOf(this.minLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex >= minIndex;
  }

  /**
   * Cria um logger para um módulo específico
   */
  static createModuleLogger(moduleName: string): ModuleLogger {
    return new ModuleLogger(moduleName);
  }

  /**
   * Log DEBUG
   */
  debug(module: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, module, message, data);
  }

  /**
   * Log INFO
   */
  info(module: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, module, message, data);
  }

  /**
   * Log WARN
   */
  warn(module: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, module, message, data);
  }

  /**
   * Log ERROR
   */
  error(module: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, module, message, data);
  }

  /**
   * Log interno
   */
  private log(level: LogLevel, module: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const entry: LogEntry = {
      timestamp,
      level,
      module,
      message,
      data,
    };

    // Adicionar ao histórico
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove o log mais antigo
    }

    // Imprimir no console
    this.printToConsole(entry);
  }

  /**
   * Imprime no console com cores
   */
  private printToConsole(entry: LogEntry): void {
    const color = this.getColor(entry.level);
    const reset = COLORS.RESET;
    const gray = COLORS.GRAY;

    const timestamp = `${gray}[${entry.timestamp}]${reset}`;
    const level = `${color}[${entry.level}]${reset}`;
    const module = `${gray}{${entry.module}}${reset}`;

    let output = `${timestamp} ${level} ${module} ${entry.message}`;

    if (entry.data) {
      output += `\n${gray}${JSON.stringify(entry.data, null, 2)}${reset}`;
    }

    console.log(output);
  }

  /**
   * Retorna cor baseada no nível
   */
  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return COLORS.DEBUG;
      case LogLevel.INFO:
        return COLORS.INFO;
      case LogLevel.WARN:
        return COLORS.WARN;
      case LogLevel.ERROR:
        return COLORS.ERROR;
      default:
        return COLORS.RESET;
    }
  }

  /**
   * Retorna todos os logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Filtra logs por nível
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Filtra logs por módulo
   */
  getLogsByModule(module: string): LogEntry[] {
    return this.logs.filter((log) => log.module === module);
  }

  /**
   * Limpa todos os logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Exporta logs como JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Exporta logs como CSV
   */
  exportAsCSV(): string {
    const headers = ['Timestamp', 'Level', 'Module', 'Message', 'Data'];
    const rows = this.logs.map((log) => [
      log.timestamp,
      log.level,
      log.module,
      log.message,
      log.data ? JSON.stringify(log.data) : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Faz download dos logs
   */
  downloadLogs(format: 'json' | 'csv' = 'json'): void {
    const content = format === 'json' ? this.exportAsJSON() : this.exportAsCSV();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Logger de módulo
 * ✅ Facilita logging em módulos específicos
 */
export class ModuleLogger {
  private moduleName: string;
  private logger: Logger;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.logger = Logger.getInstance();
  }

  debug(message: string, data?: any): void {
    this.logger.debug(this.moduleName, message, data);
  }

  info(message: string, data?: any): void {
    this.logger.info(this.moduleName, message, data);
  }

  warn(message: string, data?: any): void {
    this.logger.warn(this.moduleName, message, data);
  }

  error(message: string, data?: any): void {
    this.logger.error(this.moduleName, message, data);
  }
}
