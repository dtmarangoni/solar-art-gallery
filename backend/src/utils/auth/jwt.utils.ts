import 'source-map-support/register';
import { decode, verify } from 'jsonwebtoken';
import * as createHttpError from 'http-errors';

import { Jwt } from '@utils/auth/models/Jwt';

/**
 * Get the authorization token from request headers.
 * @param authHeader Request authorization header.
 * @returns The auth token if present in headers.
 */
export function getAuthToken(authHeader: string) {
    // No auth headers
    if (!authHeader) {
        throw new createHttpError.Unauthorized('No authentication header');
    }
    // Retrieve the token itself - "Bearer {{token}}"
    const token = authHeader.split(' ')[1];
    // Check if the token was sent with the proper format
    if (!authHeader.toLocaleLowerCase().startsWith('bearer ') || !token) {
        throw new createHttpError.Unauthorized('Malformed token.');
    }
    // Return the auth token
    return token;
}

/**
 * Decode a JWT token.
 * @param token The JWT token.
 * @returns The decoded JWT token in case it's valid.
 */
export function decodeToken(token: string): Jwt {
    const decodedToken = decode(token, { complete: true }) as Jwt;

    // The token must contain the cryptographic key id and user id
    if (!decodedToken?.header?.kid || !decodedToken?.payload?.sub) {
        throw new createHttpError.Unauthorized('Malformed token.');
    }

    return decodedToken;
}

/**
 * Verify and decode a RSA JWT token if it's valid.
 * @param token The JWT token.
 * @param rsaCertificate The RSA certificate used to sign the token.
 * @param audience The token audience.
 * @param issuer The token issuer.
 * @returns The verified and decoded token.
 */
export function verifyRSAToken(
    token: string,
    rsaCertificate: string,
    audience: string,
    issuer: string
) {
    try {
        return verify(token, rsaCertificate, {
            algorithms: ['RS256'],
            audience,
            issuer,
            ignoreExpiration: false,
            complete: true,
        }) as Jwt;
    } catch (error) {
        // Invalid token
        throw new createHttpError.Unauthorized('Invalid token.');
    }
}
