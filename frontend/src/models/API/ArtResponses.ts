import { Art } from '../database/Art';

/**
 * The get album arts request response.
 */
export interface GetAlbumArtsResponse {
  items: Art[];
  nextKey?: string;
}

/**
 * The art optional response data for put requests.
 */
interface PutOptionalDataResponse extends Art {
  uploadUrl?: string;
}

/**
 * The add or edit arts in an album request response.
 */
export interface PutArtsResponse {
  items: PutOptionalDataResponse[];
}

/**
 * The delete arts from an album request response.
 */
export interface DeleteArtsResponse {
  message: string;
  items: {
    albumId: string;
    artId: string;
  }[];
}
