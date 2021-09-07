import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class CarouselSlideService {
  // Source subject for slide changed
  private slideChangedSource = new Subject<number>();
  // Slide changed source observable
  public slideChanged = this.slideChangedSource.asObservable();

  /**
   * Emits a new value in slide change source.
   * @param slideIndex The current slide index.
   */
  setCurrentSlide(slideIndex: number) {
    this.slideChangedSource.next(slideIndex);
  }
}
