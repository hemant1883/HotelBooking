package com.example.HotelManagement.repository;

import com.example.HotelManagement.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {

    // Advanced search: Filters by city and name (case-insensitive)
    @Query("SELECT h FROM Hotel h WHERE " +
            "(:city IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Hotel> searchHotels(
            @Param("city") String city,
            @Param("name") String name,
            Pageable pageable
    );

    // Find hotels managed by a specific user
    List<Hotel> findByManagerId(Long managerId);
}