import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {

  private rootPath: string = null;

  constructor(public router: Router) {
    //console.log(this.router.config[0].path);
    this.rootPath = this.router.config[0].path;
  }

  redirectTo(...path: string[]) {
    //console.log(path);
    this.router.navigate(this.getRouterLink(...path));
  }

  getRouterLink(...path: string[]) {
    const root = this.rootPath ? '/' + this.rootPath : [];
    return [root, ...path];
  }

  setRootPath(path: string) {
    this.rootPath = path;
  }

}
