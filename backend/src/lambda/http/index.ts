/**
 * Album Lambda functions
 */
export { default as getPublicAlbums } from './album/getPublicAlbums/index';
export { default as getUserAlbums } from './album/getUserAlbums/index';
export { default as addAlbum } from './album/addAlbum/index';
export { default as editAlbum } from './album/editAlbum/index';
export { default as deleteAlbum } from './album/deleteAlbum/index';

/**
 * Art Lambda functions
 */
export { default as getPublicAlbumArts } from '@lambda/http/art/getPublicAlbumArts/index';
export { default as getUserAlbumArts } from '@lambda/http/art/getUserAlbumArts/index';

/**
 * JSON schema Lambda functions validators
 */
export { default as addAlbumSchema } from './album/addAlbum/schema';
export { default as editAlbumSchema } from './album/editAlbum/schema';
export { default as deleteAlbumSchema } from './album/deleteAlbum/schema';
