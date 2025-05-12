package com.zayimhan.ecommerce.controller;

import com.zayimhan.ecommerce.dao.ProductRepository;
import com.zayimhan.ecommerce.dao.UserRepository;
import com.zayimhan.ecommerce.entity.Product;
import com.zayimhan.ecommerce.entity.User;
import com.zayimhan.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("http://localhost:4200")
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public ProductController(ProductRepository productRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Satıcı ürün eklesin
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        product.setSeller(seller);
        product.setActive(true);
        product.setDateCreated(new Date());
        product.setLastUpdated(new Date());

        return ResponseEntity.ok(productRepository.save(product));
    }

    // ✅ Yumuşak silme
    @PreAuthorize("hasRole('SELLER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateProduct(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        product.setActive(false);
        productRepository.save(product);

        return ResponseEntity.ok().build();
    }
    @PreAuthorize("hasRole('SELLER')")
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateProduct(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        // ✅ Sadece kendi ürününü aktif edebilir
        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).body("Bu ürünü aktif edemezsiniz.");
        }

        // ✅ Admin tarafından devre dışı bırakılmışsa aktif edilemez
        if (product.isDisabledByAdmin()) {
            return ResponseEntity.status(403).body("Bu ürün admin tarafından devre dışı bırakıldığı için tekrar aktif edilemez.");
        }

        product.setActive(true);
        product.setLastUpdated(new Date());
        productRepository.save(product);

        return ResponseEntity.ok(Map.of("message", "Ürün başarıyla aktif edildi."));
    }




    // ✅ Ürün güncelle
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestBody Product updatedProduct,
                                                 @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        if (!existingProduct.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setUnitPrice(updatedProduct.getUnitPrice());
        existingProduct.setUnitsInStock(updatedProduct.getUnitsInStock());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setLastUpdated(new Date());

        return ResponseEntity.ok(productRepository.save(existingProduct));
    }

    // ✅ ID'ye göre getir
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));
        return ResponseEntity.ok(product);
    }

    // ✅ Tüm aktif ürünler
    @GetMapping
    public List<Product> getAllActiveProducts() {
        return productRepository.findAll().stream()
                .filter(Product::isActive)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/findByCategoryId")
    public Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(id, pageable);
    }

    @GetMapping("/search/findByNameContaining")
    public Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable) {
        return productRepository.findByNameContainingAndActiveTrue(name, pageable);
    }


    // ✅ Kategoriye göre aktif ürünler (liste)
    @GetMapping("/category/{id}")
    public List<Product> getByCategory(@PathVariable Long id) {
        return productRepository.findByCategoryIdAndActiveTrue(id);
    }

    // ✅ Kategoriye göre aktif ürünler (sayfalı)
    @GetMapping("/category/{id}/paginate")
    public Page<Product> getByCategoryPaginated(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryIdAndActiveTrueAndSellerEnabled(id, pageable);
    }

    // ✅ Anahtar kelime ile arama (liste)
    @GetMapping("/search/{keyword}")
    public List<Product> searchByKeyword(@PathVariable String keyword) {
        return productRepository.findByNameContainingAndActiveTrue(keyword);
    }

    // ✅ Anahtar kelime ile arama (sayfalı)
    @GetMapping("/search/{keyword}/paginate")
    public Page<Product> searchByKeywordPaginated(
            @PathVariable String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingAndActiveTrueAndSellerEnabled(keyword, pageable);
    }

    // ✅ Satıcının ürünleri
    @GetMapping("/seller")
    public Page<Product> getSellerProducts(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(token);

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findBySeller(seller, pageable);
    }
}
