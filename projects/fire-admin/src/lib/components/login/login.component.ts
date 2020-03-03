import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { getLogo } from '../../helpers/assets.helper';

@Component({
  selector: 'fa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  logo: string = getLogo();
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  error: string = null;
  private routeSubscription: Subscription = null;

  constructor(private auth: AuthService, private route: ActivatedRoute, private navigation: NavigationService) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe((params: any) => {
      //console.log(params);
      if (params.email) {
        this.email = params.email;
      }
      if (params.password) {
        this.password = params.password;
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.auth.signIn(this.email, this.password, this.rememberMe).then(() => {
      this.navigation.redirectTo('dashboard');
    }).catch((error: Error) => {
      this.error = error.message;
    });
  }

  dismissError(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.error = null;
  }

}
