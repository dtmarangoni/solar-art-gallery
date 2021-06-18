import 'source-map-support/register';

import { decodeToken, getAuthToken, verifyRSAToken } from '@utils/auth/jwt.utils';
import { getRS256Certificate, audience, issuer, getUserInfo } from '../../ports/Auth0/authorizer';
import { UserInfo } from '@utils/auth/models/UserInfo';

/**
 * Decode and validate the authorization token from request headers.
 * @param authHeader Authorization header.
 * @returns The decoded token.
 */
export async function validateAuthToken(authHeader: string) {
    // Retrieve the auth token
    const token = getAuthToken(authHeader);
    // Decode the auth token
    const decodedToken = decodeToken(token);
    // Get the RS256 signing certificate from Auth0
    const rsaCertificate = await getRS256Certificate(decodedToken.header.kid);
    // Validate and return the auth token
    return verifyRSAToken(token, rsaCertificate, audience, issuer);
}

/**
 * Get the user profile information from authorization provider.
 * @param authHeader Authorization header.
 * @returns The user profile information.
 */
export async function getUserProfile(authHeader: string) {
    // Retrieve the access token
    const accessToken = getAuthToken(authHeader);
    const userInfo = await getUserInfo(accessToken);
    // Perform the attribute mapping and return the user profile
    return providerAttMap(userInfo);
}

/**
 * Maps the user profile information to desired state according to auth
 * provider (Auth0, Google, Facebook, etc).
 * @param userProfile The provider user profile information.
 * @returns The mapped user profile information.
 */
function providerAttMap(userProfile: UserInfo) {
    // Auth0 profiles have a better meaning nickname names than the
    // name property
    // Google and Facebook profiles don't needs remapping so far.
    return {
        ...userProfile,
        name: userProfile.sub.startsWith('auth0|') ? userProfile.nickname : userProfile.name,
        nickname: userProfile.sub.startsWith('auth0|') ? userProfile.name : userProfile.nickname,
    };
}
