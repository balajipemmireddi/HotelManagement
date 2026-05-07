package com.Hotel.dto.admin;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PHASE 11 — Revenue report DTO for admin dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueReportDTO {

    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalBookings;
    private Double totalRevenue;
    private Double averageBookingValue;
    private Long cancelledBookings;
}
