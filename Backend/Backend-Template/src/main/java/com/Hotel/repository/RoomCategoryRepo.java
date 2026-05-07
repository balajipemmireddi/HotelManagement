package com.Hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.RoomCategory;

@Repository
public interface RoomCategoryRepo extends JpaRepository<RoomCategory, Long> {

    // All categories for a given hotel — used by GET /api/hotels/{id}/rooms
    List<RoomCategory> findByHotelId(Long hotelId);

    // Used by teammate's AvailabilityService (Phase 3) to check if category
    // belongs to a specific hotel before querying availability
    boolean existsByIdAndHotelId(Long id, Long hotelId);
}
