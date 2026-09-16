package com.tokoku.management_product.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tokoku.management_product.constant.ProductConstant;
import com.tokoku.management_product.dto.request.ProductRequest;
import com.tokoku.management_product.dto.response.ProductResponse;
import com.tokoku.management_product.persistence.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(ProductConstant.ADMIN_BASE_PATH)
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(ProductConstant.VIEW_PRODUCT_ADMIN)
    public ResponseEntity<Page<ProductResponse>> getAllProduct(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping(ProductConstant.DETAIL_PRODUCT_ADMIN)
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductId(id));
    }

    @PostMapping(ProductConstant.CREATE_PRODUCT_ADMIN)
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse productResponse = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(productResponse);
    }

    @PutMapping(ProductConstant.EDIT_PRODUCT_ADMIN)
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping(ProductConstant.DELETE_PRODUCT_ADMIN)
    public ResponseEntity<ProductResponse> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}