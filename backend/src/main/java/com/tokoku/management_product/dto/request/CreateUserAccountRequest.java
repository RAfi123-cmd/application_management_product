package com.tokoku.management_product.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserAccountRequest {
    @NotBlank(message = "Username tidak boleh kosong")
    private String username;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Password tidak boleh kosong")
    @Size(min = 6, message = "Password minimal 6 karakter")
    @Pattern (regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Email harus memiliki domain lengkap, contoh: nama@contoh.com")
    private String password;

    @NotBlank(message = "Role tidak boleh kosong")
    @Pattern(regexp = "ADMIN|USER", message = "Role harus ADMIN atau USER")
    private String role;
}
