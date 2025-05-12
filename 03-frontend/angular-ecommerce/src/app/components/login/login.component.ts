import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('jwtToken', token);

        try {
          const decodedToken: any = jwtDecode(token);
          const roles: string[] = decodedToken.roles || [];
          console.log('Kullanıcı rolleri:', roles);

          this.router.navigate(['/products']);

        } catch (error) {
          console.error('JWT çözümleme hatası:', error);
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        console.error('Login hatası:', err);

        let raw = err?.error;
        if (typeof raw === 'string') {
          try {
            raw = JSON.parse(raw);  // bazen backend 'text' responseType ile döner
          } catch (_) { }
        }

        const errorMessage = raw?.message || err.message || 'Sunucu hatası';

        if (errorMessage.toLowerCase().includes('devre dışı') || errorMessage.toLowerCase().includes('disabled')) {
          this.errorMessage = 'Hesabınız devre dışı bırakılmış. Lütfen destek ile iletişime geçin.';
        } else {
          this.errorMessage = 'Giriş başarısız: ' + errorMessage;
        }
      }
    });
  }

}
