import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import cloneDeep from 'lodash.clonedeep';

import { environment } from '../../../environments/environment';
import { Album } from '../../../models/database/Album';
import { PaginationQueryParams } from '../../../models/API/Common';
import {
  AddAlbumParams,
  EditAlbumParams,
  DeleteAlbumParams,
  GetAlbumParams,
} from '../../../models/API/AlbumRequests';
import {
  GetAlbumsResponse,
  AddEditAlbumResponse,
  DeleteAlbumResponse,
  GetAlbumResponse,
} from '../../../models/API/AlbumResponses';
import { paginationQueryParams } from '../../utils/app-utils';

@Injectable({ providedIn: 'root' })
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
   * A new albums emission will occur subsequently.
   * @param queryParams The pagination query params.
   */
  public fetchPublicAlbums(queryParams?: PaginationQueryParams) {
    // Request query params
    const params = paginationQueryParams(queryParams);
    // Fetch the albums from API server
    this.http
      .get<GetAlbumsResponse>(this.endpoints.getPublicAlbums, {
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
   * Fetches a public album.
   * A new albums emission will occur subsequently.
   * @param albumData The necessary album data to fetch operation.
   */
  public fetchPublicAlbum(albumData: GetAlbumParams) {
    // Fetches the public album from API server
    this.http
      .post<GetAlbumResponse>(this.endpoints.getPublicAlbum, albumData, {
        responseType: 'json',
      })
      .subscribe((response) => {
        // Add or update the album in cached albums list
        this.putAlbumInCache(response.item);
        // Emit the updated albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Fetch all user albums.
   * A new albums emission will occur subsequently.
   * @param queryParams The pagination query params.
   */
  public fetchUserAlbums(queryParams?: PaginationQueryParams) {
    // Request query params
    const params = paginationQueryParams(queryParams);
    // Fetch the albums from API server
    this.http
      .get<GetAlbumsResponse>(this.endpoints.getUserAlbums, {
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
   * Fetches an user album.
   * A new albums emission will occur subsequently.
   * @param albumData The necessary album data to fetch operation.
   */
  public fetchUserAlbum(albumData: GetAlbumParams) {
    // Fetches the user album from API server
    this.http
      .post<GetAlbumResponse>(this.endpoints.getUserAlbum, albumData, {
        responseType: 'json',
      })
      .subscribe((response) => {
        // Add or update the album in cached albums list
        this.putAlbumInCache(response.item);
        // Emit the updated albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Add a new album to user portfolio.
   * A new albums emission will occur subsequently.
   * @param albumData The new album data.
   */
  public addAlbum(albumData: AddAlbumParams) {
    // Split the album request data and album image file
    const { coverImg, ...albumBodyData } = albumData;
    // Add the new album to DB
    this.http
      .put<AddEditAlbumResponse>(this.endpoints.addAlbum, albumBodyData, {
        responseType: 'json',
      })
      .pipe(switchMap((response) => this.uploadAlbumImg(response, coverImg)))
      .subscribe((response) => {
        // Add the new album to the albums list
        this.cachedAlbums.push(response);
        // Emit the new albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Edit an album from user portfolio.
   * A new albums emission will occur subsequently.
   * @param albumData The album data to be edited.
   */
  public editAlbum(albumData: EditAlbumParams) {
    // Split the album request data and album image file
    const { coverImg, ...albumBodyData } = albumData;
    // Edit the album in DB
    this.http
      .patch<AddEditAlbumResponse>(this.endpoints.editAlbum, albumBodyData, {
        responseType: 'json',
      })
      .pipe(switchMap((response) => this.uploadAlbumImg(response, coverImg)))
      .subscribe((response) => {
        // Find the edited album index
        const albumIndex = this.cachedAlbums.findIndex(
          (album) => album.albumId === response.albumId
        );
        // Edit the album data in albums list
        this.cachedAlbums[albumIndex] = {
          ...response,
          coverUrl: response.coverUrl
            ? response.coverUrl
            : this.cachedAlbums[albumIndex].coverUrl,
        };
        // Emit the new albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Delete an album from user portfolio.
   * A new albums emission will occur subsequently.
   * @param albumData The album data required for delete operation.
   */
  public deleteAlbum(albumData: DeleteAlbumParams) {
    // Perform the delete request to API server
    this.http
      .request<DeleteAlbumResponse>('delete', this.endpoints.deleteAlbum, {
        body: albumData,
        responseType: 'json',
      })
      .subscribe((response) => {
        // Delete the album from albums list
        this.cachedAlbums = this.cachedAlbums.filter(
          (album) => album.albumId !== response.item.albumId
        );
        // Emit the new albums list
        this.albums.next(cloneDeep({ items: this.cachedAlbums }));
      });
  }

  /**
   * Fetches all cached albums.
   * A new albums emission will occur subsequently.
   */
  public fetchCachedAlbums() {
    // Emit the cached albums list
    this.albums.next(cloneDeep({ items: this.cachedAlbums }));
  }

  /**
   * Fetches a cached album by its ID.
   * A new albums emission will occur subsequently.
   * @param albumId The album ID.
   */
  public fetchCachedAlbum(albumId: string) {
    // Find the album
    const album = this.cachedAlbums.find((album) => album.albumId === albumId);
    // Emit the cached album if found or an empty array otherwise
    this.albums.next(cloneDeep({ items: album ? [album] : [] }));
  }

  /**
   * Add or update an album item in cached albums list.
   * @param album The album item.
   */
  private putAlbumInCache(album: Album) {
    // Find the album index if exists
    const albumIndex = this.cachedAlbums.findIndex(
      (cachedAlbum) => cachedAlbum.albumId === album.albumId
    );
    // If album not present in cached albums list, add it
    if (albumIndex === -1) this.cachedAlbums.push(album);
    // If album already present in cached albums list, update it
    else this.cachedAlbums[albumIndex] = album;
  }

  /**
   * If necessary, upload the album cover image after add or edit album
   * operation.
   * @param addEditResp The add or edit album request response.
   * @param albumCoverImg The album cover image.
   * @returns The album data observable from add or edit response after
   * successful upload or an error observable in case of missing
   * required data.
   */
  private uploadAlbumImg(
    addEditResp: AddEditAlbumResponse,
    albumCoverImg?: File
  ): Observable<Album> | Observable<never> {
    // Split the added album data and upload url from add/edit response
    const { uploadUrl, ...album } = addEditResp.item;
    // Upload the new album cover image if necessary
    if (uploadUrl) {
      if (!albumCoverImg)
        return throwError('Missing the album cover image file.');

      return this.http
        .put(uploadUrl, albumCoverImg, {
          headers: { 'Content-Type': albumCoverImg.type },
        })
        .pipe(switchMap(() => of(album)));
    } else {
      return of(album);
    }
  }
}
