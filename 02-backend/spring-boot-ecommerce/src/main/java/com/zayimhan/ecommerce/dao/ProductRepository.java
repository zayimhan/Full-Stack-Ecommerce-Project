package com.zayimhan.ecommerce.dao;

import com.zayimhan.ecommerce.entity.Product;
import com.zayimhan.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Kategoriye göre ürünleri getir
    Page<Product> findByCategoryId(@Param("id") Long categoryId, Pageable pageable);

    // Arama anahtar kelimesine göre ürünleri getir
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);

    // Satıcıya göre ürünleri getir
    Page<Product> findBySeller(User seller, Pageable pageable);

    // ✅ Aktif ve satıcısı da aktif olan ürünler — kategoriye göre (sayfalı)
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.seller.enabled = true AND p.category.id = :id")
    Page<Product> findByCategoryIdAndActiveTrueAndSellerEnabled(@Param("id") Long categoryId, Pageable pageable);

    // ✅ Aktif ve satıcısı da aktif olan ürünler — anahtar kelimeye göre (sayfalı)
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.seller.enabled = true AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> findByNameContainingAndActiveTrueAndSellerEnabled(@Param("keyword") String keyword, Pageable pageable);

    // Liste dönüşleri (aktif ürünler)
    @Query("SELECT p FROM Product p WHERE p.category.id = :id AND p.active = true")
    List<Product> findByCategoryIdAndActiveTrue(@Param("id") Long id);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name% AND p.active = true")
    List<Product> findByNameContainingAndActiveTrue(@Param("name") String name);

    // Alternatif default query tanımları
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndActiveTrue(String keyword, Pageable pageable);

    Page<Product> findByNameContainingAndActiveTrue(String keyword, Pageable pageable);
}
