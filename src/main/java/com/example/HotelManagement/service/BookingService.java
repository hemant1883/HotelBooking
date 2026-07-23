package com.example.HotelManagement.service;

import com.example.HotelManagement.dto.BookingRequest;
import com.example.HotelManagement.dto.BookingResponse;
import com.example.HotelManagement.entity.Booking;
import com.example.HotelManagement.entity.BookingStatus;
import com.example.HotelManagement.entity.Room;
import com.example.HotelManagement.entity.User;
import com.example.HotelManagement.exception.ResourceNotFoundException;
import com.example.HotelManagement.repository.BookingRepository;
import com.example.HotelManagement.repository.RoomRepository;
import com.example.HotelManagement.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String email) throws BadRequestException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // 1. Basic Date Validation
        if (request.getCheckOutDate().isBefore(request.getCheckInDate()) ||
                request.getCheckOutDate().isEqual(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        // 2. Double Booking Check: Prevent SAME user from booking SAME room twice for overlapping dates
        long userOverlap = bookingRepository.countUserSpecificOverlaps(
                user.getId(),
                room.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (userOverlap > 0) {
            throw new BadRequestException("You already have a pending or confirmed booking for this room during these dates.");
        }

        // 3. Inventory Check: Prevent booking if room is full
        long totalOverlap = bookingRepository.countOverlappingBookings(
                request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate());

        if (totalOverlap >= room.getTotalRooms()) {
            throw new BadRequestException("No rooms available for these dates");
        }

        // 4. Create and Save Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumOfGuests(request.getNumOfGuests());

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        booking.setTotalPrice(days * room.getPricePerNight());

        booking.setStatus(BookingStatus.PENDING);

        return mapToResponse(bookingRepository.save(booking));
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setRoomId(booking.getRoom().getId());
        response.setRoomType(booking.getRoom().getRoomType());
        response.setHotelName(booking.getRoom().getHotel().getName());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setNumOfGuests(booking.getNumOfGuests());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(String.valueOf(booking.getStatus()));
        return response;
    }

    // Traveler: Get personal history
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Manager: Get bookings for ALL hotels they manage
    public List<BookingResponse> getBookingsForManager(Long managerId) {
        return bookingRepository.findAllByHotelManagerId(managerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Admin/Manager: Get bookings for ONE specific hotel
    public List<BookingResponse> getHotelBookings(Long hotelId) {
        return bookingRepository.findByRoomHotelId(hotelId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.valueOf(status));
        bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId, User user) throws BadRequestException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}