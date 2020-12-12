import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { initDropdown, toggleSidebar } from '../../../helpers/layout.helper';
import { getLogo } from '../../../helpers/assets.helper';
import { CurrentUserService } from '../../../services/current-user.service';
import { SidebarItem } from '../../../models/sidebar-item.model';

@Component({
  selector: 'fa-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @Input() style: string = 'expanded';
  logo: string = getLogo();
  items: SidebarItem[] = [
    // Dashboard
    {
      label: 'Dashboard',
      icon: '&#xE917;',
      routerLink: this.navigation.getRouterLink('dashboard')
    },
    // Pages
    {
      label: 'Pages',
      icon: 'insert_drive_file',
      isActive: this.isActive(['pages', 'list'], ['pages', 'add'], ['pages', 'edit'], ['pages', 'translate']),
      childrens: [
        {
          label: 'List',
          routerLink: this.navigation.getRouterLink('pages', 'list')
        },
        {
          label: 'Add',
          routerLink: this.navigation.getRouterLink('pages', 'add')
        }
      ]
    },
    // Posts
    {
      label: 'Posts',
      icon: 'description',
      isActive: this.isActive(['posts', 'list'], ['posts', 'add'], ['posts', 'edit'], ['posts', 'translate'], ['posts', 'categories']),
      childrens: [
        {
          label: 'List',
          routerLink: this.navigation.getRouterLink('posts', 'list')
        },
        {
          label: 'Add',
          routerLink: this.navigation.getRouterLink('posts', 'add')
        },
        {
          label: 'Categories',
          routerLink: this.navigation.getRouterLink('posts', 'categories')
        }
      ]
    },
    // Users
    {
      label: 'Users',
      icon: 'person',
      isActive: this.isActive(['users', 'list'], ['users', 'add'], ['users', 'edit'], ['users', 'profile']),
      isHidden: () => !this.currentUser.isAdmin(),
      childrens: [
        {
          label: 'List',
          routerLink: this.navigation.getRouterLink('users', 'list')
        },
        {
          label: 'Add',
          routerLink: this.navigation.getRouterLink('users', 'add')
        }
      ]
    },
    // Translations
    {
      label: 'Translations',
      icon: 'language',
      routerLink: this.navigation.getRouterLink('translations')
    },
    // {
    //   label: 'Menus',
    //   icon: 'menu',
    //   routerLink: this.navigation.getRouterLink('menus')
    // },
    // {
    //   label: 'Comments',
    //   icon: 'comment',
    //   isActive: this.isActive(['comments', 'list'], ['comments', 'add'], ['comments', 'edit']),
    //   childrens: [
    //     {
    //       label: 'List',
    //       routerLink: this.navigation.getRouterLink('comments', 'list')
    //     },
    //     {
    //       label: 'Add',
    //       routerLink: this.navigation.getRouterLink('comments', 'add')
    //     }
    //   ]
    // },
    // {
    //   label: 'Media',
    //   icon: '&#xE251;',
    //   isActive: this.isActive(['media', 'list'], ['media', 'add'], ['media', 'edit']),
    //   childrens: [
    //     {
    //       label: 'List',
    //       routerLink: this.navigation.getRouterLink('media', 'list')
    //     },
    //     {
    //       label: 'Add',
    //       routerLink: this.navigation.getRouterLink('media', 'add')
    //     }
    //   ]
    // },
  ];

  constructor(public navigation: NavigationService, private currentUser: CurrentUserService) { }

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

  private isActive(...routes: any[]) {
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
