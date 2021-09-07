import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { ArtService } from '../../services/art/art.service';
import { CarouselSlideService } from '../../services/carousel-slide/carousel-slide.service';
import { Art } from '../../../models/database/Art';

@Component({
  selector: 'app-arts-sidebar',
  templateUrl: './arts-sidebar.component.html',
  styleUrls: ['./arts-sidebar.component.scss'],
})
export class ArtsSidebarComponent implements OnInit, OnDestroy {
  // The arts emission subscription
  private artsSubs!: Subscription;
  // The fetched album arts
  arts!: Art[];

  /**
   * Constructs the Arts Sidebar Component.
   * @param loadingState: LoadingStateService,
   * @param artService The API Art service.
   * @param carouselSlideService The carousel current slide service.
   */
  constructor(
    public loadingState: LoadingStateService,
    private artService: ArtService,
    private carouselSlideService: CarouselSlideService
  ) {}

  /**
   * Init services subscriptions.
   */
  ngOnInit(): void {
    // Subscribe for arts list emissions
    this.artsSubs = this.artService.arts.subscribe((response) => {
      this.arts = response.items;
      // Set the loading state as not loading
      this.loadingState.setLoadingState(false);
    });
  }

  /**
   * Use the Carousel slide service to emit which list art index was
   * clicked.
   * @param art The clicked art item.
   */
  onArtClick(artIndex: number) {
    this.carouselSlideService.setCurrentSlide(artIndex);
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy() {
    this.artsSubs.unsubscribe();
  }
}
