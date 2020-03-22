import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';

@Injectable()
export class I18nService {

  private lang: string = 'en';
  private translations: object = {
    'en': en,
    'fr': fr
  };

  constructor(private settings: SettingsService) {
    // Set language
    if (this.settings.language) {
      this.setLanguage(this.settings.language);
    }
  }

  setLanguage(lang: string): void {
    this.lang = lang;
  }

  getCurrentLanguage(): string {
    return this.lang;
  }

  get(key: string, substitutions?: { [key: string]: string }): string {
    return this.translations[this.lang][key] ? this.replace(this.translations[this.lang][key], substitutions) : key;
  }

  private replace(translation: string, substitutions?: { [key: string]: string }): string {
    let result = translation;
    if (substitutions) {
      Object.keys(substitutions).forEach((key: string) => {
        result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'gi'), substitutions[key]);
      });
    }
    // console.log('translation:', result);
    return result;
  }

}
