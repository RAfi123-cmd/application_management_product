package com.tokoku.management_product.dto.excaption;

public class DataAlreadyExistException extends RuntimeException {
    public DataAlreadyExistException (String message) {
        super(message);
    }
}
