import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {

  private rootPath: string = null;

  constructor(public router: Router) {
    //console.log(this.router.config[0].path);
    this.rootPath = this.router.config[0].path;
  }

  private getQueryParams(path: string) {
    const queryParams = path.split('?')[1] || '';
    const params = queryParams.length ? queryParams.split('&') : [];
    let pair = null;
    let data = {};
    params.forEach((d) => {
      pair = d.split('=');
      data[`${pair[0]}`] = pair[1];
    });
    return data;
  }

  redirectTo(...path: string[]) {
    //console.log(path, this.getQueryParams(path[0]));
    this.router.navigate(this.getRouterLink(...path), { queryParams: this.getQueryParams(path[0]) });
  }

  getRouterLink(...path: string[]) {
    const root = this.rootPath ? '/' + this.rootPath : [];
    path = path.map((segment: string) => segment.split('?')[0]); // clean up / remove query params
    return [root, ...path];
  }

  setRootPath(path: string) {
    this.rootPath = path;
  }

}
