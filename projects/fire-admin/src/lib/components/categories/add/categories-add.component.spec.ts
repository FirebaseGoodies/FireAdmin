import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesAddComponent } from './categories-add.component';

describe('CategoriesAddComponent', () => {
  let component: CategoriesAddComponent;
  let fixture: ComponentFixture<CategoriesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
