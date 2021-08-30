/**
 * The request pagination query params.
 */
export interface PaginationQueryParams {
  // The response page items limit size
  limit?: number;
  // The next item key to start the new page from
  nextKey?: string;
}
