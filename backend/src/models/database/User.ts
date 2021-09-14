/**
 * Interface representing an item from User Table.
 */
export interface User {
    userId: string;
    registrationDate: string;
    name?: string;
    nickname?: string;
    email: string;
    picture?: string;
}
