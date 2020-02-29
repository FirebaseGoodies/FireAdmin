import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { initDropdown, toggleSidebar } from '../../../helpers/layout.helper';

@Component({
  selector: 'fa-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @Input() style: string = 'expanded';

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

  toggle() {
    toggleSidebar();
  }

}
