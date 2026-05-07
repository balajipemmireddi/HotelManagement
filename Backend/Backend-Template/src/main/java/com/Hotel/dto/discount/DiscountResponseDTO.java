package com.Hotel.dto.discount;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 7 — Discount validation response DTO.
 *
 * Returned after validating a discount code.
 * Shows the discount amount and final amount after discount.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountResponseDTO {

    private boolean valid;
    private String code;
    private String message;

    // Discount details (only if valid)
    private String discountType; // "PERCENTAGE" or "FIXED"
    private Double discountValue; // Original value (e.g., 15 for 15% or 50 for $50)
    private Double discountAmount; // Actual discount amount calculated
    private Double originalAmount; // Booking amount before discount
    private Double finalAmount; // Booking amount after discount

    /**
     * Factory method for invalid discount code response.
     */
    public static DiscountResponseDTO invalid(String code, String message) {
        return DiscountResponseDTO.builder()
                .valid(false)
                .code(code)
                .message(message)
                .build();
    }

    /**
     * Factory method for valid discount code response.
     */
    public static DiscountResponseDTO valid(
            String code,
            String discountType,
            Double discountValue,
            Double discountAmount,
            Double originalAmount,
            Double finalAmount) {
        return DiscountResponseDTO.builder()
                .valid(true)
                .code(code)
                .message("Discount code applied successfully")
                .discountType(discountType)
                .discountValue(discountValue)
                .discountAmount(discountAmount)
                .originalAmount(originalAmount)
                .finalAmount(finalAmount)
                .build();
    }
}
