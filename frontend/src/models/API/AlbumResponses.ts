import { Album } from '../database/Album';

/**
 * The get albums request response.
 */
export interface GetAlbumsResponse {
  items: Album[];
  nextKey?: string;
}

/**
 * The get album request response.
 */
export interface GetAlbumResponse {
  item: Album;
}

/**
 * The album optional response data for add or edit requests.
 */
interface AddEditOptionalDataResponse extends Album {
  uploadUrl?: string;
}

/**
 * The add or edit album request response.
 */
export interface AddEditAlbumResponse {
  item: AddEditOptionalDataResponse;
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
