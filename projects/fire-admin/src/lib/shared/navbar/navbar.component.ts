import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'fa-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, private navigation: NavigationService) { }

  ngOnInit() {
  }

  signOut(event: Event) {
    event.preventDefault();
    this.auth.signOut().then(() => {
      this.navigation.redirectTo('login');
    });
  }

}
