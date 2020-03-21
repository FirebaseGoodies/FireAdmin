import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';
import { AlertService } from '../../../services/alert.service';
import { toggleSidebar } from '../../../helpers/layout.helper';
import { getLogo, getDefaultAvatar } from '../../../helpers/assets.helper';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'fa-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() isSticky: boolean = true;
  @Input() isCentered: boolean = false;
  @Input() showBrand: boolean = false;
  logo: string = getLogo();
  defaultAvatar = getDefaultAvatar();

  constructor(
    public currentUser: CurrentUserService,
    public navigation: NavigationService,
    private auth: AuthService,
    private alert: AlertService
  ) { }

  ngOnInit() {
  }

  getUserName(): string {
    return this.currentUser.data ? `${this.currentUser.data.firstName} ${this.currentUser.data.lastName}` : (
      this.auth.firebaseUser ? this.auth.firebaseUser.providerData[0].displayName || this.auth.firebaseUser.providerData[0].email : 'unknown'
    );
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
