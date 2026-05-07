import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Row, Col, Card,
  Form, Button, Spinner, Alert, InputGroup,
} from "react-bootstrap";
import { registerUser } from "../services/UserService";

// Simple client-side validators
const validate = ({ firstName, email, password }) => {
  const errs = {};
  if (!firstName.trim() || firstName.trim().length < 2)
    errs.firstName = "First name must be at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errs.email = "Enter a valid email address.";
  if (password.length < 6)
    errs.password = "Password must be at least 6 characters.";
  return errs;
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [loading,      setLoading]      = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [successMsg,   setSuccessMsg]   = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Client-side validation
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      setSuccessMsg("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setApiError(typeof err === "string" ? err : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: "calc(100vh - 120px)", backgroundColor: "#f8f9fa" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={9} md={7} lg={5} xl={4}>

            {/* Brand */}
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <span style={{ fontSize: "2rem" }}>🏨</span>
                <h5 className="fw-bold mt-1 mb-0" style={{ color: "#0f3460" }}>StayEase</h5>
              </Link>
              <p className="text-muted small mt-1">Create your free account</p>
            </div>

            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: "14px" }}>

              {successMsg && (
                <Alert variant="success" className="py-2 small mb-3">✓ {successMsg}</Alert>
              )}
              {apiError && (
                <Alert variant="danger" className="py-2 small mb-3" onClose={() => setApiError("")} dismissible>
                  {apiError}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                {/* Name row */}
                <Row className="g-2 mb-3">
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">
                        First Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="firstName"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange}
                        isInvalid={!!fieldErrors.firstName}
                        disabled={loading}
                        autoComplete="given-name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="family-name"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.email}
                    disabled={loading}
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!fieldErrors.password}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      style={{ borderLeft: "none" }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{ backgroundColor: "#e94560", border: "none", borderRadius: "8px" }}
                >
                  {loading
                    ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Creating account...</>
                    : "Create Account"
                  }
                </Button>
              </Form>

              <hr className="my-3" />

              <p className="text-center text-muted small mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: "#e94560" }}>
                  Sign in
                </Link>
              </p>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
}
