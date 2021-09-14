import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
import { ArtService } from '../../services/art/art.service';

@Component({
  selector: 'app-user-album',
  templateUrl: './user-album.component.html',
  styleUrls: ['./user-album.component.scss'],
})
export class UserAlbumComponent implements OnInit, AfterViewInit, OnDestroy {
  // The album emission subscription
  private albumSubs!: Subscription;

  /**
   * Constructs the User Album component.
   * @param route The Angular Activated Route service.
   * @param loadingState The Loading State service.
   * @param albumService The API Album service.
   * @param artService The API Art service.
   */
  constructor(
    private route: ActivatedRoute,
    public loadingState: LoadingStateService,
    private albumService: AlbumService,
    private artService: ArtService
  ) {}

  /**
   * Set the page loading state as loading.
   */
  ngOnInit(): void {
    this.loadingState.setLoadingState(true);
  }

  /**
   * Fetch the user album and arts data after Angular initializes the
   * component's views and child views. The reason being is that child
   * views subscribes for data responses.
   */
  ngAfterViewInit(): void {
    this.fetchAlbumArtsData();
  }

  /**
   * Fetch the user album data from cache or from API server.
   * After fetching the album, retrieve the album arts list data.
   * @returns The album item.
   */
  private fetchAlbumArtsData() {
    // Get the album ID
    const albumId = this.route.snapshot.paramMap.get('id');

    // Subscribe for albums emissions
    this.albumSubs = this.albumService.albums.subscribe((response) => {
      if (response.items.length === 0) {
        // Album not found in cache, thus fetch it from API server
        this.albumService.fetchUserAlbum({ albumId: albumId! });
      } else {
        // Album found, fetch the album arts list
        this.artService.fetchUserAlbumsArts({
          albumId: response.items[0].albumId,
        });
      }
    });

    // Get the album from cache
    this.albumService.fetchCachedAlbum(albumId!);
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy(): void {
    this.albumSubs.unsubscribe();
  }
}
