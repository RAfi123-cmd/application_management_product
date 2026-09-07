package com.tokoku.management_product.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tokoku.management_product.persistence.entity.auth.User;

public interface AdminRepository extends  JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    
}
