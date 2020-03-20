import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map, takeUntil } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { User } from '../models/collections/user.model';
import { UsersService } from './collections/users.service';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class AuthService {

  currentUser: User = null;
  firebaseUser: firebase.User = null;
  lastError: firebase.FirebaseError = null;
  private userChange: Subject<void> = new Subject<void>(); // used to stop users service subscription on auth state change
  private subscription: Subscription = new Subscription();

  constructor(private afa: AngularFireAuth, private users: UsersService) {
    this.afa.auth.onAuthStateChanged((user: firebase.User) => {
      // console.log(user);
      this.firebaseUser = user;
      if (user) {
        this.userChange.next();
        this.subscription.add(
          this.users.getWhere('uid', '==', user.uid).pipe(
            map((users: User[]) => users[0] || null),
            takeUntil(this.userChange)
          ).subscribe((user: User) => {
            if (user) {
              user.avatar = this.users.getAvatarUrl(user.avatar as string);
            }
            this.currentUser = user;
            this.users.setCurrentUser(user); // used to avoid circular dependency issue (when injecting auth service into users service)
          })
        );
      }
    });
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  private _isSignedIn(): boolean {
    return !!this.firebaseUser;
  }

  private setLastError(error: firebase.FirebaseError): void {
    this.lastError = error;
    console.error(`[${error.code}] ${error.message}`);
  }

  isSignedIn(): Promise<firebase.User> {
    return this.afa.authState.pipe(first()).toPromise();
  }

  signIn(email: string, password: string, isPersistent: boolean = false): Promise<void> {
    // console.log('sign in', email, password);
    return new Promise((resolve, reject) => {
      if (this._isSignedIn()) {
        console.log('already signed in!');
        resolve();
      } else {
        // Sign in
        const persistence = isPersistent ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION;
        this.afa.auth.setPersistence(persistence).then(() => {
          this.afa.auth.signInWithEmailAndPassword(email, password).then(() => {
            resolve();
          }).catch((error: firebase.FirebaseError) => {
            this.setLastError(error);
            reject(this.lastError);
          });
        }).catch((error: firebase.FirebaseError) => {
          this.setLastError(error);
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
          this.setLastError(error);
          reject(this.lastError);
        });
      } else {
        resolve();
      }
    });
  }

}
