import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private navigation: NavigationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const isSignedIn = await this.auth.isSignedIn();
      if (! isSignedIn) {
        // const rootPath = state.url.slice(0, state.url.indexOf(route.url[route.url.length - 1].path));
        // this.navigation.setRootPath(rootPath);
        this.navigation.redirectTo('login');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

}
