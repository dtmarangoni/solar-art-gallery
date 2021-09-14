import { AlbumVisibility } from './database/Album';

/**
 * The app add modal types.
 */
export enum AddModalTypes {
  addAlbum = 'add-album',
  addArt = 'add-art',
}

/**
 * The app edit modal types.
 */
export enum EditModalTypes {
  editAlbum = 'edit-album',
  editArt = 'edit-art',
}

/**
 * The add or edit modal returned album data.
 */
export interface ModalAlbumData {
  title: string;
  description: string;
  visibility: AlbumVisibility;
  imgFile: File;
}

/**
 * The add or edit modal returned art data.
 */
export interface ModalArtData {
  title: string;
  description: string;
  imgFile: File;
}
