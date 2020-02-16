import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

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

  isSignedIn(): boolean {
    return !!this.currentUser;
  }

  signIn(email: string, password: string): Promise<void> {
        // console.log('sign in', email, password);
    return new Promise((resolve, reject) => {
      if (this.isSignedIn()) {
        console.log('already signed in!');
        resolve();
      } else {
        // Sign in
        this.afa.auth.signInWithEmailAndPassword(email, password).then(() => {
          resolve();
        }).catch((error: firebase.FirebaseError) => {
          this.lastError = error;
          console.error(`[${error.code}] ${error.message}`);
          reject();
        });
      }
    });
  }

  signOut(force: boolean = false): void {
    // console.log('sign out', this.isSignedIn());
    if (force || this.isSignedIn()) {
      this.afa.auth.signOut().catch((error: firebase.FirebaseError) => {
        this.lastError = error;
        console.error(`[${error.code}] ${error.message}`);
      });
    }
  }

}
