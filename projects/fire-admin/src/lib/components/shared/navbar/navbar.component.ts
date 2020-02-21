import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'fa-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, public navigation: NavigationService) { }

  ngOnInit() {
  }

  getUserName(): string {
    return this.auth.currentUser ? this.auth.currentUser.providerData[0].displayName || this.auth.currentUser.providerData[0].email : 'unknown';
  }

  signOut(event: Event): void {
    event.preventDefault();
    this.auth.signOut().then(() => {
      this.navigation.redirectTo('login');
    });
  }

}
