package com.Hotel.dto.availability;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Phase 4 — Daily availability snapshot for a single date.
 *
 * Used by GET /api/availability/hotel/{hotelId}/calendar
 *
 * Frontend calendar component maps over the `days` list and renders
 * each date cell with:
 *  - Green  → at least one category has rooms available
 *  - Yellow → low availability (< 20% rooms left)
 *  - Red    → fully booked (all categories soldOut = true)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyAvailabilityDTO {

    private LocalDate date;

    // true if every room category for this hotel is fully booked on this date
    private boolean fullyBooked;

    // Minimum available rooms across all categories on this date
    // Frontend uses this for the "X rooms left" summary on calendar cell
    private int minAvailableRooms;

    // Per-category breakdown for this date
    private List<CategoryDailySnapshot> categories;

    /**
     * Snapshot of one room category's availability for a single day.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryDailySnapshot {
        private Long categoryId;
        private String categoryName;
        private Double basePrice;
        private int availableCount;
        private boolean soldOut;
    }
}
