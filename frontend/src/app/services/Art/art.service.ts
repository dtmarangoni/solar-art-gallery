import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError, from, Observable } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';
import cloneDeep from 'lodash.clonedeep';

import { environment } from '../../../environments/environment';
import { Art } from '../../../models/database/Art';
import { PaginationQueryParams } from '../../../models/API/Common';
import {
  DeleteArtsParams,
  GetAlbumArtsParams,
  PutArtsParams,
} from '../../../models/API/ArtRequests';
import {
  DeleteArtsResponse,
  GetAlbumArtsResponse,
  PutArtsResponse,
} from '../../../models/API/ArtResponses';
import {
  paginationQueryParams,
  splitArrObjsProps,
} from '../../utils/app-utils';

@Injectable({ providedIn: 'root' })
export class ArtService {
  // Art API endpoints
  private endpoints = environment.apiHost.art;
  // Arts subject observable
  public arts = new Subject<{ items: Art[]; nextKey?: string }>();
  // Fetched arts
  private cachedArts: Art[] = [];

  /**
   * Constructs the Art service.
   * @param http The Angular HTTP client service.
   */
  constructor(private http: HttpClient) {}

  /**
   * Fetch all arts from a public album.
   * @param albumData The album data to retrieve the arts from.
   * @param queryParams The pagination query params.
   */
  public fetchPublicAlbumArts(
    albumData: GetAlbumArtsParams,
    queryParams?: PaginationQueryParams
  ) {
    // Request query params
    const params = paginationQueryParams(queryParams);
    // Fetch the album arts from API server
    this.http
      .post<GetAlbumArtsResponse>(
        this.endpoints.getPublicAlbumArts,
        albumData,
        { params, responseType: 'json' }
      )
      .subscribe((response) => {
        // Store the fetched album arts
        this.cachedArts = response.items;
        // Emit the fetched album arts
        this.arts.next(cloneDeep(response));
      });
  }

  /**
   * Fetch all arts from an user album.
   * @param albumData The album data to retrieve the arts from.
   * @param queryParams The pagination query params.
   */
  public fetchUserAlbums(
    albumData: GetAlbumArtsParams,
    queryParams?: PaginationQueryParams
  ): void {
    // Request query params
    const params = paginationQueryParams(queryParams);
    // Fetch the album arts from API server
    this.http
      .post<GetAlbumArtsResponse>(this.endpoints.getUserAlbumArts, albumData, {
        params,
        responseType: 'json',
      })
      .subscribe((response) => {
        // Store the fetched album arts
        this.cachedArts = response.items;
        // Emit the fetched album arts
        this.arts.next(cloneDeep(response));
      });
  }

  /**
   * Add or edit arts to or from an user album.
   * @param artsData The arts data to be added or edited.
   * @param artImg The art image file if applicable.
   */
  public putArts(artsData: PutArtsParams[]) {
    // Split the arts request data and arts images files
    const putArtsData = splitArrObjsProps(artsData, 'artImg');
    // Perform the add / edit request
    this.http
      .put<PutArtsResponse>(
        this.endpoints.putArts,
        putArtsData.remainingProps,
        { responseType: 'json' }
      )
      .pipe(switchMap((putRes) => this.uploadArtsImgs(artsData, putRes)))
      .subscribe((response) => {
        // All arts are always returned. Update the cached arts list
        this.cachedArts = response;
        // Emit the new arts list
        this.arts.next(cloneDeep({ items: this.cachedArts }));
      });
  }

  public deleteArts(artsData: DeleteArtsParams) {
    // Perform the delete request to API server
    this.http
      .request<DeleteArtsResponse>('delete', this.endpoints.deleteArts, {
        body: artsData,
        responseType: 'json',
      })
      .subscribe((response) => {
        // Remove the deleted arts from arts list
        response.items.forEach((respItem) =>
          this.cachedArts.splice(
            this.cachedArts.findIndex((art) => art.artId === respItem.artId),
            1
          )
        );
        // Emit the new arts list
        this.arts.next(cloneDeep({ items: this.cachedArts }));
      });
  }

  /**
   * Gets all cached arts.
   * @returns The cached arts list. If no art is cached it will return
   * an empty array.
   */
  public getCachedArts() {
    return cloneDeep({ items: this.cachedArts });
  }

  /**
   * Gets a cached art by its ID.
   * @param artId The art ID.
   * @returns The cached art if exists or undefined otherwise.
   */
  public getCachedArt(artId: string) {
    return cloneDeep({
      item: this.cachedArts.find((art) => art.artId === artId),
    });
  }

  /**
   * If necessary, upload the arts images after add or edit arts
   * operation.
   * @param addEditReq The add or edit arts request params.
   * @param addEditRes The add or edit arts request response.
   * @returns The arts data observable from add or edit response after
   * successful uploads or an error observable in case of missing
   * required data.
   */
  private uploadArtsImgs(
    addEditReq: PutArtsParams[],
    addEditRes: PutArtsResponse
  ): Observable<Art[]> | Observable<never> {
    // Split the arts data and upload url from response
    const onlyArtsData = splitArrObjsProps(addEditRes.items, 'uploadUrl');
    // Concatenate arts data from request and response
    const concatArtsReqRes = this.concatArtsDataArrays(addEditReq, addEditRes);

    // Upload the arts images if necessary
    const artsUpload = concatArtsReqRes.filter((art) => art?.uploadUrl);
    if (artsUpload.length > 0) {
      return from(artsUpload).pipe(
        concatMap((artUpload) => {
          if (artUpload.artId && artUpload?.uploadUrl && artUpload.artImg)
            return this.http.put(artUpload.uploadUrl, artUpload.artImg, {
              headers: { 'Content-Type': artUpload.artImg.type },
            });
          else
            return throwError(
              'Missing art information or image file to proceed with the upload.'
            );
        }),
        switchMap(() => of(onlyArtsData.remainingProps))
      );
    } else {
      // No file to upload
      return of(onlyArtsData.remainingProps);
    }
  }

  /**
   * Concatenate each art params and art response data items for put
   * operation.
   * @param artParamArr The art params data array.
   * @param artRespArr The art response data array.
   * @returns The concatenated arts data array.
   */
  private concatArtsDataArrays(
    artParamArr: PutArtsParams[],
    artRespArr: PutArtsResponse
  ) {
    return artParamArr.map((artParamEl, index) => {
      if (artParamEl.artId) {
        // Match for edit operation - pre-existing art items
        return {
          ...artParamEl,
          ...artRespArr.items.find((item) => item.artId === artParamEl.artId),
        };
      } else if (
        artParamEl.title === artRespArr.items[index].title &&
        artParamEl.description === artRespArr.items[index].description
      ) {
        // Match for add operation, no artId exists at beforehand
        // Match by index, title and description - if same ordering
        // between request and response - more chance of correct match
        return { ...artParamEl, ...artRespArr.items[index] };
      } else {
        // If not possible, then only by title and description. More
        // prone error if more items have same title and description
        return {
          ...artParamEl,
          ...artRespArr.items.find(
            (item) =>
              item.title === artParamEl.title &&
              item.description === artParamEl.description
          ),
        };
      }
    });
  }
}
