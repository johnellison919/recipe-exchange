import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { SavedRecipeService } from './saved-recipe.service';

describe('SavedRecipeService', () => {
  let service: SavedRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(SavedRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
