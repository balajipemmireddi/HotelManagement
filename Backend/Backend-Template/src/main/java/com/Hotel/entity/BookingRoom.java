package com.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Junction table linking a Booking to specific Rooms.
 * Stores price snapshot at booking time so price changes don't
 * affect existing bookings.
 *
 * Stub created in Phase 3 so the availability JPQL query compiles.
 * Full usage in Phase 5 (BookingService).
 */
@Entity
@Table(name = "booking_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    // Snapshot of room category at booking time
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_category_id", nullable = false)
    private RoomCategory roomCategory;

    // Price snapshot — locked at booking time, immune to future price changes
    @Column(nullable = false)
    private Double pricePerNight;

    @Column(nullable = false)
    private Integer numberOfNights;
}
