# Phase 5 - Postman Testing Guide

## 🚀 Quick Start Testing

This guide helps you test the Phase 5 booking creation endpoint using Postman.

---

## Prerequisites

1. **Application Running**: Start the Spring Boot application
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Database**: PostgreSQL with test data:
   - At least one active hotel
   - Room categories with available rooms
   - User account registered

3. **Postman**: Installed and ready

---

## Step 1: Register/Login to Get JWT Token

### Register New User (if needed)

```http
POST http://localhost:8080/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login to Get Token

```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600000
}
```

**⚠️ Copy the token value** - you'll need it for the booking request!

---

## Step 2: Check Hotel Availability (Optional)

Before booking, verify rooms are available:

```http
GET http://localhost:8080/api/availability/search?hotelId=1&checkIn=2026-06-15&checkOut=2026-06-18&guests=2
```

**Response:**
```json
[
  {
    "categoryId": 3,
    "categoryName": "Deluxe King",
    "basePrice": 150.00,
    "availableCount": 5,
    "maxOccupancy": 2
  },
  {
    "categoryId": 5,
    "categoryName": "Executive Suite",
    "basePrice": 250.00,
    "availableCount": 3,
    "maxOccupancy": 4
  }
]
```

---

## Step 3: Create Booking (Phase 5 Endpoint)

### Request

```http
POST http://localhost:8080/api/bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "hotelId": 1,
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "rooms": [
    {
      "categoryId": 3,
      "quantity": 2
    },
    {
      "categoryId": 5,
      "quantity": 1
    }
  ],
  "specialRequests": "Late check-in after 10 PM, need extra pillows"
}
```

### Postman Setup

1. **Method**: POST
2. **URL**: `http://localhost:8080/api/bookings`
3. **Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
4. **Body**: Select "raw" and "JSON", paste the request above

### Expected Response (201 Created)

```json
{
  "id": 1,
  "bookingReference": "BK-20260507-A3F9",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "hotelId": 1,
  "hotelName": "Grand Plaza Hotel",
  "hotelAddress": "123 Main Street, New York, NY 10001",
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "totalNights": 3,
  "totalAmount": 1650.00,
  "discountAmount": 0.00,
  "finalAmount": 1650.00,
  "specialRequests": "Late check-in after 10 PM, need extra pillows",
  "createdAt": "2026-05-07T12:35:00",
  "updatedAt": "2026-05-07T12:35:00",
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
    },
    {
      "roomId": 205,
      "roomNumber": "501",
      "categoryId": 5,
      "categoryName": "Executive Suite",
      "pricePerNight": 250.00,
      "numberOfNights": 3,
      "subtotal": 750.00
    }
  ]
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Successful Booking
- **Input**: Valid hotel, dates, and available rooms
- **Expected**: 201 Created with booking reference
- **Verify**: Check database for booking and booking_rooms records

### Scenario 2: Insufficient Availability
```json
{
  "hotelId": 1,
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "rooms": [
    {
      "categoryId": 3,
      "quantity": 100
    }
  ]
}
```
- **Expected**: 500 Internal Server Error
- **Message**: "Insufficient availability for category..."

### Scenario 3: Invalid Dates (Past Check-in)
```json
{
  "hotelId": 1,
  "checkInDate": "2020-01-01",
  "checkOutDate": "2020-01-05",
  "rooms": [
    {
      "categoryId": 3,
      "quantity": 1
    }
  ]
}
```
- **Expected**: 400 Bad Request
- **Message**: "Check-in date cannot be in the past"

### Scenario 4: Check-out Before Check-in
```json
{
  "hotelId": 1,
  "checkInDate": "2026-06-18",
  "checkOutDate": "2026-06-15",
  "rooms": [
    {
      "categoryId": 3,
      "quantity": 1
    }
  ]
}
```
- **Expected**: 400 Bad Request
- **Message**: "Check-out date must be after check-in date"

### Scenario 5: Hotel Not Found
```json
{
  "hotelId": 99999,
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "rooms": [
    {
      "categoryId": 3,
      "quantity": 1
    }
  ]
}
```
- **Expected**: 404 Not Found
- **Message**: "Hotel not found or inactive with id: 99999"

### Scenario 6: Category Doesn't Belong to Hotel
```json
{
  "hotelId": 1,
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "rooms": [
    {
      "categoryId": 999,
      "quantity": 1
    }
  ]
}
```
- **Expected**: 400 Bad Request or 404 Not Found
- **Message**: "Room category does not belong to hotel..."

### Scenario 7: No JWT Token (Unauthorized)
- **Setup**: Remove Authorization header
- **Expected**: 401 Unauthorized
- **Message**: "Full authentication is required to access this resource"

### Scenario 8: Maximum Stay Duration (31+ nights)
```json
{
  "hotelId": 1,
  "checkInDate": "2026-06-01",
  "checkOutDate": "2026-07-15",
  "rooms": [
    {
      "categoryId": 3,
      "quantity": 1
    }
  ]
}
```
- **Expected**: 400 Bad Request
- **Message**: "Maximum stay duration is 30 nights"

---

## 🔍 Verification Steps

### 1. Database Verification

After successful booking, check the database:

```sql
-- Check booking record
SELECT * FROM bookings WHERE booking_reference = 'BK-20260507-A3F9';

