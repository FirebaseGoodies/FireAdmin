import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../../services/collections/posts.service';
import { PagesService } from '../../services/collections/pages.service';
import { UsersService } from '../../services/collections/users.service';
import { TranslationsService } from '../../services/collections/translations.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Post, PostStatus } from '../../models/collections/post.model';
import { Language } from '../../models/language.model';
import { Category } from '../../models/collections/category.model';
import { SettingsService } from '../../services/settings.service';
import { CategoriesService } from '../../services/collections/categories.service';
import { map, takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { initPieChart } from '../../helpers/charts.helper';
import { I18nService } from '../../services/i18n.service';
import { CurrentUserService } from '../../services/current-user.service';

type PostByStatus = {
  label: string,
  count: number,
  //percentage: number
};

@Component({
  selector: 'fa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  statistics: { posts?: number, pages?: number, comments?: number, users?: number, translations?: number } = {};
  latestPosts: Observable<Post[]>;
  postsLanguage: string;
  postsByStatus: Observable<PostByStatus[]>;
  postsByStatusLanguage: string;
  languages: Language[];
  allPostsStatus: { labels: object, colors: object };
  allPostsCategories: Category[] = [];
  private subscription: Subscription = new Subscription();
  private postsLanguageChange: Subject<void> = new Subject<void>();
  private postsByStatusLanguageChange: Subject<void> = new Subject<void>();

  constructor(
    private posts: PostsService,
    private pages: PagesService,
    private users: UsersService,
    private translations: TranslationsService,
    private categories: CategoriesService,
    private settings: SettingsService,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    private i18n: I18nService
  ) { }

  ngOnInit() {
    // Get statistics
    this.getStatistics();
    // Get languages
    this.languages = this.settings.getActiveSupportedLanguages();
    this.postsLanguage = '*';//this.languages[0].key;
    this.postsByStatusLanguage = '*';//this.languages[0].key;
    // Get all posts status
    this.allPostsStatus = this.posts.getAllStatusWithColors();
    // Get all posts categories
    this.subscription.add(
      this.categories.getAll().pipe(map((categories: Category[]) => {
        const allCategories: Category[] = [];
        categories.forEach((category: Category) => {
          allCategories[category.id] = category;
        });
        return allCategories;
      })).subscribe((categories: Category[]) => {
        // console.log(categories);
        this.allPostsCategories = categories;
      })
    );
    // Get latest posts
    this.getLatestPosts();
    // Get posts by status
    this.getPostsByStatus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.postsLanguageChange.next();
    this.postsByStatusLanguageChange.next();
  }

  private async getStatistics() {
    this.statistics.posts = await this.posts.countAll();
    this.statistics.pages = await this.pages.countAll();
    this.statistics.comments = 0; // ToDo
    if (this.currentUser.isAdmin()) {
      this.statistics.users = await this.users.countAll();
    }
    this.statistics.translations = await this.translations.countAll();
  }

  private getLatestPosts() {
    this.latestPosts = this.posts.getWhereFn(ref => {
      let query: any = ref;
      // Filter by lang
      if (this.postsLanguage !== '*') {
        query = query.where('lang', '==', this.postsLanguage);
      }
      // orderBy & limit requires a database index to work with the where condition above
      // as a workaround, they were replaced with client side sort/slice functions below
      // query = query.orderBy('createdAt', 'desc');
      // query = query.limit(5);
      return query;
    }, true).pipe(
      map((posts: Post[]) => {
        // console.log(posts);
        return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt).slice(0, 5);
      }),
      takeUntil(this.postsLanguageChange)
    );
  }

  onPostsLanguageChange() {
    this.postsLanguageChange.next();
    this.getLatestPosts();
  }

  private getPostsByStatus() {
    this.postsByStatus = this.posts.getWhereFn(ref => {
      let query: any = ref;
      // Filter by lang
      if (this.postsByStatusLanguage !== '*') {
        query = query.where('lang', '==', this.postsByStatusLanguage);
      }
      return query;
    }, true).pipe(
      map((posts: Post[]) => {
        // console.log(posts);
        let postsByStatus: PostByStatus[] = [];
        Object.keys(PostStatus).forEach((key: string) => {
          postsByStatus[PostStatus[key]] = {
            label: key,
            count: 0,
            //percentage: 0
          };
        });
        // Get status count
        posts.forEach((post: Post) => {
          postsByStatus[post.status].count += 1;
        })
        // Convert count to %
        // const postsCount = posts.length;
        // Object.keys(postsByStatus).forEach((key: string) => {
        //   postsByStatus[key].percentage = Math.round((postsByStatus[key].count / postsCount) * 100);
        // });
        return postsByStatus;
      }),
      takeUntil(this.postsByStatusLanguageChange)
    );
    this.subscription.add(
      this.postsByStatus.subscribe((postsByStatus: PostByStatus[]) => {
        //console.log(postsByStatus);
        const data = Object.keys(postsByStatus).map((key: string) => postsByStatus[key].count);
        const labels = Object.keys(postsByStatus).map((key: string) => this.i18n.get(postsByStatus[key].label));
        setTimeout(() => { // setTimeout used to wait for canvas html element to render
          initPieChart('#posts-by-status', data, labels);
        }, 0);
      })
    );
  }

  onPostsByStatusLanguageChange() {
    this.postsByStatusLanguageChange.next();
    this.getPostsByStatus();
  }

}
