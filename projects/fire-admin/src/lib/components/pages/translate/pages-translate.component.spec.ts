import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesTranslateComponent } from './pages-translate.component';

describe('PagesTranslateComponent', () => {
  let component: PagesTranslateComponent;
  let fixture: ComponentFixture<PagesTranslateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesTranslateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
