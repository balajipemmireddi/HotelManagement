# PHASE 6: Booking Details & User History ✅

## Implementation Summary

Phase 6 has been successfully implemented, enabling users to view their booking history and retrieve detailed booking information with proper authorization controls.

---

## 📦 Components Enhanced/Created

### 1. Controller Enhancements

#### `BookingController.java` (Enhanced)
- **Location**: `src/main/java/com/Hotel/controller/`
- **New Endpoints Added**: 2

##### Endpoint 1: GET /api/bookings/user/{userId}
**Purpose**: Retrieve all bookings for a specific user

**Features**:
- Returns all bookings (past, upcoming, cancelled)
- Ordered by creation date (newest first)
- Authorization enforced (users can only view their own bookings)
- JWT authentication required

**Response**: List of `BookingResponseDTO`

##### Endpoint 2: GET /api/bookings/{id}
**Purpose**: Get full details of a specific booking

**Features**:
- Complete booking information with all rooms
- Pricing breakdown included
- Authorization enforced (users can only view their own bookings)
- JWT authentication required

**Response**: Single `BookingResponseDTO`

---

### 2. Service Enhancements

#### `BookingService.java` (Enhanced)
- **Location**: `src/main/java/com/Hotel/service/`
- **New Methods Added**: 2

##### Method 1: getUserBookings()
```java
public List<BookingResponseDTO> getUserBookings(Long userId, Long authenticatedUserId)
```

**Functionality**:
1. Validates authorization (user can only view own bookings)
2. Retrieves all bookings from repository
3. Converts entities to DTOs using BookingMapper
4. Returns ordered list (newest first)

**Authorization**:
- Throws `UnauthorizedResourceAccessException` if user tries to access another user's bookings

##### Method 2: getBookingById()
```java
public BookingResponseDTO getBookingById(Long bookingId, Long authenticatedUserId)
```

**Functionality**:
1. Retrieves booking by ID
2. Validates authorization (user owns the booking)
3. Converts entity to DTO
4. Returns complete booking details

**Error Handling**:
- Throws `ResourceNotFoundException` if booking doesn't exist
- Throws `UnauthorizedResourceAccessException` if user doesn't own the booking

---

## 🔐 Security & Authorization

### Authorization Model

**Rule**: Users can ONLY view their own bookings

**Implementation**:
1. Extract authenticated user ID from JWT token
2. Compare with requested user ID or booking owner ID
3. Throw `UnauthorizedResourceAccessException` if mismatch

**Exception Handling**:
```java
if (!userId.equals(authenticatedUserId)) {
    throw new UnauthorizedResourceAccessException(
        "You are not authorized to view bookings for user " + userId
    );
}
```

---

## 🔄 Integration with Phase 5

### Reused Components

✅ **BookingMapper** (Phase 5)
- Already implements `toResponseDTO()` method
- Handles nested room details
- Enum to String conversions
- No changes needed!

✅ **Repository Methods** (Phase 5)
- `BookingRepo.findByUserId()` - Already implemented
- `BookingRepo.findById()` - Spring Data JPA default
- No new repository methods needed!

✅ **DTOs** (Phase 5)
- `BookingResponseDTO` - Already complete with all fields
- Includes nested `BookedRoomDTO`
- No changes needed!

**Result**: Phase 6 implementation was streamlined because Phase 5 was designed with future phases in mind!

---

## 🚀 API Endpoints

### 1. Get User Bookings

```http
GET /api/bookings/user/{userId}
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters**:
- `userId` (Long) - User ID whose bookings to retrieve

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "bookingReference": "BK-20260507-A3F9",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "hotelId": 1,
    "hotelName": "Grand Plaza Hotel",
    "hotelAddress": "123 Main Street, New York",
    "checkInDate": "2026-06-15",
    "checkOutDate": "2026-06-18",
    "totalNights": 3,
    "totalAmount": 900.00,
    "discountAmount": 0.00,
    "finalAmount": 900.00,
    "specialRequests": "Late check-in",
    "createdAt": "2026-05-07T12:30:00",
    "updatedAt": "2026-05-07T12:30:00",
    "bookedRooms": [
      {
        "roomId": 101,
        "roomNumber": "201",
        "categoryId": 3,
        "categoryName": "Deluxe King",
        "pricePerNight": 150.00,
        "numberOfNights": 3,
        "subtotal": 450.00
      },
      {
        "roomId": 102,
        "roomNumber": "202",
        "categoryId": 3,
        "categoryName": "Deluxe King",
        "pricePerNight": 150.00,
        "numberOfNights": 3,
        "subtotal": 450.00
      }
    ]
  },
  {
    "id": 2,
    "bookingReference": "BK-20260501-B7K2",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "hotelName": "Seaside Resort",
    "checkInDate": "2026-07-01",
    "checkOutDate": "2026-07-05",
    "totalNights": 4,
    "totalAmount": 1200.00,
    "finalAmount": 1200.00,
    "bookedRooms": [...]
  }
]
```

