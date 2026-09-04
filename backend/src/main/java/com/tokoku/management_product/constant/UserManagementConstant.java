package com.tokoku.management_product.constant;

public class UserManagementConstant {
    private UserManagementConstant() {
        // Private constructor to prevent instantiation
    }

    // API
    public static final String BASE_PATH = "/api/admin/users";
    public static final String ADMIN_DASHBOARD = "/api/admin/dashboard";
    public static final String USER_DASHBOARD = "/api/user/dashboard";
    
    // API Stats
    public static final String STATS_PATH = "/stats";

    // Operations CRUD
    public static final String VIEW = "/{id}";
    public static final String ADD = "/add";
    public static final String EDIT = "/edit/{id}";
    public static final String UPDATE = "/update";
    public static final String DELETE = "/delete/{id}";

    // Operations Product User
    public static final String VIEW_PRODUCT_USER = "/api/user/product";


    public static final String USER_CREATED = "Akun berhasil dibuat";
    public static final String USER_UPDATED = "Akun berhasil diperbarui";
    public static final String USER_DELETED = "Akun berhasil dihapus";
    public static final String USER_NOT_FOUND = "Akun tidak ditemukan";
    public static final String CANNOT_DELETE_SELF = "Tidak bisa menghapus akun sendiri";
}
