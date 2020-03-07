import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription, Observable } from 'rxjs';
import { Post, PostData, PostStatus } from '../../../models/collections/post.model';
import { PostsService } from '../../../services/collections/posts.service';
import { map } from 'rxjs/operators';
import { refreshDataTable } from '../../../helpers/datatables.helper';
import { AlertService } from '../../../services/alert.service';
import { NavigationService } from '../../../services/navigation.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'fa-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {

  allPosts: Observable<PostData[]>;
  selectedPost: Post = null;
  @ViewChild(DataTableDirective, {static : false}) private dataTableElement: DataTableDirective;
  dataTableOptions: DataTables.Settings|any = {
    responsive: true,
    aaSorting: []
  };
  dataTableTrigger: Subject<void> = new Subject();
  private subscription: Subscription = new Subscription();
  allStatus: { labels: object, colors: object };

  constructor(
    private posts: PostsService,
    private alert: AlertService,
    private i18n: I18nService,
    public navigation: NavigationService
  ) {
    this.allStatus = this.posts.getAllStatusWithColors();
  }

  ngOnInit() {
    this.allPosts = this.posts.getAll().pipe(map((posts: PostData[]) => {
      return posts.sort((a: PostData, b: PostData) => b.createdAt - a.createdAt);
    }));
    this.subscription.add(
      this.allPosts.subscribe((posts: PostData[]) => {
        // console.log(posts);
        // Refresh datatable on data change
        refreshDataTable(this.dataTableElement, this.dataTableTrigger);
      })
    );
  }

  ngOnDestroy() {
    this.dataTableTrigger.unsubscribe();
    this.subscription.unsubscribe();
  }

  private setPostStatus(event: Event, post: PostData, status: PostStatus) {
    const target = event.target as any;
    target.disabled = true;
    this.posts.setStatus(post.id, post.lang, status).catch((error: Error) => {
      this.alert.error(error.message);
      target.disabled = false;
    });
  }

  publishPost(event: Event, post: PostData) {
    this.setPostStatus(event, post, PostStatus.Published);
  }

  moveToTrash(event: Event, post: PostData) {
    this.setPostStatus(event, post, PostStatus.Trash);
  }

  deletePost(post: PostData) {
    this.posts.delete(post.id, post.lang).then(() => {
      this.alert.success(this.i18n.get('PostDeleted', { title: post.title }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

}
