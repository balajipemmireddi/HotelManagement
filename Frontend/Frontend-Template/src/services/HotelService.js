import API from "../api/axios";
import { MOCK_HOTELS } from "../data/mockHotels";

const IS_DEV = import.meta.env.DEV;

/**
 * HotelService — API calls matching backend hotel endpoints.
 *
 * All functions fall back to mock data in development when the backend
 * is not running, so the UI stays fully functional during frontend-only work.
 *
 * Backend endpoints (Phase 1 & 9):
 *   GET  /api/hotels                  → list all active hotels
 *   GET  /api/hotels/{id}             → single hotel details
 *   GET  /api/hotels/search/advanced  → filtered + paginated search
 */

// ── Helpers ───────────────────────────────────────────

/**
 * Build query string for the advanced search endpoint.
 *
 * Supported params:
 *   location  → searches name and city (frontend-side only; backend uses city)
 *   city      → exact city filter
 *   minStars  → minimum star rating
 *   stars     → Set<number> of selected star ratings (mapped to minStars)
 *   price     → "min-max" string  e.g. "150-300"
 *   amenities → Set<string>
 *   sort      → "price_asc" | "price_desc" | "stars_desc" | "stars_asc"
 *   page      → 0-indexed page number
 *   size      → page size
 */
export function buildSearchParams(filters, page = 0, size = 12) {
  const params = new URLSearchParams();

  // Location → city (backend uses city field)
  if (filters.location?.trim()) {
    params.set("city", filters.location.trim());
  }

  // Star rating — if multiple selected, use the minimum
  if (filters.stars?.size > 0) {
    const minStar = Math.min(...filters.stars);
    params.set("minStars", String(minStar));
  }

  // Price range
  if (filters.priceRange && filters.priceRange !== "0-Infinity") {
    const [min, max] = filters.priceRange.split("-");
    if (Number(min) > 0)          params.set("minPrice", min);
    if (max !== "Infinity")       params.set("maxPrice", max);
  }

  // Amenities — comma-separated list
  if (filters.amenities?.size > 0) {
    params.set("amenities", [...filters.amenities].join(","));
  }

  // Sort mapping: frontend value → backend sort param
  const sortMap = {
    price_asc:  "priceFrom,asc",
    price_desc: "priceFrom,desc",
    stars_desc: "starRating,desc",
    stars_asc:  "starRating,asc",
  };
  if (filters.sort && filters.sort !== "default") {
    params.set("sort", sortMap[filters.sort] ?? "");
  }

  // Pagination
  params.set("page", String(page));
  params.set("size", String(size));

  return params;
}

// ── Mock fallback helpers ─────────────────────────────

function applyMockFilters(hotels, filters) {
  let list = [...hotels];

  if (filters.location?.trim()) {
    const q = filters.location.toLowerCase();
    list = list.filter(
      (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
    );
  }

  if (filters.priceRange && filters.priceRange !== "0-Infinity") {
    const [min, max] = filters.priceRange.split("-");
    const priceMin = Number(min);
    const priceMax = max === "Infinity" ? Infinity : Number(max);
    list = list.filter((h) => h.priceFrom >= priceMin && h.priceFrom <= priceMax);
  }

  if (filters.stars?.size > 0) {
    list = list.filter((h) => filters.stars.has(h.starRating));
  }

  if (filters.amenities?.size > 0) {
    list = list.filter((h) =>
      [...filters.amenities].every((a) => h.amenities?.includes(a))
    );
  }

  switch (filters.sort) {
    case "price_asc":  list.sort((a, b) => a.priceFrom - b.priceFrom);   break;
    case "price_desc": list.sort((a, b) => b.priceFrom - a.priceFrom);   break;
    case "stars_desc": list.sort((a, b) => b.starRating - a.starRating); break;
    case "stars_asc":  list.sort((a, b) => a.starRating - b.starRating); break;
    default: break;
  }

  return list;
}

function paginateMock(list, page, size) {
  const total = list.length;
  const totalPages = Math.ceil(total / size) || 1;
  const safePage = Math.min(page, totalPages - 1);
  const content = list.slice(safePage * size, safePage * size + size);
  return { content, totalElements: total, totalPages, number: safePage, size };
}

// ── API functions ─────────────────────────────────────

/**
 * Fetch all active hotels (no filters).
 * @returns {Promise<Array>}
 */
export const getAllHotels = async () => {
  try {
    const res = await API.get("/api/hotels");
    return res.data;
  } catch {
    if (IS_DEV) return MOCK_HOTELS;
    throw new Error("Failed to load hotels.");
  }
};

/**
 * Fetch a single hotel by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getHotelById = async (id) => {
  try {
    const res = await API.get(`/api/hotels/${id}`);
    return res.data;
  } catch {
    if (IS_DEV) {
      const hotel = MOCK_HOTELS.find((h) => h.id === Number(id));
      if (hotel) return hotel;
    }
    throw new Error("Hotel not found.");
  }
};

/**
 * Advanced search with filters and pagination.
 *
 * @param {Object} filters  — from useHotelFilters
 * @param {number} page     — 0-indexed
 * @param {number} size     — items per page
 * @returns {Promise<{ content, totalElements, totalPages, number, size }>}
 */
export const searchHotels = async (filters, page = 0, size = 12) => {
  try {
    const params = buildSearchParams(filters, page, size);
    const res = await API.get(`/api/hotels/search/advanced?${params.toString()}`);

    // Backend may return a Spring Page object or a plain array
    if (Array.isArray(res.data)) {
      return paginateMock(res.data, page, size);
    }
    return res.data; // Spring Page: { content, totalElements, totalPages, number, size }

  } catch {
    if (IS_DEV) {
      // Graceful fallback: apply filters client-side on mock data
      const filtered = applyMockFilters(MOCK_HOTELS, filters);
      return paginateMock(filtered, page, size);
    }
    throw new Error("Search failed. Please try again.");
  }
};
