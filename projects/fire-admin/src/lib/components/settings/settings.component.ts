import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'fa-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  alert: string = null;
  language: string;

  constructor(private i18n: I18nService) {
    this.language = this.i18n.getCurrentLanguage();
  }

  ngOnInit() {
  }

  saveChanges(event: Event) {
    event.preventDefault();
    //console.log(this.language);
    this.i18n.setLanguage(this.language);
    this.alert = this.i18n.get('ChangesSaved');
  }

  dismissAlert(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.alert = null;
  }

}
