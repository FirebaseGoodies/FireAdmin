import { NgModule } from '@angular/core';
import { FireAdminComponent } from './fire-admin.component';
import { FireAdminRoutingModule } from './fire-admin-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';



@NgModule({
  declarations: [FireAdminComponent, LoginComponent, DashboardComponent, SidebarComponent, NavbarComponent],
  imports: [
    FireAdminRoutingModule
  ],
  exports: [FireAdminComponent]
})
export class FireAdminModule { }
