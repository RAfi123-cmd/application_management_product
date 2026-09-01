package com.tokoku.management_product.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tokoku.management_product.persistence.entity.entry.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
