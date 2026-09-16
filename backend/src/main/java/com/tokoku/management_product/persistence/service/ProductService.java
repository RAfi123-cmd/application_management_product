package com.tokoku.management_product.persistence.service;


import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tokoku.management_product.constant.ProductConstant;
import com.tokoku.management_product.dto.excaption.DataNotFoundException;
import com.tokoku.management_product.dto.request.ProductRequest;
import com.tokoku.management_product.dto.response.ProductResponse;
import com.tokoku.management_product.persistence.entity.entry.Product;
import com.tokoku.management_product.persistence.repository.ProductRepository;

@Service
public class ProductService {

    
    private static final Path UPLOAD_DIR = Paths.get("uploads", "products");
    
    private static final String PUBLIC_PATH_PREFIX = "/uploads/products/";

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
        return productRepository.findById(id).orElseThrow(() -> new DataNotFoundException(ProductConstant.PRODUCT_NOT_FOUND));
    }

    public ProductResponse createProduct(ProductRequest request) {
        String gambarPath = saveImageIfPresent(request.getImage());

        Product product = new Product(
                request.getName(),
                request.getKategori(),
                request.getHarga(),
                request.getStok(),
                request.getDeskripsi(),
                gambarPath
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

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            deleteImageIfExists(product.getImage());
            String gambarPath = saveImageIfPresent(request.getImage());
            product.setImage(gambarPath);
        }

        return toResponse(productRepository.save(product));
    }
    
    public void deleteProduct(long id){
        Product product = findByProductById(id);
        deleteImageIfExists(product.getImage());
        productRepository.delete(product);
    }

    private String saveImageIfPresent(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            Files.createDirectories(UPLOAD_DIR);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "gambar";
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }

            String fileName = UUID.randomUUID() + extension;
            Path targetPath = UPLOAD_DIR.resolve(fileName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return PUBLIC_PATH_PREFIX + fileName;
        } catch (IOException e) {
            throw new UncheckedIOException("Gagal menyimpan gambar produk", e);
        }
    }

    private void deleteImageIfExists(String gambarPath) {
        if (gambarPath == null || gambarPath.isBlank()) {
            return;
        }

        try {
            String fileName = gambarPath.substring(gambarPath.lastIndexOf('/') + 1);
            Path filePath = UPLOAD_DIR.resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Gagal hapus file lama bukan error fatal, cukup diabaikan supaya proses utama tetap lanjut
        }
    }

    private ProductResponse toResponse(Product product){
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getKategori(),
            product.getHarga(),
            product.getStok(),
            product.getDeskripsi(),
            product.getImage()
        );
    }  
}