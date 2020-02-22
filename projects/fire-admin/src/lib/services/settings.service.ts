import { Injectable } from "@angular/core";
import { StorageService } from './storage.service';

@Injectable()
export class SettingsService {

  language: string;
  sidebarStyle: string;

  constructor(private storage: StorageService) {
    const settings = this.storage.get('settings');
    this.language = settings && settings.language ? settings.language : 'en';
    this.sidebarStyle = settings && settings.sidebarStyle ? settings.sidebarStyle : 'expanded';
  }

  save() {
    this.storage.set('settings', {
      language: this.language,
      sidebarStyle: this.sidebarStyle
    });
  }

}
