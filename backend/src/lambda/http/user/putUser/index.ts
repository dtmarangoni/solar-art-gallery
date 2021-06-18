import { handlerPath } from '@utils/lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    environment: { AUTH0_USER_INFO_URI: '${env:AUTH0_USER_INFO_URI}' },
    events: [
        {
            http: {
                method: 'put',
                path: '/user',
                cors: true,
                authorizer: {
                    name: 'Authorizer',
                    arn: { 'Fn::GetAtt': ['AuthorizerLambdaFunction', 'Arn'] },
                },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamoDB:GetItem', 'dynamoDB:PutItem'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.USER_TABLE}',
            ],
        },
    ],
};
