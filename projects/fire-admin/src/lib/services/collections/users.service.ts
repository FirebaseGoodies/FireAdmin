import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { now, isFile, guid } from '../../helpers/functions.helper';
import { User, UserRole } from '../../models/collections/user.model';
import { StorageService } from '../storage.service';
import { FirebaseUserService } from '../firebase-user.service';

@Injectable()
export class UsersService {

  private allRoles: object = {};

  constructor(private db: DatabaseService, private storage: StorageService, private firebaseUser: FirebaseUserService) {
    Object.keys(UserRole).forEach((key: string) => {
      this.allRoles[UserRole[key]] = key;
    });
  }

  getAllRoles() {
    return this.allRoles;
  }

  add(data: User) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
      role: data.role,
      bio: data.bio,
      avatar: null,
      createdAt: now(), // timestamp
      updatedAt: null
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

  edit(id: string, data: User) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
      role: data.role,
      bio: data.bio,
      updatedAt: now()
    };
    if (/*data.avatar !== undefined && */data.avatar === null) {
      user.avatar = null;
    }
    return this.uploadImageAfter(this.db.setDocument('users', id, user), user, {...data, id: id});
  }

  delete(id: string) {
    return this.db.deleteDocument('users', id);
  }

}
