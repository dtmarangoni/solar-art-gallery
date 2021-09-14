import 'source-map-support/register';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

import schema from './schema';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { ValidatedEventAPIGatewayProxyHandlerV2 } from '@utils/apiGateway';
import { formatJSONResponse, privateMiddyfy } from '@utils/lambda';
import { addAlbum } from '../../../../layers/business/database/album';

// Winston logger
const logger = createLogger();

const handler: ValidatedEventAPIGatewayProxyHandlerV2<typeof schema> = async (
    event,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Adding a new album item to DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Add a new album item to DB
    const newAlbum = await addAlbum(context.userId, event.body);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'New album item added to DB',
        items: newAlbum,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the CREATED response with the new album item
    return formatJSONResponse(201, { item: newAlbum });
};

export const main = privateMiddyfy(handler);
