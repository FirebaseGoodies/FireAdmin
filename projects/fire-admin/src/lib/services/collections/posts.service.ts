import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Post, PostData, PostStatus } from '../../models/collections/post.model';
import { now, guid, isFile } from '../../helpers/functions.helper';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import { getEmptyImage, getLoadingImage } from '../../helpers/assets.helper';
import { SettingsService } from '../settings.service';
import { Language } from '../../models/language.model';

@Injectable()
export class PostsService {

  private allStatus: { [key: string]: string } = {};

  constructor(private db: DatabaseService, private storage: StorageService, private settings: SettingsService) {
    Object.keys(PostStatus).forEach((key: string) => {
      this.allStatus[PostStatus[key]] = key;
    });
  }

  getAllStatus() {
    return this.allStatus;
  }

  getStatus(statusKey: string) {
    return this.allStatus[statusKey];
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
    return new Promise((resolve, reject) => {
      promise.then((doc: any) => {
        if (data.image && isFile(data.image)) {
          const id = doc ? doc.id : data.id;
          const imageFile = (data.image as File);
          const imageName = guid() + '.' + imageFile.name.split('.').pop();
          const imagePath = `posts/${id}/${imageName}`;
          this.storage.upload(imagePath, imageFile).then(() => {
            post[data.lang].image = imagePath;
            const savePromise: Promise<any> = doc ? doc.set(post) : this.db.setDocument('posts', id, post);
            savePromise.finally(() => {
              resolve();
            });
          }).catch((error: Error) => {
            // console.error(error);
            reject(error);
          });
        } else {
          resolve();
        }
      });
    });
  }

  get(id: string) {
    return this.db.getDocument('posts', id);
  }

  getImageUrl(imagePath: string) {
    return this.storage.get(imagePath).getDownloadURL();
  }

  getAll() {
    return this.db.getCollection('posts').pipe(map((posts: Post[]) => {
      const allPostsData: PostData[] = [];
      const activeSupportedLanguages = this.settings.getActiveSupportedLanguages().map((lang: Language) => lang.key);
      posts.forEach((post: Post) => {
        // console.log(post);
        const languages = Object.keys(post).filter((key: string) => key !== 'id');
        languages.forEach((lang: string) => {
          const data = post[lang];
          data.id = post['id'] as string|any;
          data.lang = lang;
          data.image = data.image ? merge(of(getLoadingImage()), this.getImageUrl(data.image as string)) : of(getEmptyImage());
          data.isTranslatable = !activeSupportedLanguages.every((lang: string) => languages.includes(lang));
          allPostsData.push(data);
        });
      });
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
    if (/*data.image !== undefined && */data.image === null) {
      post[data.lang].image = null;
    }
    return this.uploadImageAfter(this.db.setDocument('posts', id, post), post, {...data, id: id});
  }

  delete(id: string) {
    return this.db.deleteDocument('posts', id);
  }

  setStatus(id: string, lang: string, status: PostStatus) {
    return this.db.setDocument('posts', id, { [lang]: { status: status } });
  }

}