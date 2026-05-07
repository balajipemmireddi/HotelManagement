package com.Hotel.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Hotel.dto.room.RoomRequestDTO;
import com.Hotel.dto.room.RoomResponseDTO;
import com.Hotel.entity.Room;
import com.Hotel.entity.RoomCategory;
import com.Hotel.exception.ResourceNotFoundException;
import com.Hotel.mapper.RoomMapper;
import com.Hotel.repository.RoomCategoryRepo;
import com.Hotel.repository.RoomRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepo roomRepo;
    private final RoomCategoryRepo roomCategoryRepo;
    private final RoomMapper roomMapper;

    /**
     * POST /api/rooms
     * Creates an individual room under a category. ADMIN only.
     */
    public RoomResponseDTO createRoom(RoomRequestDTO dto) {
        RoomCategory category = roomCategoryRepo.findById(dto.getRoomCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room category not found with id: " + dto.getRoomCategoryId()));

        Room room = roomMapper.toEntity(dto);
        room.setRoomCategory(category);
        room.setIsActive(true);
        room.setCurrentStatus(Room.RoomStatus.AVAILABLE);

        Room saved = roomRepo.save(room);
        return roomMapper.toResponseDTO(saved);
    }

    /**
     * GET /api/room-categories/{categoryId}/rooms
     * Returns all rooms under a category.
     * Used by admin and teammate's AvailabilityService (Phase 3).
     */
    public List<RoomResponseDTO> getRoomsByCategory(Long categoryId) {
        roomCategoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room category not found with id: " + categoryId));

        List<Room> rooms = roomRepo.findByRoomCategoryId(categoryId);
        return roomMapper.toResponseDTOList(rooms);
    }

    /**
     * GET /api/rooms/{id}
     * Returns a single room by ID.
     */
    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + id));
        return roomMapper.toResponseDTO(room);
    }

    /**
     * PUT /api/rooms/{id}/status
     * Updates room operational status. ADMIN only.
     * Used by teammate's Admin controller (Phase 11) — this method is
     * intentionally public so AdminService can call it directly.
     */
    public RoomResponseDTO updateRoomStatus(Long id, Room.RoomStatus newStatus) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + id));
        room.setCurrentStatus(newStatus);
        Room updated = roomRepo.save(room);
        return roomMapper.toResponseDTO(updated);
    }

    /**
     * DELETE /api/rooms/{id}
     * Soft delete — sets isActive = false. ADMIN only.
     */
    public void deactivateRoom(Long id) {
        Room room = roomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room not found with id: " + id));
        room.setIsActive(false);
        roomRepo.save(room);
    }
}
