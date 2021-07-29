import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtsCarouselComponent } from './arts-carousel.component';

describe('ArtsCarouselComponent', () => {
  let component: ArtsCarouselComponent;
  let fixture: ComponentFixture<ArtsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtsCarouselComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
