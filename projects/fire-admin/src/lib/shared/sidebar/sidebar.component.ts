import { Component, OnInit, AfterViewInit } from '@angular/core';
import { initDropdown } from '../../helpers/sidebar.helper';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'fa-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  constructor(public navigation: NavigationService) { }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    initDropdown();
  }

  isActive(...path: string[]) {
    const link = this.navigation.getRouterLink(...path).join('/');
    //console.log(link);
    return this.navigation.router.isActive(link, true);
  }

}
