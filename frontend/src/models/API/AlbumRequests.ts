import { AlbumVisibility } from '../database/Album';

/**
 * The add new album request params.
 */
export interface AddAlbumParams {
  title: string;
  description: string;
  visibility: AlbumVisibility;
  coverImg: File;
}

/**
 * The edit album request params.
 */
export interface EditAlbumParams {
  albumId: string;
  title?: string;
  description?: string;
  visibility?: AlbumVisibility;
  coverImg?: File;
  genUploadUrl?: boolean;
}

/**
 * The delete album request params.
 */
export interface DeleteAlbumParams {
  albumId: string;
}
