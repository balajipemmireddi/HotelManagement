package com.Hotel.dto.booking;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 5 — Booking creation response DTO.
 *
 * Returned after successful booking creation.
 * Contains booking reference, pricing breakdown, and room details.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;
    private String bookingReference;
    private String status;
    private String paymentStatus;

    private Long hotelId;
    private String hotelName;
    private String hotelAddress;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer totalNights;

    private Double totalAmount;
    private Double discountAmount;
    private Double finalAmount;

    private String specialRequests;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<BookedRoomDTO> bookedRooms;

    /**
     * Nested DTO for each room in the booking.
     * Shows which specific room was assigned and its pricing.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookedRoomDTO {
        private Long roomId;
        private String roomNumber;
        private Long categoryId;
        private String categoryName;
        private Double pricePerNight;
        private Integer numberOfNights;
        private Double subtotal; // pricePerNight * numberOfNights
    }
}
