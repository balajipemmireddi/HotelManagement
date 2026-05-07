import { Card, Placeholder } from "react-bootstrap";

/**
 * HotelCardSkeleton — Bootstrap Placeholder skeleton matching HotelCard layout.
 * Shown while hotel data is loading from the API.
 */
export default function HotelCardSkeleton() {
  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
      {/* Image placeholder */}
      <div
        style={{
          height: "200px",
          backgroundColor: "#e9ecef",
          animation: "skeleton-shimmer 1.5s infinite linear",
        }}
      />

      <Card.Body className="p-3">
        {/* Hotel name */}
        <Placeholder as="p" animation="glow" className="mb-1">
          <Placeholder xs={8} style={{ borderRadius: "4px" }} />
        </Placeholder>

        {/* City */}
        <Placeholder as="p" animation="glow" className="mb-1">
          <Placeholder xs={5} size="sm" style={{ borderRadius: "4px" }} />
        </Placeholder>

        {/* Stars */}
        <Placeholder as="p" animation="glow" className="mb-2">
          <Placeholder xs={4} size="sm" style={{ borderRadius: "4px" }} />
        </Placeholder>

        {/* Description lines */}
        <Placeholder as="p" animation="glow" className="mb-1">
          <Placeholder xs={12} size="sm" style={{ borderRadius: "4px" }} />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="mb-3">
          <Placeholder xs={9} size="sm" style={{ borderRadius: "4px" }} />
        </Placeholder>

        {/* Price + button */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Placeholder animation="glow">
            <Placeholder xs={4} style={{ borderRadius: "4px" }} />
          </Placeholder>
          <Placeholder.Button variant="secondary" xs={4} style={{ borderRadius: "6px" }} />
        </div>
      </Card.Body>
    </Card>
  );
}
