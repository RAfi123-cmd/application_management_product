package com.tokoku.management_product.controller;


import javax.management.RuntimeErrorException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tokoku.management_product.constant.LoginConstant;
import com.tokoku.management_product.dto.RegisterRequest;
import com.tokoku.management_product.dto.RegisterResponse;
import com.tokoku.management_product.dto.excaption.DataAlreadyExistException;
import com.tokoku.management_product.persistence.entity.auth.User;
import com.tokoku.management_product.persistence.repository.UserRepository;
import com.tokoku.management_product.persistence.service.CustomUserDetailsService;
import com.tokoku.management_product.security.JwtUtil;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(LoginConstant.BASE_AUTH_PATH)
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {
    private final Logger logger = LoggerFactory.getLogger(RegisterController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(LoginConstant.REGISTER_PATH)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        logger.info(LoginConstant.LOG_REGISTER_ATTEMPT, request.getUsername());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            logger.warn(LoginConstant.LOG_REGISTER_FAILED_USERNAME_EXISTS, request.getUsername());
            throw new DataAlreadyExistException(LoginConstant.USERNAME_ALREADY_EXISTS);
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn(LoginConstant.LOG_REGISTER_FAILED_EMAIL_EXISTS, request.getEmail());
            throw new DataAlreadyExistException(LoginConstant.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole("USER");

        User savedUser = userRepository.save(user);
        logger.info(LoginConstant.LOG_REGISTER_SUCCESS, savedUser.getId());

        final UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
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
