import { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

// List of countries shown in the dropdown
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "India", "Brazil", "UAE", "Singapore", "South Africa",
  "Italy", "Spain", "Netherlands", "Sweden", "Norway", "South Korea",
  "Mexico", "Argentina", "Turkey", "Thailand", "Indonesia", "Other",
];

// ── Plain validation functions — one per field ────────
// Each returns an error message string, or an empty string if the value is valid.

function validateFirstName(value) {
  if (value.trim().length < 2) {
    return "First name must be at least 2 characters.";
  }
  return "";
}

function validateLastName(value) {
  if (value.trim().length < 2) {
    return "Last name must be at least 2 characters.";
  }
  return "";
}

function validateEmail(value) {
  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return "Enter a valid email address.";
  }
  return "";
}

function validatePhone(value) {
  // Allows digits, spaces, dashes, parentheses, and an optional leading +
  const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
  if (!phoneRegex.test(value.trim())) {
    return "Enter a valid phone number.";
  }
  return "";
}

function validateCountry(value) {
  if (value.trim().length === 0) {
    return "Please select your country.";
  }
  return "";
}

// specialRequests is optional — always valid, no function needed

/**
 * GuestDetailsForm — Step 1 of the booking wizard.
 *
 * Props:
 *   initialValues : object  — pre-fills the form (e.g. email from AuthContext)
 *   onSubmit      : (guestData) => void  — called when the form passes validation
 */
export default function GuestDetailsForm({ initialValues = {}, onSubmit }) {

  // ── Form field values ─────────────────────────────────
  const [firstName,       setFirstName]       = useState(initialValues.firstName       || "");
  const [lastName,        setLastName]        = useState(initialValues.lastName        || "");
  const [email,           setEmail]           = useState(initialValues.email           || "");
  const [phone,           setPhone]           = useState(initialValues.phone           || "");
  const [country,         setCountry]         = useState(initialValues.country         || "");
  const [specialRequests, setSpecialRequests] = useState(initialValues.specialRequests || "");

  // ── Error messages — one per field ───────────────────
  // Empty string means no error. We only show errors after the user has touched a field.
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError,  setLastNameError]  = useState("");
  const [emailError,     setEmailError]     = useState("");
  const [phoneError,     setPhoneError]     = useState("");
  const [countryError,   setCountryError]   = useState("");

  // ── Validate all fields at once (called on form submit) ──
  // Returns true if everything is valid, false if any field has an error.
  function validateAll() {
    const e1 = validateFirstName(firstName);
    const e2 = validateLastName(lastName);
    const e3 = validateEmail(email);
    const e4 = validatePhone(phone);
    const e5 = validateCountry(country);

    // Show all errors at once so the user can see everything that needs fixing
    setFirstNameError(e1);
    setLastNameError(e2);
    setEmailError(e3);
    setPhoneError(e4);
    setCountryError(e5);

    // If all error strings are empty, the form is valid
    return e1 === "" && e2 === "" && e3 === "" && e4 === "" && e5 === "";
  }

  // ── Handle form submit ────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();

    // Run validation — if anything fails, stop here (errors are already shown)
    const isValid = validateAll();
    if (!isValid) return;

    // All fields are valid — pass the data up to the parent (BookingPage)
    onSubmit({ firstName, lastName, email, phone, country, specialRequests });
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>

      {/* ── Guest Information Card ── */}
      <Card className="border-0 shadow-sm p-3 mb-3" style={{ borderRadius: "10px" }}>
        <h6 className="fw-bold mb-3">👤 Primary Guest Information</h6>

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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setFirstNameError(validateFirstName(firstName))}
                isInvalid={firstNameError !== ""}
                isValid={firstNameError === "" && firstName !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {firstNameError}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setLastNameError(validateLastName(lastName))}
                isInvalid={lastNameError !== ""}
                isValid={lastNameError === "" && lastName !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {lastNameError}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailError(validateEmail(email))}
                isInvalid={emailError !== ""}
                isValid={emailError === "" && email !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setPhoneError(validatePhone(phone))}
                isInvalid={phoneError !== ""}
                isValid={phoneError === "" && phone !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {phoneError}
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
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onBlur={() => setCountryError(validateCountry(country))}
                isInvalid={countryError !== ""}
                isValid={countryError === "" && country !== ""}
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {countryError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

        </Row>
      </Card>

      {/* ── Special Requests Card ── */}
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
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            style={{ resize: "none" }}
          />
          <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
            Requests are not guaranteed but we will do our best to accommodate them.
          </Form.Text>
        </Form.Group>
      </Card>

      {/* ── Booking Policies Card ── */}
      <Card
        className="border-0 shadow-sm p-3 mb-4"
        style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}
      >
        <h6 className="fw-bold mb-2">📋 Booking Policies</h6>
        <ul className="list-unstyled small text-muted mb-0">
          <li className="mb-1">✓ Free cancellation up to 24 hours before check-in</li>
          <li className="mb-1">✓ No prepayment required — pay at the hotel</li>
          <li className="mb-1">✓ Valid ID required at check-in</li>
          <li>✓ Check-in from 3:00 PM · Check-out by 11:00 AM</li>
        </ul>
      </Card>

      {/* ── Submit ── */}
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
