import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FireAdminComponent } from './fire-admin.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { LoginGuardService } from './services/guards/login-guard.service';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostsAddComponent } from './pages/posts-add/posts-add.component';
import { PagesListComponent } from './pages/pages-list/pages-list.component';
import { PagesAddComponent } from './pages/pages-add/pages-add.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { CategoriesAddComponent } from './pages/categories-add/categories-add.component';

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
            path: 'add',
            component: PagesAddComponent
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
            path: 'add',
            component: PostsAddComponent
          },
          {
            path: '**',
            redirectTo: 'list'
          }
        ]
      },
      // Categories
      {
        path: 'categories',
        canActivate: [AuthGuardService],
        children: [
          {
            path: 'list',
            component: CategoriesListComponent
          },
          {
            path: 'add',
            component: CategoriesAddComponent
          },
          {
            path: '**',
            redirectTo: 'list'
          }
        ]
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