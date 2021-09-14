export default {
    type: 'array',
    minItems: 1,
    uniqueItems: true,
    items: {
        type: 'object',
        properties: {
            albumId: { type: 'string', minLength: 36, maxLength: 36 },
            artId: { type: 'string', minLength: 36, maxLength: 36 },
        },
        required: ['albumId', 'artId'],
        additionalProperties: false,
    },
} as const;
