import 'source-map-support/register';
import { createLogger, httpLogLevel } from '@utils/logger';
import { formatJSONResponse } from '@utils/lambda';

/**
 * Middy middleware phases in functions calls
 */
enum phases {
    before = 'before',
    after = 'after',
    error = 'error',
}

// Winston logger
const logger = createLogger();

/**
 * Middy logger middleware to register all requests, responses and
 * error from lambda functions calls.
 */
export const loggerMiddleware = () => {
    // logger.child({ defaultMeta: { name:  },})
    return { before, after, onError };
};

/**
 * Before phase function from middleware chain.
 * @param event A reference to the current context and allows access
 * and modification of the current request event.
 */
async function before(event: any) {
    // Log the request before lambda execution
    logger.info(`${phases.before} ${event.context.functionName}`, {
        functionName: event.context.functionName,
        requestId: event.context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: phases.before,
        request: event,
    });
}

/**
 * After phase function from middleware chain.
 * @param event A reference to the current context and allows access
 * and modification of the current response.
 */
async function after(event: any) {
    // Log the request response after lambda execution
    logger.info(`${phases.after} ${event.context.functionName}`, {
        functionName: event.context.functionName,
        requestId: event.context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: phases.after,
        request: event,
    });
}

/**
 * Error function that is executed in case of errors.
 * @param event A reference to the current context and allows access
 * and modification of an error.
 */
async function onError(event: any) {
    // Set the HTTP status code of not already
    const statusCode = event.error.statusCode ? event.error.statusCode : 500;
    // Set the error message if not already
    const message = event.error.message ? event.error.message : 'An unexpected error happened.';

    // Set the request response
    event.response = formatJSONResponse(statusCode, { message });

    // Log the error
    logger.log(
        httpLogLevel(statusCode),
        `${phases.error} ${event.context.functionName}: ${message}`,
        {
            functionName: event.context.functionName,
            requestId: event.context.awsRequestId,
            timestamp: new Date().toISOString(),
            phase: 'error',
            error: { statusCode, message, stack: event.error.stack },
            request: event,
        }
    );
}
