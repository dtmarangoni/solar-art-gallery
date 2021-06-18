import 'source-map-support/register';
import type { FromSchema } from 'json-schema-to-ts';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';

import { validatePaginationParams } from '@utils/dynamoDB';
import { rmUserIdFromArr } from '@utils/general';
import { ArtAccess } from '../../ports/AWS/DynamoDB/artAccess';
import { AlbumVisibility } from '../../../models/database/Album';
import { Art } from '../../../models/database/Art';
import { queryAlbum, albumOwnership } from './album';
import {
    getPublicAlbumArtsSchema,
    getUserAlbumArtsSchema,
    putArtsSchema,
    deleteArtsSchema,
} from '@lambda/http/index';
import { getDownloadSignedUrl, getFsArtsFolder, getUploadSignedUrl } from '../fileStore/fileStore';

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

    // Remove user ID from items and generate a download pre-signed url
    const arts = prepArtsRespData(result.items);

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

    // Remove user ID from items and generate a download pre-signed url
    const arts = prepArtsRespData(result.items);

    return { items: arts, lastEvaluatedKey: result.lastEvaluatedKey };
}

/**
 * Get an art item from Art database table.
 * @param albumId The album ID containing the art item.
 * @param artId The art ID.
 * @returns The art item in case it exists or throw an error otherwise.
 */
export async function getArt(albumId: string, artId: string) {
    const art = await artAccess.getArt(albumId, artId);
    // Check if the art has been found
    if (!art) throw new createHttpError.NotFound("This art item doesn't exists.");
    // Return the art in case it exists
    return art;
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
    const arts = await prepArtsData(userId, artsParams);

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
    // Verify if the arts exists in DB. It will throw an error if an
    // item isn't in DB
    for (const artParams of artsParams) await getArt(artParams.albumId, artParams.artId);

    // Delete the arts items from DB
    await artAccess.deleteArts(artsParams);
    // Return the deleted arts IDs as confirmation of a success operation
    return artsParams;
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
 * Prepared the arts items data to response removing the user ID and
 * generating the pre-signed download url.
 * @param items The arts items.
 * @returns The prepared arts data without the user ID and with the
 * pre-signed urls.
 */
function prepArtsRespData(items: Art[]) {
    return rmUserIdFromArr(items).map((item) => ({
        ...item,
        imgUrl: getDownloadSignedUrl(getFsArtsFolder(item.albumId), item.artId),
    }));
}

/**
 * Prepare the arts items data to be added and/or updated in DB and
 * file store.
 * @param userId The art owner user id.
 * @param artsParams The required parameters to add and/or update
 * multiple arts items in database.
 * @returns The prepared arts items data.
 */
async function prepArtsData(userId: string, artsParams: FromSchema<typeof putArtsSchema>) {
    const artsData = artsParams.map(async (params, sequenceNum) => {
        if (!params.artId) {
            // Generate the art data for new items
            return newArtItemData(
                userId,
                { albumId: params.albumId, title: params.title, description: params.description },
                sequenceNum
            );
        } else {
            // Generate art data for exiting items
            return await existingArtItemData(params, sequenceNum);
        }
    });

    // Return the result when all promises from map function resolves
    return Promise.all(artsData);
}

/**
 * Prepare the art data for new art items.
 * @param userId The art owner user id.
 * @param artsParams The required parameters to add the art item in
 * database.
 * @param sequenceNum The art item sequence number inside the album
 * gallery.
 * @returns The art data for new art items.
 */
function newArtItemData(
    userId: string,
    artParams: { albumId: string; title: string; description: string },
    sequenceNum: number
) {
    // Title and description are mandatory
    if (!artParams.title || !artParams.description) {
        throw new createHttpError.BadRequest(
            'Title and description are mandatory for new art items.'
        );
    }
    // Generate the art ID, creation date and the pre-signed urls
    const artId = uuidv4();
    const { imgUrl, uploadUrl } = fsArtUrls(artParams.albumId, artId, true);
    const creationDate = new Date().toISOString();

    return { ...artParams, artId, sequenceNum, userId, creationDate, imgUrl, uploadUrl };
}

/**
 * Prepare the art data for editing art items.
 * @param artParams The required parameters to edit the art item in
 * database.
 * @param sequenceNum The art item sequence number inside the album
 * gallery.
 * @returns The art data for editing art items.
 */
async function existingArtItemData(
    artParams: {
        artId?: string;
        title?: string;
        description?: string;
        genUploadUrl?: boolean;
        albumId: string;
    },
    sequenceNum: number
) {
    // Retrieve the art item from DB. This function will throw an error
    // if art doesn't exists in DB
    const art = await getArt(artParams.albumId, artParams.artId);
    // Generate the pre-signed urls
    const { imgUrl, uploadUrl } = fsArtUrls(artParams.albumId, art.artId, artParams.genUploadUrl);
    // Remove the genUploadUrl flag before return the art data
    const { genUploadUrl, ...newParams } = artParams;
    return { ...art, ...newParams, sequenceNum, imgUrl, uploadUrl };
}

/**
 * Generate the file store pre-signed download and the pre-signed
 * upload url for an art image if necessary.
 * @param albumId The album ID.
 * @param artId The art ID.
 * @param genUploadUrl The optional flag indicating that a pre-signed
 * upload url should be generated for an art image.
 * @returns An object containing the final download and upload
 * pre-signed urls.
 */
function fsArtUrls(albumId: string, artId: string, genUploadUrl?: boolean) {
    if (genUploadUrl) {
        return {
            imgUrl: getDownloadSignedUrl(getFsArtsFolder(albumId), artId),
            uploadUrl: getUploadSignedUrl(getFsArtsFolder(albumId), artId),
        };
    }

    return { imgUrl: undefined, uploadUrl: undefined };
}
