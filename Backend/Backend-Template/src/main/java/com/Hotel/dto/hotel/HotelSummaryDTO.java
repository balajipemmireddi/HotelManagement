package com.Hotel.dto.hotel;

import lombok.Data;

/**
 * Lightweight hotel summary — used for GET /api/hotels (listing page).
 * Keeps the payload small; frontend HotelCard only needs these fields.
 */
@Data
public class HotelSummaryDTO {

    private Long id;
    private String name;
    private String city;
    private String state;
    private Integer starRating;
    private String imageUrl;
    private Boolean isActive;
}
