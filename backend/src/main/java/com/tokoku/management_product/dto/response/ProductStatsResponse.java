package com.tokoku.management_product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data 
@AllArgsConstructor 
public class ProductStatsResponse {
    private long totalProducts;
    private long activeProducts;
    private long discontinuedProducts;
    private long backorderedProducts;
}
