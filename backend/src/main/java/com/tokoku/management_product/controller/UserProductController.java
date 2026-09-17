package com.tokoku.management_product.controller;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.ProductConstant;
// import com.tokoku.management_product.dto.response.ProductResponse;
// import com.tokoku.management_product.persistence.service.ProductService;


// import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping(ProductConstant.BASE_PATH)
@CrossOrigin(origins = "http://localhost:5173")
public class UserProductController {
    // private final ProductService productService;

    // public UserProductController(ProductService productService) {
    //     this.productService = productService;
    // }

    // @GetMapping(ProductConstant.VIEW_PRODUCT_ADMIN)
    // public ResponseEntity<Page<ProductResponse>> getAllProduct(Pageable pageable) {
    //     return ResponseEntity.ok(productService.getAllProducts(pageable));
    // }
    
}
