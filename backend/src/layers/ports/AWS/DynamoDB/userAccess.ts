import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

import { User } from '../../../../models/database/User';

export class UserAccess {
    /**
     * Constructs an UserAccess instance.
     * @param dynamoDB AWS DynamoDB instance.
     * @param userTable User table name.
     */
    constructor(
        private readonly dynamoDB = UserAccess.createDBClient(),
        private readonly userTable = process.env.USER_TABLE
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
     * Get an user item from User DynamoDB table.
     * @param userId The user ID.
     * @returns The user item.
     */
    async getUser(userId: string) {
        const result = await this.dynamoDB
            .get({ TableName: this.userTable, Key: { userId } })
            .promise();
        return result.Item as User;
    }

    /**
     * Add or edit an user item in User DynamoDB table.
     * @param item The user item.
     * @returns The added or edited user item.
     */
    async putUser(item: User) {
        await this.dynamoDB.put({ TableName: this.userTable, Item: item }).promise();
        // Return the user item as confirmation of a success operation
        return item;
    }
}
