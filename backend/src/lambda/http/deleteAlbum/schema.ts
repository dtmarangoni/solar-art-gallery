export default {
    type: 'object',
    properties: {
        albumId: { type: 'string', minLength: 37, maxLength: 37 },
    },
    required: ['albumId'],
    additionalProperties: false,
} as const;
