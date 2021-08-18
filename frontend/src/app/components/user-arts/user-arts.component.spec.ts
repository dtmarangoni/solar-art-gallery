import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserArtsComponent } from './user-arts.component';

describe('UserArtsComponent', () => {
  let component: UserArtsComponent;
  let fixture: ComponentFixture<UserArtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserArtsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserArtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
