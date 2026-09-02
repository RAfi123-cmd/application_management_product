package com.tokoku.management_product.constant;

public class LoginConstant {

    private LoginConstant(){
    }

    // API
    public static final String BASE_AUTH_PATH = "/api/auth";
    public static final String ADMIN_LOGIN_PATH = "/admin/login";
    public static final String USER_LOGIN_PATH = "/login";
    public static final String REGISTER_PATH = "/register";
    public static final String FORGOT_PASSWORD_PATH = "/forgot-password";
    public static final String LOGOUT_PATH = "/logout";

    public static final String LOGIN_SUCCESS = "Login Berhasil";
    public static final String LOGIN_FAILED = "Username atau password salah";                                                                                                         
    public static final String REGISTER_SUCCESS = "Registrasi Berhasil";
    public static final String USERNAME_ALREADY_EXISTS = "Username sudah dipakai";
    public static final String EMAIL_ALREADY_EXISTS = "Email sudah terdaftar";
    public static final String USER_NOT_FOUND = "User tidak ditemukan";
    public static final String EMAIL_FAILED = "Email anda salah";
    public static final String PASSWORD_RESET_SUCCESS = "Password berhasil direset";
    public static final String LOGOUT_SUCCESS = "Logout Berhasil";

    public static final String LOG_REGISTER_ATTEMPT = "Mencoba Register untuk username : {}";
    public static final String LOG_REGISTER_FAILED_USERNAME_EXISTS = "Registrasi gagal - username sudah dipakai: {}";
    public static final String LOG_REGISTER_FAILED_EMAIL_EXISTS = "Registrasi gagal - email sudah terdaftar: {}";
    public static final String LOG_REGISTER_SUCCESS = "User berhasil didaftarkan dengan id: {}";
    
}
