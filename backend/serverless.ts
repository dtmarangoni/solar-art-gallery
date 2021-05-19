import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: 'solar-art-gallery',
    frameworkVersion: '2',
    plugins: [
        'serverless-webpack',
        'serverless-iam-roles-per-function',
        'serverless-pseudo-parameters',
        'serverless-s3-remover',
        'serverless-offline',
        'serverless-dynamodb-local',
        'serverless-s3-local',
    ],
    package: { individually: true },
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
            TODO_TABLE: 'Todo-${self:provider.stage}',
            TODO_INDEX: 'TodoIndex',
            IMAGES_S3_BUCKET: 'serverless-dtm-todo-images-${self:provider.stage}',
            S3_SIGNED_URL_EXP: '300',
        },
        lambdaHashingVersion: '20201221',
    },
    custom: {
        webpack: { webpackConfig: './webpack.config.js', includeModules: true },
        remover: { buckets: ['${self:provider.environment.IMAGES_S3_BUCKET}'] },
        'serverless-iam-roles-per-function': { defaultInherit: true },
        'serverless-offline': { httpPort: 4000 },
        dynamodb: {
            stages: ['${self:provider.stage}'],
            start: { port: 5000, inMemory: true, migrate: true, seed: true },
            seed: {
                todo: {
                    sources: [
                        {
                            table: '${self:provider.environment.TODO_TABLE}',
                            sources: ['./mock/dbSeed/todoSeed.json'],
                        },
                    ],
                },
            },
        },
        s3: { port: 6000 },
    },
    functions: {},
    resources: { Resources: {} },
};

module.exports = serverlessConfiguration;
