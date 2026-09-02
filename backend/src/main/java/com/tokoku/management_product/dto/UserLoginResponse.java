package com.tokoku.management_product.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginResponse {
    private String message;
    private Long id;
    private String token;
    private String username;
    private String password;
    private String email;
    private String role;
    private LocalDateTime createdAt; 
    private LocalDateTime updatedAt; 
}
