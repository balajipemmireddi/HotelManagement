package com.Hotel.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Hotel.dto.admin.OccupancyReportDTO;
import com.Hotel.dto.admin.RevenueReportDTO;
import com.Hotel.service.AdminService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 11 — Admin Controller for dashboard and reporting.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/admin/revenue
     * Revenue report for date range.
     */
    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDTO> getRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        log.info("Admin requesting revenue report from {} to {}", startDate, endDate);
        RevenueReportDTO report = adminService.getRevenueReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    /**
     * GET /api/admin/occupancy
     * Current occupancy rates for all hotels.
     */
    @GetMapping("/occupancy")
    public ResponseEntity<List<OccupancyReportDTO>> getOccupancyReport() {
        log.info("Admin requesting occupancy report");
        List<OccupancyReportDTO> report = adminService.getOccupancyReport();
        return ResponseEntity.ok(report);
    }
}
