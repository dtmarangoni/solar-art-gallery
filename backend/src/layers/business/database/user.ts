import 'source-map-support/register';

import { UserAccess } from '../../ports/AWS/DynamoDB/userAccess';
import { User } from '../../../models/database/User';
import { getUserProfile } from '../authorizer/authorizer';

// The User Access port
const userAccess = new UserAccess();

/**
 * Get an user item from User database table.
 * @param userId The user ID.
 * @returns The user item in case it exists or undefined otherwise.
 */
export async function getUser(userId: string) {
    const user = await userAccess.getUser(userId);
    return user;
}

/**
 * Add an user item in User database table.
 * @param user The user item.
 * @returns The added user item.
 */
export async function addUser(user: User) {
    // Add the user item to DB and return it as success confirmation
    return await userAccess.putUser(user);
}

/**
 * Edit the user profile information in User database table.
 * @param user The user item.
 * @param newUserInfo The profile information to be edited.
 * @returns The edited user item.
 */
export async function editUserInfo(
    user: User,
    newUserInfo: { name?: string; nickname?: string; email?: string; picture?: string }
) {
    // Edit the user properties
    const newUser: User = { ...user, ...newUserInfo };
    // Update the user in DB and return it as a success operation
    return await userAccess.putUser(newUser);
}

/**
 * Add or edit an user profile information in database using the access
 * token from authorization header.
 * @param authHeader Authorization header.
 * @returns The added or edited user item as confirmation of process.
 */
export async function putUserInfo(authHeader: string) {
    // Request the user info from Authorizer API
    const userInfo = await getUserProfile(authHeader);
    const userData = {
        name: userInfo.name,
        nickname: userInfo.nickname,
        email: userInfo.email,
        picture: userInfo.picture,
    };

    // Check if the user is already registered
    const user = await getUser(userInfo.sub);

    // Existing user, thus edit its profile information
    if (user) return await editUserInfo(user, userData);

    // New user, add it to DB
    return await addUser({
        userId: userInfo.sub,
        registrationDate: new Date().toISOString(),
        ...userData,
    });
}
