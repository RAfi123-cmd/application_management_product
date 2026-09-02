package com.tokoku.management_product.dto.excaption;

public class DataNotFoundException extends RuntimeException{
    public DataNotFoundException (String message) {
        super(message);
    }
}
