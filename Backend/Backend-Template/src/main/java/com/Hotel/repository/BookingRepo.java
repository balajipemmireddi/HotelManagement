package com.Hotel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.Booking;
import com.Hotel.entity.Booking.BookingStatus;

/**
 * PHASE 5 — Booking repository.
 *
 * Handles booking persistence and retrieval.
 * Phase 6 will add user-specific queries.
 */
@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    /**
     * Find booking by unique reference code.
     * Used for booking lookup and confirmation pages.
     */
    Optional<Booking> findByBookingReference(String bookingReference);

    /**
     * Check if a booking reference already exists.
     * Used during reference generation to ensure uniqueness.
     */
    boolean existsByBookingReference(String bookingReference);

    /**
     * PHASE 6 — Find all bookings for a specific user.
     * Ordered by creation date (newest first).
     */
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findByUserId(@Param("userId") Long userId);

    /**
     * PHASE 6 — Find user's bookings filtered by status.
     * Example: show only upcoming (CONFIRMED) bookings.
     */
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = :status ORDER BY b.createdAt DESC")
    List<Booking> findByUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") BookingStatus status
    );

    /**
     * PHASE 11 — Admin: Find all bookings for a hotel.
     * Used for hotel-specific reports and occupancy tracking.
     */
    @Query("SELECT b FROM Booking b WHERE b.hotel.id = :hotelId ORDER BY b.createdAt DESC")
    List<Booking> findByHotelId(@Param("hotelId") Long hotelId);
}
