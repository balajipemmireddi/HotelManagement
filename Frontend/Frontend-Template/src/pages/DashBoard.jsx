import { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import BookingHistoryTable from "../components/BookingHistoryTable";
import CancelModal from "../components/CancelModal";
import { cancelBooking } from "../services/BookingService";
import { MOCK_BOOKINGS } from "../data/mockBookings";

// Derive summary stats from a bookings list
function getStats(bookings) {
  return {
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    spent:     bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };
}

export default function DashBoard() {
  const { user } = useContext(AuthContext);

  // ── Booking state — starts from mock, will be API in Phase 10 ──
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  // ── Cancel modal state ────────────────────────────────
  const [cancelTarget,  setCancelTarget]  = useState(null);  // booking to cancel
  const [cancelling,    setCancelling]    = useState(false);

  // ── Toast notifications ───────────────────────────────
  const [toast, setToast] = useState({ show: false, msg: "", variant: "success" });
  const showToast = (msg, variant = "success") =>
    setToast({ show: true, msg, variant });

  // ── Active filter tab ─────────────────────────────────
  const [filter, setFilter] = useState("ALL");

  const TABS = [
    { key: "ALL",       label: "All"       },
    { key: "CONFIRMED", label: "Upcoming"  },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  const filtered = filter === "ALL"
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const stats = getStats(bookings);

  // ── Handle cancel confirmation ────────────────────────
  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);

    try {
      // Call API (will succeed once backend is live; falls back gracefully in dev)
      await cancelBooking(cancelTarget.id);
    } catch {
      // Backend not live yet — update local state optimistically
    }

    // Update local state regardless
    setBookings((prev) =>
      prev.map((b) =>
        b.id === cancelTarget.id ? { ...b, status: "CANCELLED" } : b
      )
    );

    showToast(
      `Booking ${cancelTarget.bookingReference} has been cancelled.`,
      "danger"
    );
    setCancelTarget(null);
    setCancelling(false);
  };

  // ── User initials for avatar ──────────────────────────
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          padding: "40px 0 32px",
        }}
      >
        <Container>
          <div className="d-flex align-items-center gap-3">
            {/* Avatar */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#e94560",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-white fw-bold mb-0" style={{ fontSize: "1.5rem" }}>
                My Dashboard
              </h1>
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
            { label: "Total Bookings",  value: stats.total,     icon: "📋", color: "#0f3460" },
            { label: "Upcoming Stays",  value: stats.confirmed, icon: "✈️", color: "#28a745" },
            { label: "Completed Stays", value: stats.completed, icon: "✅", color: "#6c757d" },
            { label: "Total Spent",     value: `$${stats.spent}`, icon: "💰", color: "#e94560" },
          ].map((s) => (
            <Col xs={6} lg={3} key={s.label}>
              <Card className="border-0 shadow-sm h-100 p-3" style={{ borderRadius: "10px" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                  <span className="text-muted small">{s.label}</span>
                </div>
                <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: s.color }}>
                  {s.value}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">

          {/* ── Left: Booking History ── */}
          <Col xs={12} lg={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <Card.Header
                className="bg-white border-0 pt-3 pb-0 px-3"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Booking History</h5>
                  <Badge bg="light" text="dark" className="border">
                    {bookings.length} total
                  </Badge>
                </div>

                {/* Filter tabs */}
                <div className="d-flex gap-1 flex-wrap">
                  {TABS.map((tab) => (
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
                          {bookings.filter((b) =>
                            tab.key === "CONFIRMED"
                              ? b.status === "CONFIRMED" || b.status === "PENDING"
                              : b.status === tab.key
                          ).length}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </Card.Header>

              <Card.Body className="p-3">
                <BookingHistoryTable
                  bookings={filtered}
                  onCancel={(b) => setCancelTarget(b)}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* ── Right: Account Info + Quick Actions ── */}
          <Col xs={12} lg={4}>

            {/* Account card */}
            <Card className="border-0 shadow-sm mb-3 p-3" style={{ borderRadius: "12px" }}>
              <h6 className="fw-bold mb-3">👤 Account</h6>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Email</span>
                <span className="fw-semibold" style={{ wordBreak: "break-all" }}>
                  {user?.email}
                </span>
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

            {/* Quick actions */}
            <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <h6 className="fw-bold mb-3">⚡ Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to="/hotels"
                  style={{ backgroundColor: "#e94560", border: "none" }}
                  size="sm"
                >
                  🔍 Browse Hotels
                </Button>
                <Button
                  as={Link}
                  to="/hotels"
                  variant="outline-secondary"
                  size="sm"
                >
                  📅 New Booking
                </Button>
                {user?.role === "ADMIN" && (
                  <Button
                    as={Link}
                    to="/admin"
                    variant="outline-warning"
                    size="sm"
                  >
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
        show={!!cancelTarget}
        booking={cancelTarget}
        cancelling={cancelling}
        onConfirm={handleCancelConfirm}
        onClose={() => !cancelling && setCancelTarget(null)}
      />

      {/* ── Toast Notifications ── */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={4000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body className="text-white fw-semibold">
            {toast.msg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
