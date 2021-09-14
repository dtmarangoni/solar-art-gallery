import { JwtHeader } from 'jsonwebtoken';

/**
 * Interface representing a JWT token.
 */
export interface Jwt {
    header: JwtHeader;
    payload: JwtPayload;
}

/**
 * A payload of a JWT token.
 */
export interface JwtPayload {
    iss: string;
    sub: string;
    iat: number;
    exp: number;
}
