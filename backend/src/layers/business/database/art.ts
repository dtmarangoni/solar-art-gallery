import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { validatePaginationParams } from '@utils/dynamoDB';
import { rmUserIdFromArr } from '@utils/general';
import { ArtAccess } from '../../ports/AWS/DynamoDB/artAccess';
import { AlbumVisibility } from '../../../models/database/Album';
import { queryAlbum, albumOwnership } from './album';
import {
    getPublicAlbumArtsSchema,
    getUserAlbumArtsSchema,
    putArtsSchema,
    deleteArtsSchema,
} from '@lambda/http/index';
import { getDownloadSignedUrl, getFsArtsFolder, getUploadSignedUrl } from '../fileStore';

// The Art Access port
const artAccess = new ArtAccess();

/**
 * Get all arts items of a public album from Art database table with
 * optional pagination.
 * @param artsParams The required parameters to retrieve the arts of a
 * public album from database.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All arts items of public album with optional pagination.
 */
export async function getPublicAlbumArts(
    artsParams: FromSchema<typeof getPublicAlbumArtsSchema>,
    limit?: string,
    exclusiveStartKey?: string
) {
    // Retrieve the album item from DB
    const album = await queryAlbum(artsParams.albumId);
    // Verify if the album visibility is public before continuing
    if (album.visibility != AlbumVisibility.public)
        throw new createHttpError.Forbidden('Unauthorized.');

    // Validate the query params
    let { searchLimit, searchStartKey } = validatePaginationParams(limit, exclusiveStartKey);

    // Get all arts of an album from DB
    const result = await artAccess.getAlbumArts(artsParams.albumId, searchLimit, searchStartKey);

    // Remove the user ID from arts items and generate the download
    // pre-signed url for arts images
    const arts = rmUserIdFromArr(result.items).map((item: any) => ({
        ...item,
        imgUrl: getDownloadSignedUrl(getFsArtsFolder(item.albumId), item.artId),
    }));
    return { items: arts, lastEvaluatedKey: result.lastEvaluatedKey };
}

/**
 * Get all user arts items of an album from Art database table with
 * optional pagination.
 * @param userId The albums owner user ID.
 * @param artsParams The required parameters to retrieve the arts of an
 * user album from database.
 * @param limit The optional maximum number of returned items per call.
 * @param exclusiveStartKey The optional database album item key to
 * start the query from.
 * @returns All arts items of public album with optional pagination.
 */
export async function getUserAlbumArts(
    userId: string,
    artsParams: FromSchema<typeof getUserAlbumArtsSchema>,
    limit?: string,
    exclusiveStartKey?: string
) {
    // Verify if the album exists and the user ownership before
    // proceeding. This function will throw an error if not OK
    await albumOwnership(userId, artsParams.albumId);

    // Validate the query params
    let { searchLimit, searchStartKey } = validatePaginationParams(limit, exclusiveStartKey);

    // Get all user arts of an album from DB
    const result = await artAccess.getAlbumArts(artsParams.albumId, searchLimit, searchStartKey);

    // Remove the user ID from arts items and generate the download
    // pre-signed url for arts images
    const arts = rmUserIdFromArr(result.items).map((item: any) => ({
        ...item,
        imgUrl: getDownloadSignedUrl(getFsArtsFolder(item.albumId), item.artId),
    }));
    // Return the arts items of an album
    return { items: arts, lastEvaluatedKey: result.lastEvaluatedKey };
}

/**
 * Add and/or update multiple arts to an user album in Art database
 * table.
 * @param userId The art owner user id.
 * @param artsParams The required parameters to add and/or update
 * multiple arts items in database.
 * @returns The added and/or updated arts items.
 */
export async function putArts(userId: string, artsParams: FromSchema<typeof putArtsSchema>) {
    // Verify if the album exists and the user ownership before
    // proceeding. This function will throw an error if not OK
    await albumOwnership(userId, sameAlbum(artsParams.map((artParams) => artParams.albumId)));

    // Get the arts items data prepared for DB and file store
    const arts = await prepareArtsData(userId, artsParams);

    // Add and/or update the arts items in DB
    // Do not send to DB the pre-signed url field
    await artAccess.putArts(
        arts.map((art) => {
            const { uploadUrl, ...artData } = art;
            return artData;
        })
    );

    // Return the arts items as confirmation of a success operation
    // removing the user ID
    return rmUserIdFromArr(arts);
}

/**
 * Delete arts items from an album in Arts database table.
 * @param userId The art owner user id.
 * @param artsParams The required parameters to delete the arts items
 * from database.
 * @returns The deleted arts items from database.
 */
export async function deleteArts(userId: string, artsParams: FromSchema<typeof deleteArtsSchema>) {
    // Verify if the album exists and the user ownership before
    // proceeding. This function will throw an error if not OK
    await albumOwnership(userId, sameAlbum(artsParams.map((artParams) => artParams.albumId)));

    // Delete the arts items from DB
    await artAccess.deleteArts(artsParams);
    // Return the deleted arts IDs as confirmation of a success operation
    return artsParams;

    // TODO Remove arts images from file store
}

/**
 * Verify if an array of albums IDs are equal. Useful to determine if
 * all arts belongs to the same album.
 * @param albumIds The array of album IDs.
 * @return The album ID if they equal or throw an error otherwise.
 */
function sameAlbum(albumIds: string[]) {
    if (albumIds.every((albumId, index, albumIds) => albumId === albumIds[0])) {
        return albumIds[0];
    } else {
        throw new createHttpError.BadRequest("The arts items don't belong to the same album");
    }
}

/**
 * Prepare the arts items data to be added to DB and file store.
 * @param userId The art owner user id.
 * @param artsParams The required parameters to add and/or update
 * multiple arts items in database.
 * @returns The prepared arts items data.
 */
async function prepareArtsData(userId: string, artsParams: FromSchema<typeof putArtsSchema>) {
    return artsParams.map((artParams, sequenceNum) => {
        // Generate an art Id and creationDate only for new items
        const artId = artParams.artId ? artParams.artId : uuidv4();
        const creationDate = artParams.creationDate
            ? artParams.creationDate
            : new Date().toISOString();
        // Generate the file store art img url and pre-signed upload
        // url if necessary
        const { imgUrl, uploadUrl } = fsArtUrls(artParams.albumId, artId, artParams.imgUrl);

        return {
            albumId: artParams.albumId,
            artId,
            sequenceNum,
            userId,
            creationDate,
            title: artParams.title,
            description: artParams.description,
            imgUrl,
            uploadUrl,
        };
    });
}

/**
 * Generate the file store pre-signed download and the pre-signed
 * upload url for an art image if necessary.
 * @param albumId The album ID.
 * @param artId The art ID.
 * @param imageUrl The current art image url if it exists. In case of
 * null value, a new image download url will be generated.
 * @returns An object containing the final download and upload
 * pre-signed urls.
 */
function fsArtUrls(albumId: string, artId: string, imageUrl?: string) {
    // Generate the file store art img url and pre-signed upload url if
    // necessary
    const imgUrl = imageUrl ? imageUrl : getDownloadSignedUrl(getFsArtsFolder(albumId), artId);
    const uploadUrl = imageUrl ? undefined : getUploadSignedUrl(getFsArtsFolder(albumId), artId);
    return { imgUrl, uploadUrl };
}
