import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { User } from '../../../models/collections/user.model';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/collections/users.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { map, takeUntil, take } from 'rxjs/operators';
import { PostsService } from '../../../services/collections/posts.service';
import { PostTranslation } from '../../../models/collections/post.model';
import { Language } from '../../../models/language.model';
import { SettingsService } from '../../../services/settings.service';
import { Category } from '../../../models/collections/category.model';
import { CategoriesService } from '../../../services/collections/categories.service';

@Component({
  selector: 'fa-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit, OnDestroy {

  user: User;
  allRoles: object = {};
  latestPosts: Observable<PostTranslation[]>;
  postsLanguage: string;
  languages: Language[];
  allPostsStatus: { labels: object, colors: object };
  allPostsCategories: Category[] = [];
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();
  private postsLanguageChange: Subject<void> = new Subject<void>();

  constructor(
    public navigation: NavigationService,
    private users: UsersService,
    private posts: PostsService,
    private categories: CategoriesService,
    private settings: SettingsService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    // Get all roles
    this.allRoles = this.users.getAllRoles();
    // Get languages
    this.languages = this.settings.getActiveSupportedLanguages();
    this.postsLanguage = this.languages[0].key;
    // Get all posts status
    this.allPostsStatus = this.posts.getAllStatusWithColors();
    // Get all posts categories
    this.allPostsCategories = await this.categories.getAll().pipe(
      take(1),
      map((categories: Category[]) => {
        const allCategories: Category[] = [];
        categories.forEach((category: Category) => {
          allCategories[category.id] = category;
        });
        return allCategories;
      })
    ).toPromise();
    // Get user data
    this.subscription.add(
      this.route.params.subscribe((params: { id: string }) => {
        // console.log(params);
        this.routeParamsChange.next();
        this.postsLanguageChange.next(); // trigger language change too
        this.subscription.add(
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
              // Get latest posts
              this.getLatestPosts();
            } else {
              this.navigation.redirectTo('users', 'list');
            }
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getLatestPosts() {
    this.latestPosts = this.posts.getWhere(this.postsLanguage + '.createdBy', '==', this.user.id, true).pipe(
      map((posts: PostTranslation[]) => {
        // console.log(posts);
        // Filter by lang
        if (this.postsLanguage) {
          posts = posts.filter((post: PostTranslation) => post.lang === this.postsLanguage);
        }
        return posts.slice(0, 5).sort((a: PostTranslation, b: PostTranslation) => b.createdAt - a.createdAt);
      }),
      takeUntil(this.postsLanguageChange)
    );
  }

  onPostsLanguageChange() {
    this.postsLanguageChange.next();
    this.getLatestPosts();
  }

}
