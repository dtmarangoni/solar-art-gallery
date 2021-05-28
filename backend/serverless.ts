import type { AWS } from '@serverless/typescript';

import {
    getPublicAlbums,
    getUserAlbums,
    addAlbum,
    editAlbum,
    deleteAlbum,
    getAlbumArts,
} from '@lambda/http';
import { authorizer } from '@lambda/auth';

const serverlessConfiguration: AWS = {
    service: 'solar-art-gallery',
    frameworkVersion: '2',
    plugins: [
        'serverless-webpack',
        'serverless-iam-roles-per-function',
        'serverless-pseudo-parameters',
        'serverless-s3-remover',
        'serverless-dynamodb-seed',
        'serverless-offline',
        'serverless-dynamodb-local',
        'serverless-s3-local',
    ],
    package: { individually: true },
    useDotenv: true,
    provider: {
        name: 'aws',
        profile: '${env:AWS_PROFILE}',
        region: 'sa-east-1',
        stage: "${opt:stage, 'dev'}",
        runtime: 'nodejs14.x',
        apiGateway: { minimumCompressionSize: 1024, shouldStartNameWithService: true },
        // tracing: { apiGateway: true, lambda: true },  Add when enabling AWS X-Ray tracing
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            ALBUM_TABLE: 'Album-${self:provider.stage}',
            ALBUM_LOCAL_INDEX: 'AlbumLocalIndex-${self:provider.stage}',
            ALBUM_GLOBAL_INDEX: 'AlbumGlobalIndex-${self:provider.stage}',
            ART_TABLE: 'Art-${self:provider.stage}',
            ART_LOCAL_INDEX: 'ArtLocalIndex-${self:provider.stage}',
            IMAGES_S3_BUCKET: 'serverless-dtm-todo-images-${self:provider.stage}',
            S3_SIGNED_URL_EXP: '300',
        },
        lambdaHashingVersion: '20201221',
    },
    custom: {
        webpack: { webpackConfig: './webpack.config.js', includeModules: true },
        dotenvVars: '${file(dotenv.config.js)}',
        remover: { buckets: ['${self:provider.environment.IMAGES_S3_BUCKET}'] },
        'serverless-iam-roles-per-function': { defaultInherit: true },
        'serverless-offline': { httpPort: 4000 },
        seed: {
            awsAlbumSeed: {
                table: '${self:provider.environment.ALBUM_TABLE}',
                sources: ['./mock/database/albumSeed.json'],
            },
            awsArtSeed: {
                table: '${self:provider.environment.ART_TABLE}',
                sources: ['./mock/database/artSeed.json'],
            },
        },
        dynamodb: {
            stages: ['${self:provider.stage}'],
            start: { port: 5000, inMemory: true, migrate: true, seed: true },
            seed: {
                album: {
                    sources: [
                        {
                            table: '${self:provider.environment.ALBUM_TABLE}',
                            sources: ['./mock/database/albumSeed.json'],
                        },
                    ],
                },
                art: {
                    sources: [
                        {
                            table: '${self:provider.environment.ART_TABLE}',
                            sources: ['./mock/database/artSeed.json'],
                        },
                    ],
                },
            },
        },
        s3: { port: 6000 },
    },
    functions: {
        authorizer,
        getPublicAlbums,
        getUserAlbums,
        addAlbum,
        editAlbum,
        deleteAlbum,
        getAlbumArts,
    },
    resources: {
        Resources: {
            AlbumDynamoDBTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:provider.environment.ALBUM_TABLE}',
                    AttributeDefinitions: [
                        { AttributeName: 'userId', AttributeType: 'S' },
                        { AttributeName: 'albumId', AttributeType: 'S' },
                        { AttributeName: 'creationDate', AttributeType: 'S' },
                        { AttributeName: 'visibility', AttributeType: 'S' },
                    ],
                    KeySchema: [
                        { AttributeName: 'userId', KeyType: 'HASH' },
                        { AttributeName: 'albumId', KeyType: 'RANGE' },
                    ],
                    LocalSecondaryIndexes: [
                        {
                            IndexName: '${self:provider.environment.ALBUM_LOCAL_INDEX}',
                            KeySchema: [
                                { AttributeName: 'userId', KeyType: 'HASH' },
                                { AttributeName: 'creationDate', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: '${self:provider.environment.ALBUM_GLOBAL_INDEX}',
                            KeySchema: [
                                { AttributeName: 'visibility', KeyType: 'HASH' },
                                { AttributeName: 'creationDate', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                },
            },
            ArtDynamoDBTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:provider.environment.ART_TABLE}',
                    AttributeDefinitions: [
                        { AttributeName: 'albumId', AttributeType: 'S' },
                        { AttributeName: 'artId', AttributeType: 'S' },
                        { AttributeName: 'sequenceNum', AttributeType: 'N' },
                    ],
                    KeySchema: [
                        { AttributeName: 'albumId', KeyType: 'HASH' },
                        { AttributeName: 'artId', KeyType: 'RANGE' },
                    ],
                    LocalSecondaryIndexes: [
                        {
                            IndexName: '${self:provider.environment.ART_LOCAL_INDEX}',
                            KeySchema: [
                                { AttributeName: 'albumId', KeyType: 'HASH' },
                                { AttributeName: 'sequenceNum', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                },
            },
            // ImagesS3Bucket: {
            //     Type: 'AWS::S3::Bucket',
            //     Properties: {
            //         BucketName: '${self:provider.environment.IMAGES_S3_BUCKET}',
            //         CorsConfiguration: {
            //             CorsRules: [
            //                 {
            //                     AllowedOrigins: ['*'],
            //                     AllowedHeaders: ['*'],
            //                     AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            //                     MaxAge: 3000,
            //                 },
            //             ],
            //         },
            //     },
            // },
            // ImagesS3BucketPolicy: {
            //     Type: 'AWS::S3::BucketPolicy',
            //     Properties: {
            //         Bucket: { Ref: 'ImagesS3Bucket' },
            //         PolicyDocument: {
            //             Id: 'ImagesS3BucketPolicy',
            //             Version: '2012-10-17',
            //             Statement: [
            //                 {
            //                     Sid: 'PublicReadForGetBucketObjects',
            //                     Effect: 'Allow',
            //                     Principal: '*',
            //                     Action: 'S3:GetObject',
            //                     Resource:
            //                         'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*',
            //                 },
            //             ],
            //         },
            //     },
            // },
            APIGatewayResponseDefault4xx: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    ResponseType: 'DEFAULT_4XX',
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers':
                            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
                        'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,POST,OPTIONS'",
                    },
                    RestApiId: { Ref: 'ApiGatewayRestApi' },
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
