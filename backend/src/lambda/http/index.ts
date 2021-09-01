/**
 * Album Lambda functions
 */
export { default as getPublicAlbums } from './album/getPublicAlbums/index';
export { default as getPublicAlbum } from './album/getPublicAlbum/index';
export { default as getUserAlbums } from './album/getUserAlbums/index';
export { default as getUserAlbum } from './album/getUserAlbum/index';
export { default as addAlbum } from './album/addAlbum/index';
export { default as editAlbum } from './album/editAlbum/index';
export { default as deleteAlbum } from './album/deleteAlbum/index';

/**
 * Art Lambda functions
 */
export { default as getPublicAlbumArts } from '@lambda/http/art/getPublicAlbumArts/index';
export { default as getUserAlbumArts } from '@lambda/http/art/getUserAlbumArts/index';
export { default as putArts } from '@lambda/http/art/putArts/index';
export { default as deleteArts } from '@lambda/http/art/deleteArts/index';

/**
 * User Lambda functions
 */
export { default as putUser } from '@lambda/http/user/putUser/index';

/**
 * JSON schema Lambda functions validators
 */
export { default as getPublicAlbumSchema } from './album/getPublicAlbum/schema';
export { default as getUserAlbumSchema } from './album/getUserAlbum/schema';
export { default as addAlbumSchema } from './album/addAlbum/schema';
export { default as editAlbumSchema } from './album/editAlbum/schema';
export { default as deleteAlbumSchema } from './album/deleteAlbum/schema';
export { default as getPublicAlbumArtsSchema } from './art/getPublicAlbumArts/schema';
export { default as getUserAlbumArtsSchema } from './art/getUserAlbumArts/schema';
export { default as putArtsSchema } from './art/putArts/schema';
export { default as deleteArtsSchema } from './art/deleteArts/schema';
