import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Post, PostData } from '../../models/collections/post.model';
import { now, guid, isFile } from '../../helpers/functions.helper';
import { StorageService } from '../storage.service';
import { take, mergeMap } from 'rxjs/operators';
import { getEmptyImage } from '../../helpers/assets.helper';

@Injectable()
export class PostsService {

  constructor(private db: DatabaseService, private storage: StorageService) { }

  getAllStatus() {
    return {
      draft: 'Draft',
      published: 'Published',
      trash: 'Trash',
    };
  }

  add(data: PostData, id?: string) {
    if (id) {
      return this.edit(id, data);
    } else {
      const post: Post = {};
      post[data.lang] = {
        title: data.title,
        slug: data.slug,
        date: data.date,
        image: null,
        content: data.content,
        status: data.status,
        categories: data.categories,
        createdAt: now(), // timestamp
        updatedAt: null
      };
      return this.uploadImageAfter(this.db.addDocument('posts', post), post, data);
    }
  }

  private uploadImageAfter(promise: Promise<any>, post: Post, data: PostData) {
    return promise.then((doc: any) => {
      if (data.image && isFile(data.image)) {
        const imageFile = (data.image as File);
        const imageName = guid() + '.' + imageFile.name.split('.').pop();
        const imagePath = `posts/${doc.id}/${imageName}`;
        this.storage.upload(imagePath, imageFile).then(() => {
          post[data.lang].image = imagePath;
          doc.set(post);
        }).catch((error: Error) => {
          console.error(error);
        });
      }
    });
  }

  get(id: string) {
    return this.db.getDocument('posts', id);
  }

  getImageUrl(imagePath: string) {
    return this.storage.get(imagePath).getDownloadURL().pipe(take(1)).toPromise();
  }

  getAll() {
    return this.db.getCollection('posts').pipe(mergeMap(async (posts: Post[]) => {
      const allPostsData: PostData[] = [];
      for (let post of posts) { // don't use forEach() since it doesn't work well with async/await
        // console.log(post);
        for (let key of Object.keys(post)) {
          if (key !== 'id') {
            const data = post[key];
            data.id = post['id'] as string|any;
            data.lang = key;
            data.image = data.image ? await this.getImageUrl(data.image as string) : getEmptyImage();
            allPostsData.push(data);
          }
        }
      }
      return allPostsData;
    }));
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
      content: data.content,
      status: data.status,
      categories: data.categories,
      updatedAt: now()
    };
    if (! data.image) {
      post[data.lang].image = null;
    }
    return this.uploadImageAfter(this.db.setDocument('posts', id, post), post, data);
  }

  delete(id: string) {
    return this.db.deleteDocument('posts', id);
  }

}
