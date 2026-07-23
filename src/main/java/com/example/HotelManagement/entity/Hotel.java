package com.example.HotelManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Getter @Setter
// ❌ REMOVE <Room> from this line:
public class Hotel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String address;
    private String city;
    private String contactNumber;
    private Double rating = 0.0;

    // Now 'Room' correctly refers to your Room.java entity
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @ElementCollection
    private List<String> images = new ArrayList<>();

    @ElementCollection
    private List<String> amenities = new ArrayList<>();
}