/**
 * Mock booking history data matching BookingResponseDTO from the backend.
 *
 * BookingResponseDTO shape (backend Phase 5 & 6):
 *   bookingReference : String
 *   totalAmount      : Double
 *   status           : String  — CONFIRMED | CANCELLED | COMPLETED | PENDING
 *
 * Extra display fields (hotelId, hotelName, city, image, checkIn, checkOut,
 * rooms, guestName) are frontend-only until Phase 10 wires real API data.
 *
 * Will be replaced by GET /api/bookings/user/{userId} in Phase 10.
 */
export const MOCK_BOOKINGS = [
  {
    id: 1001,
    bookingReference: "SE-A3F9K2",
    status: "CONFIRMED",
    hotelId: 1,
    hotelName: "The Grand Horizon",
    city: "New York",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    checkIn:  "2026-06-15",
    checkOut: "2026-06-18",
    rooms: [{ categoryName: "Deluxe King Room", quantity: 1, basePrice: 320 }],
    totalAmount: 960,
    bookedOn: "2026-05-01",
  },
  {
    id: 1002,
    bookingReference: "SE-B7M1P5",
    status: "CONFIRMED",
    hotelId: 3,
    hotelName: "Eiffel View Palace",
    city: "Paris",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
    checkIn:  "2026-07-20",
    checkOut: "2026-07-25",
    rooms: [
      { categoryName: "Eiffel View Room", quantity: 1, basePrice: 620 },
    ],
    totalAmount: 3100,
    bookedOn: "2026-05-03",
  },
  {
    id: 1003,
    bookingReference: "SE-C2X8R4",
    status: "COMPLETED",
    hotelId: 4,
    hotelName: "Sakura Garden Hotel",
    city: "Tokyo",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
    checkIn:  "2026-03-10",
    checkOut: "2026-03-14",
    rooms: [{ categoryName: "Zen Suite", quantity: 1, basePrice: 490 }],
    totalAmount: 1960,
    bookedOn: "2026-02-15",
  },
  {
    id: 1004,
    bookingReference: "SE-D5N3Q7",
    status: "CANCELLED",
    hotelId: 7,
    hotelName: "Harbour Lights Hotel",
    city: "Sydney",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80",
    checkIn:  "2026-04-05",
    checkOut: "2026-04-08",
    rooms: [{ categoryName: "Harbour View Room", quantity: 1, basePrice: 340 }],
    totalAmount: 1020,
    bookedOn: "2026-03-01",
  },
  {
    id: 1005,
    bookingReference: "SE-E9L6W2",
    status: "COMPLETED",
    hotelId: 10,
    hotelName: "Zen Retreat Bangkok",
    city: "Bangkok",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80",
    checkIn:  "2026-01-20",
    checkOut: "2026-01-23",
    rooms: [{ categoryName: "Deluxe Room", quantity: 2, basePrice: 135 }],
    totalAmount: 810,
    bookedOn: "2025-12-28",
  },
];
