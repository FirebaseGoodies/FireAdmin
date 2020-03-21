import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AlertService } from './services/alert.service';
import { CurrentUserService } from './services/current-user.service';

@Component({
  selector: 'fa-root',
  template: `<router-outlet (deactivate)="clearAlert()"></router-outlet>`,
  styleUrls: ['./fire-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FireAdminComponent implements OnInit, OnDestroy {

  constructor(private alert: AlertService, private currentUser: CurrentUserService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.currentUser.unsubscribe();
  }

  clearAlert() {
    if (! this.alert.isPersistent) {
      this.alert.clear();
    }
  }

}
