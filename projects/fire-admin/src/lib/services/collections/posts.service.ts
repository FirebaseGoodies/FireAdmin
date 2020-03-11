import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Post, PostTranslation, PostStatus } from '../../models/collections/post.model';
import { now, guid, isFile } from '../../helpers/functions.helper';
import { StorageService } from '../storage.service';
import { map, take, mergeMap } from 'rxjs/operators';
import { of, merge, Observable } from 'rxjs';
import { getEmptyImage, getLoadingImage } from '../../helpers/assets.helper';
import { SettingsService } from '../settings.service';
import { Language } from '../../models/language.model';
import { AuthService } from '../auth.service';
import { UsersService } from './users.service';
import { User } from '../../models/collections/user.model';
import { QueryFn } from '@angular/fire/firestore';

@Injectable()
export class PostsService {

  private allStatus: object = {};
  private statusColors: object = {
    draft: 'warning',
    published: 'success',
    trash: 'danger'
  };
  private imagesCache: object = {};

  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private settings: SettingsService,
    private users: UsersService,
    private auth: AuthService
  ) {
    Object.keys(PostStatus).forEach((key: string) => {
      this.allStatus[PostStatus[key]] = key;
    });
  }

  getAllStatus() {
    return this.allStatus;
  }

  getAllStatusWithColors() {
    return { labels: this.allStatus, colors: this.statusColors };
  }

  getStatus(statusKey: string) {
    return this.allStatus[statusKey];
  }

  add(data: Post, translationId?: string) {
    const post: Post = {
      title: data.title,
      lang: data.lang,
      slug: data.slug,
      date: data.date,
      image: null,
      content: data.content,
      status: data.status,
      categories: data.categories,
      createdAt: now(), // timestamp
      updatedAt: null,
      createdBy: this.auth.currentUser.id,
      updatedBy: null
    };
    if (translationId && data.image && !isFile(data.image)) {
      post.image = data.image;
    }
    return new Promise((resolve, reject) => {
      this.db.addDocument('posts', post).then((doc: any) => {
        this.uploadImage(doc.id, data.image as File).then(() => {
          this.addTranslation(data.lang, doc.id, translationId).then((translation: any) => {
            doc.set({ translationId: translationId || translation.id}, { merge: true }).then(() => {
              resolve();
            }).catch((error: Error) => {
              reject(error);
            });
          }).catch((error: Error) => {
            reject(error);
          });
        }).catch((error: Error) => {
          reject(error);
        });
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  translate(data: Post) {
    return this.add(data, data.translationId);
  }

  private uploadImage(id: string, imageFile: File) {
    return new Promise((resolve, reject) => {
      if (imageFile && isFile(imageFile)) {
        const imageName = guid() + '.' + imageFile.name.split('.').pop();
        const imagePath = `posts/${id}/${imageName}`;
        this.storage.upload(imagePath, imageFile).then(() => {
          this.db.setDocument('posts', id, { image: imagePath }).then(() => {
            resolve();
          }).catch((error: Error) => {
            reject(error);
          });
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  get(id: string) {
    return this.db.getDocument('posts', id).pipe(mergeMap(async (post: Post) => {
      const translations = await this.getTranslations(post.translationId).pipe(take(1)).toPromise();
      post.id = id;
      post.translations = translations;
      return post;
    }));
  }

  getTranslationLanguages(post: Post) {
    const postLanguages = Object.keys(post.translations);
    return this.settings.getActiveSupportedLanguages().filter((lang: Language) => postLanguages.indexOf(lang.key) === -1);
  }

  getImageUrl(imagePath: string) {
    if (this.imagesCache[imagePath]) {
      return of(this.imagesCache[imagePath]);
    } else {
      return this.storage.get(imagePath).getDownloadURL().pipe(map((imageUrl: string) => {
        this.imagesCache[imagePath] = imageUrl;
        return imageUrl;
      }));
    }
  }

  private pipePosts(postsObservable: Observable<Post[]>) {
    return postsObservable.pipe(mergeMap(async (posts: Post[]) => {
      const activeSupportedLanguages = this.settings.getActiveSupportedLanguages().map((lang: Language) => lang.key);
      //posts.forEach((post: Post) => { // forEach loop doesn't seems to work well with async/await
      for (let post of posts) {
        // console.log(post);
        post.translations = await this.getTranslations(post.translationId).pipe(take(1)).toPromise();
        // console.log(post.translations);
        const postLanguages = Object.keys(post.translations);
        post.image = {
          path: post.image,
          url: post.image ? merge(of(getLoadingImage()), this.getImageUrl(post.image as string)) : of(getEmptyImage())
        };
        post.author = post.createdBy ? this.users.get(post.createdBy).pipe(map((user: User) => `${user.firstName} ${user.lastName}`)) : of(null);
        post.isTranslatable = !activeSupportedLanguages.every((lang: string) => postLanguages.includes(lang));
      }
      //});
      return posts;
    }));
  }

  getAll() {
    return this.pipePosts(this.db.getCollection('posts'));
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string, applyPipe: boolean = false) {
    const postsObservable = this.db.getCollection('posts', ref => ref.where(field, operator, value));
    return applyPipe ? this.pipePosts(postsObservable) : postsObservable;
  }

  getWhereFn(queryFn: QueryFn, applyPipe: boolean = false) {
    const postsObservable = this.db.getCollection('posts', queryFn);
    return applyPipe ? this.pipePosts(postsObservable) : postsObservable;
  }

  edit(id: string, data: Post) {
    const post: Post = {
      title: data.title,
      lang: data.lang,
      slug: data.slug,
      date: data.date,
      content: data.content,
      status: data.status,
      categories: data.categories,
      updatedAt: now(),
      updatedBy: this.auth.currentUser.id
    };
    if (/*data.image !== undefined && */data.image === null) {
      post.image = null;
    }
    return new Promise((resolve, reject) => {
      this.db.setDocument('posts', id, post).then(() => {
        this.uploadImage(id, data.image as File).then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  private deleteImage(imagePath: string) {
    return new Promise((resolve, reject) => {
      // console.log(imagePath);
      if (imagePath) {
        this.storage.delete(imagePath).toPromise().then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  async delete(id: string, data: { imagePath: string, lang: string, translationId: string, translations: PostTranslation }) {
    if (data.imagePath) {
      const posts: Post[] = await this.getWhere('image', '==', data.imagePath).pipe(take(1)).toPromise();
      if (posts.length > 1) {
        data.imagePath = null; // do not delete image if used by more than 1 post
      }
    }
    return new Promise((resolve, reject) => {
      this.deleteTranslation(data.translationId, data.lang, data.translations).then(() => { // should be done before deleting document (posts observable will be synced before if not)
        this.db.deleteDocument('posts', id).then(() => {
          this.deleteImage(data.imagePath).then(() => {
            resolve();
          }).catch((error: Error) => {
            reject(error);
          });
        }).catch((error: Error) => {
          reject(error);
        });
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  setStatus(id: string, status: PostStatus) {
    return this.db.setDocument('posts', id, { status: status });
  }

  //----------------------------------------------------
  // Translations
  //----------------------------------------------------

  private addTranslation(lang: string, id: string, parentId?: string) {
    const translation = { [lang]: id };
    return parentId ? this.db.setDocument('postTranslations', parentId, translation) : this.db.addDocument('postTranslations', translation);
  }

  private getTranslations(id: string) {
    return this.db.getDocument('postTranslations', id);
  }

  private getTranslationsWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection('postTranslations', ref => ref.where(field, operator, value));
  }

  private deleteTranslation(id: string, lang?: string, translations?: PostTranslation) {
    const newTranslations = lang && translations ? Object.keys(translations).reduce((object, key) => {
      if (key !== lang) {
        object[key] = translations[key];
      }
      return object;
    }, {}) : {};
    return Object.keys(newTranslations).length > 0 ? this.db.setDocument('postTranslations', id, newTranslations, false) : this.db.deleteDocument('postTranslations', id);
  }

}
