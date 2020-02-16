import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {

  constructor(private router: Router) { }

  redirectTo(path: string) {
    //console.log(path);
    this.router.navigate([[], path]);
  }

}
