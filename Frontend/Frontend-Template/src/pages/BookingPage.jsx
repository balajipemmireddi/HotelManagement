import { useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { AuthContext } from "../context/authContext";
import BookingWizard from "../components/BookingWizard";
import GuestDetailsForm from "../components/GuestDetailsForm";
import BookingSummary from "../components/BookingSummary";

/**
 * BookingPage — Step 1 of the multi-step booking flow.
 *
 * Reads from URL params (set by RoomSelector):
 *   hotelId  : number
 *   rooms    : JSON string → Array<{ categoryId, categoryName, basePrice, quantity }>
 *   checkIn  : ISO date string
 *   checkOut : ISO date string
 *   guests   : number string
 *
 * On valid form submission:
 *   - Saves guest details + booking context to sessionStorage
 *   - Navigates to /booking/confirm (Phase 7)
 */
export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ── Parse URL params ──────────────────────────────────
  const hotelId  = searchParams.get("hotelId");
  const checkIn  = searchParams.get("checkIn")  || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests   = searchParams.get("guests")   || "1";

  let rooms = [];
  try {
    const raw = searchParams.get("rooms");
    if (raw) rooms = JSON.parse(raw);
  } catch {
    rooms = [];
  }

  // ── Guard: missing required params ───────────────────
  if (!hotelId || rooms.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <h5 className="mt-2">No booking details found</h5>
          <p className="small mb-3">
            It looks like you navigated here directly. Please select rooms from a hotel first.
          </p>
          <Button
            as={Link}
            to="/hotels"
            style={{ backgroundColor: "#e94560", border: "none" }}
          >
            Browse Hotels
          </Button>
        </Alert>
      </Container>
    );
  }

  // ── Pre-fill form from AuthContext if logged in ───────
  const prefill = user?.email ? { email: user.email } : {};

  // ── Handle Step 1 completion ──────────────────────────
  const handleGuestSubmit = (guestData) => {
    // Persist everything to sessionStorage for Phase 7
    const bookingDraft = {
      hotelId:  Number(hotelId),
      rooms,
      checkIn,
      checkOut,
      guests:   Number(guests),
      guest:    guestData,
    };
    sessionStorage.setItem("bookingDraft", JSON.stringify(bookingDraft));
    navigate("/booking/confirm");
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
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/hotels" className="text-decoration-none" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Hotels
                </Link>
              </li>
              <li className="breadcrumb-item active" style={{ color: "rgba(255,255,255,0.9)" }}>
                Booking
              </li>
            </ol>
          </nav>
          <h1 className="text-white fw-bold mb-0" style={{ fontSize: "1.6rem" }}>
            Complete Your Booking
          </h1>
        </Container>
      </div>

      <Container className="py-4">
        {/* ── Wizard Step Indicator ── */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <BookingWizard currentStep={1} />
          </Col>
        </Row>

        <Row className="g-4">
          {/* ── Left: Guest Details Form ── */}
          <Col xs={12} lg={7}>
            <GuestDetailsForm
              initialValues={prefill}
              onSubmit={handleGuestSubmit}
            />
          </Col>

          {/* ── Right: Booking Summary (sticky) ── */}
          <Col xs={12} lg={5}>
            <div style={{ position: "sticky", top: "var(--sticky-top)" }}>
              <BookingSummary
                hotelId={hotelId}
                rooms={rooms}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
              />

              {/* Back link */}
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="text-muted text-decoration-none small"
                  onClick={() => navigate(-1)}
                >
                  ← Back to hotel
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
