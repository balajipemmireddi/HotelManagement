import { useState, useContext } from "react";
import {
  Container, Row, Col, Card, Badge, Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext }       from "../context/authContext";
import BookingHistoryTable   from "../components/BookingHistoryTable";
import BookingRowSkeleton    from "../components/BookingRowSkeleton";
import CancelModal           from "../components/CancelModal";
import AppToast              from "../components/AppToast";
import { cancelBooking }     from "../services/BookingService";
import { MOCK_BOOKINGS }     from "../data/mockBookings";
import { useToast }          from "../hooks/useToast";

export default function DashBoard() {

  // Get the logged-in user's info (email, role) from AuthContext
  const { user } = useContext(AuthContext);

  // ── Bookings list ─────────────────────────────────────
  // Starts with mock data. When the backend is ready, replace MOCK_BOOKINGS
  // with an API call inside a useEffect.
  const [bookings,    setBookings]    = useState(MOCK_BOOKINGS);
  const [loadingList, setLoadingList] = useState(false); // flip to true when wiring real API

  // ── Cancel modal ──────────────────────────────────────
  // cancelTarget holds the booking the user wants to cancel (or null if modal is closed)
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling,   setCancelling]   = useState(false);

  // ── Toast notifications ───────────────────────────────
  const { toast, showToast, hideToast } = useToast();

  // ── Active filter tab ─────────────────────────────────
  const [filter, setFilter] = useState("ALL");

  const TABS = [
    { key: "ALL",       label: "All"       },
    { key: "CONFIRMED", label: "Upcoming"  },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  // Filter the bookings list based on the active tab
  let filtered = [];
  if (filter === "ALL") {
    filtered = bookings;
  } else {
    filtered = bookings.filter((b) => b.status === filter);
  }

  // ── Summary stats ─────────────────────────────────────
  // Count bookings by status for the four stat cards at the top
  const totalBookings    = bookings.length;
  const confirmedCount   = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedCount   = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalSpent       = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // ── Handle cancel confirmation ────────────────────────
  // Called when the user clicks "Yes, Cancel It" in the CancelModal.
  async function handleCancelConfirm() {
    if (!cancelTarget) return;

    setCancelling(true);

    try {
      // Call the backend to cancel the booking
      await cancelBooking(cancelTarget.id);
    } catch {
      // If the backend isn't live yet, we still update the UI optimistically
    }

    // Update the booking status in local state so the UI reflects the change
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === cancelTarget.id) {
          return { ...b, status: "CANCELLED" };
        }
        return b;
      })
    );

    showToast(`Booking ${cancelTarget.bookingReference} has been cancelled.`, "danger");
    setCancelTarget(null);
    setCancelling(false);
  }

  // Build the user's avatar initials from their email (e.g. "jo" → "JO")
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)", padding: "40px 0 32px" }}>
        <Container>
          <div className="d-flex align-items-center gap-3">
            {/* Avatar circle showing the user's initials */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
              style={{ width: "56px", height: "56px", backgroundColor: "#e94560", fontSize: "1.2rem", flexShrink: 0 }}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-white fw-bold mb-0" style={{ fontSize: "1.5rem" }}>My Dashboard</h1>
              <p className="mb-0" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-4">

        {/* ── Stats Row ── */}
        <Row className="g-3 mb-4">
          {[
            { label: "Total Bookings",  value: totalBookings,  icon: "📋", color: "#0f3460" },
            { label: "Upcoming Stays",  value: confirmedCount, icon: "✈️", color: "#28a745" },
            { label: "Completed Stays", value: completedCount, icon: "✅", color: "#6c757d" },
            { label: "Total Spent",     value: `$${totalSpent}`, icon: "💰", color: "#e94560" },
          ].map((stat) => (
            <Col xs={6} lg={3} key={stat.label}>
              <Card className="border-0 shadow-sm h-100 p-3" style={{ borderRadius: "10px" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.3rem" }}>{stat.icon}</span>
                  <span className="text-muted small">{stat.label}</span>
                </div>
                <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: stat.color }}>
                  {stat.value}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">

          {/* ── Left: Booking History ── */}
          <Col xs={12} lg={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <Card.Header className="bg-white border-0 pt-3 pb-0 px-3" style={{ borderRadius: "12px 12px 0 0" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Booking History</h5>
                  <Badge bg="light" text="dark" className="border">{bookings.length} total</Badge>
                </div>

                {/* Filter tabs — click to show only that status */}
                <div className="d-flex gap-1 flex-wrap">
                  {TABS.map((tab) => {
                    // Count how many bookings match this tab's status
                    let tabCount = 0;
                    if (tab.key === "CONFIRMED") {
                      tabCount = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").length;
                    } else if (tab.key !== "ALL") {
                      tabCount = bookings.filter((b) => b.status === tab.key).length;
                    }

                    return (
                      <Button
                        key={tab.key}
                        size="sm"
                        variant={filter === tab.key ? "dark" : "outline-secondary"}
                        className="rounded-pill"
                        style={{ fontSize: "0.78rem" }}
                        onClick={() => setFilter(tab.key)}
                      >
                        {tab.label}
                        {tab.key !== "ALL" && (
                          <Badge
                            bg={filter === tab.key ? "light" : "secondary"}
                            text={filter === tab.key ? "dark" : "white"}
                            className="ms-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {tabCount}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </Card.Header>

              <Card.Body className="p-3">
                {/* Show skeleton placeholders while loading, real table when done */}
                {loadingList ? (
                  <BookingRowSkeleton rows={4} />
                ) : (
                  <BookingHistoryTable
                    bookings={filtered}
                    onCancel={(booking) => setCancelTarget(booking)}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* ── Right: Account Info + Quick Actions ── */}
          <Col xs={12} lg={4}>

            {/* Account details card */}
            <Card className="border-0 shadow-sm mb-3 p-3" style={{ borderRadius: "12px" }}>
              <h6 className="fw-bold mb-3">👤 Account</h6>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Email</span>
                <span className="fw-semibold" style={{ wordBreak: "break-all" }}>{user?.email}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Role</span>
                <Badge bg={user?.role === "ADMIN" ? "warning" : "secondary"} text="dark">
                  {user?.role ?? "USER"}
                </Badge>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Member since</span>
                <span className="fw-semibold">2025</span>
              </div>
            </Card>

            {/* Quick action buttons */}
            <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <h6 className="fw-bold mb-3">⚡ Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button as={Link} to="/hotels" style={{ backgroundColor: "#e94560", border: "none" }} size="sm">
                  🔍 Browse Hotels
                </Button>
                <Button as={Link} to="/hotels" variant="outline-secondary" size="sm">
                  📅 New Booking
                </Button>
                {/* Only show Admin Panel button if the user has the ADMIN role */}
                {user?.role === "ADMIN" && (
                  <Button as={Link} to="/admin" variant="outline-warning" size="sm">
                    ⚙️ Admin Panel
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ── Cancel Confirmation Modal ── */}
      <CancelModal
        show={cancelTarget !== null}
        booking={cancelTarget}
        cancelling={cancelling}
        onConfirm={handleCancelConfirm}
        onClose={() => {
          // Don't allow closing the modal while the cancel request is in flight
          if (!cancelling) setCancelTarget(null);
        }}
      />

      {/* ── Toast notification (bottom-right) ── */}
      <AppToast toast={toast} onClose={hideToast} />
    </div>
  );
}
