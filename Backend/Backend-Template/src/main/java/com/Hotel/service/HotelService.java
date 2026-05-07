package com.Hotel.service;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.Hotel.dto.hotel.HotelRequestDTO;
import com.Hotel.dto.hotel.HotelResponseDTO;
import com.Hotel.dto.hotel.HotelSummaryDTO;
import com.Hotel.entity.Hotel;
import com.Hotel.exception.ResourceNotFoundException;
import com.Hotel.mapper.HotelMapper;
import com.Hotel.repository.HotelRepo;
import com.Hotel.specification.HotelSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepo hotelRepo;
    private final HotelMapper hotelMapper;

    /**
     * GET /api/hotels
     * Returns all active hotels as lightweight summary DTOs.
     * Public endpoint — no auth required.
     */
    public List<HotelSummaryDTO> getAllActiveHotels() {
        List<Hotel> hotels = hotelRepo.findAllByIsActiveTrue();
        return hotelMapper.toSummaryDTOList(hotels);
    }

    /**
     * GET /api/hotels/{id}
     * Returns full hotel details for the Hotel Details page.
     * Public endpoint — no auth required.
     */
    public HotelResponseDTO getHotelById(Long id) {
        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + id));
        return hotelMapper.toResponseDTO(hotel);
    }

    /**
     * POST /api/hotels
     * Creates a new hotel. ADMIN only.
     */
    public HotelResponseDTO createHotel(HotelRequestDTO dto) {
        Hotel hotel = hotelMapper.toEntity(dto);
        hotel.setIsActive(true); // explicit default
        Hotel saved = hotelRepo.save(hotel);
        return hotelMapper.toResponseDTO(saved);
    }

    /**
     * PUT /api/hotels/{id}
     * Updates an existing hotel. ADMIN only.
     * Uses MapStruct partial update — only non-null DTO fields are applied.
     */
    public HotelResponseDTO updateHotel(Long id, HotelRequestDTO dto) {
        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + id));

        hotelMapper.updateEntityFromDTO(dto, hotel);
        Hotel updated = hotelRepo.save(hotel);
        return hotelMapper.toResponseDTO(updated);
    }

    /**
     * DELETE /api/hotels/{id}
     * Soft delete — sets isActive = false. ADMIN only.
     * Never hard-deletes; bookings reference this hotel.
     */
    public void softDeleteHotel(Long id) {
        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + id));
        hotel.setIsActive(false);
        hotelRepo.save(hotel);
    }

    /**
     * PHASE 9: Advanced hotel search with multiple filters.
     * Uses JPA Specification for dynamic query building.
     */
    public List<HotelSummaryDTO> advancedSearch(
            String city,
            Integer minStarRating,
            Integer maxStarRating,
            Double minPrice,
            Double maxPrice,
            String name) {
        
        Specification<Hotel> spec = HotelSpecification.withFilters(
                city, minStarRating, maxStarRating, minPrice, maxPrice, name);
        
        List<Hotel> hotels = hotelRepo.findAll(spec);
        return hotelMapper.toSummaryDTOList(hotels);
    }
}
