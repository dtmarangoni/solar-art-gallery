import { Component, OnInit, AfterViewInit } from '@angular/core';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
@Component({
  selector: 'app-user-portfolio',
  templateUrl: './user-portfolio.component.html',
  styleUrls: ['./user-portfolio.component.scss'],
})
export class UserPortfolioComponent implements OnInit, AfterViewInit {
  /**
   * Constructs the User Portfolio component.
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
   * Fetch the user albums data after Angular initializes the
   * component's views and child views. The reason being is that child
   * views subscribes for data responses.
   */
  ngAfterViewInit(): void {
    this.albumService.fetchUserAlbums();
  }
}
