package com.Hotel.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.Hotel.dto.booking.BookingResponseDTO;
import com.Hotel.entity.Booking;
import com.Hotel.entity.BookingRoom;

/**
 * PHASE 5 — Booking mapper using MapStruct.
 *
 * Converts Booking entity to BookingResponseDTO with nested room details.
 */
@Mapper(componentModel = "spring")
public interface BookingMapper {

    /**
     * Maps Booking entity to response DTO.
     * Includes hotel details and booked rooms.
     */
    @Mapping(source = "status", target = "status", qualifiedByName = "statusToString")
    @Mapping(source = "paymentStatus", target = "paymentStatus", qualifiedByName = "paymentStatusToString")
    @Mapping(source = "hotel.id", target = "hotelId")
    @Mapping(source = "hotel.name", target = "hotelName")
    @Mapping(source = "hotel.address", target = "hotelAddress")
    @Mapping(source = "bookingRooms", target = "bookedRooms", qualifiedByName = "mapBookedRooms")
    BookingResponseDTO toResponseDTO(Booking booking);

    /**
     * Converts BookingStatus enum to string.
     */
    @Named("statusToString")
    default String statusToString(Booking.BookingStatus status) {
        return status != null ? status.name() : null;
    }

    /**
     * Converts PaymentStatus enum to string.
     */
    @Named("paymentStatusToString")
    default String paymentStatusToString(Booking.PaymentStatus status) {
        return status != null ? status.name() : null;
    }

    /**
     * Maps list of BookingRoom entities to BookedRoomDTO list.
     */
    @Named("mapBookedRooms")
    default List<BookingResponseDTO.BookedRoomDTO> mapBookedRooms(List<BookingRoom> bookingRooms) {
        if (bookingRooms == null) return null;

        return bookingRooms.stream()
                .map(this::toBookedRoomDTO)
                .collect(Collectors.toList());
    }

    /**
     * Maps a single BookingRoom to BookedRoomDTO.
     */
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "room.roomNumber", target = "roomNumber")
    @Mapping(source = "roomCategory.id", target = "categoryId")
    @Mapping(source = "roomCategory.categoryName", target = "categoryName")
    @Mapping(target = "subtotal", expression = "java(bookingRoom.getPricePerNight() * bookingRoom.getNumberOfNights())")
    BookingResponseDTO.BookedRoomDTO toBookedRoomDTO(BookingRoom bookingRoom);
}
