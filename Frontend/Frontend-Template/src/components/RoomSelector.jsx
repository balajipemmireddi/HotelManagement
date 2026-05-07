import { useState } from "react";
import { Card, Badge, Button, Row, Col, Spinner, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MOCK_AVAILABILITY } from "../data/mockAvailability";

// Icon and feature hints per category name keyword — purely cosmetic
const ROOM_ICONS = {
  standard:  { icon: "🛏️",  features: ["1 Queen Bed", "City View", "24m²"] },
  classic:   { icon: "🛏️",  features: ["1 Queen Bed", "City View", "22m²"] },
  superior:  { icon: "🛏️",  features: ["1 King Bed",  "Garden View", "28m²"] },
  deluxe:    { icon: "🏨",  features: ["1 King Bed",  "Premium View", "35m²"] },
  suite:     { icon: "✨",  features: ["King Bed + Lounge", "Panoramic View", "55m²"] },
  penthouse: { icon: "🌟",  features: ["King Bed + Living Room", "360° View", "120m²"] },
  villa:     { icon: "🏡",  features: ["Private Pool", "Beach Access", "200m²"] },
  royal:     { icon: "👑",  features: ["Butler Service", "Private Terrace", "180m²"] },
  ocean:     { icon: "🌊",  features: ["Ocean View", "King Bed", "60m²"] },
  view:      { icon: "🌅",  features: ["Scenic View", "King Bed", "40m²"] },
};

function getRoomMeta(categoryName) {
  const lower = categoryName.toLowerCase();
  for (const [key, meta] of Object.entries(ROOM_ICONS)) {
    if (lower.includes(key)) return meta;
  }
  return { icon: "🛏️", features: ["Comfortable Bed", "En-suite Bathroom", "30m²"] };
}

/**
 * RoomSelector — Phase 5 interactive room selection with quantity, availability, and total price.
 *
 * Props:
 *   rooms          : Array<{ id, categoryName, basePrice }>
 *   hotelId        : number
 *   checkIn        : string (ISO date, optional)
 *   checkOut       : string (ISO date, optional)
 *   guests         : string (optional)
 *   onTotalChange  : (totalPrice, totalRooms) => void  (optional)
 */
