import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'fa-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService, private alert: AlertService, private navigation: NavigationService) { }

  ngOnInit() {
    this.auth.signOut().then(() => {
      this.navigation.redirectTo('login');
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

}
