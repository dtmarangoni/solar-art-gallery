import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbCarouselComponent } from 'mdb-angular-ui-kit/carousel';

import { ViewModalComponent } from '../view-modal/view-modal.component';
import { CarouselSlideService } from '../../services/carousel-slide.service';
import { Art } from '../../../models/database/Art';

@Component({
  selector: 'app-arts-carousel',
  templateUrl: './arts-carousel.component.html',
  styleUrls: ['./arts-carousel.component.scss'],
})
export class ArtsCarouselComponent implements OnInit, OnDestroy {
  // The Carousel Slide Service Subscription
  private carSlideSrvSubs!: Subscription;
  // The art carousel reference
  @ViewChild('carousel') carousel!: MdbCarouselComponent;

  dummyArts = [
    {
      sequenceNum: 0,
      creationDate: '2021-01-01T08:10:20Z',
      artId: 'rj7239tr-e107-4e34-8057-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Claude_Monet_033.jpg/800px-Claude_Monet_033.jpg',
      title: 'Cathedral in Rouen',
    },
    {
      sequenceNum: 1,
      creationDate: '2021-02-11T08:10:20Z',
      artId: 'yup23955-e107-4e34-8057-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/5/5c/Claude_Monet%2C_Impression%2C_soleil_levant%2C_1872.jpg',
      title: 'Sunrise',
    },
    {
      sequenceNum: 2,
      creationDate: '2021-03-16T08:10:20Z',
      artId: 'gg0039rr-e107-4e34-8057-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/La_Seine_%C3%A0_Asni%C3%A8re_-_Monet.jpg/1280px-La_Seine_%C3%A0_Asni%C3%A8re_-_Monet.jpg',
      title: 'La Seine à Asnières',
    },
    {
      sequenceNum: 3,
      creationDate: '2021-05-21T08:10:20Z',
      artId: 'dac239tr-e107-4e34-8259-4b42477a1259',
      description:
        'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      albumId: '08c17db6-547f-4078-924f-7eaaaf3bb742',
      imgUrl:
        'https://upload.wikimedia.org/wikipedia/commons/1/10/Eglise_de_V%C3%A9theuil.jpg',
      title: 'Eglise de Vétheuil',
    },
  ];

  /**
   * Constructs the Arts Carousel component.
   * @param carouselSlideService The carousel current slide service.
   * @param modalService The MDB angular modal service.
   */
  constructor(
    private carouselSlideService: CarouselSlideService,
    private modalService: MdbModalService
  ) {}

  /**
   * Subscribe to user click slide changes from Carousel Slide Service.
   */
  ngOnInit(): void {
    this.carSlideSrvSubs = this.carouselSlideService.slideChanged.subscribe(
      (slideIndex) => this.setCarouselSlide(slideIndex)
    );
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
  }
}
