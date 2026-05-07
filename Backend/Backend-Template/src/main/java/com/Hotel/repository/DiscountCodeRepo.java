package com.Hotel.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.DiscountCode;

/**
 * PHASE 7 — Discount Code repository.
 *
 * Handles discount code persistence and retrieval.
 */
@Repository
public interface DiscountCodeRepo extends JpaRepository<DiscountCode, Long> {

    /**
     * Find discount code by code string (case-insensitive).
     * Used for validation during booking.
     */
    @Query("SELECT d FROM DiscountCode d WHERE UPPER(d.code) = UPPER(:code)")
    Optional<DiscountCode> findByCodeIgnoreCase(@Param("code") String code);

    /**
     * Check if a discount code exists (case-insensitive).
     * Used during code creation to prevent duplicates.
     */
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM DiscountCode d WHERE UPPER(d.code) = UPPER(:code)")
    boolean existsByCodeIgnoreCase(@Param("code") String code);

    /**
     * Find all active discount codes.
     * Used for admin listing of available promotions.
     */
    List<DiscountCode> findByIsActiveTrue();

    /**
     * Find all currently valid discount codes.
     * Active, not expired, and usage limit not reached.
     */
    @Query("""
        SELECT d FROM DiscountCode d
        WHERE d.isActive = true
          AND (d.validFrom IS NULL OR d.validFrom <= :today)
          AND (d.validUntil IS NULL OR d.validUntil >= :today)
          AND (d.usageLimit IS NULL OR d.usageCount < d.usageLimit)
        """)
    List<DiscountCode> findAllValidCodes(@Param("today") LocalDate today);

    /**
     * Find expired discount codes.
     * Used for cleanup or archival.
     */
    @Query("SELECT d FROM DiscountCode d WHERE d.validUntil < :today")
    List<DiscountCode> findExpiredCodes(@Param("today") LocalDate today);
}
