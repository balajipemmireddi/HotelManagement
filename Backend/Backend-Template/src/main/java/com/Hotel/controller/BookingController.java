package com.Hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
 * PHASE 5-6 — Booking Controller.
 *
 * Handles booking creation, retrieval, and user history.
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

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 6 — Booking Retrieval Endpoints
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/bookings/user/{userId} — List all bookings for a user.
     *
     * Returns all bookings (past, upcoming, cancelled) ordered by creation date.
     * Users can only view their own bookings (enforced by service layer).
     *
     * Response:
     * [
     *   {
     *     "bookingReference": "BK-20260507-A3F9",
     *     "status": "CONFIRMED",
     *     "checkInDate": "2026-06-15",
     *     "hotelName": "Grand Plaza Hotel",
     *     ...
     *   }
     * ]
     *
     * @param userId User ID from path
     * @param authentication Spring Security authentication
     * @return List of BookingResponseDTO
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(
            @PathVariable Long userId,
            Authentication authentication) {

        // Extract authenticated user ID
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long authenticatedUserId = userPrincipal.getId();

        log.info("User {} requesting bookings for user {}", authenticatedUserId, userId);

        List<BookingResponseDTO> bookings = bookingService.getUserBookings(userId, authenticatedUserId);

        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/bookings/{id} — Get full details of a specific booking.
     *
     * Returns complete booking information including all rooms and pricing.
     * Users can only view their own bookings (enforced by service layer).
     *
     * Response:
     * {
     *   "id": 1,
     *   "bookingReference": "BK-20260507-A3F9",
     *   "status": "CONFIRMED",
     *   "hotelName": "Grand Plaza Hotel",
     *   "bookedRooms": [
     *     {
     *       "roomNumber": "201",
     *       "categoryName": "Deluxe King",
     *       "pricePerNight": 150.00,
     *       "subtotal": 450.00
     *     }
     *   ],
     *   ...
     * }
     *
     * @param id Booking ID
     * @param authentication Spring Security authentication
     * @return BookingResponseDTO with full details
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        // Extract authenticated user ID
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long authenticatedUserId = userPrincipal.getId();

        log.info("User {} requesting booking details for booking {}", authenticatedUserId, id);

        BookingResponseDTO booking = bookingService.getBookingById(id, authenticatedUserId);

        return ResponseEntity.ok(booking);
    }
}
