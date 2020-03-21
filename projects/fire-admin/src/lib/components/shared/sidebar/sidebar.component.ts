import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { initDropdown, toggleSidebar } from '../../../helpers/layout.helper';
import { getLogo } from '../../../helpers/assets.helper';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'fa-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @Input() style: string = 'expanded';
  logo: string = getLogo();

  constructor(public navigation: NavigationService, public currentUser: CurrentUserService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    initDropdown();
  }

  private isRouteActive(...path: string[]) {
    const link = this.navigation.getRouterLink(...path).join('/');
    //console.log(link);
    return this.navigation.router.isActive(link, false);
  }

  isActive(...routes: any[]) {
    let isActive = false;
    routes.forEach((path: string[]) => {
      if (this.isRouteActive(...path)) {
        isActive = true;
      }
    });
    return isActive;
  }

  toggle() {
    toggleSidebar();
  }

}
