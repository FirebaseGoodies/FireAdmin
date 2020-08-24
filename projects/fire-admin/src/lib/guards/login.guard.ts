import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { ConfigService } from '../services/collections/config.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private auth: AuthService, private navigation: NavigationService, private config: ConfigService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const isSignedIn = await this.auth.isSignedIn();
      if (isSignedIn) {
        // const rootPath = state.url.slice(0, state.url.indexOf(route.url[route.url.length - 1].path));
        // this.navigation.setRootPath(rootPath);
        this.navigation.redirectTo('dashboard');
        resolve(false);
      } else {
        const registrationEnabled = await this.config.isRegistrationEnabled();
        //console.log(registrationEnabled);
        if (!registrationEnabled) {
          resolve(true);
        } else {
          this.navigation.redirectTo('register');
          resolve(false);
        }
      }
    });
  }

}
