import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { SupportComponent } from './components/support/support.component';
import { AdminGuard } from './admin/guards/admin.guard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  // ⬇️ Giriş ekranı izole çalışır (AdminComponent layout'una dahil değil)
  { path: 'login', component: LoginComponent },

  // ⬇️ Diğer tüm sayfalar AdminComponent layout'una dahil
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'support', component: SupportComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
