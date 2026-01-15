// Logging utility with different log levels

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: number;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 100;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.logLevel = LogLevel.DEBUG;
    }
  }

  /**
   * Set minimum log level
   */
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   * Debug log
   */
  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Info log
   */
  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Warning log
   */
  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Error log
   */
  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: any) {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
    };

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const prefix = this.getPrefix(level);
    const styles = this.getStyles(level);

    if (typeof window !== 'undefined' && console) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`${prefix} ${message}`, data);
          break;
        case LogLevel.INFO:
          console.info(`${prefix} ${message}`, data);
          break;
        case LogLevel.WARN:
          console.warn(`${prefix} ${message}`, data);
          break;
        case LogLevel.ERROR:
          console.error(`${prefix} ${message}`, data);
          break;
      }
    }
  }

  /**
   * Get prefix for log level
   */
  private getPrefix(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '🐛 [DEBUG]';
      case LogLevel.INFO:
        return 'ℹ️  [INFO]';
      case LogLevel.WARN:
        return '⚠️  [WARN]';
      case LogLevel.ERROR:
        return '❌ [ERROR]';
    }
  }

  /**
   * Get console styles for log level
   */
  private getStyles(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #64748b';
      case LogLevel.INFO:
        return 'color: #3b82f6';
      case LogLevel.WARN:
        return 'color: #f59e0b';
      case LogLevel.ERROR:
        return 'color: #ef4444';
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();

export default logger;
