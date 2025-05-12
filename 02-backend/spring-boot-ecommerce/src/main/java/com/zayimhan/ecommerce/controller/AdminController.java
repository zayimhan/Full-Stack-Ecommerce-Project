package com.zayimhan.ecommerce.controller;

import com.zayimhan.ecommerce.dao.OrderRepository;
import com.zayimhan.ecommerce.dao.RoleRepository;
import com.zayimhan.ecommerce.dao.UserRepository;
import com.zayimhan.ecommerce.dto.OrderResponseDTO;
import com.zayimhan.ecommerce.entity.Order;
import com.zayimhan.ecommerce.entity.Role;
import com.zayimhan.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("http://localhost:4200")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ✅ Tüm kullanıcıları getir
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ✅ Kullanıcının rolünü güncelle
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        String roleName = payload.get("role");
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = userOpt.get();
        user.setRoles(new HashSet<>(Collections.singleton(role))); // Mutable Set
        userRepository.save(user);

        return ResponseEntity.ok("Rol güncellendi");
    }

    // ✅ Tüm siparişleri getir
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders")
    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ Siparişin durumunu güncelle
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus(payload.get("status"));
        orderRepository.save(order);

        return ResponseEntity.ok("Sipariş durumu güncellendi");
    }

    // ✅ İptal taleplerini getir
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/support/cancel-requests")
    public List<OrderResponseDTO> getCancelRequests() {
        List<Order> requests = orderRepository.findByCancelRequestedTrue();
        return requests.stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ Siparişi iptal et (sil)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) return ResponseEntity.notFound().build();

        orderRepository.deleteById(id);
        return ResponseEntity.ok("Sipariş silindi");
    }

    // ✅ İptal talebini onayla (status = CANCELLED, cancelRequested = false)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<?> approveCancelRequest(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus("İPTAL EDİLDİ");
        order.setCancelRequested(false);
        orderRepository.save(order);

        return ResponseEntity.ok("İptal onaylandı.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setEnabled(false);
        userRepository.save(user);

        return ResponseEntity.ok("Kullanıcı devre dışı bırakıldı.");
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("Kullanıcı yeniden aktifleştirildi.");
    }


}
