import 'source-map-support/register';
import { DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda';

import { createLogger } from '@utils/logger';
import { MiddlewarePhases } from '@utils/middleware/logger.middleware';
import { internalMiddyfy } from '@utils/lambda';
import { deleteRecordObj } from '../../../layers/business/fileStore';

// Winston logger
const logger = createLogger();

const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent, context) => {
    // Delete objects from S3 when an item was deleted from DynamoDB
    event.Records.forEach(async (record) => {
        if (record.eventName === 'REMOVE') {
            logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
                action: 'Deleting S3 Objects after DynamoDB remove event',
                functionName: context.functionName,
                requestId: context.awsRequestId,
                timestamp: new Date().toISOString(),
                phase: MiddlewarePhases.during,
                request: event,
            });

            // Delete the album or art object from file store
            await deleteRecordObj(record.dynamodb.Keys);

            logger.info(`${MiddlewarePhases.during} ${context.functionName}`, {
                action: 'S3 Objects deleted after DynamoDB remove event',
                items: record.dynamodb.Keys,
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
