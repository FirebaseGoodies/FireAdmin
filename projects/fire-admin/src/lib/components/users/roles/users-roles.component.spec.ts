import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRolesComponent } from './users-roles.component';

describe('UsersRolesComponent', () => {
  let component: UsersRolesComponent;
  let fixture: ComponentFixture<UsersRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
