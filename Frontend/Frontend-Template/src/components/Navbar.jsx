import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function AppNavbar() {
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();          // from AuthProvider
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>

        {/* BRAND */}
        <Navbar.Brand as={Link} to="/">
          APP NAME
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">

            {/* NOT LOGGED IN */}
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>

                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            ) : (
              /* LOGGED IN */
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            )}

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}