**Error Responses**:

**401 Unauthorized** (No JWT token):
```json
{
  "timestamp": "2026-05-07T14:15:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**403 Forbidden** (Accessing another user's bookings):
```json
{
  "timestamp": "2026-05-07T14:15:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You are not authorized to view bookings for user 5"
}
```

---

### 2. Get Booking Details

```http
GET /api/bookings/{id}
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters**:
- `id` (Long) - Booking ID to retrieve

**Response (200 OK)**:
```json
{
  "id": 1,
  "bookingReference": "BK-20260507-A3F9",
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "hotelId": 1,
  "hotelName": "Grand Plaza Hotel",
  "hotelAddress": "123 Main Street, New York, NY 10001",
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "totalNights": 3,
  "totalAmount": 900.00,
  "discountAmount": 0.00,
  "finalAmount": 900.00,
  "specialRequests": "Late check-in after 10 PM",
  "createdAt": "2026-05-07T12:30:00",
  "updatedAt": "2026-05-07T12:30:00",
  "bookedRooms": [
    {
      "roomId": 101,
      "roomNumber": "201",
      "categoryId": 3,
      "categoryName": "Deluxe King",
      "pricePerNight": 150.00,
      "numberOfNights": 3,
      "subtotal": 450.00
    },
    {
      "roomId": 102,
      "roomNumber": "202",
      "categoryId": 3,
      "categoryName": "Deluxe King",
      "pricePerNight": 150.00,
      "numberOfNights": 3,
      "subtotal": 450.00
    }
  ]
}
```

**Error Responses**:

