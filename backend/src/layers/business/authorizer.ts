import 'source-map-support/register';

import { decodeToken, getAuthToken, verifyRSAToken } from '@utils/auth/jwt.utils';
import { getRS256Certificate, audience, issuer } from '../ports/Auth0/authorizer';

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
