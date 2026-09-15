package com.tokoku.management_product.persistence.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tokoku.management_product.constant.ProductConstant;
import com.tokoku.management_product.dto.excaption.DataNotFoundException;
import com.tokoku.management_product.dto.request.ProductRequest;
import com.tokoku.management_product.dto.response.ProductResponse;
import com.tokoku.management_product.persistence.entity.entry.Product;
import com.tokoku.management_product.persistence.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts(){
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse getProductId(Long id){
        return toResponse(findByProductById(id));
    }


    private Product findByProductById(Long id) {
        // TODO Auto-generated method stub
        return productRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ProductConstant.PRODUCT_NOT_FOUND));
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product(
                request.getName(),
                request.getKategori(),
                request.getHarga(),
                request.getStok(),
                request.getDeskripsi()
        );

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request){
        Product product = findByProductById(id);

        product.setName(request.getName());
        product.setKategori(request.getKategori());
        product.setHarga(request.getHarga());
        product.setStok(request.getStok());
        product.setDeskripsi(request.getDeskripsi());

        return toResponse(productRepository.save(product));
    }
    
    public void deleteProduct(long id){
        Product product = findByProductById(id);
        productRepository.delete(product);
    }

    private ProductResponse toResponse(Product product){
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getKategori(),
            product.getHarga(),
            product.getStok(),
            product.getDeskripsi()
        );
    }

    
    
}
