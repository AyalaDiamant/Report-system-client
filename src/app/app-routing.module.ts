import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../modules/auth/components/login/login.component';
import { AdminDashbordComponent } from '../modules/admin/components/admin-dashbord/admin-dashbord.component';
import { EmployeeDashbordComponent } from '../modules/employee/components/employee-dashbord/employee-dashbord.component';
import { RegisterComponent } from 'src/modules/auth/components/register/register.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashbordComponent }, 
  { path: 'employee', component: EmployeeDashbordComponent }, 
  { path: 'register', component: RegisterComponent },
  // { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  // { path: 'employee', component: EmployeeDashboardComponent, canActivate: [AuthGuard], data: { role: 'employee' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
