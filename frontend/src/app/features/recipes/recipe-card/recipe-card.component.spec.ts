import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { RecipeCardComponent } from './recipe-card.component';

describe('RecipeCard', () => {
  let component: RecipeCardComponent;
  let componentRef: ComponentRef<RecipeCardComponent>;
  let fixture: ComponentFixture<RecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('recipe', {
      id: '1',
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: [],
      instructions: [],
      tags: [],
      category: 'Dinner',
      difficulty: 'Easy',
      authorId: 'author-1',
      authorUsername: 'testuser',
      author: { username: 'testuser', avatarUrl: null },
      voteScore: 0,
      createdAt: new Date(),
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
