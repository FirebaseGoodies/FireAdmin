import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FireAdminComponent } from './fire-admin.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { LoginGuardService } from './services/guards/login-guard.service';

const routes: Routes = [
  {
    path: '',
    component: FireAdminComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuardService]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService]
      },
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