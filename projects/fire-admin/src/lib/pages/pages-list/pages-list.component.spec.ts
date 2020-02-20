import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesListComponent } from './pages-list.component';

describe('PagesListComponent', () => {
  let component: PagesListComponent;
  let fixture: ComponentFixture<PagesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
