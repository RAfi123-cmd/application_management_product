package com.tokoku.management_product.controller;

import java.util.List;
import java.util.stream.Collectors;


import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tokoku.management_product.constant.UserManagementConstant;
import com.tokoku.management_product.dto.excaption.DataAlreadyExistException;
import com.tokoku.management_product.dto.excaption.DataNotFoundException;
import com.tokoku.management_product.dto.request.CreateAdminAccountRequest;
import com.tokoku.management_product.dto.request.CreateUserAccountRequest;
import com.tokoku.management_product.dto.request.UpdateAdminAccountRequest;
import com.tokoku.management_product.dto.request.UpdateUserAccountRequest;
import com.tokoku.management_product.dto.response.AdminAccountResponse;
import com.tokoku.management_product.dto.response.DeleteAdminAccountResponse;
import com.tokoku.management_product.dto.response.DeleteUserResponse;
import com.tokoku.management_product.dto.response.ProductStatsResponse;
import com.tokoku.management_product.dto.response.UserAccountResponse;
import com.tokoku.management_product.dto.response.UserStatsResponse;
import com.tokoku.management_product.persistence.entity.auth.User;
import com.tokoku.management_product.persistence.repository.ProductRepository;
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
    private final ProductRepository productRepository;

    private static final String ROLE_ADMIN = "ADMIN";

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    public UserManagementController(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping
    public List<UserAccountResponse> getAllByRole(@RequestParam(required = false) String role) {
        List<User> users = (role == null || role.isBlank())
                ? userRepository.findAll()
                : userRepository.findAll().stream()
                    .filter(u -> role.equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());

        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }
    

    @GetMapping(UserManagementConstant.VIEW)
    public UserAccountResponse getById(@PathVariable Long id) {
        User user = findUserOrThrow(id);
        return toResponse(user);
    }

    @GetMapping(UserManagementConstant.ALL_ADMIN)
    public List<AdminAccountResponse> getAllAdmin() {
        return userRepository.findAll().stream()
                .filter(user -> ROLE_ADMIN.equalsIgnoreCase(user.getRole()))
                .map(this::toAdminResponse)
                .collect(Collectors.toList());
    }

    @GetMapping(UserManagementConstant.ALL_USER)
    public List<UserAccountResponse> getAllUser() {
        return userRepository.findAll().stream()
                .filter(user -> "USER".equalsIgnoreCase(user.getRole()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    @PostMapping(UserManagementConstant.ADD)
    public UserAccountResponse create(@Valid @RequestBody CreateUserAccountRequest request) {
        ensureUsernameAndEmailAvailable(request.getUsername(), request.getEmail());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());

        return toResponse(userRepository.save(user));
    }

    @PutMapping(UserManagementConstant.EDIT)
    public UserAccountResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserAccountRequest request) {
        User user = findUserOrThrow(id);
        ensureUsernameAndEmailAvailableForUpdate(user, request.getUsername(), request.getEmail());

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole().toUpperCase());
        applyPasswordIfPresent(user, request.getPassword());

        return toResponse(userRepository.save(user));
    }

    @DeleteMapping(UserManagementConstant.DELETE)
    public DeleteUserResponse delete(@PathVariable Long id, Authentication authentication) {
        User user = findUserOrThrow(id);
        ensureNotDeletingSelf(authentication, user);

        UserAccountResponse deletedUser = toResponse(user);
        userRepository.delete(user);
        return new DeleteUserResponse(UserManagementConstant.USER_DELETED, deletedUser);
    }

    private UserAccountResponse toResponse(User user) {
        return new UserAccountResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                // user.getPassword(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    @GetMapping(UserManagementConstant.ADMIN_VIEW)
    public AdminAccountResponse adminView(@PathVariable  Long id) {
        User user = findUserOrThrow(id);
        ensureUserHasRole(user, ROLE_ADMIN);
        return toAdminResponse(user);
    }

    @PostMapping(UserManagementConstant.ADMIN_ADD)
    public AdminAccountResponse createAdmin(@Valid @RequestBody CreateAdminAccountRequest request) {
        ensureUsernameAndEmailAvailable(request.getUsername(), request.getEmail());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(ROLE_ADMIN);
        return toAdminResponse(userRepository.save(user));
    }

    @PutMapping(UserManagementConstant.ADMIN_EDIT)
    public AdminAccountResponse adminUpdate(@PathVariable Long id, @Valid @RequestBody UpdateAdminAccountRequest request) {
        User user = findUserOrThrow(id);
        ensureUserHasRole(user, ROLE_ADMIN);
        ensureUsernameAndEmailAvailableForUpdate(user, request.getUsername(), request.getEmail());

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(ROLE_ADMIN);
        applyPasswordIfPresent(user, request.getPassword());

        return toAdminResponse(userRepository.save(user));
    }

    @DeleteMapping (UserManagementConstant.ADMIN_DELETE)
    public DeleteAdminAccountResponse deleteAdmin(@PathVariable Long id, Authentication authentication){
        User user = findUserOrThrow(id);
        ensureUserHasRole(user, ROLE_ADMIN);
        ensureNotDeletingSelf(authentication, user);

        AdminAccountResponse deleteAdmin = toAdminResponse(user);
        userRepository.delete(user);

        return new DeleteAdminAccountResponse(UserManagementConstant.ADMIN_DELETED, deleteAdmin);
    }


    @GetMapping(UserManagementConstant.STATS_PATH)
    public UserStatsResponse getStats() {
        long totalUsers = userRepository.findAll().stream().filter(u -> "USER".equalsIgnoreCase(u.getRole())).count();
        long totalAdmin = userRepository.findAll().stream().filter(u -> "ADMIN".equalsIgnoreCase(u.getRole())).count();
        return new UserStatsResponse(totalUsers, totalAdmin);
    }

    @GetMapping(UserManagementConstant.PRODUCT_STATS)
    public ProductStatsResponse getProductStatsResponse() {
        return new ProductStatsResponse(
            productRepository.count(),
            productRepository.countByStatusIgnoreCase("ACTIVE"),
            productRepository.countByStatusIgnoreCase("DISCONTINUED"),
            productRepository.countByStatusIgnoreCase("BACKORDERED"));
    }
    

    private User findUserOrThrow(Long id){
        return userRepository.findById(id).orElseThrow(() -> new DataNotFoundException(UserManagementConstant.USER_NOT_FOUND));
    }

    private void ensureUsernameAndEmailAvailable(String username, String email){
        if (userRepository.existsByUsername(username)) {
            throw new DataAlreadyExistException("Username sudah dipakai");
        }
        if (userRepository.existsByEmail(email)) {
            throw new DataAlreadyExistException("Email sudah terdaftar");
        }
    }

    private void ensureUsernameAndEmailAvailableForUpdate(User currentUser, String username, String email) {
        userRepository.findByUsername(username).ifPresent(existing -> {
            if (!existing.getId().equals(currentUser.getId())) {
                throw new DataAlreadyExistException("Username sudah dipakai");
            }
        });

        userRepository.findByEmail(email).ifPresent(existing -> {
            if (!existing.getId().equals(currentUser.getId())) {
                throw new DataAlreadyExistException("Email sudah terdaftar");
            }
        });
    }

    private void applyPasswordIfPresent(User user, String rawPassword){
        if (rawPassword != null && !rawPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }
    }

    private void ensureNotDeletingSelf(Authentication authentication, User user){
        if (authentication.getName().equalsIgnoreCase(user.getUsername())) {
            throw new RuntimeException(UserManagementConstant.CANNOT_DELETE_SELF);
        }
    }

    private void ensureUserHasRole(User user, String expectedRole){
        if (!expectedRole.equalsIgnoreCase(user.getRole())) {
            throw new DataNotFoundException(UserManagementConstant.USER_NOT_FOUND);
        }
    }

    private AdminAccountResponse toAdminResponse(User user) {
        return new AdminAccountResponse(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}