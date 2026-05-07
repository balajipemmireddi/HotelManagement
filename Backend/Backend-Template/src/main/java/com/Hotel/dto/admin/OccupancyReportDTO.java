package com.Hotel.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 11 — Occupancy report DTO for admin dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OccupancyReportDTO {

    private Long hotelId;
    private String hotelName;
    private Integer totalRooms;
    private Integer occupiedRooms;
    private Double occupancyRate; // Percentage
}
