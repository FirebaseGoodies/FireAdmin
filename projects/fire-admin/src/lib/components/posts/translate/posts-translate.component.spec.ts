import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsTranslateComponent } from './posts-translate.component';

describe('PostsTranslateComponent', () => {
  let component: PostsTranslateComponent;
  let fixture: ComponentFixture<PostsTranslateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsTranslateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
