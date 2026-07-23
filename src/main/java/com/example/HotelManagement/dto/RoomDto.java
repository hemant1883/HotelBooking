package com.example.HotelManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data // Generates Getters, Setters, etc.
@AllArgsConstructor // Generates a constructor with all fields
@NoArgsConstructor
public class RoomDto {
    private Long id;
    private String roomType;
    private Double pricePerNight;
    private Integer capacity;
    private Integer totalRooms;
    private String description;
    private List<String> images;
}