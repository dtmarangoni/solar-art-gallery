import { AlbumVisibility } from '../../../../models/database/Album';

export default {
    type: 'object',
    properties: {
        albumId: { type: 'string', minLength: 36, maxLength: 36 },
        creationDate: { type: 'string', minLength: 20, maxLength: 20 },
        visibility: { enum: Object.values(AlbumVisibility) },
        title: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        coverUrl: { type: ['string', 'null'] },
    },
    required: ['albumId'],
    additionalProperties: false,
} as const;
