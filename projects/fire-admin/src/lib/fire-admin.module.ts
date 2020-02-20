import { CommonModule } from '@angular/common';  
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FireAdminComponent } from './fire-admin.component';
import { FireAdminRoutingModule } from './fire-admin-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { I18nService } from './services/i18n.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { AngularFireModule, FirebaseOptions, FirebaseOptionsToken } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FireAdminService } from './fire-admin.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { NavigationService } from './services/navigation.service';
import { LoginGuardService } from './services/guards/login-guard.service';
import { FooterComponent } from './shared/footer/footer.component';
import { PagesListComponent } from './pages/pages-list/pages-list.component';
import { PagesAddComponent } from './pages/pages-add/pages-add.component';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostsAddComponent } from './pages/posts-add/posts-add.component';

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
    PostsListComponent,
    PostsAddComponent
  ],
  imports: [
    CommonModule,
    FireAdminRoutingModule,
    FormsModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  exports: [
    FireAdminComponent
  ],
  providers: [
    I18nService,
    TranslatePipe,
    AuthService,
    AuthGuardService,
    NavigationService,
    LoginGuardService,
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
