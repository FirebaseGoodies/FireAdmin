import { Injectable } from '@angular/core';
import { auth, initializeApp } from 'firebase/app';
import { FireAdminService } from '../fire-admin.service';
import { User } from '../models/collections/user.model';

/**
 * This service is used to create/update users without signing out the current user
 * (otherwise, we'll need to use firebase functions or firebase-admin sdk)
 * 
 * source idea: https://stackoverflow.com/a/38013551
 */

@Injectable()
export class FirebaseUserService {

  private app: firebase.app.App;

  constructor(private fas: FireAdminService) {
    const config = FireAdminService.getFirebaseConfig(this.fas);
    // console.log(config);
    this.app = initializeApp(config, 'FirebaseUserApp');
  }

  create(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.app.auth().createUserWithEmailAndPassword(email, password).then((userCredential: auth.UserCredential) => {
        // console.log('User ' + userCredential.user.uid + ' created successfully!');
        this.app.auth().signOut();
        resolve(userCredential.user.uid);
      }).catch((error: firebase.FirebaseError) => {
        reject(error);
      });
    });
  }

  register(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      this.app.auth().createUserWithEmailAndPassword(user.email, user.password).then((userCredential: auth.UserCredential) => {
        // console.log('User ' + userCredential.user.uid + ' created successfully!');
        this.app.firestore().collection('users').doc(userCredential.user.uid).set(user).then(() => {
          this.app.firestore().collection('config').doc('registration').set({ enabled: false }, { merge: true }).then(() => {
            this.app.auth().signOut();
            resolve(userCredential.user.uid);
          }).catch((error: firebase.FirebaseError) => {
            this.app.auth().signOut();
            reject(error);
          });
        }).catch((error: firebase.FirebaseError) => {
          this.app.auth().signOut();
          reject(error);
        });
      }).catch((error: firebase.FirebaseError) => {
        reject(error);
      });
    });
  }

  updateEmail(email: string, password: string, newEmail: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.app.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.app.auth().currentUser.updateEmail(newEmail).then(() => {
          resolve();
        }).catch((error: firebase.FirebaseError) => {
          reject(error);
        }).finally(() => {
          this.app.auth().signOut();
        });
      }).catch((error: firebase.FirebaseError) => {
        reject(error);
      });
    });
  }

  updatePassword(email: string, password: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.app.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.app.auth().currentUser.updatePassword(newPassword).then(() => {
          resolve();
        }).catch((error: firebase.FirebaseError) => {
          reject(error);
        }).finally(() => {
          this.app.auth().signOut();
        });
      }).catch((error: firebase.FirebaseError) => {
        reject(error);
      });
    });
  }

  delete(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.app.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.app.auth().currentUser.delete().then(() => {
          resolve();
        }).catch((error: firebase.FirebaseError) => {
          reject(error);
        }).finally(() => {
          this.app.auth().signOut();
        });
      }).catch((error: firebase.FirebaseError) => {
        reject(error);
      });
    });
  }

}
