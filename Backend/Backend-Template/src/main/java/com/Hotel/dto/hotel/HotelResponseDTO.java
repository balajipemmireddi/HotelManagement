package com.Hotel.dto.hotel;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * Full hotel response — used for GET /api/hotels/{id}
 * Contains all fields the frontend Hotel Details page needs.
 */
@Data
public class HotelResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String country;
    private Integer starRating;
    private String contactEmail;
    private String contactPhone;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
