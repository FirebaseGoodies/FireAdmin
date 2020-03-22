import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { AlertService } from '../../services/alert.service';
import { SettingsService } from '../../services/settings.service';
import { NavigationService } from '../../services/navigation.service';
import { Language } from '../../models/language.model';

@Component({
  selector: 'fa-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  i18nLanguage: string;
  i18nKey: string;

  constructor(
    public settings: SettingsService,
    public navigation: NavigationService,
    private i18n: I18nService,
    private alert: AlertService
  ) { }

  ngOnInit() {
  }

  saveChanges(event: Event) {
    event.preventDefault();
    this.settings.save();
    this.i18n.setLanguage(this.settings.language);
    this.alert.success(this.i18n.get('SettingsSaved'), true);
    window.location.reload();
  }

  onI18nLanguageInput() {
    if (!this.i18nKey || this.i18nKey.length < 2) {
      this.i18nKey = this.i18nLanguage.substr(0, 2).toLowerCase();
    }
  }

  addSupportedLanguage() {
    this.settings.supportedLanguages.push({
      label: this.i18nLanguage,
      key: this.i18nKey,
      isActive: true,
      isRemovable: true
    });
    this.i18nLanguage = this.i18nKey = '';
  }

  removeSupportedLanguage(lang: Language, index: number) {
    const activeSupportedLanguages = this.settings.getActiveSupportedLanguages();
    if ((activeSupportedLanguages && activeSupportedLanguages.length > 1) || !lang.isActive) {
      this.settings.supportedLanguages.splice(index, 1);
    }
  }

  onSupportedLanguageCheckboxClick(event: Event, lang: Language) {
    const activeSupportedLanguages = this.settings.getActiveSupportedLanguages();
    if (activeSupportedLanguages.length < 2 && lang.isActive) {
      event.preventDefault();
    }
  }

}
