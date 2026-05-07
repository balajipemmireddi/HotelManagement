import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function AppNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-5">
          🏨 StayEase
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* Left nav links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/hotels">
              Browse Hotels
            </Nav.Link>
          </Nav>

          {/* Right auth links */}
          <Nav className="align-items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/signup"
                  variant="outline-light"
                  size="sm"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {role === "ADMIN" && (
                  <Nav.Link as={Link} to="/admin" className="text-warning">
                    Admin Panel
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/dashboard">
                  My Bookings
                </Nav.Link>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
