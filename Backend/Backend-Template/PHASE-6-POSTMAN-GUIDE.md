# Phase 6 - Postman Testing Guide

## 🚀 Quick Start Testing

This guide helps you test the Phase 6 booking retrieval endpoints using Postman.

---

## Prerequisites

1. **Application Running**: `./mvnw spring-boot:run`
2. **Phase 5 Complete**: At least one booking created
3. **JWT Token**: Valid authentication token
4. **Postman**: Installed and ready

---

## Step 1: Create Test Bookings (if needed)

If you don't have bookings yet, create a few using Phase 5 endpoint:

```http
POST http://localhost:8080/api/bookings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "hotelId": 1,
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "rooms": [
    { "categoryId": 3, "quantity": 1 }
  ],
  "specialRequests": "Early check-in"
}
```

Create 2-3 bookings for better testing.

---

## Step 2: Get User Bookings

### Request

```http
GET http://localhost:8080/api/bookings/user/1
Authorization: Bearer <JWT_TOKEN>
```

**Note**: Replace `1` with your actual user ID (from JWT token or database)

### Postman Setup

1. **Method**: GET
2. **URL**: `http://localhost:8080/api/bookings/user/1`
3. **Headers**:
   - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`

### Expected Response (200 OK)

```json
[
  {
    "id": 1,
    "bookingReference": "BK-20260507-A3F9",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "hotelId": 1,
    "hotelName": "Grand Plaza Hotel",
    "hotelAddress": "123 Main Street, New York",
    "checkInDate": "2026-06-15",
    "checkOutDate": "2026-06-18",
    "totalNights": 3,
    "totalAmount": 450.00,
    "discountAmount": 0.00,
    "finalAmount": 450.00,
    "specialRequests": "Early check-in",
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
      }
    ]
  },
  {
    "id": 2,
    "bookingReference": "BK-20260507-B2K5",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
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

---

## Step 3: Get Specific Booking Details

### Request

```http
GET http://localhost:8080/api/bookings/1
Authorization: Bearer <JWT_TOKEN>
```

**Note**: Replace `1` with an actual booking ID from Step 2

### Postman Setup

1. **Method**: GET
2. **URL**: `http://localhost:8080/api/bookings/1`
3. **Headers**:
   - `Authorization`: `Bearer <YOUR_JWT_TOKEN>`

### Expected Response (200 OK)

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
  "totalAmount": 450.00,
  "discountAmount": 0.00,
  "finalAmount": 450.00,
  "specialRequests": "Early check-in",
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
    }
  ]
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Get Own Bookings (Success)

**Setup**: Login as user, get bookings for same user

```http
GET http://localhost:8080/api/bookings/user/1
Authorization: Bearer <USER_1_JWT_TOKEN>
```

**Expected**: 
- Status: 200 OK
- Body: Array of bookings
- Ordered by creation date (newest first)

**Verify**:
- All bookings belong to the authenticated user
- Booking references are unique
- Dates are in correct format
- Room details are complete

---

### Scenario 2: Get Specific Booking (Success)

**Setup**: Get details of a booking owned by authenticated user

```http
GET http://localhost:8080/api/bookings/1
Authorization: Bearer <OWNER_JWT_TOKEN>
```

**Expected**:
- Status: 200 OK
- Body: Single booking object
- All fields populated

**Verify**:
- Booking reference matches
- Hotel information complete
- All booked rooms listed
- Pricing breakdown correct

---

### Scenario 3: Unauthorized Access to Another User's Bookings (Failure)

**Setup**: Login as user 1, try to access user 2's bookings

**Step 1**: Login as user 1
```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "user1@example.com",
  "password": "password123"
}
```

**Step 2**: Try to access user 2's bookings
```http
GET http://localhost:8080/api/bookings/user/2
Authorization: Bearer <USER_1_JWT_TOKEN>
```

**Expected**:
- Status: 403 Forbidden
- Error message: "You are not authorized to view bookings for user 2"

---

### Scenario 4: Unauthorized Access to Another User's Booking (Failure)

**Setup**: Try to access a booking owned by another user

```http
GET http://localhost:8080/api/bookings/5
Authorization: Bearer <DIFFERENT_USER_JWT_TOKEN>
```

**Expected**:
- Status: 403 Forbidden
- Error message: "You are not authorized to view this booking"

---

### Scenario 5: Booking Not Found (Failure)

**Setup**: Request a non-existent booking ID

