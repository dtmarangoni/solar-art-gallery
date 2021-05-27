/**
 * Lambda functions.
 */
export { default as getPublicAlbums } from './getPublicAlbums/index';
export { default as getUserAlbums } from './getUserAlbums/index';
export { default as addAlbum } from './addAlbum/index';
export { default as editAlbum } from './editAlbum/index';
export { default as deleteAlbum } from './deleteAlbum/index';

/**
 * JSON schema Lambda functions validators.
 */
export { default as addAlbumSchema } from './addAlbum/schema';
export { default as editAlbumSchema } from './editAlbum/schema';
export { default as deleteAlbumSchema } from './deleteAlbum/schema';
