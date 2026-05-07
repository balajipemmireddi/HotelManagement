import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import BookingWizard from "../components/BookingWizard";
import PaymentForm from "../components/PaymentForm";
import BookingSummary from "../components/BookingSummary";
import { createBooking } from "../services/BookingService";

/**
 * BookingConfirmPage — Step 2 of the booking wizard (Payment & Confirm).
 *
 * Reads bookingDraft from sessionStorage (written by BookingPage / Step 1).
 * On successful API call → navigates to /booking/success with reference number.
 */
export default function BookingConfirmPage() {
  const navigate = useNavigate();

  // ── Load draft from sessionStorage ───────────────────
  const [draft, setDraft] = useState(null);
  const [draftError, setDraftError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bookingDraft");
      if (!raw) { setDraftError(true); return; }
      setDraft(JSON.parse(raw));
    } catch {
      setDraftError(true);
    }
  }, []);

  // ── Submission state ──────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState("");

  // ── Calculate total ───────────────────────────────────
  const nights = (() => {
    if (!draft?.checkIn || !draft?.checkOut) return 1;
    const diff = new Date(draft.checkOut) - new Date(draft.checkIn);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  })();

  const totalAmount = draft
    ? draft.rooms.reduce((sum, r) => sum + r.basePrice * r.quantity, 0) * nights
    : 0;

  // ── Handle payment submission ─────────────────────────
  const handlePaymentSubmit = async (/* paymentData — not sent to backend in mock */) => {
    setSubmitting(true);
    setApiError("");

    try {
      // Build BookingRequestDTO
      const payload = {
        hotelId:  draft.hotelId,
        checkIn:  draft.checkIn,
        checkOut: draft.checkOut,
        rooms: draft.rooms.map((r) => ({
          categoryId: r.categoryId,
          quantity:   r.quantity,
        })),
      };

      const response = await createBooking(payload);

      // Clear draft — booking is complete
      sessionStorage.removeItem("bookingDraft");

      // Navigate to success page with reference
      navigate("/booking/success", {
        state: {
          bookingReference: response.bookingReference,
          totalAmount:      response.totalAmount ?? totalAmount,
          status:           response.status ?? "CONFIRMED",
          hotelId:          draft.hotelId,
          checkIn:          draft.checkIn,
          checkOut:         draft.checkOut,
          guest:            draft.guest,
          rooms:            draft.rooms,
        },
        replace: true,
      });

    } catch (err) {
      // API not yet live — simulate success with a mock reference
      if (import.meta.env.DEV) {
        const mockRef = `SE-${Date.now().toString(36).toUpperCase()}`;
        sessionStorage.removeItem("bookingDraft");
        navigate("/booking/success", {
          state: {
            bookingReference: mockRef,
            totalAmount,
            status:   "CONFIRMED",
            hotelId:  draft.hotelId,
            checkIn:  draft.checkIn,
            checkOut: draft.checkOut,
            guest:    draft.guest,
            rooms:    draft.rooms,
          },
          replace: true,
        });
      } else {
        setApiError(typeof err === "string" ? err : "Booking failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Guard: no draft ───────────────────────────────────
  if (draftError) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          <h5 className="mt-2">Session expired</h5>
          <p className="small mb-3">
            Your booking session has expired or was not found. Please start again.
          </p>
          <Button as={Link} to="/hotels" style={{ backgroundColor: "#e94560", border: "none" }}>
            Browse Hotels
          </Button>
        </Alert>
      </Container>
    );
  }

  // ── Loading draft ─────────────────────────────────────
  if (!draft) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

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
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none" style={{ color: "rgba(255,255,255,0.6)" }}>Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/hotels" className="text-decoration-none" style={{ color: "rgba(255,255,255,0.6)" }}>Hotels</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/booking" className="text-decoration-none" style={{ color: "rgba(255,255,255,0.6)" }}>Booking</Link>
              </li>
              <li className="breadcrumb-item active" style={{ color: "rgba(255,255,255,0.9)" }}>
                Payment
              </li>
            </ol>
          </nav>
          <h1 className="text-white fw-bold mb-0" style={{ fontSize: "1.6rem" }}>
            Payment Details
          </h1>
        </Container>
      </div>

      <Container className="py-4">
        {/* ── Wizard Step Indicator ── */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <BookingWizard currentStep={2} />
          </Col>
        </Row>

        {/* ── API error ── */}
        {apiError && (
          <Alert variant="danger" onClose={() => setApiError("")} dismissible className="mb-4">
            {apiError}
          </Alert>
        )}

        <Row className="g-4">
          {/* ── Left: Payment Form ── */}
          <Col xs={12} lg={7}>
            {/* Guest summary strip */}
            <div
              className="d-flex align-items-center gap-3 p-3 rounded mb-3 shadow-sm"
              style={{ backgroundColor: "#fff", border: "1px solid #e9ecef" }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "40px", height: "40px", backgroundColor: "#f0f4ff", fontSize: "1.2rem", flexShrink: 0 }}
              >
                👤
              </div>
              <div className="flex-grow-1">
                <p className="fw-semibold mb-0 small">
                  {draft.guest.firstName} {draft.guest.lastName}
                </p>
                <p className="text-muted mb-0 small">{draft.guest.email} · {draft.guest.phone}</p>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-muted text-decoration-none p-0"
                onClick={() => navigate(-1)}
              >
                Edit
              </Button>
            </div>

            <PaymentForm
              totalAmount={totalAmount}
              submitting={submitting}
              onSubmit={handlePaymentSubmit}
              onBack={() => navigate(-1)}
            />
          </Col>

          {/* ── Right: Booking Summary (sticky) ── */}
          <Col xs={12} lg={5}>
            <div style={{ position: "sticky", top: "80px" }}>
              <BookingSummary
                hotelId={draft.hotelId}
                rooms={draft.rooms}
                checkIn={draft.checkIn}
                checkOut={draft.checkOut}
                guests={draft.guests}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* ── Full-screen loading overlay during submission ── */}
      {submitting && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 9999 }}
        >
          <Spinner animation="border" variant="light" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-white mt-3 fw-semibold">Processing your booking...</p>
          <p className="text-white-50 small">Please do not close this window.</p>
        </div>
      )}
    </div>
  );
}
