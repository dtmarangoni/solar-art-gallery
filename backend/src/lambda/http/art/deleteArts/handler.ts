import 'source-map-support/register';
import { APIGatewayProxyResultV2 } from 'aws-lambda';

import schema from './schema';
import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { ValidatedEventAPIGatewayProxyHandlerV2 } from '@utils/apiGateway';
import { formatJSONResponse, privateMiddyfy } from '@utils/lambda';
import { deleteArts } from '../../../../layers/business/database/art';

// Winston logger
const logger = createLogger();

const handler: ValidatedEventAPIGatewayProxyHandlerV2<typeof schema> = async (
    event,
    context: any
): Promise<APIGatewayProxyResultV2> => {
    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Deleting arts items from DB',
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Delete the arts items from an album in DB
    const deletedArts = await deleteArts(context.userId, event.body);

    logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
        action: 'Arts items deleted from DB',
        items: event.body,
        functionName: context.functionName,
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString(),
        phase: MiddlewarePhases.during,
    });

    // Return the OK response with the delete confirmation
    return formatJSONResponse(200, { message: 'Arts deleted.', items: deletedArts });
};

export const main = privateMiddyfy(handler);
