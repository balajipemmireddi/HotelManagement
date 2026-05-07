import { Placeholder } from "react-bootstrap";

/**
 * BookingRowSkeleton — Bootstrap Placeholder skeleton for a booking history row.
 * Shown while booking data is loading from the API.
 *
 * Props:
 *   rows : number (default 3)
 */
export default function BookingRowSkeleton({ rows = 3 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-3 mb-2 rounded bg-white"
          style={{ border: "1px solid #e9ecef" }}
        >
          <div className="d-flex align-items-center gap-3">
            {/* Thumbnail */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "6px",
                backgroundColor: "#e9ecef",
                flexShrink: 0,
              }}
            />
            <div className="flex-grow-1">
              <Placeholder as="p" animation="glow" className="mb-1">
                <Placeholder xs={6} style={{ borderRadius: "4px" }} />
              </Placeholder>
              <Placeholder as="p" animation="glow" className="mb-0">
                <Placeholder xs={4} size="sm" style={{ borderRadius: "4px" }} />
              </Placeholder>
            </div>
            <div className="text-end">
              <Placeholder as="p" animation="glow" className="mb-1">
                <Placeholder xs={8} size="sm" style={{ borderRadius: "4px" }} />
              </Placeholder>
              <Placeholder animation="glow">
                <Placeholder xs={6} size="sm" style={{ borderRadius: "10px" }} />
              </Placeholder>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
