package com.tokoku.management_product.persistence.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tokoku.management_product.constant.ProductConstant;
import com.tokoku.management_product.dto.excaption.DataNotFoundException;
import com.tokoku.management_product.dto.request.ProductRequest;
import com.tokoku.management_product.dto.response.ProductResponse;
import com.tokoku.management_product.persistence.entity.entry.Product;
import com.tokoku.management_product.persistence.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public ProductResponse getProductId(Long id) {
        return toResponse(findByProductById(id));
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        copyRequestToProduct(request, product);

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findByProductById(id);
        copyRequestToProduct(request, product);

        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = findByProductById(id);
        productRepository.delete(product);
    }

    private Product findByProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(
                        ProductConstant.PRODUCT_NOT_FOUND
                ));
    }

    private void copyRequestToProduct(
            ProductRequest request,
            Product product
    ) {
        product.setProductId(request.getProductId());
        product.setProductName(request.getProductName());
        product.setCategory(request.getCatagory());
        product.setSupplierId(request.getSupplierId());
        product.setSupplierName(request.getSupplierName());
        product.setStockQuantity(request.getStockQuantity());
        product.setReorderLevel(request.getReorderLevel());
        product.setReorderQuantity(request.getReorderQuantity());
        product.setUnitPrice(request.getUnitPrice());
        product.setDateReceived(request.getDateReceived());
        product.setLastOrderDate(request.getLastOrderDate());
        product.setExpirationDate(request.getExpirationDate());
        product.setWarehouseLocation(request.getWarehouseLocation());
        product.setSalesVolume(request.getSalesVolume());
        product.setInventoryTurnoverRate(
                request.getInventoryTurnoverRate()
        );
        product.setStatus(request.getStatus());
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setCatagory(product.getCategory());
        response.setSupplierId(product.getSupplierId());
        response.setSupplierName(product.getSupplierName());
        response.setStockQuantity(product.getStockQuantity());
        response.setReorderLevel(product.getReorderLevel());
        response.setReorderQuantity(product.getReorderQuantity());
        response.setUnitPrice(product.getUnitPrice());
        response.setDateReceived(product.getDateReceived());
        response.setLastOrderDate(product.getLastOrderDate());
        response.setExpirationDate(product.getExpirationDate());
        response.setWarehouseLocation(product.getWarehouseLocation());
        response.setSalesVolume(product.getSalesVolume());
        response.setInventoryTurnoverRate(
                product.getInventoryTurnoverRate()
        );
        response.setStatus(product.getStatus());

        return response;
    }
}