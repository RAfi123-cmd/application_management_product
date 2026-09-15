package com.tokoku.management_product.constant;

public class ProductConstant {
    private ProductConstant(){}

    public final static String TABLE_NAME = "/products";

    public final static int MIN_STOCK = 0;
    public final static double MIN_PRICE = 0.0;

    public static final String BASE_PATH = "/api/user/product";
    public static final String ADMIN_BASE_PATH = "/api/admin/product";

    public static final String VIEW_PRODUCT_ADMIN = "";
    public static final String CREATE_PRODUCT_ADMIN = "/add";
    public static final String EDIT_PRODUCT_ADMIN = "/edit/{id}";
    public static final String DELETE_PRODUCT_ADMIN = "/delete/{id}";

    public static final String NAME_REQUIRED = "Nama produk wajib diisi";
    public static final String PRODUCT_NOT_FOUND = "Produk tidak ditemukan";
    public static final String CATEGORY_REQUIRED = "Kategori produk wajib diisi";
    public static final String PRICE_INVALID = "Harga produk tidak boleh kurang dari 0";
    public static final String STOCK_INVALID = "Stok produk tidak boleh kurang dari 0";
    
};

