import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { ConfigService } from '../collections/config.service';

@Injectable()
export class RegisterGuardService implements CanActivate {

  constructor(private navigation: NavigationService, private config: ConfigService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const registrationEnabled = await this.config.isRegistrationEnabled();
      //console.log(registrationEnabled);
      if (registrationEnabled) {
        resolve(true);
      } else {
        this.navigation.redirectTo('login');
        resolve(false);
      }
    });
  }

}
