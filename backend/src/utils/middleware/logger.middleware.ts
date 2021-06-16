import 'source-map-support/register';
import { createLogger, httpLogLevel } from '@utils/logger';
import { formatJSONResponse } from '@utils/lambda';

/**
 * Middy middleware phases in functions calls
 */
export enum MiddlewarePhases {
    before = 'before',
    during = 'during',
    after = 'after',
    error = 'error',
}

// Winston logger
const logger = createLogger();

/**
 * Middy logger middleware to register all requests, responses and
 * error from lambda functions calls.
 * @param logBefore True to enable and false to disable the logger in
 * before phase from middleware chain. Default is enabled.
 * @param logAfter True to enable and false to disable the logger in
 * after phase from middleware chain. Default is enabled.
 * @param logOnError True to enable and false to disable the logger in
 * case of errors in middleware chain. Default is enabled.
 * @returns The logger middleware customized for before, after and
 * onError in middleware chain.
 */
export const loggerMiddleware = (logBefore = true, logAfter = true, logOnError = true) => {
    return {
        before: logBefore ? beforeLogger : undefined,
        after: logAfter ? afterLogger : undefined,
        onError: logOnError ? onErrorLogger : undefined,
    };
};

/**
 * Before phase logger function for middleware chain.
 * @param event A reference to the current context and allows access
 * and modification of the current request event.
 */
async function beforeLogger(event: any) {
    // Log the request before lambda execution
    logger.info(`${MiddlewarePhases.before} ${event.context.functionName}`, {
        functionName: event.context.functionName,
        requestId: event.context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.before,
        request: event,
    });
}

/**
 * After phase logger function for middleware chain.
 * @param event A reference to the current context and allows access
 * and modification of the current response.
 */
async function afterLogger(event: any) {
    // Log the request response after lambda execution
    logger.info(`${MiddlewarePhases.after} ${event.context.functionName}`, {
        functionName: event.context.functionName,
        requestId: event.context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.after,
        request: event,
    });
}

/**
 * Error logger function that is executed in case of errors in the
 * middleware chain.
 * @param event A reference to the current context and allows access
 * and modification of an error.
 */
async function onErrorLogger(event: any) {
    // Set the HTTP status code of not already
    const statusCode = event.error.statusCode ? event.error.statusCode : 500;
    // Set the error message if not already
    const message = event.error.message ? event.error.message : 'An unexpected error happened.';

    // Set the request response
    event.response = formatJSONResponse(statusCode, { message });

    // Log the error
    logger.log(
        httpLogLevel(statusCode),
        `${MiddlewarePhases.error} ${event.context.functionName}: ${message}`,
        {
            functionName: event.context.functionName,
            requestId: event.context.awsRequestId,
            timestamp: new Date().toISOString(),
            phase: MiddlewarePhases.error,
            error: { statusCode, message, stack: event.error.stack },
            request: event,
        }
    );
}
