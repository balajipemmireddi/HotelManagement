package com.Hotel.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Hotel.dto.admin.OccupancyReportDTO;
import com.Hotel.dto.admin.RevenueReportDTO;
import com.Hotel.entity.Booking;
import com.Hotel.entity.Hotel;
import com.Hotel.repository.BookingRepo;
import com.Hotel.repository.HotelRepo;
import com.Hotel.repository.RoomRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 11 — Admin Service for dashboard and reporting.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final BookingRepo bookingRepo;
    private final HotelRepo hotelRepo;
    private final RoomRepo roomRepo;

    /**
     * GET /api/admin/revenue
     * Generate revenue report for date range.
     */
    public RevenueReportDTO getRevenueReport(LocalDate startDate, LocalDate endDate) {
        log.info("Generating revenue report from {} to {}", startDate, endDate);

        List<Booking> bookings = bookingRepo.findAll();
        
        List<Booking> filteredBookings = bookings.stream()
                .filter(b -> !b.getCheckInDate().isBefore(startDate) && 
                            !b.getCheckInDate().isAfter(endDate))
                .toList();

        long totalBookings = filteredBookings.stream()
                .filter(b -> b.getStatus() != Booking.BookingStatus.CANCELLED)
                .count();

        double totalRevenue = filteredBookings.stream()
                .filter(b -> b.getStatus() != Booking.BookingStatus.CANCELLED)
                .mapToDouble(Booking::getFinalAmount)
                .sum();

        long cancelledBookings = filteredBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();

        double averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0.0;

        return RevenueReportDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .averageBookingValue(averageBookingValue)
                .cancelledBookings(cancelledBookings)
                .build();
    }

    /**
     * GET /api/admin/occupancy
     * Get current occupancy rates for all hotels.
     */
    public List<OccupancyReportDTO> getOccupancyReport() {
        log.info("Generating occupancy report");

        List<Hotel> hotels = hotelRepo.findAllByIsActiveTrue();
        List<OccupancyReportDTO> reports = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Hotel hotel : hotels) {
            long totalRooms = roomRepo.countByRoomCategoryIdAndIsActiveTrue(hotel.getId());
            
            // Count occupied rooms (bookings that include today)
            long occupiedRooms = bookingRepo.findAll().stream()
                    .filter(b -> b.getHotel().getId().equals(hotel.getId()))
                    .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                    .filter(b -> !b.getCheckInDate().isAfter(today) && 
                                !b.getCheckOutDate().isBefore(today))
                    .flatMap(b -> b.getBookingRooms().stream())
                    .count();

            double occupancyRate = totalRooms > 0 ? 
                    (occupiedRooms * 100.0 / totalRooms) : 0.0;

            reports.add(OccupancyReportDTO.builder()
                    .hotelId(hotel.getId())
                    .hotelName(hotel.getName())
                    .totalRooms((int) totalRooms)
                    .occupiedRooms((int) occupiedRooms)
                    .occupancyRate(occupancyRate)
                    .build());
        }

        return reports;
    }
}
