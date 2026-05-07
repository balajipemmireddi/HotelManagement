import { Form, Button, Badge } from "react-bootstrap";

// Amenity options — frontend-only until Phase 10 wires real data
const AMENITY_OPTIONS = [
  { id: "wifi",       label: "Free WiFi",       icon: "📶" },
  { id: "pool",       label: "Swimming Pool",   icon: "🏊" },
  { id: "parking",    label: "Free Parking",    icon: "🅿️" },
  { id: "gym",        label: "Fitness Centre",  icon: "🏋️" },
  { id: "spa",        label: "Spa & Wellness",  icon: "💆" },
  { id: "restaurant", label: "Restaurant",      icon: "🍽️" },
  { id: "bar",        label: "Bar / Lounge",    icon: "🍸" },
  { id: "breakfast",  label: "Breakfast Incl.", icon: "🥐" },
];

const PRICE_RANGES = [
  { label: "Any price",      min: 0,   max: Infinity },
  { label: "Under $150",     min: 0,   max: 150      },
  { label: "$150 – $300",    min: 150, max: 300      },
  { label: "$300 – $500",    min: 300, max: 500      },
  { label: "Over $500",      min: 500, max: Infinity },
];

/**
 * FilterSidebar — Price range, Star rating, Amenities.
 *
 * Props:
 *   filters  : { priceRange, stars: Set<number>, amenities: Set<string> }
 *   onChange : (field, value) => void
 *   onClear  : () => void
 *   count    : number  — active filter count for the badge
 */
export default function FilterSidebar({ filters, onChange, onClear, count }) {
  // Toggle a value in a Set-like array
  const toggleSet = (field, value) => {
    const current = new Set(filters[field]);
    current.has(value) ? current.delete(value) : current.add(value);
    onChange(field, current);
  };

  return (
    <div
      className="bg-white rounded shadow-sm p-3"
      style={{ position: "sticky", top: "80px" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">
          Filters{" "}
          {count > 0 && (
            <Badge bg="danger" pill style={{ fontSize: "0.7rem" }}>
              {count}
            </Badge>
          )}
        </h6>
        {count > 0 && (
          <Button
            variant="link"
            size="sm"
            className="p-0 text-muted text-decoration-none"
            onClick={onClear}
          >
            Clear all
          </Button>
        )}
      </div>

      <hr className="my-2" />

      {/* ── Price Range ── */}
      <div className="mb-3">
        <p className="small fw-semibold text-uppercase text-muted mb-2"
           style={{ letterSpacing: "0.06em", fontSize: "0.72rem" }}>
          Price per Night
        </p>
        {PRICE_RANGES.map((range) => {
          const key = `${range.min}-${range.max}`;
          return (
            <Form.Check
              key={key}
              type="radio"
              id={`price-${key}`}
              name="priceRange"
              label={range.label}
              className="small mb-1"
              checked={filters.priceRange === key}
              onChange={() => onChange("priceRange", key)}
            />
          );
        })}
      </div>

      <hr className="my-2" />

      {/* ── Star Rating ── */}
      <div className="mb-3">
        <p className="small fw-semibold text-uppercase text-muted mb-2"
           style={{ letterSpacing: "0.06em", fontSize: "0.72rem" }}>
          Star Rating
        </p>
        {[5, 4, 3, 2, 1].map((star) => (
          <Form.Check
            key={star}
            type="checkbox"
            id={`star-${star}`}
            className="small mb-1"
            label={
              <span style={{ color: "#f5a623" }}>
                {"★".repeat(star)}{"☆".repeat(5 - star)}
              </span>
            }
            checked={filters.stars.has(star)}
            onChange={() => toggleSet("stars", star)}
          />
        ))}
      </div>

      <hr className="my-2" />

      {/* ── Amenities ── */}
      <div>
        <p className="small fw-semibold text-uppercase text-muted mb-2"
           style={{ letterSpacing: "0.06em", fontSize: "0.72rem" }}>
          Amenities
        </p>
        {AMENITY_OPTIONS.map((a) => (
          <Form.Check
            key={a.id}
            type="checkbox"
            id={`amenity-${a.id}`}
            className="small mb-1"
            label={`${a.icon} ${a.label}`}
            checked={filters.amenities.has(a.id)}
            onChange={() => toggleSet("amenities", a.id)}
          />
        ))}
      </div>
    </div>
  );
}
