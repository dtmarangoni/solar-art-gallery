import { Album } from '../database/Album';

/**
 * The get public albums request response.
 */
export interface GetPublicAlbumsResponse {
  items: Album[];
  nextKey?: string;
}

/**
 * The get user albums request response.
 */
export interface GetUserAlbumsResponse {
  items: Album[];
  nextKey?: string;
}

/**
 * The album response data for add or edit requests.
 */
interface AddEditDataResponse extends Album {
  uploadUrl?: string;
}

/**
 * The add new album request response.
 */
export interface AddAlbumResponse {
  item: AddEditDataResponse;
}

/**
 * The edit album request response.
 */
export interface EditAlbumResponse {
  item: AddEditDataResponse;
}

/**
 * The delete album request response.
 */
export interface DeleteAlbumResponse {
  message: string;
  item: {
    albumId: string;
  };
}
