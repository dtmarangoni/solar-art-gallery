/* API host deployed in AWS Cloud */

/**
 * The AWS host API ID.
 */
const apiId = 'dozf4gubi5';

/**
 * The host AWS cloud region.
 */
const region = 'sa-east-1';

/**
 * The API host address
 */
const address = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`;

/**
 * API host endpoints.
 */
const endpoints = {
  album: {
    getPublicAlbums: `${address}/album/public`,
    getUserAlbums: `${address}/album/my`,
    addAlbum: `${address}/album/my`,
    editAlbum: `${address}/album/my`,
    deleteAlbum: `${address}/album/my`,
  },
  art: {
    getPublicAlbumArts: `${address}/art/public`,
    getUserAlbumArts: `${address}/art/my`,
    putArts: `${address}/art/my`,
    deleteArts: `${address}/art/my`,
  },
  user: { putUser: `${address}/user` },
};

/**
 * API host configurations.
 */
export const apiHostConfig = {
  endpoints,
  privateEndpoints: [
    `${address}/album/my`,
    `${address}/art/my`,
    `${address}/user`,
  ],
};
