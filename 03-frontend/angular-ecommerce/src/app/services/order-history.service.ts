import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment.development';
import { Order } from '../common/order';  // order detayları için

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.shopAppUrl + '/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const url = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(url);
  }

  cancelOrder(orderId: number): Observable<any> {
  const url = `${this.orderUrl}/${orderId}/request-cancel`; // ❗ endpoint değişti
  return this.httpClient.put(url, {});
}


  getOrderById(orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.orderUrl}/${orderId}`);
  }

  getSellerOrders(): Observable<Order[]> {
  const token = localStorage.getItem('seller_token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.httpClient.get<Order[]>(`${this.orderUrl}/seller`, { headers });
}
}
