import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription, Observable } from 'rxjs';
import { Post, PostStatus } from '../../../models/collections/post.model';
import { PostsService } from '../../../services/collections/posts.service';
import { map, takeUntil } from 'rxjs/operators';
import { refreshDataTable } from '../../../helpers/datatables.helper';
import { AlertService } from '../../../services/alert.service';
import { NavigationService } from '../../../services/navigation.service';
import { I18nService } from '../../../services/i18n.service';
import { Category } from '../../../models/collections/category.model';
import { CategoriesService } from '../../../services/collections/categories.service';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { Language } from '../../../models/language.model';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'fa-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {

  allPosts: Observable<Post[]>;
  selectedPost: Post = null;
  @ViewChild(DataTableDirective, {static : false}) private dataTableElement: DataTableDirective;
  dataTableOptions: DataTables.Settings|any = {
    responsive: true,
    aaSorting: []
  };
  dataTableTrigger: Subject<void> = new Subject();
  private subscription: Subscription = new Subscription();
  allStatus: { labels: object, colors: object };
  allCategories: Category[] = [];
  allLanguages: Language[] = [];
  private routeParamsChange: Subject<void> = new Subject<void>();
  isLoading: boolean = true;

  constructor(
    private posts: PostsService,
    private categories: CategoriesService,
    private alert: AlertService,
    private i18n: I18nService,
    private route: ActivatedRoute,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    // Get all status
    this.allStatus = this.posts.getAllStatusWithColors();
    // Get all categories
    this.subscription.add(
      this.categories.getAll().pipe(map((categories: Category[]) => {
        const allCategories: Category[] = [];
        categories.forEach((category: Category) => {
          allCategories[category.id] = category;
        });
        return allCategories;
      })).subscribe((categories: Category[]) => {
        // console.log(categories);
        this.allCategories = categories;
      })
    );
    // Get all languages
    this.settings.supportedLanguages.forEach((language: Language) => {
      this.allLanguages[language.key] = language;
    });
    // Get route params
    this.subscription.add(
      this.route.params.subscribe((params: { status: string, categoryId: string, authorId: string }) => {
        this.routeParamsChange.next();
        this.isLoading = true;
        // Get all posts
        this.allPosts = this.posts.getWhereFn(ref => {
          let query: any = ref;
          // Filter by status
          if (params.status) {
            query = query.where('status', '==', params.status);
          }
          // Filter by category
          else if (params.categoryId) {
            query = query.where('categories', 'array-contains', params.categoryId);
          }
          // Filter by author
          else if (params.authorId) {
            query = query.where('createdBy', '==', params.authorId);
          }
          //query = query.orderBy('createdAt', 'desc'); // requires an index to work
          return query;
        }, true).pipe(
          map((posts: Post[]) => {
            return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
          }),
          takeUntil(this.routeParamsChange)
        );
        this.subscription.add(
          this.allPosts.subscribe((posts: Post[]) => {
            // console.log(posts);
            // Refresh datatable on data change
            refreshDataTable(this.dataTableElement, this.dataTableTrigger);
            this.isLoading = false;
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.dataTableTrigger.unsubscribe();
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
  }

  private setPostStatus(event: Event, post: Post, status: PostStatus) {
    const target = event.target as any;
    target.disabled = true;
    this.posts.setStatus(post.id, status).catch((error: Error) => {
      this.alert.error(error.message);
      target.disabled = false;
    });
  }

  publishPost(event: Event, post: Post) {
    this.setPostStatus(event, post, PostStatus.Published);
  }

  moveToTrash(event: Event, post: Post) {
    this.setPostStatus(event, post, PostStatus.Trash);
  }

  deletePost(post: Post) {
    this.posts.delete(post.id, {
      imagePath: (post.image as any).path as string,
      lang: post.lang,
      translationId: post.translationId,
      translations: post.translations
    }).then(() => {
      this.alert.success(this.i18n.get('PostDeleted', { title: post.title }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

}
