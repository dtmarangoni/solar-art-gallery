import 'source-map-support/register';
import { StreamRecord } from 'aws-lambda';

import { FileStoreAccess } from '../../ports/AWS/S3/fileStoreAccess';
import { detectRecordType } from '@utils/dynamoDB';

// The file store access port
const fileStoreAccess = new FileStoreAccess();

/**
 * The file store http address.
 */
export const fileStoreUrl = fileStoreAccess.getFileStoreAddress();

/**
 * Gets the file store folder path for an album.
 * @param albumId The album ID.
 * @returns The file store folder path for an album.
 */
export function getFsAlbumFolder(albumId: string) {
    return `${albumId}`;
}

/**
 * Gets the file store folder path for an album arts.
 * @param albumId The album ID.
 * @returns The file store folder path for an album arts.
 */
export function getFsArtsFolder(albumId: string) {
    return `${albumId}/arts`;
}

/**
 * Gets a pre-signed URL allowing an object download from file store.
 * @param folderPath The full folder path where the object resides
 * in the file store.
 * @param objKeyName The key name of the object to be downloaded.
 * @returns The pre-signed URL allowing the GET object operation to
 * file store.
 */
export function getDownloadSignedUrl(folderPath: string, objKeyName: string) {
    return fileStoreAccess.genGetPreSignedUrl(folderPath, objKeyName);
}

/**
 * Gets a pre-signed URL allowing a new object upload to file store.
 * @param folderPath The full folder path where to insert the
 * object in the file store.
 * @param objKeyName The key name of the object to be uploaded.
 * @returns The pre-signed URL allowing the PUT object operation to
 * file store.
 */
export function getUploadSignedUrl(folderPath: string, objKeyName: string) {
    return fileStoreAccess.genPutPreSignedUrl(folderPath, objKeyName);
}

/**
 * Lists all objects inside a path in file store.
 * @param folderPath The full folder path where the objects resides
 * in the file store.
 * @returns The file store objects keys list.
 */
export async function listObjects(folderPath?: string) {
    const result = await fileStoreAccess.listObjects(folderPath);
    // Return the file store object keys
    return result.Contents.map((content) => content.Key);
}

/**
 * Deletes an object from S3 file store.
 * @param folderPath The full folder path where the object resides
 * in the file store.
 * @param objKeyName The key name of the object to be deleted.
 * @returns The file store Delete Object Output.
 */
export async function deleteObject(folderPath: string, objKeyName: string) {
    return await fileStoreAccess.deleteObject(folderPath, objKeyName);
}

/**
 * Delete multiple objects from S3 file store.
 * @param objects The objects array containing the file store folder
 * path and the key name for each object to be deleted.
 * @returns An object containing the successfully deleted items and the
 * ones that has failed.
 */
export async function deleteObjectsByKeys(objects: { folderPath: string; keyName: string }[]) {
    const result = await fileStoreAccess.deleteObjectsByKeys(objects);
    // Return the delete operation result
    return { deleted: result?.Deleted, error: result?.Errors };
}

/**
 * Delete multiple objects from S3 file store.
 * @param objectsPaths The array containing the file store full folder
 * path for each object to be deleted.
 * @returns An object containing the successfully deleted items and the
 * ones that has failed.
 */
export async function deleteObjectsByPath(objectsPaths: string[]) {
    const result = await fileStoreAccess.deleteObjectsByPath(objectsPaths);
    // Return the delete operation result
    return { deleted: result?.Deleted, error: result?.Errors };
}

/**
 * Automatically detects according to database stream record ID key if
 * an album or art item was removed from database, thus remove the
 * correct object from file store.
 * @param recordKey The database stream record key.
 */
export async function deleteRecordObj(recordKey: StreamRecord['Keys']) {
    const removedItem = detectRecordType(recordKey);
    if (removedItem === 'album') {
        // Get all objects inside an album
        const albumObjects = await listObjects(getFsAlbumFolder(recordKey.albumId.S));
        // Delete all objects - folders, album cover and arts images
        return await deleteObjectsByPath(albumObjects);
    } else if (removedItem === 'art') {
        // Delete the art image
        return await deleteObject(getFsArtsFolder(recordKey.albumId.S), recordKey.artId.S);
    }
}
