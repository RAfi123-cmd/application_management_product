package com.tokoku.management_product.constant;

public class UserManagementConstant {
    private UserManagementConstant() {
        // Private constructor to prevent instantiation
    }

    public static final String BASE_PATH = "/api/admin/users";
    public static final String USER_CREATED = "Akun berhasil dibuat";
    public static final String USER_UPDATED = "Akun berhasil diperbarui";
    public static final String USER_DELETED = "Akun berhasil dihapus";
    public static final String USER_NOT_FOUND = "Akun tidak ditemukan";
    public static final String CANNOT_DELETE_SELF = "Tidak bisa menghapus akun sendiri";
}
