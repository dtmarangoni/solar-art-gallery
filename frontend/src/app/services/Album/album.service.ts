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
} from '../../../models/API/AlbumRequests';
import {
  GetAlbumsResponse,
  AddEditAlbumResponse,
  DeleteAlbumResponse,
} from '../../../models/API/AlbumResponses';
import { paginationQueryParams, uploadFileForm } from '../../utils/app-utils';

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
   * Fetch all user albums.
   * @param queryParams The pagination query params.
   */
  public fetchUserAlbums(queryParams?: PaginationQueryParams) {
    // Request query params
    const params = paginationQueryParams(queryParams);
    // Fetch the albums from API server
    this.http
      .get<GetAlbumsResponse>(this.endpoints.getUserAlbums, {
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
   */
  public addAlbum(albumData: AddAlbumParams) {
    // Split the album request data and album image file
    const { coverImg, ...albumBodyData } = albumData;
    // Add the new album to DB
    this.http
      .post<AddEditAlbumResponse>(this.endpoints.addAlbum, albumBodyData, {
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
        // Edit the album data in albums list
        this.cachedAlbums[
          this.cachedAlbums.findIndex(
            (album) => album.albumId === response.albumId
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
      item: this.cachedAlbums.find((album) => album.albumId === albumId),
    });
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
        .put(uploadUrl, uploadFileForm(album.albumId, albumCoverImg))
        .pipe(switchMap(() => of(album)));
    } else {
      return of(album);
    }
  }
}
