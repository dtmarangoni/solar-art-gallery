import { TestBed } from '@angular/core/testing';

import { CarouselSlideService } from './carousel-slide.service';

describe('CarouselSlideService', () => {
  let service: CarouselSlideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselSlideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
