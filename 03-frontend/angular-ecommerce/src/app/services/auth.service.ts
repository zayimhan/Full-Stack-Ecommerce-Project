import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private roles: string[] = [];

  constructor(private http: HttpClient) {
    this.initializeUserFromToken(); // sayfa yenilendiğinde roller yüklensin
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('jwtToken', response.token);
        this.loggedIn.next(true);
        this.decodeToken(response.token); // 👈 token geldikten sonra roller çözümlenir
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.loggedIn.next(false);
    this.roles = []; // roller temizlenir
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  private decodeToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      this.roles = decoded.roles?.map((r: any) => r.authority) || decoded.roles || [];
    } catch (error) {
      console.error('Token çözümleme hatası:', error);
      this.roles = [];
    }
  }

  initializeUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      this.decodeToken(token);
    }
  }

  getCurrentUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.sub || null;
    } catch {
      return null;
    }
  }

  getCurrentUserRoles(): string[] {
    return this.roles;
  }

  isSeller(): boolean {
    return this.roles.includes('ROLE_SELLER');
  }

  isCustomer(): boolean {
    return this.roles.includes('ROLE_CUSTOMER');
  }
}
