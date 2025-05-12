import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      this.router.navigate(['/admin/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const roles: string[] = decoded?.roles || [];

      if (roles.includes('ROLE_ADMIN')) {
        return true;
      } else {
        this.router.navigate(['/admin/login']);
        return false;
      }
    } catch {
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}
