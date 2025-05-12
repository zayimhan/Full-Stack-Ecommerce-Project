import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

    order: Order | undefined;
    orderItems: OrderItem[] | undefined;
    shippingAddress: Address | undefined;
    billingAddress: Address | undefined;
    customer: Customer | undefined;
}
