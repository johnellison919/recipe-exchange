import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { VoteButtonsComponent } from './vote-buttons.component';

describe('VoteButtons', () => {
  let component: VoteButtonsComponent;
  let componentRef: ComponentRef<VoteButtonsComponent>;
  let fixture: ComponentFixture<VoteButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteButtonsComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteButtonsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('recipeId', 'test-id');
    componentRef.setInput('voteScore', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
