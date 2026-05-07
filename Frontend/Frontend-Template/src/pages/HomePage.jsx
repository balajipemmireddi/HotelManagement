import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

// Feature highlights shown on the landing page
const FEATURES = [
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Filter by city, dates, guests, price range, and star rating to find your perfect stay.",
  },
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Real-time availability checks and a fast multi-step booking flow — confirmed in minutes.",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    desc: "Your payment details are handled safely with industry-standard encryption.",
  },
  {
    icon: "📋",
    title: "Manage Bookings",
    desc: "View your booking history, check upcoming stays, and cancel with ease from your dashboard.",
  },
];

// Popular destination cards (hardcoded — will be replaced in Phase 10)
const DESTINATIONS = [
  { city: "New York", hotels: 142, emoji: "🗽" },
  { city: "Paris", hotels: 98, emoji: "🗼" },
  { city: "Tokyo", hotels: 211, emoji: "⛩️" },
  { city: "Dubai", hotels: 87, emoji: "🏙️" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          minHeight: "520px",
        }}
        className="d-flex align-items-center py-5"
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="text-white mb-4 mb-lg-0">
              <p
                className="text-uppercase fw-semibold mb-2"
                style={{ color: "#e94560", letterSpacing: "0.1em", fontSize: "0.85rem" }}
              >
                Your Journey Starts Here
              </p>
              <h1 className="display-4 fw-bold mb-3" style={{ lineHeight: 1.2 }}>
                Find Your Perfect <br />
                <span style={{ color: "#e94560" }}>Hotel Stay</span>
              </h1>
              <p className="lead text-secondary mb-4" style={{ maxWidth: "480px" }}>
                Discover thousands of hotels worldwide. Compare prices, read reviews,
                and book instantly — all in one place.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  as={Link}
                  to="/hotels"
                  size="lg"
                  style={{ backgroundColor: "#e94560", border: "none" }}
                >
                  Browse Hotels
                </Button>
                <Button
                  as={Link}
                  to="/signup"
                  size="lg"
                  variant="outline-light"
                >
                  Create Account
                </Button>
              </div>
            </Col>

            {/* Stats strip */}
            <Col lg={5}>
              <Row className="g-3">
                {[
                  { value: "10,000+", label: "Hotels Listed" },
                  { value: "500K+", label: "Happy Guests" },
                  { value: "120+", label: "Countries" },
                  { value: "24/7", label: "Support" },
                ].map((stat) => (
                  <Col xs={6} key={stat.label}>
                    <div
                      className="text-center p-3 rounded"
                      style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                    >
                      <div className="fw-bold fs-4 text-white">{stat.value}</div>
                      <div className="text-secondary small">{stat.label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Popular Destinations</h2>
            <p className="text-muted">Explore top cities loved by our guests</p>
          </div>
          <Row className="g-3 justify-content-center">
            {DESTINATIONS.map((dest) => (
              <Col xs={6} md={3} key={dest.city}>
                <Card
                  as={Link}
                  to={`/hotels?city=${dest.city}`}
                  className="text-center text-decoration-none border-0 shadow-sm h-100"
                  style={{ transition: "transform 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <Card.Body className="py-4">
                    <div style={{ fontSize: "2.5rem" }}>{dest.emoji}</div>
                    <Card.Title className="fw-bold mt-2 mb-1 text-dark">
                      {dest.city}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {dest.hotels} hotels
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Features ── */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Why Choose StayEase?</h2>
            <p className="text-muted">Everything you need for a seamless booking experience</p>
          </div>
          <Row className="g-4">
            {FEATURES.map((f) => (
              <Col md={6} lg={3} key={f.title}>
                <Card className="h-100 border-0 shadow-sm text-center p-3">
                  <Card.Body>
                    <div style={{ fontSize: "2rem" }} className="mb-3">
                      {f.icon}
                    </div>
                    <Card.Title className="fw-semibold fs-6">{f.title}</Card.Title>
                    <Card.Text className="text-muted small">{f.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-5 text-white text-center"
        style={{ backgroundColor: "#0f3460" }}
      >
        <Container>
          <h2 className="fw-bold mb-2">Ready to book your next stay?</h2>
          <p className="text-secondary mb-4">
            Join thousands of travellers who trust StayEase for every trip.
          </p>
          <Button
            as={Link}
            to="/hotels"
            size="lg"
            style={{ backgroundColor: "#e94560", border: "none" }}
          >
            Find Hotels Now
          </Button>
        </Container>
      </section>
    </>
  );
}
