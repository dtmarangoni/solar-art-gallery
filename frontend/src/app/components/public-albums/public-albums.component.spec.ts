import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAlbumsComponent } from './public-albums.component';

describe('PublicAlbumsComponent', () => {
  let component: PublicAlbumsComponent;
  let fixture: ComponentFixture<PublicAlbumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAlbumsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
