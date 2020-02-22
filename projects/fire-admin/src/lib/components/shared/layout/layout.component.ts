import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @Input() alert: string = null;

  constructor() { }

  ngOnInit() {
  }

  dismissAlert(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.alert = null;
  }

}
