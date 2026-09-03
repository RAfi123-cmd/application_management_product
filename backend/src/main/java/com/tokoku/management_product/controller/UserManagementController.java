package com.tokoku.management_product.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tokoku.management_product.constant.UserManagementConstant;
import com.tokoku.management_product.dto.CreateUserAccountRequest;
import com.tokoku.management_product.dto.UpdateUserAccountRequest;
import com.tokoku.management_product.dto.UserAccountResponse;
import com.tokoku.management_product.dto.excaption.DataAlreadyExistException;
import com.tokoku.management_product.dto.excaption.DataNotFoundException;
import com.tokoku.management_product.persistence.entity.auth.User;
import com.tokoku.management_product.persistence.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping(UserManagementConstant.BASE_PATH)
@CrossOrigin(origins = "http://localhost:5173")
public class UserManagementController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserAccountResponse> getAllByRole(@RequestParam(required = false) String role) {
        List<User> users = (role == null || role.isBlank())
                ? userRepository.findAll()
                : userRepository.findAll().stream()
                    .filter(u -> role.equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());

        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserAccountResponse getById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(UserManagementConstant.USER_NOT_FOUND));
        return toResponse(user);
    }

    @PostMapping
    public UserAccountResponse create(@Valid @RequestBody CreateUserAccountRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DataAlreadyExistException("Username sudah dipakai");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DataAlreadyExistException("Email sudah terdaftar");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());

        return toResponse(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public UserAccountResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserAccountRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(UserManagementConstant.USER_NOT_FOUND));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole().toUpperCase());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(UserManagementConstant.USER_NOT_FOUND));

        // Cegah admin menghapus akunnya sendiri
        if (authentication.getName().equalsIgnoreCase(user.getUsername())) {
            throw new RuntimeException(UserManagementConstant.CANNOT_DELETE_SELF);
        }

        userRepository.delete(user);
        return UserManagementConstant.USER_DELETED;
    }

    private UserAccountResponse toResponse(User user) {
        return new UserAccountResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
    
}
