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
import org.springframework.web.bind.annotation.RestController;

import com.Hotel.dto.room.RoomCategoryRequestDTO;
import com.Hotel.dto.room.RoomCategoryResponseDTO;
import com.Hotel.service.RoomCategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RoomCategoryController {

    private final RoomCategoryService roomCategoryService;

    /**
     * POST /api/room-categories
     * ADMIN only — create a room category under a hotel.
     */
    @PostMapping("/api/room-categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomCategoryResponseDTO> createRoomCategory(
            @Valid @RequestBody RoomCategoryRequestDTO dto) {
        RoomCategoryResponseDTO created = roomCategoryService.createRoomCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/hotels/{hotelId}/rooms
     * Public — frontend Hotel Details page fetches room categories here.
     * Returns all categories for a hotel with price and occupancy info.
     */
    @GetMapping("/api/hotels/{hotelId}/rooms")
    public ResponseEntity<List<RoomCategoryResponseDTO>> getRoomCategoriesByHotel(
            @PathVariable Long hotelId) {
        return ResponseEntity.ok(roomCategoryService.getRoomCategoriesByHotel(hotelId));
    }

    /**
     * GET /api/room-categories/{id}
     * Public — single room category detail.
     */
    @GetMapping("/api/room-categories/{id}")
    public ResponseEntity<RoomCategoryResponseDTO> getRoomCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(roomCategoryService.getRoomCategoryById(id));
    }

    /**
     * PUT /api/room-categories/{id}
     * ADMIN only — update room category details or price.
     */
    @PutMapping("/api/room-categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomCategoryResponseDTO> updateRoomCategory(
            @PathVariable Long id,
            @Valid @RequestBody RoomCategoryRequestDTO dto) {
        return ResponseEntity.ok(roomCategoryService.updateRoomCategory(id, dto));
    }

    /**
     * DELETE /api/room-categories/{id}
     * ADMIN only — delete a room category.
     */
    @DeleteMapping("/api/room-categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoomCategory(@PathVariable Long id) {
        roomCategoryService.deleteRoomCategory(id);
        return ResponseEntity.noContent().build();
    }
}
