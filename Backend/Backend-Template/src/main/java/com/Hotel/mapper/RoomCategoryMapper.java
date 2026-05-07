package com.Hotel.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.Hotel.dto.room.RoomCategoryRequestDTO;
import com.Hotel.dto.room.RoomCategoryResponseDTO;
import com.Hotel.entity.RoomCategory;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface RoomCategoryMapper {

    // DTO → Entity
    // hotel is set manually in service (we only get hotelId from DTO)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    RoomCategory toEntity(RoomCategoryRequestDTO dto);

    // Entity → Response DTO
    // Flatten hotel.id → hotelId and hotel.name → hotelName
    @Mapping(source = "hotel.id", target = "hotelId")
    @Mapping(source = "hotel.name", target = "hotelName")
    RoomCategoryResponseDTO toResponseDTO(RoomCategory roomCategory);

    // List mapping
    List<RoomCategoryResponseDTO> toResponseDTOList(List<RoomCategory> categories);

    // Partial update for PUT
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(RoomCategoryRequestDTO dto, @MappingTarget RoomCategory category);
}
