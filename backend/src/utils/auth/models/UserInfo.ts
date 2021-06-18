/**
 * The Auth0 user info.
 */
export interface UserInfo {
    sub: string;
    given_name?: string;
    family_name?: string;
    nickname: string;
    name: string;
    picture: string;
    locale?: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
}
