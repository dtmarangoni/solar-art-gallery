import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

export class FileStoreAccess {
    /**
     * Constructs a FileStoreAccess instance.
     * @param s3Client The S3 file store client.
     * @param s3Bucket The S3 bucket name.
     * @param signedUrlExp The S3 bucket pre-signed URL expiration time
     * in seconds.
     */
    constructor(
        private readonly s3Client = FileStoreAccess.createS3Client(),
        private readonly s3Bucket = process.env.IMAGES_S3_BUCKET,
        private readonly signedUrlExp = process.env.S3_SIGNED_URL_EXP
    ) {}

    /**
     * Return the live or offline S3 client depending on serverless
     * running mode.
     * @returns The S3 client.
     */
    private static createS3Client() {
        // Serverless running in offline mode
        if (process.env.IS_OFFLINE) {
            // Serverless offline doesn't support X-Ray so far
            return new AWS.S3({
                s3ForcePathStyle: true,
                accessKeyId: 'S3RVER',
                secretAccessKey: 'S3RVER',
                endpoint: new AWS.Endpoint('http://localhost:6000'),
            });
        } else {
            // Running in live mode, thus encapsulate AWS SDK to use
            // AWS X-Ray
            const XAWS = AWSXRay.captureAWS(AWS);
            return new XAWS.S3({ signatureVersion: 'v4' });
        }
    }

    /**
     * Gets the S3 file store http address.
     * @returns The S3 file store http address.
     */
    getFileStoreAddress() {
        return `https://${this.s3Bucket}.s3.amazonaws.com`;
    }

    /**
     * Generates a pre-signed URL allowing an object download from S3
     * file store.
     * @param folderPath The full folder path where the object resides
     * in the file store.
     * @param objKeyName The key name of the object to be downloaded.
     * @returns The pre-signed URL allowing the GET object operation to
     * S3 file store.
     */
    genGetPreSignedUrl(folderPath: string, objKeyName: string) {
        return this.s3Client.getSignedUrl('getObject', {
            Bucket: this.s3Bucket,
            Key: `${folderPath}/${objKeyName}`,
            Expires: +this.signedUrlExp,
        });
    }

    /**
     * Generates a pre-signed URL allowing a new object upload to S3
     * file store.
     * @param folderPath The full folder path where to insert the
     * object in the file store.
     * @param objKeyName The key name of the object to be uploaded.
     * @returns The pre-signed URL allowing the PUT object operation to
     * S3 file store.
     */
    genPutPreSignedUrl(folderPath: string, objKeyName: string) {
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3Bucket,
            Key: `${folderPath}/${objKeyName}`,
            Expires: +this.signedUrlExp,
        });
    }

    /**
     * Lists all objects inside a path in S3 file store.
     * @param folderPath The full folder path where the objects resides
     * in the file store.
     * @returns The S3 List Objects V2 Output.
     */
    async listObjects(folderPath?: string) {
        return await this.s3Client
            .listObjectsV2({ Bucket: this.s3Bucket, Prefix: folderPath })
            .promise();
    }

    /**
     * Deletes an object from S3 file store.
     * @param folderPath The full folder path where the object resides
     * in the file store.
     * @param objKeyName The key name of the object to be deleted.
     * @returns The S3 file store Delete Object Output.
     */
    async deleteObject(folderPath: string, objKeyName: string) {
        return await this.s3Client
            .deleteObject({ Bucket: this.s3Bucket, Key: `${folderPath}/${objKeyName}` })
            .promise();
    }

    /**
     * Delete multiple objects from S3 file store.
     * @param objects The objects array containing the file store
     * folder path and the key name for each object to be deleted.
     * @returns The S3 file store Delete Objects Output.
     */
    async deleteObjectsByKeys(objects: { folderPath: string; keyName: string }[]) {
        return await this.s3Client
            .deleteObjects({
                Bucket: this.s3Bucket,
                Delete: {
                    Objects: objects.map((object) => ({
                        Key: `${object.folderPath}/${object.keyName}`,
                    })),
                },
            })
            .promise();
    }

    /**
     * Delete multiple objects from S3 file store.
     * @param objectsPaths The array containing the file store full
     * folder path for each object to be deleted.
     * @returns The S3 file store Delete Objects Output.
     */
    async deleteObjectsByPath(objectsPaths: string[]) {
        return await this.s3Client
            .deleteObjects({
                Bucket: this.s3Bucket,
                Delete: { Objects: objectsPaths.map((objPath) => ({ Key: `${objPath}` })) },
            })
            .promise();
    }
}
