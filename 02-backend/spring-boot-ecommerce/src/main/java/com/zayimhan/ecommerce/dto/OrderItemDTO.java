package com.zayimhan.ecommerce.dto;

import com.zayimhan.ecommerce.entity.OrderItem;

import java.math.BigDecimal;

public class OrderItemDTO {

    private String imageUrl;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private Long productId;

    public OrderItemDTO(OrderItem item) {
        this.imageUrl = item.getImageUrl();
        this.productName = item.getProduct().getName();
        this.quantity = item.getQuantity();
        this.unitPrice = item.getUnitPrice();
        this.productId=item.getProductId();
    }

    // Getter ve Setter'lar


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
}
