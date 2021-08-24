import { AlbumVisibility } from '../database/Album';

/**
 * The get public albums query request params.
 */
export interface GetPublicAlbumsParams {
  // The response page items limit size
  limit?: number;
  // The next item key to start the new page from
  nextKey?: string;
}

/**
 * The get user albums query request params.
 */
export interface GetUserAlbumsParams {
  // The response page items limit size
  limit?: number;
  // The next item key to start the new page from
  nextKey?: string;
}

/**
 * The add new album request params.
 */
export interface AddAlbumParams {
  title: string;
  description: string;
  visibility: AlbumVisibility;
}

/**
 * The edit album request params.
 */
export interface EditAlbumParams {
  albumId: string;
  title?: string;
  description?: string;
  visibility?: AlbumVisibility;
  genUploadUrl?: true;
}

/**
 * The delete album request params.
 */
export interface DeleteAlbumParams {
  albumId: string;
}
