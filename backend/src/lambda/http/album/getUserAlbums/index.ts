import { handlerPath } from '@utils/lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: '/album/my',
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
            Action: ['dynamoDB:Query'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ALBUM_TABLE}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ALBUM_TABLE}/index/${self:provider.environment.ALBUM_USER_ID_LSI}',
            ],
        },
        {
            Effect: 'Allow',
            Action: ['s3:GetObject'],
            Resource: ['arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'],
        },
    ],
};
