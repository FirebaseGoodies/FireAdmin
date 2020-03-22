import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FireAdminComponent } from './fire-admin.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { LoginGuardService } from './services/guards/login-guard.service';
import { PostsListComponent } from './components/posts/list/posts-list.component';
import { PostsAddComponent } from './components/posts/add/posts-add.component';
import { PostsEditComponent } from './components/posts/edit/posts-edit.component';
import { PostsCategoriesComponent } from './components/posts/categories/posts-categories.component';
import { PagesListComponent } from './components/pages/list/pages-list.component';
import { PagesAddComponent } from './components/pages/add/pages-add.component';
import { PagesEditComponent } from './components/pages/edit/pages-edit.component';
import { PagesTranslateComponent } from './components/pages/translate/pages-translate.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PostsTranslateComponent } from './components/posts/translate/posts-translate.component';
import { UsersListComponent } from './components/users/list/users-list.component';
import { UsersAddComponent } from './components/users/add/users-add.component';
import { UsersProfileComponent } from './components/users/profile/users-profile.component';
import { UsersEditComponent } from './components/users/edit/users-edit.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { UserGuardService } from './services/guards/user-guard.service';
import { RegisterComponent } from './components/register/register.component';
import { RegisterGuardService } from './services/guards/register-guard.service';

const routes: Routes = [
  {
    path: '',
    component: FireAdminComponent,
    children: [
      // Login
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuardService]
      },
      // Register
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RegisterGuardService]
      },
      // Dashboard
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService]
      },
      // Settings
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuardService]
      },
      // Pages
      {
        path: 'pages',
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'list',
            component: PagesListComponent
          },
          {
            path: 'list/author/:authorId',
            component: PagesListComponent
          },
          {
            path: 'add',
            component: PagesAddComponent
          },
          {
            path: 'edit/:id',
            component: PagesEditComponent
          },
          {
            path: 'translate/:id',
            component: PagesTranslateComponent
          },
          {
            path: '**',
            redirectTo: 'list'
          }
        ]
      },
      // Posts
      {
        path: 'posts',
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'list',
            component: PostsListComponent
          },
          {
            path: 'list/status/:status',
            component: PostsListComponent
          },
          {
            path: 'list/category/:categoryId',
            component: PostsListComponent
          },
          {
            path: 'list/author/:authorId',
            component: PostsListComponent
          },
          {
            path: 'add',
            component: PostsAddComponent
          },
          {
            path: 'edit/:id',
            component: PostsEditComponent
          },
          {
            path: 'translate/:id',
            component: PostsTranslateComponent
          },
          {
            path: 'categories',
            component: PostsCategoriesComponent
          },
          {
            path: '**',
            redirectTo: 'list'
          }
        ]
      },
      // Users
      {
        path: 'users',
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'list',
            component: UsersListComponent,
            canActivate: [UserGuardService]
          },
          {
            path: 'list/role/:role',
            component: UsersListComponent,
            canActivate: [UserGuardService]
          },
          {
            path: 'add',
            component: UsersAddComponent,
            canActivate: [UserGuardService]
          },
          {
            path: 'edit/:id',
            component: UsersEditComponent,
            canActivate: [UserGuardService]
          },
          {
            path: 'profile/:id',
            component: UsersProfileComponent,
            canActivate: [UserGuardService]
          },
          {
            path: '**',
            redirectTo: 'list'
          }
        ]
      },
      // Translations
      {
        path: 'translations',
        component: TranslationsComponent,
        canActivate: [AuthGuardService]
      },
      // 404
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FireAdminRoutingModule { }
