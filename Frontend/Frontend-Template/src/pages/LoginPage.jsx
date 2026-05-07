import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Container, Row, Col, Card,
  Form, Button, Spinner, Alert, InputGroup,
} from "react-bootstrap";
import { loginUser }    from "../services/UserService";
import { saveAuthData } from "../utils/authUtil";
import { AuthContext }  from "../context/authContext";

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useContext(AuthContext);

  // After login, go back to the page the user tried to visit (or dashboard)
  const from = location.state?.from?.pathname || "/dashboard";

  const [credentials,   setCredentials]   = useState({ email: "", password: "" });
  const [showPassword,  setShowPassword]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [successMsg,    setSuccessMsg]    = useState("");

  const handleChange = (e) => {
    setError("");
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await loginUser(credentials);

      if (!token || token === "Fail") {
        setError("Invalid email or password. Please try again.");
        return;
      }

      saveAuthData({ token });
      login();

      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => navigate(from, { replace: true }), 1000);

    } catch (err) {
      setError(typeof err === "string" ? err : "Login failed. Please try again.");
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
              <p className="text-muted small mt-1">Sign in to your account</p>
            </div>

            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: "14px" }}>

              {/* Success alert */}
              {successMsg && (
                <Alert variant="success" className="py-2 small mb-3">
                  ✓ {successMsg}
                </Alert>
              )}

              {/* Error alert */}
              {error && (
                <Alert variant="danger" className="py-2 small mb-3" onClose={() => setError("")} dismissible>
                  {error}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </Form.Group>

                {/* Password with show/hide toggle */}
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      style={{ borderLeft: "none" }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{ backgroundColor: "#e94560", border: "none", borderRadius: "8px" }}
                >
                  {loading
                    ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Signing in...</>
                    : "Sign In"
                  }
                </Button>
              </Form>

              <hr className="my-3" />

              <p className="text-center text-muted small mb-0">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-decoration-none fw-semibold" style={{ color: "#e94560" }}>
                  Create one
                </Link>
              </p>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
}
