package com.zayimhan.ecommerce.service;


import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.zayimhan.ecommerce.dto.PaymentInfo;
import com.zayimhan.ecommerce.dto.Purchase;
import com.zayimhan.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
