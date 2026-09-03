package com.tokoku.management_product.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/dashboard")
@PreAuthorize("hasAuthority('USER')")
public class UserDashboardController {
    @GetMapping
    public Map<String, String> dashboard() {
        return Map.of("role", "USER", "message", "Dashboard Khusus User");
    }
}
