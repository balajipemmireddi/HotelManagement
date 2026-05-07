import { Form, InputGroup, Button, Row, Col } from "react-bootstrap";

/**
 * SearchBar — Location, Dates, Guests inputs.
 *
 * Props:
 *   values   : { location, checkIn, checkOut, guests }
 *   onChange : (field, value) => void
 *   onSearch : () => void   — called when user clicks Search
 */
export default function SearchBar({ values, onChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2 align-items-end">
        {/* Location */}
        <Col xs={12} md={4}>
          <Form.Label className="small fw-semibold text-muted mb-1">
            📍 Location
          </Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="City or hotel name..."
              value={values.location}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Check-in */}
        <Col xs={6} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">
            📅 Check-in
          </Form.Label>
          <Form.Control
            type="date"
            value={values.checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange("checkIn", e.target.value)}
          />
        </Col>

        {/* Check-out */}
        <Col xs={6} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">
            📅 Check-out
          </Form.Label>
          <Form.Control
            type="date"
            value={values.checkOut}
            min={values.checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange("checkOut", e.target.value)}
          />
        </Col>

        {/* Guests */}
        <Col xs={6} md={2}>
          <Form.Label className="small fw-semibold text-muted mb-1">
            👤 Guests
          </Form.Label>
          <Form.Select
            value={values.guests}
            onChange={(e) => onChange("guests", e.target.value)}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* Search button */}
        <Col xs={6} md={2}>
          <Button
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#e94560", border: "none" }}
          >
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
