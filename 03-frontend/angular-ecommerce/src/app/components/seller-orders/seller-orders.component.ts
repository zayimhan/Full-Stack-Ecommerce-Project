import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history.service';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
@Component({
  selector: 'app-seller-orders',
  standalone: false,
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
  this.orderHistoryService.getSellerOrders().subscribe({
    next: data => {
      this.orders = data.sort((a, b) => new Date(b.dateCreated!).getTime() - new Date(a.dateCreated!).getTime());
    },
    error: err => console.error('Siparişler alınamadı:', err)
  });
}


  requestCancel(orderId: number): void {
    this.orderHistoryService.cancelOrder(orderId).subscribe({
      next: () => alert('İptal talebi gönderildi'),
      error: err => console.error('İptal hatası:', err)
    });
  }
}
