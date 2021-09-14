import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelConfirmModalComponent } from './del-confirm-modal.component';

describe('DelConfirmModalComponent', () => {
  let component: DelConfirmModalComponent;
  let fixture: ComponentFixture<DelConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelConfirmModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
