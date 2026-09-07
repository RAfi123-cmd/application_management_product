package com.tokoku.management_product.dto.response;

public class DeleteAdminAccountResponse {
    private String message;
    private AdminAccountResponse data;


    public DeleteAdminAccountResponse(String message, AdminAccountResponse data) {
        this.message = message;
        this.data = data;
    }


    public String getMessage() {
        return message;
    }


    public void setMessage(String message) {
        this.message = message;
    }


    public AdminAccountResponse getData() {
        return data;
    }


    public void setData(AdminAccountResponse data) {
        this.data = data;
    }
    
}
