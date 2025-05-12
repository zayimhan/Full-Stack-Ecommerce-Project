import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-ecommerce';
  isLoginPage = false;

  constructor(private router: Router, public authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginPage = event.url.includes('/login');
      });
  }

  ngOnInit(): void {
    this.authService.initializeUserFromToken(); // 👈 T
  }

  isSellerDashboardPage(): boolean {
    return this.router.url.startsWith('/seller-dashboard');
  }
  isSellerDashboardRoute(): boolean {
    return this.router.url.startsWith('/seller-dashboard');
  }

  isSellerOrderRoute(): boolean {
  return this.router.url.startsWith('/seller/orders');
}

  isSellerAddProductRoute(): boolean {
  return this.router.url === '/seller/add-product';
}


  isSeller(): boolean {
    return this.authService.isSeller();
  }

  isAdminLoginRoute(): boolean {
    return this.router.url === '/admin/login';
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

}
