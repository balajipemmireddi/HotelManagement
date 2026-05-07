package com.Hotel.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Hotel.dto.availability.AvailabilityResponseDTO;
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

    /**
     * GET /api/availability/search?hotelId=X&checkIn=Y&checkOut=Z&guests=N
     *
     * Returns all room categories for the hotel with their available room count
     * for the requested date range. Categories with 0 available rooms are still
     * returned (frontend shows "Sold Out" badge).
     *
     * Filters by maxOccupancy >= guests so the frontend only shows
     * categories that can accommodate the party size.
     *
     * Business rules enforced:
     *  - checkOut must be after checkIn
     *  - checkIn must not be in the past
     *  - hotel must exist and be active
     */
    public List<AvailabilityResponseDTO> searchAvailability(
            Long hotelId,
            LocalDate checkIn,
            LocalDate checkOut,
            int guests) {

        // Validate dates
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
        if (checkIn.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        // Validate hotel exists and is active
        hotelRepo.findByIdAndIsActiveTrue(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + hotelId));

        // Get all room categories for this hotel
        List<RoomCategory> categories = roomCategoryRepo.findByHotelId(hotelId);

        // For each category, count available rooms and build response
        return categories.stream()
                .filter(cat -> cat.getMaxOccupancy() >= guests) // filter by occupancy
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
                            .hotelId(cat.getHotel().getId())
                            .hotelName(cat.getHotel().getName())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * GET /api/availability/hotel/{hotelId}
     *
     * Returns availability for each room category for the next 30 days.
     * Used by Phase 4 — availability calendar view.
     * Each entry in the list represents one category's availability
     * for today → today+30 days.
     */
    public List<AvailabilityResponseDTO> getHotelAvailabilityNext30Days(Long hotelId) {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysLater = today.plusDays(30);

        // Reuse the search logic with a 30-day window, guests=1 (show all categories)
        return searchAvailability(hotelId, today, thirtyDaysLater, 1);
    }

    /**
     * Used internally by BookingService (Phase 5) to check if enough
     * rooms are available before creating a booking.
     *
     * Returns the list of available Room IDs for a category in a date range.
     * BookingService picks the first N rooms from this list to lock.
     */
    public List<Long> getAvailableRoomIds(Long categoryId, LocalDate checkIn, LocalDate checkOut) {
        return roomRepo.findAvailableRooms(categoryId, checkIn, checkOut)
                .stream()
                .map(room -> room.getId())
                .collect(Collectors.toList());
    }
}
