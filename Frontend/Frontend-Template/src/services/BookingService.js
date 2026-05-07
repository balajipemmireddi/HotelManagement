import API from "../api/axios";

/**
 * BookingService — API calls matching backend BookingRequestDTO / BookingResponseDTO.
 *
 * BookingRequestDTO (backend Phase 5):
 *   hotelId  : Long
 *   checkIn  : LocalDate
 *   checkOut : LocalDate
 *   rooms    : List<{ categoryId: Long, quantity: Integer }>
 *
 * BookingResponseDTO (backend Phase 5):
 *   bookingReference : String
 *   totalAmount      : Double
 *   status           : String
 */

/**
 * Create a new booking.
 * @param {Object} payload
 * @param {number}   payload.hotelId
 * @param {string}   payload.checkIn   — ISO date "YYYY-MM-DD"
 * @param {string}   payload.checkOut  — ISO date "YYYY-MM-DD"
 * @param {Array}    payload.rooms     — [{ categoryId, quantity }]
 * @returns {Promise<{ bookingReference, totalAmount, status }>}
 */
export const createBooking = async (payload) => {
  try {
    const res = await API.post("/api/bookings", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Booking failed. Please try again.";
  }
};

/**
 * Get all bookings for the current user.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getUserBookings = async (userId) => {
  try {
    const res = await API.get(`/api/bookings/user/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch bookings.";
  }
};

/**
 * Get a single booking by ID.
 * @param {number} bookingId
 * @returns {Promise<Object>}
 */
export const getBookingById = async (bookingId) => {
  try {
    const res = await API.get(`/api/bookings/${bookingId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch booking.";
  }
};

/**
 * Cancel a booking.
 * @param {number} bookingId
 * @returns {Promise<Object>}
 */
export const cancelBooking = async (bookingId) => {
  try {
    const res = await API.put(`/api/bookings/${bookingId}/cancel`);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Cancellation failed.";
  }
};
