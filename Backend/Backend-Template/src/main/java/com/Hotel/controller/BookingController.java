package com.Hotel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Hotel.dto.booking.BookingRequestDTO;
import com.Hotel.dto.booking.BookingResponseDTO;
import com.Hotel.entity.UserPrincipal;
import com.Hotel.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 5 — Booking Controller.
 *
 * Handles booking creation endpoint.
 * Requires authentication (JWT token).
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    /**
     * POST /api/bookings — Create a new booking.
     *
     * Request body:
     * {
     *   "hotelId": 1,
     *   "checkInDate": "2026-06-15",
     *   "checkOutDate": "2026-06-18",
     *   "rooms": [
     *     { "categoryId": 3, "quantity": 2 },
     *     { "categoryId": 5, "quantity": 1 }
     *   ],
     *   "specialRequests": "Late check-in"
     * }
     *
     * Response:
     * {
     *   "bookingReference": "BK-20260507-A3F9",
     *   "status": "PENDING",
     *   "totalAmount": 450.00,
     *   "finalAmount": 450.00,
     *   "bookedRooms": [...]
     * }
     *
     * @param request Booking details
     * @param authentication Spring Security authentication (contains user ID)
     * @return BookingResponseDTO with booking reference and details
     */
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            Authentication authentication) {

        // Extract user ID from JWT token
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();

        log.info("Received booking request from user {} for hotel {}", userId, request.getHotelId());

        BookingResponseDTO response = bookingService.createBooking(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
