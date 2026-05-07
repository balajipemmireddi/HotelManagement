import { Badge, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Status badge config
const STATUS_CONFIG = {
  CONFIRMED:  { bg: "success",   label: "Confirmed"  },
  COMPLETED:  { bg: "secondary", label: "Completed"  },
  CANCELLED:  { bg: "danger",    label: "Cancelled"  },
  PENDING:    { bg: "warning",   label: "Pending"    },
};

/**
 * BookingHistoryTable — renders a list of bookings in a responsive table.
 *
 * Props:
 *   bookings    : Array<BookingResponseDTO + display fields>
 *   onCancel    : (booking) => void  — called when user clicks Cancel
 */
export default function BookingHistoryTable({ bookings, onCancel }) {
  const navigate = useNavigate();

  const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const nights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <div style={{ fontSize: "3rem" }}>🏨</div>
        <h5 className="mt-3">No bookings yet</h5>
        <p className="small">Your booking history will appear here.</p>
        <Button
          size="sm"
          style={{ backgroundColor: "#e94560", border: "none" }}
          onClick={() => navigate("/hotels")}
        >
          Browse Hotels
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table (hidden on xs) ── */}
      <div className="d-none d-md-block">
        <Table hover responsive className="mb-0" style={{ fontSize: "0.875rem" }}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr className="text-muted" style={{ fontSize: "0.75rem" }}>
              <th className="fw-semibold py-3">Hotel</th>
              <th className="fw-semibold py-3">Reference</th>
              <th className="fw-semibold py-3">Dates</th>
              <th className="fw-semibold py-3 text-center">Nights</th>
              <th className="fw-semibold py-3 text-end">Total</th>
              <th className="fw-semibold py-3 text-center">Status</th>
              <th className="fw-semibold py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const statusCfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
              const canCancel = b.status === "CONFIRMED" || b.status === "PENDING";
              const n = nights(b.checkIn, b.checkOut);

              return (
                <tr key={b.id} style={{ verticalAlign: "middle" }}>
                  {/* Hotel */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={b.image}
                        alt={b.hotelName}
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          flexShrink: 0,
                        }}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div>
                        <p className="fw-semibold mb-0" style={{ fontSize: "0.875rem" }}>
                          {b.hotelName}
                        </p>
                        <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                          📍 {b.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Reference */}
                  <td>
                    <span className="fw-semibold" style={{ color: "#0f3460", fontSize: "0.8rem" }}>
                      {b.bookingReference}
                    </span>
                    <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>
                      Booked {fmt(b.bookedOn)}
                    </p>
                  </td>

                  {/* Dates */}
                  <td>
                    <p className="mb-0">{fmt(b.checkIn)}</p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                      → {fmt(b.checkOut)}
                    </p>
                  </td>

                  {/* Nights */}
                  <td className="text-center">{n}</td>

                  {/* Total */}
                  <td className="text-end fw-semibold">${b.totalAmount}</td>

                  {/* Status */}
                  <td className="text-center">
                    <Badge bg={statusCfg.bg} style={{ fontSize: "0.72rem" }}>
                      {statusCfg.label}
                    </Badge>
                  </td>

                  {/* Action */}
                  <td className="text-center">
                    {canCancel ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onCancel(b)}
                        style={{ fontSize: "0.75rem" }}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* ── Mobile cards (visible on xs/sm only) ── */}
      <div className="d-md-none">
        {bookings.map((b) => {
          const statusCfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
          const canCancel = b.status === "CONFIRMED" || b.status === "PENDING";
          const n = nights(b.checkIn, b.checkOut);

          return (
            <div
              key={b.id}
              className="p-3 mb-3 rounded shadow-sm bg-white"
              style={{ border: "1px solid #e9ecef" }}
            >
              {/* Hotel row */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <img
                  src={b.image}
                  alt={b.hotelName}
                  style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="flex-grow-1">
                  <p className="fw-semibold mb-0 small">{b.hotelName}</p>
                  <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>📍 {b.city}</p>
                </div>
                <Badge bg={statusCfg.bg} style={{ fontSize: "0.7rem" }}>
                  {statusCfg.label}
                </Badge>
              </div>

              {/* Details */}
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Ref: <strong style={{ color: "#0f3460" }}>{b.bookingReference}</strong></span>
                <span>{n} {n === 1 ? "night" : "nights"}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span>{fmt(b.checkIn)} → {fmt(b.checkOut)}</span>
                <span className="fw-semibold">${b.totalAmount}</span>
              </div>

              {/* Cancel button */}
              {canCancel && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="w-100"
                  onClick={() => onCancel(b)}
                  style={{ fontSize: "0.8rem" }}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
