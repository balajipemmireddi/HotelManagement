package com.Hotel.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomRequestDTO {

    @NotNull(message = "Room category ID is required")
    private Long roomCategoryId;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    private Integer floor;
}
