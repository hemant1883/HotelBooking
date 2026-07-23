package com.example.HotelManagement.repository;

import com.example.HotelManagement.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
// Inside BookingRepository.java

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.user.id = :userId " +
            "AND b.room.id = :roomId " +
            "AND b.status != 'CANCELLED' " +
            "AND (:checkIn < b.checkOutDate AND :checkOut > b.checkInDate)")
    long countUserSpecificOverlaps(@Param("userId") Long userId,
                                   @Param("roomId") Long roomId,
                                   @Param("checkIn") java.time.LocalDate checkIn,
                                   @Param("checkOut") java.time.LocalDate checkOut);
    @Query("SELECT b FROM Booking b WHERE b.room.hotel.manager.id = :managerId ORDER BY b.createdAt DESC")
    List<Booking> findAllByHotelManagerId(@Param("managerId") Long managerId);
    List<Booking> findByRoomHotelId(Long hotelId);
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId " +
            "AND b.status != 'CANCELLED' " +
            "AND (:checkIn < b.checkOutDate AND :checkOut > b.checkInDate)")
    long countOverlappingBookings(@Param("roomId") Long roomId,
                                  @Param("checkIn") LocalDate checkIn,
                                  @Param("checkOut") LocalDate checkOut);
}
