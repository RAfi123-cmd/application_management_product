package com.tokoku.management_product.persistence.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.tokoku.management_product.persistence.entity.entry.Product;

import jakarta.persistence.criteria.Predicate;

public class ProductSpesification {

    private ProductSpesification() {
    }

    public static Specification<Product> filter(
            String search,
            String name,
            String category,
            String status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String value = search.trim();
                String likeSearch = "%" + value.toLowerCase() + "%";

                List<Predicate> searchPredicates = new ArrayList<>();

                searchPredicates.add(cb.like(
                        cb.lower(root.get("productName")),
                        likeSearch
                ));
                searchPredicates.add(cb.like(
                        cb.lower(root.get("category")),
                        likeSearch
                ));
                searchPredicates.add(cb.like(
                        cb.lower(root.get("productId")),
                        likeSearch
                ));
                searchPredicates.add(cb.like(
                        cb.lower(root.get("supplierName")),
                        likeSearch
                ));
                searchPredicates.add(cb.like(
                        cb.lower(root.get("warehouseLocation")),
                        likeSearch
                ));
                searchPredicates.add(cb.like(
                        cb.lower(root.get("status")),
                        likeSearch
                ));

                try {
                    Integer stock = Integer.valueOf(value);
                    searchPredicates.add(
                            cb.equal(root.get("stockQuantity"), stock)
                    );
                } catch (NumberFormatException ignored) {
                    // Search bukan angka stok
                }

                try {
                    BigDecimal unitPrice = new BigDecimal(
                            value.replace(",", ".")
                    );
                    searchPredicates.add(
                            cb.equal(root.get("unitPrice"), unitPrice)
                    );
                } catch (NumberFormatException ignored) {
                    // Search bukan angka harga
                }

                predicates.add(
                        cb.or(searchPredicates.toArray(new Predicate[0]))
                );
            }

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("productName")),
                        "%" + name.trim().toLowerCase() + "%"
                ));
            }

            if (category != null && !category.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("category")),
                        "%" + category.trim().toLowerCase() + "%"
                ));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}