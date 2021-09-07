import { Component, OnInit } from '@angular/core';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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
   * Fetch all public albums.
   */
  ngOnInit(): void {
    // Set the loading state as loading
    this.loadingState.setLoadingState(true);
    // Fetch the public albums at init
    this.albumService.fetchPublicAlbums();
  }
}
