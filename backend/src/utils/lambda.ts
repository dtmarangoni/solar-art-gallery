import 'source-map-support/register';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';

import { getUserID } from '@utils/middleware/userID.middleware';
import { loggerMiddleware } from '@utils/middleware/logger.middleware';

/**
 * Apply middlewares before and/or after lambda functions for public
 * endpoints.
 * @param handler The lambda function handler.
 * @returns The middyfied lambda function.
 */
export const publicMiddyfy = (handler: any) => {
    return middy(handler)
        .use(middyJsonBodyParser())
        .use(loggerMiddleware())
        .use(cors({ credentials: true }));
};

/**
 * Apply middlewares before and/or after lambda functions for private
 * endpoints.
 * @param handler The lambda function handler.
 * @returns The middyfied lambda function.
 */
export const privateMiddyfy = (handler: any) => {
    return middy(handler)
        .use(middyJsonBodyParser())
        .use(getUserID())
        .use(loggerMiddleware())
        .use(cors({ credentials: true }));
};

/**
 * Apply middlewares before and/or after lambda functions for internal
 * AWS ecosystem communication.
 * @param handler The lambda function handler.
 * @returns The middyfied lambda function.
 */
export const internalMiddyfy = (handler: any) => {
    return middy(handler).use(middyJsonBodyParser()).use(loggerMiddleware(false, false, true));
};

/**
 * Create the proper lambda handler file path independently of the
 * operational system.
 * @param context The file directory path context.
 * @returns The resolved handler file absolute path.
 */
export const handlerPath = (context: string) => {
    return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

/**
 * Format the Lambda response with status code and stringified JSON body.
 * @param statusCode The response status code.
 * @param response The response body.
 * @returns The formatted response.
 */
export const formatJSONResponse = (statusCode: number, response: Record<string, unknown>) => {
    return { statusCode: statusCode, body: JSON.stringify(response) };
};
