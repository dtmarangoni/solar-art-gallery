import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { decodeNextKey, validateLimitParam } from '@utils/dynamoDB';
import { Art } from '../../models/database/Art';
import { ArtAccess } from '../ports/AWS/DynamoDB/artAccess';
import { AlbumVisibility } from '../../models/database/Album';
import { queryAlbum } from './album';

// The Art Access port
const artAccess = new ArtAccess();

/**
 * Get all arts items of a public album from Art database table with
 * optional pagination.
 * @param albumId The album id.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All arts items of public album with optional pagination.
 */
export async function getPublicAlbumArts(
    albumId: string,
    limit?: string,
    exclusiveStartKey?: string
) {
    // Retrieve the album item from DB
    const album = await queryAlbum(albumId);
    // Verify if the album visibility is public before continuing
    if (album.visibility != AlbumVisibility.public)
        throw new createHttpError.Forbidden('Unauthorized access.');

    // Validate the query params
    let queryLimit = validateLimitParam(limit);
    let queryExclusiveStartKey = decodeNextKey(exclusiveStartKey);

    // Get all arts of an album from DB
    const result = await artAccess.getAlbumArts(albumId, queryLimit, queryExclusiveStartKey);
    // Return the arts items of an album
    return { items: result.items, lastEvaluatedKey: result.lastEvaluatedKey };
}

/**
 * Get all user arts items of an album from Art database table with
 * optional pagination.
 * @param userId The albums owner user ID.
 * @param albumId The album id.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All arts items of public album with optional pagination.
 */
export async function getUserAlbumArts(
    userId: string,
    albumId: string,
    limit?: string,
    exclusiveStartKey?: string
) {
    // Retrieve the album item from DB
    const album = await queryAlbum(albumId);
    // Verify if the user calling this method is the album owner
    if (userId !== album.userId) throw new createHttpError.Forbidden('Unauthorized access.');

    // Validate the query params
    let queryLimit = validateLimitParam(limit);
    let queryExclusiveStartKey = decodeNextKey(exclusiveStartKey);

    // Get all user arts of an album from DB
    const result = await artAccess.getAlbumArts(albumId, queryLimit, queryExclusiveStartKey);
    // Return the arts items of an album
    return { items: result.items, lastEvaluatedKey: result.lastEvaluatedKey };
}