export default function RoomSelector({ rooms, hotelId, checkIn, checkOut, guests, onTotalChange }) {
  const navigate = useNavigate();

  // Quantity state: { [categoryId]: number }
  const [quantities, setQuantities] = useState({});

  // Loading state for "Check Availability" button
  const [checking, setChecking] = useState(false);

  // Increment/decrement quantity
  const changeQty = (categoryId, delta) => {
    setQuantities((prev) => {
      const current = prev[categoryId] || 0;
      const next = Math.max(0, current + delta);
      const avail = MOCK_AVAILABILITY[categoryId]?.availableCount || 0;
      const updated = { ...prev, [categoryId]: Math.min(next, avail) };

      // Notify parent of new totals
      if (onTotalChange) {
        const newTotal = rooms.reduce((sum, r) => sum + (updated[r.id] || 0) * r.basePrice, 0);
        const newCount = Object.values(updated).reduce((s, q) => s + q, 0);
        onTotalChange(newTotal, newCount);
      }

      return updated;
    });
  };

  // Calculate total price
  const totalPrice = rooms.reduce((sum, room) => {
    const qty = quantities[room.id] || 0;
    return sum + qty * room.basePrice;
  }, 0);

  const totalRooms = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  // Simulate availability check (will be real API call in Phase 10)
  const handleCheckAvailability = () => {
    if (totalRooms === 0) return;

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      // Navigate to booking with selected rooms
      const selectedRooms = rooms
        .filter((r) => quantities[r.id] > 0)
        .map((r) => ({
          categoryId: r.id,
          categoryName: r.categoryName,
          basePrice: r.basePrice,
          quantity: quantities[r.id],
        }));

      const params = new URLSearchParams({
        hotelId,
        rooms: JSON.stringify(selectedRooms),
        ...(checkIn  && { checkIn  }),
        ...(checkOut && { checkOut }),
        ...(guests   && { guests   }),
      });
      navigate(`/booking?${params.toString()}`);
    }, 1200);
  };

  if (!rooms || rooms.length === 0) {
    return (
      <p className="text-muted small">No room categories available for this hotel.</p>
    );
  }

  return (
    <>
      <Row className="g-3 mb-4">
        {rooms.map((room) => {
          const meta = getRoomMeta(room.categoryName);
          const avail = MOCK_AVAILABILITY[room.id];
          const availableCount = avail?.availableCount ?? 0;
          const isSoldOut = availableCount === 0;
          const qty = quantities[room.id] || 0;

          return (
            <Col xs={12} key={room.id}>
              <Card
                className="border-0 shadow-sm"
                style={{
                  borderRadius: "10px",
                  opacity: isSoldOut ? 0.6 : 1,
                }}
              >
                <Card.Body className="p-3">
                  <Row className="align-items-center g-2">
                    {/* Icon + name + availability badge */}
                    <Col xs={12} sm={5}>
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: "52px",
                            height: "52px",
                            backgroundColor: isSoldOut ? "#f5f5f5" : "#f0f4ff",
                            fontSize: "1.5rem",
                            flexShrink: 0,
                          }}
                        >
                          {meta.icon}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <p className="fw-semibold mb-0" style={{ fontSize: "0.95rem" }}>
                              {room.categoryName}
                            </p>
                            {isSoldOut ? (
                              <Badge bg="danger" className="small">
                                Sold Out
                              </Badge>
                            ) : (
                              <Badge bg="success" className="small">
                                Available ({availableCount})
                              </Badge>
                            )}
                          </div>
                          <div className="d-flex flex-wrap gap-1">
                            {meta.features.map((f) => (
                              <Badge
                                key={f}
                                bg="light"
                                text="secondary"
                                className="fw-normal"
                                style={{ fontSize: "0.7rem", border: "1px solid #dee2e6" }}
                              >
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Quantity selector */}
                    <Col xs={12} sm={3} className="text-sm-center">
                      {isSoldOut ? (
                        <span className="text-muted small">Not available</span>
                      ) : (
                        <div className="d-flex align-items-center justify-content-sm-center gap-2">
                          <span className="text-muted small me-1">Rooms:</span>
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-secondary"
                              onClick={() => changeQty(room.id, -1)}
                              disabled={qty === 0}
                              style={{ width: "32px" }}
                            >
                              −
                            </Button>
                            <Button
                              variant="outline-secondary"
                              disabled
                              style={{ width: "40px", backgroundColor: "#fff", color: "#000" }}
                            >
                              {qty}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() => changeQty(room.id, 1)}
                              disabled={qty >= availableCount}
                              style={{ width: "32px" }}
                            >
                              +
                            </Button>
                          </ButtonGroup>
                        </div>
                      )}
                    </Col>

                    {/* Price */}
                    <Col xs={12} sm={4} className="text-sm-end">
                      <div className="d-flex flex-column align-items-sm-end gap-1">
                        <div>
                          <span className="fw-bold fs-5" style={{ color: "#0f3460" }}>
                            ${room.basePrice}
                          </span>
                          <span className="text-muted small"> /night</span>
                        </div>
                        {qty > 0 && (
                          <div className="text-muted small">
                            Subtotal: <strong>${qty * room.basePrice}</strong>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* ── Total Price + Check Availability CTA ── */}
      <Card
        className="border-0 shadow-sm p-3"
        style={{
          borderRadius: "10px",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
        }}
      >
        <Row className="align-items-center g-2">
          <Col xs={12} md={6}>
            <div>
              <p className="text-muted small mb-1">
                {totalRooms === 0
                  ? "Select rooms to see total price"
                  : `${totalRooms} ${totalRooms === 1 ? "room" : "rooms"} selected`}
              </p>
              {totalRooms > 0 && (
                <div className="d-flex align-items-baseline gap-2">
                  <span className="fw-bold" style={{ fontSize: "1.75rem", color: "#0f3460" }}>
                    ${totalPrice}
                  </span>
                  <span className="text-muted small">per night</span>
                </div>
              )}
            </div>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <Button
              size="lg"
              disabled={totalRooms === 0 || checking}
              style={{
                backgroundColor: totalRooms === 0 ? "#ccc" : "#e94560",
                border: "none",
                minWidth: "200px",
              }}
              onClick={handleCheckAvailability}
            >
              {checking ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Checking...
                </>
              ) : (
                "Check Availability"
              )}
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
}
