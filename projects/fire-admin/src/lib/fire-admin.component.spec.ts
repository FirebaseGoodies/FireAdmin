import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireAdminComponent } from './fire-admin.component';

describe('FireAdminComponent', () => {
  let component: FireAdminComponent;
  let fixture: ComponentFixture<FireAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
