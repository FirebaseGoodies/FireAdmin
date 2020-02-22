import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { AlertService } from '../../services/alert.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'fa-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public settings: SettingsService, private i18n: I18nService, private alert: AlertService) { }

  ngOnInit() {
  }

  saveChanges(event: Event) {
    event.preventDefault();
    this.settings.save();
    this.alert.success(this.i18n.get('SettingsSaved'), true);
    window.location.reload();
  }

}
