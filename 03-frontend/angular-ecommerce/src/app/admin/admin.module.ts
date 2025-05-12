import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

// Admin bileşenleri (components klasörü içinden)
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { SupportComponent } from './components/support/support.component';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    OrdersComponent,
    ProductsComponent,
    SupportComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    RouterModule
  ]
})
export class AdminModule { }
