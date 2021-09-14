/**
 * Interface representing an item from Art Database Table.
 */
export interface Art {
  albumId: string;
  artId: string;
  sequenceNum: number;
  creationDate: string;
  title: string;
  description: string;
  imgUrl?: string;
}
