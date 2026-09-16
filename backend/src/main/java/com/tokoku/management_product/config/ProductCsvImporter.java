package com.tokoku.management_product.config;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.tokoku.management_product.persistence.entity.entry.Product;
import com.tokoku.management_product.persistence.repository.ProductRepository;

@Component
public class ProductCsvImporter implements CommandLineRunner {

    private final ProductRepository productRepository;

    private final DateTimeFormatter dateFormatter =
            DateTimeFormatter.ofPattern("M/d/yyyy");

    public ProductCsvImporter(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (productRepository.count() > 0) {
            return;
        }

        InputStream input = getClass()
                .getResourceAsStream("/products.csv");

        if (input == null) {
            throw new IllegalStateException(
                    "File products.csv tidak ditemukan di src/main/resources"
            );
        }

        final int BATCH_SIZE = 500;
        List<Product> batch = new ArrayList<>(BATCH_SIZE);

        try (var reader = new InputStreamReader(
                    input, StandardCharsets.UTF_8);

             var parser = CSVFormat.DEFAULT.builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .build()
                     .parse(reader)) {
            for(var row : parser){
                batch.add(mapRowToProduct(row));
                if (batch.size() == BATCH_SIZE) {
                    productRepository.saveAll(batch);
                    batch.clear();
                }
            }

            if (!batch.isEmpty()) {
                productRepository.saveAll(batch);
            }
        }
    }

    private Product mapRowToProduct(CSVRecord row) {
        Product product = new Product();
        product.setProductId(row.get("Product_ID"));
        product.setProductName(row.get("Product_Name"));
        product.setCategory(row.get("Catagory"));
        product.setSupplierId(row.get("Supplier_ID"));
        product.setSupplierName(row.get("Supplier_Name"));
        product.setStockQuantity(Integer.valueOf(row.get("Stock_Quantity")));
        product.setReorderLevel(Integer.valueOf(row.get("Reorder_Level")));
        product.setReorderQuantity(Integer.valueOf(row.get("Reorder_Quantity")));
        product.setUnitPrice(new BigDecimal(row.get("Unit_Price").replace("$", "").trim()));
        product.setDateReceived(parseDate(row.get("Date_Received")));
        product.setLastOrderDate(parseDate(row.get("Last_Order_Date")));
        product.setExpirationDate(parseDate(row.get("Expiration_Date")));
        product.setWarehouseLocation(row.get("Warehouse_Location"));
        product.setSalesVolume(Integer.valueOf(row.get("Sales_Volume")));
        product.setInventoryTurnoverRate(Integer.valueOf(row.get("Inventory_Turnover_Rate")));
        product.setStatus(row.get("Status"));
        return product;
    }

    private LocalDate parseDate(String value) {
        return LocalDate.parse(
                value.trim(),
                dateFormatter
        );
    }
}