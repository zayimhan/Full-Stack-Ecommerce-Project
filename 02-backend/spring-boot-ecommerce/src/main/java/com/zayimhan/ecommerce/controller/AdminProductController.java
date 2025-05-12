package com.zayimhan.ecommerce.controller;

import com.zayimhan.ecommerce.dao.ProductRepository;
import com.zayimhan.ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminProductController {

    private final ProductRepository productRepository;

    @Autowired
    public AdminProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ✅ Tüm ürünleri listele
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDeactivateProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        product.setActive(false);
        product.setDisabledByAdmin(true); // ✅ admin işaretliyor
        product.setLastUpdated(new Date());
        productRepository.save(product);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        product.setActive(true);
        product.setDisabledByAdmin(false);
        productRepository.save(product);

        return ResponseEntity.ok().build();
    }



}