**404 Not Found** (Booking doesn't exist):
```json
{
  "timestamp": "2026-05-07T14:15:00",
  "status": 404,
  "error": "Not Found",
  "message": "Booking not found with id: 999"
}
```

**403 Forbidden** (Accessing another user's booking):
```json
{
  "timestamp": "2026-05-07T14:15:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You are not authorized to view this booking"
}
```

---

## 🧪 Testing Guide

### Prerequisites

1. **Application Running**: `./mvnw spring-boot:run`
2. **JWT Token**: Login to get authentication token
3. **Test Data**: At least one booking created in Phase 5

---

### Test Scenario 1: Get Own Bookings (Success)

**Step 1**: Login as user
```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Step 2**: Get user ID from token (decode JWT or check database)

**Step 3**: Retrieve bookings
```http
GET http://localhost:8080/api/bookings/user/1
Authorization: Bearer <JWT_TOKEN>
```

**Expected**: 200 OK with list of bookings

---

### Test Scenario 2: Get Specific Booking (Success)

```http
GET http://localhost:8080/api/bookings/1
Authorization: Bearer <JWT_TOKEN>
```

**Expected**: 200 OK with full booking details

---

### Test Scenario 3: Unauthorized Access (Failure)

**Setup**: Login as user 1, try to access user 2's bookings

```http
GET http://localhost:8080/api/bookings/user/2
Authorization: Bearer <USER_1_JWT_TOKEN>
```

**Expected**: 403 Forbidden with authorization error message

---

### Test Scenario 4: Booking Not Found (Failure)

```http
GET http://localhost:8080/api/bookings/99999
Authorization: Bearer <JWT_TOKEN>
```

**Expected**: 404 Not Found

---

### Test Scenario 5: No Authentication (Failure)

```http
GET http://localhost:8080/api/bookings/user/1
```

**Expected**: 401 Unauthorized

---

## 📊 Database Queries

### Query 1: Get User Bookings
```sql
SELECT b.* FROM bookings b
WHERE b.user_id = ?
ORDER BY b.created_at DESC
```

**Used by**: `BookingRepo.findByUserId()`

### Query 2: Get Booking by ID
```sql
SELECT b.* FROM bookings b
WHERE b.id = ?
```

**Used by**: `BookingRepo.findById()` (Spring Data JPA default)

### Query 3: Get Booking Rooms (Lazy-loaded)
```sql
SELECT br.* FROM booking_rooms br
WHERE br.booking_id = ?
```

**Triggered by**: Accessing `booking.getBookingRooms()` in mapper

---

## 🔄 Data Flow

### Get User Bookings Flow

```
Client Request
    ↓
GET /api/bookings/user/5 + JWT Token
    ↓
BookingController.getUserBookings()
    ├─ Extract authenticated user ID from JWT
    ├─ Call BookingService.getUserBookings(5, authenticatedUserId)
    │   ├─ Validate authorization (5 == authenticatedUserId)
    │   ├─ BookingRepo.findByUserId(5)
    │   ├─ For each booking:
    │   │   └─ BookingMapper.toResponseDTO(booking)
    │   └─ Return List<BookingResponseDTO>
    └─ Return 200 OK with booking list
```

### Get Booking Details Flow

```
Client Request
    ↓
GET /api/bookings/1 + JWT Token
    ↓
BookingController.getBookingById()
    ├─ Extract authenticated user ID from JWT
    ├─ Call BookingService.getBookingById(1, authenticatedUserId)
    │   ├─ BookingRepo.findById(1)
    │   ├─ Validate authorization (booking.userId == authenticatedUserId)
    │   ├─ BookingMapper.toResponseDTO(booking)
    │   └─ Return BookingResponseDTO
    └─ Return 200 OK with booking details
```

---

## ✅ Exit Criteria Status

| Criteria | Status | Implementation |
|----------|--------|----------------|
| Users can view their own bookings | ✅ | GET /api/bookings/user/{userId} |
| Full booking details retrievable | ✅ | GET /api/bookings/{id} |
| Authorization enforced | ✅ | UnauthorizedResourceAccessException |
| BookingMapper for detailed responses | ✅ | Reused from Phase 5 |
| Repository methods for user retrieval | ✅ | Reused from Phase 5 |
| Hotel details included | ✅ | Mapped from booking.hotel |
| Room details included | ✅ | Mapped from booking.bookingRooms |
| Pricing breakdown shown | ✅ | totalAmount, discountAmount, finalAmount |

---

## 📝 Code Changes Summary

### Files Modified: 2

1. **BookingController.java**
   - Added `getUserBookings()` endpoint
   - Added `getBookingById()` endpoint
   - Updated class documentation

2. **BookingService.java**
   - Added `getUserBookings()` method with authorization
   - Added `getBookingById()` method with authorization
   - Updated class documentation

### Files Created: 0

**Reason**: Phase 5 was designed with Phase 6 in mind, so all necessary DTOs, repositories, and mappers were already in place!

---

## 🎯 Frontend Integration Notes

### Booking List Page

**Endpoint**: `GET /api/bookings/user/{userId}`

**Use Cases**:
- User dashboard showing all bookings
- Filter by status (upcoming, past, cancelled)
- Sort by date

**Display Fields**:
- Booking reference (clickable to details)
- Hotel name
- Check-in and check-out dates
- Status badge (PENDING, CONFIRMED, CANCELLED)
- Total amount

### Booking Details Page

**Endpoint**: `GET /api/bookings/{id}`

**Use Cases**:
- Detailed booking view
- Print/download booking confirmation
- Cancellation page (Phase 8)

**Display Sections**:
- Booking reference and status
- Hotel information
- Date range and nights
- Room list with pricing
- Special requests
- Payment information

---

## 🚀 Next Steps (Phase 7)

Phase 7 will implement:
- Discount code validation
- Apply discounts to bookings
- Discount entity and repository
- Discount validation endpoint

---

## 💡 Design Decisions

### 1. Authorization at Service Layer
**Decision**: Enforce authorization in service methods, not controller

**Rationale**:
- Centralized security logic
- Prevents bypass if multiple controllers access same service
- Easier to test and maintain

### 2. Reuse Phase 5 Components
**Decision**: No new DTOs or repositories needed

**Rationale**:
- Phase 5 was designed with future phases in mind
- Reduces code duplication
- Maintains consistency

### 3. Separate Endpoints for List vs Details
**Decision**: Two endpoints instead of one with optional parameters

**Rationale**:
- RESTful design principles
- Clear separation of concerns
- Easier to optimize queries (list can be lighter)

### 4. Return Full Details in List
**Decision**: Include all booking details in list endpoint

**Rationale**:
- Frontend can display rich booking cards
- Reduces need for additional API calls
- Acceptable performance (users typically have few bookings)

---

## 🎉 Phase 6 Status

**✅ COMPLETE**

All requirements from the implementation plan have been successfully implemented and compiled.

**Recommended Commit**:
```bash
git add .
git commit -m "PHASE-6: Implement booking retrieval and user history with authorization"
```

---

**Implementation Date**: May 7, 2026  
**Build Status**: ✅ SUCCESS  
**Ready for**: Phase 7 (Discount & Promotion System)
