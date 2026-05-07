package com.Hotel.dto.room;

import lombok.Data;

/**
 * Response DTO for individual Room.
 * Used by admin endpoints and teammate's AvailabilityService (Phase 3)
 * to query room counts per category.
 *
 * Exposes roomCategoryId (not the full object) to keep the payload flat.
 */
@Data
public class RoomResponseDTO {

    private Long id;
    private Long roomCategoryId;
    private String categoryName;    // snapshot for display
    private String roomNumber;
    private Integer floor;
    private Boolean isActive;
    private String currentStatus;   // AVAILABLE / OCCUPIED / MAINTENANCE / CLEANING
}
