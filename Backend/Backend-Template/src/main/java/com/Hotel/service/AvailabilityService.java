package com.Hotel.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Hotel.dto.availability.AvailabilityResponseDTO;
import com.Hotel.dto.availability.CalendarResponseDTO;
import com.Hotel.dto.availability.DailyAvailabilityDTO;
import com.Hotel.dto.availability.DailyAvailabilityDTO.CategoryDailySnapshot;
import com.Hotel.entity.Hotel;
import com.Hotel.entity.RoomCategory;
import com.Hotel.exception.ResourceNotFoundException;
import com.Hotel.repository.HotelRepo;
import com.Hotel.repository.RoomCategoryRepo;
import com.Hotel.repository.RoomRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final RoomRepo roomRepo;
    private final RoomCategoryRepo roomCategoryRepo;
    private final HotelRepo hotelRepo;

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3 — Date-range availability search
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/availability/search?hotelId=X&checkIn=Y&checkOut=Z&guests=N
     *
     * Returns all room categories for the hotel with their available room count
     * for the requested date range. Categories with 0 available rooms are still
     * returned so the frontend can show "Sold Out" badge.
     *
     * Filters by maxOccupancy >= guests so only suitable categories are shown.
     */
    public List<AvailabilityResponseDTO> searchAvailability(
            Long hotelId,
            LocalDate checkIn,
            LocalDate checkOut,
            int guests) {

        validateDates(checkIn, checkOut);

        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + hotelId));

        List<RoomCategory> categories = roomCategoryRepo.findByHotelId(hotelId);

        return categories.stream()
                .filter(cat -> cat.getMaxOccupancy() >= guests)
                .map(cat -> {
                    long availableCount = roomRepo.countAvailableRooms(
                            cat.getId(), checkIn, checkOut);

                    return AvailabilityResponseDTO.builder()
                            .categoryId(cat.getId())
                            .categoryName(cat.getCategoryName())
                            .bedType(cat.getBedType())
                            .description(cat.getDescription())
                            .imageUrl(cat.getImageUrl())
                            .basePrice(cat.getBasePrice())
                            .maxOccupancy(cat.getMaxOccupancy())
                            .availableCount((int) availableCount)
                            .hotelId(hotel.getId())
                            .hotelName(hotel.getName())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Used internally by BookingService (Phase 5) to get bookable room IDs.
     * Returns IDs of rooms NOT booked for the given date range in a category.
     */
    public List<Long> getAvailableRoomIds(Long categoryId, LocalDate checkIn, LocalDate checkOut) {
        return roomRepo.findAvailableRooms(categoryId, checkIn, checkOut)
                .stream()
                .map(room -> room.getId())
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 4 — Availability calendar
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/availability/hotel/{hotelId}/calendar?from=2026-06-01&to=2026-06-30
     *
     * Returns a day-by-day availability breakdown for a hotel over a date range.
     * Default range: today → today + 30 days (if no params provided).
     *
     * For each day, checks availability as a 1-night stay (checkIn=day, checkOut=day+1).
     * This gives an accurate picture of which rooms are occupied on each night.
     *
     * Frontend calendar uses this to:
     *  - Colour-code dates (green/yellow/red)
     *  - Block out fully-booked dates in the date picker
     *  - Show per-category counts on hover
     */
    public CalendarResponseDTO getAvailabilityCalendar(Long hotelId, LocalDate from, LocalDate to) {

        // Default to next 30 days if not specified
        if (from == null) from = LocalDate.now();
        if (to == null)   to = from.plusDays(30);

        // Validate range
        if (!to.isAfter(from)) {
            throw new IllegalArgumentException("'to' date must be after 'from' date");
        }
        if (to.isAfter(from.plusDays(90))) {
            throw new IllegalArgumentException("Calendar range cannot exceed 90 days");
        }

        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + hotelId));

        List<RoomCategory> categories = roomCategoryRepo.findByHotelId(hotelId);

        // Build one DailyAvailabilityDTO per day in the range
        List<DailyAvailabilityDTO> days = new ArrayList<>();
        LocalDate cursor = from;

        while (!cursor.isAfter(to.minusDays(1))) {
            LocalDate nextDay = cursor.plusDays(1);
            days.add(buildDailySnapshot(cursor, nextDay, categories));
            cursor = nextDay;
        }

        return CalendarResponseDTO.builder()
                .hotelId(hotel.getId())
                .hotelName(hotel.getName())
                .fromDate(from)
                .toDate(to)
                .totalDays(days.size())
                .days(days)
                .build();
    }

    /**
     * Legacy method kept for backward compatibility with Phase 3 controller endpoint.
     * GET /api/availability/hotel/{hotelId} → next 30 days summary (flat list).
     */
    public List<AvailabilityResponseDTO> getHotelAvailabilityNext30Days(Long hotelId) {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);
        return searchAvailability(hotelId, today, thirtyDaysLater, 1);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Builds a DailyAvailabilityDTO for a single night (checkIn → checkOut).
     * Queries each category's available room count for that 1-night window.
     */
    private DailyAvailabilityDTO buildDailySnapshot(
            LocalDate checkIn,
            LocalDate checkOut,
            List<RoomCategory> categories) {

        List<CategoryDailySnapshot> snapshots = new ArrayList<>();
        int minAvailable = Integer.MAX_VALUE;

        for (RoomCategory cat : categories) {
            int count = (int) roomRepo.countAvailableRooms(cat.getId(), checkIn, checkOut);
            snapshots.add(CategoryDailySnapshot.builder()
                    .categoryId(cat.getId())
                    .categoryName(cat.getCategoryName())
                    .basePrice(cat.getBasePrice())
                    .availableCount(count)
                    .soldOut(count == 0)
                    .build());

            if (count < minAvailable) minAvailable = count;
        }

        // If no categories exist, minAvailable stays MAX_VALUE — treat as 0
        if (minAvailable == Integer.MAX_VALUE) minAvailable = 0;

        boolean fullyBooked = snapshots.stream().allMatch(CategoryDailySnapshot::isSoldOut);

        return DailyAvailabilityDTO.builder()
                .date(checkIn)
                .fullyBooked(fullyBooked)
                .minAvailableRooms(minAvailable)
                .categories(snapshots)
                .build();
    }

    /**
     * Validates that checkOut is after checkIn and checkIn is not in the past.
     */
    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
        if (checkIn.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }
    }
}
