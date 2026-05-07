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
import com.Hotel.service.AvailabilityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    /**
     * GET /api/availability/search?hotelId=1&checkIn=2026-06-01&checkOut=2026-06-05&guests=2
     *
     * Public endpoint — frontend Hotel Details page calls this when user
     * selects dates. Returns all room categories with available room counts.
     *
     * Frontend uses availableCount to:
     *  - Show "X rooms left" or "Sold Out"
     *  - Limit quantity selector max value
     *  - Calculate total price dynamically
     */
    @GetMapping("/search")
    public ResponseEntity<List<AvailabilityResponseDTO>> searchAvailability(
            @RequestParam Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "1") int guests) {

        List<AvailabilityResponseDTO> result =
                availabilityService.searchAvailability(hotelId, checkIn, checkOut, guests);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/availability/hotel/{hotelId}
     *
     * Public endpoint — returns availability for all room categories
     * for the next 30 days. Used by Phase 4 availability calendar.
     */
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<AvailabilityResponseDTO>> getHotelAvailability(
            @PathVariable Long hotelId) {

        List<AvailabilityResponseDTO> result =
                availabilityService.getHotelAvailabilityNext30Days(hotelId);
        return ResponseEntity.ok(result);
    }
}
