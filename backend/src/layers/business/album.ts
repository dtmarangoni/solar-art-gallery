import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { decodeNextKey, validateLimitParam } from '@utils/dynamoDB';
import { Album } from '../../models/database/Album';
import { AlbumAccess } from '../ports/AWS/DynamoDB/albumAccess';
import { addAlbumSchema, editAlbumSchema, deleteAlbumSchema } from '@lambda/http';

// The Album Access port
const albumAccess = new AlbumAccess();

/**
 * Get all public albums items from Album database table with optional
 * pagination.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All public album items with optional pagination.
 */
export async function getPublicAlbums(limit?: string, exclusiveStartKey?: string) {
    // Validate the query params
    let queryLimit = validateLimitParam(limit);
    let queryExclusiveStartKey = decodeNextKey(exclusiveStartKey);

    // Get all public albums items from DB
    const result = await albumAccess.getPublicAlbums(queryLimit, queryExclusiveStartKey);
    // Remove the user ID before sending the album items
    // return { items: rmUserIdFromArr(result.items), lastEvaluatedKey: result.lastEvaluatedKey };
    return { items: result.items, lastEvaluatedKey: result.lastEvaluatedKey };
}

/**
 * Get all user album items from Album database table with optional
 * pagination.
 * @param userId The albums owner user ID.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All user album items with optional pagination.
 */
export async function getUserAlbums(userId: string, limit?: string, exclusiveStartKey?: string) {
    // Validate the query params
    let queryLimit = validateLimitParam(limit);
    let queryExclusiveStartKey = decodeNextKey(exclusiveStartKey);

    // Get all user albums items from DB
    const result = await albumAccess.getUserAlbums(userId, queryLimit, queryExclusiveStartKey);
    // Remove the user ID before sending the album items
    // return { items: rmUserIdFromArr(result.items), lastEvaluatedKey: result.lastEvaluatedKey };
    return { items: result.items, lastEvaluatedKey: result.lastEvaluatedKey };
}

/**
 * Query for an album item in Album database table.
 * @param albumId The album item ID.
 * @returns The album item in case it exists or throw an error
 * otherwise.
 */
export async function queryAlbum(albumId: string) {
    const album = await albumAccess.queryAlbum(albumId);
    // Check if the album has been found
    if (!album) throw new createHttpError.NotFound("This album item doesn't exists.");
    // Return the album in case it exists
    return album;
}

/**
 * Check whether an album item exists in Album database table.
 * @param albumId The album item ID.
 * @returns True if the album exists and false otherwise.
 */
export async function albumExists(albumId: string) {
    const album = await albumAccess.queryAlbum(albumId);
    // Return true if the album exists and false otherwise
    return !!album;
}

/**
 * Add an album item in Album database table.
 * @param userId The album owner user id.
 * @param albumParams The required parameters to add a new album item
 * in database.
 * @returns The added album item.
 */
export async function addAlbum(userId: string, albumParams: FromSchema<typeof addAlbumSchema>) {
    // Generate the album ID
    const albumId = uuidv4();
    // Generate the file store cover img url and pre-signed upload url
    // TODO File Store URL address, file mime type and pre-signed url
    const coverUrl = `file_store_address/${albumId}/${albumId}.mime_type`;
    const uploadUrl = `cal file store pre-signed url method with - file_store_address/${albumId}/${albumId}.mime_type`;
    const album: Album = {
        userId,
        albumId,
        creationDate: new Date().toISOString(),
        visibility: albumParams.visibility,
        title: albumParams.title,
        description: albumParams.description,
        coverUrl,
    };
    // Add the album item to DB
    await albumAccess.addAlbum(album);
    // Return the album item as confirmation of a success operation
    return { ...album, uploadUrl };
}

/**
 * Edit an album item in Album database table.
 * @param userId The album owner user id.
 * @param albumParams The required and/or optional parameters to be
 * edited in the album item.
 * @returns The edited album item.
 */
export async function editAlbum(userId: string, albumParams: FromSchema<typeof editAlbumSchema>) {
    // Verify if the album exists before editing
    // This function will throw an error if the album doesn't exists
    const album = await queryAlbum(albumParams.albumId);
    // Verify if the user calling this method is the album owner
    if (userId !== album.userId) throw new createHttpError.Forbidden('Unauthorized.');

    // Generate the file store cover img url and pre-signed upload url
    // if necessary
    // TODO File Store URL address, file mime type and pre-signed url
    const coverUrl = albumParams.coverUrl
        ? albumParams.coverUrl
        : `file_store_address/${album.albumId}/${album.albumId}.mime_type`;
    const uploadUrl = albumParams.coverUrl
        ? undefined
        : `cal file store pre-signed url method with - file_store_address/${album.albumId}/${album.albumId}.mime_type`;

    // Edit the album properties
    const editedAlbum: Album = { ...album, ...albumParams, coverUrl };
    // Edit the album item in DB
    await albumAccess.editAlbum(editedAlbum);

    // Return the album item as confirmation of a success operation
    return { ...editedAlbum, uploadUrl };
}

/**
 * Delete an album item from Album database table.
 * @param userId The album owner user id.
 * @param albumParams The identification required parameters of the
 * album being deleted.
 */
export async function deleteAlbum(
    userId: string,
    albumParams: FromSchema<typeof deleteAlbumSchema>
) {
    // Verify if the album exists before deleting
    // This function will throw an error if the album doesn't exists
    const album = await queryAlbum(albumParams.albumId);
    // Verify if the user calling this method is the album owner
    if (userId !== album.userId) throw new createHttpError.Forbidden('Unauthorized.');

    // Delete the album item from DB
    await albumAccess.deleteAlbum(userId, albumParams.albumId);
    // Return the album item as confirmation of a success operation
    return album;
}

/**
 * Utility method to remove userId from album items. Useful for request
 * responses.
 * @param album The complete album item.
 * @returns The new album item without the userId property.
 */
function rmUserId(album: Album) {
    const { userId, ...newAlbum } = album;
    return newAlbum;
}

/**
 * Utility method to remove userId from an array of album items. Useful
 * for request responses.
 * @param albums The complete album items array.
 * @returns The new album item array without the userId property.
 */
function rmUserIdFromArr(albums: Album[]) {
    const newAlbums = albums.map((album) => {
        const { userId, ...newAlbum } = album;
        return newAlbum;
    });
    return newAlbums;
}
