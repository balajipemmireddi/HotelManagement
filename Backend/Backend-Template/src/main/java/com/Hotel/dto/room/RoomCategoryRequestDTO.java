package com.Hotel.dto.room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RoomCategoryRequestDTO {

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotBlank(message = "Category name is required")
    private String categoryName;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private Double basePrice;

    @NotNull(message = "Max occupancy is required")
    @Min(value = 1, message = "Max occupancy must be at least 1")
    private Integer maxOccupancy;

    // Optional fields
    private String bedType;
    private String description;
    private String imageUrl;
}
