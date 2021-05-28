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
import { getAlbumArts } from '../../../../layers/business/art';

// Winston logger
const logger = createLogger();

const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2,
    context
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Retrieving all album arts from DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Get the album id from path params
    const albumId = event.pathParameters.albumId;
    // Retrieve the "limit" and "nextKey" from query parameters
    const limit = event?.queryStringParameters?.limit;
    const nextKey = event?.queryStringParameters?.nextKey;

    // Get all album arts items from DB
    const arts = await getAlbumArts(albumId, limit, nextKey);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'All album arts retrieved from DB',
        items: arts,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the response with album arts items
    return formatJSONResponse(200, {
        items: arts.items,
        // Encode the Key JSON object so a client can return it in an
        // URL as is
        nextKey: encodeNextKey(arts.lastEvaluatedKey),
    });
};

export const main = publicMiddyfy(handler);
