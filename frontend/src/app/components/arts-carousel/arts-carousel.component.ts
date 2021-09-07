import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbCarouselComponent } from 'mdb-angular-ui-kit/carousel';

import { ViewModalComponent } from '../view-modal/view-modal.component';
import { LoadingStateService } from '../../services/loading-state/loading-state.service';
import { AlbumService } from '../../services/album/album.service';
import { ArtService } from '../../services/art/art.service';
import { CarouselSlideService } from '../../services/carousel-slide/carousel-slide.service';
import { Album } from '../../../models/database/Album';
import { Art } from '../../../models/database/Art';

@Component({
  selector: 'app-arts-carousel',
  templateUrl: './arts-carousel.component.html',
  styleUrls: ['./arts-carousel.component.scss'],
})
export class ArtsCarouselComponent implements OnInit, OnDestroy {
  // The albums emission subscription
  private albumsSubs!: Subscription;
  // The arts emission subscription
  private artsSubs!: Subscription;
  // The Carousel Slide service subscription
  private carSlideSrvSubs!: Subscription;
  // The arts album
  album!: Album;
  // The fetched album arts
  arts!: Art[];
  // The art carousel reference
  @ViewChild('carousel') private carousel!: MdbCarouselComponent;

  /**
   * Constructs the Arts Carousel component.
   * @param route The Angular Activated Route service.
   * @param modalService The MDB angular modal service.
   * @param loadingState The Loading State service.
   * @param albumService The API Album service.
   * @param artService The API Art service.
   * @param carouselSlideService The carousel current slide service.
   */
  constructor(
    private route: ActivatedRoute,
    private modalService: MdbModalService,
    public loadingState: LoadingStateService,
    private albumService: AlbumService,
    private artService: ArtService,
    private carouselSlideService: CarouselSlideService
  ) {}

  /**
   * Init album data and services subscriptions.
   */
  ngOnInit(): void {
    // Subscribe for arts list emissions
    this.artsSubs = this.artService.arts.subscribe((response) => {
      this.arts = response.items;
      // Set the loading state as not loading
      this.loadingState.setLoadingState(false);
    });

    // Subscribe to user click slide changes from Carousel Slide Service.
    this.carSlideSrvSubs = this.carouselSlideService.slideChanged.subscribe(
      (slideIndex) => this.setCarouselSlide(slideIndex)
    );

    // Fetch the public album data from cache or albums list emissions.
    this.fetchAlbumData();
  }

  /**
   * Fetch the public album data from cache or albums list emissions.
   */
  private fetchAlbumData() {
    const albumId = this.route.snapshot.paramMap.get('id')!;
    // Get the album from cache
    this.album = this.albumService.getCachedAlbum(albumId).item!;

    // If not in cache, get the album from albums list emissions
    if (!this.album) {
      this.albumsSubs = this.albumService.albums.subscribe(() => {
        this.album = this.albumService.getCachedAlbum(albumId).item!;
      });
    }
  }

  /**
   * Set the current carousel slide by its index.
   * @param index The carousel slide index number.
   */
  setCarouselSlide(index: number): void {
    this.carousel.to(index);
  }

  /**
   * Opens the view modal to visualize the art painting.
   * @param art The art clicked item.
   */
  onOpenViewModal(art: Art) {
    this.modalService.open(ViewModalComponent, {
      modalClass: 'art-modal-dialog',
      data: { art },
    });
  }

  /**
   * Avoid memory leaks unsubscribing from all registered services.
   */
  ngOnDestroy() {
    this.carSlideSrvSubs.unsubscribe();
    this.artsSubs.unsubscribe();
    if (this.albumsSubs) this.albumsSubs.unsubscribe();
  }
}
