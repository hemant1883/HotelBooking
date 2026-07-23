package com.example.HotelManagement.repository;

import com.example.HotelManagement.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find all rooms belonging to a specific hotel
    List<Room> findByHotelId(Long hotelId);

    // Find rooms by type (e.g., 'Deluxe')
    List<Room> findByHotelIdAndRoomType(Long hotelId, String roomType);
}