import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from 'src/modules/auth/components/login/login.component';
import { AdminDashbordComponent } from '../modules/admin/components/admin-dashbord/admin-dashbord.component';
import { EmployeeDashbordComponent } from '../modules/employee/components/employee-dashbord/employee-dashbord.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminDashbordComponent,
    EmployeeDashbordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
