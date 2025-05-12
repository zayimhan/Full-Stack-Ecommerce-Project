import { CartItem } from "./cart-item";

export class OrderItem {

    id?: number;
    imageUrl?: string;
    unitPrice?: number;
    quantity?: number;
    productId?: number;

    constructor(cartItem?: CartItem) {
        if (cartItem) {
            this.imageUrl = cartItem.imageUrl;
            this.unitPrice = cartItem.unitPrice;
            this.quantity = cartItem.quantity;
            this.productId = cartItem.id;
        }
    }
}
