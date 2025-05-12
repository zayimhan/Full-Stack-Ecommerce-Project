import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        const token = response.token;
        const decoded: any = jwtDecode(token);

        const roles: string[] = decoded?.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          localStorage.setItem('admin_token', token);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'Admin yetkisine sahip değilsiniz.';
        }
      },
      error: () => {
        this.errorMessage = 'Giriş başarısız. E-posta veya şifre hatalı.';
      }
    });
  }
}
