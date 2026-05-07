package com.Hotel.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Hotel.dto.discount.DiscountResponseDTO;
import com.Hotel.dto.discount.DiscountValidationDTO;
import com.Hotel.entity.DiscountCode;
import com.Hotel.repository.DiscountCodeRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 7 — Discount Service.
 *
 * Handles discount code validation and application logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiscountService {

    private final DiscountCodeRepo discountCodeRepo;

    /**
     * POST /api/discounts/validate — Validate a discount code.
     *
     * Checks if the code exists, is active, not expired, and meets minimum requirements.
     * Returns discount amount and final amount after discount.
     *
     * @param request Discount validation request (code + booking amount)
     * @return DiscountResponseDTO with validation result
     */
    public DiscountResponseDTO validateDiscount(DiscountValidationDTO request) {
        String code = request.getCode().trim().toUpperCase();
        double bookingAmount = request.getBookingAmount();

        log.info("Validating discount code: {} for amount: {}", code, bookingAmount);

        // Find discount code (case-insensitive)
        DiscountCode discountCode = discountCodeRepo.findByCodeIgnoreCase(code)
                .orElse(null);

        if (discountCode == null) {
            log.warn("Discount code not found: {}", code);
            return DiscountResponseDTO.invalid(code, "Invalid discount code");
        }

        // Check if code is active
        if (!discountCode.getIsActive()) {
            log.warn("Discount code is inactive: {}", code);
            return DiscountResponseDTO.invalid(code, "This discount code is no longer active");
        }

        // Check valid from date
        LocalDate today = LocalDate.now();
        if (discountCode.getValidFrom() != null && today.isBefore(discountCode.getValidFrom())) {
            log.warn("Discount code not yet valid: {} (valid from: {})", code, discountCode.getValidFrom());
            return DiscountResponseDTO.invalid(
                    code,
                    "This discount code is not yet valid. Valid from: " + discountCode.getValidFrom()
            );
        }

        // Check valid until date
        if (discountCode.getValidUntil() != null && today.isAfter(discountCode.getValidUntil())) {
            log.warn("Discount code expired: {} (expired on: {})", code, discountCode.getValidUntil());
            return DiscountResponseDTO.invalid(
                    code,
                    "This discount code has expired on " + discountCode.getValidUntil()
            );
        }

        // Check usage limit
        if (discountCode.getUsageLimit() != null &&
            discountCode.getUsageCount() >= discountCode.getUsageLimit()) {
            log.warn("Discount code usage limit reached: {} ({}/{})",
                    code, discountCode.getUsageCount(), discountCode.getUsageLimit());
            return DiscountResponseDTO.invalid(
                    code,
                    "This discount code has reached its usage limit"
            );
        }

        // Check minimum booking amount
        if (discountCode.getMinBookingAmount() != null &&
            bookingAmount < discountCode.getMinBookingAmount()) {
            log.warn("Booking amount {} below minimum {} for code: {}",
                    bookingAmount, discountCode.getMinBookingAmount(), code);
            return DiscountResponseDTO.invalid(
                    code,
                    String.format("Minimum booking amount of $%.2f required for this code",
                            discountCode.getMinBookingAmount())
            );
        }

        // Calculate discount
        double discountAmount = discountCode.calculateDiscount(bookingAmount);
        double finalAmount = bookingAmount - discountAmount;

        log.info("Discount code {} validated successfully. Discount: ${}, Final: ${}",
                code, discountAmount, finalAmount);

        return DiscountResponseDTO.valid(
                discountCode.getCode(),
                discountCode.getDiscountType().name(),
                discountCode.getDiscountValue(),
                discountAmount,
                bookingAmount,
                finalAmount
        );
    }

    /**
     * Apply discount code to a booking (increment usage count).
     * Called by BookingService after successful booking creation.
     *
     * @param code Discount code to apply
     */
    @Transactional
    public void applyDiscountCode(String code) {
        log.info("Applying discount code: {}", code);

        DiscountCode discountCode = discountCodeRepo.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new IllegalArgumentException("Discount code not found: " + code));

        // Increment usage count
        discountCode.incrementUsage();
        discountCodeRepo.save(discountCode);

        log.info("Discount code {} applied. Usage count: {}", code, discountCode.getUsageCount());
    }

    /**
     * Get discount code details by code string.
     * Used internally by BookingService.
     *
     * @param code Discount code
     * @return DiscountCode entity or null if not found
     */
    public DiscountCode getDiscountCodeByCode(String code) {
        return discountCodeRepo.findByCodeIgnoreCase(code).orElse(null);
    }
}
