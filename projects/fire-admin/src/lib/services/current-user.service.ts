import { Injectable } from '@angular/core';
import { map, takeUntil, take } from 'rxjs/operators';
import { User, UserRole } from '../models/collections/user.model';
import { UsersService } from './collections/users.service';
import { Subject, Subscription } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable()
export class CurrentUserService {

  data: User = null;
  private dataChange: Subject<User> = new Subject<User>(); // emit User object on each user change
  private userChange: Subject<void> = new Subject<void>(); // used to stop users service subscription on each new subscription
  private subscription: Subscription = new Subscription();

  constructor(private users: UsersService, private db: DatabaseService) { }

  get() {
    return this.data ? this.data : this.dataChange.pipe(take(1)).toPromise();
  }

  set(user: firebase.User) {
    this.userChange.next();
    this.subscription.add(
      this.users.getWhere('uid', '==', user.uid).pipe(
        map((users: User[]) => users[0] || null),
        takeUntil(this.userChange)
      ).subscribe((user: User) => {
        if (user) {
          user.avatar = this.users.getAvatarUrl(user.avatar as string);
        }
        this.data = user;
        this.dataChange.next(this.data);
        this.db.setCurrentUser(user); // used to avoid circular dependency issue (when injecting currentUser service into database service)
      })
    );
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  isAdmin() {
    return this.data && this.data.role === UserRole.Administrator;
  }

}
