import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { User, UserRole } from '../models/collections/user.model';
import { CurrentUserService } from '../services/current-user.service';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private currentUser: CurrentUserService, private navigation: NavigationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const user: User = await this.currentUser.get();
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
