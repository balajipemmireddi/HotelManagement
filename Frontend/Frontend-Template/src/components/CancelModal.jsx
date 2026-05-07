import { Modal, Button, Spinner } from "react-bootstrap";

/**
 * CancelModal — confirmation dialog before cancelling a booking.
 *
 * Props:
 *   show      : boolean
 *   booking   : { bookingReference, hotelName, checkIn, checkOut } | null
 *   cancelling: boolean  — shows spinner while API call is in flight
 *   onConfirm : () => void
 *   onClose   : () => void
 */
export default function CancelModal({ show, booking, cancelling, onConfirm, onClose }) {
  const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>
          Cancel Booking
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {/* Warning icon */}
        <div className="text-center mb-3">
          <div style={{ fontSize: "2.5rem" }}>⚠️</div>
        </div>

        <p className="text-center mb-3">
          Are you sure you want to cancel this booking?
        </p>

        {booking && (
          <div
            className="p-3 rounded mb-3"
            style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
          >
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Hotel</span>
              <span className="fw-semibold">{booking.hotelName}</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Reference</span>
              <span className="fw-semibold" style={{ color: "#0f3460" }}>
                {booking.bookingReference}
              </span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Check-in</span>
              <span className="fw-semibold">{fmt(booking.checkIn)}</span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Check-out</span>
              <span className="fw-semibold">{fmt(booking.checkOut)}</span>
            </div>
          </div>
        )}

        <p className="text-muted small text-center mb-0">
          This action cannot be undone. The booking will be marked as{" "}
          <strong>CANCELLED</strong> and rooms will be released.
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={cancelling}
        >
          Keep Booking
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={cancelling}
          style={{ minWidth: "140px" }}
        >
          {cancelling ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Cancelling...
            </>
          ) : (
            "Yes, Cancel It"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
