package com.example.HotelManagement.service;

import com.example.HotelManagement.dto.AuthResponse;
import com.example.HotelManagement.dto.LoginRequest;
import com.example.HotelManagement.dto.RegisterRequest;
import com.example.HotelManagement.entity.Role;
import com.example.HotelManagement.entity.User;
import com.example.HotelManagement.repository.RoleRepository;
import com.example.HotelManagement.repository.UserRepository;
import com.example.HotelManagement.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(Collections.singleton(role));

        userRepository.save(user);

        // FIX: Extract authorities so the token includes the Role
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(role.getName())
        );

        String token = jwtUtils.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), authorities
        ));

        return new AuthResponse(token, request.getRole(), user.getEmail(), user.getFirstName());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRoles().isEmpty()) {
            throw new RuntimeException("User has no assigned roles");
        }

        // FIX: Extract all roles from the user and convert to SimpleGrantedAuthority
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        String roleName = user.getRoles().iterator().next().getName();

        // Pass the real authorities list to the token generator
        String token = jwtUtils.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), authorities
        ));

        return new AuthResponse(token, roleName, user.getEmail(), user.getFirstName());
    }
}