package com.Hotel.dto.hotel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 9 — Advanced hotel search request DTO.
 *
 * Supports multiple filter criteria for hotel search.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelSearchDTO {

    private String city;
    private Integer minStarRating;
    private Integer maxStarRating;
    private Double minPrice;
    private Double maxPrice;
    private String amenities; // Comma-separated (e.g., "wifi,pool,gym")
    private String name; // Partial name search
}
