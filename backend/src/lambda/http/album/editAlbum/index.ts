import { handlerPath } from '@utils/lambda';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'patch',
                path: '/album/my',
                cors: true,
                authorizer: {
                    name: 'Authorizer',
                    arn: { 'Fn::GetAtt': ['AuthorizerLambdaFunction', 'Arn'] },
                },
                request: { schemas: { 'application/json': schema } },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamoDB:Query', 'dynamoDB:PutItem'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ALBUM_TABLE}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ALBUM_TABLE}/index/${self:provider.environment.ALBUM_ALBUM_ID_GSI}',
            ],
        },
        {
            Effect: 'Allow',
            Action: ['s3:GetObject', 's3:PutObject'],
            Resource: ['arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'],
        },
    ],
};
