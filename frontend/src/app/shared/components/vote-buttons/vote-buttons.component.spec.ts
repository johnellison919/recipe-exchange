import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteButtonsComponent } from './vote-buttons.component';

describe('VoteButtons', () => {
  let component: VoteButtonsComponent;
  let fixture: ComponentFixture<VoteButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteButtonsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
