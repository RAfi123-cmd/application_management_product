package com.tokoku.management_product.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.LoginConstant;
import com.tokoku.management_product.constant.UserManagementConstant;

@RestController
@RequestMapping(LoginConstant.BASE_AUTH_PATH)
@PreAuthorize("hasAuthority('USER')")
public class UserDashboardController {
    @GetMapping(UserManagementConstant.USER_DASHBOARD)
    public Map<String, String> dashboard() {
        return Map.of("role", "USER", "message", "Dashboard Khusus User");
    }
}
