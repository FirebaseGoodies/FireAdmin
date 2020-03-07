import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfileComponent } from './users-profile.component';

describe('UsersProfileComponent', () => {
  let component: UsersProfileComponent;
  let fixture: ComponentFixture<UsersProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
