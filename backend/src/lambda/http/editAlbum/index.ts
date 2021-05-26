import { handlerPath } from '@utils/lambda';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'patch',
                path: '/album/my/{albumId}',
                cors: true,
                authorizer: {
                    name: 'Authorizer',
                    arn: { 'Fn::GetAtt': ['AuthorizerLambdaFunction', 'Arn'] },
                },
                request: {
                    schemas: {
                        'application/json': schema,
                    },
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamoDB:GetItem', 'dynamoDB:PutItem'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.ALBUM_TABLE}',
            ],
        },
    ],
};
