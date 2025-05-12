import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CancelRequest {
  id: number;
  customerEmail: string;
  totalPrice: number;
  dateCreated: string;
  status: string;
}

@Component({
  selector: 'app-support',
  standalone: false,
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  cancelRequests: CancelRequest[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCancelRequests();
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadCancelRequests(): void {
    this.http.get<CancelRequest[]>('http://localhost:8080/api/admin/support/cancel-requests', {
      headers: this.getHeaders()
    }).subscribe({
      next: data => this.cancelRequests = data,
      error: err => console.error('İptal talepleri alınamadı:', err)
    });
  }

  approveCancellation(orderId: number): void {
    this.http.put(`http://localhost:8080/api/admin/orders/${orderId}/cancel`, {}, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        alert('Sipariş iptali onaylandı.');
        this.loadCancelRequests();
      },
      error: err => alert('Onay başarısız.')
    });
  }
}
