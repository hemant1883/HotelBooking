package com.example.HotelManagement.service;

import com.example.HotelManagement.dto.HotelDto;
import com.example.HotelManagement.entity.Hotel;
import com.example.HotelManagement.entity.User;
import com.example.HotelManagement.exception.ResourceNotFoundException;
import com.example.HotelManagement.repository.HotelRepository;
import com.example.HotelManagement.repository.HotelSpecifications;
import com.example.HotelManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    @Transactional
    public HotelDto createHotel(HotelDto hotelDto, String email) {
        // 1. Find the REAL User entity from DB
        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        Hotel hotel = new Hotel();
        hotel.setName(hotelDto.getName());
        hotel.setCity(hotelDto.getCity());
        hotel.setAddress(hotelDto.getAddress());
        hotel.setDescription(hotelDto.getDescription());
        hotel.setContactNumber(hotelDto.getContactNumber());
        hotel.setImages(hotelDto.getImages());
        hotel.setAmenities(hotelDto.getAmenities());

        // 2. Set the manager correctly
        hotel.setManager(manager);
        hotel.setRating(0.0);

        Hotel savedHotel = hotelRepository.save(hotel);
        return mapToDto(savedHotel);
    }
    // Inside HotelService.java
    @Transactional
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hotel not found");
        }
        hotelRepository.deleteById(id);
    }
    public List<HotelDto> getHotelsByManagerEmail(String email) {
        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));

        return hotelRepository.findByManagerId(manager.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Page<HotelDto> searchHotels(String city, Double minPrice, Double maxPrice, Pageable pageable) {
        return hotelRepository.findAll(HotelSpecifications.withFilters(city, minPrice, maxPrice), pageable)
                .map(this::mapToDto);
    }

    public HotelDto getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        return mapToDto(hotel);
    }

    private HotelDto mapToDto(Hotel hotel) {
        HotelDto dto = new HotelDto();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setDescription(hotel.getDescription());
        dto.setAddress(hotel.getAddress());
        dto.setCity(hotel.getCity());
        dto.setContactNumber(hotel.getContactNumber());
        dto.setRating(hotel.getRating());
        dto.setAmenities(hotel.getAmenities());
        dto.setImages(hotel.getImages());
        return dto;
    }
}