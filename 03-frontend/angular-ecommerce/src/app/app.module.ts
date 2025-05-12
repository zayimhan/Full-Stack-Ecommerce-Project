import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { SignupComponent } from './components/signup/signup.component';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { SellerAddProductComponent } from './components/seller-add-product/seller-add-product.component';

import { ProductService } from './services/product.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { SellerLayoutComponent } from './components/seller-layout/seller-layout.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';

// 🌟 Admin modülünü lazy load etmek için buraya tanımlıyoruz
const routes: Routes = [
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'seller/add-product', component: SellerAddProductComponent },
  { path: 'seller/edit-product/:id', component: EditProductComponent },
  
  // ✅ Satıcı paneli özel layout ile
  {
    path: 'seller-dashboard',
    component: SellerLayoutComponent,
    children: [
      { path: '', component: SellerDashboardComponent }
    ]
  },

  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'members', component: MembersPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'seller/orders', component: SellerOrdersComponent },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },

  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    SignupComponent,
    SellerDashboardComponent,
    EditProductComponent,
    SellerAddProductComponent,
    SellerLayoutComponent,
    SellerOrdersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ProductService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
