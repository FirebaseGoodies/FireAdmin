import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthService {

  currentUser: firebase.User = null;
  lastError: firebase.FirebaseError = null;

  constructor(private afa: AngularFireAuth) {
    this.afa.auth.onAuthStateChanged((user) => {
      // console.log(user);
      this.currentUser = user;
    });
  }

  private _isSignedIn(): boolean {
    return !!this.currentUser;
  }

  isSignedIn(): Promise<firebase.User> {
    return this.afa.authState.pipe(first()).toPromise();
  }

  signIn(email: string, password: string): Promise<void> {
    // console.log('sign in', email, password);
    return new Promise((resolve, reject) => {
      if (this._isSignedIn()) {
        console.log('already signed in!');
        resolve();
      } else {
        // Sign in
        this.afa.auth.signInWithEmailAndPassword(email, password).then(() => {
          resolve();
        }).catch((error: firebase.FirebaseError) => {
          this.lastError = error;
          console.error(`[${error.code}] ${error.message}`);
          reject(this.lastError);
        });
      }
    });
  }

  signOut(force: boolean = false): Promise<void> {
    // console.log('sign out', this._isSignedIn());
    return new Promise((resolve, reject) => {
      if (force || this._isSignedIn()) {
        this.afa.auth.signOut().then(() => {
          resolve();
        }).catch((error: firebase.FirebaseError) => {
          this.lastError = error;
          console.error(`[${error.code}] ${error.message}`);
          reject(this.lastError);
        });
      } else {
        resolve();
      }
    });
  }

}
