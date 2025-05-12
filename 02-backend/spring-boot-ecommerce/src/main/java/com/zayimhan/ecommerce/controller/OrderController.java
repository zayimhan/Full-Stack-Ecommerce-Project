package com.zayimhan.ecommerce.controller;

import com.zayimhan.ecommerce.dao.UserRepository;
import com.zayimhan.ecommerce.dto.OrderResponseDTO;
import com.zayimhan.ecommerce.entity.Order;
import com.zayimhan.ecommerce.dao.OrderRepository;
import com.zayimhan.ecommerce.entity.User;
import com.zayimhan.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("http://localhost:4200") // Angular için CORS izni
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ✅ Sipariş detayını getir
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderDetails(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Optional<Order> orderOptional = orderRepository.findById(id);

        if (orderOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOptional.get();
        order.getOrderItems().size(); // Lazy loading önlemi

        // Eğer Authorization varsa ve kullanıcı satıcı ise sadece kendi ürünlerini göstersin
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            // Satıcı mı kontrolü basitçe role'den yapılabilir
            if (user.getRoles().contains("ROLE_SELLER")) {
                return ResponseEntity.ok(new OrderResponseDTO(order, user.getId()));
            }
        }

        // Müşteri ise tüm siparişi döndür
        return ResponseEntity.ok(new OrderResponseDTO(order));
    }




    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersBySeller(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        List<Order> sellerOrders = orderRepository.findByOrderItemsProductSeller(seller);
        List<OrderResponseDTO> response = sellerOrders.stream()
                .map(order -> new OrderResponseDTO(order, seller.getId()))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/request-cancel")
    public ResponseEntity<?> requestCancel(@PathVariable Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setCancelRequested(true);
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("message", "İptal talebi alındı."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Order not found"));
        }
    }
}
