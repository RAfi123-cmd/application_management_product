package com.tokoku.management_product.constant;

public class AuthenticationConstant {
    private AuthenticationConstant(){
    }

    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer";
    public static final String SECRET_KEY = "ini-rahasia-jangan-sampai-bocor-minimal-32-karakter";
    public static final long TOKEN_EXPARTION_MS = 1000 * 60 * 60 * 10;
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";
}
