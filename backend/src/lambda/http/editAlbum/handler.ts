import 'source-map-support/register';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

import schema from './schema';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { ValidatedEventAPIGatewayProxyHandlerV2 } from '@utils/apiGateway';
import { formatJSONResponse, privateMiddyfy } from '@utils/lambda';
import { editAlbum } from '../../../layers/business/album';

// Winston logger
const logger = createLogger();

const handler: ValidatedEventAPIGatewayProxyHandlerV2<typeof schema> = async (
    event,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Editing an user album item in DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Get the album id from request path params
    const albumId = event.pathParameters.albumId;

    // Edit the user album item in DB
    const editedAlbum = await editAlbum(context.userId, albumId, event.body);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Album item edited on DB',
        items: editedAlbum,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the OK response with the edited album item
    return formatJSONResponse(200, { item: editedAlbum });
};

export const main = privateMiddyfy(handler);
