import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import { AlertService } from '../../../services/alert.service';
import { toggleSidebar } from '../../../helpers/layout.helper';

@Component({
  selector: 'fa-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() isSticky: boolean = true;
  @Input() isCentered: boolean = false;
  @Input() showBrand: boolean = false;

  constructor(private auth: AuthService, public navigation: NavigationService, private alert: AlertService) { }

  ngOnInit() {
  }

  getUserName(): string {
    return this.auth.currentUser ? this.auth.currentUser.providerData[0].displayName || this.auth.currentUser.providerData[0].email : 'unknown';
  }

  signOut(event: Event): void {
    event.preventDefault();
    this.auth.signOut().then(() => {
      this.navigation.redirectTo('login');
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

  toggleSidebar(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    toggleSidebar();
  }

}
