import { AlbumVisibility } from '../../../../models/database/Album';

export default {
    type: 'object',
    properties: {
        albumId: { type: 'string', minLength: 36, maxLength: 36 },
        visibility: { enum: Object.values(AlbumVisibility) },
        title: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        genUploadUrl: { type: ['boolean'], default: false },
    },
    required: ['albumId'],
    additionalProperties: false,
} as const;