-- Check allocated rooms
SELECT br.*, r.room_number, rc.category_name 
FROM booking_rooms br
JOIN rooms r ON br.room_id = r.id
JOIN room_categories rc ON br.room_category_id = rc.id
WHERE br.booking_id = 1;

-- Verify rooms are locked (not available for overlapping dates)
SELECT * FROM booking_rooms br
JOIN bookings b ON br.booking_id = b.id
WHERE br.room_id = 101
  AND b.status IN ('PENDING', 'CONFIRMED');
```

### 2. Availability Impact

Check that booked rooms are no longer available:

```http
GET http://localhost:8080/api/availability/search?hotelId=1&checkIn=2026-06-15&checkOut=2026-06-18&guests=2
```

The `availableCount` should decrease by the number of rooms booked.

### 3. Booking Reference Format

Verify the booking reference follows the pattern:
- Format: `BK-YYYYMMDD-XXXX`
- Example: `BK-20260507-A3F9`
- Date matches creation date
- Suffix is 4 alphanumeric characters

---

## 📊 Postman Collection (JSON)

Save this as a Postman collection:

```json
{
  "info": {
    "name": "Phase 5 - Booking Engine",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["login"]
        }
      }
    },
    {
      "name": "2. Check Availability",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/availability/search?hotelId=1&checkIn=2026-06-15&checkOut=2026-06-18&guests=2",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "availability", "search"],
          "query": [
            {"key": "hotelId", "value": "1"},
            {"key": "checkIn", "value": "2026-06-15"},
            {"key": "checkOut", "value": "2026-06-18"},
            {"key": "guests", "value": "2"}
          ]
        }
      }
    },
    {
      "name": "3. Create Booking",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"hotelId\": 1,\n  \"checkInDate\": \"2026-06-15\",\n  \"checkOutDate\": \"2026-06-18\",\n  \"rooms\": [\n    {\n      \"categoryId\": 3,\n      \"quantity\": 2\n    }\n  ],\n  \"specialRequests\": \"Late check-in\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/bookings",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "bookings"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "jwt_token",
      "value": "YOUR_JWT_TOKEN_HERE"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
- **Cause**: Missing or invalid JWT token
- **Solution**: Login again and copy the fresh token

### Issue: 500 Insufficient Availability
- **Cause**: Not enough rooms available for requested dates
- **Solution**: Check availability first or reduce quantity

### Issue: 404 Hotel Not Found
- **Cause**: Hotel ID doesn't exist or is inactive
- **Solution**: Use `GET /api/hotels` to find valid hotel IDs

### Issue: 400 Validation Error
- **Cause**: Invalid request format or dates
- **Solution**: Check date format (YYYY-MM-DD) and ensure check-out > check-in

### Issue: Connection Refused
- **Cause**: Application not running
- **Solution**: Start the application with `./mvnw spring-boot:run`

---

## ✅ Success Checklist

- [ ] Login successful and JWT token obtained
- [ ] Availability check returns room categories
- [ ] Booking creation returns 201 Created
- [ ] Booking reference generated (BK-YYYYMMDD-XXXX format)
- [ ] Database shows booking record
- [ ] Database shows booking_rooms records
- [ ] Availability decreased after booking
- [ ] Error scenarios return appropriate status codes

---

## 🎯 Next Steps

After successful Phase 5 testing:
1. **Phase 6**: Implement booking retrieval endpoints
2. **Phase 7**: Add discount code validation
3. **Phase 8**: Implement booking cancellation

---

**Happy Testing! 🚀**
