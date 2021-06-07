/**
 * Interface representing an item from Art Table.
 */
export interface Art {
    albumId: string;
    artId: string;
    sequenceNum: number;
    userId: string;
    creationDate: string;
    title: string;
    description: string;
    imgUrl: string;
}
