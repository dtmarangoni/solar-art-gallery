export default {
    type: 'array',
    minItems: 1,
    uniqueItems: true,
    items: {
        type: 'object',
        properties: {
            albumId: { type: 'string', minLength: 36, maxLength: 36 },
            artId: { type: 'string', minLength: 36, maxLength: 36 },
            title: { type: 'string', minLength: 1 },
            description: { type: 'string', minLength: 1 },
            genUploadUrl: { type: ['boolean'], default: false },
        },
        required: ['albumId'],
        additionalProperties: false,
    },
} as const;
