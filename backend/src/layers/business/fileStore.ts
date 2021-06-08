import 'source-map-support/register';

import { FileStoreAccess } from '../ports/AWS/S3/fileStoreAccess';

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
 * Deletes an object from S3 file store.
 * @param folderPath The full folder path where the object resides
 * in the file store.
 * @param objKeyName The key name of the object to be deleted.
 * @returns True for a success delete process or false otherwise.
 */
export async function deleteObject(folderPath: string, objKeyName: string) {
    const result = await fileStoreAccess.deleteObject(folderPath, objKeyName);
    // Return the delete operation status
    return result.DeleteMarker;
}

/**
 * Delete multiple objects from S3 file store.
 * @param objects The objects array containing the full folder path
 * where each object resides in file store and each object key name.
 * @returns An object containing the successfully deleted items and the
 * ones that has failed.
 */
export async function deleteObjects(objects: { folderPath: string; keyName: string }[]) {
    const result = await fileStoreAccess.deleteObjects(objects);
    // Return the delete operation result
    return { deleted: result?.Deleted, error: result?.Errors };
}
