# Backend Implementation Plan - Hotel Booking Website

Project: Hotel Booking Website
Team: 4 members (2 Frontend, 2 Backend)
Stack: Spring Boot, PostgreSQL, MapStruct, JWT, Lombok
Goal: Build a production-grade hotel booking platform with real-time inventory management.

## File Structure Snapshot
```
src/main/java/com/hotel/booking/
├── config/             # Security, CORS, Mail configurations
├── controller/         # REST Controllers
├── dto/                # Request and Response DTOs
├── entity/             # JPA Entities
├── exception/          # Custom exceptions and Global Handler
├── mapper/             # MapStruct interfaces
├── repository/         # Spring Data JPA Repositories
├── service/            # Business logic
└── util/               # Constants, Reference Generators
```

## Implementation Phases

PHASE 1: Hotel Management Module
Goal: Implement core hotel entity and basic CRUD operations.
Entity: Hotel
  - id: Long (PK)
  - name: String
  - description: String
  - address: String
  - city: String
  - starRating: Integer
  - isActive: Boolean
RequestDTO: HotelRequestDTO
  - name, description, address, city, starRating
ResponseDTO: HotelResponseDTO
  - id: Long
  - name: String
  - city: String
  - starRating: Integer
Endpoints:
  GET     /api/hotels         → List all active hotels
  POST    /api/hotels         → Create new hotel (Admin)
  GET     /api/hotels/{id}    → Get hotel details
Exit Criteria: All endpoints return correct response via Postman; Hotel entity persisted in DB.

PHASE 2: Room Category & Room Setup
Goal: Define room categories and individual room inventory.
Entity: RoomCategory
  - id: Long (PK)
  - hotelId: Long (FK)
  - categoryName: String
  - basePrice: Double
RequestDTO: RoomCategoryRequestDTO
  - categoryName, basePrice, hotelId
ResponseDTO: RoomCategoryResponseDTO
  - id: Long
  - categoryName: String
  - basePrice: Double
Endpoints:
  POST    /api/room-categories       → Create room category
  GET     /api/hotels/{id}/rooms     → List categories for a hotel
Exit Criteria: Room categories correctly linked to hotels; Price validation working.

PHASE 3: Availability Engine - Core Logic
Goal: Implement the logic to find available rooms for specific dates.
Entity: Room
  - id: Long (PK)
  - roomCategoryId: Long (FK)
  - roomNumber: String
  - currentStatus: Enum
ResponseDTO: AvailabilityResponseDTO
  - categoryId: Long
  - categoryName: String
  - availableCount: Integer
  - price: Double
Endpoints:
  GET     /api/availability/search   → Find available rooms by hotel, dates, and guests
Exit Criteria: Availability query correctly excludes rooms with overlapping bookings.

PHASE 4: Availability Calendar
Goal: Provide a view of availability over a range for a specific hotel.
Tasks:
  - Implement service method for date-range availability checks.
  - Create DTO for daily availability snapshots.
Exit Criteria: GET /api/availability/hotel/{id} returns daily counts for the next 30 days.

PHASE 5: Booking Engine - Creation (Critical)
Goal: Implement the transactional booking creation process.
Entity: Booking
  - id: Long (PK)
  - userId: Long (FK)
  - hotelId: Long (FK)
  - bookingReference: String
  - status: Enum
RequestDTO: BookingRequestDTO
  - hotelId, checkIn, checkOut, rooms: List<{categoryId, quantity}>
ResponseDTO: BookingResponseDTO
  - bookingReference: String
  - totalAmount: Double
  - status: String
Endpoints:
  POST    /api/bookings       → Create a new booking (Authenticated)
Exit Criteria: Atomic transaction ensures rooms are locked and booking is created or fails entirely.

PHASE 6: Booking Details & User History
Goal: Allow users to view their past and upcoming bookings.
Tasks:
  - Implement BookingMapper for detailed responses.
  - Create repository methods for user-specific booking retrieval.
Endpoints:
  GET     /api/bookings/user/{userId} → List user's bookings
  GET     /api/bookings/{id}          → Get full booking details
Exit Criteria: Users can see their own bookings with full room and hotel details.

PHASE 7: Discount & Promotion System
Goal: Implement discount code validation and application.
Entity: DiscountCode
  - id: Long (PK)
  - code: String
  - discountValue: Double
  - isActive: Boolean
RequestDTO: DiscountValidationDTO
  - code, bookingAmount
ResponseDTO: DiscountResponseDTO
  - discountAmount: Double
  - finalAmount: Double
Endpoints:
  POST    /api/discounts/validate    → Check if a code is valid and return savings
Exit Criteria: Discount logic correctly handles percentage vs fixed amounts and expiry dates.

PHASE 8: Booking Cancellation Logic
Goal: Handle the business rules for cancelling a booking.
Tasks:
  - Update Booking status to CANCELLED.
  - Release associated rooms in the availability logic.
  - Record cancellation timestamp.
Endpoints:
  PUT     /api/bookings/{id}/cancel  → Cancel an existing booking
Exit Criteria: Cancelled bookings no longer block availability for those dates.

PHASE 9: Advanced Search & Filtering
Goal: Enhance hotel search with multiple criteria.
Tasks:
  - Implement Specification-based filtering for Hotels.
  - Add support for price range, star rating, and amenities.
Endpoints:
  GET     /api/hotels/search/advanced → Filtered search results
Exit Criteria: Search returns correct results when multiple filters are applied simultaneously.

PHASE 10: Email Notification Service (Async)
Goal: Send confirmation and cancellation emails without blocking the main thread.
Tasks:
  - Configure JavaMailSender.
  - Implement @Async EmailService.
  - Create HTML templates for Booking Confirmation.
Exit Criteria: Logs show email sending triggers after successful booking/cancellation.

PHASE 11: Admin Dashboard & Reporting
Goal: Provide overview metrics for administrators.
Endpoints:
  GET     /api/admin/revenue         → Revenue report by date range
  GET     /api/admin/occupancy       → Current occupancy rates per hotel
Exit Criteria: Admin endpoints restricted to ADMIN role and return correct aggregated data.

PHASE 12: Final Polish & Security Audit
Goal: Ensure the system is robust and secure.
Tasks:
  - Implement Rate Limiting on booking endpoints.
  - Finalize CORS configuration for React frontend.
  - Add comprehensive input validation on all DTOs.
Exit Criteria: All security tests pass; Application ready for production deployment.

## Context
Production-grade hotel booking platform using Spring Boot and React. Focus on real-time inventory and secure transactions.

## Current Phase
PHASE 1 — Hotel Management Module

## Rules
- Use MapStruct for all Entity-DTO conversions.
- Prefix commits with PHASE-N:
- Exit criteria must be met before moving to the next phase.

## Deployment Checklist
- Environment variables: DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET.
- Run `mvn clean package` to generate JAR.
- Ensure PostgreSQL service is running and accessible.
