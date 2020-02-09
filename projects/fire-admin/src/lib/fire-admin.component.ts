import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'fa-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./fire-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FireAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
