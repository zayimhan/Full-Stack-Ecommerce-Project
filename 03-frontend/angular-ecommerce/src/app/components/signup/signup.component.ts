import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../common/user';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user: User = { email: '', password: '', roles: [] };
  selectedRole: string = 'ROLE_CUSTOMER';
  successMessage: string = '';
  errorMessage: string = ''; // 👈 hata mesajı için eklendi

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.user.roles = [{ name: this.selectedRole }];
  
    this.http.post('http://localhost:8080/api/users/register', this.user, { responseType: 'text' })
      .subscribe({
        next: () => {88
          this.successMessage = 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: err => {
          this.errorMessage = 'Kayıt başarısız: ' + (err.error || err.message);
          this.successMessage = '';
        }
      });
  }
}
