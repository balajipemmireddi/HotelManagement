package com.Hotel.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.Hotel.dto.hotel.HotelRequestDTO;
import com.Hotel.dto.hotel.HotelResponseDTO;
import com.Hotel.dto.hotel.HotelSummaryDTO;
import com.Hotel.entity.Hotel;

/**
 * MapStruct mapper for Hotel entity.
 * componentModel = "spring" is set globally via compiler arg in pom.xml,
 * but explicitly stated here for clarity.
 *
 * NullValuePropertyMappingStrategy.IGNORE — on partial updates (PUT),
 * null fields in the DTO won't overwrite existing entity values.
 */
@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface HotelMapper {

    // DTO → Entity (for POST create)
    // id, createdAt, updatedAt are managed by JPA — never map from DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Hotel toEntity(HotelRequestDTO dto);

    // Entity → Full response DTO
    HotelResponseDTO toResponseDTO(Hotel hotel);

    // Entity → Summary DTO (for listing)
    HotelSummaryDTO toSummaryDTO(Hotel hotel);

    // List of entities → List of summary DTOs
    List<HotelSummaryDTO> toSummaryDTOList(List<Hotel> hotels);

    // Partial update — merge DTO fields into existing entity (for PUT)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    void updateEntityFromDTO(HotelRequestDTO dto, @MappingTarget Hotel hotel);
}
