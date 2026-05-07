package com.Hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Hotel.dto.hotel.HotelRequestDTO;
import com.Hotel.dto.hotel.HotelResponseDTO;
import com.Hotel.dto.hotel.HotelSummaryDTO;
import com.Hotel.service.HotelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    /**
     * GET /api/hotels
     * Public — frontend hotel listing page (HotelList component).
     * Returns lightweight summary DTOs for the hotel cards.
     */
    @GetMapping
    public ResponseEntity<List<HotelSummaryDTO>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllActiveHotels());
    }

    /**
     * GET /api/hotels/{id}
     * Public — frontend hotel details page (HotelDetails component).
     * Returns full hotel info including contact details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HotelResponseDTO> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    /**
     * POST /api/hotels
     * ADMIN only — create a new hotel.
     * @Valid triggers HotelRequestDTO validation annotations.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponseDTO> createHotel(@Valid @RequestBody HotelRequestDTO dto) {
        HotelResponseDTO created = hotelService.createHotel(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/hotels/{id}
     * ADMIN only — update hotel details.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponseDTO> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequestDTO dto) {
        return ResponseEntity.ok(hotelService.updateHotel(id, dto));
    }

    /**
     * DELETE /api/hotels/{id}
     * ADMIN only — soft delete (sets isActive = false).
     * Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.softDeleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PHASE 9: GET /api/hotels/search/advanced
     * Public — advanced hotel search with multiple filters.
     */
    @GetMapping("/search/advanced")
    public ResponseEntity<List<HotelSummaryDTO>> advancedSearch(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minStarRating,
            @RequestParam(required = false) Integer maxStarRating,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String name) {
        
        List<HotelSummaryDTO> results = hotelService.advancedSearch(
                city, minStarRating, maxStarRating, minPrice, maxPrice, name);
        
        return ResponseEntity.ok(results);
    }
}
