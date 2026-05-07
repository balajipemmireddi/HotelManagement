package com.Hotel.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.Hotel.dto.room.RoomRequestDTO;
import com.Hotel.dto.room.RoomResponseDTO;
import com.Hotel.entity.Room;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface RoomMapper {

    // DTO → Entity
    // roomCategory is resolved in service from roomCategoryId
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomCategory", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "currentStatus", ignore = true)
    Room toEntity(RoomRequestDTO dto);

    // Entity → Response DTO
    // Flatten roomCategory.id → roomCategoryId and roomCategory.categoryName → categoryName
    @Mapping(source = "roomCategory.id", target = "roomCategoryId")
    @Mapping(source = "roomCategory.categoryName", target = "categoryName")
    @Mapping(source = "currentStatus", target = "currentStatus")
    RoomResponseDTO toResponseDTO(Room room);

    List<RoomResponseDTO> toResponseDTOList(List<Room> rooms);
}
