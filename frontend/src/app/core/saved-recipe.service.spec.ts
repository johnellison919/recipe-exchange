import { TestBed } from '@angular/core/testing';

import { SavedRecipeService } from './saved-recipe.service';

describe('SavedRecipeService', () => {
  let service: SavedRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
