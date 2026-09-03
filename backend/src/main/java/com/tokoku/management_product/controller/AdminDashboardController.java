package com.tokoku.management_product.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminDashboardController {
    @GetMapping
    public Map<String, String> dashboard() {
        return Map.of("role", "ADMIN", "message", "Dashboard Khusus Admin");
    }    
}
