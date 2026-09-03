package com.tokoku.management_product.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateUserAccountRequest {
    @NotBlank(message = "Username tidak boleh kosong")
    private String username;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Role tidak boleh kosong")
    @Pattern(regexp = "ADMIN|USER", message = "Role harus ADMIN atau USER")
    private String role;

    private String password;
}
