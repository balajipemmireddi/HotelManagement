package com.Hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.BookingRoom;

/**
 * PHASE 5 — BookingRoom repository.
 *
 * Manages the junction table between Booking and Room.
 * Each record represents one room assigned to a booking.
 */
@Repository
public interface BookingRoomRepo extends JpaRepository<BookingRoom, Long> {

    /**
     * Find all room assignments for a specific booking.
     * Used when displaying booking details (Phase 6).
     */
    @Query("SELECT br FROM BookingRoom br WHERE br.booking.id = :bookingId")
    List<BookingRoom> findByBookingId(@Param("bookingId") Long bookingId);

    /**
     * Find all bookings that include a specific room.
     * Used for room history tracking (Phase 11 — admin features).
     */
    @Query("SELECT br FROM BookingRoom br WHERE br.room.id = :roomId ORDER BY br.booking.checkInDate DESC")
    List<BookingRoom> findByRoomId(@Param("roomId") Long roomId);
}
