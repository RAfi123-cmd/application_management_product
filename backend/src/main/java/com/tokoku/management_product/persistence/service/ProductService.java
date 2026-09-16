package com.tokoku.management_product.persistence.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
        List<Product> products = new ArrayList<>(productRepository.findAll());

        Comparator<Product> comparator = Comparator.comparing(Product::getProductName,Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
        quickSort(products, 0, products.size() - 1, comparator);

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), products.size());

        List<ProductResponse> result = products.subList(start, end).stream().map(this::toResponse).toList();
        return new PageImpl<>(result, pageable, products.size());
    }

    private <T> void quickSort(
        List<T> list,
        int low,
        int high,
        Comparator<T> comparator
    ){
        if (low >= high) {
            return;
        }

        int pivotIndex = partition(list, low, high, comparator);

        quickSort(list, low, pivotIndex - 1, comparator);
        quickSort(list, pivotIndex + 1, high, comparator);
    }

    private <T> int partition(List<T> list, int low, int high, Comparator<T> comparator){
        T pivot = list.get(high);
        int index = low;

        for (int i = low; i < high; i++) {
            if (comparator.compare(list.get(i), pivot) <= 0) {
                T temp = list.get(index);
                list.set(index, list.get(i));
                list.set(i, temp);
                index++;
            }
        }

        T temp = list.get(index);
        list.set(index, list.get(high));
        list.set(high, temp);

        return index;
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