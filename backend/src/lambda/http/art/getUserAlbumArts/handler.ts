import 'source-map-support/register';
import {
    APIGatewayProxyEventV2,
    APIGatewayProxyHandlerV2,
    APIGatewayProxyResultV2,
} from 'aws-lambda';

import { formatJSONResponse, privateMiddyfy } from '@utils/lambda';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { encodeNextKey } from '@utils/dynamoDB';
import { getUserAlbumArts } from '../../../../layers/business/art';

// Winston logger
const logger = createLogger();

const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Retrieving all user arts of an album from DB',
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

    // Get all user arts of an album from DB
    const arts = await getUserAlbumArts(context.userId, albumId, limit, nextKey);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'All user arts of an album retrieved from DB',
        items: arts,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the response with all arts of an album
    return formatJSONResponse(200, {
        items: arts.items,
        // Encode the Key JSON object so a client can return it in an
        // URL as is
        nextKey: encodeNextKey(arts.lastEvaluatedKey),
    });
};

export const main = privateMiddyfy(handler);
