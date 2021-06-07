export default {
    type: 'object',
    properties: {
        arts: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
                type: 'object',
                properties: {
                    albumId: { type: 'string', minLength: 36, maxLength: 36 },
                    artId: { type: 'string', minLength: 36, maxLength: 36 },
                    sequenceNum: { type: 'integer', minimum: 0 },
                    creationDate: { type: 'string', minLength: 20, maxLength: 20 },
                    title: { type: 'string', minLength: 1 },
                    description: { type: 'string', minLength: 1 },
                    imgUrl: { type: 'string' },
                },
                additionalProperties: false,
            },
        },
    },
    required: ['arts'],
    additionalProperties: false,
} as const;
