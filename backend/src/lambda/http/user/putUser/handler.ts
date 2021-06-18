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
import { getUserAlbums } from '../../../../layers/business/database/album';
import { putUserInfo } from 'src/layers/business/database/user';

// Winston logger
const logger = createLogger();

const handler: APIGatewayProxyHandlerV2 = async (
    event: APIGatewayProxyEventV2,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Add or edit the user profile information in database',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Add or edit the user profile information in DB
    const user = await putUserInfo(event?.headers?.Authorization);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'User profile information added or edited in database',
        items: user,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the OK response
    return formatJSONResponse(201, {
        message: 'User profile information added or edited in database.',
    });
};

export const main = privateMiddyfy(handler);
