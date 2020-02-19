import { Injectable } from '@angular/core';

@Injectable()
export class I18nService {

  private lang: string = 'en';
  private translations: any = [];

  constructor() {
    this.translations['en'] = {
      // Login page
      "SignInToYourAccount": "Sign In to Your Account",
      "EmailAddress": "Email address",
      "EnterEmail": "Enter email",
      "Password": "Password",
      "RememberMe": "Remember me",
      "SignIn": "Sign In",
      "ForgotYourPassword": "Forgot your password?",
      // Sidebar
      "Dashboard": "Dashboard",
      "Pages": "Pages",
      "List": "List",
      "Add": "Add",
      "Posts": "Posts",
      "Categories": "Categories",
      "Translations": "Translations",
      "Menus": "Menus",
      "Media": "Media",
    };
  }

  setLanguage(lang: string): void {
    this.lang = lang;
  }

  get(key: string): string {
    return this.translations[this.lang][key] || key;
  }

}
