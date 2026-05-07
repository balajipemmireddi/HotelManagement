import { useSearchParams } from "react-router-dom";

/**
 * useHotelFilters
 *
 * This hook reads and writes all hotel filter values directly from/to
 * the browser's URL query string (e.g. ?location=Paris&stars=4,5).
 *
 * Why the URL? So filters survive a page refresh and can be shared as a link.
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

  // ── Read current filter values from the URL ───────────
  // Helper: get a single param, with an optional fallback value
  function getParam(key, fallback = "") {
    return searchParams.get(key) ?? fallback;
  }

  // Helper: get a comma-separated param as a Set (e.g. "wifi,pool" → Set{"wifi","pool"})
  function getSetParam(key) {
    const raw = searchParams.get(key);
    if (!raw) return new Set();
    return new Set(raw.split(",").filter(Boolean));
  }

  // Build the current filters object from the URL
  const filters = {
    location:   getParam("location"),
    checkIn:    getParam("checkIn"),
    checkOut:   getParam("checkOut"),
    guests:     getParam("guests", "1"),
    priceRange: getParam("price", "0-Infinity"),
    sort:       getParam("sort", "default"),

    // Stars come in as "4,5" — convert to a Set of numbers
    stars: new Set(
      (searchParams.get("stars") ?? "")
        .split(",")
        .filter(Boolean)
        .map(Number)
    ),

    // Amenities come in as "wifi,pool" — convert to a Set of strings
    amenities: getSetParam("amenities"),
  };

  // ── Write a single filter value back to the URL ───────
  function setFilter(field, value) {
    // We copy the current params so we don't lose other filters
    const next = new URLSearchParams(searchParams);

    if (field === "stars") {
      // value is a Set<number> — convert back to "4,5" string
      const arr = [...value];
      if (arr.length > 0) {
        next.set("stars", arr.join(","));
      } else {
        next.delete("stars");
      }

    } else if (field === "amenities") {
      // value is a Set<string> — convert back to "wifi,pool" string
      const arr = [...value];
      if (arr.length > 0) {
        next.set("amenities", arr.join(","));
      } else {
        next.delete("amenities");
      }

    } else if (field === "priceRange") {
      // "0-Infinity" means no price filter — remove the param
      if (value === "0-Infinity") {
        next.delete("price");
      } else {
        next.set("price", value);
      }

    } else if (value === "" || value === null || value === undefined) {
      // Empty value means the filter was cleared — remove the param
      next.delete(field);

    } else {
      next.set(field, String(value));
    }

    // replace: true means the back button won't step through every filter change
    setSearchParams(next, { replace: true });
  }

  // ── Apply all SearchBar fields at once ────────────────
  // Called when the user clicks the Search button
  function applySearch(searchValues) {
    const next = new URLSearchParams(searchParams);

    Object.entries(searchValues).forEach(([key, value]) => {
      if (value) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next, { replace: true });
  }

  // ── Clear every filter at once ────────────────────────
  function clearAll() {
    setSearchParams({}, { replace: true });
  }

  // ── Count how many sidebar filters are active ─────────
  // Used to show the red badge on the Filters button
  let activeCount = 0;
  if (filters.priceRange !== "0-Infinity") activeCount++;
  if (filters.stars.size > 0) activeCount++;
  if (filters.amenities.size > 0) activeCount++;

  return { filters, setFilter, applySearch, clearAll, activeCount };
}
