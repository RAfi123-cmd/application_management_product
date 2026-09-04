package com.tokoku.management_product.dto.request;

public class ProductRequest {
    private Long id;
    private String name;
    private String kategori;
    private double harga;
    private Integer stok;
    private String deskripsi;

    public ProductRequest(Long id, String name, String kategori, double harga, Integer stok, String deskripsi) {
        this.id = id;
        this.name = name;
        this.kategori = kategori;
        this.harga = harga;
        this.stok = stok;
        this.deskripsi = deskripsi;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getKategori() {
        return kategori;
    }
    public void setKategori(String kategori) {
        this.kategori = kategori;
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
