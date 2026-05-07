package com.Hotel.dto.room;

import lombok.Data;

/**
 * Response DTO for RoomCategory.
 * Used by:
 *  - GET /api/hotels/{id}/rooms  (frontend Room Selection page)
 *  - POST /api/room-categories   (admin create response)
 *
 * Includes hotelId so the frontend can link back without a nested object.
 * Teammate's AvailabilityService (Phase 3) will extend this with
 * availableCount — they add their own AvailabilityResponseDTO on top.
 */
@Data
public class RoomCategoryResponseDTO {

    private Long id;
    private Long hotelId;
    private String hotelName;       // convenience field for frontend display
    private String categoryName;
    private Double basePrice;
    private Integer maxOccupancy;
    private String bedType;
    private String description;
    private String imageUrl;
}
