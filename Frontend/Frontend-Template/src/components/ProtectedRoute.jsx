import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

/**
 * ProtectedRoute — guards a route behind authentication and optional role check.
 *
 * Props:
 *   children     : ReactNode
 *   allowedRoles : string[]  (optional) — if provided, user role must be in this list
 *
 * Behaviour:
 *   - Not authenticated → redirect to /login, preserving the attempted URL in state
 *   - Authenticated but wrong role → show Access Denied page
 *   - Authenticated + correct role → render children
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const location = useLocation();

  // Not logged in — send to login, remember where they were trying to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but insufficient role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 120px)", backgroundColor: "#f8f9fa" }}
      >
        <Container className="text-center py-5">
          <div style={{ fontSize: "3.5rem" }}>🚫</div>
          <h3 className="fw-bold mt-3 mb-2">Access Denied</h3>
          <p className="text-muted mb-4">
            You don&apos;t have permission to view this page.
            <br />
            This area requires the <strong>{allowedRoles.join(" or ")}</strong> role.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button
              as={Link}
              to="/dashboard"
              style={{ backgroundColor: "#e94560", border: "none" }}
            >
              Go to Dashboard
            </Button>
            <Button as={Link} to="/" variant="outline-secondary">
              Home
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;


/**
 * GuestRoute — redirects already-authenticated users away from login/signup.
 *
 * Props:
 *   children : ReactNode
 *
 * Usage: wrap <LoginPage> and <SignupPage> routes with this.
 */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};
