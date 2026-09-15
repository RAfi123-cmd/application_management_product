package com.tokoku.management_product.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.ProductConstant;
import com.tokoku.management_product.dto.request.ProductRequest;
import com.tokoku.management_product.dto.response.ProductResponse;
import com.tokoku.management_product.persistence.service.ProductService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping (ProductConstant.ADMIN_BASE_PATH)
@CrossOrigin (origins = "http://localhost:5173")
public class AdminProductController {
    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }
 
    @GetMapping(ProductConstant.VIEW_PRODUCT_ADMIN)
    public ResponseEntity<List<ProductResponse>> getAllProduct() {
        return ResponseEntity.ok(productService.getAllProducts());
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
