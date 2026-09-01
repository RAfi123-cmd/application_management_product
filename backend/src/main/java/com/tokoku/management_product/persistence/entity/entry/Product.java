package com.tokoku.management_product.persistence.entity.entry;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String kategori;
    private double harga;
    private Integer stok;
    private String deksripsi;

    
    public Product(String name, String kategori, double harga, Integer stok, String deksripsi) {
        this.name = name;
        this.kategori = kategori;
        this.harga = harga;
        this.stok = stok;
        this.deksripsi = deksripsi;
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
    public String getDeksripsi() {
        return deksripsi;
    }
    public void setDeksripsi(String deksripsi) {
        this.deksripsi = deksripsi;
    }
}
