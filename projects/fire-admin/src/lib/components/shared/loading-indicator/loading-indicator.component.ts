import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fa-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent implements OnInit {

  @Input() show: boolean = true;
  @Input() icon: string = 'fas fa-circle-notch';
  @Input() size: string = '2x';
  @Input() animation: string = 'spin';
  @Input() center: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
