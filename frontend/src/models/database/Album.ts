/**
 * Interface representing an item from Album Database Table.
 */
export interface Album {
  ownerName: string;
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
