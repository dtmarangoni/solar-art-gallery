import 'source-map-support/register';
import * as winston from 'winston';

/**
 * Create a logger instance to write log messages in JSON format.
 * @returns The logger instance to write logs to.
 */
export function createLogger() {
    return winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [new winston.transports.Console()],
    });
}

/**
 * Determines the appropriate log level according to the HTTP response
 * and/or error status code.
 * @param statusCode The HTTP response and/or error status code.
 * @returns The appropriate log level.
 */
export function httpLogLevel(statusCode: number): string {
    // Log Level
    let level: string;

    if (statusCode >= 100) level = 'info';
    if (statusCode >= 400) level = 'warn';
    if (statusCode >= 500) level = 'error';
    // Unauthorized and Forbidden are critical due to possible hacking
    // attempts
    if (statusCode == 401 || statusCode == 403) level = 'critical';

    return level;
}
