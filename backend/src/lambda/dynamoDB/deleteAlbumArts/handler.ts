import 'source-map-support/register';
import { DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda';

import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { internalMiddyfy } from '@utils/lambda';
import { deleteAlbumArts } from '../../../layers/business/database/art';

// Winston logger
const logger = createLogger();

const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent, context) => {
    // Delete all album arts after an album was deleted
    event.Records.forEach(async (record) => {
        if (record.eventName === 'REMOVE') {
            logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
                action: 'Deleting all albums arts items from DB',
                functionName: context.functionName,
                requestId: context.awsRequestId,
                timestamp: new Date().toISOString(),
                phase: MiddlewarePhases.during,
                request: event,
            });

            // Delete the all album arts items from DB
            const deletedArts = await deleteAlbumArts(record.dynamodb.Keys.albumId.S);

            logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
                action: deletedArts
                    ? 'All Album arts items deleted from DB'
                    : 'The album is already empty.',
                items: { streamRecord: record.dynamodb.Keys, deletedArts },
                functionName: context.functionName,
                requestId: context.awsRequestId,
                timestamp: new Date().toISOString(),
                phase: MiddlewarePhases.during,
                request: event,
            });
        }
    });
};

export const main = internalMiddyfy(handler);
