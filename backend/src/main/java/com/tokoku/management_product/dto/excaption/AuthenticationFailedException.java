package com.tokoku.management_product.dto.excaption;

public class AuthenticationFailedException extends RuntimeException {
    public AuthenticationFailedException(String message){
        super(message);
    }
}
