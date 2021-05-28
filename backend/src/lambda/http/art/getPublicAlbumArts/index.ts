import { handlerPath } from '@utils/lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [{ http: { method: 'get', path: '/album/public/{albumId}', cors: true } }],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamoDB:Query'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.ART_TABLE}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ART_TABLE}/index/${self:provider.environment.ART_LOCAL_INDEX}',
            ],
        },
    ],
};
