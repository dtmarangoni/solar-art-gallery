import 'source-map-support/register';
import { decodeToken, getAuthToken } from '@utils/auth/jwt.utils';

/**
 * Middleware to decode the token from authorization headers and get the user id.
 * The user id will be set in the context property.
 */
export const getUserID = () => {
    return {
        before: async (request: any) => {
            // Decode the JWT token
            const authToken = getAuthToken(request.event.headers?.Authorization);
            const decodedToken = decodeToken(authToken);
            // Get the user ID
            const userId = decodedToken.payload.sub;
            // Copy the user id to request context
            Object.assign(request.context, { userId });
        },
    };
};
