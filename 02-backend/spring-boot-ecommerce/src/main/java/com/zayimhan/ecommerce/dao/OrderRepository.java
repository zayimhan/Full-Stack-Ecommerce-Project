package com.zayimhan.ecommerce.dao;

import com.zayimhan.ecommerce.entity.Order;
import com.zayimhan.ecommerce.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order,Long> {

    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);
    List<Order> findByCancelRequestedTrue();
    List<Order> findByOrderItemsProductSeller(User seller);

}
