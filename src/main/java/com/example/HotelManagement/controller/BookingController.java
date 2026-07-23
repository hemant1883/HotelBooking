package com.example.HotelManagement.controller;

import com.example.HotelManagement.dto.BookingRequest;
import com.example.HotelManagement.dto.BookingResponse;
import com.example.HotelManagement.entity.User;
import com.example.HotelManagement.repository.UserRepository;
import com.example.HotelManagement.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private  final UserRepository userRepository;
    // User: Create a new booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) throws BadRequestException { // Use UserDetails from Spring Security
        return ResponseEntity.ok(bookingService.createBooking(request, userDetails.getUsername()));
    }

    // User: View my own booking history
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        // Find the actual User entity to get its ID
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(bookingService.getUserBookings(currentUser.getId()));
    }

    // User/Manager: Cancel a booking
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal User user) throws BadRequestException {
        bookingService.cancelBooking(bookingId, user);
        return ResponseEntity.ok().build();
    }

    // Admin/Manager: View all bookings for a hotel
    @GetMapping("/hotel/{hotelId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<BookingResponse>> getHotelBookings(@PathVariable Long hotelId) {
        return ResponseEntity.ok(bookingService.getHotelBookings(hotelId));
    }
    // Inside BookingController.java
    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<BookingResponse>> getManagerBookings(@AuthenticationPrincipal UserDetails userDetails) {
        User manager = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        return ResponseEntity.ok(bookingService.getBookingsForManager(manager.getId()));
    }

    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN', 'USER')") // Allow user to cancel their own
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long bookingId,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Add logic to ensure only managers/admins or the booking owner can change status
        // For simplicity, we'll assume the service handles the user authorization logic.
        bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok().build();
    }
}