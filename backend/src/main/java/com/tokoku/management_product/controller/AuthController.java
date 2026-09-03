package com.tokoku.management_product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.AuthenticationConstant;
import com.tokoku.management_product.constant.LoginConstant;
import com.tokoku.management_product.dto.AdminLoginRequest;
import com.tokoku.management_product.dto.AdminLoginResponse;
import com.tokoku.management_product.dto.NewPasswordRequest;
import com.tokoku.management_product.dto.ResetPasswordRequest;
import com.tokoku.management_product.dto.UserLoginRequest;
import com.tokoku.management_product.dto.UserLoginResponse;
import com.tokoku.management_product.dto.excaption.AccessDeniedCustomException;
import com.tokoku.management_product.persistence.entity.auth.User;
import com.tokoku.management_product.persistence.repository.UserRepository;
import com.tokoku.management_product.persistence.service.CustomUserDetailsService;
import com.tokoku.management_product.security.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping(LoginConstant.BASE_AUTH_PATH)
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsServices;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(LoginConstant.ADMIN_LOGIN_PATH)
    public AdminLoginResponse postMethodName(@Valid @RequestBody AdminLoginRequest entity) {
        //TODO: process POST request
        User user = authenticateAndGetUser(entity.getUsername(), entity.getPassword());

        if (!AuthenticationConstant.ROLE_ADMIN.equalsIgnoreCase(user.getRole())) {
            throw new AccessDeniedCustomException(AuthenticationConstant.ACCESS_DENIED_NOT_ADMIN);
        }

        String token = generateToken(user);
        return new AdminLoginResponse(
            LoginConstant.LOGIN_SUCCESS,
            user.getId(),
            token,
            user.getUsername(),
            user.getPassword(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
    

    @PostMapping(LoginConstant.USER_LOGIN_PATH)
    public UserLoginResponse login(@Valid @RequestBody UserLoginRequest request) {
        User user = authenticateAndGetUser(request.getUsername(), request.getPassword());

        if (!AuthenticationConstant.ROLE_USER.equalsIgnoreCase(user.getRole())) {
            throw new AccessDeniedCustomException(AuthenticationConstant.ACCESS_DENIED_NOT_USER);
        }
        
        String token = generateToken(user);

        return new UserLoginResponse(
            LoginConstant.LOGIN_SUCCESS,
            user.getId(),
            token, 
            user.getUsername(),
            user.getPassword(), 
            user.getEmail(), 
            user.getRole(),
            user.getCreatedAt(),
            user.getUpdatedAt());
    }

    @PostMapping(LoginConstant.FORGOT_PASSWORD_PATH)
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        //TODO: process POST request
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(LoginConstant.EMAIL_FAILED));
        return LoginConstant.PASSWORD_RESET_SUCCESS;
    }

    @PostMapping(LoginConstant.RESET_PASSWORD_PATH)
    public String updatePassword(@Valid @RequestBody NewPasswordRequest request) {
        //TODO: process POST request
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException(LoginConstant.PASSWORD_MISSMATCH);
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(LoginConstant.EMAIL_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return LoginConstant.RESET_PASSWORD_SUCCESS;
    }

    @PostMapping(LoginConstant.LOGOUT_PATH)
    public String Logout() {
        //TODO: process POST request
        return LoginConstant.LOGOUT_SUCCESS;
    }

    private User authenticateAndGetUser(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException(LoginConstant.USER_NOT_FOUND));
    }

    private String generateToken(User user) {
        final UserDetails userDetails = userDetailsServices.loadUserByUsername(user.getUsername());
        return jwtUtil.generateToken(userDetails);
    }
}
    
