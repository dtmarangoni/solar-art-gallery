import 'source-map-support/register';
import { JwksClient } from 'jwks-rsa';
import axios from 'axios';
import * as createHttpError from 'http-errors';

import { UserInfo } from '@utils/auth/models/UserInfo';

// JSON web key set client
const jwksClient = new JwksClient({ jwksUri: process.env.AUTH0_JWKS_URI });

/**
 * The Auth0 token audience
 */
export const audience = process.env.AUTH0_AUDIENCE;

/**
 * The Auth0 issuer domain
 */
export const issuer = process.env.AUTH0_ISSUER;

/**
 * The Auth0 user info URI API endpoint.
 */
export const userInfoURI = process.env.AUTH0_USER_INFO_URI;

/**
 * Get the Auth0 RS256 certificate used to sign JWTs.
 * @param jsonWebKeyId The JSON web key ID belonging to Auth0 key set.
 * @returns The RS256 signing certificate.
 */
export async function getRS256Certificate(jsonWebKeyId: string) {
    try {
        // Retrieve the JSON Web Key from Auth0 Key Set
        const jsonWebKey = await jwksClient.getSigningKey(jsonWebKeyId);
        // Return the RS256 certificate
        return jsonWebKey.getPublicKey();
    } catch (error) {
        throw new createHttpError.InternalServerError(
            `Not possible to retrieve Auth0 RS265 certificate: ${error.message}`
        );
    }
}

/**
 * Get from Auth0 the user profile information.
 * @param accessToken The Auth0 access token.
 * @returns The user profile information.
 */
export async function getUserInfo(accessToken: string) {
    try {
        const result = await axios.get<UserInfo>(userInfoURI, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return result.data;
    } catch (error) {
        throw createHttpError(error?.response?.status, error?.response?.statusText);
    }
}
