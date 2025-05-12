import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  availableRoles = ['ROLE_CUSTOMER', 'ROLE_SELLER', 'ROLE_ADMIN'];
  editedUser: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      console.error("Admin token bulunamadı.");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8080/api/admin/users', { headers })
      .subscribe({
        next: data => {
          this.users = data.map(user => ({
            ...user,
            selectedRole: user.roles?.[0]?.name || 'ROLE_CUSTOMER'
          }));
        },
        error: err => console.error('Kullanıcılar alınamadı:', err)
      });
  }

  editRoles(user: any): void {
    this.editedUser = { ...user }; // orijinalden kopya al
  }

  cancelEdit(): void {
    this.editedUser = null;
  }

  updateUserRole(user: any): void {
    if (!user.selectedRole) {
      alert("Lütfen bir rol seçiniz.");
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (!token) {
      alert("Giriş yapılmamış.");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { role: user.selectedRole };

    console.log("Güncellenecek kullanıcı:", user);
    console.log("Gönderilen payload:", payload);

    this.http.put(`http://localhost:8080/api/admin/users/${user.id}/role`, payload, { headers, responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log('Sunucudan gelen cevap (rol güncelleme):', res || 'Boş cevap'); // null ise bile göster
          alert(`Rol güncellendi: ${user.selectedRole}`);
          this.editedUser = null;
          this.getUsers();
        },
        error: err => {
          console.error('Rol güncelleme başarısız:', err);
          alert('Bir hata oluştu: ' + (err?.error?.message || err.message));
        }
      });

  }

  deactivateUser(userId: number): void {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    alert("Giriş yapılmamış.");
    return;
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.put(`http://localhost:8080/api/admin/users/${userId}/deactivate`, {}, { headers, responseType: 'text' })
    .subscribe({
      next: res => {
        alert('Kullanıcı devre dışı bırakıldı.');
        this.getUsers();
      },
      error: err => {
        console.error('Deaktivasyon hatası:', err);
        alert('Kullanıcı devre dışı bırakılamadı.');
      }
    });
}

  activateUser(userId: number): void {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    alert("Giriş yapılmamış.");
    return;
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.put(`http://localhost:8080/api/admin/users/${userId}/activate`, {}, { headers, responseType: 'text' })
    .subscribe({
      next: res => {
        alert('Kullanıcı aktifleştirildi.');
        this.getUsers();
      },
      error: err => {
        console.error('Aktifleştirme hatası:', err);
        alert('Kullanıcı aktifleştirilemedi.');
      }
    });
}



}
