import { Component, OnInit, AfterViewInit } from '@angular/core';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  /**
   * Constructs the Home component.
   * @param loadingState The Loading State service.
   * @param albumService The API Album service.
   */
  constructor(
    public loadingState: LoadingStateService,
    private albumService: AlbumService
  ) {}

  /**
   * Set the page loading state as loading.
   */
  ngOnInit(): void {
    this.loadingState.setLoadingState(true);
  }

  /**
   * Fetch the public albums data after Angular initializes the
   * component's views and child views. The reason being is that child
   * views subscribes for data responses.
   */
  ngAfterViewInit(): void {
    this.albumService.fetchPublicAlbums();
  }
}
