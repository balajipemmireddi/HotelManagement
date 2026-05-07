import { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

// Validation rules
const VALIDATORS = {
  firstName: (v) => v.trim().length >= 2 ? null : "First name must be at least 2 characters.",
  lastName:  (v) => v.trim().length >= 2 ? null : "Last name must be at least 2 characters.",
  email:     (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a valid email address.",
  phone:     (v) => /^\+?[\d\s\-()]{7,15}$/.test(v.trim()) ? null : "Enter a valid phone number.",
  country:   (v) => v.trim().length > 0 ? null : "Please select your country.",
  specialRequests: () => null, // optional — always valid
};

const INITIAL = {
  firstName:       "",
  lastName:        "",
  email:           "",
  phone:           "",
  country:         "",
  specialRequests: "",
};

// Common countries list
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "India", "Brazil", "UAE", "Singapore", "South Africa",
  "Italy", "Spain", "Netherlands", "Sweden", "Norway", "South Korea",
  "Mexico", "Argentina", "Turkey", "Thailand", "Indonesia", "Other",
];

/**
 * GuestDetailsForm — Step 1 of the booking wizard.
 *
 * Props:
 *   initialValues : object (pre-fill from AuthContext user if available)
 *   onSubmit      : (guestData) => void
 */
export default function GuestDetailsForm({ initialValues = {}, onSubmit }) {
  const [values, setValues] = useState({ ...INITIAL, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change if field was already touched
    if (touched[name]) {
      const err = VALIDATORS[name]?.(value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = VALIDATORS[name]?.(value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;
    Object.keys(VALIDATORS).forEach((field) => {
      const err = VALIDATORS[field](values[field] ?? "");
      if (err) {
        newErrors[field] = err;
        valid = false;
      }
    });
    setErrors(newErrors);
    // Mark all fields as touched so errors show
    setTouched(Object.fromEntries(Object.keys(VALIDATORS).map((k) => [k, true])));
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  // Helper: show error only if field was touched
  const fieldError = (name) => touched[name] && errors[name];
  const isValid    = (name) => touched[name] && !errors[name] && values[name];

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Card className="border-0 shadow-sm p-3 mb-3" style={{ borderRadius: "10px" }}>
        <h6 className="fw-bold mb-3">
          👤 Primary Guest Information
        </h6>

        <Row className="g-3">
          {/* First Name */}
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="firstName"
                placeholder="John"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("firstName")}
                isValid={!!isValid("firstName")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Last Name */}
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="lastName"
                placeholder="Doe"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("lastName")}
                isValid={!!isValid("lastName")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Email */}
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Email Address <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="john@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("email")}
                isValid={!!isValid("email")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                Booking confirmation will be sent here.
              </Form.Text>
            </Form.Group>
          </Col>

          {/* Phone */}
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Phone Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="+1 555 000 0000"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("phone")}
                isValid={!!isValid("phone")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Country */}
          <Col xs={12} sm={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Country <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("country")}
                isValid={!!isValid("country")}
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.country}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* Special Requests */}
      <Card className="border-0 shadow-sm p-3 mb-4" style={{ borderRadius: "10px" }}>
        <h6 className="fw-bold mb-3">
          📝 Special Requests <span className="text-muted fw-normal">(optional)</span>
        </h6>
        <Form.Group>
          <Form.Control
            as="textarea"
            name="specialRequests"
            rows={3}
            placeholder="Early check-in, high floor, extra pillows, dietary requirements..."
            value={values.specialRequests}
            onChange={handleChange}
            style={{ resize: "none" }}
          />
          <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
            Requests are not guaranteed but we will do our best to accommodate them.
          </Form.Text>
        </Form.Group>
      </Card>

      {/* Policies */}
      <Card className="border-0 shadow-sm p-3 mb-4"
            style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}>
        <h6 className="fw-bold mb-2">📋 Booking Policies</h6>
        <ul className="list-unstyled small text-muted mb-0">
          <li className="mb-1">✓ Free cancellation up to 24 hours before check-in</li>
          <li className="mb-1">✓ No prepayment required — pay at the hotel</li>
          <li className="mb-1">✓ Valid ID required at check-in</li>
          <li>✓ Check-in from 3:00 PM · Check-out by 11:00 AM</li>
        </ul>
      </Card>

      {/* Submit */}
      <div className="d-flex justify-content-between align-items-center">
        <p className="text-muted small mb-0">
          <span className="text-danger">*</span> Required fields
        </p>
        <Button
          type="submit"
          size="lg"
          style={{ backgroundColor: "#e94560", border: "none", minWidth: "200px" }}
        >
          Continue to Payment →
        </Button>
      </div>
    </Form>
  );
}
