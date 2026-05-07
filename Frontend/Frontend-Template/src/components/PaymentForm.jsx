import { useState } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";

// ── Validators ────────────────────────────────────────
const luhnCheck = (num) => {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const VALIDATORS = {
  cardHolder: (v) =>
    v.trim().length >= 3 ? null : "Enter the cardholder name as it appears on the card.",
  cardNumber: (v) => {
    const digits = v.replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits)) return "Card number must be 16 digits.";
    if (!luhnCheck(digits)) return "Invalid card number.";
    return null;
  },
  expiry: (v) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v)) return "Use MM/YY format.";
    const [mm, yy] = v.split("/");
    const exp = new Date(2000 + Number(yy), Number(mm) - 1, 1);
    if (exp < new Date()) return "Card has expired.";
    return null;
  },
  cvv: (v) => /^\d{3,4}$/.test(v) ? null : "CVV must be 3 or 4 digits.",
};

// ── Card brand detection ──────────────────────────────
function detectBrand(number) {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n))          return { label: "Visa",       icon: "💳" };
  if (/^5[1-5]/.test(n))     return { label: "Mastercard", icon: "💳" };
  if (/^3[47]/.test(n))      return { label: "Amex",       icon: "💳" };
  if (/^6(?:011|5)/.test(n)) return { label: "Discover",   icon: "💳" };
  return null;
}

// ── Format helpers ────────────────────────────────────
const fmtCard   = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/**
 * PaymentForm — Step 2 mock payment fields.
 *
 * Props:
 *   totalAmount : number
 *   submitting  : boolean  — shows loading overlay when true
 *   onSubmit    : (paymentData) => void
 *   onBack      : () => void
 */
export default function PaymentForm({ totalAmount, submitting, onSubmit, onBack }) {
  const [values, setValues] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry:     "",
    cvv:        "",
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const brand = detectBrand(values.cardNumber);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = fmtCard(value);
    if (name === "expiry")     value = fmtExpiry(value);
    if (name === "cvv")        value = value.replace(/\D/g, "").slice(0, 4);

    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name]?.(value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: VALIDATORS[name]?.(value) }));
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;
    Object.keys(VALIDATORS).forEach((field) => {
      const err = VALIDATORS[field](values[field] ?? "");
      if (err) { newErrors[field] = err; valid = false; }
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(VALIDATORS).map((k) => [k, true])));
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  const fieldError = (n) => touched[n] && errors[n];
  const isValid    = (n) => touched[n] && !errors[n] && values[n];

  return (
    <Form noValidate onSubmit={handleSubmit}>

      {/* ── Mock notice ── */}
      <Card
        className="border-0 mb-3 p-3"
        style={{ backgroundColor: "#fff8e1", borderLeft: "4px solid #f5a623", borderRadius: "8px" }}
      >
        <p className="small mb-0" style={{ color: "#856404" }}>
          🔒 <strong>Test Mode</strong> — No real payment is processed.
          Use any 16-digit number (e.g. <code>4111 1111 1111 1111</code>), any future expiry, and any 3-digit CVV.
        </p>
      </Card>

      {/* ── Card fields ── */}
      <Card className="border-0 shadow-sm p-3 mb-3" style={{ borderRadius: "10px" }}>
        <h6 className="fw-bold mb-3">💳 Card Details</h6>

        <Row className="g-3">
          {/* Cardholder */}
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Cardholder Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="cardHolder"
                placeholder="John Doe"
                value={values.cardHolder}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("cardHolder")}
                isValid={!!isValid("cardHolder")}
                disabled={submitting}
              />
              <Form.Control.Feedback type="invalid">{errors.cardHolder}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Card number */}
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Card Number <span className="text-danger">*</span>
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={values.cardNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!fieldError("cardNumber")}
                  isValid={!!isValid("cardNumber")}
                  inputMode="numeric"
                  disabled={submitting}
                  style={{ paddingRight: brand ? "80px" : undefined }}
                />
                {brand && (
                  <span
                    className="position-absolute small text-muted"
                    style={{ right: "12px", top: "50%", transform: "translateY(-50%)" }}
                  >
                    {brand.icon} {brand.label}
                  </span>
                )}
              </div>
              <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Expiry */}
          <Col xs={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                Expiry <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="expiry"
                placeholder="MM/YY"
                value={values.expiry}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("expiry")}
                isValid={!!isValid("expiry")}
                inputMode="numeric"
                disabled={submitting}
              />
              <Form.Control.Feedback type="invalid">{errors.expiry}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* CVV */}
          <Col xs={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">
                CVV <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="cvv"
                placeholder="123"
                value={values.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!fieldError("cvv")}
                isValid={!!isValid("cvv")}
                inputMode="numeric"
                type="password"
                disabled={submitting}
              />
              <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* ── Order total ── */}
      <Card
        className="border-0 shadow-sm p-3 mb-4"
        style={{ borderRadius: "10px", backgroundColor: "#f0f4ff" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Amount to charge</span>
          <span className="fw-bold fs-4" style={{ color: "#0f3460" }}>
            ${totalAmount}
          </span>
        </div>
        <p className="text-muted small mb-0 mt-1">
          Taxes and fees included · Charged in USD
        </p>
      </Card>

      {/* ── Actions ── */}
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="outline-secondary"
          onClick={onBack}
          disabled={submitting}
        >
          ← Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          style={{ backgroundColor: "#e94560", border: "none", minWidth: "200px" }}
        >
          {submitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Processing...
            </>
          ) : (
            `Confirm & Pay $${totalAmount}`
          )}
        </Button>
      </div>
    </Form>
  );
}
