import 'source-map-support/register';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

import schema from './schema';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { ValidatedEventAPIGatewayProxyHandlerV2 } from '@utils/apiGateway';
import { formatJSONResponse, privateMiddyfy } from '@utils/lambda';
import { putArts } from '../../../../layers/business/database/art';

// Winston logger
const logger = createLogger();

const handler: ValidatedEventAPIGatewayProxyHandlerV2<typeof schema> = async (
    event,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Adding and/or updating multiple album arts in DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Add and/or updates multiple album arts in DB
    const arts = await putArts(context.userId, event.body);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Multiple album arts added and/or updated in DB',
        items: arts,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the CREATED response with the new album item
    return formatJSONResponse(201, { items: arts });
};

export const main = privateMiddyfy(handler);
