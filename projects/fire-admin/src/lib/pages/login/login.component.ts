import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  private routeSubscription: Subscription = null;

  constructor(private route: ActivatedRoute) { }

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

}
