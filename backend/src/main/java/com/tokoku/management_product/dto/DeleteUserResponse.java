package com.tokoku.management_product.dto;

public class DeleteUserResponse {
    private String message;
    private UserAccountResponse data;

    
    public DeleteUserResponse(String message, UserAccountResponse data) {
        this.message = message;
        this.data = data;
    }


    public String getMessage() {
        return message;
    }


    public void setMessage(String message) {
        this.message = message;
    }


    public UserAccountResponse getData() {
        return data;
    }


    public void setData(UserAccountResponse data) {
        this.data = data;
    }

    
}
