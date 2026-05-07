import API from "../api/axios";
import { MOCK_HOTELS } from "../data/mockHotels";

const IS_DEV = import.meta.env.DEV;

/**
 * AdminService — admin-only API calls.
 *
 * Backend endpoints (Phase 1, 2, 11):
 *   POST   /api/hotels              → create hotel (Admin)
 *   PUT    /api/hotels/{id}         → update hotel (Admin)
 *   DELETE /api/hotels/{id}         → delete hotel (Admin)
 *   POST   /api/room-categories     → create room category
 *   GET    /api/hotels/{id}/rooms   → list room categories for a hotel
 *   GET    /api/admin/revenue       → revenue report
 *   GET    /api/admin/occupancy     → occupancy rates
 *
 * All functions fall back to mock behaviour in dev when backend is offline.
 */

// ── Hotel CRUD ────────────────────────────────────────

export const adminGetAllHotels = async () => {
  try {
    const res = await API.get("/api/hotels");
    return Array.isArray(res.data) ? res.data : res.data.content ?? [];
  } catch {
    if (IS_DEV) return [...MOCK_HOTELS];
    throw new Error("Failed to load hotels.");
  }
};

export const adminCreateHotel = async (hotelData) => {
  try {
    const res = await API.post("/api/hotels", hotelData);
    return res.data;
  } catch {
    if (IS_DEV) {
      // Mock: return a fake created hotel
      return {
        id: Date.now(),
        ...hotelData,
        isActive: true,
      };
    }
    throw new Error("Failed to create hotel.");
  }
};

export const adminUpdateHotel = async (id, hotelData) => {
  try {
    const res = await API.put(`/api/hotels/${id}`, hotelData);
    return res.data;
  } catch {
    if (IS_DEV) return { id, ...hotelData };
    throw new Error("Failed to update hotel.");
  }
};

export const adminDeleteHotel = async (id) => {
  try {
    await API.delete(`/api/hotels/${id}`);
    return true;
  } catch {
    if (IS_DEV) return true; // mock success
    throw new Error("Failed to delete hotel.");
  }
};

// ── Room Category ─────────────────────────────────────

export const adminGetRoomCategories = async (hotelId) => {
  try {
    const res = await API.get(`/api/hotels/${hotelId}/rooms`);
    return res.data;
  } catch {
    if (IS_DEV) {
      const hotel = MOCK_HOTELS.find((h) => h.id === Number(hotelId));
      return hotel?.roomCategories ?? [];
    }
    throw new Error("Failed to load room categories.");
  }
};

export const adminCreateRoomCategory = async (categoryData) => {
  try {
    const res = await API.post("/api/room-categories", categoryData);
    return res.data;
  } catch {
    if (IS_DEV) return { id: Date.now(), ...categoryData };
    throw new Error("Failed to create room category.");
  }
};

/**
 * Toggle room status between AVAILABLE / MAINTENANCE / CLEANING.
 * Maps to PUT /api/rooms/{id}/status in a real backend.
 */
export const adminToggleRoomStatus = async (roomId, newStatus) => {
  try {
    const res = await API.put(`/api/rooms/${roomId}/status`, { status: newStatus });
    return res.data;
  } catch {
    if (IS_DEV) return { id: roomId, status: newStatus };
    throw new Error("Failed to update room status.");
  }
};

// ── Reporting ─────────────────────────────────────────

export const adminGetRevenue = async (startDate, endDate) => {
  try {
    const res = await API.get("/api/admin/revenue", { params: { startDate, endDate } });
    return res.data;
  } catch {
    if (IS_DEV) return { totalRevenue: 128450, bookingCount: 312, period: `${startDate} – ${endDate}` };
    throw new Error("Failed to load revenue data.");
  }
};

export const adminGetOccupancy = async () => {
  try {
    const res = await API.get("/api/admin/occupancy");
    return res.data;
  } catch {
    if (IS_DEV) {
      return MOCK_HOTELS.slice(0, 5).map((h) => ({
        hotelId:   h.id,
        hotelName: h.name,
        occupancyRate: Math.floor(Math.random() * 40 + 55), // 55–95%
      }));
    }
    throw new Error("Failed to load occupancy data.");
  }
};
