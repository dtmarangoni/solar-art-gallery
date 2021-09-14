import 'source-map-support/register';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

import schema from './schema';
import { formatJSONResponse, publicMiddyfy } from '@utils/lambda';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { ValidatedEventAPIGatewayProxyHandlerV2 } from '@utils/apiGateway';
import { encodeNextKey } from '@utils/dynamoDB';
import { getPublicAlbumArts } from '../../../../layers/business/database/art';

// Winston logger
const logger = createLogger();

const handler: ValidatedEventAPIGatewayProxyHandlerV2<typeof schema> = async (
    event,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Retrieving all arts of an album from DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Retrieve the "limit" and "nextKey" from query parameters
    const limit = event?.queryStringParameters?.limit;
    const nextKey = event?.queryStringParameters?.nextKey;

    // Get all arts of an album from DB
    const arts = await getPublicAlbumArts(event.body, limit, nextKey);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'All arts of an album retrieved from DB',
        items: arts,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the OK response with all arts of an album
    return formatJSONResponse(200, {
        items: arts.items,
        // Encode the Key JSON object so a client can return it in an
        // URL as is
        nextKey: encodeNextKey(arts.lastEvaluatedKey),
    });
};

export const main = publicMiddyfy(handler);
