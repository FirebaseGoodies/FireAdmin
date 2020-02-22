import { Injectable } from "@angular/core";
import { StorageService } from './storage.service';
import { Settings, SidebarStyle } from '../models/settings.model';

@Injectable()
export class SettingsService implements Settings {

  language: string;
  sidebarStyle: SidebarStyle;

  constructor(private storage: StorageService) {
    const settings = this.storage.get('settings');
    const defaults = this.getDefaults();
    this.set({...defaults, ...settings}); // any existing settings value will override defaults
  }

  private getDefaults(): Settings {
    return {
      language: 'en',
      sidebarStyle: 'expanded'
    };
  }

  private set(settings: Settings) {
    this.language = settings.language;
    this.sidebarStyle = settings.sidebarStyle;
  }

  save() {
    this.storage.set('settings', {
      language: this.language,
      sidebarStyle: this.sidebarStyle
    });
  }

  reset() {
    const defaults = this.getDefaults();
    this.set(defaults);
  }

}
