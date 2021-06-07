import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { decodeNextKey, validateLimitParam } from '@utils/dynamoDB';
import { ArtAccess } from '../ports/AWS/DynamoDB/artAccess';
import { AlbumVisibility } from '../../models/database/Album';
import { queryAlbum } from './album';
import { putArtsSchema } from '@lambda/http/index';

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

/**
 * Add and/or update multiple arts to an user album in Art database
 * table.
 * @param albumId The album ID.
 * @param userId The art owner user id.
 * @param artParams The required parameters to add and/or update
 * multiple arts items in database.
 * @returns The added and/or updated arts items.
 */
export async function putArts(
    albumId: string,
    userId: string,
    artParams: FromSchema<typeof putArtsSchema>
) {
    // Verify if the album exists before adding and/or updating the
    // arts items
    // This function will throw an error if the album doesn't exists
    const album = await queryAlbum(albumId);
    // Verify if the user calling this method is the album owner
    if (userId !== album.userId) throw new createHttpError.Forbidden('Unauthorized.');

    // Get the arts items data prepared for DB and file store
    const arts = await prepareArtsData(albumId, userId, artParams);

    // Add and/or update the arts items in DB
    // Do not send to DB the pre-signed url field
    await artAccess.putArts(
        arts.map((art) => {
            const { uploadUrl, ...artData } = art;
            return artData;
        })
    );

    // Return the arts items as confirmation of a success operation
    return arts;
}

/**
 * Prepare the arts items data to be added to DB and file store.
 * @param albumId The album ID.
 * @param userId The art owner user id.
 * @param artParams The required parameters to add and/or update
 * multiple arts items in database.
 * @returns The prepared arts items data.
 */
async function prepareArtsData(
    albumId: string,
    userId: string,
    artParams: FromSchema<typeof putArtsSchema>
) {
    return artParams.arts.map((artParam, sequenceNum) => {
        // Generate an art Id for new items
        const artId = artParam.artId ? artParam.artId : uuidv4();
        // Generate the file store img url and pre-signed upload url if
        // necessary
        // TODO File Store URL address, file mime type and pre-signed url
        const imgUrl = artParam.imgUrl
            ? artParam.imgUrl
            : `file_store_address/${albumId}/arts/${artId}.mime_type`;
        const uploadUrl = artParam.imgUrl
            ? undefined
            : `cal file store pre-signed url method with - file_store_address/${albumId}/arts/${artId}.mime_type`;
        return {
            albumId,
            artId,
            sequenceNum,
            userId,
            creationDate: artParam.creationDate ? artParam.creationDate : new Date().toISOString(),
            title: artParam.title,
            description: artParam.description,
            imgUrl,
            uploadUrl,
        };
    });
}
