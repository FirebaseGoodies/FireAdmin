import { Injectable } from '@angular/core';
import { en } from '../i18n/en';

@Injectable()
export class I18nService {

  private lang: string = 'en';
  private translations: any = [];

  constructor() {
    this.translations['en'] = en;
  }

  setLanguage(lang: string): void {
    this.lang = lang;
  }

  getLanguage(): string {
    return this.lang;
  }

  get(key: string): string {
    return this.translations[this.lang][key] || key;
  }

}
