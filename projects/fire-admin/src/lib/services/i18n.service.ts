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
      "Comments": "Comments",
      "Menus": "Menus",
      "Media": "Media",
      // Navbar
      "AddPost": "Add post",
      "Logout": "Logout",
      // Posts: Add
      "AddNewPost": "Add New Post",
      "PostTitle": "Post Title",
      "PostContent": "Post Content",
      "Actions": "Actions",
      "PostStatus": "Status",
      "PostDate": "Date",
      "PostSlug": "Slug",
      "Draft": "Draft",
      "Published": "Published",
      "SaveDraft": "Save Draft",
      "Publish": "Publish",
      "NewCategory": "New category",
    };
  }

  setLanguage(lang: string): void {
    this.lang = lang;
  }

  get(key: string): string {
    return this.translations[this.lang][key] || key;
  }

}
