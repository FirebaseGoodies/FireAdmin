import { Component, OnInit, AfterViewInit } from '@angular/core';
import { initTextEditor } from '../../../helpers/posts.helper';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'fa-posts-add',
  templateUrl: './posts-add.component.html',
  styleUrls: ['./posts-add.component.css']
})
export class PostsAddComponent implements OnInit, AfterViewInit {

  constructor(private i18n: I18nService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    initTextEditor(this.i18n.get('PostContent'));
  }

  now() {
    return new Date().toISOString().slice(0, 10);
  }

}
