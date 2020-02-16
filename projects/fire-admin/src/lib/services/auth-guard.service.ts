import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (! this.auth.isSignedIn()) {
      const parentUrl = state.url.slice(0, state.url.indexOf(route.url[route.url.length - 1].path));
      this.router.navigate([parentUrl, 'login']);
      return false;
    }
    return true;
  }

}
