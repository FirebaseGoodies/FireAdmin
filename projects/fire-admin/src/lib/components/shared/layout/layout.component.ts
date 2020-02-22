import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'fa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(public alert: AlertService, public settings: SettingsService) { }

  ngOnInit() {
  }

  dismissAlert(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.alert.clear();
  }

}
