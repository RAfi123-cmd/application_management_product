package com.tokoku.management_product.dto.excaption;

public class BadCredentialsCustomException extends RuntimeException{
    public BadCredentialsCustomException(String message) {
        super(message);
    }
}
