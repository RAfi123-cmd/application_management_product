package com.tokoku.management_product.dto.response;

public class ProductResponse {
    private long id;
    private String name;
    private double harga;
    private Integer stok;
    private String deskripsi;
    public ProductResponse(long id, String name, String string, double harga, Integer stok, String deskripsi) {
        this.id = id;
        this.name = name;
        this.harga = harga;
        this.stok = stok;
        this.deskripsi = deskripsi;
    }
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public double getHarga() {
        return harga;
    }
    public void setHarga(double harga) {
        this.harga = harga;
    }
    public Integer getStok() {
        return stok;
    }
    public void setStok(Integer stok) {
        this.stok = stok;
    }
    public String getDeskripsi() {
        return deskripsi;
    }
    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    
}
