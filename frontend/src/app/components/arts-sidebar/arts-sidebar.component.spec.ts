import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtsSidebarComponent } from './arts-sidebar.component';

describe('ArtsSidebarComponent', () => {
  let component: ArtsSidebarComponent;
  let fixture: ComponentFixture<ArtsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtsSidebarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
