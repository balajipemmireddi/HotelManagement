# Phase 5 - Quick Reference Card

## 🚀 Endpoint

```
POST /api/bookings
Authorization: Bearer <JWT_TOKEN>
```

---

## 📥 Request Format

```json
{
  "hotelId": 1,
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "rooms": [
    { "categoryId": 3, "quantity": 2 },
    { "categoryId": 5, "quantity": 1 }
  ],
  "specialRequests": "Late check-in"
}
```

---

## 📤 Response Format (201 Created)

```json
{
  "bookingReference": "BK-20260507-A3F9",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "hotelName": "Grand Plaza Hotel",
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-18",
  "totalNights": 3,
  "totalAmount": 1650.00,
  "finalAmount": 1650.00,
  "bookedRooms": [
    {
      "roomNumber": "201",
      "categoryName": "Deluxe King",
      "pricePerNight": 150.00,
      "subtotal": 450.00
    }
  ]
}
```

---

## 🔑 Key Features

- ✅ **Atomic Transaction** - All-or-nothing booking
- ✅ **Room Locking** - Specific rooms allocated
- ✅ **Price Snapshot** - Immune to future price changes
- ✅ **Unique Reference** - BK-YYYYMMDD-XXXX format
- ✅ **JWT Required** - Authenticated users only

---

## 📁 Files Created

```
dto/booking/
├── BookingRequestDTO.java
└── BookingResponseDTO.java

repository/
├── BookingRepo.java
└── BookingRoomRepo.java

mapper/
└── BookingMapper.java

service/
└── BookingService.java

controller/
└── BookingController.java
```

---

## 🔄 Transaction Flow

```
1. Validate (user, hotel, dates)
2. Check availability
3. Allocate specific rooms
4. Calculate pricing
5. Generate booking reference
6. Create booking (PENDING)
7. Lock rooms (BookingRoom records)
8. Return response
```

---

## ⚠️ Validation Rules

| Rule | Error Message |
|------|---------------|
| Check-out > Check-in | "Check-out date must be after check-in date" |
| Check-in not in past | "Check-in date cannot be in the past" |
| Max 30 nights | "Maximum stay duration is 30 nights" |
| Hotel exists | "Hotel not found or inactive with id: X" |
| Category belongs to hotel | "Room category X does not belong to hotel Y" |
| Sufficient availability | "Insufficient availability for category..." |

---

## 🧪 Quick Test (Postman)

1. **Login**: `POST /login` → Get JWT token
2. **Check Availability**: `GET /api/availability/search?hotelId=1&checkIn=2026-06-15&checkOut=2026-06-18&guests=2`
3. **Create Booking**: `POST /api/bookings` with JWT token

---

## 🗄️ Database Tables

### bookings
```sql
id, user_id, hotel_id, booking_reference,
check_in_date, check_out_date, total_nights,
total_amount, discount_amount, final_amount,
status, payment_status, special_requests,
created_at, updated_at
```

### booking_rooms
```sql
id, booking_id, room_id, room_category_id,
price_per_night, number_of_nights
```

---

## 🔍 Verify Booking

```sql
-- Find booking
SELECT * FROM bookings 
WHERE booking_reference = 'BK-20260507-A3F9';

-- Check allocated rooms
SELECT br.*, r.room_number, rc.category_name
FROM booking_rooms br
JOIN rooms r ON br.room_id = r.id
JOIN room_categories rc ON br.room_category_id = rc.id
WHERE br.booking_id = 1;
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Add JWT token to Authorization header |
| 500 Insufficient availability | Reduce quantity or change dates |
| 404 Hotel not found | Use valid hotel ID from GET /api/hotels |
| 400 Validation error | Check date format (YYYY-MM-DD) |

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 201 | Booking created successfully |
| 400 | Invalid request (validation error) |
| 401 | Unauthorized (missing/invalid JWT) |
| 404 | Hotel or category not found |
| 500 | Server error (insufficient availability, etc.) |

---

## 🎯 Next Phase

**Phase 6**: Booking retrieval endpoints
- `GET /api/bookings/user/{userId}` - User history
- `GET /api/bookings/{id}` - Booking details

---

## 📚 Documentation

- **PHASE-5-COMPLETION.md** - Full implementation details
- **PHASE-5-POSTMAN-GUIDE.md** - Testing scenarios
- **PHASE-5-SUMMARY.md** - Implementation summary
- **PHASE-5-QUICK-REFERENCE.md** - This card

---

**Build Status**: ✅ SUCCESS  
**Phase Status**: ✅ COMPLETE  
**Ready for Production**: ✅ YES (after testing)
