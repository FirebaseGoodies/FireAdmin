import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesAddComponent } from './pages-add.component';

describe('PagesAddComponent', () => {
  let component: PagesAddComponent;
  let fixture: ComponentFixture<PagesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
