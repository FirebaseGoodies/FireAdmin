import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../collections/users.service';
import { NavigationService } from '../navigation.service';

@Injectable()
export class RegisterGuardService implements CanActivate {

  constructor(private users: UsersService, private navigation: NavigationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const usersCount = await this.users.countAll();
      if (usersCount > 0) {
        this.navigation.redirectTo('login');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

}
