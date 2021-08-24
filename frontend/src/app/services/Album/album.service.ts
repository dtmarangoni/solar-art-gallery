import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import cloneDeep from 'lodash.clonedeep';

import { environment } from '../../../environments/environment';
import { Album } from '../../../models/database/Album';
import {
  AddAlbumParams,
  DeleteAlbumParams,
  EditAlbumParams,
  GetPublicAlbumsParams,
  GetUserAlbumsParams,
} from '../../../models/API/AlbumRequests';
import {
  AddAlbumResponse,
  DeleteAlbumResponse,
  EditAlbumResponse,
  GetPublicAlbumsResponse,
  GetUserAlbumsResponse,
} from '../../../models/API/AlbumResponses';
import { uploadFileForm } from 'src/app/utils/app-utils';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  // Album API endpoints
  private endpoints = environment.apiHost.album;
  // Albums subject observable
  public albums = new Subject<{ items: Album[]; nextKey?: string }>();
  // Fetched albums
  private cachedAlbums: Album[] = [];

  /**
   * Constructs the Album service.
   * @param http The Angular HTTP client service.
   */
  constructor(private http: HttpClient) {}

  /**
   * Fetch all public albums.
   * @param queryParams The request params.
   */
  public fetchPublicAlbums(queryParams?: GetPublicAlbumsParams): void {
    // Request query params
    const params = this.paginationQueryParams(queryParams);
    // Fetch the albums from API server
    this.http
      .get<GetPublicAlbumsResponse>(this.endpoints.getPublicAlbums, {
        params,
        responseType: 'json',
      })
      .subscribe((response) => {
        // Store the fetched albums
        this.cachedAlbums = response.items;
        // Emit the fetched albums
        this.albums.next(cloneDeep(response));
      });
  }

  /**
   * Fetch all user albums.
   * @param queryParams The request params.
   */
  public fetchUserAlbums(queryParams?: GetUserAlbumsParams): void {
    // Request query params
    const params = this.paginationQueryParams(queryParams);
    // Fetch the albums from API server
    this.http
      .get<GetUserAlbumsResponse>(this.endpoints.getUserAlbums, {
        params: params,
        responseType: 'json',
      })
      .subscribe((response) => {
        // Store the fetched albums
        this.cachedAlbums = response.items;
        // Emit the fetched albums
        this.albums.next(cloneDeep(response));
      });
  }

  /**
   * Add a new album to user portfolio.
   * @param albumData The new album data.
   * @param coverImg The album cover image file.
   */
  public addAlbum(albumData: AddAlbumParams, coverImg: File) {
    this.http
      .post<AddAlbumResponse>(this.endpoints.addAlbum, albumData, {
        responseType: 'json',
      })
      .pipe(
        switchMap((response) => {
          // Extract the new album data from response
          const { uploadUrl, ...album } = response.item;
          // Upload the album cover image
          if (uploadUrl) {
            return this.http
              .put(uploadUrl, uploadFileForm(album.albumId, coverImg))
              .pipe(switchMap(() => of(album)));
          } else {
            return throwError(
              'An upload url is necessary to upload the album cover image.'
            );
          }
        })
      )
      .subscribe((response) => {
        // Add the new album to the albums list
        this.cachedAlbums.push(response);
        // Emit the new albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Edit an album from user portfolio.
   * @param albumData The album data to be edited.
   * @param coverImg The new album cover image file if applicable.
   */
  public editAlbum(albumData: EditAlbumParams, coverImg?: File) {
    this.http
      .patch<EditAlbumResponse>(this.endpoints.editAlbum, albumData, {
        responseType: 'json',
      })
      .pipe(
        switchMap((response) => {
          // Extract the album data from response
          const { uploadUrl, ...album } = response.item;
          // Upload the new album cover image if necessary
          if (uploadUrl) {
            if (!coverImg)
              return throwError('Missing the album cover image file.');

            return this.http
              .put(uploadUrl, uploadFileForm(album.albumId, coverImg))
              .pipe(switchMap(() => of(album)));
          } else {
            return of(album);
          }
        })
      )
      .subscribe((response) => {
        // Edit the album data in albums list
        this.cachedAlbums[
          this.cachedAlbums.findIndex(
            (album) => album.albumId == response.albumId
          )
        ] = response;
        // Emit the new albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Delete an album from user portfolio.
   * @param albumData The album data to be deleted.
   */
  public deleteAlbum(albumData: DeleteAlbumParams) {
    this.http
      .request<DeleteAlbumResponse>('delete', this.endpoints.deleteAlbum, {
        body: albumData,
        responseType: 'json',
      })
      .subscribe((response) => {
        // Delete the album from albums list
        this.cachedAlbums = this.cachedAlbums.filter(
          (album) => album.albumId != response.item.albumId
        );
        // Emit the new albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Gets all cached albums.
   * @returns The cached albums list. If no album is cached it will
   * return an empty array.
   */
  public getCachedAlbums() {
    return cloneDeep({ items: this.cachedAlbums });
  }

  /**
   * Gets a cached album by its ID.
   * @param albumId The album ID.
   * @returns The cached album if exists or undefined otherwise.
   */
  public getCachedAlbum(albumId: string) {
    return cloneDeep({
      item: this.cachedAlbums.find((album) => album.albumId == albumId),
    });
  }

  /**
   * Create the request pagination query params if necessary.
   * @param queryParams The pagination query params.
   * @returns The HTTP request pagination query params.
   */
  private paginationQueryParams(queryParams?: GetPublicAlbumsParams) {
    if (queryParams) {
      let params = new HttpParams();

      if (queryParams?.limit) {
        params = params.set('limit', queryParams.limit.toString());
      }
      if (queryParams?.nextKey) {
        params = params.set('nextKey', queryParams.nextKey);
      }

      return params;
    }

    // If not provided, return undefined for HTTP query params.
    return undefined;
  }
}
