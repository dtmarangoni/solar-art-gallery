import { handlerPath } from '@utils/lambda';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: '/art/public',
                cors: true,
                request: { schemas: { 'application/json': schema } },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamoDB:Query'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ALBUM_TABLE}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ALBUM_TABLE}/index/${self:provider.environment.ALBUM_ALBUM_ID_GSI}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ART_TABLE}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ART_TABLE}/index/${self:provider.environment.ART_ALBUM_ID_LSI}',
            ],
        },
    ],
};
