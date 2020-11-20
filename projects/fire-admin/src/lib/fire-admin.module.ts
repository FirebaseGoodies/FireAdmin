import { CommonModule } from '@angular/common';  
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FireAdminComponent } from './fire-admin.component';
import { FireAdminRoutingModule } from './fire-admin-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { I18nService } from './services/i18n.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { AngularFireModule, FirebaseOptions, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FireAdminService } from './fire-admin.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { NavigationService } from './services/navigation.service';
import { LoginGuard } from './guards/login.guard';
import { FooterComponent } from './components/shared/footer/footer.component';
import { PagesListComponent } from './components/pages/list/pages-list.component';
import { PagesAddComponent } from './components/pages/add/pages-add.component';
import { PostsListComponent } from './components/posts/list/posts-list.component';
import { PostsAddComponent } from './components/posts/add/posts-add.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { AlertService } from './services/alert.service';
import { LocalStorageService } from './services/local-storage.service';
import { SettingsService } from './services/settings.service';
import { AlertComponent } from './components/shared/alert/alert.component';
import { PostsCategoriesComponent } from './components/posts/categories/posts-categories.component';
import { PostsEditComponent } from './components/posts/edit/posts-edit.component';
import { PagesEditComponent } from './components/pages/edit/pages-edit.component';
import { ButtonGroupComponent } from './components/shared/button-group/button-group.component';
import { DatabaseService } from './services/database.service';
import { CategoriesService } from './services/collections/categories.service';
import { DataTablesModule } from 'angular-datatables';
import { PostsService } from './services/collections/posts.service';
import { EscapeUrlPipe } from './pipes/escape-url.pipe';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { StorageService } from './services/storage.service';
import { PostsTranslateComponent } from './components/posts/translate/posts-translate.component';
import { UsersListComponent } from './components/users/list/users-list.component';
import { UsersAddComponent } from './components/users/add/users-add.component';
import { UsersProfileComponent } from './components/users/profile/users-profile.component';
import { UsersService } from './services/collections/users.service';
import { FirebaseUserService } from './services/firebase-user.service';
import { UsersEditComponent } from './components/users/edit/users-edit.component';
import { LoadingIndicatorComponent } from './components/shared/loading-indicator/loading-indicator.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { TranslationsService } from './services/collections/translations.service';
import { PagesService } from './services/collections/pages.service';
import { PagesTranslateComponent } from './components/pages/translate/pages-translate.component';
import { UserGuard } from './guards/user.guard';
import { CurrentUserService } from './services/current-user.service';
import { RegisterComponent } from './components/register/register.component';
import { RegisterGuard } from './guards/register.guard';
import { ConfigService } from './services/collections/config.service';
import { LogoutComponent } from './components/logout/logout.component';
import { ShortDatePipe } from './pipes/shortdate.pipe';
import { DateTimePipe } from './pipes/datetime.pipe';
import { TimestampPipe } from './pipes/timestamp.pipe';

// Register locales for date pipe
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';
registerLocaleData(localeFr);
registerLocaleData(localeAr);

@NgModule({
  declarations: [
    FireAdminComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    TranslatePipe,
    FooterComponent,
    PagesListComponent,
    PagesAddComponent,
    PagesEditComponent,
    PostsListComponent,
    PostsAddComponent,
    PostsEditComponent,
    PostsCategoriesComponent,
    SettingsComponent,
    LayoutComponent,
    AlertComponent,
    ButtonGroupComponent,
    EscapeUrlPipe,
    PostsTranslateComponent,
    UsersListComponent,
    UsersAddComponent,
    UsersProfileComponent,
    UsersEditComponent,
    LoadingIndicatorComponent,
    TranslationsComponent,
    PagesTranslateComponent,
    RegisterComponent,
    LogoutComponent,
    ShortDatePipe,
    DateTimePipe,
    TimestampPipe
  ],
  imports: [
    CommonModule,
    FireAdminRoutingModule,
    FormsModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    DataTablesModule
  ],
  exports: [
    FireAdminComponent
  ],
  providers: [
    I18nService,
    TranslatePipe,
    AuthService,
    AuthGuard,
    LoginGuard,
    RegisterGuard,
    UserGuard,
    NavigationService,
    AlertService,
    LocalStorageService,
    SettingsService,
    DatabaseService,
    CategoriesService,
    PostsService,
    EscapeUrlPipe,
    StorageService,
    UsersService,
    FirebaseUserService,
    TranslationsService,
    PagesService,
    CurrentUserService,
    ConfigService,
    // Set database config (for AngularFireModule)
    {
      provide: FirebaseOptionsToken,
      useFactory: FireAdminService.getFirebaseConfig,
      deps: [FireAdminService]
    }
  ]
})
export class FireAdminModule {

  static initialize(firebaseConfig: FirebaseOptions): ModuleWithProviders {
    return {
      ngModule: FireAdminModule,
      providers: [
        FireAdminService,
        {
          provide: FirebaseOptionsToken,
          useValue: firebaseConfig
        }
      ]
    };
  }

}
