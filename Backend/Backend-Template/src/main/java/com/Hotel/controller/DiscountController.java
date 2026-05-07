package com.Hotel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Hotel.dto.discount.DiscountResponseDTO;
import com.Hotel.dto.discount.DiscountValidationDTO;
import com.Hotel.service.DiscountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 7 — Discount Controller.
 *
 * Handles discount code validation endpoint.
 * Public endpoint (no authentication required for validation).
 */
@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
@Slf4j
public class DiscountController {

    private final DiscountService discountService;

    /**
     * POST /api/discounts/validate — Validate a discount code.
     *
     * Request body:
     * {
     *   "code": "SUMMER2026",
     *   "bookingAmount": 500.00
     * }
     *
     * Response (valid code):
     * {
     *   "valid": true,
     *   "code": "SUMMER2026",
     *   "message": "Discount code applied successfully",
     *   "discountType": "PERCENTAGE",
     *   "discountValue": 15.0,
     *   "discountAmount": 75.00,
     *   "originalAmount": 500.00,
     *   "finalAmount": 425.00
     * }
     *
     * Response (invalid code):
     * {
     *   "valid": false,
     *   "code": "INVALID",
     *   "message": "Invalid discount code"
     * }
     *
     * @param request Discount validation request
     * @return DiscountResponseDTO with validation result
     */
    @PostMapping("/validate")
    public ResponseEntity<DiscountResponseDTO> validateDiscount(
            @Valid @RequestBody DiscountValidationDTO request) {

        log.info("Received discount validation request for code: {}", request.getCode());

        DiscountResponseDTO response = discountService.validateDiscount(request);

        return ResponseEntity.ok(response);
    }
}
