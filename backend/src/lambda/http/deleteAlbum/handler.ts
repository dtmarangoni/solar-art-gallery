import 'source-map-support/register';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

import schema from './schema';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { ValidatedEventAPIGatewayProxyHandlerV2 } from '@utils/apiGateway';
import { formatJSONResponse, privateMiddyfy } from '@utils/lambda';
import { deleteAlbum } from '../../../layers/business/album';

// Winston logger
const logger = createLogger();

const handler: ValidatedEventAPIGatewayProxyHandlerV2<typeof schema> = async (
    event,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Deleting an user album item from DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Delete the user album item from DB
    const deletedAlbum = await deleteAlbum(context.userId, event.body);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Album item deleted from DB',
        items: event.body,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the OK response with the deleted confirmation
    return formatJSONResponse(200, { message: 'Album deleted.', item: deletedAlbum });
};

export const main = privateMiddyfy(handler);
