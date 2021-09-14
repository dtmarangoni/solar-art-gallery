import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
import { Album } from '../../../models/database/Album';

@Component({
  selector: 'app-albums-grid',
  templateUrl: './albums-grid.component.html',
  styleUrls: ['./albums-grid.component.scss'],
})
export class AlbumsGridComponent implements OnInit, OnDestroy {
  // The albums emission subscription
  private albumsSubs!: Subscription;
  // The fetched albums list
  albums!: Album[];

  /**
   * Constructs the Albums Grid component.
   * @param loadingState The Loading State service.
   * @param albumService The API Album service.
   */
  constructor(
    public loadingState: LoadingStateService,
    private albumService: AlbumService
  ) {}

  /**
   * Subscribe to albums list emissions.
   */
  ngOnInit(): void {
    // Subscribe for albums list emissions
    this.albumsSubs = this.albumService.albums.subscribe((response) => {
      this.albums = response.items;
      // Set the loading state as not loading
      this.loadingState.setLoadingState(false);
    });
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy(): void {
    this.albumsSubs.unsubscribe();
  }
}
