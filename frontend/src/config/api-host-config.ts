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
const localAddress = `http://localhost:4000/dev`;
const deployedAddress = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`;

/**
 * Generates the API endpoints for local or AWS cloud deployment.
 * @param hostAddress The API host address - local or AWS cloud.
 * @returns The generated API endpoints for local or AWS cloud
 * deployment.
 */
function getAPIEndpoints(hostAddress: string) {
  return {
    album: {
      getPublicAlbums: `${hostAddress}/album/public`,
      getUserAlbums: `${hostAddress}/album/my`,
      addAlbum: `${hostAddress}/album/my`,
      editAlbum: `${hostAddress}/album/my`,
      deleteAlbum: `${hostAddress}/album/my`,
    },
    art: {
      getPublicAlbumArts: `${hostAddress}/art/public`,
      getUserAlbumArts: `${hostAddress}/art/my`,
      putArts: `${hostAddress}/art/my`,
      deleteArts: `${hostAddress}/art/my`,
    },
    user: { putUser: `${hostAddress}/user` },
    privateEndpoints: [
      `${hostAddress}/album/my`,
      `${hostAddress}/art/my`,
      `${hostAddress}/user`,
    ],
  };
}

/**
 * API host endpoints.
 */
const endpoints = {
  dev: getAPIEndpoints(localAddress),
  prod: getAPIEndpoints(deployedAddress),
};

/**
 * API host configurations.
 */
export const apiHostConfig = { endpoints };
