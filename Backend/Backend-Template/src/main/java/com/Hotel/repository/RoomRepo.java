package com.Hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.Room;
import com.Hotel.entity.Room.RoomStatus;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {

    // All active rooms under a category — used by AvailabilityService (Phase 3, teammate)
    List<Room> findByRoomCategoryIdAndIsActiveTrue(Long roomCategoryId);

    // Count active rooms per category — used by AvailabilityService (Phase 3, teammate)
    long countByRoomCategoryIdAndIsActiveTrue(Long roomCategoryId);

    // All rooms under a category (including inactive) — admin view
    List<Room> findByRoomCategoryId(Long roomCategoryId);

    // Status-based query — used by admin room status update (Phase 11, teammate)
    List<Room> findByRoomCategoryIdAndCurrentStatus(Long roomCategoryId, RoomStatus status);
}
