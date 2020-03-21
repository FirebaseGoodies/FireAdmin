import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavigationService } from '../navigation.service';
import { take } from 'rxjs/operators';
import { User, UserRole } from '../../models/collections/user.model';

@Injectable()
export class UserGuardService implements CanActivate {

  constructor(private auth: AuthService, private navigation: NavigationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const user: User = this.auth.currentUser ? this.auth.currentUser : await this.auth.currentUserChange.pipe(take(1)).toPromise();
      //console.log(user);
      if (user.role === UserRole.Administrator) {
        resolve(true);
      } else {
        //console.log(route);
        // A non admin user can only consult its own profile
        if (route.url[0].path === 'profile' && route.params['id'] === user.id) {
          resolve(true);
        }
        // After admin, only editors are allowed to modify their own informations
        else if (user.role === UserRole.Editor && route.url[0].path === 'edit' && route.params['id'] === user.id) {
          resolve(true);
        }
        // Redirect to dashboard on any other attempts
        else {
          this.navigation.redirectTo('dashboard');
          resolve(false);
        }
      }
    });
  }

}
