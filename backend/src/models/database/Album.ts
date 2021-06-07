/**
 * Interface representing an item from Album Table.
 */
export interface Album {
    userId: string;
    albumId: string;
    creationDate: string;
    visibility: AlbumVisibility;
    title: string;
    description: string;
    coverUrl: string;
}

/**
 * The user album visibility - public or private.
 */
export enum AlbumVisibility {
    public = 'public',
    private = 'private',
}
