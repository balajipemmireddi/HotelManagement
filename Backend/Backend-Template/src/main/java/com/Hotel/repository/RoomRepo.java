package com.Hotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.Room;
import com.Hotel.entity.Room.RoomStatus;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {

    // All active rooms under a category
    List<Room> findByRoomCategoryIdAndIsActiveTrue(Long roomCategoryId);

    // Count total active rooms per category
    long countByRoomCategoryIdAndIsActiveTrue(Long roomCategoryId);

    // All rooms under a category (including inactive) — admin view
    List<Room> findByRoomCategoryId(Long roomCategoryId);

    // Status-based query — used by admin room status update (Phase 11)
    List<Room> findByRoomCategoryIdAndCurrentStatus(Long roomCategoryId, RoomStatus status);

    /**
     * PHASE 3 — Core availability query.
     *
     * Finds all ACTIVE rooms in a category that are NOT booked
     * for the given date range (checkIn to checkOut).
     *
     * Overlap condition: a booking overlaps if
     *   booking.checkInDate  < :checkOut
     *   AND booking.checkOutDate > :checkIn
     *
     * Only considers CONFIRMED or PENDING bookings (not CANCELLED).
     * Only considers rooms that are AVAILABLE or CLEANING status
     * (MAINTENANCE rooms are excluded from bookable inventory).
     */
    @Query("""
        SELECT r FROM Room r
        WHERE r.roomCategory.id = :categoryId
          AND r.isActive = true
          AND r.currentStatus IN ('AVAILABLE', 'CLEANING')
          AND r.id NOT IN (
              SELECT br.room.id FROM BookingRoom br
              WHERE br.booking.checkInDate  < :checkOut
                AND br.booking.checkOutDate > :checkIn
                AND br.booking.status IN ('PENDING', 'CONFIRMED')
          )
        """)
    List<Room> findAvailableRooms(
            @Param("categoryId") Long categoryId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    /**
     * Count available rooms for a category in a date range.
     * Used by AvailabilityService to build AvailabilityResponseDTO.
     */
    @Query("""
        SELECT COUNT(r) FROM Room r
        WHERE r.roomCategory.id = :categoryId
          AND r.isActive = true
          AND r.currentStatus IN ('AVAILABLE', 'CLEANING')
          AND r.id NOT IN (
              SELECT br.room.id FROM BookingRoom br
              WHERE br.booking.checkInDate  < :checkOut
                AND br.booking.checkOutDate > :checkIn
                AND br.booking.status IN ('PENDING', 'CONFIRMED')
          )
        """)
    long countAvailableRooms(
            @Param("categoryId") Long categoryId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}
