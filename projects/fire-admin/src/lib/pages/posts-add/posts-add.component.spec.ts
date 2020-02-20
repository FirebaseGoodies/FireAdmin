import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsAddComponent } from './posts-add.component';

describe('PostsAddComponent', () => {
  let component: PostsAddComponent;
  let fixture: ComponentFixture<PostsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
