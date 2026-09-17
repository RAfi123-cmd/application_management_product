package com.tokoku.management_product.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.tokoku.management_product.persistence.entity.entry.Product;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT DISTINCT p.productName FROM Product p WHERE p.productName IS NOT NULL ORDER BY p.productName ASC")
    List<String> findDistinctProductNames();
    long countByStatusIgnoreCase(String status);
}