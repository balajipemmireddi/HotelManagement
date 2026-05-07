import { Card, Badge, Table } from "react-bootstrap";
import { MOCK_HOTELS } from "../data/mockHotels";

/**
 * BookingSummary — read-only summary card shown alongside the booking form.
 *
 * Props:
 *   hotelId  : number
 *   rooms    : Array<{ categoryId, categoryName, basePrice, quantity }>
 *   checkIn  : string (ISO date)
 *   checkOut : string (ISO date)
 *   guests   : string | number
 */
export default function BookingSummary({ hotelId, rooms, checkIn, checkOut, guests }) {
  const hotel = MOCK_HOTELS.find((h) => h.id === Number(hotelId));

  // Calculate nights between dates
  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  })();

  const pricePerNight = rooms.reduce(
    (sum, r) => sum + r.basePrice * r.quantity,
    0
  );
  const totalPrice = pricePerNight * nights;

  // Format date for display
  const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month:   "short",
      day:     "numeric",
      year:    "numeric",
    });
  };

  const stars = hotel
    ? Array.from({ length: 5 }, (_, i) =>
        i < hotel.starRating ? "★" : "☆"
      ).join("")
    : "";

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
      {/* Hotel image header */}
      {hotel?.image && (
        <div style={{ height: "140px", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
          <img
            src={hotel.image}
            alt={hotel.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <Card.Body className="p-3">
        {/* Hotel info */}
        <div className="mb-3">
          <h6 className="fw-bold mb-0">{hotel?.name ?? `Hotel #${hotelId}`}</h6>
          <p className="text-muted small mb-1">📍 {hotel?.city}</p>
          {hotel && (
            <span style={{ color: "#f5a623", fontSize: "0.85rem" }}>{stars}</span>
          )}
        </div>

        <hr className="my-2" />

        {/* Dates + guests */}
        <div className="mb-3">
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Check-in</span>
            <span className="fw-semibold">{fmt(checkIn)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Check-out</span>
            <span className="fw-semibold">{fmt(checkOut)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Duration</span>
            <span className="fw-semibold">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>
          <div className="d-flex justify-content-between small">
            <span className="text-muted">Guests</span>
            <span className="fw-semibold">{guests || 1}</span>
          </div>
        </div>

        <hr className="my-2" />

        {/* Room breakdown */}
        <p className="small fw-semibold text-uppercase text-muted mb-2"
           style={{ letterSpacing: "0.06em", fontSize: "0.72rem" }}>
          Rooms Selected
        </p>
        <Table borderless size="sm" className="mb-0" style={{ fontSize: "0.82rem" }}>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.categoryId}>
                <td className="ps-0 text-muted">
                  {r.quantity}× {r.categoryName}
                </td>
                <td className="pe-0 text-end fw-semibold">
                  ${r.basePrice * r.quantity}
                  <span className="text-muted fw-normal">/night</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <hr className="my-2" />

        {/* Price breakdown */}
        <div className="d-flex justify-content-between small mb-1">
          <span className="text-muted">
            ${pricePerNight} × {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span>${totalPrice}</span>
        </div>
        <div className="d-flex justify-content-between small text-muted mb-2">
          <span>Taxes &amp; fees</span>
          <span>Calculated at checkout</span>
        </div>

        {/* Total */}
        <div
          className="d-flex justify-content-between align-items-center p-2 rounded"
          style={{ backgroundColor: "#f0f4ff" }}
        >
          <span className="fw-bold">Total</span>
          <div className="text-end">
            <span className="fw-bold fs-5" style={{ color: "#0f3460" }}>
              ${totalPrice}
            </span>
            <Badge bg="success" className="ms-2 small">
              Free cancellation
            </Badge>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
