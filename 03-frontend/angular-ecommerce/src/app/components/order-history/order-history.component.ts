import { Component } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { Order } from '../../common/order';
import { OrderHistoryService } from '../../services/order-history.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone:false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {

  orderHistoryList: OrderHistory[] = [];
  selectedOrder: Order | null = null;

  constructor(
    private orderHistoryService: OrderHistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    const userEmail = this.authService.getCurrentUserEmail();
    if (!userEmail) {
      console.warn('Kullanıcı oturumu yok.');
      return;
    }

    this.orderHistoryService.getOrderHistory(userEmail).subscribe({
      next: response => {
        this.orderHistoryList = response._embedded?.orders || [];
      },
      error: err => {
        console.error('Sipariş geçmişi alınamadı:', err);
      }
    });
  }

  cancelOrder(orderId: number): void {
  this.orderHistoryService.cancelOrder(orderId).subscribe({
    next: () => {
      alert('İptal talebiniz iletildi. Admin tarafından incelenecektir.');
      this.loadOrderHistory();
    },
    error: () => {
      alert('İptal talebi gönderilemedi.');
    }
  });
}


  viewOrderDetails(orderId: number): void {
    this.orderHistoryService.getOrderById(orderId).subscribe({
      next: data => {
        console.log("Gelen sipariş:", data);
        this.selectedOrder = data;
      },
      error: err => {
        console.error('Sipariş detay hatası:', err);
        alert('Order details could not be fetched.');
      }
    });
  }
  
  
}
