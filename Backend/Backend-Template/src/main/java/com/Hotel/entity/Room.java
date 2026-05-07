package com.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many rooms belong to one room category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_category_id", nullable = false)
    private RoomCategory roomCategory;

    @Column(nullable = false)
    private String roomNumber;

    private Integer floor;

    @Builder.Default
    private Boolean isActive = true;

    /**
     * Current physical status of the room.
     * AVAILABLE  — ready to be booked
     * OCCUPIED   — guest currently checked in
     * MAINTENANCE — under repair, not bookable
     * CLEANING   — being cleaned between stays
     *
     * NOTE: Availability for booking is determined by the Booking table
     * (Phase 3 — teammate's AvailabilityService), not just this status.
     * This field tracks the physical/operational state.
     */
    public enum RoomStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RoomStatus currentStatus = RoomStatus.AVAILABLE;
}
