import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RecipeFeedComponent } from './recipe-feed.component';

describe('RecipeFeed', () => {
  let component: RecipeFeedComponent;
  let fixture: ComponentFixture<RecipeFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFeedComponent],
      providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
