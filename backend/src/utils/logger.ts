import { config } from '../config/environment';

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

class Logger {
    private shouldLog(level: LogLevel): boolean {
        if (config.nodeEnv === 'production') {
            return level === LogLevel.ERROR || level === LogLevel.WARN;
        }
        return true;
    }

    private formatMessage(level: LogLevel, message: string, meta?: any): string {
        const timestamp = new Date().toISOString();
        const baseMessage = `[${timestamp}] ${level}: ${message}`;

        if (meta) {
            return `${baseMessage} ${JSON.stringify(meta)}`;
        }

        return baseMessage;
    }

    error(message: string, meta?: any, p0?: string, reason?: unknown): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(LogLevel.ERROR, message, meta));
        }
    }

    warn(message: string, meta?: any): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(LogLevel.WARN, message, meta));
        }
    }

    info(message: string, meta?: any): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(this.formatMessage(LogLevel.INFO, message, meta));
        }
    }

    debug(message: string, meta?: any): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
        }
    }
}

export const logger = new Logger();
