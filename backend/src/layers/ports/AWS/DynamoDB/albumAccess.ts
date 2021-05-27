import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { Key } from 'aws-sdk/clients/dynamodb';

import { Album, AlbumVisibility } from '../../../../models/database/Album';

export class AlbumAccess {
    /**
     * Constructs a AlbumAccess instance.
     * @param dynamoDB AWS DynamoDB instance.
     * @param albumTable Album table name.
     * @param albumGlobalIndex Album table global secondary index name.
     * @param albumLocalIndex Album table local secondary index name.
     */
    constructor(
        private readonly dynamoDB = AlbumAccess.createDBClient(),
        private readonly albumTable = process.env.ALBUM_TABLE,
        private readonly albumGlobalIndex = process.env.ALBUM_GLOBAL_INDEX,
        private readonly albumLocalIndex = process.env.ALBUM_LOCAL_INDEX
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
     * Get all public albums items from Album DynamoDB table with
     * optional pagination.
     * @param limit The maximum number of returned items per call.
     * @param exclusiveStartKey The DynamoDB item key to start the
     * query from.
     * @returns The public albums items with optional pagination.
     */
    async getPublicAlbums(
        limit?: number,
        exclusiveStartKey?: Key
    ): Promise<{ items: Album[]; lastEvaluatedKey: Key }> {
        const result = await this.dynamoDB
            .query({
                TableName: this.albumTable,
                IndexName: this.albumGlobalIndex,
                KeyConditionExpression: 'visibility = :visibility',
                ExpressionAttributeValues: { ':visibility': AlbumVisibility.public },
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
                ScanIndexForward: true,
            })
            .promise();
        return { items: result.Items as Album[], lastEvaluatedKey: result.LastEvaluatedKey };
    }

    /**
     * Get all user's albums items from Album DynamoDB table with
     * optional pagination.
     * @param userId The albums items owner user ID.
     * @param limit The maximum number of returned items per call.
     * @param exclusiveStartKey The DynamoDB item key to start the
     * query from.
     * @returns The user's albums items with optional pagination.
     */
    async getUserAlbums(
        userId: string,
        limit?: number,
        exclusiveStartKey?: Key
    ): Promise<{ items: Album[]; lastEvaluatedKey: Key }> {
        const result = await this.dynamoDB
            .query({
                TableName: this.albumTable,
                IndexName: this.albumLocalIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: { ':userId': userId },
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
                ScanIndexForward: true,
            })
            .promise();
        return { items: result.Items as Album[], lastEvaluatedKey: result.LastEvaluatedKey };
    }

    /**
     * Gets an user album item from Album DynamoDB table.
     * @param userId The album item owner user ID.
     * @param albumId The album ID
     * @returns The album item.
     */
    async getAlbum(userId: string, albumId: string) {
        const result = await this.dynamoDB
            .get({ TableName: this.albumTable, Key: { userId, albumId } })
            .promise();
        return result.Item as Album;
    }

    /**
     * Add an album item in Album DynamoDB table.
     * @param item The album item.
     * @returns The added album item.
     */
    async addAlbum(item: Album) {
        await this.dynamoDB.put({ TableName: this.albumTable, Item: item }).promise();
        // Return the album item as confirmation of a success operation
        return item;
    }

    /**
     * Edit an album item in Album DynamoDB table.
     * @param item The album item with the new properties.
     * @returns The edited album item.
     */
    async editAlbum(item: Album) {
        await this.dynamoDB.put({ TableName: this.albumTable, Item: item }).promise();
        // Return the album item as confirmation of a success operation
        return item;
    }

    /**
     * Delete an album item from Album DynamoDB table.
     * @param userId The album item owner user ID.
     * @param albumId The album ID
     * @returns The DynamoDB DeleteItemOutput.
     */
    async deleteAlbum(userId: string, albumId: string) {
        return await this.dynamoDB
            .delete({ TableName: this.albumTable, Key: { userId, albumId } })
            .promise();
    }
}
