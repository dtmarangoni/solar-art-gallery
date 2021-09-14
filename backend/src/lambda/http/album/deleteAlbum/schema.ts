export default {
    type: 'object',
    properties: {
        albumId: { type: 'string', minLength: 36, maxLength: 36 },
    },
    required: ['albumId'],
    additionalProperties: false,
} as const;
