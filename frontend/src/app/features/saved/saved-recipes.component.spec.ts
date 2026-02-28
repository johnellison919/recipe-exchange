import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { SavedRecipesComponent } from './saved-recipes.component';

describe('SavedRecipes', () => {
  let component: SavedRecipesComponent;
  let fixture: ComponentFixture<SavedRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedRecipesComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedRecipesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
