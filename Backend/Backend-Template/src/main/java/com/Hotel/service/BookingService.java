package com.Hotel.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Hotel.dto.booking.BookingRequestDTO;
import com.Hotel.dto.booking.BookingResponseDTO;
import com.Hotel.entity.Booking;
import com.Hotel.entity.BookingRoom;
import com.Hotel.entity.Hotel;
import com.Hotel.entity.Room;
import com.Hotel.entity.RoomCategory;
import com.Hotel.entity.Users;
import com.Hotel.exception.ResourceNotFoundException;
import com.Hotel.mapper.BookingMapper;
import com.Hotel.repository.BookingRepo;
import com.Hotel.repository.BookingRoomRepo;
import com.Hotel.repository.HotelRepo;
import com.Hotel.repository.RoomCategoryRepo;
import com.Hotel.repository.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 5-6 — Booking Service.
 *
 * Handles booking creation, retrieval, and user history.
 * Ensures atomic transactions and proper authorization.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepo bookingRepo;
    private final BookingRoomRepo bookingRoomRepo;
    private final HotelRepo hotelRepo;
    private final RoomCategoryRepo roomCategoryRepo;
    private final UserRepo userRepo;
    private final AvailabilityService availabilityService;
    private final BookingMapper bookingMapper;
    private final DiscountService discountService;

    private final Random random = new Random();

    /**
     * POST /api/bookings — Create a new booking.
     *
     * ATOMIC TRANSACTION:
     * 1. Validate hotel, dates, and user
     * 2. For each room category request:
     *    - Check availability
     *    - Allocate specific rooms
     * 3. Calculate pricing
     * 4. Create Booking entity
     * 5. Create BookingRoom entries
     * 6. Save all (or rollback on failure)
     *
     * @param request Booking details (hotel, dates, rooms)
     * @param userId  Authenticated user ID (from JWT token)
     * @return BookingResponseDTO with booking reference and details
     */
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, Long userId) {
        log.info("Creating booking for user {} at hotel {}", userId, request.getHotelId());

        // ─────────────────────────────────────────────────────────────────────
        // 1. Validate entities and dates
        // ─────────────────────────────────────────────────────────────────────
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found or inactive with id: " + request.getHotelId()));

        validateBookingDates(request.getCheckInDate(), request.getCheckOutDate());

        int totalNights = (int) ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        // ─────────────────────────────────────────────────────────────────────
        // 2. Allocate rooms for each category request
        // ─────────────────────────────────────────────────────────────────────
        List<RoomAllocation> allocations = new ArrayList<>();

        for (BookingRequestDTO.RoomRequest roomReq : request.getRooms()) {
            RoomCategory category = roomCategoryRepo.findById(roomReq.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Room category not found with id: " + roomReq.getCategoryId()));

            // Verify category belongs to the requested hotel
            if (!category.getHotel().getId().equals(request.getHotelId())) {
                throw new IllegalArgumentException(
                        "Room category " + roomReq.getCategoryId() +
                        " does not belong to hotel " + request.getHotelId());
            }

            // Get available room IDs for this category and date range
            List<Long> availableRoomIds = availabilityService.getAvailableRoomIds(
                    roomReq.getCategoryId(),
                    request.getCheckInDate(),
                    request.getCheckOutDate()
            );

            // Check if enough rooms are available
            if (availableRoomIds.size() < roomReq.getQuantity()) {
                throw new IllegalStateException(
                        "Insufficient availability for category '" + category.getCategoryName() +
                        "'. Requested: " + roomReq.getQuantity() +
                        ", Available: " + availableRoomIds.size());
            }

            // Allocate the first N available rooms
            List<Long> selectedRoomIds = availableRoomIds.subList(0, roomReq.getQuantity());
            allocations.add(new RoomAllocation(category, selectedRoomIds));
        }

        // ─────────────────────────────────────────────────────────────────────
        // 3. Calculate total pricing
        // ─────────────────────────────────────────────────────────────────────
        double totalAmount = 0.0;

        for (RoomAllocation allocation : allocations) {
            double categoryTotal = allocation.category.getBasePrice() *
                                   totalNights *
                                   allocation.roomIds.size();
            totalAmount += categoryTotal;
        }

        // ─────────────────────────────────────────────────────────────────────
        // 3.1. PHASE 7: Apply discount code if provided
        // ─────────────────────────────────────────────────────────────────────
        double discountAmount = 0.0;
        String appliedDiscountCode = null;

        if (request.getDiscountCode() != null && !request.getDiscountCode().trim().isEmpty()) {
            String code = request.getDiscountCode().trim();
            log.info("Applying discount code: {}", code);

            com.Hotel.entity.DiscountCode discountCode = discountService.getDiscountCodeByCode(code);

            if (discountCode != null && discountCode.isValid()) {
                // Check minimum booking amount
                if (discountCode.getMinBookingAmount() == null ||
                    totalAmount >= discountCode.getMinBookingAmount()) {

                    discountAmount = discountCode.calculateDiscount(totalAmount);
                    appliedDiscountCode = discountCode.getCode();

                    log.info("Discount code {} applied. Discount: ${}", code, discountAmount);
                } else {
                    log.warn("Booking amount {} below minimum {} for code: {}",
                            totalAmount, discountCode.getMinBookingAmount(), code);
                    throw new IllegalArgumentException(
                            String.format("Minimum booking amount of $%.2f required for discount code %s",
                                    discountCode.getMinBookingAmount(), code)
                    );
                }
            } else {
                log.warn("Invalid or expired discount code: {}", code);
                throw new IllegalArgumentException("Invalid or expired discount code: " + code);
            }
        }

        double finalAmount = totalAmount - discountAmount;

        // ─────────────────────────────────────────────────────────────────────
        // 4. Create Booking entity
        // ─────────────────────────────────────────────────────────────────────
        String bookingReference = generateBookingReference();

        Booking booking = Booking.builder()
                .user(user)
                .hotel(hotel)
                .bookingReference(bookingReference)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .totalNights(totalNights)
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .status(Booking.BookingStatus.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .specialRequests(request.getSpecialRequests())
                .build();

        booking = bookingRepo.save(booking);
        log.info("Booking created with reference: {}", bookingReference);

        // ─────────────────────────────────────────────────────────────────────
        // 4.1. PHASE 7: Increment discount code usage if applied
        // ─────────────────────────────────────────────────────────────────────
        if (appliedDiscountCode != null) {
            discountService.applyDiscountCode(appliedDiscountCode);
        }

        // ─────────────────────────────────────────────────────────────────────
        // 5. Create BookingRoom entries (lock specific rooms)
        // ─────────────────────────────────────────────────────────────────────
        List<BookingRoom> bookingRooms = new ArrayList<>();

        for (RoomAllocation allocation : allocations) {
            for (Long roomId : allocation.roomIds) {
                Room room = new Room();
                room.setId(roomId); // Lazy-loaded reference

                BookingRoom bookingRoom = BookingRoom.builder()
                        .booking(booking)
                        .room(room)
                        .roomCategory(allocation.category)
                        .pricePerNight(allocation.category.getBasePrice())
                        .numberOfNights(totalNights)
                        .build();

                bookingRooms.add(bookingRoom);
            }
        }

        bookingRoomRepo.saveAll(bookingRooms);
        booking.setBookingRooms(bookingRooms); // Update bidirectional relationship

        log.info("Allocated {} rooms for booking {}", bookingRooms.size(), bookingReference);

        // ─────────────────────────────────────────────────────────────────────
        // 6. Return response DTO
        // ─────────────────────────────────────────────────────────────────────
        return bookingMapper.toResponseDTO(booking);
    }

    /**
     * Generates a unique booking reference in format: BK-YYYYMMDD-XXXX
     * Example: BK-20260507-A3F9
     *
     * Retries up to 5 times if collision occurs (extremely rare).
     */
    private String generateBookingReference() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int maxRetries = 5;

        for (int i = 0; i < maxRetries; i++) {
            String randomSuffix = generateRandomAlphanumeric(4);
            String reference = "BK-" + datePrefix + "-" + randomSuffix;

            if (!bookingRepo.existsByBookingReference(reference)) {
                return reference;
            }
        }

        // Fallback: append timestamp if all retries fail
        String timestamp = String.valueOf(System.currentTimeMillis() % 10000);
        return "BK-" + datePrefix + "-" + timestamp;
    }

    /**
     * Generates a random alphanumeric string (uppercase).
     */
    private String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * Validates booking dates:
     * - Check-out must be after check-in
     * - Check-in cannot be in the past
     * - Maximum stay duration: 30 nights
     */
    private void validateBookingDates(LocalDate checkIn, LocalDate checkOut) {
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        if (checkIn.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights > 30) {
            throw new IllegalArgumentException("Maximum stay duration is 30 nights");
        }
    }

    /**
     * Internal helper class to track room allocations during booking creation.
     */
    private static class RoomAllocation {
        final RoomCategory category;
        final List<Long> roomIds;

        RoomAllocation(RoomCategory category, List<Long> roomIds) {
            this.category = category;
            this.roomIds = roomIds;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 6 — Booking Retrieval Methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/bookings/user/{userId} — Retrieve all bookings for a user.
     *
     * Returns all bookings (past, upcoming, cancelled) ordered by creation date.
     * Enforces authorization: users can only view their own bookings.
     *
     * @param userId User ID whose bookings to retrieve
     * @param authenticatedUserId ID of the currently authenticated user
     * @return List of BookingResponseDTO
     * @throws com.Hotel.exception.UnauthorizedResourceAccessException if user tries to access another user's bookings
     */
    public List<BookingResponseDTO> getUserBookings(Long userId, Long authenticatedUserId) {
        log.info("Retrieving bookings for user {}", userId);

        // Authorization check: users can only view their own bookings
        if (!userId.equals(authenticatedUserId)) {
            throw new com.Hotel.exception.UnauthorizedResourceAccessException(
                    "You are not authorized to view bookings for user " + userId);
        }

        // Retrieve all bookings for the user
        List<Booking> bookings = bookingRepo.findByUserId(userId);

        log.info("Found {} bookings for user {}", bookings.size(), userId);

        // Convert to DTOs
        return bookings.stream()
                .map(bookingMapper::toResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * GET /api/bookings/{id} — Retrieve full details of a specific booking.
     *
     * Returns complete booking information including all rooms and pricing.
     * Enforces authorization: users can only view their own bookings.
     *
     * @param bookingId Booking ID to retrieve
     * @param authenticatedUserId ID of the currently authenticated user
     * @return BookingResponseDTO with full details
     * @throws ResourceNotFoundException if booking not found
     * @throws com.Hotel.exception.UnauthorizedResourceAccessException if user tries to access another user's booking
     */
    public BookingResponseDTO getBookingById(Long bookingId, Long authenticatedUserId) {
        log.info("Retrieving booking details for booking {}", bookingId);

        // Retrieve booking
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        // Authorization check: users can only view their own bookings
        if (!booking.getUser().getId().equals(authenticatedUserId)) {
            throw new com.Hotel.exception.UnauthorizedResourceAccessException(
                    "You are not authorized to view this booking");
        }

        log.info("Retrieved booking {} for user {}", booking.getBookingReference(), authenticatedUserId);

        // Convert to DTO
        return bookingMapper.toResponseDTO(booking);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 8 — Booking Cancellation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * PUT /api/bookings/{id}/cancel — Cancel an existing booking.
     *
     * Business Rules:
     * 1. Only PENDING or CONFIRMED bookings can be cancelled
     * 2. User must own the booking
     * 3. Updates status to CANCELLED
     * 4. Records cancellation timestamp
     * 5. Rooms are automatically released (availability query excludes CANCELLED bookings)
     *
     * @param bookingId Booking ID to cancel
     * @param authenticatedUserId ID of the currently authenticated user
     * @return BookingResponseDTO with updated status
     * @throws ResourceNotFoundException if booking not found
     * @throws com.Hotel.exception.UnauthorizedResourceAccessException if user doesn't own booking
     * @throws IllegalStateException if booking cannot be cancelled
     */
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, Long authenticatedUserId) {
        log.info("Cancelling booking {} for user {}", bookingId, authenticatedUserId);

        // Retrieve booking
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        // Authorization check: users can only cancel their own bookings
        if (!booking.getUser().getId().equals(authenticatedUserId)) {
            throw new com.Hotel.exception.UnauthorizedResourceAccessException(
                    "You are not authorized to cancel this booking");
        }

        // Business rule: Only PENDING or CONFIRMED bookings can be cancelled
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed booking");
        }

        // Update booking status
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        // Note: Rooms are automatically released because the availability query
        // in RoomRepo.findAvailableRooms() excludes bookings with CANCELLED status.
        // No need to manually delete BookingRoom records.

        booking = bookingRepo.save(booking);

        log.info("Booking {} cancelled successfully. Rooms released for dates {} to {}",
                booking.getBookingReference(),
                booking.getCheckInDate(),
                booking.getCheckOutDate());

        // Convert to DTO
        return bookingMapper.toResponseDTO(booking);
    }
}
