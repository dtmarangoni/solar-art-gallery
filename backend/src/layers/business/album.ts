import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { decodeNextKey, validateLimitParam } from '@utils/dynamoDB';
import { Album } from '../../models/database/Album';
import { AlbumAccess } from '../ports/AWS/DynamoDB/albumAccess';
import { default as addAlbumSchema } from '@lambda/http/addAlbum/schema';

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
    const albums = await albumAccess.getPublicAlbums(queryLimit, queryExclusiveStartKey);
    // Remove the user ID before sending the album items
    // return { items: rmUserIdFromArr(albums.items), lastEvaluatedKey: albums.lastEvaluatedKey };
    return { items: albums.items, lastEvaluatedKey: albums.lastEvaluatedKey };
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
    const albums = await albumAccess.getUserAlbums(userId, queryLimit, queryExclusiveStartKey);
    // Remove the user ID before sending the album items
    // return { items: rmUserIdFromArr(albums.items), lastEvaluatedKey: albums.lastEvaluatedKey };
    return { items: albums.items, lastEvaluatedKey: albums.lastEvaluatedKey };
}

/**
 * Add an album item in Album database table.
 * @param userId The album owner user id.
 * @param albumParams The required parameters to add a new album item
 * in database.
 * @returns The added album item.
 */
export async function addAlbum(userId: string, albumParams: FromSchema<typeof addAlbumSchema>) {
    const album: Album = {
        userId,
        albumId: uuidv4(),
        creationDate: new Date().toISOString(),
        visibility: albumParams.visibility,
        title: albumParams.title,
        description: albumParams.description,
        coverId: uuidv4(),
    };
    // Add the album item to DB
    await albumAccess.addAlbum(album);
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

// /**
//  * Check whether a album item exists in database.
//  * @param userId The album owner user ID.
//  * @param albumId The album item ID.
//  * @returns The album item in case it exists or throw an error
//  * otherwise.
//  */
// async function albumExists(userId: string, albumId: string) {
//     let album = await albumAccess.getTodo(userId, albumId);

//     if (!album) {
//         throw new createHttpError.BadRequest("This album item doesn't exists.");
//     }

//     return album;
// }
