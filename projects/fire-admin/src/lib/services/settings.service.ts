import { Injectable } from "@angular/core";
import { LocalStorageService } from './local-storage.service';
import { Settings, SidebarStyle } from '../models/settings.model';
import { Language } from '../models/language.model';

@Injectable()
export class SettingsService implements Settings {

  language: string;
  sidebarStyle: SidebarStyle;
  supportedLanguages: Language[];

  constructor(private localStorage: LocalStorageService) {
    const settings = this.localStorage.get('settings');
    const defaults = this.getDefaults();
    this.set({...defaults, ...settings}); // any existing settings value will override defaults
  }

  private getDefaults(): Settings {
    return {
      language: 'en',
      sidebarStyle: 'expanded',
      supportedLanguages: [
        {
          label: 'English',
          key: 'en',
          isActive: true,
          isRemovable: false
        },
        {
          label: 'French',
          key: 'fr',
          isActive: true,
          isRemovable: false
        },
        {
          label: 'Arabic',
          key: 'ar',
          isActive: true,
          isRemovable: false
        }
      ]
    };
  }

  private set(settings: Settings) {
    this.language = settings.language;
    this.sidebarStyle = settings.sidebarStyle;
    this.supportedLanguages = settings.supportedLanguages;
  }

  save() {
    this.localStorage.set('settings', {
      language: this.language,
      sidebarStyle: this.sidebarStyle,
      supportedLanguages: this.supportedLanguages
    });
  }

  reset() {
    const defaults = this.getDefaults();
    this.set(defaults);
  }

  supportedLanguageExists(label: string, key: string) {
    return this.supportedLanguages.find((lang: Language) => lang.label.toLocaleLowerCase() == label.toLocaleLowerCase()) || this.supportedLanguages.find((lang: Language) => lang.key.toLocaleLowerCase() == key.toLocaleLowerCase());
  }

  getActiveSupportedLanguages() {
    return this.supportedLanguages.filter((lang: Language) => lang.isActive);
  }

}
