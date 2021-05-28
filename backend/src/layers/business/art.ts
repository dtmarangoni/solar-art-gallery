import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { decodeNextKey, validateLimitParam } from '@utils/dynamoDB';
import { Art } from '../../models/database/Art';
import { ArtAccess } from '../ports/AWS/DynamoDB/artAccess';

// The Art Access port
const artAccess = new ArtAccess();

/**
 * Get all album arts items from Art database table with optional
 * pagination.
 * @param albumId The album id.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All album arts items with optional pagination.
 */
export async function getAlbumArts(albumId: string, limit?: string, exclusiveStartKey?: string) {
    // Validate the query params
    let queryLimit = validateLimitParam(limit);
    let queryExclusiveStartKey = decodeNextKey(exclusiveStartKey);
    // Get all album arts items from DB
    const result = await artAccess.getAlbumArts(albumId, queryLimit, queryExclusiveStartKey);
    // Return the album arts items
    return { items: result.items, lastEvaluatedKey: result.lastEvaluatedKey };
}
