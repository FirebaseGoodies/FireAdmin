import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'fa-root',
  template: `<router-outlet (deactivate)="clearAlert()"></router-outlet>`,
  styleUrls: ['./fire-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FireAdminComponent implements OnInit {

  constructor(private alert: AlertService) { }

  ngOnInit() {
  }

  clearAlert() {
    this.alert.clear();
  }

}
