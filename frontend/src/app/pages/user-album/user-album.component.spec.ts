import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAlbumComponent } from './user-album.component';

describe('UserAlbumComponent', () => {
  let component: UserAlbumComponent;
  let fixture: ComponentFixture<UserAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAlbumComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
