import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * useHotelFilters — manages all hotel filter state via URL query params.
 *
 * URL params used:
 *   location  — text search (name or city)
 *   checkIn   — ISO date string
 *   checkOut  — ISO date string
 *   guests    — number (default 1)
 *   price     — "min-max" string e.g. "150-300"
 *   stars     — comma-separated e.g. "4,5"
 *   amenities — comma-separated e.g. "wifi,pool"
 *   sort      — one of: default | price_asc | price_desc | stars_desc | stars_asc
 */
export function useHotelFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Read helpers ──────────────────────────────────────
  const get = (key, fallback = "") => searchParams.get(key) ?? fallback;

  const getSet = (key) => {
    const raw = searchParams.get(key);
    if (!raw) return new Set();
    return new Set(raw.split(",").filter(Boolean));
  };

  // ── Current filter values ─────────────────────────────
  const filters = useMemo(() => ({
    // SearchBar fields
    location: get("location"),
    checkIn:  get("checkIn"),
    checkOut: get("checkOut"),
    guests:   get("guests", "1"),

    // Sidebar fields
    priceRange: get("price", "0-Infinity"),
    stars:      new Set(
      (searchParams.get("stars") ?? "")
        .split(",")
        .filter(Boolean)
        .map(Number)
    ),
    amenities: getSet("amenities"),

    // Sort
    sort: get("sort", "default"),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [searchParams]);

  // ── Write helper — merges a partial update into current params ──
  const setFilter = useCallback((field, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (field === "stars") {
        // value is a Set<number>
        const arr = [...value];
        arr.length ? next.set("stars", arr.join(",")) : next.delete("stars");

      } else if (field === "amenities") {
        // value is a Set<string>
        const arr = [...value];
        arr.length ? next.set("amenities", arr.join(",")) : next.delete("amenities");

      } else if (field === "priceRange") {
        value === "0-Infinity"
          ? next.delete("price")
          : next.set("price", value);

      } else if (value === "" || value === null || value === undefined) {
        next.delete(field);

      } else {
        next.set(field, String(value));
      }

      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // ── Bulk update for SearchBar (apply all at once) ─────
  const applySearch = useCallback((searchValues) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(searchValues).forEach(([k, v]) => {
        v ? next.set(k, String(v)) : next.delete(k);
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // ── Clear all filters ─────────────────────────────────
  const clearAll = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // ── Active filter count (for badge) ──────────────────
  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.priceRange !== "0-Infinity") n++;
    if (filters.stars.size > 0) n++;
    if (filters.amenities.size > 0) n++;
    return n;
  }, [filters]);

  return { filters, setFilter, applySearch, clearAll, activeCount };
}
