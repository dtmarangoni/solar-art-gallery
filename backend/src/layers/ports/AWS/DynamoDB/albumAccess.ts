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
     * @param albumVisibilityGSI Album table visibility global
     * secondary index.
     * @param albumAlbumIdGSI Album table album ID global secondary
     * index.
     * @param albumUserIdLSI Album table user ID local secondary index.
     */
    constructor(
        private readonly dynamoDB = AlbumAccess.createDBClient(),
        private readonly albumTable = process.env.ALBUM_TABLE,
        private readonly albumVisibilityGSI = process.env.ALBUM_VISIBILITY_GSI,
        private readonly albumAlbumIdGSI = process.env.ALBUM_ALBUM_ID_GSI,
        private readonly albumUserIdLSI = process.env.ALBUM_USER_ID_LSI
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
                IndexName: this.albumVisibilityGSI,
                KeyConditionExpression: 'visibility = :visibility',
                ExpressionAttributeValues: { ':visibility': AlbumVisibility.public },
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
                ScanIndexForward: false,
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
                IndexName: this.albumUserIdLSI,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: { ':userId': userId },
                Limit: limit,
                ExclusiveStartKey: exclusiveStartKey,
                ScanIndexForward: false,
            })
            .promise();
        return { items: result.Items as Album[], lastEvaluatedKey: result.LastEvaluatedKey };
    }

    /**
     * Query for an album item in Album DynamoDB table.
     * @param albumId The album ID.
     * @returns The album item.
     */
    async queryAlbum(albumId: string) {
        const result = await this.dynamoDB
            .query({
                TableName: this.albumTable,
                IndexName: this.albumAlbumIdGSI,
                KeyConditionExpression: 'albumId = :albumId',
                ExpressionAttributeValues: { ':albumId': albumId },
            })
            .promise();
        return result.Items[0] as Album;
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
