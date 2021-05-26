import { AlbumVisibility } from '../../../models/database/Album';

export default {
    type: 'object',
    properties: {
        visibility: { enum: Object.values(AlbumVisibility) },
        title: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
    },
    required: ['visibility', 'title', 'description'],
    additionalProperties: false,
} as const;
