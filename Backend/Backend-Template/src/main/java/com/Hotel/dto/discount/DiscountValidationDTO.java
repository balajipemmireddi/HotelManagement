package com.Hotel.dto.discount;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 7 — Discount validation request DTO.
 *
 * Client sends this to validate a discount code before applying it to a booking.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountValidationDTO {

    @NotBlank(message = "Discount code is required")
    private String code;

    @NotNull(message = "Booking amount is required")
    @Positive(message = "Booking amount must be positive")
    private Double bookingAmount;
}
