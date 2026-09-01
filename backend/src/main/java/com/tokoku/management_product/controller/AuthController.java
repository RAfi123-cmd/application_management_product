package com.tokoku.management_product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.LoginConstant;
import com.tokoku.management_product.dto.LoginRequest;
import com.tokoku.management_product.dto.LoginResponse;
import com.tokoku.management_product.dto.RegisterResponse;
import com.tokoku.management_product.persistence.entity.auth.User;
import com.tokoku.management_product.persistence.repository.UserRepository;
import com.tokoku.management_product.persistence.service.CustomUserDetailsService;
import com.tokoku.management_product.security.JwtUtil;

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

    @PostMapping(LoginConstant.LOGIN_PATH)
    public LoginResponse login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (BadCredentialsException e) {
            // TODO: handle exception
            throw new RuntimeException(LoginConstant.LOGIN_FAILED);
        }

        final UserDetails userDetails = userDetailsServices.loadUserByUsername(request.getUsername());
        final String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException(LoginConstant.USER_NOT_FOUND));

        return new LoginResponse(
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

    @PostMapping(LoginConstant.REGISTER_PATH)
    public RegisterResponse register(@RequestBody RegisterResponse request){
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException(LoginConstant.USERNAME_ALREADY_EXISTS);
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(LoginConstant.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        final UserDetails userDetails = userDetailsServices.loadUserByUsername(savedUser.getUsername());
        final String token = jwtUtil.generateToken(userDetails);
        
        return new RegisterResponse(
            LoginConstant.REGISTER_SUCCESS,
            savedUser.getId(),
            token,
            savedUser.getUsername(),
            savedUser.getPassword(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getCreatedAt(),
            savedUser.getUpdatedAt()
        );
    }
}
