import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { now, isFile, guid } from '../../helpers/functions.helper';
import { User, UserRole } from '../../models/collections/user.model';
import { StorageService } from '../storage.service';
import { FirebaseUserService } from '../firebase-user.service';
import { getDefaultAvatar, getLoadingImage } from '../../helpers/assets.helper';
import { of, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService {

  private allRoles: object = {};
  private imagesCache: object = {};
  private currentUser: User = null;

  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private firebaseUser: FirebaseUserService
  ) {
    Object.keys(UserRole).forEach((key: string) => {
      this.allRoles[UserRole[key]] = key;
    });
  }

  getAllRoles() {
    return this.allRoles;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  add(data: User) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password, // ToDo: add encryption for password (do not use hashing, since we need plain password on update/delete @see FirebaseUserService)
      birthDate: data.birthDate,
      role: data.role,
      bio: data.bio,
      avatar: null,
      createdAt: now(), // timestamp
      updatedAt: null,
      createdBy: this.currentUser.id,
      updatedBy: null
    };
    return new Promise((resolve, reject) => {
      this.firebaseUser.create(data.email, data.password).then((uid: string) => {
        user.uid = uid;
        this.uploadImageAfter(this.db.addDocument('users', user), user, data).then(() => {
          resolve();
        }).catch((error: Error) => {
          // console.error(error);
          reject(error);
        });
      }).catch((error: Error) => {
        // console.error(error);
        reject(error);
      });
    });
  }

  private uploadImageAfter(promise: Promise<any>, user: User, data: User) {
    return new Promise((resolve, reject) => {
      promise.then((doc: any) => {
        if (data.avatar && isFile(data.avatar)) {
          const id = doc ? doc.id : data.id;
          const imageFile = (data.avatar as File);
          const imageName = guid() + '.' + imageFile.name.split('.').pop();
          const imagePath = `users/${id}/${imageName}`;
          this.storage.upload(imagePath, imageFile).then(() => {
            user.avatar = imagePath;
            const savePromise: Promise<any> = doc ? doc.set(user) : this.db.setDocument('users', id, user);
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
    return this.db.getDocument('users', id);
  }

  getAll() {
    return this.db.getCollection('users');
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection('users', ref => ref.where(field, operator, value));
  }

  getAvatarUrl(imagePath: string) {
    if (imagePath) {
      if (this.imagesCache[imagePath]) {
        return of(this.imagesCache[imagePath]);
      } else {
        return merge(of(getLoadingImage()), this.storage.get(imagePath).getDownloadURL().pipe(map((imageUrl: string) => {
          this.imagesCache[imagePath] = imageUrl;
          return imageUrl;
        })));
      }
    } else {
      return of(getDefaultAvatar());
    }
  }

  private updateEmail(email: string, password: string, newEmail: string) {
    return new Promise((resolve, reject) => {
      if (newEmail !== email) {
        this.firebaseUser.updateEmail(email, password, newEmail).then(() => {
          resolve();
        }).catch((error: Error) => {
          // console.error(error);
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  private updatePassword(email: string, password: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      if (newPassword !== password) {
        this.firebaseUser.updatePassword(email, password, newPassword).then(() => {
          resolve();
        }).catch((error: Error) => {
          // console.error(error);
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  edit(id: string, data: User, oldData: { email: string, password: string }) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      role: data.role,
      bio: data.bio,
      updatedAt: now(),
      updatedBy: this.currentUser.id
    };
    if (/*data.avatar !== undefined && */data.avatar === null) {
      user.avatar = null;
    }
    return new Promise((resolve, reject) => {
      this.updateEmail(oldData.email, oldData.password, data.email).then(() => {
        this.updatePassword(data.email, oldData.password, data.password).then(() => {
          this.uploadImageAfter(this.db.setDocument('users', id, user), user, {...data, id: id}).then(() => {
            resolve();
          }).catch((error: Error) => {
            // console.error(error);
            reject(error);
          });
        }).catch((error: Error) => {
          // console.error(error);
          reject(error);
        });
      }).catch((error: Error) => {
        // console.error(error);
        reject(error);
      });
    });
  }

  delete(id: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseUser.delete(email, password).then(() => {
        this.db.deleteDocument('users', id).then(() => {
          resolve();
        }).catch((error: Error) => {
          // console.error(error);
          reject(error);
        });
      }).catch((error: Error) => {
        // console.error(error);
        reject(error);
      });
    });
  }

}
