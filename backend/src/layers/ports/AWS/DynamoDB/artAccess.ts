import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { Key } from 'aws-sdk/clients/dynamodb';

import { Art } from '../../../../models/database/Art';

export class ArtAccess {
    /**
     * Constructs an ArtAccess instance.
     * @param dynamoDB AWS DynamoDB instance.
     * @param artTable Art table name.
     * @param artLocalIndex Art table local secondary index name.
     */
    constructor(
        private readonly dynamoDB = ArtAccess.createDBClient(),
        private readonly artTable = process.env.ART_TABLE,
        private readonly artLocalIndex = process.env.ART_LOCAL_INDEX
    ) {}

    /**
     * Return the live or offline DynamoDB Document client depending on
     * serverless running mode.
     * @returns The DynamoDB Document client.
     */
    private static createDBClient() {
        // Serverless running in offline mode
        if (process.env.IS_OFFLINE) {
            // Serverless offline doesn't support X-Ray so far
            return new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:5000',
                accessKeyId: 'DEFAULT_ACCESS_KEY',
                secretAccessKey: 'DEFAULT_SECRET',
            });
        } else {
            // Running in live mode
            // Encapsulate AWS SDK to use AWS X-Ray
            const XAWS = AWSXRay.captureAWS(AWS);
            return new XAWS.DynamoDB.DocumentClient();
        }
    }

    /**
     * Get all album arts items from Art DynamoDB table with optional
     * pagination.
     * @param albumId The album id.
     * @param limit The maximum number of returned items per call.
     * @param exclusiveStartKey The DynamoDB item key to start the
     * query from.
     * @returns The album arts items with optional pagination.
     */
    async getAlbumArts(
        albumId: string,
        limit?: number,
        exclusiveStartKey?: Key
    ): Promise<{ items: Art[]; lastEvaluatedKey: Key }> {
        const result = await this.dynamoDB
            .query({
                TableName: this.artTable,
                IndexName: this.artLocalIndex,
                KeyConditionExpression: 'albumId = :albumId',
                ExpressionAttributeValues: { ':albumId': albumId },
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
                ScanIndexForward: true,
            })
            .promise();
        return { items: result.Items as Art[], lastEvaluatedKey: result.LastEvaluatedKey };
    }
}
