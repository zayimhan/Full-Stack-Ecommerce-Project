import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-status',
  standalone: false,
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated = false;
  userFullName = '';
  isSeller = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isAuthenticated = status;
      if (status) {
        const token = this.authService.getToken();
        if (token) {
          const decoded = this.decodeToken(token);
          this.userFullName = decoded?.sub || '';
          this.isSeller = decoded?.roles?.includes("ROLE_SELLER") ||
                          decoded?.roles?.some((r: any) => r.authority === "ROLE_SELLER");
        }
      } else {
        this.reset();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToSellerDashboard(): void {
    this.router.navigate(['/seller-dashboard']);
  }

  private reset(): void {
    this.userFullName = '';
    this.isSeller = false;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('JWT çözümleme hatası:', e);
      return null;
    }
  }
}
