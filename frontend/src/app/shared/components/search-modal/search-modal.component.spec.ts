import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { SearchModalComponent } from './search-modal.component';

describe('SearchModal', () => {
  let component: SearchModalComponent;
  let componentRef: ComponentRef<SearchModalComponent>;
  let fixture: ComponentFixture<SearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModalComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('isOpen', false);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
