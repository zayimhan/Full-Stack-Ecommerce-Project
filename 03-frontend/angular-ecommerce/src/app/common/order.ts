import { OrderItem } from './order-item';

export class Order {
  id?: number;
  orderTrackingNumber?: string;
  totalQuantity?: number;
  totalPrice?: number;
  status?: string;
  dateCreated?: Date;
  lastUpdated?: Date;
  cancelRequested?: boolean;
  orderItems: OrderItem[] = [];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
