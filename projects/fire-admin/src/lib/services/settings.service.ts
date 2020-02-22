import { Injectable } from "@angular/core";
import { StorageService } from './storage.service';
import { I18nService } from './i18n.service';

@Injectable()
export class SettingsService {

  language: string;
  sidebarStyle: string;

  constructor(private storage: StorageService) {
    const settings = this.storage.get('settings');
    this.language = settings && settings.language ? settings.language : I18nService.defaultLanguage;
    this.sidebarStyle = settings && settings.sidebarStyle ? settings.sidebarStyle : 'expanded';
  }

  save() {
    this.storage.set('settings', {
      language: this.language,
      sidebarStyle: this.sidebarStyle
    });
  }

}
