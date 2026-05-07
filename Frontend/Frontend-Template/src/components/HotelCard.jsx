import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * HotelCard — displays a single hotel matching HotelResponseDTO.
 *
 * Props:
 *   hotel: { id, name, city, starRating, priceFrom, description, image }
 */
export default function HotelCard({ hotel }) {
  const navigate = useNavigate();

  // Build star string e.g. "★★★★☆" for a 4-star hotel
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < hotel.starRating ? "★" : "☆"
  ).join("");

  // Badge colour by star tier
  const starBadgeVariant =
    hotel.starRating === 5
      ? "warning"
      : hotel.starRating === 4
      ? "info"
      : "secondary";

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Hotel image */}
      <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
        <Card.Img
          variant="top"
          src={hotel.image}
          alt={hotel.name}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";
          }}
        />
        {/* Star rating badge overlaid on image */}
        <Badge
          bg={starBadgeVariant}
          className="position-absolute"
          style={{ top: "10px", right: "10px", fontSize: "0.75rem" }}
        >
          {hotel.starRating}★
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Hotel name */}
        <Card.Title
          className="fw-bold mb-1"
          style={{ fontSize: "1rem", lineHeight: 1.3 }}
        >
          {hotel.name}
        </Card.Title>

        {/* City */}
        <p className="text-muted small mb-1">
          📍 {hotel.city}
        </p>

        {/* Star display */}
        <p className="mb-2" style={{ color: "#f5a623", fontSize: "0.9rem", letterSpacing: "2px" }}>
          {stars}
        </p>

        {/* Description — clamped to 2 lines */}
        <Card.Text
          className="text-muted small flex-grow-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {hotel.description}
        </Card.Text>

        {/* Price + CTA */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span className="text-muted small">From </span>
            <span className="fw-bold fs-5" style={{ color: "#0f3460" }}>
              ${hotel.priceFrom}
            </span>
            <span className="text-muted small"> /night</span>
          </div>
          <Button
            size="sm"
            style={{ backgroundColor: "#e94560", border: "none" }}
            onClick={() => navigate(`/hotels/${hotel.id}`)}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
