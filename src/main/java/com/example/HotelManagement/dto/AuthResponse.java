package com.example.HotelManagement.dto;

import lombok.AllArgsConstructor; // <--- MUST HAVE THIS
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor // This creates the constructor with (token, role, email, firstName)
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String email;
    private String firstName;
}