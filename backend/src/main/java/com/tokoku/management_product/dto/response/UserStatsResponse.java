package com.tokoku.management_product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsResponse {
    private long totalUsers;
    private long totalAdmins;
}
