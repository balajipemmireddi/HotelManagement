import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <Container>
        <Row className="mb-3">
          {/* Brand */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="fw-bold">🏨 StayEase</h5>
            <p className="text-secondary small mb-0">
              Find and book the perfect hotel for every journey.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="fw-semibold text-uppercase text-secondary mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
              Quick Links
            </h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/" className="text-secondary text-decoration-none small footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-secondary text-decoration-none small footer-link">
                  Browse Hotels
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-secondary text-decoration-none small footer-link">
                  My Bookings
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={4}>
            <h6 className="fw-semibold text-uppercase text-secondary mb-2" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
              Contact
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="text-secondary small">📧 support@stayease.com</li>
              <li className="text-secondary small">📞 +1 (800) 123-4567</li>
              <li className="text-secondary small">🕐 24/7 Customer Support</li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary mb-3" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="text-secondary small mb-1 mb-md-0">
            © {new Date().getFullYear()} StayEase. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <span className="text-secondary small">Privacy Policy</span>
            <span className="text-secondary small">Terms of Service</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
