import { AlbumVisibility } from '../../../models/database/Album';

export default {
    type: 'object',
    properties: {
        albumId: { type: 'string', minLength: 37, maxLength: 37 },
        visibility: { enum: Object.values(AlbumVisibility) },
        title: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
    },
    required: ['albumId'],
    additionalProperties: false,
} as const;
