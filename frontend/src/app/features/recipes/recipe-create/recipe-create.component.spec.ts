import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCreateComponent } from './recipe-create.component';

describe('RecipeCreate', () => {
  let component: RecipeCreateComponent;
  let fixture: ComponentFixture<RecipeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
