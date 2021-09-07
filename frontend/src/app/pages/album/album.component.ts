import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
import { ArtService } from '../../services/art/art.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  // The album emission subscription
  private albumSubs!: Subscription;

  /**
   * Constructs the Arts Carousel component.
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
   * Init album and arts data and services subscriptions.
   */
  ngOnInit(): void {
    // Set the loading state as loading
    this.loadingState.setLoadingState(true);

    // Fetch the album from cache or API server
    this.albumSubs = this.fetchAlbumData().subscribe((album) =>
      // Fetch the arts list at init
      this.artService.fetchPublicAlbumArts({ albumId: album.albumId })
    );
  }

  /**
   * Fetch the public album data from cache or from API server.
   * @returns The album item.
   */
  private fetchAlbumData() {
    // Get the album ID
    const albumId = this.route.snapshot.paramMap.get('id');
    // Get the album from cache
    const album = this.albumService.getCachedAlbum(albumId!).item;

    if (album) {
      // Album already in cached list
      return of(album);
    } else {
      // If album isn't present in cached list, fetch it from server
      this.albumService.fetchPublicAlbum({ albumId: albumId! });

      // If the albums isn't present in backend, the observable will
      // throw an error
      return this.albumService.albums.pipe(
        switchMap(() =>
          // Get the album from cache
          of(this.albumService.getCachedAlbum(albumId!).item!)
        )
      );
    }
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy(): void {
    this.albumSubs.unsubscribe();
  }
}
