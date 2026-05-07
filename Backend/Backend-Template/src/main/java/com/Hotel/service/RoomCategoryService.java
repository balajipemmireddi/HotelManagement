package com.Hotel.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Hotel.dto.room.RoomCategoryRequestDTO;
import com.Hotel.dto.room.RoomCategoryResponseDTO;
import com.Hotel.entity.Hotel;
import com.Hotel.entity.RoomCategory;
import com.Hotel.exception.ResourceNotFoundException;
import com.Hotel.mapper.RoomCategoryMapper;
import com.Hotel.repository.HotelRepo;
import com.Hotel.repository.RoomCategoryRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomCategoryService {

    private final RoomCategoryRepo roomCategoryRepo;
    private final HotelRepo hotelRepo;
    private final RoomCategoryMapper roomCategoryMapper;

    /**
     * POST /api/room-categories
     * Creates a room category under a hotel. ADMIN only.
     * Validates hotel exists and is active before creating.
     */
    public RoomCategoryResponseDTO createRoomCategory(RoomCategoryRequestDTO dto) {
        // Validate hotel exists and is active
        Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(dto.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + dto.getHotelId()));

        RoomCategory category = roomCategoryMapper.toEntity(dto);
        category.setHotel(hotel); // set the relationship manually

        RoomCategory saved = roomCategoryRepo.save(category);
        return roomCategoryMapper.toResponseDTO(saved);
    }

    /**
     * GET /api/hotels/{hotelId}/rooms
     * Returns all room categories for a hotel.
     * Public endpoint — frontend Room Selection page uses this.
     */
    public List<RoomCategoryResponseDTO> getRoomCategoriesByHotel(Long hotelId) {
        // Validate hotel exists
        hotelRepo.findByIdAndIsActiveTrue(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hotel not found with id: " + hotelId));

        List<RoomCategory> categories = roomCategoryRepo.findByHotelId(hotelId);
        return roomCategoryMapper.toResponseDTOList(categories);
    }

    /**
     * GET /api/room-categories/{id}
     * Returns a single room category by ID.
     * Public endpoint.
     */
    public RoomCategoryResponseDTO getRoomCategoryById(Long id) {
        RoomCategory category = roomCategoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room category not found with id: " + id));
        return roomCategoryMapper.toResponseDTO(category);
    }

    /**
     * PUT /api/room-categories/{id}
     * Updates a room category. ADMIN only.
     */
    public RoomCategoryResponseDTO updateRoomCategory(Long id, RoomCategoryRequestDTO dto) {
        RoomCategory category = roomCategoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room category not found with id: " + id));

        // If hotelId changed, validate the new hotel
        if (dto.getHotelId() != null && !dto.getHotelId().equals(category.getHotel().getId())) {
            Hotel hotel = hotelRepo.findByIdAndIsActiveTrue(dto.getHotelId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Hotel not found with id: " + dto.getHotelId()));
            category.setHotel(hotel);
        }

        roomCategoryMapper.updateEntityFromDTO(dto, category);
        RoomCategory updated = roomCategoryRepo.save(category);
        return roomCategoryMapper.toResponseDTO(updated);
    }

    /**
     * DELETE /api/room-categories/{id}
     * Deletes a room category. ADMIN only.
     * Hard delete is acceptable here — only delete if no rooms are linked.
     */
    public void deleteRoomCategory(Long id) {
        RoomCategory category = roomCategoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room category not found with id: " + id));
        roomCategoryRepo.delete(category);
    }
}
