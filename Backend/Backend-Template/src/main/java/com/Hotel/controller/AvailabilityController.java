package com.Hotel.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Hotel.dto.availability.AvailabilityResponseDTO;
import com.Hotel.dto.availability.CalendarResponseDTO;
import com.Hotel.service.AvailabilityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3 — Date-range search
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/availability/search?hotelId=1&checkIn=2026-06-01&checkOut=2026-06-05&guests=2
     *
     * Public — frontend Hotel Details page calls this when user picks dates.
     * Returns all room categories with available room counts for the range.
     *
     * Frontend uses availableCount to:
     *  - Show "X rooms left" or "Sold Out"
     *  - Cap the quantity selector
     *  - Calculate total price (basePrice × nights × quantity)
     */
    @GetMapping("/search")
    public ResponseEntity<List<AvailabilityResponseDTO>> searchAvailability(
            @RequestParam Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "1") int guests) {

        return ResponseEntity.ok(
                availabilityService.searchAvailability(hotelId, checkIn, checkOut, guests));
    }

    /**
     * GET /api/availability/hotel/{hotelId}
     *
     * Public — legacy flat summary for next 30 days (Phase 3).
     * Returns one AvailabilityResponseDTO per room category.
     */
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<AvailabilityResponseDTO>> getHotelAvailability(
            @PathVariable Long hotelId) {

        return ResponseEntity.ok(
                availabilityService.getHotelAvailabilityNext30Days(hotelId));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 4 — Day-by-day calendar
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/availability/hotel/{hotelId}/calendar
     * GET /api/availability/hotel/{hotelId}/calendar?from=2026-06-01&to=2026-06-30
     *
     * Public — returns a day-by-day availability breakdown.
     * Defaults to today → today+30 days if no params given.
     * Max range: 90 days.
     *
     * Response structure:
     * {
     *   hotelId, hotelName, fromDate, toDate, totalDays,
     *   days: [
     *     {
     *       date: "2026-06-01",
     *       fullyBooked: false,
     *       minAvailableRooms: 3,
     *       categories: [
     *         { categoryId, categoryName, basePrice, availableCount, soldOut }
     *       ]
     *     },
     *     ...
     *   ]
     * }
     *
     * Frontend calendar uses:
     *  - fullyBooked → disable date cell, show red
     *  - minAvailableRooms < threshold → show yellow warning
     *  - categories → tooltip on hover showing per-type counts
     */
    @GetMapping("/hotel/{hotelId}/calendar")
    public ResponseEntity<CalendarResponseDTO> getAvailabilityCalendar(
            @PathVariable Long hotelId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return ResponseEntity.ok(
                availabilityService.getAvailabilityCalendar(hotelId, from, to));
    }
}
