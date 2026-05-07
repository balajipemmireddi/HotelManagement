package com.Hotel.dto.availability;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for GET /api/availability/search
 *
 * Returned per RoomCategory — tells the frontend how many rooms
 * of each type are available for the requested date range.
 *
 * Frontend Room Selection page uses availableCount to:
 *  - Show "X rooms left" badge
 *  - Disable quantity selector when availableCount = 0
 *  - Calculate total price (basePrice × nights × quantity)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityResponseDTO {

    private Long categoryId;
    private String categoryName;
    private String bedType;
    private String description;
    private String imageUrl;
    private Double basePrice;
    private Integer maxOccupancy;

    // Core availability field — count of rooms NOT booked for the date range
    private Integer availableCount;

    // Convenience fields for frontend display
    private Long hotelId;
    private String hotelName;
}
