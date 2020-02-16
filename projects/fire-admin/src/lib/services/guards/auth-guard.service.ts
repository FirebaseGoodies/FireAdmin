import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const isSignedIn = await this.auth.isSignedIn();
      if (! isSignedIn) {
        const parentUrl = state.url.slice(0, state.url.indexOf(route.url[route.url.length - 1].path));
        this.router.navigate([parentUrl, 'login']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

}
