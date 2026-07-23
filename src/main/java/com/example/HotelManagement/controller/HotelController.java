package com.example.HotelManagement.controller;

import com.example.HotelManagement.dto.HotelDto;
import com.example.HotelManagement.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping("/search")
    public ResponseEntity<Page<HotelDto>> search(
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(hotelService.searchHotels(city, null, null, PageRequest.of(page, size)));
    }

    @GetMapping("/my-hotels")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<HotelDto>> getMyHotels(@AuthenticationPrincipal UserDetails userDetails) {
        // Fetch hotels using the logged-in manager's email
        return ResponseEntity.ok(hotelService.getHotelsByManagerEmail(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/manage")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<HotelDto> createHotel(@RequestBody HotelDto hotelDto, @AuthenticationPrincipal UserDetails userDetails) {
        // Pass the manager's email to the service
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelService.createHotel(hotelDto, userDetails.getUsername()));
    }
}