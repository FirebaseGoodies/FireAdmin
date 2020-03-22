import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { initTextEditor } from '../../../helpers/posts.helper';
import { I18nService } from '../../../services/i18n.service';
import { slugify } from '../../../helpers/functions.helper';
import { CategoriesService } from '../../../services/collections/categories.service';
import { Category } from '../../../models/collections/category.model';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../services/alert.service';
import { PostsService } from '../../../services/collections/posts.service';
import { NavigationService } from '../../../services/navigation.service';
import { Post, PostStatus } from '../../../models/collections/post.model';
import { getEmptyImage } from '../../../helpers/assets.helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fa-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.css']
})
export class PostsEditComponent implements OnInit, AfterViewInit, OnDestroy {

  private id: string;
  title: string;
  editor: any;
  status: PostStatus;
  language: string;
  slug: string;
  date: string;
  private image: File;
  imageSrc: string|ArrayBuffer;
  checkedCategories: string[] = [];
  categoriesObservable: Observable<Category[]>;
  newCategory: string;
  isSubmitButtonsDisabled: boolean = false;
  allStatus: object|any = {};
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();

  constructor(
    private i18n: I18nService,
    private categories: CategoriesService,
    private alert: AlertService,
    private posts: PostsService,
    public navigation: NavigationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.allStatus = this.posts.getAllStatus();
    this.isSubmitButtonsDisabled = true;
    this.subscription.add(
      this.route.params.subscribe((params: { id: string }) => {
        // console.log(params);
        this.posts.get(params.id).pipe(take(1)).toPromise().then((post: Post) => {
          // console.log(post);
          if (post) {
            this.id = post.id;
            this.title = post.title;
            this.editor.root.innerHTML = post.content;
            this.status = post.status;
            this.slug = post.slug;
            this.date = new Date(post.date).toISOString().slice(0, 10);
            this.language = post.lang;
            this.image = null;
            this.imageSrc = getEmptyImage();
            if (post.image) {
              this.posts.getImageUrl(post.image as  string).pipe(take(1)).toPromise().then((imageUrl: string) => {
                this.imageSrc = imageUrl;
              });
            }
            this.checkedCategories = post.categories ? post.categories : [];
            this.routeParamsChange.next();
            this.setCategoriesObservable();
            this.isSubmitButtonsDisabled = false;
          } else {
            this.navigation.redirectTo('posts', 'list');
          }
        });
      })
    );
  }

  ngAfterViewInit() {
    this.editor = initTextEditor('#editor-container', this.i18n.get('PostContent'));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
  }

  private setCategoriesObservable() {
    this.categoriesObservable = this.categories.getWhere('lang', '==', this.language).pipe(
      map((categories: Category[]) => {
        return categories.sort((a: Category, b: Category) => b.createdAt - a.createdAt);
      }),
      takeUntil(this.routeParamsChange)
    );
  }

  onTitleInput() {
    this.slug = slugify(this.title).substr(0, 50);
  }

  addCategory(event: Event) {
    const target = event.target as any;
    target.disabled = true;
    this.categories.add({
      label: this.newCategory,
      slug: slugify(this.newCategory),
      lang: this.language
    }).catch((error: Error) => {
      this.alert.error(error.message);
    }).finally(() => {
      this.newCategory = '';
    });
  }

  onCategoryCheck(category: Category, event: Event|any) {
    if (event.target.checked) {
      this.checkedCategories.push(category.id);
    } else {
      const index = this.checkedCategories.indexOf(category.id);
      if (index !== -1) {
        this.checkedCategories.splice(index, 1);
      }
    }
  }

  onImageChange(event: Event) {
    this.image = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

  savePost(event: Event) {
    const target = event.target as any;
    const startLoading = () => {
      target.isLoading = true;
      this.isSubmitButtonsDisabled = true;
    };
    const stopLoading = () => {
      target.isLoading = false;
      this.isSubmitButtonsDisabled = false;
    };
    startLoading();
    // Check if post slug is duplicated
    this.posts.isSlugDuplicated(this.slug, this.language, this.id).then((duplicated: boolean) => {
      if (duplicated) {
        // Warn user about post slug
        this.alert.warning(this.i18n.get('PostSlugAlreadyExists'), false, 5000);
        stopLoading();
      } else {
        // Edit post
        const data: Post = {
          lang: this.language,
          title: this.title,
          slug: this.slug,
          date: new Date(this.date).getTime(),
          content: this.editor.root.innerHTML,
          status: this.status,
          categories: this.checkedCategories
        };
        if (this.image) {
          data.image = this.image;
        }
        this.posts.edit(this.id, data).then(() => {
          this.alert.success(this.i18n.get('PostSaved'), false, 5000, true);
          this.navigation.redirectTo('posts', 'list');
        }).catch((error: Error) => {
          this.alert.error(error.message);
        }).finally(() => {
          stopLoading();
        });
      }
    }).catch((error: Error) => {
      this.alert.error(error.message);
      stopLoading();
    });
  }

}
