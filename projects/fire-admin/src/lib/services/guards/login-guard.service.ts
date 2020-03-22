import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavigationService } from '../navigation.service';
import { UsersService } from '../collections/users.service';

@Injectable()
export class LoginGuardService implements CanActivate {

  constructor(private auth: AuthService, private navigation: NavigationService, private users: UsersService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const isSignedIn = await this.auth.isSignedIn();
      if (isSignedIn) {
        // const rootPath = state.url.slice(0, state.url.indexOf(route.url[route.url.length - 1].path));
        // this.navigation.setRootPath(rootPath);
        this.navigation.redirectTo('dashboard');
        resolve(false);
      } else {
        const usersCount = await this.users.countAll();
        if (usersCount > 0) {
          resolve(true);
        } else {
          this.navigation.redirectTo('register');
          resolve(false);
        }
      }
    });
  }

}
