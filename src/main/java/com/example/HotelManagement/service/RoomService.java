package com.example.HotelManagement.service;

import com.example.HotelManagement.dto.RoomDto;
import com.example.HotelManagement.entity.Hotel;
import com.example.HotelManagement.entity.Room;
import com.example.HotelManagement.repository.HotelRepository;
import com.example.HotelManagement.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    // 1. Get rooms for a hotel
    public List<RoomDto> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 2. Add a new room
    @Transactional
    public RoomDto addRoom(Long hotelId, RoomDto roomDto) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = new Room();
        room.setRoomType(roomDto.getRoomType());
        room.setPricePerNight(roomDto.getPricePerNight());
        room.setCapacity(roomDto.getCapacity());
        room.setTotalRooms(roomDto.getTotalRooms());
        room.setDescription(roomDto.getDescription());
        room.setHotel(hotel);

        return mapToDto(roomRepository.save(room));
    }

    // 3. Update existing room
    @Transactional
    public RoomDto updateRoom(Long roomId, RoomDto roomDto) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setRoomType(roomDto.getRoomType());
        room.setPricePerNight(roomDto.getPricePerNight());
        room.setCapacity(roomDto.getCapacity());
        room.setTotalRooms(roomDto.getTotalRooms());
        room.setDescription(roomDto.getDescription());

        return mapToDto(roomRepository.save(room));
    }

    // 4. Delete room
    public void deleteRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(roomId);
    }

    // Helper method to convert Entity to DTO
    private RoomDto mapToDto(Room room) {
        RoomDto dto = new RoomDto();
        dto.setId(room.getId());
        dto.setRoomType(room.getRoomType());
        dto.setPricePerNight(room.getPricePerNight());
        dto.setCapacity(room.getCapacity());
        dto.setTotalRooms(room.getTotalRooms());
        dto.setDescription(room.getDescription());
        return dto;
    }
}