package com.tokoku.management_product.constant;

public class UserManagementConstant {
    private UserManagementConstant() {
        // Private constructor to prevent instantiation
    }

    // API
    public static final String BASE_PATH = "/api/admin/users";
    public static final String ALL_ADMIN = "/admins";
    public static final String ALL_USER = "/users";

    public static final String ADMIN_DASHBOARD = "/api/admin/dashboard";
    public static final String USER_DASHBOARD = "/api/user/dashboard";
    
    // API Stats
    public static final String STATS_PATH = "/stats";
    public static final String PRODUCT_STATS = "/product-stats";

    // Operations CRUD user
    public static final String VIEW = "/{id}";
    public static final String ADD = "/add";
    public static final String EDIT = "/edit/{id}";
    public static final String UPDATE = "/update";
    public static final String DELETE = "/delete/{id}";

    // Operations CRUD Admin
    public static final String ADMIN_VIEW = "/admin/{id}";
    public static final String ADMIN_ADD = "/admin/add";
    public static final String ADMIN_EDIT = "/admin/edit/{id}";
    public static final String ADMIN_UPDATE = "/admin/update";
    public static final String ADMIN_DELETE = "/admin/delete/{id}";

    public static final String USER_CREATED = "Akun User berhasil dibuat";
    public static final String USER_UPDATED = "Akun User berhasil diperbarui";
    public static final String USER_DELETED = "Akun User berhasil dihapus";

    public static final String ADMIN_CREATED = "Akun Admin berhasil dibuat";
    public static final String ADMIN_UPDATED = "Akun Admin berhasil diperbarui";
    public static final String ADMIN_DELETED = "Akun Admin berhasil dihapus";
    public static final String USER_NOT_FOUND = "Akun tidak ditemukan";
    public static final String CANNOT_DELETE_SELF = "Tidak bisa menghapus akun sendiri";
}
