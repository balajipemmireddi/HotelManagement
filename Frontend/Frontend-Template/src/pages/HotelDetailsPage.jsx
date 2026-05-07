import { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  Card,
  Image,
} from "react-bootstrap";
import { MOCK_HOTELS } from "../data/mockHotels";
import RoomCategoryList from "../components/RoomCategoryList";

// Amenity display map
const AMENITY_META = {
  wifi:        { icon: "📶", label: "Free WiFi"        },
  pool:        { icon: "🏊", label: "Swimming Pool"    },
  parking:     { icon: "🅿️", label: "Free Parking"    },
  gym:         { icon: "🏋️", label: "Fitness Centre"  },
  spa:         { icon: "💆", label: "Spa & Wellness"   },
  restaurant:  { icon: "🍽️", label: "Restaurant"      },
  bar:         { icon: "🍸", label: "Bar / Lounge"     },
  breakfast:   { icon: "🥐", label: "Breakfast Incl."  },
};

export default function HotelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Carry search context forward to booking if user came from search
  const checkIn  = searchParams.get("checkIn")  || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests   = searchParams.get("guests")   || "1";

  // Find hotel in mock data
  const hotel = MOCK_HOTELS.find((h) => h.id === Number(id));

  // Active gallery image index
  const [activeImg, setActiveImg] = useState(0);

  // ── 404 state ────────────────────────────────────────
  if (!hotel) {
    return (
      <Container className="py-5 text-center text-muted">
        <div style={{ fontSize: "3rem" }}>🏨</div>
        <h4 className="mt-3">Hotel not found</h4>
        <p className="small">The hotel you're looking for doesn't exist.</p>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => navigate("/hotels")}
        >
          ← Back to Hotels
        </Button>
      </Container>
    );
  }

  // All images: hero + gallery
  const allImages = [hotel.image, ...(hotel.gallery || [])];

  // Star string
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < hotel.starRating ? "★" : "☆"
  ).join("");

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e9ecef" }}>
        <Container className="py-2">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/hotels" className="text-decoration-none">Hotels</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {hotel.name}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="g-4">

          {/* ══════════════════════════════════════════
              LEFT COLUMN — Images + Details
          ══════════════════════════════════════════ */}
          <Col lg={8}>

            {/* ── Image Gallery ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "12px", overflow: "hidden" }}>
              {/* Main image */}
              <div style={{ height: "380px", overflow: "hidden" }}>
                <Image
                  src={allImages[activeImg]}
                  alt={hotel.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.src = hotel.image; }}
                />
              </div>
              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="d-flex gap-2 p-2" style={{ overflowX: "auto" }}>
                  {allImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      style={{
                        width: "80px",
                        height: "60px",
                        flexShrink: 0,
                        borderRadius: "6px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: activeImg === idx
                          ? "2px solid #e94560"
                          : "2px solid transparent",
                        opacity: activeImg === idx ? 1 : 0.65,
                        transition: "opacity 0.2s, border 0.2s",
                      }}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.currentTarget.src = hotel.image; }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* ── Hotel Header ── */}
            <div className="mb-4">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                <div>
                  <h1 className="fw-bold mb-1" style={{ fontSize: "1.75rem" }}>
                    {hotel.name}
                  </h1>
                  <p className="text-muted mb-1">
                    📍 {hotel.address}
                  </p>
                  <p style={{ color: "#f5a623", fontSize: "1.1rem", letterSpacing: "2px" }}>
                    {stars}
                    <span className="text-muted ms-2" style={{ fontSize: "0.85rem", letterSpacing: 0 }}>
                      {hotel.starRating}-Star Hotel
                    </span>
                  </p>
                </div>
                <div className="text-end">
                  <div className="text-muted small">From</div>
                  <span className="fw-bold" style={{ fontSize: "1.75rem", color: "#0f3460" }}>
                    ${hotel.priceFrom}
                  </span>
                  <div className="text-muted small">per night</div>
                </div>
              </div>
            </div>

            {/* ── Description ── */}
            <Card className="border-0 shadow-sm mb-4 p-3" style={{ borderRadius: "10px" }}>
              <h5 className="fw-bold mb-2">About this hotel</h5>
              <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                {hotel.description}
              </p>
            </Card>

            {/* ── Amenities ── */}
            <Card className="border-0 shadow-sm mb-4 p-3" style={{ borderRadius: "10px" }}>
              <h5 className="fw-bold mb-3">Amenities</h5>
              <Row className="g-2">
                {hotel.amenities.map((key) => {
                  const meta = AMENITY_META[key];
                  if (!meta) return null;
                  return (
                    <Col xs={6} sm={4} md={3} key={key}>
                      <div
                        className="d-flex align-items-center gap-2 p-2 rounded"
                        style={{ backgroundColor: "#f8f9fa", fontSize: "0.85rem" }}
                      >
                        <span>{meta.icon}</span>
                        <span className="text-muted">{meta.label}</span>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card>

            {/* ── Location Map Placeholder ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "10px", overflow: "hidden" }}>
              <div
                className="d-flex flex-column align-items-center justify-content-center text-muted"
                style={{
                  height: "220px",
                  background: "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)",
                }}
              >
                <div style={{ fontSize: "2.5rem" }}>🗺️</div>
                <p className="fw-semibold mt-2 mb-1">Map View</p>
                <p className="small mb-0">{hotel.address}</p>
                <Badge bg="secondary" className="mt-2 small">
                  Interactive map available in production
                </Badge>
              </div>
            </Card>

            {/* ── Room Categories ── */}
            <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "10px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Available Room Types</h5>
                <Badge bg="light" text="dark" className="border">
                  {hotel.roomCategories.length} types
                </Badge>
              </div>

              {/* Date context strip — shown if user came from search */}
              {(checkIn || checkOut) && (
                <div
                  className="d-flex gap-3 p-2 rounded mb-3 small"
                  style={{ backgroundColor: "#f0f4ff", border: "1px solid #c7d2fe" }}
                >
                  {checkIn && (
                    <span>📅 Check-in: <strong>{checkIn}</strong></span>
                  )}
                  {checkOut && (
                    <span>📅 Check-out: <strong>{checkOut}</strong></span>
                  )}
                  {guests && (
                    <span>👤 Guests: <strong>{guests}</strong></span>
                  )}
                </div>
              )}

              <RoomCategoryList
                rooms={hotel.roomCategories}
                hotelId={hotel.id}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
              />
            </Card>
          </Col>

          {/* ══════════════════════════════════════════
              RIGHT COLUMN — Sticky booking summary
          ══════════════════════════════════════════ */}
          <Col lg={4}>
            <Card
              className="border-0 shadow"
              style={{ borderRadius: "12px", position: "sticky", top: "80px" }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-1">{hotel.name}</h5>
                <p className="text-muted small mb-3">📍 {hotel.city}</p>

                <hr />

                {/* Price summary */}
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">Starting from</span>
                  <span className="fw-bold fs-4" style={{ color: "#0f3460" }}>
                    ${hotel.priceFrom}
                  </span>
                </div>
                <p className="text-muted small mb-3">per night · taxes not included</p>

                {/* Quick date inputs */}
                <div className="mb-2">
                  <label className="small fw-semibold text-muted mb-1 d-block">
                    📅 Check-in
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    defaultValue={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    id="sidebar-checkin"
                  />
                </div>
                <div className="mb-2">
                  <label className="small fw-semibold text-muted mb-1 d-block">
                    📅 Check-out
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    defaultValue={checkOut}
                    min={new Date().toISOString().split("T")[0]}
                    id="sidebar-checkout"
                  />
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1 d-block">
                    👤 Guests
                  </label>
                  <select
                    className="form-select form-select-sm"
                    defaultValue={guests}
                    id="sidebar-guests"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <hr />

                {/* Highlights */}
                <ul className="list-unstyled small text-muted mb-3">
                  <li className="mb-1">✓ Free cancellation on most rooms</li>
                  <li className="mb-1">✓ No prepayment needed</li>
                  <li className="mb-1">✓ Instant confirmation</li>
                </ul>

                {/* CTA — scrolls to room list on mobile */}
                <Button
                  className="w-100"
                  style={{ backgroundColor: "#e94560", border: "none" }}
                  onClick={() => {
                    document
                      .querySelector("[data-room-list]")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Room Options
                </Button>

                <Button
                  variant="outline-secondary"
                  className="w-100 mt-2"
                  size="sm"
                  onClick={() => navigate("/hotels")}
                >
                  ← Back to Hotels
                </Button>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
}
