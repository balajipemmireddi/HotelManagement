package com.Hotel.dto.availability;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request params for GET /api/availability/search
 * Passed as @RequestParam query parameters, not request body.
 *
 * Example: GET /api/availability/search?hotelId=1&checkIn=2026-06-01&checkOut=2026-06-05&guests=2
 */
@Data
public class AvailabilitySearchRequestDTO {

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOut;

    @Min(value = 1, message = "At least 1 guest required")
    private int guests = 1;
}
