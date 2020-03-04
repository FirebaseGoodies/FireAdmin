import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription, Observable } from 'rxjs';
import { Post, PostData } from '../../../models/collections/post.model';
import { PostsService } from '../../../services/collections/posts.service';
import { map } from 'rxjs/operators';

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

  constructor(private posts: PostsService) { }

  ngOnInit() {
    this.allPosts = this.posts.getAll().pipe(map((posts: PostData[]) => {
      return posts.sort((a: PostData, b: PostData) => b.createdAt - a.createdAt);
    }));
    this.subscription.add(
      this.allPosts.subscribe((posts: PostData[]) => {
        console.log(posts);
        // Refresh datatable on data change
        if (this.dataTableElement.dtInstance) {
          this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dataTableTrigger.next();
          });
        } else {
          this.dataTableTrigger.next();
        }
      })
    );
  }

  ngOnDestroy() {
    this.dataTableTrigger.unsubscribe();
    this.subscription.unsubscribe();
  }

}
