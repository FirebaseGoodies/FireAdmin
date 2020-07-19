import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { User, UserRole } from '../../../models/collections/user.model';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/collections/users.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PostsService } from '../../../services/collections/posts.service';
import { Post, PostStatus } from '../../../models/collections/post.model';
import { Language } from '../../../models/language.model';
import { SettingsService } from '../../../services/settings.service';
import { Category } from '../../../models/collections/category.model';
import { CategoriesService } from '../../../services/collections/categories.service';
import { PagesService } from '../../../services/collections/pages.service';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'fa-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit, OnDestroy {

  user: User;
  allRoles: object = {};
  latestPosts: Observable<Post[]>;
  postsLanguage: string;
  languages: Language[];
  allPostsStatus: { labels: object, colors: object };
  allPostsCategories: Category[] = [];
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();
  private postsLanguageChange: Subject<void> = new Subject<void>();
  statistics: { posts?: number, publishedPosts?: number, comments?: number, pages?: number } = {};

  constructor(
    public navigation: NavigationService,
    private users: UsersService,
    private posts: PostsService,
    private categories: CategoriesService,
    private settings: SettingsService,
    private route: ActivatedRoute,
    private pages: PagesService,
    private currentUser: CurrentUserService
  ) { }

  ngOnInit() {
    // Get all roles
    this.allRoles = this.users.getAllRoles();
    // Get languages
    this.languages = this.settings.getActiveSupportedLanguages();
    this.postsLanguage = '*';//this.languages[0].key;
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
    // Get user data
    this.subscription.add(
      this.route.params.subscribe((params: { id: string }) => {
        // console.log(params);
        this.routeParamsChange.next();
        this.postsLanguageChange.next(); // trigger language change too
        this.users.get(params.id).pipe(
          map((user: User) => {
            user.avatar = this.users.getAvatarUrl(user.avatar as string);
            return user;
          }),
          takeUntil(this.routeParamsChange)
        ).subscribe((user: User) => {
          // console.log(user);
          if (user) {
            this.user = user;
            this.user.id = params.id;
            // Get statistics
            this.getStatistics();
            // Get latest posts
            this.getLatestPosts();
          } else {
            this.navigation.redirectTo('users', 'list');
          }
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
    this.postsLanguageChange.next();
  }

  private getLatestPosts() {
    this.latestPosts = this.posts.getWhereFn(ref => {
      let query: any = ref;
      query = query.where('createdBy', '==', this.user.id);
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

  private async getStatistics() {
    if (this.user && this.user.id) {
      this.statistics.posts = await this.posts.countWhere('createdBy', '==', this.user.id);
      const publishedPosts = await this.posts.countWhereFn(ref => ref.where('createdBy', '==', this.user.id).where('status', '==', PostStatus.Published));
      this.statistics.publishedPosts = Math.round((publishedPosts / this.statistics.posts) * 100);
      this.statistics.comments = 0; // ToDo
      this.statistics.pages = await this.pages.countWhere('createdBy', '==', this.user.id);
    }
  }

  canEditProfile() {
    return !this.currentUser.isGuest();
  }

}
