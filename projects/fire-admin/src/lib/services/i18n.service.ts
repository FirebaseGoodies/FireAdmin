import { Injectable } from '@angular/core';
import { en } from '../i18n/en';
import { SettingsService } from './settings.service';

@Injectable()
export class I18nService {

  private lang: string = 'en';
  private translations: any = [];

  constructor(private settings: SettingsService) {
    // Register languages translations
    this.translations['en'] = en;
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

  get(key: string): string {
    return this.translations[this.lang][key] || key;
  }

}
