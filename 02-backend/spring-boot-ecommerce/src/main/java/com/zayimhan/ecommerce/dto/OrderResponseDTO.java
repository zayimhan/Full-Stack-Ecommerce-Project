package com.zayimhan.ecommerce.dto;

import com.zayimhan.ecommerce.entity.Order;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponseDTO {

    private Long id;
    private String status;
    private BigDecimal totalPrice;
    private Date dateCreated;
    private String customerEmail;
    private Boolean cancelRequested;

    private List<OrderItemDTO> orderItems; // Satıcının ürünleri

    public OrderResponseDTO(Order order, Long sellerId) {
        this.id = order.getId();
        this.status = order.getStatus();
        this.totalPrice = order.getTotalPrice();
        this.dateCreated = order.getDateCreated();
        this.customerEmail = order.getCustomer() != null ? order.getCustomer().getEmail() : "—";
        this.cancelRequested = order.isCancelRequested();


        // Eğer sellerId null değilse, sadece o satıcının ürünleri filtrelenir
        if (sellerId != null) {
            this.orderItems = order.getOrderItems().stream()
                    .filter(item -> item.getProduct().getSeller().getId().equals(sellerId))
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
        } else {
            // sellerId null ise tüm ürünler eklenir
            this.orderItems = order.getOrderItems().stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
        }
    }

    // ✅ sellerId VERİLMEYEN durumlar için (varsayılan kullanım)
    public OrderResponseDTO(Order order) {
        this(order, null);
    }

    // Getters & Setters

    public List<OrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }


    public String getCustomerEmail() {

        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
