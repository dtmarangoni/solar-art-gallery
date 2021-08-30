/**
 * The get album arts request params.
 */
export interface GetAlbumArtsParams {
  albumId: string;
}

/**
 * The add or edit arts in an album request params.
 */
export interface PutArtsParams {
  albumId: string;
  artId?: string;
  title?: string;
  description?: string;
  artImg?: File;
  genUploadUrl?: boolean;
}

/**
 * The delete arts from an album request params.
 */
export interface DeleteArtsParams {
  albumId: string;
  artId: string;
}
