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
        {
            stream: {
                type: 'dynamodb',
                arn: { 'Fn::GetAtt': ['ArtDynamoDBTable', 'StreamArn'] },
            },
        },
    ],
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: ['arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}'],
        },
        {
            Effect: 'Allow',
            Action: ['s3:DeleteObject'],
            Resource: ['arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'],
        },
    ],
};
