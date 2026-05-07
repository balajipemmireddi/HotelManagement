import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

// Pick the best matching icon/features for a category name
function getRoomMeta(categoryName) {
  const lower = categoryName.toLowerCase();
  for (const [key, meta] of Object.entries(ROOM_ICONS)) {
    if (lower.includes(key)) return meta;
  }
  return { icon: "🛏️", features: ["Comfortable Bed", "En-suite Bathroom", "30m²"] };
}

/**
 * RoomCategoryList — renders room categories matching RoomCategoryResponseDTO.
 *
 * Props:
 *   rooms    : Array<{ id, categoryName, basePrice }>
 *   hotelId  : number
 *   checkIn  : string (ISO date, optional — passed through to booking)
 *   checkOut : string (ISO date, optional)
 *   guests   : string (optional)
 */
export default function RoomCategoryList({ rooms, hotelId, checkIn, checkOut, guests }) {
  const navigate = useNavigate();

  const handleSelect = (room) => {
    const params = new URLSearchParams({
      hotelId,
      categoryId: room.id,
      categoryName: room.categoryName,
      basePrice: room.basePrice,
      ...(checkIn  && { checkIn  }),
      ...(checkOut && { checkOut }),
      ...(guests   && { guests   }),
    });
    navigate(`/booking?${params.toString()}`);
  };

  if (!rooms || rooms.length === 0) {
    return (
      <p className="text-muted small">No room categories available for this hotel.</p>
    );
  }

  return (
    <Row className="g-3">
      {rooms.map((room) => {
        const meta = getRoomMeta(room.categoryName);
        return (
          <Col xs={12} key={room.id}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "10px" }}>
              <Card.Body className="p-3">
                <Row className="align-items-center g-2">
                  {/* Icon + name */}
                  <Col xs={12} sm={5}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded"
                        style={{
                          width: "52px",
                          height: "52px",
                          backgroundColor: "#f0f4ff",
                          fontSize: "1.5rem",
                          flexShrink: 0,
                        }}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <p className="fw-semibold mb-0" style={{ fontSize: "0.95rem" }}>
                          {room.categoryName}
                        </p>
                        <div className="d-flex flex-wrap gap-1 mt-1">
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

                  {/* Included perks */}
                  <Col xs={12} sm={4} className="text-sm-center">
                    <div className="d-flex flex-wrap gap-2 justify-content-sm-center">
                      {["Free WiFi", "Daily Housekeeping", "Free Cancellation"].map((perk) => (
                        <span key={perk} className="text-muted" style={{ fontSize: "0.75rem" }}>
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </Col>

                  {/* Price + CTA */}
                  <Col xs={12} sm={3} className="text-sm-end">
                    <div className="d-flex flex-column align-items-sm-end gap-1">
                      <div>
                        <span className="fw-bold fs-5" style={{ color: "#0f3460" }}>
                          ${room.basePrice}
                        </span>
                        <span className="text-muted small"> /night</span>
                      </div>
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#e94560", border: "none", minWidth: "110px" }}
                        onClick={() => handleSelect(room)}
                      >
                        Select Room
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
