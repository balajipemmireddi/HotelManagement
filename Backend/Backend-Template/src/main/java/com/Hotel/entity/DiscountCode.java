package com.Hotel.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 7 — Discount Code entity.
 *
 * Represents promotional discount codes that can be applied to bookings.
 * Supports both percentage-based and fixed-amount discounts.
 */
@Entity
@Table(name = "discount_codes")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique discount code (e.g., "SUMMER2026", "WELCOME10")
    @Column(unique = true, nullable = false)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Type of discount:
     * PERCENTAGE — discountValue is a percentage (e.g., 10 = 10% off)
     * FIXED      — discountValue is a fixed amount (e.g., 50 = $50 off)
     */
    public enum DiscountType {
        PERCENTAGE, FIXED
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    // For PERCENTAGE: value between 0-100 (e.g., 15 = 15% off)
    // For FIXED: absolute amount (e.g., 50.00 = $50 off)
    @Column(nullable = false)
    private Double discountValue;

    // Minimum booking amount required to use this code
    private Double minBookingAmount;

    // Maximum discount amount (useful for percentage discounts)
    // Example: 20% off with maxDiscountAmount = 100 caps discount at $100
    private Double maxDiscountAmount;

    // Number of times this code can be used (null = unlimited)
    private Integer usageLimit;

    // Number of times this code has been used
    @Builder.Default
    private Integer usageCount = 0;

    // Valid from date (null = valid immediately)
    private LocalDate validFrom;

    // Valid until date (null = no expiry)
    private LocalDate validUntil;

    // Whether the code is currently active
    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    /**
     * Check if the discount code is currently valid.
     *
     * @return true if active, not expired, and usage limit not reached
     */
    public boolean isValid() {
        if (!isActive) return false;

        LocalDate today = LocalDate.now();

        // Check valid from date
        if (validFrom != null && today.isBefore(validFrom)) {
            return false;
        }

        // Check valid until date
        if (validUntil != null && today.isAfter(validUntil)) {
            return false;
        }

        // Check usage limit
        if (usageLimit != null && usageCount >= usageLimit) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount for a given booking amount.
     *
     * @param bookingAmount Total booking amount before discount
     * @return Discount amount to subtract
     */
    public double calculateDiscount(double bookingAmount) {
        double discount;

        if (discountType == DiscountType.PERCENTAGE) {
            discount = bookingAmount * (discountValue / 100.0);
        } else {
            discount = discountValue;
        }

        // Apply max discount cap if set
        if (maxDiscountAmount != null && discount > maxDiscountAmount) {
            discount = maxDiscountAmount;
        }

        // Discount cannot exceed booking amount
        if (discount > bookingAmount) {
            discount = bookingAmount;
        }

        return discount;
    }

    /**
     * Increment usage count when code is applied to a booking.
     */
    public void incrementUsage() {
        this.usageCount++;
    }
}