```http
GET http://localhost:8080/api/bookings/99999
Authorization: Bearer <JWT_TOKEN>
```

**Expected**:
- Status: 404 Not Found
- Error message: "Booking not found with id: 99999"

---

### Scenario 6: No Authentication (Failure)

**Setup**: Request without JWT token

```http
GET http://localhost:8080/api/bookings/user/1
```

**Expected**:
- Status: 401 Unauthorized
- Error message: "Full authentication is required to access this resource"

---

### Scenario 7: Empty Booking List (Success)

**Setup**: New user with no bookings

```http
GET http://localhost:8080/api/bookings/user/10
Authorization: Bearer <NEW_USER_JWT_TOKEN>
```

**Expected**:
- Status: 200 OK
- Body: Empty array `[]`

---

## 🔍 Verification Steps

### 1. Database Verification

After retrieving bookings, verify in database:

```sql
-- Check user's bookings
SELECT b.id, b.booking_reference, b.status, b.check_in_date, b.check_out_date
FROM bookings b
WHERE b.user_id = 1
ORDER BY b.created_at DESC;

-- Check booking details
SELECT 
    b.booking_reference,
    h.name AS hotel_name,
    br.room_id,
    r.room_number,
    rc.category_name,
    br.price_per_night
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
JOIN booking_rooms br ON br.booking_id = b.id
JOIN rooms r ON br.room_id = r.id
JOIN room_categories rc ON br.room_category_id = rc.id
WHERE b.id = 1;
```

### 2. Response Validation

Check that response includes:
- ✅ Booking reference (BK-YYYYMMDD-XXXX format)
- ✅ Status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- ✅ Payment status (PENDING, PAID, REFUNDED)
- ✅ Hotel details (name, address)
- ✅ Date range (check-in, check-out, total nights)
- ✅ Pricing (total, discount, final amounts)
- ✅ Room details (room number, category, price)
- ✅ Timestamps (createdAt, updatedAt)

### 3. Authorization Validation

Verify security:
- ✅ Users can access their own bookings
- ✅ Users CANNOT access other users' bookings
- ✅ Unauthenticated requests are rejected
- ✅ Invalid tokens are rejected

---

## 📊 Postman Collection (JSON)

Save this as a Postman collection:

```json
{
  "info": {
    "name": "Phase 6 - Booking Retrieval",
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
      "name": "2. Get User Bookings",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/bookings/user/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "bookings", "user", "1"]
        }
      }
    },
    {
      "name": "3. Get Booking Details",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/bookings/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "bookings", "1"]
        }
      }
    },
    {
      "name": "4. Unauthorized Access (Should Fail)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/bookings/user/999",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "bookings", "user", "999"]
        }
      }
    },
    {
      "name": "5. Booking Not Found (Should Fail)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/bookings/99999",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "bookings", "99999"]
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

### Issue: 403 Forbidden
- **Cause**: Trying to access another user's bookings
- **Solution**: Use correct user ID matching your JWT token

### Issue: 404 Not Found
- **Cause**: Booking ID doesn't exist
- **Solution**: Use valid booking ID from user's booking list

### Issue: Empty Array Returned
- **Cause**: User has no bookings yet
- **Solution**: Create a booking using Phase 5 endpoint first

### Issue: Connection Refused
- **Cause**: Application not running
- **Solution**: Start with `./mvnw spring-boot:run`

---

## ✅ Success Checklist

- [ ] Login successful and JWT token obtained
- [ ] Get user bookings returns 200 OK
- [ ] Booking list shows all user's bookings
- [ ] Get booking details returns complete information
- [ ] Unauthorized access returns 403 Forbidden
- [ ] Non-existent booking returns 404 Not Found
- [ ] No token returns 401 Unauthorized
- [ ] Database records match API responses

---

## 🎯 Frontend Integration Tips

### Booking List Page

**API Call**:
```javascript
fetch(`/api/bookings/user/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Display**:
- Show booking cards with key info
- Add status badges (color-coded)
- Make booking reference clickable
- Add filters (upcoming, past, cancelled)

### Booking Details Page

**API Call**:
```javascript
fetch(`/api/bookings/${bookingId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Display**:
- Full booking information
- Room list with images
- Pricing breakdown
- Print/download button
- Cancel button (Phase 8)

---

## 🚀 Next Steps

After successful Phase 6 testing:
1. **Phase 7**: Implement discount code validation
2. **Phase 8**: Add booking cancellation
3. **Phase 10**: Email notifications

---

**Happy Testing! 🚀**
