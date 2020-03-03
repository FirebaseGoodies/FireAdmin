import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Post, PostData } from '../../models/collections/post.model';
import { now } from '../../helpers/functions.helper';

@Injectable()
export class PostsService {

  constructor(private db: DatabaseService) { }

  add(data: PostData, id?: string) {
    if (id) {
      return this.edit(id, data);
    } else {
      const post: Post = {};
      post[data.lang] = {
        title: data.title,
        slug: data.slug,
        date: data.date,
        image: data.image,
        content: data.content,
        status: data.status,
        categories: data.categories,
        createdAt: now(), // timestamp
        updatedAt: null
      };
      return this.db.addDocument('posts', post);
    }
  }

  get(id: string) {
    return this.db.getDocument('posts', id);
  }

  getAll() {
    return this.db.getCollection('posts');
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection('posts', ref => ref.where(field, operator, value));
  }

  edit(id: string, data: PostData) {
    const post: Post = {};
    post[data.lang] = {
      title: data.title,
      slug: data.slug,
      date: data.date,
      image: data.image,
      content: data.content,
      status: data.status,
      categories: data.categories,
      updatedAt: now()
    };
    return this.db.setDocument('posts', id, post);
  }

  delete(id: string) {
    return this.db.deleteDocument('posts', id);
  }

}
