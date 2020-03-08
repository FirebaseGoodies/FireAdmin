import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fa-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent implements OnInit {

  @Input() show: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
