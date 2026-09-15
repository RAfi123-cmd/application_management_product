package com.tokoku.management_product.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.ProductConstant;
import com.tokoku.management_product.dto.request.ProductRequest;
import com.tokoku.management_product.dto.response.ProductResponse;
import com.tokoku.management_product.persistence.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping(ProductConstant.BASE_PATH)
@CrossOrigin(origins = "http://localhost:5173")
public class UserProductController {
    private final ProductService productService;

    public UserProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(ProductConstant.VIEW_PRODUCT_ADMIN)
    public ResponseEntity<List<ProductResponse>> getAllProduct() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
}
