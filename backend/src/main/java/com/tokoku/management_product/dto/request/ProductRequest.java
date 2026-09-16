package com.tokoku.management_product.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductRequest {
    private Long id;
    private String productId;
    private String productName;
    private String catagory;
    private String supplierId;
    private String supplierName;
    private Integer stockQuantity;
    private Integer reorderLevel;
    private Integer reorderQuantity;
    private BigDecimal unitPrice;
    private LocalDate dateReceived;
    private LocalDate lastOrderDate;
    private LocalDate expirationDate;
    private String warehouseLocation;
    private Integer salesVolume;
    private Integer inventoryTurnoverRate;
    private String status;

    public ProductRequest(Long id, String productId, String productName, String catagory, String supplierId,
            String supplierName, Integer stockQuantity, Integer reorderLevel, Integer reorderQuantity,
            BigDecimal unitPrice, LocalDate dateReceived, LocalDate lastOrderDate, LocalDate expirationDate,
            String warehouseLocation, Integer salesVolume, Integer inventoryTurnoverRate, String status) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.catagory = catagory;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.stockQuantity = stockQuantity;
        this.reorderLevel = reorderLevel;
        this.reorderQuantity = reorderQuantity;
        this.unitPrice = unitPrice;
        this.dateReceived = dateReceived;
        this.lastOrderDate = lastOrderDate;
        this.expirationDate = expirationDate;
        this.warehouseLocation = warehouseLocation;
        this.salesVolume = salesVolume;
        this.inventoryTurnoverRate = inventoryTurnoverRate;
        this.status = status;
    }


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getProductId() {
        return productId;
    }
    public void setProductId(String productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getCatagory() {
        return catagory;
    }
    public void setCatagory(String catagory) {
        this.catagory = catagory;
    }
    public String getSupplierId() {
        return supplierId;
    }
    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }
    public String getSupplierName() {
        return supplierName;
    }
    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    public Integer getReorderLevel() {
        return reorderLevel;
    }
    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }
    public Integer getReorderQuantity() {
        return reorderQuantity;
    }
    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }
    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
    public LocalDate getDateReceived() {
        return dateReceived;
    }
    public void setDateReceived(LocalDate dateReceived) {
        this.dateReceived = dateReceived;
    }
    public LocalDate getLastOrderDate() {
        return lastOrderDate;
    }
    public void setLastOrderDate(LocalDate lastOrderDate) {
        this.lastOrderDate = lastOrderDate;
    }
    public LocalDate getExpirationDate() {
        return expirationDate;
    }
    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
    public String getWarehouseLocation() {
        return warehouseLocation;
    }
    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }
    public Integer getSalesVolume() {
        return salesVolume;
    }
    public void setSalesVolume(Integer salesVolume) {
        this.salesVolume = salesVolume;
    }
    public Integer getInventoryTurnoverRate() {
        return inventoryTurnoverRate;
    }
    public void setInventoryTurnoverRate(Integer inventoryTurnoverRate) {
        this.inventoryTurnoverRate = inventoryTurnoverRate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
