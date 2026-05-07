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

import com.Hotel.dto.room.RoomRequestDTO;
import com.Hotel.dto.room.RoomResponseDTO;
import com.Hotel.entity.Room;
import com.Hotel.service.RoomService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    /**
     * POST /api/rooms
     * ADMIN only — add an individual room under a category.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponseDTO> createRoom(@Valid @RequestBody RoomRequestDTO dto) {
        RoomResponseDTO created = roomService.createRoom(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /api/rooms/category/{categoryId}
     * Returns all rooms under a room category.
     * Used by admin and teammate's AvailabilityService (Phase 3).
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(roomService.getRoomsByCategory(categoryId));
    }

    /**
     * GET /api/rooms/{id}
     * Returns a single room by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    /**
     * PUT /api/rooms/{id}/status
     * ADMIN only — update room operational status.
     * Accepts status as a path variable: AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING
     */
    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponseDTO> updateRoomStatus(
            @PathVariable Long id,
            @PathVariable Room.RoomStatus status) {
        return ResponseEntity.ok(roomService.updateRoomStatus(id, status));
    }

    /**
     * DELETE /api/rooms/{id}
     * ADMIN only — soft delete (sets isActive = false).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateRoom(@PathVariable Long id) {
        roomService.deactivateRoom(id);
        return ResponseEntity.noContent().build();
    }
}
