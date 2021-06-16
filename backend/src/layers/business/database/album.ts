import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { validatePaginationParams } from '@utils/dynamoDB';
import { rmUserId, rmUserIdFromArr } from '@utils/general';
import { Album } from '../../../models/database/Album';
import { AlbumAccess } from '../../ports/AWS/DynamoDB/albumAccess';
import { addAlbumSchema, editAlbumSchema, deleteAlbumSchema } from '@lambda/http';
import { getDownloadSignedUrl, getFsAlbumFolder, getUploadSignedUrl } from '../fileStore';

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
    let { searchLimit, searchStartKey } = validatePaginationParams(limit, exclusiveStartKey);

    // Get all public albums items from DB
    const result = await albumAccess.getPublicAlbums(searchLimit, searchStartKey);

    // Remove user ID from items and generate a download pre-signed url
    const albums = prepAlbumsRespData(result.items);

    return { items: albums, lastEvaluatedKey: result.lastEvaluatedKey };
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
    let { searchLimit, searchStartKey } = validatePaginationParams(limit, exclusiveStartKey);

    // Get all user albums items from DB
    const result = await albumAccess.getUserAlbums(userId, searchLimit, searchStartKey);

    // Remove user ID from items and generate a download pre-signed url
    const albums = prepAlbumsRespData(result.items);

    return { items: albums, lastEvaluatedKey: result.lastEvaluatedKey };
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
    const { coverUrl, uploadUrl } = fsAlbumUrls(albumId, true);

    // Create the new album item
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

    // Remove user ID and return the album as success confirmation
    return { ...rmUserId(album), uploadUrl };
}

/**
 * Edit an album item in Album database table.
 * @param userId The album owner user id.
 * @param albumParams The required and/or optional parameters to be
 * edited in the album item.
 * @returns The edited album item.
 */
export async function editAlbum(userId: string, albumParams: FromSchema<typeof editAlbumSchema>) {
    // Verify if the album exists and the user ownership before
    // editing. This function will throw an error if not OK
    const album = await albumOwnership(userId, albumParams.albumId);

    // Generate the pre-signed urls if necessary
    const { coverUrl, uploadUrl } = fsAlbumUrls(album.albumId, albumParams.genUploadUrl);

    // Remove the genUploadUrl flag before return the art data
    const { genUploadUrl, ...newParams } = albumParams;
    // Edit the album properties
    const editedAlbum: Album = { ...album, ...newParams, coverUrl };
    // Edit the album item in DB
    await albumAccess.editAlbum(editedAlbum);

    // Remove user ID and return the album as success confirmation
    return { ...rmUserId(editedAlbum), uploadUrl };
}

/**
 * Delete an album item from Album database table.
 * @param userId The album owner user ID.
 * @param albumParams The identification required parameters of the
 * album being deleted.
 * @returns The deleted album item ID.
 */
export async function deleteAlbum(
    userId: string,
    albumParams: FromSchema<typeof deleteAlbumSchema>
) {
    // Verify if the album exists and the user ownership before
    // deleting. This function will throw an error if not OK
    await albumOwnership(userId, albumParams.albumId);

    // Delete the album item from DB
    await albumAccess.deleteAlbum(userId, albumParams.albumId);
    // Return the album item as confirmation of a success operation
    return albumParams;

    // TODO Remove album cover and all arts images from file store
}

/**
 * Check whether an album item exists in database table and if the user
 * is the album owner.
 * @param userId The user ID.
 * @param albumId The album item ID.
 * @returns The album item if it exists and if the user is the its
 * owner or throw an error otherwise.
 */
export async function albumOwnership(userId: string, albumId: string) {
    const album = await queryAlbum(albumId);
    // Verify if the user is the album owner
    if (userId !== album.userId) throw new createHttpError.Forbidden('Unauthorized.');
    // Return the album item if its all OK
    return album;
}

/**
 * Generate the file store pre-signed download and the pre-signed
 * upload url for an album cover image if necessary.
 * @param albumId The album ID.
 * @param genUploadUrl The optional flag indicating that a pre-signed
 * upload url should be generated for an album cover image.
 * @returns An object containing the final download and upload
 * pre-signed urls.
 */
function fsAlbumUrls(albumId: string, genUploadUrl?: boolean) {
    if (genUploadUrl) {
        return {
            coverUrl: getDownloadSignedUrl(getFsAlbumFolder(albumId), albumId),
            uploadUrl: getUploadSignedUrl(getFsAlbumFolder(albumId), albumId),
        };
    }

    return { coverUrl: undefined, uploadUrl: undefined };
}

/**
 * Prepared the albums items data to response removing the user ID and
 * generating the pre-signed download url.
 * @param items The albums items.
 * @returns The prepared albums data without the user ID and with the
 * pre-signed urls.
 */
function prepAlbumsRespData(items: Album[]) {
    return rmUserIdFromArr(items).map((item) => ({
        ...item,
        coverUrl: getDownloadSignedUrl(getFsAlbumFolder(item.albumId), item.albumId),
    }));
}
