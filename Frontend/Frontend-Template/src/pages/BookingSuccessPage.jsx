import { useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Table } from "react-bootstrap";
import { MOCK_HOTELS } from "../data/mockHotels";
import BookingWizard from "../components/BookingWizard";

/**
 * BookingSuccessPage — Step 3: confirmation screen shown after a successful booking.
 *
 * Receives state from navigate() in BookingConfirmPage:
 *   bookingReference, totalAmount, status, hotelId,
 *   checkIn, checkOut, guest, rooms
 */
export default function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  // Guard: navigated here directly without state
  if (!state?.bookingReference) {
    return (
      <Container className="py-5 text-center text-muted">
        <div style={{ fontSize: "3rem" }}>🔍</div>
        <h5 className="mt-3">No confirmation found</h5>
        <p className="small mb-3">Please complete a booking to see your confirmation.</p>
        <Button as={Link} to="/hotels" style={{ backgroundColor: "#e94560", border: "none" }}>
          Browse Hotels
        </Button>
      </Container>
    );
  }

  const {
    bookingReference,
    totalAmount,
    status,
    hotelId,
    checkIn,
    checkOut,
    guest,
    rooms,
  } = state;

  const hotel = MOCK_HOTELS.find((h) => h.id === Number(hotelId));

  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  })();

  const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          padding: "32px 0 24px",
        }}
      >
        <Container>
          <h1 className="text-white fw-bold mb-0" style={{ fontSize: "1.6rem" }}>
            Booking Confirmed
          </h1>
        </Container>
      </div>

      <Container className="py-4">
        {/* ── Wizard — all steps done ── */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <BookingWizard currentStep={3} />
          </Col>
        </Row>

        {/* ── Success Banner ── */}
        <div
          className="text-center p-4 rounded mb-4 shadow-sm"
          style={{ backgroundColor: "#d4edda", border: "1px solid #c3e6cb" }}
        >
          <div style={{ fontSize: "3rem" }}>🎉</div>
          <h3 className="fw-bold mt-2 mb-1" style={{ color: "#155724" }}>
            Your booking is confirmed!
          </h3>
          <p className="mb-2" style={{ color: "#155724" }}>
            A confirmation email has been sent to{" "}
            <strong>{guest?.email}</strong>
          </p>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded"
               style={{ backgroundColor: "#fff", border: "1px solid #c3e6cb" }}>
            <span className="text-muted small">Booking Reference</span>
            <span className="fw-bold fs-5" style={{ color: "#0f3460", letterSpacing: "0.05em" }}>
              {bookingReference}
            </span>
            <Badge bg="success">{status}</Badge>
          </div>
        </div>

        <Row className="g-4">
          {/* ── Left: Booking Details ── */}
          <Col xs={12} lg={8}>

            {/* Hotel info */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "12px", overflow: "hidden" }}>
              {hotel?.image && (
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold mb-1">{hotel?.name ?? `Hotel #${hotelId}`}</h5>
                    <p className="text-muted small mb-0">📍 {hotel?.address ?? hotel?.city}</p>
                  </div>
                  <Badge bg="warning" text="dark">
                    {"★".repeat(hotel?.starRating ?? 0)}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Stay details */}
            <Card className="border-0 shadow-sm mb-4 p-3" style={{ borderRadius: "10px" }}>
              <h6 className="fw-bold mb-3">📅 Stay Details</h6>
              <Row className="g-3">
                <Col xs={6} sm={3}>
                  <p className="text-muted small mb-1">Check-in</p>
                  <p className="fw-semibold small mb-0">{fmt(checkIn)}</p>
                  <p className="text-muted" style={{ fontSize: "0.72rem" }}>From 3:00 PM</p>
                </Col>
                <Col xs={6} sm={3}>
                  <p className="text-muted small mb-1">Check-out</p>
                  <p className="fw-semibold small mb-0">{fmt(checkOut)}</p>
                  <p className="text-muted" style={{ fontSize: "0.72rem" }}>By 11:00 AM</p>
                </Col>
                <Col xs={6} sm={3}>
                  <p className="text-muted small mb-1">Duration</p>
                  <p className="fw-semibold small mb-0">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </Col>
                <Col xs={6} sm={3}>
                  <p className="text-muted small mb-1">Guests</p>
                  <p className="fw-semibold small mb-0">{state.guests ?? 1}</p>
                </Col>
              </Row>
            </Card>

            {/* Rooms */}
            <Card className="border-0 shadow-sm mb-4 p-3" style={{ borderRadius: "10px" }}>
              <h6 className="fw-bold mb-3">🛏️ Rooms Booked</h6>
              <Table borderless size="sm" style={{ fontSize: "0.85rem" }}>
                <thead>
                  <tr className="text-muted" style={{ fontSize: "0.75rem" }}>
                    <th className="ps-0 fw-semibold">Room Type</th>
                    <th className="fw-semibold text-center">Qty</th>
                    <th className="fw-semibold text-end pe-0">Price/Night</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.categoryId}>
                      <td className="ps-0">{r.categoryName}</td>
                      <td className="text-center">{r.quantity}</td>
                      <td className="text-end pe-0 fw-semibold">${r.basePrice * r.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total ({nights} {nights === 1 ? "night" : "nights"})</span>
                <span style={{ color: "#0f3460" }}>${totalAmount}</span>
              </div>
            </Card>

            {/* Guest info */}
            <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "10px" }}>
              <h6 className="fw-bold mb-3">👤 Guest Information</h6>
              <Row className="g-2" style={{ fontSize: "0.85rem" }}>
                <Col xs={6}>
                  <p className="text-muted small mb-1">Name</p>
                  <p className="fw-semibold mb-0">{guest?.firstName} {guest?.lastName}</p>
                </Col>
                <Col xs={6}>
                  <p className="text-muted small mb-1">Email</p>
                  <p className="fw-semibold mb-0">{guest?.email}</p>
                </Col>
                <Col xs={6}>
                  <p className="text-muted small mb-1">Phone</p>
                  <p className="fw-semibold mb-0">{guest?.phone}</p>
                </Col>
                <Col xs={6}>
                  <p className="text-muted small mb-1">Country</p>
                  <p className="fw-semibold mb-0">{guest?.country}</p>
                </Col>
                {guest?.specialRequests && (
                  <Col xs={12}>
                    <p className="text-muted small mb-1">Special Requests</p>
                    <p className="fw-semibold mb-0">{guest.specialRequests}</p>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>

          {/* ── Right: Actions ── */}
          <Col xs={12} lg={4}>
            <Card
              className="border-0 shadow"
              style={{ borderRadius: "12px", position: "sticky", top: "80px" }}
            >
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">What's next?</h6>

                <ul className="list-unstyled small text-muted mb-4">
                  <li className="mb-2">📧 Confirmation email sent to {guest?.email}</li>
                  <li className="mb-2">🪪 Bring a valid ID to check-in</li>
                  <li className="mb-2">🕒 Check-in from 3:00 PM</li>
                  <li>📞 Contact hotel for early check-in requests</li>
                </ul>

                <div className="d-grid gap-2">
                  <Button
                    as={Link}
                    to="/dashboard"
                    style={{ backgroundColor: "#e94560", border: "none" }}
                  >
                    View My Bookings
                  </Button>
                  <Button
                    as={Link}
                    to="/hotels"
                    variant="outline-secondary"
                  >
                    Browse More Hotels
                  </Button>
                  <Button
                    variant="link"
                    className="text-muted text-decoration-none small"
                    onClick={() => window.print()}
                  >
                    🖨️ Print Confirmation
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
