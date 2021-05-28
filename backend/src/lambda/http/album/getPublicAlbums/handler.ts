import 'source-map-support/register';
import {
    APIGatewayProxyEventV2,
    APIGatewayProxyHandlerV2,
    APIGatewayProxyResultV2,
} from 'aws-lambda';

import { formatJSONResponse, publicMiddyfy } from '@utils/lambda';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { encodeNextKey } from '@utils/dynamoDB';
import { getPublicAlbums } from '../../../../layers/business/album';

// Winston logger
const logger = createLogger();

const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2,
    context
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Retrieving all public albums from DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Retrieve the "limit" and "nextKey" from query parameters
    const limit = event?.queryStringParameters?.limit;
    const nextKey = event?.queryStringParameters?.nextKey;

    // Get all public albums items from DB
    const albums = await getPublicAlbums(limit, nextKey);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'All public albums retrieved from DB',
        items: albums,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the response with albums items
    return formatJSONResponse(200, {
        items: albums.items,
        // Encode the Key JSON object so a client can return it in an
        // URL as is
        nextKey: encodeNextKey(albums.lastEvaluatedKey),
    });
};

export const main = publicMiddyfy(handler);
