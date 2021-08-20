import type { AWS } from '@serverless/typescript';

import {
    getPublicAlbums,
    getUserAlbums,
    addAlbum,
    editAlbum,
    deleteAlbum,
    getPublicAlbumArts,
    getUserAlbumArts,
    putArts,
    deleteArts,
    putUser,
} from '@lambda/http';
import { deleteAlbumArts, deleteS3Objects } from '@lambda/dynamoDB';
import { authorizer } from '@lambda/auth';

const serverlessConfiguration: AWS = {
    service: 'solar-art-gallery',
    frameworkVersion: '2',
    plugins: [
        'serverless-webpack',
        'serverless-iam-roles-per-function',
        'serverless-pseudo-parameters',
        'serverless-s3-remover',
        'serverless-s3-sync',
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
        tracing: { apiGateway: true, lambda: true },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            ALBUM_TABLE: 'Album-${self:provider.stage}',
            ALBUM_USER_ID_LSI: 'AlbumUserIdLSI-${self:provider.stage}',
            ALBUM_VISIBILITY_GSI: 'AlbumVisibilityGSI-${self:provider.stage}',
            ALBUM_ALBUM_ID_GSI: 'AlbumAlbumIdGSI-${self:provider.stage}',
            ART_TABLE: 'Art-${self:provider.stage}',
            ART_ALBUM_ID_LSI: 'ArtAlbumIdLSI-${self:provider.stage}',
            USER_TABLE: 'User-${self:provider.stage}',
            IMAGES_S3_BUCKET: 'solar-art-gallery-images-${self:provider.stage}',
            S3_SIGNED_URL_EXP: '900',
        },
        lambdaHashingVersion: '20201221',
    },
    custom: {
        webpack: { webpackConfig: './webpack.config.js', includeModules: true },
        dotenvVars: '${file(dotenv.config.js)}',
        remover: { buckets: ['${self:provider.environment.IMAGES_S3_BUCKET}'] },
        'serverless-iam-roles-per-function': { defaultInherit: true },
        'serverless-offline': { httpPort: 4000, lambdaPort: 4001, websocketPort: 4002 },
        seed: {
            awsAlbumSeed: {
                table: '${self:provider.environment.ALBUM_TABLE}',
                sources: ['./mock/database/albumSeed.json'],
            },
            awsArtSeed: {
                table: '${self:provider.environment.ART_TABLE}',
                sources: ['./mock/database/artSeed.json'],
            },
            awsUserSeed: {
                table: '${self:provider.environment.USER_TABLE}',
                sources: ['./mock/database/userSeed.json'],
            },
        },
        s3Sync: [
            {
                bucketName: '${self:provider.environment.IMAGES_S3_BUCKET}',
                localDir: './mock/filestore',
            },
        ],
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
        getPublicAlbumArts,
        getUserAlbumArts,
        putArts,
        deleteArts,
        deleteAlbumArts,
        deleteS3Objects,
        putUser,
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
                            IndexName: '${self:provider.environment.ALBUM_USER_ID_LSI}',
                            KeySchema: [
                                { AttributeName: 'userId', KeyType: 'HASH' },
                                { AttributeName: 'creationDate', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: '${self:provider.environment.ALBUM_VISIBILITY_GSI}',
                            KeySchema: [
                                { AttributeName: 'visibility', KeyType: 'HASH' },
                                { AttributeName: 'creationDate', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                        {
                            IndexName: '${self:provider.environment.ALBUM_ALBUM_ID_GSI}',
                            KeySchema: [
                                { AttributeName: 'albumId', KeyType: 'HASH' },
                                { AttributeName: 'creationDate', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                    StreamSpecification: { StreamViewType: 'KEYS_ONLY' },
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
                            IndexName: '${self:provider.environment.ART_ALBUM_ID_LSI}',
                            KeySchema: [
                                { AttributeName: 'albumId', KeyType: 'HASH' },
                                { AttributeName: 'sequenceNum', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                    StreamSpecification: { StreamViewType: 'KEYS_ONLY' },
                },
            },
            UserDynamoDBTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:provider.environment.USER_TABLE}',
                    AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
                    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
                    BillingMode: 'PAY_PER_REQUEST',
                },
            },
            ImagesS3Bucket: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: '${self:provider.environment.IMAGES_S3_BUCKET}',
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedOrigins: ['*'],
                                AllowedHeaders: ['*'],
                                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                                MaxAge: 3000,
                            },
                        ],
                    },
                },
            },
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
