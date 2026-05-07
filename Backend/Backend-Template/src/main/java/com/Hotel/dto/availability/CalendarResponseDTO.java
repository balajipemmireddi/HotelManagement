package com.Hotel.dto.availability;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Phase 4 — Full calendar response for a hotel.
 *
 * Wraps the list of daily snapshots with hotel metadata
 * so the frontend doesn't need a separate hotel fetch.
 *
 * Used by GET /api/availability/hotel/{hotelId}/calendar?from=...&to=...
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarResponseDTO {

    private Long hotelId;
    private String hotelName;
    private LocalDate fromDate;
    private LocalDate toDate;
    private int totalDays;

    // One entry per day in the requested range
    private List<DailyAvailabilityDTO> days;
}
