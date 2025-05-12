import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Order {
  id: number;
  status: string;
  totalPrice: number;
  dateCreated: Date;
  customerEmail: string;
}

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  statusOptions = ['PENDING', 'HAZIRLANIYOR', 'KARGODA', 'TESLİM EDİLDİ', 'İPTAL EDİLDİ'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadOrders(): void {
    this.http.get<Order[]>('http://localhost:8080/api/admin/orders', { headers: this.getAuthHeaders() })
      .subscribe({
        next: data => {
          // Tarihe göre azalan sırada sıralıyoruz (en yeni ilk sırada)
          this.orders = data.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        },
        error: err => console.error('Siparişler alınamadı:', err)
      });
  }


  updateStatus(order: Order): void {
    const payload = { status: order.status };

    this.http.put(`http://localhost:8080/api/admin/orders/${order.id}/status`, payload, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          alert('Durum güncellendi');
          this.loadOrders();
        },
        error: err => console.error('Durum güncelleme hatası:', err)
      });
  }

  cancelOrder(orderId: number): void {
    if (!confirm('Siparişi iptal etmek istediğinize emin misiniz?')) return;

    this.http.delete(`http://localhost:8080/api/admin/orders/${orderId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          alert('Sipariş iptal edildi');
          this.loadOrders();
        },
        error: err => console.error('Sipariş iptal hatası:', err)
      });
  }
}
