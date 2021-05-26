import 'source-map-support/register';
import { APIGatewayTokenAuthorizerHandler, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

import { createLogger } from '@utils/logger';
import { generateIAMPolicy } from '@utils/apiGateway';
import { validateAuthToken } from '../../../layers/business/authorizer';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';

// Winston logger
const logger = createLogger();

export const main: APIGatewayTokenAuthorizerHandler = async (
    event: APIGatewayTokenAuthorizerEvent,
    context
) => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Authorizing an user',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    try {
        // Retrieve the validated and decoded auth token
        const decodedToken = await validateAuthToken(event?.authorizationToken);

        // Valid token
        logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
            action: 'User was authorized',
            decodedToken,
            functionName: context.functionName,
            requestId: context.awsRequestId,
            timestamp: new Date().toISOString(),
            phase: MiddlewarePhases.during,
        });

        // Allow access to lambda functions with an Allow IAM policy
        return generateIAMPolicy(true, decodedToken.payload.sub);
    } catch (error) {
        // User not authorized
        logger.error(`${MiddlewarePhases.error} ${context.functionName}`, {
            action: 'User not authorized',
            error: { statusCode: 401, message: error.message, stack: error.stack },
            functionName: context.functionName,
            requestId: context.awsRequestId,
            timestamp: new Date().toISOString(),
            phase: MiddlewarePhases.error,
        });

        // Send the Deny IAM policy to API Gateway
        return generateIAMPolicy(false, 'unauthorized user');
    }
};
