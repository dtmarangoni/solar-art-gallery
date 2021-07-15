import { handlerPath } from '@utils/lambda';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            stream: {
                type: 'dynamodb',
                arn: { 'Fn::GetAtt': ['AlbumDynamoDBTable', 'StreamArn'] },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamoDB:Query', 'dynamoDB:BatchWriteItem'],
            Resource: [
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ART_TABLE}',
                'arn:aws:dynamodb:${self:provider.region}:#{AWS::AccountId}:table/${self:provider.environment.ART_TABLE}/index/${self:provider.environment.ART_ALBUM_ID_LSI}',
            ],
        },
    ],
};
