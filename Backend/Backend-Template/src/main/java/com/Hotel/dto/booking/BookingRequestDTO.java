package com.Hotel.dto.booking;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 5 — Booking creation request DTO.
 *
 * Client sends this to POST /api/bookings to create a new booking.
 * Supports multiple room categories with different quantities.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDTO {

    @NotNull(message = "Hotel ID is required")
    @Positive(message = "Hotel ID must be positive")
    private Long hotelId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date cannot be in the past")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    @NotEmpty(message = "At least one room must be requested")
    @Valid
    private List<RoomRequest> rooms;

    private String specialRequests;

    // PHASE 7: Optional discount code
    private String discountCode;

    /**
     * Nested DTO for each room category request.
     * Example: { categoryId: 3, quantity: 2 } → book 2 rooms from category 3.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomRequest {

        @NotNull(message = "Room category ID is required")
        @Positive(message = "Room category ID must be positive")
        private Long categoryId;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
